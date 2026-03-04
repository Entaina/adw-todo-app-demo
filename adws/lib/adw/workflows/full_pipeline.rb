# frozen_string_literal: true

module Adw
  module Workflows
    class FullPipeline < Actor
      input :issue_number
      input :adw_id
      input :logger

      play Adw::Workflows::PlanBuild,
           Adw::Actors::TestWithResolution,
           Adw::Actors::PublishTestResults,
           Adw::Actors::ReviewCode,
           Adw::Actors::ReviewIssue,
           Adw::Actors::GenerateDocs,
           Adw::Actors::CommitChanges,
           Adw::Actors::CreatePullRequest,
           Adw::Actors::MarkDone
    end
  end
end
