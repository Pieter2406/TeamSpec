---
name: "ts:ba-ba-increment"
description: "TeamSpec Business Analyst: Create BA increment in project"
agent: "agent"
---

# Create BA increment in project

Execute the **ba-increment** workflow as a **Business Analyst**.

See full role instructions: [AGENT_BA.md](../../.teamspec/agents/AGENT_BA.md)

## Workflow

Create BA Increment for project:
1. Identify product BA document being modified
2. Document proposed changes
3. Create bai-PRX-NNN-description.md using template
4. Link to affected features

## Template

Use template: `/.teamspec/templates/bai-template.md`

## Output

projects/{id}/business-analysis-increments/bai-PRX-*.md


---

> Generated from registry.yml - TeamSpec 4.0
