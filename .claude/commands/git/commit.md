# Git Commit - Add and Commit Changes

Commit current changes to the git repository with a commit message. Can commit all changes or files matching natural language descriptions. Use -m flag for commit messages.

**Usage**: `/git:commit [file-description] -m "commit message"`
**Usage**: `/git:commit [file-description]` (auto-generates commit message)
**Usage**: `/git:commit -m "commit message"` (commits all changes)

## Implementation

Add changes and create a commit with the provided message, or auto-generate one by analyzing the changes. This command combines `git add` and `git commit -m` into a single, user-friendly operation with intelligent commit message generation and natural language file selection.

Steps to execute:
1. Check if we're in a git repository
2. Parse command arguments:
   - Extract `-m "message"` flag if present
   - Identify file description (everything before -m flag, or entire argument if no -m)
   - If no file description: commit all changes
3. **File Interpretation**: If file description provided, interpret natural language to find matching files:
   - **Specific files**: "file1.js file2.py" → add exact files
   - **Extensions**: "all JavaScript files" → find *.js files
   - **Folders**: "all files in src folder" → find src/**/*
   - **Patterns**: "test files" → find *test*, *spec*, test/**/*
   - **File types**: "configuration files" → find *.json, *.yml, *.config.*, etc.
   - **Recent changes**: "modified files" → use git status to find changed files
   - Use git ls-files, find commands, and glob patterns to resolve descriptions
4. Stage the resolved files:
   - **Selective mode**: Use `git add <resolved-files>` for interpreted files
   - **All changes mode**: Use `git add .` if no file description provided
5. If no commit message provided:
   a. Run `git status --porcelain` to get overview of changed files
   b. Run `git diff` and `git diff --cached` to analyze actual changes
   c. Analyze the changes to determine:
      - Type of work (new features, bug fixes, configuration, documentation, etc.)
      - Scope of changes (which parts of project affected)
      - Key modifications made
   d. Generate a descriptive commit message in format: "action: brief description"
      - Use action verbs like: add, update, fix, remove, refactor, docs, config, feat
      - Keep message concise but descriptive (50 characters or less for first line)
      - Include additional details in body if changes are complex
6. Run `git commit -m "<commit-message>"` with provided or generated message
7. Show confirmation of the commit with hash and summary
8. Handle cases where there are no changes to commit
9. **Validation for selective mode**:
   - Verify specified files exist and have changes
   - Show warning if files don't exist or have no modifications
   - Display summary of what files are being committed vs. what's left unstaged

## Auto-Generated Commit Message Examples

The command analyzes changes and creates messages like:
- `feat: add user authentication system`
- `fix: resolve login validation bug`
- `docs: update API documentation`
- `config: setup project build tools`
- `refactor: improve database connection handling`

## Examples

### Commit All Changes
```bash
/git:commit -m "Added new feature for user authentication"
```
Commits all changes with provided commit message.

```bash
/git:commit
```
Commits all changes with auto-generated commit message.

### Commit Files with Natural Language Descriptions
```bash
/git:commit "all JavaScript files" -m "Fix authentication bugs"
```
Finds and commits all .js files with custom message.

```bash
/git:commit "files in the src folder"
```
Commits all files in src/ directory with auto-generated message.

```bash
/git:commit "configuration files" -m "Update API endpoints"
```
Commits config files (*.json, *.yml, *.config.*) with custom message.

```bash
/git:commit "test files and documentation"
```
Commits test files (*test*, *spec*) and docs (*.md) with auto-generated message.

### Commit Specific Files
```bash
/git:commit "src/auth.js README.md" -m "Fix login validation"
```
Commits exact files with custom message.

```bash
/git:commit "package.json yarn.lock"
```
Commits dependency files with auto-generated message.

### Advanced Examples
```bash
/git:commit "all modified files in components folder"
```
Commits only changed files in components/ directory.

```bash
/git:commit "Python files that were modified today"
```
Commits recently modified .py files.

## Behavior Summary

**All changes mode** (default):
- Stage all current changes
- Analyze all changes if no message provided and generate intelligent commit message
- Create commit with provided or generated message
- Show confirmation with commit details

**Selective mode** (with file parameters):
- Validate specified files exist and have changes
- Stage only the specified files
- Analyze only staged changes for message generation
- Show summary of what's being committed vs. what remains unstaged
- Create commit with provided or generated message focused on selected files