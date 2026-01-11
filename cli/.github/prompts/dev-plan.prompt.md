---
name: "ts:dev-plan"
description: "TeamSpec Developer: Create dev plan for story"
agent: "agent"
---

# Create dev plan for story

Execute the **plan** workflow as a **Developer**.

See full role instructions: [AGENT_DEV.md](../../.teamspec/agents/AGENT_DEV.md)

## Workflow

Create Development Plan:
1. Read story and linked Feature-Increment
2. Break down into implementation tasks
3. Estimate effort for each task
4. Identify dependencies and risks
5. Create dp-eXXX-sYYY-description.md using template

## Template

Use template: `/.teamspec/templates/dev-plan-template.md`

## Output

projects/{id}/dev-plans/dp-eXXX-sYYY-*.md


---

> Generated from registry.yml - TeamSpec 4.0
