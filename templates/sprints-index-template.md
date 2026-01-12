---
artifact_kind: sprints-index
spec_version: "4.0"
template_version: "4.0.1"
role_owner: SM
keywords:
  - sprints index
  - sprint history
  - velocity trend
  - sprint overview
  - sprint list
  - iteration history
  - sprint archive
  - velocity tracking
anti_keywords:
  - active sprint details
  - sprint planning
  - backlog
  - feature index
links_required:
  - type: sprint-goal
    pattern: "sprints/sprint-*/sprint-goal.md"
  - type: active-sprint
    pattern: "sprints/active-sprint.md"
completion_rules:
  history_rule: "All closed sprints must be listed with velocity and status"
  velocity_rule: "Average velocity must be calculated and updated"
---

# Sprints Index

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-07  
> **Note**: This index provides an overview of all sprints. See [active-sprint.md](active-sprint.md) for live status.

---

**Document Owner:** SM (Scrum Master)  
**Artifact Type:** Index (Living)  
**Location:** `sprints/sprints-index.md`

---

## Active Sprint

| Sprint | Goal | Status | Progress |
|--------|------|--------|----------|
| [Sprint {N}](sprint-{N}/sprint-goal.md) | {Goal summary} | 🟢 Active | {N}% |

---

## Sprint History

| Sprint | Goal | Velocity | Canon Sync | Status | Dates |
|--------|------|----------|------------|--------|-------|
| [Sprint {N-1}](sprint-{N-1}/sprint-goal.md) | {Goal} | {N} pts | ✅ | ✅ Closed | {Start} - {End} |
| [Sprint {N-2}](sprint-{N-2}/sprint-goal.md) | {Goal} | {N} pts | ✅ | ✅ Closed | {Start} - {End} |

---

## Velocity Trend

| Sprint | Committed | Completed | Velocity | Canon Items |
|--------|-----------|-----------|----------|-------------|
| Sprint {N-1} | {N} pts | {N} pts | {N} pts | {N} |
| Sprint {N-2} | {N} pts | {N} pts | {N} pts | {N} |

**Average Velocity**: {N} pts

---

## Folder Structure

```
sprints/
├── active-sprint.md           # Living doc - current sprint status
├── sprints-index.md           # This file - sprint history
├── sprint-1/
│   └── sprint-goal.md
├── sprint-2/
│   └── sprint-goal.md
└── archive/                   # Optional: archived sprints
    └── sprint-0/
        └── sprint-goal.md
```

---

## Quick Links

- [Active Sprint](active-sprint.md)
- [Definition of Ready](../.teamspec/definitions/definition-of-ready.md)
- [Definition of Done](../.teamspec/definitions/definition-of-done.md)
- [Feature Canon](../features/)
- [Stories Backlog](../stories/backlog/)
- [Ready for Development](../stories/ready-for-development/)
