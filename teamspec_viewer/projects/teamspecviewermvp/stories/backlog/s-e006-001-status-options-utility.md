---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Options Utility"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-001"
filename_pattern: "s-e006-001-status-options-utility.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-006"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-006"
    optional: true

# === Search Optimization ===
keywords:
  - status options
  - artifact status
  - dropdown options
  - status validation
aliases:
  - status utility
anti_keywords:
  - implementation detail
---

# Story: `s-e006-001-status-options-utility`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-001 |
| **Epic** | epic-TSV-006 |
| **Status** | Backlog |
| **Estimate** | 2 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** developer implementing status editing,  
**I want** a centralized utility defining valid status options per artifact type,  
**So that** both frontend dropdown and backend validation use the same source of truth.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-006](../../epics/epic-TSV-006-inline-status-editing.md) | Inline Status Editing | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-006](../../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) | MVP inline status editing with dropdown |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-008, Section: Current Behavior → Status Values by Artifact Type

- Status values are documented in the feature spec
- No centralized frontend/backend utility exists
- Status validation is not implemented

### TO-BE (new behavior)

- New `statusOptions.ts` utility in `frontend/src/utils/` provides:
  - `STATUS_OPTIONS` constant mapping artifact types to valid status arrays
  - `getStatusOptions(artifactType)` function returning valid options
  - `isValidStatus(artifactType, status)` validation function
- Artifact types supported:
  - feature: Planned, Active, Deprecated, Retired
  - feature-increment: Proposed, Approved, In-Progress, Done, Rejected
  - epic: Planned, Active, Done, Cancelled
  - story: Backlog, Refining, Ready, In-Progress, Done, Deferred, Out-of-Scope
  - business-analysis: Draft, Active, Deprecated
  - ba-increment: Proposed, Approved, Done, Rejected
  - devplan: Draft, In-Progress, Implemented, Blocked

---

## Acceptance Criteria (AC)

### Scenario 1: Get Status Options

- **Given** artifact type is "story"
- **When** `getStatusOptions('story')` is called
- **Then** returns `['Backlog', 'Refining', 'Ready', 'In-Progress', 'Done', 'Deferred', 'Out-of-Scope']`

### Scenario 2: Validate Valid Status

- **Given** artifact type is "feature" and status is "Active"
- **When** `isValidStatus('feature', 'Active')` is called
- **Then** returns `true`

### Scenario 3: Validate Invalid Status

- **Given** artifact type is "feature" and status is "Unknown"
- **When** `isValidStatus('feature', 'Unknown')` is called
- **Then** returns `false`

### Scenario 4: Unknown Artifact Type

- **Given** artifact type is "unknown-type"
- **When** `getStatusOptions('unknown-type')` is called
- **Then** returns empty array `[]`

---

## Technical Notes

- **File**: `frontend/src/utils/statusOptions.ts`
- **Export**: Named exports for `STATUS_OPTIONS`, `getStatusOptions`, `isValidStatus`
- **Types**: Use `ArtifactType` from `artifactIcons.ts` where applicable

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-001)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — No UI required
- [x] Dependencies Clear — None
- [x] Estimated — 2 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
