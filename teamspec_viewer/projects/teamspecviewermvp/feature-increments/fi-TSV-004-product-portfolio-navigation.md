---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Product Portfolio Navigation"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-004"
filename_pattern: "fi-TSV-004-product-portfolio-navigation.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-001"
    optional: false
    note: "Target feature that this FI modifies"
  - type: epic
    pattern: "epic-TSV-*"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - product portfolio
  - product list
  - project impact
  - MVP
aliases:
  - product portfolio increment
  - product navigation increment
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-004-product-portfolio-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

> **ID:** fi-TSV-004  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-001-product-portfolio-view`  
> **Epic:** epic-TSV-004 (Product Portfolio - planned)  
> **Status:** proposed

---

## 1. Overview

This increment defines MVP behavior for **product portfolio navigation**, enabling users to see the list of products in the TeamSpec workspace and understand which projects have impact on each product. This is the foundational navigation layer that sits above role-specific dashboards.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(Exact copy from `f-TSV-001-product-portfolio-view` → "Current Behavior")

### Product Listing

No deployed behavior exists (greenfield product).

### Product → Project Impact

No deployed behavior exists (greenfield product).

### User Flows

1. Not applicable (no prior system).

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| Not applicable | No prior system |

### 2.2 Current Limitations

- No deployed product portfolio behavior exists; Feature Canon is establishing the first specification.
- Currently, users must navigate the file system to discover products and projects.

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

#### Product Portfolio Landing

- The system provides a **product portfolio view** that lists all products discovered in the `products/` directory.
- Each product entry displays:
  - Product name (from `product.yml` or derived from folder name)
  - Product prefix (PRX code, e.g., "TSV")
  - Product status when available (e.g., Active, Planned, Deprecated)
  - Count of associated projects
- Products are listed in alphabetical order by product name.

#### Product Selection

- Users can click on a product to see its details and associated projects.
- The selected product becomes the context for subsequent navigation (role dashboards, artifacts).

#### Project Impact View

- For a selected product, the system displays which projects target that product.
- Projects are derived by scanning `projects/*/project.yml` for `target_products` that include the selected product ID.
- Each project entry shows:
  - Project name/ID
  - Project status (when available)
  - Link to enter the project context

#### Navigation Integration

- From the product portfolio view, users can:
  - Select a product to view its details
  - Select a project within a product to set the project context
  - Proceed to role-specific dashboards with the selected product/project context
- The currently selected product and project are displayed in the header/breadcrumb.

#### Context Management (MVP)

- **Default context**: If only one product exists, it is auto-selected.
- **MVP scope**: The viewer initially loads with `teamspec-viewer` product and `teamspecviewermvp` project pre-selected (hardcoded for MVP).
- **Future enhancement**: Full product/project selection from portfolio view (post-MVP).

### 3.2 Acceptance Criteria

- [ ] AC-1: A user can view a list of products discovered from the `products/` directory.
- [ ] AC-2: Each product entry displays the product name, PRX prefix, and status (when available).
- [ ] AC-3: A user can select a product to see which projects target that product.
- [ ] AC-4: The currently selected product/project context is visible in the UI (header or breadcrumb).
- [ ] AC-5: For MVP, the system loads with `teamspec-viewer` and `teamspecviewermvp` as the default context.

### 3.3 Out of Scope

- Editing product or project metadata from the viewer (read-only).
- Creating new products or projects from the viewer.
- Permission management (assumes read access to all files).
- Multi-product selection (one product context at a time).
- Project creation or modification.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-001 | Modified | Establishes initial product portfolio view behavior |
| f-TSV-002 | Referenced | Role dashboards will receive product/project context from portfolio selection |

### 4.2 Dependencies

- **fi-TSV-001** (Role Dashboards): The product/project context set by this FI feeds into role dashboards.
- **Backend API**: Requires endpoint to list products and projects from filesystem.

### 4.3 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Inconsistent product.yml formats | Medium | Low | Gracefully degrade to folder-name fallback |
| Large number of products | Low | Low | Pagination or lazy loading (post-MVP) |
| Missing project.yml in projects | Medium | Low | Skip projects without valid project.yml |

---

## 5. Implementation Notes

### 5.1 Technical Considerations

- Backend must scan `products/*/product.yml` to build product index.
- Backend must scan `projects/*/project.yml` to determine target_products mapping.
- Consider caching the product/project index on startup or first request.
- API design should align with existing artifact listing endpoints.

### 5.2 Testing Strategy

- Unit tests for product/project scanning logic.
- Integration tests for product list API endpoint.
- Manual verification of product → project navigation flow.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-15 | AI-Generated | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-001-product-portfolio-view.md → Purpose, In Scope, Business Rules
- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope), item 1 "Product Portfolio View"
- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Context management pattern

## Unresolved Items

- ~~Exact API response schema for product/project listing~~ → **RESOLVED**: See Section 5.1 API Design below
- ~~Product status field location in product.yml~~ → **RESOLVED**: `product.status` field with values: "active" | "deprecated" | "archived" (default: "active")

---

## 5.1 API Design (Resolved)

### GET /api/products

```json
{
  "products": [
    {
      "id": "teamspec-viewer",
      "name": "Teamspec Viewer",
      "prefix": "TSV",
      "status": "active",
      "description": "...",
      "projectCount": 1
    }
  ]
}
```

### GET /api/products/:productId/projects

```json
{
  "productId": "teamspec-viewer",
  "projects": [
    {
      "id": "teamspecviewermvp",
      "name": "TeamSpec Viewer MVP",
      "status": "active",
      "targetProducts": ["teamspec-viewer"]
    }
  ]
}
```
