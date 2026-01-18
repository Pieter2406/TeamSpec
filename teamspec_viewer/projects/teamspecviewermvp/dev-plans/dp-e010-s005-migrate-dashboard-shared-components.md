# Dev Plan: `dp-e010-s005-migrate-dashboard-shared-components`

> **Template Version**: 4.0
> **Last Updated**: 2026-01-18

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e010-s005 |
| **Story** | [s-e010-005](../stories/backlog/s-e010-005-migrate-dashboard-shared-components.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-005](../stories/backlog/s-e010-005-migrate-dashboard-shared-components.md) | Migrate dashboard shared components | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Move dashboard-shared components (panels used by all role dashboards) to `src/features/dashboards/components/`. These components are currently in `src/components/` and are imported by FA/BA/DEV/SA/QA dashboards.

Also create placeholder folders for role-specific dashboards (to be populated in s-e010-006).

### 1.2 Dashboard-Shared Components

| Component | Current Location | Target |
|-----------|------------------|--------|
| `QuickViewPanel.tsx` | `src/components/` | `src/features/dashboards/components/` |
| `LinkedStoriesPanel.tsx` | `src/components/` | `src/features/dashboards/components/` |
| `FeatureFIPanel.tsx` | `src/components/` | `src/features/dashboards/components/` |
| `FIDetailView.tsx` | `src/components/` | `src/features/dashboards/components/` |

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| 4 dashboard panels | Moved | Move to `features/dashboards/components/` |
| Barrel export | New | Create `index.ts` for dashboard shared components |
| Role folders | New | Create placeholder folders for fa/, ba/, dev/, sa/, qa/ |

---

## 2. Technical Design

### 2.1 Files to Move

| Source | Target |
|--------|--------|
| `src/components/QuickViewPanel.tsx` | `src/features/dashboards/components/QuickViewPanel.tsx` |
| `src/components/LinkedStoriesPanel.tsx` | `src/features/dashboards/components/LinkedStoriesPanel.tsx` |
| `src/components/FeatureFIPanel.tsx` | `src/features/dashboards/components/FeatureFIPanel.tsx` |
| `src/components/FIDetailView.tsx` | `src/features/dashboards/components/FIDetailView.tsx` |

### 2.2 Folder Structure to Create

```
src/features/dashboards/
├── components/              # Shared dashboard components
│   ├── QuickViewPanel.tsx
│   ├── LinkedStoriesPanel.tsx
│   ├── FeatureFIPanel.tsx
│   ├── FIDetailView.tsx
│   └── index.ts
├── fa/                      # Placeholder for s-e010-006
├── ba/                      # Placeholder for s-e010-006
├── dev/                     # Placeholder for s-e010-006
├── sa/                      # Placeholder for s-e010-006
└── qa/                      # Placeholder for s-e010-006
```

### 2.3 Barrel Export

**`src/features/dashboards/components/index.ts`:**
```typescript
export { QuickViewPanel } from './QuickViewPanel';
export { LinkedStoriesPanel } from './LinkedStoriesPanel';
export { FeatureFIPanel } from './FeatureFIPanel';
export { FIDetailView } from './FIDetailView';
```

### 2.4 Import Updates Required

**Files using dashboard shared components:**
- `FADashboard.tsx` - imports QuickViewPanel, LinkedStoriesPanel
- `BADashboard.tsx` - imports QuickViewPanel, LinkedStoriesPanel
- `DEVDashboard.tsx` - imports QuickViewPanel, LinkedStoriesPanel
- `SADashboard.tsx` - imports QuickViewPanel, LinkedStoriesPanel
- `QADashboard.tsx` - imports QuickViewPanel, LinkedStoriesPanel

**Pattern:**
```typescript
// Before
import { QuickViewPanel } from './QuickViewPanel';

// After
import { QuickViewPanel } from '@/features/dashboards/components';
```

### 2.5 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases) |
| s-e010-002 | Story | Must be complete (shared module) |
| s-e010-003 | Story | Must be complete (shared components) |
| s-e010-004 | Story | Must be complete (feature modules) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/features/dashboards/shared-components.test.tsx`

- [ ] Test: All dashboard components importable from `@/features/dashboards/components`
- [ ] Test: `QuickViewPanel` renders with mock artifact
- [ ] Test: `LinkedStoriesPanel` renders with mock stories
- [ ] Test: `FeatureFIPanel` renders with mock feature
- [ ] Test: `FIDetailView` renders with mock FI

### 3.2 Integration Tests

**File:** `frontend/src/__tests__/features/dashboards/role-integration.test.tsx`

- [ ] Test: FA dashboard can import shared components
- [ ] Test: BA dashboard can import shared components
- [ ] Test: DEV dashboard can import shared components
- [ ] Test: SA dashboard can import shared components
- [ ] Test: QA dashboard can import shared components

### 3.3 Manual Testing

- [ ] FA dashboard renders panels correctly
- [ ] BA dashboard renders panels correctly
- [ ] DEV dashboard renders panels correctly
- [ ] SA dashboard renders panels correctly
- [ ] QA dashboard renders panels correctly
- [ ] Role switching works without errors

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dashboard imports break | Medium | High | Update imports for each dashboard one at a time |
| Panel props change | Low | Medium | Verify prop interfaces exported correctly |
| Role-specific logic in shared | Low | Medium | Review components before moving |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Dashboard panels migrated | Move QuickViewPanel, LinkedStoriesPanel, etc. |
| 2 | Dashboard layout components migrated | Move FeatureFIPanel, FIDetailView |
| 3 | Dashboard folder structure created | Create fa/, ba/, dev/, sa/, qa/ placeholders |
| 4 | TDD component tests pass | Write FIRST |
| 5 | TDD integration tests pass | All roles can import |
| 6 | Regression: all dashboards work | Role switching, panel rendering |

---

## 6. Task Breakdown

### Task 1: Create TDD component tests (FIRST)

**Description:** Write tests verifying dashboard components can be imported and render.

**File:** `frontend/src/__tests__/features/dashboards/shared-components.test.tsx`

**Acceptance:** Tests written, initially failing  
**Estimate:** 0.5h

### Task 2: Create folder structure

**Description:** Create `features/dashboards/` folder with subfolders.

**Commands:**
```bash
mkdir -p src/features/dashboards/components
mkdir -p src/features/dashboards/{fa,ba,dev,sa,qa}
```

**Acceptance:** Folders exist  
**Estimate:** 0.1h

### Task 3: Move QuickViewPanel

**Description:** Move QuickViewPanel and update imports.

**Commands:**
```bash
git mv src/components/QuickViewPanel.tsx src/features/dashboards/components/
```

**Acceptance:** Component importable from new location  
**Estimate:** 0.5h

### Task 4: Move LinkedStoriesPanel

**Description:** Move LinkedStoriesPanel and update imports.

**Commands:**
```bash
git mv src/components/LinkedStoriesPanel.tsx src/features/dashboards/components/
```

**Acceptance:** Component importable from new location  
**Estimate:** 0.5h

### Task 5: Move FeatureFIPanel

**Description:** Move FeatureFIPanel and update imports.

**Commands:**
```bash
git mv src/components/FeatureFIPanel.tsx src/features/dashboards/components/
```

**Acceptance:** Component importable from new location  
**Estimate:** 0.25h

### Task 6: Move FIDetailView

**Description:** Move FIDetailView and update imports.

**Commands:**
```bash
git mv src/components/FIDetailView.tsx src/features/dashboards/components/
```

**Acceptance:** Component importable from new location  
**Estimate:** 0.25h

### Task 7: Create barrel export

**Description:** Create `src/features/dashboards/components/index.ts`.

**Acceptance:** Named imports work  
**Estimate:** 0.1h

### Task 8: Update all dashboard imports

**Description:** Update FA/BA/DEV/SA/QA dashboard files to use new paths.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 9: Create integration tests

**Description:** Write tests verifying all roles can use shared components.

**File:** `frontend/src/__tests__/features/dashboards/role-integration.test.tsx`

**Acceptance:** Tests verify integration  
**Estimate:** 0.5h

### Task 10: Run TDD tests (green phase)

**Description:** Verify all tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.25h

### Task 11: Regression verification

**Description:** Full manual test of all dashboards.

**Acceptance:** All dashboards render, role switching works  
**Estimate:** 0.5h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e010-001/002/003/004 complete
- [ ] Dependencies identified

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] Folder structure created (Task 2)
- [ ] Panels migrated (Tasks 3-6)
- [ ] Barrel export created (Task 7)
- [ ] Imports updated (Task 8)
- [ ] Integration tests written (Task 9)
- [ ] Tests passing (Task 10)

### Post-Implementation

- [ ] Full regression passed (Task 11)
- [ ] Ready for next story (s-e010-006)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD component tests | 0.5h | | Not Started |
| 2 | Create folder structure | 0.1h | | Not Started |
| 3 | Move QuickViewPanel | 0.5h | | Not Started |
| 4 | Move LinkedStoriesPanel | 0.5h | | Not Started |
| 5 | Move FeatureFIPanel | 0.25h | | Not Started |
| 6 | Move FIDetailView | 0.25h | | Not Started |
| 7 | Create barrel export | 0.1h | | Not Started |
| 8 | Update dashboard imports | 0.5h | | Not Started |
| 9 | Create integration tests | 0.5h | | Not Started |
| 10 | Run tests (green) | 0.25h | | Not Started |
| 11 | Regression verification | 0.5h | | Not Started |
| **Total** | | **3.95h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
