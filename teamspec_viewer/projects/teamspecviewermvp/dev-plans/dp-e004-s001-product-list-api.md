---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e004-s001"
filename_pattern: "dp-e004-s001-product-list-api.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e004-001"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - product
  - API
  - listing
  - portfolio
aliases:
  - product list api plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e004-s001-product-list-api`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-15

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e004-s001 |
| **Story** | [s-e004-001](../stories/backlog/s-e004-001-product-list-api.md) |
| **Epic** | epic-TSV-004 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e004-001](../stories/backlog/s-e004-001-product-list-api.md) | Product List API | [fi-TSV-004](../feature-increments/fi-TSV-004-product-portfolio-navigation.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement API endpoint that:
1. Scans `products/` directory for product folders
2. Parses each `product.yml` for metadata
3. Counts associated projects per product
4. Returns structured JSON with product details

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `products.ts` (route) | New | Products API endpoint handler |
| `productService.ts` | New | Product scanning and parsing logic |
| `index.ts` | Modified | Register products routes |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/products.ts` | Create | Products endpoint handler |
| `backend/src/services/productService.ts` | Create | Product discovery and parsing |
| `backend/src/index.ts` | Modify | Register products route |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| js-yaml | Existing | Approved |
| glob | Existing | Approved |

### 2.3 API Design

```typescript
// GET /api/products
// Response:
{
  "products": [
    {
      "id": "teamspec-viewer",
      "name": "TeamSpec Viewer",
      "prefix": "TSV",
      "status": "active",
      "description": "Browser-based viewer for TeamSpec workspaces",
      "projectCount": 1
    }
  ],
  "count": 1
}
```

### 2.4 Product Discovery Logic

```typescript
// 1. Glob all products/*/product.yml files
// 2. For each product.yml:
//    a. Parse YAML content
//    b. Extract: id, name, prefix, status, description
//    c. Count projects where target_products includes this product
// 3. Sort by name alphabetically
// 4. Return structured response
```

### 2.5 Project Counting Logic

```typescript
// For each product, count projects targeting it:
function countProjectsForProduct(productId: string): number {
  // 1. Glob all projects/*/project.yml files
  // 2. For each project.yml:
  //    a. Parse YAML
  //    b. Check if target_products array includes productId
  // 3. Return count
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Parses product.yml correctly
- [ ] Handles missing optional fields gracefully
- [ ] Counts projects accurately
- [ ] Empty products directory returns empty array

### 3.2 Integration Tests

- [ ] `/api/products` returns all products
- [ ] Product includes accurate projectCount

### 3.3 Manual Testing

- [ ] API returns teamspec-viewer product
- [ ] projectCount shows 1 (teamspecviewermvp)
- [ ] All fields populated correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Invalid product.yml format | Low | Medium | Validate YAML schema, skip invalid |
| No products directory | Low | Low | Return empty array with warning |
| Missing optional fields | Medium | Low | Default values for optional fields |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | GET `/api/products` returns all products | productService.getAllProducts() |
| 2 | Response includes id, name, prefix, status | Parse from product.yml |
| 3 | Response includes description | product.yml description field |
| 4 | Response includes projectCount | Count from project.yml target_products |
| 5 | Empty workspace returns empty array | Handle gracefully |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Product service implemented
- [ ] Products endpoint created
- [ ] Project counting logic added
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
