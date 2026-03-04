# frozen_string_literal: true

require_relative "../../../test_helper"

class ImplementPlanTest < Minitest::Test
  include TestFactories

  def setup
    @issue_number = 42
    @adw_id = "abc12345"
    @logger = build_logger
    @tracker = build_tracker
    @plan_path = ".issues/42/plan.md"

    Adw::Tracker.stubs(:update)
  end

  def test_transitions_to_implementing_and_succeeds
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "done", success: true))

    result = Adw::Actors::ImplementPlan.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      plan_path: @plan_path,
      tracker: @tracker
    )

    assert result.success?
  end

  def test_fails_and_transitions_to_error_when_agent_fails
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "impl error", success: false))

    result = Adw::Actors::ImplementPlan.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      plan_path: @plan_path,
      tracker: @tracker
    )

    refute result.success?
    assert_match(/Implementation failed/, result.error)
  end
end
