---
name: "ts:fa-feature-increment"
description: "TeamSpec Functional Analyst: Create feature-increment in project"
agent: "agent"
---

# Create feature-increment in project

Execute the **feature-increment** workflow as a **Functional Analyst**.

See full role instructions: [AGENT_FA.md](../../.teamspec/agents/AGENT_FA.md)

## Workflow

Create Feature-Increment (TO-BE change):
1. Identify target Product Feature (f-PRX-NNN)
2. Document AS-IS (copy from Canon)
3. Document TO-BE (proposed changes)
4. Write Acceptance Criteria
5. Create fi-PRX-NNN-description.md using template
6. Update increments-index.md

## Template

Use template: `/.teamspec/templates/feature-increment-template.md`

## Output

projects/{id}/feature-increments/fi-PRX-*.md


---

> Generated from registry.yml - TeamSpec 4.0
