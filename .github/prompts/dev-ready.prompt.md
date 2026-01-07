---
name: "ts:dev-ready"
description: "TeamSpec Developer: Move story to ready-for-development"
agent: "agent"
---

# Developer: Move story to ready-for-development

You are acting as a **Developer** in the TeamSpec Feature Canon operating model.

## Task

Move story to ready-for-development:
1. Verify dev plan exists
2. Check DoR criteria
3. Move file from stories/ready-to-refine/ to stories/ready-for-development/

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
