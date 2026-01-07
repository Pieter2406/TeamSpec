# S-XXX: [Title]

<!-- TEAMSPEC RULE: TS-STORY-002 -->
<!-- 
  ⚠️ STORIES ARE DELTAS, NOT DOCUMENTATION
  
  This story describes a CHANGE to the Feature Canon.
  
  DO NOT:
  - Restate full feature behavior
  - Include complete specifications
  - Document end-to-end flows
  
  DO:
  - Reference Feature Canon (F-XXX) for current behavior
  - Describe only what changes (Before → After)
  - Link to Feature Canon rules (BR-XXX)
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | S-XXX |
| **Status** | Backlog |
| **Estimate** | [Points] |
| **Author** | [FA Name] |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

> ⚠️ **Stories start in Backlog.** Only the Scrum Master can assign stories to a sprint.

---

## User Story

**As a** [Persona],  
**I want** [Action],  
**So that** [Benefit].

---

## Linked Project

> ⚠️ **MANDATORY**: Link to the project this story belongs to.

| Project ID | Name |
|------------|------|
| [PROJECT-ID](../project.yml) | [Project Name] |

---

## Linked Epic

> Recommended: Link to the parent epic.

| Epic ID | Epic Name |
|---------|-----------|
| [EPIC-XXX](../epics/EPIC-XXX.md) | [Epic Name] |

---

## Linked Feature

> ⚠️ **MANDATORY**: Every story must link to at least one feature.  
> **TEAMSPEC RULE:** TS-STORY-001 - Feature link required

| Feature ID | Feature Name |
|------------|--------------|
| [F-XXX](../features/F-XXX-feature-name.md) | [Feature Name] |

---

## Feature Impact

> Describe what this story CHANGES relative to current documented behavior.  
> **Do NOT restate full feature behavior here.**

<!-- TEAMSPEC RULE: TS-STORY-002 requires Before/After format -->

### Impact Type

- [ ] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation (no feature update needed)
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### Before (current behavior)

<!-- 
  Describe the CURRENT behavior as documented in Feature Canon.
  Reference: F-XXX, Section: [section name]
  
  Example: "Currently, users must log in with email/password (F-001, Main Flow Step 1)"
-->

**Reference:** F-XXX, Section: [section]

[Brief description of current behavior per Feature Canon]

### After (new behavior)

<!-- 
  Describe ONLY what changes.
  This becomes the new behavior in Feature Canon after completion.
  
  Example: "Users can also log in with Google OAuth"
-->

[ONLY the delta - what changes]

> ⚠️ **FEATURE CANON RULE**  
> If this story adds or changes behavior, the Feature Canon MUST be updated before this story can be marked Done.  
> See: Definition of Done - TS-DOD-001

---

## Sprint Assignment

<!-- TEAMSPEC RULE: TS-STORY-004 - Only SM can assign sprint -->

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

> ⚠️ Only the Scrum Master (SM) can assign this story to a sprint.

---

## Decision References

_Business decisions that drove this story's existence or scope._

> **When Required**: If this story has "Adds Behavior" or "Changes Behavior" impact, it MUST either:
>
> - Reference at least one DEC ID, OR
> - Explicitly check "No new business decision required" below

| Decision ID | Summary | Impact on This Story |
|-------------|---------|----------------------|
| [DEC-XXX](../decisions/DEC-XXX-*.md) | [One-line summary] | [Why this story exists / what changed] |

- [ ] **No new business decision required** (for stories without scope/behavior decisions)

---

## Acceptance Criteria (AC)

> AC must map to Feature Canon behavior. Reference feature business rules where applicable.

### Scenario 1: [Happy Path]

- **Given** [Context]
- **When** [Action]
- **Then** [Result]
- **Feature Rule**: [BR-XXX if applicable]

### Scenario 2: [Edge Case]

- **Given** ...
- **When** ...
- **Then** ...

---

## Technical Notes

- **API**: [Endpoint]
- **DB**: [Table/Schema]
- **ADR**: [ADR-XXX if applicable]

---

## UX & Copy

- [Figma Link]
- Error Messages: [List specific messages]

---

## FA Acceptance Gate

> This story must be reviewed by FA before moving to Ready for Development.

| Check | Status | FA Initials |
|-------|--------|-------------|
| Story describes delta only | [ ] | |
| Feature link is correct | [ ] | |
| ACs reference Feature Canon | [ ] | |
| No full behavior restatement | [ ] | |

**FA Approved:** [ ] Yes  
**FA Name:** ________________  
**Date:** ________________

---

## DoR Checklist (Feature Alignment)

- [ ] Linked to one or more Feature IDs
- [ ] Feature file(s) exist and are current
- [ ] Story describes DELTA only, not full behavior
- [ ] Feature impact type is marked
- [ ] ACs map to feature behavior / business rules
- [ ] Open questions tracked at feature level (not here)

## DoR Checklist (Standard)

- [ ] AC Defined (Gherkin or checklist)
- [ ] UX Attached (or "No UI required")
- [ ] Dependencies Clear
- [ ] Estimated
- [ ] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] **Feature Canon updated** (if behavior changed) — TS-DOD-001
- [ ] Feature Change Log entry added
- [ ] Story Ledger updated
- [ ] FA Accepted

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-STORY-001 | Feature link required | Checked on save |
| TS-STORY-002 | Delta-only format | Checked on save |
| TS-STORY-003 | ACs testable | Checked on Ready |
| TS-STORY-004 | Sprint assignment by SM only | Checked on assignment |
| TS-STORY-005 | DoR complete | Checked on Ready |
| TS-DOD-001 | Canon sync | Checked on Done |
