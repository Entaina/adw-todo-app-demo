---
description: Install all dependencies and set up the development environment for the full-stack todo app (Rails API + React frontend)
disable-model-invocation: true
allowed-tools: Bash, Read
---

# Install and Set Up Project

## Purpose

Installs all dependencies and sets up the development environment for the full-stack todo app (Rails API backend + React frontend). Run this command when cloning the project for the first time or when resetting the development environment.

## Instructions

- Do NOT start application servers — this command only sets up the environment

## Workflow

1. Start infrastructure services:
   - Read and execute the `/infra:up` command
   <if fails>
   Inform the user and stop — the database is required. Do not continue with subsequent steps.
   </if>

2. Set up the backend:
   - Run `bin/setup --skip-server` in the `backend/` directory
   - This handles: dependency install, database preparation, log/temp cleanup
   <if fails>
   Stop and report the error clearly. Do not continue with subsequent steps.
   </if>

3. Install frontend dependencies:
   - Run `npm install` in the `frontend/` directory
   <if fails>
   Stop and report the error clearly. Do not continue with subsequent steps.
   </if>

4. Report success with a summary of what was set up
