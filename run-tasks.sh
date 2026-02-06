#!/bin/bash

# Script to run /plan and /code for all pending tasks in a feature
# Uses Claude CLI with -p argument

FEATURE_PATH="features/2026-02-06-073443-todo-list-rails-react"
FEATURE_JSON="$FEATURE_PATH/feature.json"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Task Runner - Plan & Code${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if feature.json exists
if [ ! -f "$FEATURE_JSON" ]; then
    echo -e "${RED}Error: $FEATURE_JSON not found${NC}"
    exit 1
fi

# Function to get task status from feature.json
get_task_status() {
    local task_id=$1
    jq -r ".tasks[] | select(.id == \"$task_id\") | .status" "$FEATURE_JSON"
}

# Function to get all task IDs in order
get_task_ids() {
    jq -r '.tasks[].id' "$FEATURE_JSON"
}

# Function to get task slug
get_task_slug() {
    local task_id=$1
    jq -r ".tasks[] | select(.id == \"$task_id\") | .slug" "$FEATURE_JSON"
}

# Function to check if there are pending tasks
has_pending_tasks() {
    local pending=$(jq -r '.tasks[] | select(.status != "completed") | .id' "$FEATURE_JSON" | head -1)
    [ -n "$pending" ]
}

# Function to get next pending task
get_next_pending_task() {
    jq -r '.tasks[] | select(.status == "defined" or .status == "planned") | .id' "$FEATURE_JSON" | head -1
}

# Main loop - process tasks while there are pending ones
while has_pending_tasks; do
    # Get next pending task
    TASK_ID=$(get_next_pending_task)

    if [ -z "$TASK_ID" ]; then
        echo -e "${YELLOW}No more tasks to process (all may be in progress or blocked)${NC}"
        break
    fi

    TASK_SLUG=$(get_task_slug "$TASK_ID")
    TASK_PATH="$FEATURE_PATH/tasks/${TASK_ID}-${TASK_SLUG}"
    TASK_STATUS=$(get_task_status "$TASK_ID")

    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "${YELLOW}Processing Task ${TASK_ID}: ${TASK_SLUG}${NC}"
    echo -e "Path: ${TASK_PATH}"
    echo -e "Current Status: ${TASK_STATUS}"
    echo -e "${BLUE}----------------------------------------${NC}"

    # Step 1: Run /plan if not already planned
    if [ "$TASK_STATUS" == "defined" ]; then
        echo ""
        echo -e "${GREEN}[1/2] Running /plan...${NC}"
        echo -e "Command: claude -p \"/plan ${TASK_PATH}\""
        echo ""

        claude --dangerously-skip-permissions -p "/plan ${TASK_PATH}"

        if [ $? -ne 0 ]; then
            echo -e "${RED}Error running /plan for task ${TASK_ID}${NC}"
            exit 1
        fi

        echo -e "${GREEN}✓ Plan completed${NC}"
    else
        echo -e "${YELLOW}[1/2] Skipping /plan (task already planned)${NC}"
    fi

    # Refresh status after planning
    TASK_STATUS=$(get_task_status "$TASK_ID")

    # Step 2: Run /code if planned
    if [ "$TASK_STATUS" == "planned" ]; then
        echo ""
        echo -e "${GREEN}[2/2] Running /code...${NC}"
        echo -e "Command: claude -p \"/code ${TASK_PATH}\""
        echo ""

        claude --dangerously-skip-permissions -p "/code ${TASK_PATH}"

        if [ $? -ne 0 ]; then
            echo -e "${RED}Error running /code for task ${TASK_ID}${NC}"
            exit 1
        fi

        echo -e "${GREEN}✓ Code completed${NC}"
    else
        echo -e "${YELLOW}[2/2] Skipping /code (task not in planned state)${NC}"
    fi

    echo ""
    echo -e "${GREEN}✅ Task ${TASK_ID} processed${NC}"
    echo ""

done

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  All tasks completed!${NC}"
echo -e "${BLUE}========================================${NC}"

# Show final progress
TOTAL=$(jq '.tasks | length' "$FEATURE_JSON")
COMPLETED=$(jq '[.tasks[] | select(.status == "completed")] | length' "$FEATURE_JSON")
echo -e "Progress: ${COMPLETED}/${TOTAL} tasks completed"
