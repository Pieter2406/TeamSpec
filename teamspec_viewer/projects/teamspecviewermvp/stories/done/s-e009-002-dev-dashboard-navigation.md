---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: DEV Dashboard Navigation
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e009-002
filename_pattern: s-e009-002-dev-dashboard-navigation.md
links_required:
  - type: epic
    pattern: epic-TSV-009
    optional: false
  - type: feature-increment
    pattern: fi-TSV-009
    optional: true
keywords:
  - DEV dashboard
  - developer dashboard
  - dev-plans
  - stories navigation
  - technical architecture
aliases:
  - developer view
anti_keywords:
  - implementation detail
status: Done
---

# Story: `s-e009-002-dev-dashboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-002 |
| **Epic** | epic-TSV-009 |
| **Status** | Done|
| **Estimate** | 5 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer,  
**I want** a dashboard that shows dev-plans, stories, and technical architecture documents,  
**So that** I can quickly navigate to implementation-related artifacts without browsing folder structures.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) | DEV/SA/QA Role Dashboards | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-009](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role selection + dashboard navigation |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Role Dashboard Content

- Only BA and FA dashboards exist
- Developers must use folder navigation or search to find dev-plans
- No curated view of developer-relevant artifacts

### TO-BE (new behavior)

- New DEVDashboard component provides curated navigation for developers
- Dashboard displays artifacts grouped by type:
  - **Dev Plans** (`dp-eXXX-sYYY-*.md`) from selected project
  - **Stories** (`s-eXXX-YYY-*.md`) from selected project
  - **Technical Architectures** (`ta-PRX-*.md`) from selected product
  - **Technical Architecture Increments** (`tai-PRX-*.md`) from selected project
- Each artifact entry shows:
  - Artifact ID and title
  - Status (e.g., Draft, In-Progress, Implemented)
  - Scope indicator (Product or Project)
- Tree navigation allows drilling into related artifacts:
  - Dev plan → linked story → linked epic
- Empty state message when no artifacts exist for a category

---

## Acceptance Criteria (AC)

### Scenario 1: Display Dev Plans

- **Given** the user is on the DEV dashboard
- **And** dev-plans exist in the selected project
- **When** viewing the "Dev Plans" section
- **Then** all dev-plans are listed with ID, title, and status

### Scenario 2: Display Stories

- **Given** the user is on the DEV dashboard
- **And** stories exist in the selected project
- **When** viewing the "Stories" section
- **Then** all stories are listed with ID, title, and status
- **And** stories are grouped or filterable by status

### Scenario 3: Display Technical Architecture (Product)

- **Given** the user is on the DEV dashboard
- **And** TA documents exist in the selected product
- **When** viewing the "Technical Architecture" section
- **Then** product-level TA documents are listed
- **And** each entry is marked as "Product" scope

### Scenario 4: Display TAI (Project)

- **Given** the user is on the DEV dashboard
- **And** TAI documents exist in the selected project
- **When** viewing the "Technical Architecture Increments" section
- **Then** project-level TAI documents are listed
- **And** each entry is marked as "Project" scope

### Scenario 5: Navigate to Artifact

- **Given** the user is on the DEV dashboard
- **When** the user clicks on a dev-plan entry
- **Then** the artifact content is displayed in the reader panel

### Scenario 6: Empty State

- **Given** the user is on the DEV dashboard
- **And** no dev-plans exist in the selected project
- **When** viewing the "Dev Plans" section
- **Then** message "No dev-plans found" is displayed

### Scenario 7: Navigate from Dev Plan to Story

- **Given** a dev-plan links to story s-e001-042
- **When** the user views the dev-plan tree node
- **Then** the linked story is shown as a child/related item
- **And** the user can navigate to the story

---

## Technical Notes

- **File**: `frontend/src/components/DEVDashboard.tsx`
- **Components**: Reuse `ArtifactTree` pattern from FADashboard
- **API Calls**:
  - `GET /api/projects/:projectId/dev-plans`
  - `GET /api/projects/:projectId/stories`
  - `GET /api/products/:productId/technical-architecture`
  - `GET /api/projects/:projectId/tai`
- **State**: Use existing product/project context from `ProductContext`

---

## UX & Copy

| Section | Empty State Message |
|---------|---------------------|
| Dev Plans | No dev-plans found for this project |
| Stories | No stories found for this project |
| Technical Architecture | No TA documents found for this product |
| TAI | No TAI documents found for this project |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-002)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — Empty state copy provided
- [x] Dependencies Clear — Depends on s-e009-001 (RoleSelector), s-e009-005 (API)
- [x] Estimated — 5 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
