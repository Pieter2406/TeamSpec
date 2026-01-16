---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short story title (20-40 chars)}"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e{EEE}-{SSS}"
filename_pattern: "s-e{EEE}-{SSS}-{description}.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-{PRX}-{NNN}"
    optional: false
    note: "Epic ID embedded in filename (eXXX)"
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: true
    note: "Recommended for behavior changes"

# === Search Optimization ===
keywords:
  - user story
  - delta
  - change request
  - acceptance criteria
  - sprint work
  - execution task
aliases:
  - ticket
  - work item
  - task
  - backlog item
anti_keywords:
  - full behavior
  - production truth
  - canon
  - feature specification
  - requirements document

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  id_generation: "Story ID derived from epic (eXXX) + sequence (YYY)"
  delta_rule: "NEVER restate full feature behavior; describe ONLY what changes"
  required_sections:
    - User Story
    - Linked Epic
    - Feature Impact
    - Acceptance Criteria
  optional_sections:
    - Technical Notes
    - UX & Copy
---

# Story: `s-eXXX-YYY-description`

<!-- 
  ⚠️ TEAMSPEC 4.0 STORY TEMPLATE
  
  Stories in 4.0 are linked to Epics via filename.
  Filename pattern: s-eXXX-YYY-description.md
  
  RULES:
  - Story filename MUST include Epic ID (eXXX)
  - YYY is the story sequence within the Epic
  - Stories describe DELTAS, not full behavior
  
  TEAMSPEC RULES ENFORCED:
  - TS-STORY-006: Story must link to Epic (via filename)
  - TS-STORY-007: Linked Epic must exist
  - TS-STORY-002: Delta-only format required
  - TS-STORY-003: Acceptance Criteria required
-->

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-12

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-eXXX-YYY |
| **Epic** | epic-PRX-XXX |
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

## Linked Epic

> ⚠️ **MANDATORY**: Epic link is embedded in filename (eXXX).  
> **TEAMSPEC RULE:** TS-STORY-006 - Epic link required (via filename)

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-PRX-XXX](../epics/epic-PRX-XXX-description.md) | [Epic Name] | [Product Name] (PRX) |

---

## Linked Feature-Increment

> Recommended: Link to the Feature-Increment this story implements.

| FI ID | Description |
|-------|-------------|
| [fi-PRX-XXX](../feature-increments/fi-PRX-XXX-description.md) | [Brief description] |

---

## Feature Impact

> **Contract:** Describes ONLY what this story changes relative to current documented behavior.  
> **Required precision:** Reference specific feature section; use AS-IS/TO-BE format.  
> **Not this:** Full behavior restatement, implementation details, or technical approach.

<!-- TEAMSPEC RULE: TS-STORY-002 requires Before/After (AS-IS/TO-BE) format -->

### Impact Type

- [ ] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation (no feature update needed)
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

<!-- 
  Describe the CURRENT behavior as documented in Product Feature Canon.
  Reference: f-PRX-XXX, Section: [section name]
  
  Example: "Currently, users must log in with email/password (f-DIT-001, Main Flow Step 1)"
-->

**Reference:** f-PRX-XXX, Section: [section]

[Brief description of current behavior per Feature Canon]

### TO-BE (new behavior)

<!-- 
  Describe ONLY what changes.
  This becomes the new behavior in Feature Canon after completion.
  
  Example: "Users can also log in with Google OAuth"
-->

[ONLY the delta - what changes]

> ⚠️ **FEATURE CANON RULE**  
> If this story adds or changes behavior, the Feature-Increment TO-BE must be complete  
> and Canon sync must happen before project closure.  
> See: TS-DOD-003 - Product sync after deployment

---

## Sprint Assignment

<!-- TEAMSPEC RULE: TS-STORY-004 - Only SM can assign sprint -->

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

> ⚠️ Only the Scrum Master (SM) can assign this story to a sprint.

---

## Acceptance Criteria (AC)

> **Contract:** Testable conditions that define "done" for this story.  
> **Required precision:** Gherkin format (Given/When/Then) or explicit checklist.  
> **Not this:** Vague descriptions, implementation tasks, or test scripts.
>
> ⚠️ **MANDATORY**: AC must be present and testable.  
> **TEAMSPEC RULE:** TS-STORY-003 - AC required

### Scenario 1: [Happy Path]

- **Given** [Context]
- **When** [Action]
- **Then** [Result]

### Scenario 2: [Edge Case]

- **Given** ...
- **When** ...
- **Then** ...

---

## Technical Notes

- **API**: [Endpoint]
- **DB**: [Table/Schema]
- **TAI**: [tai-PRX-XXX if applicable]

---

## UX & Copy

- [Figma Link]
- Error Messages: [List specific messages]

---

## DoR Checklist (Feature Alignment)

- [ ] Linked to Epic (via filename s-eXXX-YYY)
- [ ] Linked Epic exists in epics folder
- [ ] Linked Feature-Increment exists (if applicable)
- [ ] Story describes DELTA only, not full behavior
- [ ] Feature impact type is marked
- [ ] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [ ] AC Defined (Gherkin or checklist)
- [ ] UX Attached (or "No UI required")
- [ ] Dependencies Clear
- [ ] Estimated
- [ ] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-STORY-006 | Epic link required (via filename) | Checked on save |
| TS-STORY-007 | Linked Epic must exist | Checked on save |
| TS-STORY-002 | Delta-only format (AS-IS/TO-BE) | Checked on save |
| TS-STORY-003 | ACs testable | Checked on Ready |
| TS-STORY-004 | Sprint assignment by SM only | Checked on assignment |
| TS-STORY-005 | DoR complete | Checked on Ready |
