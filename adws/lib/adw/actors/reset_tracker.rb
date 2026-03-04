# frozen_string_literal: true

module Adw
  module Actors
    class ResetTracker < Actor
      include Adw::Actors::PipelineInputs

      input :tracker
      output :tracker

      def call
        Adw::Tracker.update(tracker, issue_number, "done", logger)
        Adw::GitHub.transition_label(issue_number, "adw/done", "adw/error")
        logger.info("Main tracker reset to: done")
      end
    end
  end
end
