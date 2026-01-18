---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Extend RoleSelector Component"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s001"
filename_pattern: "dp-e009-s001-extend-role-selector.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-001"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - role selector
  - DEV role
  - SA role
  - QA role
aliases:
  - role selector extension
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s001-extend-role-selector`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e009-s001 |
| **Story** | [s-e009-001](../stories/done/s-e009-001-extend-role-selector.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-001](../stories/done/s-e009-001-extend-role-selector.md) | Extend RoleSelector Component | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Extend the existing RoleSelector component to support three additional roles (DEV, SA, QA):
1. Update the `ActiveRole` type to include new roles
2. Add new role configurations to `AVAILABLE_ROLES` array
3. Add appropriate Material-UI icons for each new role
4. Update RoleContext to handle new role types

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `RoleSelector.tsx` | Modified | Add DEV, SA, QA to role list with icons and descriptions |
| `RoleContext.tsx` | Modified | Extend Role type to include 'DEV' \| 'SA' \| 'QA' |
| `RoleBadge.tsx` | Modified | Add badge colors for new roles |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/RoleSelector.tsx` | Modify | Add 3 new role options |
| `frontend/src/contexts/RoleContext.tsx` | Modify | Extend Role type |
| `frontend/src/components/RoleBadge.tsx` | Modify | Add colors for new roles |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/icons-material | Existing | Use existing icons (CodeIcon, ArchitectureIcon, BugReportIcon) |

### 2.3 Implementation Details

```typescript
// RoleSelector.tsx - Updated AVAILABLE_ROLES

import CodeIcon from '@mui/icons-material/Code';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BugReportIcon from '@mui/icons-material/BugReport';

type ActiveRole = 'BA' | 'FA' | 'DEV' | 'SA' | 'QA';

const AVAILABLE_ROLES = [
    // ... existing BA and FA ...
    {
        id: 'DEV' as const,
        label: 'Developer',
        description: 'Dev-plans, stories, technical docs',
        icon: CodeIcon,
        color: '#10b981', // emerald
    },
    {
        id: 'SA' as const,
        label: 'Solution Architect',
        description: 'Solution designs, technical architectures',
        icon: ArchitectureIcon,
        color: '#8b5cf6', // purple
    },
    {
        id: 'QA' as const,
        label: 'QA Engineer',
        description: 'Test cases, regression tests, bug reports',
        icon: BugReportIcon,
        color: '#f59e0b', // amber
    },
];
```

```typescript
// RoleContext.tsx - Type update

export type Role = 'BA' | 'FA' | 'DEV' | 'SA' | 'QA' | null;
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Test that RoleSelector renders all 5 role options
- [ ] Test that clicking DEV role updates context correctly
- [ ] Test that clicking SA role updates context correctly
- [ ] Test that clicking QA role updates context correctly

### 3.2 Integration Tests

- [ ] Test role switching from any role to any other role
- [ ] Test that RoleBadge displays correct color for new roles

### 3.3 Manual Testing

- [ ] Verify all 5 role cards display with correct icons
- [ ] Verify role descriptions are readable
- [ ] Verify role badge shows in header after selection

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing BA/FA behavior | Low | High | Keep existing role configs unchanged, only add new ones |
| Type errors from Role type change | Medium | Medium | Update all usages of Role type systematically |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Display 5 role options | Add DEV, SA, QA to AVAILABLE_ROLES array |
| 2 | Select DEV navigates to DEV dashboard | RoleContext update + router logic |
| 3 | Select SA navigates to SA dashboard | RoleContext update + router logic |
| 4 | Select QA navigates to QA dashboard | RoleContext update + router logic |
| 5 | Role switching via header badge | RoleBadge click → show RoleSelector |
| 6 | Role descriptions displayed | Add description field to new role configs |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [x] Code implemented
- [ ] Unit tests written
- [ ] Code reviewed
- [x] Tests passing

### Post-Implementation

- [ ] Documentation updated
- [ ] Story marked complete

---

## Change Log

| Date | Author | Status | Summary |
|------|--------|--------|---------|
| 2026-01-17 | DEV Agent | Draft | Initial dev plan |
| 2026-01-17 | DEV Agent | Implemented | Added DEV/SA/QA roles to RoleSelector, RoleContext, RoleBadge |
