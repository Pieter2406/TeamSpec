---
# === LLM Retrieval Metadata ===
artifact_kind: sprint
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: SM
artifact_type: Operational
canonicity: planning
lifecycle: sprint-bound

# === Naming ===
id_pattern: "sprint-{N}"
filename_pattern: "sprint-{N}/sprint-goal.md"

# === Required Relationships ===
links_required:
  - type: project
    pattern: "project.yml"
    optional: false

# === Search Optimization ===
keywords:
  - sprint
  - iteration
  - planning
  - commitment
  - capacity
aliases:
  - iteration
  - cycle
anti_keywords:
  - feature
  - story content
  - requirements

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Sprint Goal
    - Metadata
    - Committed Stories
  optional_sections:
    - Risks
    - Notes
---

# Sprint {N}

<!--
  ⚠️ SPRINT ≠ SCOPE DEFINITION

  This sprint is a TIME-BOXED execution snapshot.

  RULES:
  1. Sprint does not define scope (Features do)
  2. Sprint does not change priority (PO does)
  3. Only SM can modify sprint contents
  4. Scope changes require explicit Decision Log entry

  After sprint commitment, scope changes must be logged in /decisions/

  LOCATION: projects/{project-id}/sprints/sprint-{N}/
-->

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11
> **Location**: `projects/{project-id}/sprints/sprint-{N}/sprint-goal.md`

---

**Document Owner:** SM (Scrum Master)  
**Artifact Type:** Operational (Sprint-bound)  
**Lifecycle:** Active during sprint, archived after close

---

## Sprint Goal

> **Contract:** One clear, measurable objective with success criteria.  
> **Required precision:** Specific, testable outcomes by sprint end.  
> **Not this:** Vague aspirations or feature lists.

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
> 2. PO to approve scope change
> 3. Decision logged in /decisions/dec-{PRX}-{NNN}.md
> 4. Story removed/added with explicit note

---

## Committed Stories

<!-- TEAMSPEC RULE: TS-DEVPLAN-001 - Dev plan required before implementation -->

| Story ID | Title | Points | Dev Plan | Owner | Status |
|----------|-------|--------|----------|-------|--------|
| [s-e{EEE}-{SSS}](../stories/in-progress/s-e{EEE}-{SSS}-*.md) | {Title} | {N} | [dp-e{EEE}-s{SSS}](../dev-plans/dp-e{EEE}-s{SSS}-*.md) | @dev | ⚪ Not Started |

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

> ⚠️ Before sprint close, verify Feature-Increments TO-BE sections are complete for all behavior-changing stories.

| Story | FI | Impact Type | FI TO-BE Complete? | FA Verified |
|-------|-----|-------------|-------------------|-------------|
| s-e{EEE}-{SSS} | fi-{PRX}-{NNN} | Adds/Changes | [ ] | [ ] |

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
