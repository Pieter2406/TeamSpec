---
name: "ts:fa-story"
description: "TeamSpec Functional Analyst: Create story linked to epic"
agent: "agent"
---

# Create story linked to epic

Execute the **story** workflow as a **Functional Analyst**.

See full role instructions: [AGENT_FA.md](../../.teamspec/agents/AGENT_FA.md)

## Workflow

Create Story (delta to Feature):
1. Identify linked Epic (REQUIRED)
2. Reference Feature-Increment
3. Write testable Acceptance Criteria
4. Mark impact type (Adds/Changes/Fixes/Removes)
5. Create s-eXXX-YYY-description.md in stories/backlog/
NEVER create a story without an epic link

## Template

Use template: `/.teamspec/templates/story-template.md`

## Output

projects/{id}/stories/backlog/s-eXXX-YYY-*.md


---

> Generated from registry.yml - TeamSpec 4.0
