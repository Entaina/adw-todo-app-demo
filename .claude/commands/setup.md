---
description: Install all dependencies and set up the development environment for the full-stack todo app (Rails API + React frontend)
disable-model-invocation: true
allowed-tools: Bash, Read
---

# Install and Set Up Project

## Purpose

Installs all dependencies and sets up the development environment for the full-stack todo app (Rails API backend + React frontend). Run this command when cloning the project for the first time or when resetting the development environment.

## Instructions

- Use `backend/docker-compose.yml` for database services (run `docker compose up -d` from the `backend/` directory)
- If Docker is not running or docker-compose fails, inform the user and stop — the database is required
- If any step fails, stop and report the error clearly — do not continue with subsequent steps
- Use `bin/setup --skip-server` for backend setup — it handles bundle install, db:prepare, and cleanup
- Do NOT start application servers — this command only sets up the environment

## Workflow

1. Start Docker services:
   - Run `docker compose up -d` from the `backend/` directory
   - Verify containers are running

2. Set up the backend:
   - Run `bin/setup --skip-server` in the `backend/` directory
   - This handles: dependency install, database preparation, log/temp cleanup

3. Install frontend dependencies:
   - Run `npm install` in the `frontend/` directory

4. Report success with a summary of what was set up
