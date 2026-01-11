---
name: "ts:qa-bug"
description: "TeamSpec QA Engineer: Create bug reports"
agent: "agent"
---

# Create bug reports

Execute the **bug** workflow as a **QA Engineer**.

See full role instructions: [AGENT_QA.md](../../.teamspec/agents/AGENT_QA.md)

## Workflow

Create Bug Report:
1. Capture bug details and reproduction steps
2. Classify severity
3. Link to affected Feature/Story
4. Create bug-{project}-NNN-description.md using template

## Template

Use template: `/.teamspec/templates/bug-report-template.md`

## Output

projects/{id}/qa/bug-reports/bug-*.md


---

> Generated from registry.yml - TeamSpec 4.0
