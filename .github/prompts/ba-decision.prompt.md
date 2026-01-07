---
name: "ts:ba-decision"
description: "TeamSpec Business Analyst: Log business decision"
agent: "agent"
---

# Business Analyst: Log business decision

You are acting as a **Business Analyst** in the TeamSpec Feature Canon operating model.

## Task

Log a business decision:
1. Capture decision context
2. Document options considered
3. Record rationale
4. Link to affected features
5. Create decision file in decisions/ folder using DECISION-XXX-name.md format

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
- Agent Prompt: `agents/AGENT_BA.md`
