# frozen_string_literal: true

module Adw
  module Actors
    class ClassifyComment < Actor
      include Adw::Actors::PipelineInputs

      input :comment_body
      output :comment_classification   # "patch", "none", or nil on agent error

      def call
        request = Adw::AgentTemplateRequest.new(
          agent_name: "comment_classifier",
          slash_command: "/adw:classify_comment",
          args: [comment_body],
          issue_number: issue_number,
          adw_id: adw_id,
          model: "sonnet"
        )

        response = Adw::Agent.execute_template(request)

        unless response.success
          logger.warn("Comment classification failed: #{response.output}")
          self.comment_classification = nil
          return
        end

        self.comment_classification = response.output.strip
        logger.info("Comment classified as: #{comment_classification}")
      end
    end
  end
end
