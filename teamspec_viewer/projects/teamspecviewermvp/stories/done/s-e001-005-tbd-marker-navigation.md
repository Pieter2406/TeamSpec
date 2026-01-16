---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "TBD Marker Highlighting"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e001-005"
filename_pattern: "s-e001-005-tbd-marker-navigation.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-001"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-001"
    optional: true

# === Search Optimization ===
keywords:
  - TBD
  - highlight
  - navigation
  - missing documentation
aliases:
  - TBD navigator
anti_keywords:
  - implementation detail
---

# Story: `s-e001-005-tbd-marker-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e001-005 |
| **Epic** | epic-TSV-001 |
| **Status** | Done |
| **Estimate** | 2 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

---

## User Story

**As a** BA or FA,  
**I want** `{TBD}` markers in an opened artifact to be highlighted and navigable,  
**So that** I can quickly see what documentation is incomplete.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-001](../../epics/epic-TSV-001-dashboard-implementation.md) | Dashboard implementation (BA/FA) | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-001](../../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | BA/FA dashboards increment (AC-4) |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: In Scope

- No deployed TBD marker highlighting/navigation exists in production (greenfield product).

### TO-BE (new behavior)

- When an artifact is opened for reading, `{TBD}` occurrences are highlighted.
- The user can navigate between occurrences (next/previous) within the currently opened artifact.

---

## Acceptance Criteria (AC)

### Scenario 1: Highlight `{TBD}`

- **Given** an artifact is displayed for reading
- **And** the artifact contains the text `{TBD}`
- **When** the artifact is rendered
- **Then** `{TBD}` occurrences are visually highlighted

### Scenario 2: Navigate between occurrences

- **Given** an artifact contains multiple `{TBD}` occurrences
- **When** the user navigates to the next `{TBD}`
- **Then** the reading position moves to the next `{TBD}` occurrence

---

## Technical Notes

- **API**: None (TBD detection is client-side post-render)
- **DB**: None
- **TAI**: Aligns with TA-001 (React component for TBD highlighting)

---

## UX & Copy

- `{TBD}` marker label remains literal: `{TBD}`

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.2 (AC-4)
- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → In Scope (`{TBD}` marker highlighting/navigation)

## Unresolved Items

- Whether to provide a total `{TBD}` count in the viewer → Yes, show count badge (e.g., "3 TBDs")
- Keyboard shortcuts vs buttons for next/previous navigation → Buttons in MVP; keyboard shortcuts deferred
