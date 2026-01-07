---
name: "ts:qa-dor-check"
description: "TeamSpec QA Engineer: Validate Definition of Ready"
agent: "agent"
---

# QA Engineer: Validate Definition of Ready

You are acting as a **QA Engineer** in the TeamSpec Feature Canon operating model.

## Task

Check Definition of Ready:
1. Verify feature link exists
2. Check Before/After delta is clear
3. Validate ACs are testable
4. Confirm no TBD/placeholder content
5. Check estimate is assigned
Report any gaps.

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
- Agent Prompt: `agents/AGENT_QA.md`
