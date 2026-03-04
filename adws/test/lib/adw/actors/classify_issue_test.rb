# frozen_string_literal: true

require_relative "../../../test_helper"

class ClassifyIssueTest < Minitest::Test
  include TestFactories

  def setup
    @issue_number = 42
    @adw_id = "abc12345"
    @logger = build_logger
    @issue = build_issue(number: @issue_number)
    @tracker = build_tracker

    Adw::Tracker.stubs(:update)
  end

  def test_returns_feature_command_on_success
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "/feature", success: true))

    result = Adw::Actors::ClassifyIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      issue: @issue,
      tracker: @tracker
    )

    assert result.success?
    assert_equal "/feature", result.issue_command
    assert_equal "/feature", result.tracker[:classification]
  end

  def test_fails_when_agent_fails
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "error", success: false))

    result = Adw::Actors::ClassifyIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      issue: @issue,
      tracker: @tracker
    )

    refute result.success?
    assert_match(/Issue classification failed/, result.error)
  end

  def test_fails_when_agent_returns_none
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "none", success: true))

    result = Adw::Actors::ClassifyIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      issue: @issue,
      tracker: @tracker
    )

    refute result.success?
    assert_match(/Invalid classification/, result.error)
  end

  def test_fails_when_agent_returns_unrecognized_command
    Adw::Agent.stubs(:execute_template).returns(build_agent_response(output: "/unknown", success: true))

    result = Adw::Actors::ClassifyIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger,
      issue: @issue,
      tracker: @tracker
    )

    refute result.success?
    assert_match(/Invalid classification/, result.error)
  end
end
