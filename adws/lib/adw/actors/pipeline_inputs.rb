# frozen_string_literal: true

module Adw
  module Actors
    # Shared input declarations for all ADW pipeline actors.
    # Include this module to get :issue_number, :adw_id, and :logger inputs.
    module PipelineInputs
      def self.included(base)
        base.input :issue_number
        base.input :adw_id
        base.input :logger
      end
    end
  end
end
