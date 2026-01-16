---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "BATree Status Integration"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-005"
filename_pattern: "s-e006-005-batree-status-integration.md"

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
  - BATree
  - status integration
  - BA dashboard
  - business analysis
aliases:
  - BA tree status editing
anti_keywords:
  - ArtifactTree
  - FA dashboard
---

# Story: `s-e006-005-batree-status-integration`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-005 |
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

**As a** Business Analyst using the BA Dashboard,  
**I want** to click status chips in the BATree (BA documents, BA Increments) and change their status,  
**So that** I can update analysis workflow state during review cycles.

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

- BATree displays status as read-only colored chips
- Status chips use centralized colors from artifactIcons.ts
- No click handler on status chips
- Status cannot be changed from BA tree view

### TO-BE (new behavior)

- BATree status chips are replaced with StatusDropdown component
- Applicable to: Business Analysis (BA), BA Increment (BAI) nodes
- On status change:
  1. Call `PATCH /api/artifacts/status` API
  2. Show loading state on the chip
  3. On success: Update local state to reflect new status
  4. On error: Revert to previous status, show error toast
- Click propagation is stopped to prevent node selection when clicking status

---

## Acceptance Criteria (AC)

### Scenario 1: BA Document Status Edit

- **Given** BA Dashboard with BATree showing BA document with status "Draft"
- **When** user clicks the "Draft" status chip
- **Then** dropdown opens with options: Draft, Active, Deprecated

### Scenario 2: BAI Status Edit

- **Given** BATree showing BA Increment with status "Proposed"
- **When** user clicks status chip and selects "Approved"
- **Then** API is called and chip updates to "Approved" with amber color

### Scenario 3: Error Handling

- **Given** BATree with a BA document
- **When** user changes status but API returns error
- **Then** chip reverts to previous status and error toast appears

---

## Technical Notes

- **File**: `frontend/src/components/BATree.tsx`
- **Import**: StatusDropdown component
- **Reuse**: Same pattern as ArtifactTree integration (s-e006-004)
- **Event**: Use `event.stopPropagation()` on status chip click

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-005)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear — Depends on s-e006-001, s-e006-002, s-e006-003
- [x] Estimated — 2 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
