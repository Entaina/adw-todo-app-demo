# frozen_string_literal: true

require_relative "../../../test_helper"

class FetchIssueTest < Minitest::Test
  include TestFactories

  def setup
    @issue_number = 42
    @adw_id = "abc12345"
    @logger = build_logger
    @issue = build_issue(number: @issue_number)

    Adw::GitHub.stubs(:repo_url).returns("https://github.com/org/repo")
    Adw::GitHub.stubs(:extract_repo_path).with("https://github.com/org/repo").returns("org/repo")
  end

  def test_returns_issue_on_success
    Adw::GitHub.stubs(:fetch_issue).with(@issue_number, "org/repo").returns(@issue)

    result = Adw::Actors::FetchIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger
    )

    assert result.success?
    assert_equal @issue, result.issue
  end

  def test_fails_when_issue_is_nil
    Adw::GitHub.stubs(:fetch_issue).with(@issue_number, "org/repo").returns(nil)

    result = Adw::Actors::FetchIssue.result(
      issue_number: @issue_number,
      adw_id: @adw_id,
      logger: @logger
    )

    refute result.success?
    assert_match(/Could not fetch issue #42/, result.error)
  end
end
