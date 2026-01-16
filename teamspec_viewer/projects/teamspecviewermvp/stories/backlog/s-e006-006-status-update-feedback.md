---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Update Feedback States"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-006"
filename_pattern: "s-e006-006-status-update-feedback.md"

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
  - loading state
  - error handling
  - toast notification
  - rollback
  - feedback
aliases:
  - status feedback
anti_keywords:
  - dropdown
  - API
---

# Story: `s-e006-006-status-update-feedback`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-006 |
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

**As a** TeamSpec user changing artifact status,  
**I want** clear visual feedback during the save operation and on errors,  
**So that** I know when changes are saved and can recover from failures.

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

**Reference:** f-TSV-008, Section: Current Behavior

- No status editing exists, so no feedback mechanisms exist
- Application has no global toast/snackbar system for user notifications

### TO-BE (new behavior)

- **Loading State**: While API call is in progress:
  - StatusDropdown shows small spinner/loading indicator
  - Dropdown is disabled (cannot make another selection)
  - Chip color fades slightly to indicate pending state

- **Success State**: On successful API response:
  - Chip immediately updates to new status and color
  - Brief success indicator (checkmark flash or green border pulse)
  - No toast needed for success (inline feedback sufficient)

- **Error State**: On API error:
  - Chip reverts to previous status and color
  - Error toast appears at bottom of screen
  - Toast shows error message from API (e.g., "Failed to update status: File not found")
  - Toast auto-dismisses after 5 seconds or on user click

- **Toast System**: If not already present:
  - Add MUI Snackbar provider to app root
  - Create `useToast` hook for showing notifications
  - Support error, warning, success, info variants

---

## Acceptance Criteria (AC)

### Scenario 1: Loading State Display

- **Given** user selects new status from dropdown
- **When** API call is in progress
- **Then** status chip shows loading spinner and is non-interactive

### Scenario 2: Success Feedback

- **Given** API call completes successfully
- **When** response is received
- **Then** chip updates to new status color within 200ms
- **And** brief success animation plays (pulse or checkmark)

### Scenario 3: Error Toast Display

- **Given** API call fails with error "File not found"
- **When** error response is received
- **Then** chip reverts to previous status
- **And** red error toast appears with message "Failed to update status: File not found"

### Scenario 4: Toast Auto-Dismiss

- **Given** error toast is visible
- **When** 5 seconds pass
- **Then** toast automatically dismisses

### Scenario 5: Toast Manual Dismiss

- **Given** error toast is visible
- **When** user clicks the X button or the toast
- **Then** toast immediately dismisses

---

## Technical Notes

- **Toast Provider**: Add MUI Snackbar to `App.tsx` or create `ToastProvider`
- **Hook**: Create `useToast()` hook returning `{ showError, showSuccess, showInfo }`
- **StatusDropdown**: Add `loading` prop for loading state
- **Animation**: Use CSS transition or MUI Fade for success indicator

---

## UX & Copy

- Error toast: Red background (#f44336), white text
- Success indicator: Green checkmark or border pulse
- Loading: Small CircularProgress (16px) inside chip
- Toast position: Bottom center

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-006)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear — Depends on s-e006-002, s-e006-003
- [x] Estimated — 2 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
