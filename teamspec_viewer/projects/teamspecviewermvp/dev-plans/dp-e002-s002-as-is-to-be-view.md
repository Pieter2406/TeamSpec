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
id_pattern: "dp-e002-s002"
filename_pattern: "dp-e002-s002-as-is-to-be-view.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e002-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - AS-IS
  - TO-BE
  - delta view
  - tabs
aliases:
  - as-is to-be view plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e002-s002-as-is-to-be-view`

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
| **Dev Plan ID** | dp-e002-s002 |
| **Story** | [s-e002-002](../stories/backlog/s-e002-002-as-is-to-be-view.md) |
| **Epic** | epic-TSV-002 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e002-002](../stories/backlog/s-e002-002-as-is-to-be-view.md) | AS-IS/TO-BE View | [fi-TSV-002](../feature-increments/fi-TSV-002-ba-fa-feature-increment-navigation.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a **Feature-Increment Detail View** component that:
1. Parses the FI markdown to extract AS-IS (Section 2) and TO-BE (Section 3) content
2. Displays these sections in a tabbed interface using MUI Tabs
3. Renders markdown content with proper formatting

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `FIDetailView.tsx` | New | Main FI detail view with tabs |
| `fiParser.ts` (util) | New | Utility to extract AS-IS/TO-BE sections from FI markdown |
| `artifacts.ts` (route) | Modified | Add FI detail endpoint with parsed sections |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/artifacts.ts` | Modify | Add endpoint for parsed FI sections |
| `backend/src/utils/fiParser.ts` | Create | Parse FI markdown into AS-IS/TO-BE sections |
| `frontend/src/components/FIDetailView.tsx` | Create | Tabbed view for AS-IS/TO-BE |
| `frontend/src/api/artifacts.ts` | Modify | Add FI sections API call |
| `frontend/src/App.tsx` | Modify | Add route for FI detail view |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/material (Tabs, Tab, Box) | Existing | Approved |
| react-markdown | Existing | Approved |

### 2.3 API Changes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/feature-increments/:fiId/sections` | GET | Returns parsed AS-IS and TO-BE sections |

### 2.4 Section Parsing Logic

```typescript
// Parse FI markdown to extract sections
// Look for "## 2. AS-IS" through "## 3. TO-BE" for AS-IS content
// Look for "## 3. TO-BE" through "## 4." or EOF for TO-BE content
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] FI parser correctly extracts AS-IS section
- [ ] FI parser correctly extracts TO-BE section
- [ ] Parser handles missing sections gracefully
- [ ] Parser handles malformed markdown

### 3.2 Integration Tests

- [ ] FI sections endpoint returns valid JSON with asIs and toBe fields
- [ ] Tabs component switches between views correctly

### 3.3 Manual Testing

- [ ] Select an FI from the list
- [ ] Verify AS-IS tab shows correct content
- [ ] Verify TO-BE tab shows correct content
- [ ] Verify markdown renders correctly (headers, lists, tables)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| FI section headers vary | Medium | Medium | Flexible regex matching for section headers |
| AS-IS content references external feature | Low | Low | Display reference text, not external content |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | FI detail view displays AS-IS and TO-BE tabs | MUI Tabs component in FIDetailView |
| 2 | AS-IS content sourced from FI Section 2 | fiParser extracts Section 2 content |
| 3 | TO-BE content sourced from FI Section 3 | fiParser extracts Section 3 content |
| 4 | Markdown renders correctly | react-markdown with remark-gfm |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Backend parser implemented
- [ ] FI sections endpoint added
- [ ] Frontend tabs component created
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
