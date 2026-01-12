---
artifact_kind: sprint-goal
spec_version: "4.0"
template_version: "4.0.1"
role_owner: SM
keywords:
  - sprint goal
  - sprint objective
  - sprint commitment
  - sprint planning output
  - iteration goal
  - sprint success criteria
  - sprint focus
  - sprint capacity
  - committed stories
anti_keywords:
  - product backlog
  - feature canon
  - epic planning
  - release planning
  - retrospective
links_required:
  - type: story
    pattern: "stories/S-*.md"
  - type: sprint
    pattern: "sprints/sprint-*/"
completion_rules:
  goal_rule: "Sprint goal must be one clear, measurable objective"
  success_criteria_rule: "Must have specific, measurable success criteria"
  story_link_rule: "Committed stories must link to story files"
---

# Sprint {N} Goal

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-07  
> **Sprint Duration**: {YYYY-MM-DD} to {YYYY-MM-DD}  
> **Status**: Planning | Active | Closed

---

**Document Owner:** SM (Scrum Master)  
**Artifact Type:** Operational (Sprint-bound)  
**Location:** `sprints/sprint-{N}/sprint-goal.md`

---

## Sprint Goal

> **Contract:** One clear, measurable objective for the sprint.  
> **Required precision:** Specific outcomes that can be verified.  
> **Not this:** Feature lists, vague themes, or multiple goals.

> {One clear, measurable objective that the team commits to achieving this sprint}

**Success Criteria**:
- [ ] {Specific, measurable outcome 1}
- [ ] {Specific, measurable outcome 2}
- [ ] {Specific, measurable outcome 3}

---

## Sprint Metadata

| Field | Value |
|-------|-------|
| **Sprint Number** | {N} |
| **Start Date** | {YYYY-MM-DD} |
| **End Date** | {YYYY-MM-DD} |
| **Capacity** | {N} points |
| **Scrum Master** | @{sm} |

---

## Committed Stories

> **Contract:** Stories committed for this sprint with links and status.  
> **Required precision:** Each story must link to its dev plan and owner.  
> **Not this:** Uncommitted backlog items or wishlist entries.

| Story ID | Title | Points | Dev Plan | Owner | Status |
|----------|-------|--------|----------|-------|--------|
| [S-XXX](../../stories/ready-for-development/S-XXX-*.md) | {Title} | {N} | [Plan](../../dev-plans/story-XXX-tasks.md) | @{dev} | Not Started |

**Total Committed**: {N} points

---

## Sprint Scope

### In Scope
- {Feature/capability being delivered}
- {Feature/capability being delivered}

### Out of Scope
- {Explicitly excluded items}
- {Deferred to future sprint}

### Dependencies
- {External dependency or blocker}

---

## Acceptance Criteria for Sprint Goal

**Given** the sprint is complete  
**When** we review the deliverables  
**Then**:
- [ ] {Goal criterion 1 is met}
- [ ] {Goal criterion 2 is met}
- [ ] All committed stories meet Definition of Done
- [ ] Feature Canon updated for all behavior-changing stories

---

## Daily Progress

| Day | Date | Remaining Pts | Notes |
|-----|------|---------------|-------|
| 1 | {YYYY-MM-DD} | {N} | Sprint started |

---

## Blockers & Risks

| Issue | Impact | Owner | Status |
|-------|--------|-------|--------|
| _None_ | | | |

---

## Canon Sync Tracking

| Story | Impact Type | Canon Updated? | FA Verified |
|-------|-------------|----------------|-------------|
| S-XXX | Adds/Changes | [ ] | [ ] |

---

## Sprint Review Notes

_To be filled at sprint review_

### Demo Items
- [ ] {Story/feature to demo}

### Stakeholder Feedback
- {Feedback item}

---

## Retrospective Actions

_To be filled at retrospective_

| What went well | What to improve | Action item |
|----------------|-----------------|-------------|
| | | |

---

## Sprint Closure

| Metric | Value |
|--------|-------|
| Velocity | _TBD_ |
| Completion Rate | _TBD_ |
| Canon Sync Complete | [ ] |
| Closed Date | _TBD_ |
