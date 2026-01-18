---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: Project Impact Analysis View
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e004-003
filename_pattern: s-e004-003-project-impact-view.md
links_required:
  - type: epic
    pattern: epic-TSV-004
    optional: false
  - type: feature-increment
    pattern: fi-TSV-004
    optional: false
keywords:
  - project
  - impact
  - view
  - product context
  - navigation
aliases:
  - project list view
anti_keywords:
  - full behavior
  - production truth
status: Ready
---

# Story: `s-e004-003-project-impact-view`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e004-003 |
| **Epic** | epic-TSV-004 |
| **Status** | Ready|
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** BA or FA,  
**I want** to see which projects target a selected product,  
**So that** I can understand project impact and select a project context for my work.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-004](../../epics/epic-TSV-004-product-portfolio.md) | Product Portfolio Navigation | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-004](../../feature-increments/fi-TSV-004-product-portfolio-navigation.md) | Product Portfolio Navigation |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-001, Section: Current Behavior

- No deployed project impact view exists (greenfield product).
- Users cannot see which projects target a given product.

### TO-BE (new behavior)

- When a product is selected, the UI shows a list of projects that target it.
- Projects are discovered by checking `target_products` in `project.yml`.
- Each project entry shows:
  - Project name/ID
  - Project status
  - "Enter Project" action to set the project context
- Selecting a project sets it as the active context for dashboards.
- The header/breadcrumb displays the current product and project context.

---

## Acceptance Criteria (AC)

### Scenario 1: Project list for product

- **Given** the user has selected a product (e.g., `teamspec-viewer`)
- **When** the project impact view loads
- **Then** all projects targeting that product are listed

### Scenario 2: Project entry content

- **Given** a project is listed
- **When** examining the entry
- **Then** it shows: project ID, name, and status

### Scenario 3: Enter project context

- **Given** a project is listed
- **When** the user clicks "Enter Project" or the project row
- **Then** the project becomes the active context

### Scenario 4: Context display

- **Given** a product and project are selected
- **When** viewing any page
- **Then** the header shows "Product: TeamSpec Viewer > Project: teamspecviewermvp"

### Scenario 5: No projects

- **Given** a product has no associated projects
- **When** the project impact view loads
- **Then** a message "No projects target this product" is displayed

---

## Technical Notes

- Backend: Add endpoint `/api/products/:productId/projects` or extend `/api/products` response.
- Parse `projects/*/project.yml` for `target_products` matching selected product.
- Context state: Store `selectedProduct` and `selectedProject` in React context.
- Breadcrumb: MUI `Breadcrumbs` component in header.

---

## Links

- See Linked Epic section above
- See Linked Feature-Increment section above

---

## Out of Scope

- Project creation from this view.
- Multi-product targeting visualization.
- Project status workflow management.

---

## Definition of Done

- [ ] Project impact view displays for selected product
- [ ] Projects correctly filtered by `target_products`
- [ ] Project selection sets context
- [ ] Breadcrumb displays current product/project
- [ ] Empty state handled gracefully
- [ ] Code reviewed and merged
- [ ] Unit and integration tests passing
