---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Feature Card Layout Design"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e005-001"
filename_pattern: "s-e005-001-feature-card-layout.md"

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
  - feature cards
  - FA dashboard
  - use-case centric
  - primary artifacts
aliases:
  - feature-centric layout
anti_keywords:
  - implementation detail
---

# Story: `s-e005-001-feature-card-layout`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e005-001 |
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
**I want** Features displayed as prominent interactive cards (rather than one of four equal lists),  
**So that** I immediately see Features as my primary focal artifacts and can expand into related work items.

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

- [ ] **Adds Behavior**
- [x] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Current Behavior → Role Dashboard Content

- FA Dashboard displays four equal-weight artifact lists in a 2x2 grid:
  - Features (top-left)
  - Feature-Increments (top-right)
  - Epics (bottom-left)
  - Stories (bottom-right)
- All four lists have equal visual prominence
- User clicks an item → artifact opens in reader

### TO-BE (new behavior)

- FA Dashboard displays **Features as primary focal cards** in a prominent section
- Each Feature card displays:
  - Feature ID and title
  - Feature status (if available)
  - Badge showing count of linked FIs (e.g., "2 FIs")
  - Expand/collapse toggle (▼/►) to reveal linked artifacts
- Feature-Increments, Epics, and Stories are **nested under their parent Feature** (tree structure)
- The four separate equal-weight lists are **removed**

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Features as primary cards

- **Given** the user is on the FA Dashboard
- **When** the dashboard loads
- **Then** Features are displayed as prominent interactive cards
- **And** Features are visually distinguished as primary artifacts (larger, more prominent than nested items)

### Scenario 2: Feature card content

- **Given** a Feature card is displayed
- **When** the user views the card
- **Then** the card shows Feature ID, title, and status
- **And** the card shows a badge with count of linked FIs (e.g., "2 FIs")
- **And** the card has an expand/collapse toggle

### Scenario 3: Four-list layout removed

- **Given** the user is on the FA Dashboard
- **When** the dashboard loads
- **Then** the previous 2x2 grid of four equal artifact lists is no longer displayed
- **And** FIs, Epics, and Stories appear only when nested under a Feature

### Scenario 4: Feature with no FIs

- **Given** a Feature has no linked Feature-Increments
- **When** the Feature card is displayed
- **Then** the badge shows "0 FIs"
- **And** expanding the Feature shows "No linked increments"

---

## Technical Notes

- **Component**: Replace `FADashboard.tsx` grid layout with FeatureCardList component
- **Data**: Use existing `getFeatures()` API; enhance to include FI count
- **UI Library**: MUI Card components for Feature cards
- **State**: Track expanded Feature IDs in component state

---

## UX & Copy

- Card header: `{Feature ID} — {Feature Title}`
- Badge: `{N} FIs` or `0 FIs`
- Toggle icons: ▼ (expanded), ► (collapsed)
- Empty state: "No linked increments"

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e005-001)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin format)
- [ ] UX Attached (or "No UI required") — Wireframe in fi-TSV-005
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

## Sources Consulted

- [fi-TSV-005-usecase-centric-dashboard.md](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) → Section 3.1.1 "FA Dashboard: Feature-Centric Hub"
- [FADashboard.tsx](../../../frontend/src/components/FADashboard.tsx) → Current 2x2 grid implementation

## Unresolved Items

- None
