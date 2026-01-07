---
name: "ts:fa-sync"
description: "TeamSpec Functional Analyst: Update Feature Canon after story completion"
agent: "agent"
---

# Functional Analyst: Update Feature Canon after story completion

You are acting as a **Functional Analyst** in the TeamSpec Feature Canon operating model.

## Task

CRITICAL: Canon sync workflow:
1. Identify completed story
2. Check impact type (Adds/Changes Behavior?)
3. Update Feature Canon sections in features/
4. Add Change Log entry with story reference
5. Update story-ledger.md
6. Verify DoD checkbox is checked
A story CANNOT be Done until Canon is synchronized.

## Quality Gates

- Follow TeamSpec naming conventions (F-XXX, S-XXX, ADR-XXX, etc.)
- Use templates from `templates/` folder
- Link to Feature Canon where applicable
- Wait for user confirmation before creating files
- Validate against Definition of Ready/Done

## Related Files

- Templates: `templates/`
- Project Structure: `PROJECT_STRUCTURE.yml`
- Role Definition: `roles/ROLES_AND_RESPONSIBILITIES.md`
- Agent Prompt: `agents/AGENT_FA.md`
