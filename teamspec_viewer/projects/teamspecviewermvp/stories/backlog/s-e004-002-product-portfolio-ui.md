---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e004-002"
filename_pattern: "s-e004-002-product-portfolio-ui.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-004"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-004"
    optional: false

# === Search Optimization ===
keywords:
  - product
  - portfolio
  - UI
  - frontend
  - landing page
aliases:
  - product portfolio view
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e004-002-product-portfolio-ui`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e004-002 |
| **Epic** | epic-TSV-004 |
| **Status** | Backlog |
| **Estimate** | 5 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** BA or FA,  
**I want** to see a visual portfolio of all products in the workspace,  
**So that** I can select a product and understand the overall product landscape.

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

- No deployed product portfolio UI exists (greenfield product).
- Users start directly in a hardcoded product/project context.

### TO-BE (new behavior)

- A "Product Portfolio" view displays all products as cards or list items.
- Each product card shows:
  - Product name and PRX prefix
  - Status badge (Active, Planned, etc.)
  - Number of associated projects
- Products are sorted alphabetically by name.
- Clicking a product selects it and shows the project impact view.
- The selected product is highlighted and stored in context.

---

## Acceptance Criteria (AC)

### Scenario 1: Portfolio view display

- **Given** the user navigates to the product portfolio
- **When** the view loads
- **Then** all products are displayed as cards with name, prefix, and project count

### Scenario 2: Product card content

- **Given** a product card is displayed
- **When** examining the card
- **Then** it shows: product name, PRX prefix badge, status, and "N projects" indicator

### Scenario 3: Product selection

- **Given** the portfolio view is displayed
- **When** the user clicks on a product card
- **Then** that product is selected and the UI shows product details/projects

### Scenario 4: Selection indicator

- **Given** a product is selected
- **When** viewing the portfolio
- **Then** the selected product card has a visual highlight (border, background)

### Scenario 5: Empty state

- **Given** no products exist in the workspace
- **When** the portfolio view loads
- **Then** a message "No products found" is displayed

---

## Technical Notes

- Component: `ProductPortfolio` page with `ProductCard` components.
- Layout: CSS Grid or Flexbox for responsive card layout.
- State: Selected product stored in React context or URL state.
- MUI: Use `Card`, `CardContent`, `Chip` for badges.

---

## Out of Scope

- Product creation from UI.
- Product editing/deletion.
- Product filtering or grouping.

---

## Definition of Done

- [ ] Product portfolio view implemented
- [ ] Product cards display required information
- [ ] Product selection works and persists in context
- [ ] Empty state handled gracefully
- [ ] Responsive layout for different screen sizes
- [ ] Code reviewed and merged
- [ ] Unit and integration tests passing
