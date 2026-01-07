# Sprint {N}

<!-- 
  ⚠️ SPRINT ≠ SCOPE DEFINITION
  
  This sprint is a TIME-BOXED execution snapshot.
  
  RULES:
  1. Sprint does not define scope (Features do)
  2. Sprint does not change priority (BA does)
  3. Only SM can modify sprint contents
  4. Scope changes require explicit Decision Log entry
  
  After sprint commitment, scope changes must be logged in /decisions/
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07  
> **Location**: `sprints/sprint-{N}/sprint-goal.md`

---

**Document Owner:** SM (Scrum Master)  
**Artifact Type:** Operational (Sprint-bound)  
**Lifecycle:** Active during sprint, archived after close

---

## Sprint Goal

> {One-sentence sprint objective that describes what value will be delivered}

---

## Metadata

| Field | Value |
|-------|-------|
| Sprint | {N} |
| Start Date | {YYYY-MM-DD} |
| End Date | {YYYY-MM-DD} |
| Status | 🟡 Planning / 🟢 Active / ✅ Closed |
| Capacity | {N} points |
| Scrum Master | @{sm} |

---

## Success Criteria

- [ ] {Measurable outcome 1}
- [ ] {Measurable outcome 2}
- [ ] {Measurable outcome 3}

---

## Scope Freeze Notice

**Sprint Committed:** [ ] Yes / [ ] No  
**Commitment Date:** ________________

> ⚠️ After commitment, any scope change requires:
> 1. SM to facilitate discussion
> 2. BA to approve scope change
> 3. Decision logged in /decisions/DEC-XXX.md
> 4. Story removed/added with explicit note

---

## Committed Stories

<!-- TEAMSPEC RULE: TS-DEVPLAN-001 - Dev plan required before implementation -->

| Story ID | Title | Points | Dev Plan | Owner | Status |
|----------|-------|--------|----------|-------|--------|
| [S-XXX](../../stories/ready-for-development/S-XXX-*.md) | {Title} | {N} | [Plan](../../dev-plans/story-XXX-tasks.md) | @dev | ⚪ Not Started |

> ⚠️ All committed stories must have a Dev Plan before implementation starts.

**Total Committed**: {N} points

**Status Legend**: 🟢 Done | 🟡 In Progress | ⚪ Not Started | 🔴 Blocked

---

## Burndown

| Metric | Value |
|--------|-------|
| **Total** | {N} points |
| **Completed** | {N} points |
| **Remaining** | {N} points |
| **Progress** | {N}% |

```
[░░░░░░░░░░░░░░░░░░░░] 0%
```

---

## Scope Changes

> ⚠️ All scope changes after commitment must be documented here.

| Date | Change | Story | Reason | Decision | Approved By |
|------|--------|-------|--------|----------|-------------|
| _None_ | | | | | |

---

## Blockers

| Story | Blocker | Days Blocked | Escalated To |
|-------|---------|--------------|--------------|
| _None_ | | | |

---

## Daily Progress

| Date | Completed | Notes |
|------|-----------|-------|
| {YYYY-MM-DD} | — | Sprint kickoff |

---

## Canon Sync Verification

> ⚠️ Before sprint close, verify Feature Canon is updated for all behavior-changing stories.

| Story | Impact Type | Canon Updated? | FA Verified |
|-------|-------------|----------------|-------------|
| S-XXX | Adds/Changes | [ ] | [ ] |

---

## Review Notes

_Sprint review observations and stakeholder feedback._

### Demo Items

- [ ] {Story/feature to demo}

### Stakeholder Feedback

- {Feedback item}

---

## Retrospective Actions

- [ ] {Action item from retrospective}

---

## Closure

| Metric | Value |
|--------|-------|
| Velocity | _TBD_ |
| Completion Rate | _TBD_ |
| Bugs Found | _TBD_ |
| Bugs Fixed | _TBD_ |
| Canon Sync Complete | [ ] Yes |
| Closed Date | _TBD_ |

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-STORY-004 | Only SM can assign stories to sprint |
| TS-DEVPLAN-001 | Dev plan required before implementation |
| TS-DOD-001 | Canon sync required before sprint close |
