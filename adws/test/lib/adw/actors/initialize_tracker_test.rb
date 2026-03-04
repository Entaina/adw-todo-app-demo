# frozen_string_literal: true

require_relative "../../../test_helper"

class InitializeTrackerTest < Minitest::Test
  include TestFactories

  def setup
    @issue_number = 42
    @adw_id = "abc12345"
    @logger = build_logger
  end

  def test_merges_adw_id_into_loaded_tracker
    Adw::Tracker.stubs(:load).with(@issue_number).returns({ status: "done" })

    result = Adw::Actors::InitializeTracker.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger
    )

    assert result.success?
    assert_equal "done", result.tracker[:status]
    assert_equal @adw_id, result.tracker[:adw_id]
  end

  def test_creates_empty_tracker_when_load_returns_nil
    Adw::Tracker.stubs(:load).with(@issue_number).returns(nil)

    result = Adw::Actors::InitializeTracker.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger
    )

    assert result.success?
    assert_equal({ adw_id: @adw_id }, result.tracker)
  end
end
