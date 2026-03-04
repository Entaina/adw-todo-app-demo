# frozen_string_literal: true

require "open3"

module Adw
  module Workflows
    # Patch workflow for applying human feedback to completed issues.
    # Implements a custom call (not a play chain) due to dual-tracker complexity:
    # - tracker: the main issue tracker (always present, persisted in tracker.yaml)
    # - patch_tracker: a per-patch tracker (persisted in patch-tracker-{adw_id}.yaml)
    class Patch < Actor
      include Adw::PipelineHelpers

      MAX_REVIEW_FIX_ATTEMPTS = 2

      input :issue_number
      input :adw_id
      input :logger
      input :comment_body

      output :comment_classification

      def call
        # 1. Load main tracker
        tracker = Adw::Tracker.load(issue_number)
        fail!(error: "No tracker found for issue ##{issue_number}") unless tracker
        tracker[:adw_id] = adw_id

        # 2. Fetch issue
        repo_path = Adw::GitHub.extract_repo_path(Adw::GitHub.repo_url)
        issue = Adw::GitHub.fetch_issue(issue_number, repo_path)
        fail!(error: "Could not fetch issue ##{issue_number}") unless issue

        # 3. Checkout existing branch
        branch_name = tracker[:branch_name]
        fail!(error: "No branch_name in tracker for ##{issue_number}") unless branch_name
        checkout_result = Adw::Actors::CheckoutBranch.result(
          issue_number: issue_number, adw_id: adw_id, logger: logger, tracker: tracker
        )
        fail!(error: checkout_result.error) unless checkout_result.success?

        # 4. Classify comment
        classify_result = Adw::Actors::ClassifyComment.result(
          issue_number: issue_number, adw_id: adw_id, logger: logger, comment_body: comment_body
        )
        classification = classify_result.success? ? classify_result.comment_classification : nil
        self.comment_classification = classification

        unless classification == "patch"
          logger.info("Comment is not a patch (#{classification.inspect}), skipping")
          Adw::GitHub.create_issue_comment(issue_number,
            format_issue_message(adw_id, "patch_ops",
              "Comentario analizado: no requiere cambios de codigo."))
          return
        end

        # 5. Initialize patch tracker
        patch_adw_id = Adw::Utils.make_adw_id
        patch_logger = Adw::Utils.setup_logger(issue_number, patch_adw_id, "adw_patch")
        patch_tracker = {
          adw_id: patch_adw_id,
          status: nil,
          trigger_comment: comment_body,
          patch_file: nil,
          phase_comments: {}
        }

        # Transition main tracker → patching
        Adw::Tracker.update(tracker, issue_number, "patching", logger)
        Adw::Tracker.update_patch(patch_tracker, issue_number, "patching", patch_logger)

        # 6. Build patch plan
        patch_file = ".issues/#{issue_number}/patch-#{issue_number}-#{patch_adw_id}.md"
        original_plan = Adw::PipelineHelpers.plan_path_for(issue_number)
        args = [comment_body, patch_file]
        args << original_plan if File.exist?(original_plan)

        patch_req = Adw::AgentTemplateRequest.new(
          agent_name: "patch_planner",
          slash_command: "/adw:patch",
          args: args,
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "opus"
        )
        patch_resp = Adw::Agent.execute_template(patch_req)
        unless patch_resp.success
          Adw::Tracker.update_patch(patch_tracker, issue_number, "error", patch_logger)
          Adw::Tracker.update(tracker, issue_number, "done", logger)
          fail!(error: "Patch plan failed: #{patch_resp.output}")
        end

        patch_tracker[:patch_file] = patch_file
        plan_comment_id = post_plan_comment(issue_number, patch_adw_id, "patch_planner", patch_file, "Patch Plan", patch_logger)
        Adw::Tracker.set_phase_comment(patch_tracker, "plan", plan_comment_id)
        Adw::Tracker.add_patch(tracker, patch_file, plan_comment_id, patch_tracker[:comment_id], patch_adw_id, patch_logger)
        Adw::Tracker.save(issue_number, tracker)
        Adw::Tracker.save_patch(issue_number, patch_adw_id, patch_tracker)

        # 7. Implement patch
        Adw::Tracker.update_patch(patch_tracker, issue_number, "implementing", patch_logger)
        impl_req = Adw::AgentTemplateRequest.new(
          agent_name: "patch_implementor",
          slash_command: "/implement",
          args: [patch_file],
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "sonnet"
        )
        impl_resp = Adw::Agent.execute_template(impl_req)
        unless impl_resp.success
          Adw::Tracker.update_patch(patch_tracker, issue_number, "error", patch_logger)
          Adw::Tracker.update(tracker, issue_number, "done", logger)
          fail!(error: "Patch implementation failed: #{impl_resp.output}")
        end

        # 8. Run tests with resolution
        Adw::Tracker.update_patch(patch_tracker, issue_number, "testing", patch_logger)
        test_actor_result = Adw::Actors::TestWithResolution.result(
          issue_number: issue_number, adw_id: patch_adw_id, logger: patch_logger,
          tracker: patch_tracker,
          test_agent_name: "patch_test_runner",
          resolver_prefix: "patch_test_resolver",
          ops_agent_name: "patch_ops"
        )
        results = test_actor_result.test_results
        passed_count = test_actor_result.passed_count
        failed_count = test_actor_result.failed_count

        # Publish test results to patch_tracker
        parts = failed_count > 0 ? ["❌ **#{passed_count} passed** | **#{failed_count} failed**", ""] : ["✅ **#{passed_count} passed**", ""]
        results.each do |r|
          emoji = r.passed ? "✅" : "❌"
          line = "- #{emoji} #{r.test_name}"
          line += " — `#{r.error[0..100]}`" if !r.passed && r.error
          parts << line
        end
        test_comment_id = Adw::GitHub.create_issue_comment(issue_number,
          format_issue_message(patch_adw_id, "patch_test_summary", parts.join("\n")))
        Adw::Tracker.set_phase_comment(patch_tracker, "test", test_comment_id)
        Adw::Tracker.save_patch(issue_number, patch_adw_id, patch_tracker)

        if failed_count > 0
          Adw::Tracker.update_patch(patch_tracker, issue_number, "error", patch_logger)
          Adw::Tracker.update(tracker, issue_number, "done", logger)
          fail!(error: "#{failed_count} tests failed after patch")
        end

        # 9. Review code
        Adw::Tracker.update_patch(patch_tracker, issue_number, "reviewing", patch_logger)
        review_result = run_patch_review(issue, patch_tracker, patch_adw_id, patch_logger)

        if review_result[:overall_severity] == "critical" && review_result[:action_required] == "fix_and_rerun"
          Adw::Tracker.update_patch(patch_tracker, issue_number, "error", patch_logger)
          Adw::Tracker.update(tracker, issue_number, "done", logger)
          fail!(error: "Critical review issues unresolvable: #{review_result[:summary]}")
        end

        # 10. Visual review (non-blocking)
        Adw::Tracker.update_patch(patch_tracker, issue_number, "reviewing_issue", patch_logger)
        run_patch_issue_review(issue, patch_tracker, patch_adw_id, patch_logger)

        # 11. Documentation (non-blocking)
        Adw::Tracker.update_patch(patch_tracker, issue_number, "documenting", patch_logger)
        run_patch_docs(patch_tracker, patch_adw_id, patch_logger)

        # 12. Commit changes
        Adw::Tracker.update_patch(patch_tracker, issue_number, "committing", patch_logger)
        git_out, _, git_st = Open3.capture3("git", "status", "--porcelain")
        unless git_st.success? && git_out.strip.empty?
          commit_req = Adw::AgentTemplateRequest.new(
            agent_name: "patch_committer",
            slash_command: "/git:commit",
            args: ["-m", "\"patch: apply human feedback for ##{issue_number}\""],
            issue_number: issue_number,
            adw_id: patch_adw_id,
            model: "sonnet"
          )
          commit_resp = Adw::Agent.execute_template(commit_req)
          unless commit_resp.success
            Adw::Tracker.update_patch(patch_tracker, issue_number, "error", patch_logger)
            Adw::Tracker.update(tracker, issue_number, "done", logger)
            fail!(error: "Commit failed: #{commit_resp.output}")
          end
        end

        # 13. Push branch
        _, push_stderr, push_st = Open3.capture3("git", "push", "origin", branch_name)
        patch_logger.warn("Push failed (non-blocking): #{push_stderr.strip}") unless push_st.success?

        # 14. Done
        Adw::Tracker.update_patch(patch_tracker, issue_number, "done", patch_logger)
        Adw::Tracker.update(tracker, issue_number, "done", logger)
        patch_logger.info("Patch workflow completed for issue ##{issue_number}")
      end

      private

      def run_patch_review(issue, patch_tracker, patch_adw_id, logger)
        plan_path = Adw::PipelineHelpers.plan_path_for(issue_number)
        agent_name = "patch_code_reviewer"

        req = Adw::AgentTemplateRequest.new(
          agent_name: agent_name,
          slash_command: "/adw:review:tech",
          args: [issue.to_json, plan_path],
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "sonnet"
        )
        resp = Adw::Agent.execute_template(req)
        unless resp.success
          logger.error("Patch review failed: #{resp.output}")
          return { overall_severity: "error", action_required: "none", summary: resp.output, checks: [], fix_suggestions: [] }
        end

        result = Adw::PipelineHelpers.parse_review_results(resp.output, logger)
        comment = Adw::PipelineHelpers.format_review_comment(result)
        comment_id = Adw::GitHub.create_issue_comment(issue_number,
          format_issue_message(patch_adw_id, agent_name, comment))
        Adw::Tracker.set_phase_comment(patch_tracker, "review_tech", comment_id)
        Adw::Tracker.save_patch(issue_number, patch_adw_id, patch_tracker)

        result = run_patch_review_fixes(result, issue, patch_tracker, patch_adw_id, logger) if result[:action_required] == "fix_and_rerun"
        result
      end

      def run_patch_review_fixes(result, issue, patch_tracker, patch_adw_id, logger)
        attempt = 0
        plan_path = Adw::PipelineHelpers.plan_path_for(issue_number)

        while attempt < MAX_REVIEW_FIX_ATTEMPTS && result[:action_required] == "fix_and_rerun"
          attempt += 1
          fix_payload = JSON.generate({
            fix_suggestions: result[:fix_suggestions],
            failed_checks: result[:checks]&.select { |c| c["result"] == "FAIL" }
          })

          fix_req = Adw::AgentTemplateRequest.new(
            agent_name: "patch_review_resolver_iter#{attempt}",
            slash_command: "/adw:resolve_review_issue",
            args: [fix_payload],
            issue_number: issue_number,
            adw_id: patch_adw_id,
            model: "sonnet"
          )
          fix_resp = Adw::Agent.execute_template(fix_req)
          break unless fix_resp.success

          recheck_req = Adw::AgentTemplateRequest.new(
            agent_name: "patch_code_reviewer_recheck_#{attempt}",
            slash_command: "/adw:review:tech",
            args: [issue.to_json, plan_path],
            issue_number: issue_number,
            adw_id: patch_adw_id,
            model: "sonnet"
          )
          recheck_resp = Adw::Agent.execute_template(recheck_req)
          break unless recheck_resp.success

          result = Adw::PipelineHelpers.parse_review_results(recheck_resp.output, logger)
          comment = Adw::PipelineHelpers.format_review_comment(result)
          Adw::GitHub.create_issue_comment(issue_number,
            format_issue_message(patch_adw_id, "patch_code_reviewer",
              "Post-fix review (attempt #{attempt}):\n#{comment}"))
        end
        result
      end

      def run_patch_issue_review(issue, patch_tracker, patch_adw_id, logger)
        plan_path = Adw::PipelineHelpers.plan_path_for(issue_number)
        agent_name = "patch_issue_reviewer"

        req = Adw::AgentTemplateRequest.new(
          agent_name: agent_name,
          slash_command: "/adw:review:issue",
          args: [issue.to_json, plan_path],
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "sonnet"
        )
        resp = Adw::Agent.execute_template(req)
        unless resp.success
          logger.warn("Visual review failed (non-blocking): #{resp.output}")
          return
        end

        result = Adw::PipelineHelpers.parse_issue_review_results(resp.output, logger)
        if result[:success] && result[:screenshots]&.any?
          begin
            result[:screenshots] = Adw::R2.upload_evidence(patch_adw_id, result[:screenshots], logger)
            Adw::PipelineHelpers.link_screenshot_urls(result[:screenshots], result[:review_issues])
          rescue => e
            logger.warn("R2 upload failed (non-blocking): #{e.message}")
          end
        end

        evidence = Adw::PipelineHelpers.format_evidence_comment(result)
        comment_id = Adw::GitHub.create_issue_comment(issue_number,
          format_issue_message(patch_adw_id, agent_name, evidence))
        Adw::Tracker.set_phase_comment(patch_tracker, "review_issue", comment_id)
        Adw::Tracker.save_patch(issue_number, patch_adw_id, patch_tracker)
      rescue => e
        logger.warn("Patch visual review failed (non-blocking): #{e.message}")
      end

      def run_patch_docs(patch_tracker, patch_adw_id, logger)
        plan_path = Adw::PipelineHelpers.plan_path_for(issue_number)
        req = Adw::AgentTemplateRequest.new(
          agent_name: "patch_documentation_generator",
          slash_command: "/adw:document",
          args: [patch_adw_id, plan_path],
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "sonnet"
        )
        resp = Adw::Agent.execute_template(req)
        logger.warn("Patch docs failed (non-blocking): #{resp.output}") unless resp.success
      rescue => e
        logger.warn("Patch docs failed (non-blocking): #{e.message}")
      end
    end
  end
end
