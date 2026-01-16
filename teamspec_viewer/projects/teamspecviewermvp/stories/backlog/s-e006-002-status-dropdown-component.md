---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Dropdown Component"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-002"
filename_pattern: "s-e006-002-status-dropdown-component.md"

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
  - status dropdown
  - MUI menu
  - status selection
  - clickable chip
aliases:
  - dropdown component
anti_keywords:
  - implementation detail
---

# Story: `s-e006-002-status-dropdown-component`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-002 |
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

**As a** TeamSpec user viewing the artifact tree,  
**I want** to click a status chip and see a dropdown with valid status options,  
**So that** I can select a new status without leaving the current view.

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

**Reference:** f-TSV-008, Section: Current Behavior → Status Display

- Status labels are displayed as read-only chips/badges in tree view nodes
- Clicking a status chip does nothing
- Users cannot change status from the UI

### TO-BE (new behavior)

- New `StatusDropdown` component in `frontend/src/components/`:
  - Renders as a colored chip (same styling as current read-only chips)
  - On click, opens MUI Menu with valid status options
  - Current status is visually highlighted (checkmark or bold)
  - Selecting an option triggers `onStatusChange(newStatus)` callback
  - Clicking outside or pressing Escape closes dropdown without change
  - Keyboard navigation: Arrow keys to navigate, Enter to select

---

## Acceptance Criteria (AC)

### Scenario 1: Open Dropdown

- **Given** a StatusDropdown for artifact type "story" with current status "Backlog"
- **When** user clicks the status chip
- **Then** a dropdown menu appears with options: Backlog, Refining, Ready, In-Progress, Done, Deferred, Out-of-Scope

### Scenario 2: Current Status Highlighted

- **Given** dropdown is open with current status "Backlog"
- **When** user views the menu
- **Then** "Backlog" option is visually highlighted (checkmark or bold)

### Scenario 3: Select New Status

- **Given** dropdown is open
- **When** user clicks "Ready"
- **Then** dropdown closes and `onStatusChange('Ready')` is called

### Scenario 4: Cancel Selection

- **Given** dropdown is open
- **When** user clicks outside the dropdown or presses Escape
- **Then** dropdown closes and `onStatusChange` is NOT called

### Scenario 5: Keyboard Navigation

- **Given** dropdown is open
- **When** user presses Arrow Down twice then Enter
- **Then** the third option is selected and `onStatusChange` is called with that value

---

## Technical Notes

- **File**: `frontend/src/components/StatusDropdown.tsx`
- **Dependencies**: MUI Menu, MenuItem; `getStatusOptions` from statusOptions.ts
- **Props**: `artifactType`, `currentStatus`, `onStatusChange`, `disabled?`

---

## UX & Copy

- Chip styling matches existing status chip colors
- Dropdown max-height with scroll for long lists
- Selected item shows checkmark icon

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-002)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear — Depends on s-e006-001 (statusOptions utility)
- [x] Estimated — 3 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
