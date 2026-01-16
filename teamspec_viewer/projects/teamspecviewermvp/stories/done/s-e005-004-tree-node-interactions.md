---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Tree Node Expand/Collapse"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e005-004"
filename_pattern: "s-e005-004-tree-node-interactions.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-005"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-005"
    optional: true

# === Search Optimization ===
keywords:
  - tree interactions
  - click handlers
  - hover tooltip
  - quick view
  - artifact preview
aliases:
  - node interactions
anti_keywords:
  - backend
  - API
---

# Story: `s-e005-004-tree-node-interactions`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e005-004 |
| **Epic** | epic-TSV-005 |
| **Status** | Done |
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Functional Analyst,  
**I want** interactive tree nodes that show quick-view on click and full reader on double-click,  
**So that** I can preview artifacts without losing my tree context, or dive deep when needed.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-005](../../epics/epic-TSV-005-usecase-centric-dashboard.md) | Use-Case Centric Dashboard | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-005](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) | Use-case centric dashboard with visual artifact tree |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Current Behavior → User Flows

- User clicks artifact in list → artifact content is displayed in reader (full drawer opens)
- No hover interaction
- No quick-view preview
- Clicking always opens full reader, losing navigation context

### TO-BE (new behavior)

- **Hover**: Hovering on a tree node shows a tooltip with artifact summary (ID, title, status, first 100 chars of description)
- **Single Click**: Clicking a tree node opens a quick-view side panel showing artifact details while keeping the tree visible
- **Double Click**: Double-clicking opens the full artifact reader (existing behavior)
- Quick-view panel shows:
  - Artifact header (ID, title, status)
  - First section content (Overview/Summary)
  - "Open Full Reader" button

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Hover shows tooltip

- **Given** the artifact tree is displayed
- **When** the user hovers over a tree node for 500ms
- **Then** a tooltip appears showing:
  - Artifact ID
  - Artifact title
  - Status badge
  - First 100 characters of description (if available)

### Scenario 2: Single click opens quick-view

- **Given** the artifact tree is displayed
- **When** the user single-clicks a tree node
- **Then** a side panel opens showing artifact quick-view
- **And** the tree remains visible and interactive
- **And** the clicked node is visually highlighted as "selected"

### Scenario 3: Quick-view panel content

- **Given** a quick-view panel is open
- **When** the user views the panel
- **Then** the panel shows artifact ID, title, and status
- **And** the panel shows the Overview/Summary section content
- **And** an "Open Full Reader" button is displayed

### Scenario 4: Double-click opens full reader

- **Given** the artifact tree is displayed
- **When** the user double-clicks a tree node
- **Then** the full artifact reader opens (existing ArtifactReader component)
- **And** the tree view is hidden (replaced by reader)

### Scenario 5: Quick-view to full reader transition

- **Given** the quick-view panel is open
- **When** the user clicks "Open Full Reader"
- **Then** the full artifact reader opens
- **And** the tree view is hidden

### Scenario 6: Click on expand toggle doesn't trigger quick-view

- **Given** a tree node has an expand/collapse toggle
- **When** the user clicks the toggle (▼/►)
- **Then** the node expands/collapses
- **And** the quick-view panel does NOT open

### Scenario 7: Selecting different node updates quick-view

- **Given** the quick-view panel is open for artifact A
- **When** the user clicks tree node for artifact B
- **Then** the quick-view panel updates to show artifact B
- **And** node B is now highlighted as selected

---

## Technical Notes

- **Tooltip**: MUI Tooltip component with custom delay (500ms)
- **Quick-View Panel**: Side panel (width: 400px) or bottom panel
- **State Management**: 
  - `selectedNodeId: string | null`
  - `quickViewArtifact: Artifact | null`
- **Click vs Double-Click**: Use click timer (250ms) to differentiate
- **Expand Toggle**: Separate click target from node label

---

## UX & Copy

- Tooltip delay: 500ms
- Quick-view panel header: `Quick View`
- Button: "Open Full Reader →"
- Selected node: Highlighted background color

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e005-004)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin format)
- [ ] UX Attached — Panel wireframe needed
- [x] Dependencies Clear
- [x] Estimated
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete
- [ ] FA Accepted
- [ ] Story marked Done in backlog

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e005-002 | Requires | Backlog |

> This story requires the tree component (s-e005-002) to be complete.

---

## Sources Consulted

- [fi-TSV-005-usecase-centric-dashboard.md](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) → Section 3.1.4 "Navigation Interactions"
- Existing ArtifactReader component behavior

## Unresolved Items

- ~~Quick-view panel position~~ → **RESOLVED**: Right-side Drawer (400px width) — consistent with existing ArtifactReader pattern, keeps tree visible on left
