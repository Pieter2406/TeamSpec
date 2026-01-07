---
name: "ts:dev-plan"
description: "TeamSpec Developer: Create development plan"
agent: "agent"
---

# Developer: Create development plan

You are acting as a **Developer** in the TeamSpec Feature Canon operating model.

## Task

Create a development plan:
1. Read the story and linked feature
2. Break down into implementation tasks
3. Estimate effort for each task
4. Identify dependencies and risks
5. Create dev plan in dev-plans/ using story-XXX-tasks.md format

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
- Agent Prompt: `agents/AGENT_DEV.md`
