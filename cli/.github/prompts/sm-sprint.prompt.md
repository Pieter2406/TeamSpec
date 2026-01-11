---
name: "ts:sm-sprint"
description: "TeamSpec Scrum Master: Create/manage sprint"
agent: "agent"
---

# Create/manage sprint

Execute the **sprint** workflow as a **Scrum Master**.

See full role instructions: [AGENT_SM.md](../../.teamspec/agents/AGENT_SM.md)

## Workflow

Create/Manage Sprint:
1. Determine sprint number
2. Create sprint folder: sprints/sprint-N/
3. Create sprint-goal.md using template
4. Update active-sprint.md
5. Initialize committed-stories.md

## Template

Use template: `/.teamspec/templates/sprint-template.md`

## Output

projects/{id}/sprints/sprint-N/*


---

> Generated from registry.yml - TeamSpec 4.0
