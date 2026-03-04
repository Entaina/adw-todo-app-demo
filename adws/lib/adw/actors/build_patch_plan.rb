# frozen_string_literal: true

module Adw
  module Actors
    class BuildPatchPlan < Actor
      include Adw::Actors::PipelineInputs

      input :comment_body
      input :tracker             # main tracker
      output :tracker            # main tracker (updated with patch info)
      output :patch_tracker      # new patch-specific tracker
      output :patch_file         # path to the patch plan file

      def call
        patch_adw_id = Adw::Utils.make_adw_id
        patch_file_path = ".issues/#{issue_number}/patch-#{issue_number}-#{patch_adw_id}.md"

        new_patch_tracker = {
          adw_id: patch_adw_id,
          status: "patching",
          patches: []
        }

        Adw::Tracker.update(tracker, issue_number, "patching", logger)

        original_plan = Adw::PipelineHelpers.plan_path_for(issue_number)
        plan_exists = File.exist?(original_plan)

        args = [comment_body, patch_file_path]
        args << original_plan if plan_exists

        request = Adw::AgentTemplateRequest.new(
          agent_name: "patch_planner",
          slash_command: "/adw:patch",
          args: args,
          issue_number: issue_number,
          adw_id: patch_adw_id,
          model: "opus"
        )

        response = Adw::Agent.execute_template(request)

        unless response.success
          Adw::Tracker.update_patch(new_patch_tracker, issue_number, "error", logger)
          Adw::Tracker.update(tracker, issue_number, "done", logger)
          fail!(error: "Patch plan creation failed: #{response.output}")
        end

        Adw::Tracker.add_patch(tracker, patch_file_path, nil, nil, patch_adw_id, logger)
        Adw::Tracker.save(issue_number, tracker)

        self.patch_tracker = new_patch_tracker
        self.patch_file = patch_file_path
        logger.info("Patch plan created: #{patch_file_path}")
      end
    end
  end
end
