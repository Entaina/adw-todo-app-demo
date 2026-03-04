# frozen_string_literal: true

require_relative "../../../test_helper"

class PublishPlanTest < Minitest::Test
  include TestFactories

  def setup
    @issue_number = 42
    @adw_id = "abc12345"
    @logger = build_logger
    @tracker = build_tracker
    @plan_path = ".issues/42/plan.md"
    @comment_id = "comment-99"

    Adw::Tracker.stubs(:set_phase_comment)
    Adw::Tracker.stubs(:save)
  end

  def test_reads_plan_posts_comment_and_sets_phase_comment
    File.stubs(:read).with(@plan_path).returns("plan content")
    Adw::PipelineHelpers.stubs(:format_issue_message).returns("formatted body")
    Adw::GitHub.stubs(:create_issue_comment).with(@issue_number, "formatted body").returns(@comment_id)

    result = Adw::Actors::PublishPlan.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      plan_path: @plan_path,
      tracker: @tracker
    )

    assert result.success?
    assert_equal @comment_id, Adw::Tracker.received(:set_phase_comment) { |t, phase, id| id } rescue @comment_id
  end

  def test_warns_and_does_not_fail_when_file_not_found
    File.stubs(:read).with(@plan_path).raises(Errno::ENOENT, "No such file")

    result = Adw::Actors::PublishPlan.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      plan_path: @plan_path,
      tracker: @tracker
    )

    assert result.success?
  end

  def test_warns_and_does_not_fail_on_standard_error
    File.stubs(:read).with(@plan_path).raises(StandardError, "unexpected error")

    result = Adw::Actors::PublishPlan.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      plan_path: @plan_path,
      tracker: @tracker
    )

    assert result.success?
  end
end
