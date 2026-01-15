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
id_pattern: "dp-e004-s002"
filename_pattern: "dp-e004-s002-product-portfolio-ui.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e004-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - product portfolio
  - UI
  - dashboard
  - cards
aliases:
  - product portfolio ui plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e004-s002-product-portfolio-ui`

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
| **Dev Plan ID** | dp-e004-s002 |
| **Story** | [s-e004-002](../stories/backlog/s-e004-002-product-portfolio-ui.md) |
| **Epic** | epic-TSV-004 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e004-002](../stories/backlog/s-e004-002-product-portfolio-ui.md) | Product Portfolio UI | [fi-TSV-004](../feature-increments/fi-TSV-004-product-portfolio-navigation.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a product portfolio dashboard as the landing page:
1. Display products as cards in a responsive grid
2. Each card shows: name, prefix, status, description, project count
3. Status indicator with color coding
4. Click card to navigate to product detail

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ProductPortfolio.tsx` | New | Product grid/list view |
| `ProductCard.tsx` | New | Individual product card |
| `App.tsx` | Modified | Set as default route |
| `products.ts` (api) | New | API client for products endpoint |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/pages/ProductPortfolio.tsx` | Create | Product portfolio page |
| `frontend/src/components/ProductCard.tsx` | Create | Product card component |
| `frontend/src/api/products.ts` | Create | Products API client |
| `frontend/src/App.tsx` | Modify | Add route, set as default |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/material (Card, Grid, Chip, Typography) | Existing | Approved |
| react-router-dom | Existing | Approved |

### 2.3 Component Design

```typescript
// ProductCard.tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    prefix: string;
    status: 'active' | 'deprecated' | 'archived';
    description: string;
    projectCount: number;
  };
}

// Status color mapping:
// active → green (success)
// deprecated → orange (warning)
// archived → gray (default)
```

### 2.4 Layout Design

```
┌─────────────────────────────────────────────────────────┐
│ Product Portfolio                                       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐                 │
│ │ [TSV]           │ │ [ACME]          │                 │
│ │ TeamSpec Viewer │ │ ACME Products   │                 │
│ │ ───────────────  │ │ ───────────────  │                 │
│ │ Browser viewer  │ │ Example product │                 │
│ │ for TeamSpec    │ │ for demos       │                 │
│ │                 │ │                 │                 │
│ │ [ACTIVE] 1 proj │ │ [ACTIVE] 2 proj │                 │
│ └─────────────────┘ └─────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] ProductCard renders all fields
- [ ] Status chip shows correct color
- [ ] Card click triggers navigation

### 3.2 Integration Tests

- [ ] Portfolio fetches products from API
- [ ] Grid displays all products
- [ ] Click navigates to product detail

### 3.3 Manual Testing

- [ ] Landing page shows product portfolio
- [ ] TeamSpec Viewer product card visible
- [ ] Status shows "ACTIVE" in green
- [ ] Click card navigates to product

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| No products to display | Low | Low | Show empty state message |
| Long descriptions overflow | Medium | Low | Truncate with ellipsis |
| Many products slow to render | Low | Low | Use virtualized grid if needed |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Products displayed as cards | ProductCard component |
| 2 | Card shows name, prefix, status | ProductCard fields |
| 3 | Card shows description | Truncated description |
| 4 | Card shows project count | projectCount badge |
| 5 | Status has color indicator | Chip color based on status |
| 6 | Click card navigates to product | react-router-dom Link |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] ProductCard component created
- [ ] ProductPortfolio page created
- [ ] API client implemented
- [ ] Routes configured
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
