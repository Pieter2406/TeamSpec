# Sprints Index

> **Template Version**: 2.0  
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
