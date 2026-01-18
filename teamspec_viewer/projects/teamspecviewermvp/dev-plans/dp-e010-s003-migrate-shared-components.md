# Dev Plan: `dp-e010-s003-migrate-shared-components`

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
| **Dev Plan ID** | dp-e010-s003 |
| **Story** | [s-e010-003](../stories/backlog/s-e010-003-migrate-shared-components.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-003](../stories/backlog/s-e010-003-migrate-shared-components.md) | Migrate shared components | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Migrate reusable UI components from `src/components/` to `src/shared/components/`. Components are categorized as:
- **Artifact components**: `ArtifactTree.tsx`, `ArtifactReader.tsx`, `ArtifactList.tsx`
- **Form/Status components**: `StatusDropdown.tsx`, `TBDIndicator.tsx`, `TbdHighlighter.tsx`
- **UI primitives**: `RoleBadge.tsx`, `IconLegend.tsx`

Feature-specific components (dashboards, cards) remain in `src/components/` for now.

### 1.2 Component Classification

| Component | Classification | Move? | Reason |
|-----------|----------------|-------|--------|
| `ArtifactTree.tsx` | Shared | ✅ | Used by all dashboards |
| `ArtifactReader.tsx` | Shared | ✅ | Used by all dashboards |
| `ArtifactList.tsx` | Shared | ✅ | Used by search |
| `StatusDropdown.tsx` | Shared | ✅ | Used across features |
| `TBDIndicator.tsx` | Shared | ✅ | Used across features |
| `TbdHighlighter.tsx` | Shared | ✅ | Used across features |
| `RoleBadge.tsx` | Shared | ✅ | Used by role selector |
| `IconLegend.tsx` | Shared | ✅ | Used by layout |
| `FADashboard.tsx` | Feature-specific | ❌ | Dashboard feature |
| `BADashboard.tsx` | Feature-specific | ❌ | Dashboard feature |
| `DEVDashboard.tsx` | Feature-specific | ❌ | Dashboard feature |
| `SADashboard.tsx` | Feature-specific | ❌ | Dashboard feature |
| `QADashboard.tsx` | Feature-specific | ❌ | Dashboard feature |
| `*Tree.tsx` | Feature-specific | ❌ | Dashboard feature |
| `*Card.tsx` | Feature-specific | ❌ | Feature components |
| `Header.tsx` | Feature-specific | ❌ | Layout feature |
| `Search*.tsx` | Feature-specific | ❌ | Search feature |
| `Product*.tsx` | Feature-specific | ❌ | Portfolio feature |

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| 8 shared components | Moved | Move to `src/shared/components/` |
| Barrel export | New | Create `index.ts` for shared components |
| Import statements | Modified | Update across codebase |

---

## 2. Technical Design

### 2.1 Files to Move (git mv)

| Source | Target |
|--------|--------|
| `src/components/ArtifactTree.tsx` | `src/shared/components/ArtifactTree.tsx` |
| `src/components/ArtifactReader.tsx` | `src/shared/components/ArtifactReader.tsx` |
| `src/components/ArtifactList.tsx` | `src/shared/components/ArtifactList.tsx` |
| `src/components/StatusDropdown.tsx` | `src/shared/components/StatusDropdown.tsx` |
| `src/components/TBDIndicator.tsx` | `src/shared/components/TBDIndicator.tsx` |
| `src/components/TbdHighlighter.tsx` | `src/shared/components/TbdHighlighter.tsx` |
| `src/components/RoleBadge.tsx` | `src/shared/components/RoleBadge.tsx` |
| `src/components/IconLegend.tsx` | `src/shared/components/IconLegend.tsx` |

### 2.2 Barrel Export

**`src/shared/components/index.ts`:**
```typescript
export { ArtifactTree } from './ArtifactTree';
export { ArtifactReader } from './ArtifactReader';
export { ArtifactList } from './ArtifactList';
export { StatusDropdown } from './StatusDropdown';
export { TBDIndicator } from './TBDIndicator';
export { TbdHighlighter } from './TbdHighlighter';
export { RoleBadge } from './RoleBadge';
export { IconLegend } from './IconLegend';
```

### 2.3 Import Updates Required

**Pattern transformations:**
- `from '../components/ArtifactTree'` → `from '@/shared/components'`
- `from './ArtifactTree'` → `from '@/shared/components'`
- `from '../../components/StatusDropdown'` → `from '@/shared/components'`

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases) |
| s-e010-002 | Story | Must be complete (contexts/hooks moved) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/shared/components.test.tsx`

- [ ] Test: All shared components importable from `@/shared/components`
- [ ] Test: `ArtifactTree` renders with mock data
- [ ] Test: `ArtifactReader` renders with mock content
- [ ] Test: `StatusDropdown` shows options
- [ ] Test: `TBDIndicator` renders indicator
- [ ] Test: Props interfaces exported correctly

### 3.2 Behavior Regression Tests

**Files:** Per-component test files

- [ ] `ArtifactTree` - tree structure renders, expand/collapse works
- [ ] `ArtifactReader` - markdown content displays
- [ ] `StatusDropdown` - selection works, onChange fires
- [ ] `TBDIndicator` - counts TBDs correctly

### 3.3 Manual Testing

- [ ] FA dashboard displays tree and reader
- [ ] BA dashboard displays tree and reader
- [ ] DEV dashboard displays tree and reader
- [ ] SA dashboard displays tree and reader
- [ ] QA dashboard displays tree and reader
- [ ] Status dropdown works in all contexts
- [ ] TBD indicators display correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Broken component imports | Medium | High | Use grep to find all imports, update incrementally |
| Missing prop type exports | Medium | Medium | Verify type exports in barrel file |
| Visual regression | Low | Medium | Manual check each dashboard after migration |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Artifact components migrated | Move ArtifactTree, ArtifactReader, ArtifactList |
| 2 | Form components migrated | Move StatusDropdown, TBDIndicator, TbdHighlighter |
| 3 | Other shared components migrated | Move RoleBadge, IconLegend |
| 4 | Barrel export created | Create index.ts with all exports |
| 5 | TDD tests pass | Write components.test.tsx FIRST |
| 6 | Behavior tests pass | Per-component behavior tests |
| 7 | Regression: all pages render | All dashboards, search, portfolio work |

---

## 6. Task Breakdown

### Task 1: Create TDD component tests (FIRST)

**Description:** Write tests verifying components can be imported and render.

**File:** `frontend/src/__tests__/shared/components.test.tsx`

**Acceptance:** Tests written, initially failing  
**Estimate:** 1h

### Task 2: Move artifact components

**Description:** Move ArtifactTree, ArtifactReader, ArtifactList.

**Commands:**
```bash
git mv src/components/ArtifactTree.tsx src/shared/components/
git mv src/components/ArtifactReader.tsx src/shared/components/
git mv src/components/ArtifactList.tsx src/shared/components/
```

**Acceptance:** Files moved  
**Estimate:** 0.25h

### Task 3: Update artifact component imports

**Description:** Update all files importing artifact components.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 1h

### Task 4: Move form/status components

**Description:** Move StatusDropdown, TBDIndicator, TbdHighlighter.

**Commands:**
```bash
git mv src/components/StatusDropdown.tsx src/shared/components/
git mv src/components/TBDIndicator.tsx src/shared/components/
git mv src/components/TbdHighlighter.tsx src/shared/components/
```

**Acceptance:** Files moved  
**Estimate:** 0.25h

### Task 5: Update form component imports

**Description:** Update all files importing form/status components.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 6: Move UI primitive components

**Description:** Move RoleBadge, IconLegend.

**Commands:**
```bash
git mv src/components/RoleBadge.tsx src/shared/components/
git mv src/components/IconLegend.tsx src/shared/components/
```

**Acceptance:** Files moved  
**Estimate:** 0.25h

### Task 7: Update UI primitive imports

**Description:** Update all files importing UI primitives.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.25h

### Task 8: Create barrel export

**Description:** Create `src/shared/components/index.ts` with all exports.

**Acceptance:** Named imports work from `@/shared/components`  
**Estimate:** 0.25h

### Task 9: Run TDD tests (green phase)

**Description:** Verify all component tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.25h

### Task 10: Write behavior regression tests

**Description:** Write tests for component behavior preservation.

**Acceptance:** Tests verify tree renders, dropdown works, etc.  
**Estimate:** 1h

### Task 11: Regression verification

**Description:** Full manual test of all dashboards and pages.

**Acceptance:** All pages render correctly, no visual regressions  
**Estimate:** 1h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e010-001 complete (path aliases)
- [ ] s-e010-002 complete (shared module)
- [ ] Dependencies identified

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] Artifact components migrated (Tasks 2-3)
- [ ] Form components migrated (Tasks 4-5)
- [ ] UI primitives migrated (Tasks 6-7)
- [ ] Barrel export created (Task 8)
- [ ] Tests passing (Task 9)

### Post-Implementation

- [ ] Behavior regression tests written (Task 10)
- [ ] Full regression passed (Task 11)
- [ ] Ready for next story (s-e010-004)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD component tests | 1h | | Not Started |
| 2 | Move artifact components | 0.25h | | Not Started |
| 3 | Update artifact imports | 1h | | Not Started |
| 4 | Move form components | 0.25h | | Not Started |
| 5 | Update form imports | 0.5h | | Not Started |
| 6 | Move UI primitives | 0.25h | | Not Started |
| 7 | Update UI primitive imports | 0.25h | | Not Started |
| 8 | Create barrel export | 0.25h | | Not Started |
| 9 | Run tests (green) | 0.25h | | Not Started |
| 10 | Behavior regression tests | 1h | | Not Started |
| 11 | Regression verification | 1h | | Not Started |
| **Total** | | **6h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
