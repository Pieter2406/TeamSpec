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
id_pattern: "dp-e002-s003"
filename_pattern: "dp-e002-s003-fi-story-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e002-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - feature-increment
  - story
  - navigation
  - traceability
aliases:
  - fi story navigation plan
anti_keywords:
  - story definition
  - requirements
---

# Dev Plan: `dp-e002-s003-fi-story-navigation`

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
| **Dev Plan ID** | dp-e002-s003 |
| **Story** | [s-e002-003](../stories/backlog/s-e002-003-fi-story-navigation.md) |
| **Epic** | epic-TSV-002 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e002-003](../stories/backlog/s-e002-003-fi-story-navigation.md) | FI → Story Navigation | [fi-TSV-002](../feature-increments/fi-TSV-002-ba-fa-feature-increment-navigation.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Add a **Linked Stories** section to the FI detail view that:
1. Scans story files for references to the current FI
2. Displays matching stories with ID, title, status, and epic
3. Provides navigation to story detail view

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `LinkedStoriesPanel.tsx` | New | Panel showing stories linked to FI |
| `stories.ts` (route) | New | Backend route for story queries |
| `FIDetailView.tsx` | Modified | Add LinkedStoriesPanel section |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/stories.ts` | Create | Story listing and query endpoints |
| `backend/src/index.ts` | Modify | Register stories routes |
| `frontend/src/components/LinkedStoriesPanel.tsx` | Create | Display linked stories |
| `frontend/src/components/FIDetailView.tsx` | Modify | Add LinkedStoriesPanel |
| `frontend/src/api/stories.ts` | Create | API client for story endpoints |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| gray-matter | Existing | Approved |
| glob | Existing | Approved |

### 2.3 API Changes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/feature-increments/:fiId/stories` | GET | Get stories linked to this FI |
| `/api/stories` | GET | List all stories (with optional filters) |
| `/api/stories/:storyId` | GET | Get story details |

### 2.4 Story Discovery Logic

```typescript
// Scan story files in projects/{id}/stories/**/*.md
// Check front matter links_required for fi-{PRX}-{NNN} pattern
// Also check body content for [fi-TSV-XXX] references
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Story discovery finds stories with FI in front matter
- [ ] Story discovery finds stories with FI in body
- [ ] Empty results handled correctly
- [ ] Story metadata parsed correctly

### 3.2 Integration Tests

- [ ] Stories endpoint returns valid JSON
- [ ] FI stories endpoint filters correctly

### 3.3 Manual Testing

- [ ] View FI detail with linked stories
- [ ] Verify linked stories section shows correct stories
- [ ] Click story to navigate to story detail
- [ ] View FI with no linked stories (empty state)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Stories in different folders (backlog, in-progress, done) | High | Low | Scan all story subdirectories |
| Inconsistent FI reference formats | Medium | Medium | Support multiple pattern variations |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | FI detail view shows "Linked Stories" section | LinkedStoriesPanel component |
| 2 | Stories referencing FI are discovered and listed | Backend scan + front matter/body parsing |
| 3 | Click story navigates to story detail | React Router navigation |
| 4 | Empty state shows appropriate message | "No stories linked to this feature-increment" |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Backend story routes implemented
- [ ] Story discovery logic working
- [ ] LinkedStoriesPanel component created
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
