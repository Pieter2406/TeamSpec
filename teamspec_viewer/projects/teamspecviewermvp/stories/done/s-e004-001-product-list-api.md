---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: Product List API Endpoint
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e004-001
filename_pattern: s-e004-001-product-list-api.md
links_required:
  - type: epic
    pattern: epic-TSV-004
    optional: false
  - type: feature-increment
    pattern: fi-TSV-004
    optional: false
keywords:
  - product
  - list
  - API
  - backend
  - portfolio
aliases:
  - product listing api
anti_keywords:
  - full behavior
  - production truth
status: Ready
---

# Story: `s-e004-001-product-list-api`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e004-001 |
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
**I want** the backend to provide a list of all products in the workspace,  
**So that** the frontend can display a product portfolio view.

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

- No deployed product listing behavior exists (greenfield product).
- Users must browse the filesystem to discover products.

### TO-BE (new behavior)

- The backend provides an endpoint `/api/products` that lists all products.
- Products are discovered by scanning the `products/` directory for folders containing `product.yml`.
- Each product entry includes:
  - Product ID (folder name)
  - Product name (from `product.yml` or folder name)
  - PRX prefix
  - Status (when available in `product.yml`)
  - Associated project count

---

## Acceptance Criteria (AC)

### Scenario 1: Products endpoint

- **Given** the backend is running
- **When** a GET request is made to `/api/products`
- **Then** the response contains an array of product objects

### Scenario 2: Product structure

- **Given** the products endpoint returns results
- **When** examining a single product object
- **Then** it contains: `id`, `name`, `prefix`, `status`, and `projectCount` fields

### Scenario 3: Project count calculation

- **Given** a product has multiple projects targeting it
- **When** the product is listed
- **Then** `projectCount` reflects the number of projects with that product in `target_products`

### Scenario 4: Single product workspace

- **Given** only one product exists (`teamspec-viewer`)
- **When** the products endpoint is called
- **Then** exactly one product is returned

---

## Technical Notes

- Scan `products/` directory for subdirectories with `product.yml`.
- Parse YAML to extract `name`, `prefix`, `status`.
- Cross-reference `projects/*/project.yml` to count targeting projects.
- Response format:
  ```json
  {
    "products": [
      {
        "id": "teamspec-viewer",
        "name": "TeamSpec Viewer",
        "prefix": "TSV",
        "status": "active",
        "projectCount": 1
      }
    ]
  }
  ```

---

## Links

- See Linked Epic section above
- See Linked Feature-Increment section above

---

## Out of Scope

- Product creation/editing via API.
- Nested products or product hierarchies.
- Product archiving functionality.

---

## Definition of Done

- [ ] `/api/products` endpoint implemented
- [ ] Products discovered from filesystem correctly
- [ ] Product metadata parsed from `product.yml`
- [ ] Project count calculated correctly
- [ ] Code reviewed and merged
- [ ] Unit and integration tests passing
