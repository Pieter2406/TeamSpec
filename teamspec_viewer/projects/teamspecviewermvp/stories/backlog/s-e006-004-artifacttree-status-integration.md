---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "ArtifactTree Status Integration"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-004"
filename_pattern: "s-e006-004-artifacttree-status-integration.md"

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
  - ArtifactTree
  - status integration
  - tree view editing
  - FA dashboard
aliases:
  - tree status editing
anti_keywords:
  - BATree
  - backend
---

# Story: `s-e006-004-artifacttree-status-integration`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-004 |
| **Epic** | epic-TSV-006 |
| **Status** | Backlog |
| **Estimate** | 3 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Functional Analyst using the FA Dashboard,  
**I want** to click status chips in the ArtifactTree (Features, FIs, Epics, Stories) and change their status,  
**So that** I can update workflow state during refinement without editing files.

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

- [ ] **Adds Behavior**
- [x] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-008, Section: Current Behavior → Status Display

- ArtifactTree displays status as read-only colored chips
- Status chips use centralized colors from artifactIcons.ts
- No click handler on status chips
- Status cannot be changed from tree view

### TO-BE (new behavior)

- ArtifactTree status chips are replaced with StatusDropdown component
- Applicable to all node types: Feature, Feature-Increment, Epic, Story
- On status change:
  1. Call `PATCH /api/artifacts/status` API
  2. Show loading state on the chip
  3. On success: Update local state to reflect new status
  4. On error: Revert to previous status, show error toast
- Click propagation is stopped to prevent node selection when clicking status

---

## Acceptance Criteria (AC)

### Scenario 1: Feature Status Edit

- **Given** FA Dashboard with ArtifactTree showing Feature "f-TSV-001" with status "Planned"
- **When** user clicks the "Planned" status chip
- **Then** dropdown opens with options: Planned, Active, Deprecated, Retired

### Scenario 2: Story Status Edit

- **Given** ArtifactTree showing Story "s-e005-001" with status "Done"
- **When** user clicks status chip and selects "In-Progress"
- **Then** API is called and chip updates to "In-Progress" with green color

### Scenario 3: Error Handling

- **Given** ArtifactTree with a story
- **When** user changes status but API returns error
- **Then** chip reverts to previous status and error toast appears

### Scenario 4: No Tree Expansion on Status Click

- **Given** collapsed Feature node in tree
- **When** user clicks the status chip
- **Then** dropdown opens but tree node does NOT expand

---

## Technical Notes

- **File**: `frontend/src/components/ArtifactTree.tsx`
- **Import**: StatusDropdown component
- **API**: Add `updateArtifactStatus` function to `api/artifacts.ts`
- **State**: May need local state or cache invalidation for status updates
- **Event**: Use `event.stopPropagation()` on status chip click

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-004)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear — Depends on s-e006-001, s-e006-002, s-e006-003
- [x] Estimated — 3 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
