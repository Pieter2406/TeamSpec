---
# === LLM Retrieval Metadata ===
artifact_kind: epic
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "epic-TSV-004"
filename_pattern: "epic-TSV-004-product-portfolio.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-004"
    optional: false

# === Search Optimization ===
keywords:
  - epic
  - product portfolio
  - product list
  - project impact
aliases:
  - portfolio epic
anti_keywords:
  - implementation detail
  - code
  - test case
---

# Epic: `epic-TSV-004-product-portfolio`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-004 |
| **Status** | Proposed |
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-15 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** PO or any TeamSpec user,  
**I want** to see a portfolio view of all products and understand which projects have impact on each product,  
**So that** I can navigate the documentation landscape at a high level before drilling into specific artifacts.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-004](../feature-increments/fi-TSV-004-product-portfolio-navigation.md) | Product portfolio view and project impact navigation | Proposed |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: Users can quickly understand the product landscape and project relationships without navigating folder structures.
- **Business Impact**: Provides PO with portfolio visibility; improves cross-team awareness.
- **Success Metrics**: Time to understand product/project relationships < 30 seconds

### Target State

- Users see a list of all products discovered from `products/` directory.
- Each product shows name, PRX prefix, status, and associated project count.
- Selecting a product shows which projects target that product.
- Product/project context is visible in the UI header.

---

## Stories

| Story ID | Title | Status |
|----------|-------|--------|
| [s-e004-001](../stories/backlog/s-e004-001-product-list-api.md) | Product List API | Backlog |
| [s-e004-002](../stories/backlog/s-e004-002-product-portfolio-ui.md) | Product Portfolio UI | Backlog |
| [s-e004-003](../stories/backlog/s-e004-003-project-impact-view.md) | Project Impact View | Backlog |

---

## Acceptance Criteria (Epic-level)

- [ ] User can view a list of products from the `products/` directory.
- [ ] Each product displays name, PRX prefix, and status.
- [ ] User can select a product to see targeting projects.
- [ ] Selected product/project context is visible in the header.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-15 | AI-Generated | Initial epic creation |

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-004-product-portfolio-navigation.md → TO-BE and Acceptance Criteria

## Unresolved Items

- None
