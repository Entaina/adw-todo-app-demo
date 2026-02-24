# frozen_string_literal: true

require "open3"
require "json"

module Adw
  module GitHub
    class << self
      def github_env
        github_pat = ENV["GITHUB_PAT"]
        return nil unless github_pat

        {
          "GH_TOKEN" => github_pat,
          "PATH" => ENV.fetch("PATH", "")
        }
      end

      def repo_url
        stdout, stderr, status = Open3.capture3("git", "remote", "get-url", "origin")
        unless status.success?
          raise "No git remote 'origin' found. Please ensure you're in a git repository with a remote. #{stderr}"
        end

        stdout.strip
      end

      def extract_repo_path(url)
        url.sub("https://github.com/", "").sub(/\.git\z/, "")
      end

      def fetch_issue(issue_number, repo_path)
        cmd = [
          "gh", "issue", "view", issue_number.to_s,
          "-R", repo_path,
          "--json", "number,title,body,state,author,assignees,labels,milestone,comments,createdAt,updatedAt,closedAt,url"
        ]

        env = github_env
        stdout, stderr, status = Open3.capture3(*([env, *cmd].compact))

        if status.success?
          issue_data = JSON.parse(stdout)
          GitHubIssue.new(issue_data)
        else
          warn stderr
          exit status.exitstatus
        end
      rescue Errno::ENOENT
        warn "Error: GitHub CLI (gh) is not installed."
        warn "\nTo install gh:"
        warn "  - macOS: brew install gh"
        warn "  - Linux: See https://github.com/cli/cli#installation"
        warn "\nAfter installation, authenticate with: gh auth login"
        exit 1
      end

      def make_issue_comment(issue_id, comment)
        github_repo_url = repo_url
        repo_path = extract_repo_path(github_repo_url)

        cmd = [
          "gh", "issue", "comment", issue_id.to_s,
          "-R", repo_path,
          "--body", comment
        ]

        env = github_env
        _stdout, stderr, status = Open3.capture3(*([env, *cmd].compact))

        if status.success?
          puts "Successfully posted comment to issue ##{issue_id}"
        else
          warn "Error posting comment: #{stderr}"
          exit status.exitstatus
        end
      end

      def mark_issue_in_progress(issue_id)
        github_repo_url = repo_url
        repo_path = extract_repo_path(github_repo_url)
        env = github_env

        # Add "in_progress" label
        cmd = [
          "gh", "issue", "edit", issue_id.to_s,
          "-R", repo_path,
          "--add-label", "in_progress"
        ]

        _stdout, stderr, status = Open3.capture3(*([env, *cmd].compact))
        puts "Note: Could not add 'in_progress' label: #{stderr}" unless status.success?

        # Assign to self
        cmd = [
          "gh", "issue", "edit", issue_id.to_s,
          "-R", repo_path,
          "--add-assignee", "@me"
        ]

        _stdout, _stderr, status = Open3.capture3(*([env, *cmd].compact))
        puts "Assigned issue ##{issue_id} to self" if status.success?
      end

      def fetch_open_issues(repo_path)
        cmd = [
          "gh", "issue", "list",
          "--repo", repo_path,
          "--state", "open",
          "--json", "number,title,body,labels,createdAt,updatedAt",
          "--limit", "1000"
        ]

        env = github_env
        stdout, stderr, status = Open3.capture3(*([env, *cmd].compact))

        unless status.success?
          warn "ERROR: Failed to fetch issues: #{stderr}"
          return []
        end

        issues_data = JSON.parse(stdout)
        issues = issues_data.map { |data| GitHubIssueListItem.new(data) }
        puts "Fetched #{issues.length} open issues"
        issues
      rescue JSON::ParserError => e
        warn "ERROR: Failed to parse issues JSON: #{e}"
        []
      end

      def fetch_issue_comments(repo_path, issue_number)
        cmd = [
          "gh", "issue", "view", issue_number.to_s,
          "--repo", repo_path,
          "--json", "comments"
        ]

        env = github_env
        stdout, stderr, status = Open3.capture3(*([env, *cmd].compact))

        unless status.success?
          warn "ERROR: Failed to fetch comments for issue ##{issue_number}: #{stderr}"
          return []
        end

        data = JSON.parse(stdout)
        comments = data.fetch("comments", [])
        comments.sort_by { |c| c.fetch("createdAt", "") }
      rescue JSON::ParserError => e
        warn "ERROR: Failed to parse comments JSON for issue ##{issue_number}: #{e}"
        []
      end
    end
  end
end
