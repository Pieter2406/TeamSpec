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
id_pattern: "dp-e004-s003"
filename_pattern: "dp-e004-s003-project-impact-view.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e004-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - project impact
  - navigation
  - product detail
aliases:
  - project impact view plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e004-s003-project-impact-view`

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
| **Dev Plan ID** | dp-e004-s003 |
| **Story** | [s-e004-003](../stories/backlog/s-e004-003-project-impact-view.md) |
| **Epic** | epic-TSV-004 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e004-003](../stories/backlog/s-e004-003-project-impact-view.md) | Project Impact View | [fi-TSV-004](../feature-increments/fi-TSV-004-product-portfolio-navigation.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

When viewing a product, show projects that target it:
1. Product detail page includes "Targeting Projects" section
2. API endpoint returns projects for a specific product
3. Projects listed with basic info and navigation
4. Enables understanding of what's changing

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `products.ts` (route) | Modified | Add /products/:id/projects endpoint |
| `productService.ts` | Modified | Add getProjectsForProduct method |
| `ProductDetail.tsx` | New | Product detail page |
| `ProjectsList.tsx` | New | List of targeting projects |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/products.ts` | Modify | Add projects sub-endpoint |
| `backend/src/services/productService.ts` | Modify | getProjectsForProduct method |
| `frontend/src/pages/ProductDetail.tsx` | Create | Product detail with projects |
| `frontend/src/components/ProjectsList.tsx` | Create | Projects list component |
| `frontend/src/api/products.ts` | Modify | Add getProjectsForProduct |
| `frontend/src/App.tsx` | Modify | Add product detail route |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/material (List, ListItem, Typography, Paper) | Existing | Approved |
| react-router-dom | Existing | Approved |

### 2.3 API Design

```typescript
// GET /api/products/:productId/projects
// Response:
{
  "productId": "teamspec-viewer",
  "projects": [
    {
      "id": "teamspecviewermvp",
      "name": "TeamSpec Viewer MVP",
      "status": "active",
      "featureIncrementCount": 4
    }
  ],
  "count": 1
}
```

### 2.4 Component Layout

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Portfolio                                     │
├─────────────────────────────────────────────────────────┤
│ TeamSpec Viewer (TSV)                        [ACTIVE]   │
│ ─────────────────────────────────────────────────────   │
│ Browser-based viewer for TeamSpec workspaces            │
├─────────────────────────────────────────────────────────┤
│ Targeting Projects                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ teamspecviewermvp                                   │ │
│ │ TeamSpec Viewer MVP                       [ACTIVE]  │ │
│ │ 4 feature increments                               → │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] getProjectsForProduct returns correct projects
- [ ] Empty projects returns empty array
- [ ] Feature increment count calculated correctly

### 3.2 Integration Tests

- [ ] `/api/products/teamspec-viewer/projects` returns projects
- [ ] Product detail page fetches and displays projects

### 3.3 Manual Testing

- [ ] Navigate to TeamSpec Viewer product
- [ ] Verify teamspecviewermvp listed
- [ ] Project shows correct FI count
- [ ] Click project navigates to project view

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| No projects for product | Low | Low | Show "No active projects" message |
| Many projects slow rendering | Low | Low | Paginate if > 20 projects |
| Invalid project.yml | Low | Medium | Skip invalid, log warning |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Product detail shows targeting projects | ProjectsList component |
| 2 | API returns projects for product | GET /api/products/:id/projects |
| 3 | Project shows name, status | ProjectItem display |
| 4 | Project shows FI count | Count feature-increments folder |
| 5 | Click project navigates | react-router-dom Link |
| 6 | Empty projects shows message | "No active projects" state |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Backend projects endpoint added
- [ ] productService method implemented
- [ ] ProductDetail page created
- [ ] ProjectsList component created
- [ ] Routes configured
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
