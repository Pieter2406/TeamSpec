---
artifact_kind: active-sprint
spec_version: "4.0"
template_version: "4.0.1"
role_owner: SM
keywords:
  - active sprint
  - current sprint
  - sprint status
  - sprint progress
  - burndown
  - sprint dashboard
  - live sprint
  - sprint tracker
  - work in progress
anti_keywords:
  - sprint history
  - closed sprint
  - retrospective
  - sprint planning
  - backlog
links_required:
  - type: sprint-goal
    pattern: "sprints/sprint-*/sprint-goal.md"
completion_rules:
  living_doc_rule: "This file always reflects current active sprint"
  status_rule: "Progress summary must be kept current"
---

# Active Sprint

> **Living Document**: This file always reflects the current active sprint.

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-07

---

**Document Owner:** SM (Scrum Master)  
**Artifact Type:** Operational (Living)  
**Location:** `sprints/active-sprint.md`

---

## Current Sprint

**Sprint {N}**: [{Sprint Goal Title}](sprint-{N}/sprint-goal.md)

| Field | Value |
|-------|-------|
| **Status** | 🟢 Active |
| **Start** | {YYYY-MM-DD} |
| **End** | {YYYY-MM-DD} |
| **Days Remaining** | {N} |

---

## Sprint Goal

> {One-sentence sprint goal}

---

## Progress Summary

| Metric | Value |
|--------|-------|
| **Total Points** | {N} |
| **Completed** | {N} |
| **Remaining** | {N} |
| **Progress** | {N}% |

```
[████████░░░░░░░░░░░░] 40%
```

---

## Story Status

| Story | Title | Points | Dev Plan | Status |
|-------|-------|--------|----------|--------|
| S-XXX | {Title} | {N} | [Plan](../dev-plans/story-XXX-tasks.md) | 🟢 Done |
| S-XXX | {Title} | {N} | [Plan](../dev-plans/story-XXX-tasks.md) | 🟡 In Progress |
| S-XXX | {Title} | {N} | [Plan](../dev-plans/story-XXX-tasks.md) | ⚪ Not Started |

**Status Legend**: 🟢 Done | 🟡 In Progress | ⚪ Not Started | 🔴 Blocked

---

## Canon Sync Status

> ⚠️ Stories with behavior changes must have Feature Canon updated before Done.

| Story | Impact Type | Canon Synced? |
|-------|-------------|---------------|
| S-XXX | Adds Behavior | [ ] |
| S-XXX | Changes Behavior | [ ] |

---

## Blockers

| Story | Blocker | Days Blocked | Escalated To |
|-------|---------|--------------|--------------|
| _None_ | | | |

---

## Quick Links

- [Sprint Goal Details](sprint-{N}/sprint-goal.md)
- [Definition of Ready](../.teamspec/definitions/definition-of-ready.md)
- [Definition of Done](../.teamspec/definitions/definition-of-done.md)
- [Feature Canon](../features/)

---

## Sprint History

| Sprint | Goal | Velocity | Status |
|--------|------|----------|--------|
| [Sprint {N-1}](sprint-{N-1}/sprint-goal.md) | {Goal} | {N} pts | ✅ Closed |

---

_Last updated: {YYYY-MM-DD HH:MM}_
