---
# === LLM Retrieval Metadata ===
artifact_kind: feature
spec_version: "4.0"
template_version: "4.0.1"
title: "Product Portfolio Overview"

# === Ownership ===
role_owner: FA
artifact_type: Product Canon
canonicality: canon
lifecycle: permanent

# === Naming ===
id_pattern: "f-TSV-001"
filename_pattern: "f-TSV-001-product-portfolio-view.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: decision
    pattern: "dec-TSV-*"
    optional: true

# === Search Optimization ===
keywords:
  - feature canon
  - product portfolio
  - product overview
  - project impact
aliases:
  - products overview
anti_keywords:
  - implementation details
  - technical design
  - architecture
  - story
  - delta
  - proposed change
---

# Feature: `f-TSV-001-product-portfolio-view`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Feature (Product Canon)  
**Lifecycle:** Permanent, updated via Canon Sync after deployment

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | f-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Planned |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-14 |
| **Last Updated** | 2026-01-14 |

---

## Governing Decisions

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| ta-TSV-002 | Hono.js backend server | Backend provides /api/products endpoint for product listing |

---

## Purpose

Enable users to see the set of existing products and understand which projects have impact on each product.

---

## Business Value

- **User Impact**: Reduces time spent navigating folders and interpreting naming conventions to understand documentation ownership and project impact.
- **Business Impact**: Improves TeamSpec adoption by making product documentation approachable and discoverable.
- **Success Metrics**: User can identify all products and their targeting projects within 30 seconds of opening the viewer

---

## In Scope

- [ ] Display a list of products.
- [ ] For a selected product, show which projects have impact on that product.
- [ ] Display basic product metadata (including PRX prefix and status).

---

## Out of Scope

- [ ] Editing products or product metadata in the viewer.
- [ ] Permission management (assumes read access).

---

## Actors / Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Product Owner | Oversees products and projects | Understand portfolio state and project relationships |
| Business Analyst | Consumes BA artifacts across products/projects | Find relevant product documentation quickly |
| Functional Analyst | Consumes features/FIs across products/projects | Understand what changes are proposed and where |

---

## Current Behavior

### Product Listing

No deployed behavior exists (greenfield product). MVP implements product listing via `/api/products` endpoint.

### Product → Project Impact

No deployed behavior exists (greenfield product). MVP implements project listing via `/api/products/:productId/projects` endpoint.

### User Flows

1. User opens viewer → sees product portfolio (currently hardcoded to teamspec-viewer for MVP)
2. User selects product → sees list of projects targeting that product
3. User selects project → enters project context for dashboard navigation

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| No products found | Display "No products found" message |
| Product has no projects | Display "No projects target this product" message |
| product.yml missing | Derive product name from folder name |

---

## Business Rules

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-TSV-001 | Products are the root of all documentation | Always |
| BR-TSV-002 | Projects propose changes to one or more products | When showing project impact for a product |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| All Users | Read-only access to product portfolio view |
| PO | Primary consumer for portfolio oversight |
| BA/FA | Consumers for artifact navigation entry point |

---

## Non-Functional Notes

- **Performance**: Product list should load within 2 seconds for workspaces with <50 products
- **Security**: Read-only access; no authentication required for local viewer
- **Accessibility**: WCAG 2.1 AA compliance for navigation elements
- **Availability**: Local application; availability depends on user's machine

---

## Non-Goals

- Provide a file-explorer experience equivalent to Obsidian.

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | What is the authoritative source of "product status" in the product structure (field name + allowed values)? | SA | Resolved | `product.status` in product.yml; values: "active", "deprecated", "archived" (default: "active") |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| [f-TSV-002](f-TSV-002-role-specific-dashboards.md) | Extends (role-focused entry points) |
| [f-TSV-007](f-TSV-007-artifact-search.md) | Complements (finding products/projects via search) |

---

## Change Log

| Date | Source | Change Summary | Author |
|------|--------|----------------|--------|
| 2026-01-14 | — | Initial feature creation | AI-Generated |
| 2026-01-15 | fi-TSV-004 | TBD resolution for MVP implementation | AI-Generated |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope), item 1 “Product Portfolio View”

## Unresolved Items

- ~~Current production behavior for this feature~~ → **RESOLVED**: Greenfield product; MVP behavior documented above
- ~~Success metrics target values~~ → **RESOLVED**: 30-second discovery target defined
