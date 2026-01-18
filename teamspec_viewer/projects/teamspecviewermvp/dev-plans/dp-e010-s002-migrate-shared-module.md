# Dev Plan: `dp-e010-s002-migrate-shared-module`

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
| **Dev Plan ID** | dp-e010-s002 |
| **Story** | [s-e010-002](../stories/backlog/s-e010-002-migrate-shared-module.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-002](../stories/backlog/s-e010-002-migrate-shared-module.md) | Migrate shared module (contexts, hooks, utils, constants) | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Migrate existing shared modules to the new `shared/` folder structure in this order:
1. **Contexts** → `src/shared/contexts/`
2. **Hooks** → `src/shared/hooks/`
3. **Utils** → `src/shared/utils/`
4. **Constants** → `src/shared/constants/`

Use `git mv` to preserve history. Create barrel exports (`index.ts`) for each subfolder. Update all import statements to use new `@/shared/*` paths.

### 1.2 Current File Inventory

| Current Location | Files | Target |
|------------------|-------|--------|
| `src/contexts/` | `RoleContext.tsx`, `ToastContext.tsx` | `src/shared/contexts/` |
| `src/hooks/` | `useArtifactFilter.ts` | `src/shared/hooks/` |
| `src/utils/` | `artifactIcons.ts`, `artifactSorting.ts`, `statusOptions.ts` | `src/shared/utils/` |
| `src/constants/` | `stateOrdering.ts` | `src/shared/constants/` |

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| Context files | Moved | Move to `shared/contexts/` |
| Hook files | Moved | Move to `shared/hooks/` |
| Util files | Moved | Move to `shared/utils/` |
| Constant files | Moved | Move to `shared/constants/` |
| Barrel exports | New | Create `index.ts` for each subfolder |
| Import statements | Modified | Update across entire codebase |

---

## 2. Technical Design

### 2.1 Files to Move (git mv)

| Source | Target |
|--------|--------|
| `src/contexts/RoleContext.tsx` | `src/shared/contexts/RoleContext.tsx` |
| `src/contexts/ToastContext.tsx` | `src/shared/contexts/ToastContext.tsx` |
| `src/hooks/useArtifactFilter.ts` | `src/shared/hooks/useArtifactFilter.ts` |
| `src/utils/artifactIcons.ts` | `src/shared/utils/artifactIcons.ts` |
| `src/utils/artifactSorting.ts` | `src/shared/utils/artifactSorting.ts` |
| `src/utils/statusOptions.ts` | `src/shared/utils/statusOptions.ts` |
| `src/constants/stateOrdering.ts` | `src/shared/constants/stateOrdering.ts` |

### 2.2 Barrel Exports to Create

**`src/shared/contexts/index.ts`:**
```typescript
export * from './RoleContext';
export * from './ToastContext';
```

**`src/shared/hooks/index.ts`:**
```typescript
export * from './useArtifactFilter';
```

**`src/shared/utils/index.ts`:**
```typescript
export * from './artifactIcons';
export * from './artifactSorting';
export * from './statusOptions';
```

**`src/shared/constants/index.ts`:**
```typescript
export * from './stateOrdering';
```

### 2.3 Import Updates Required

Files importing from old locations (search pattern):
- `from '../contexts/RoleContext'` → `from '@/shared/contexts'`
- `from './contexts/RoleContext'` → `from '@/shared/contexts'`
- `from '../hooks/useArtifactFilter'` → `from '@/shared/hooks'`
- `from '../utils/artifactIcons'` → `from '@/shared/utils'`
- `from '../constants/stateOrdering'` → `from '@/shared/constants'`

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases configured) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/shared/module-imports.test.ts`

- [ ] Test: All contexts importable from `@/shared/contexts`
- [ ] Test: All hooks importable from `@/shared/hooks`
- [ ] Test: All utils importable from `@/shared/utils`
- [ ] Test: All constants importable from `@/shared/constants`
- [ ] Test: Barrel exports work correctly
- [ ] Test: No circular dependencies

### 3.2 Integration Tests

- [ ] `npx tsc --noEmit` passes after all moves
- [ ] `pnpm run dev` starts without import errors
- [ ] Console shows no import warnings

### 3.3 Manual Testing

- [ ] Role switching works (RoleContext)
- [ ] Toast notifications work (ToastContext)
- [ ] Artifact filtering works (useArtifactFilter)
- [ ] Icons display correctly (artifactIcons)
- [ ] Sorting works correctly (artifactSorting)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Missed import update | Medium | High | Use grep to find all imports before/after |
| Circular dependency introduced | Low | High | Test imports immediately after each move |
| Git history loss | Low | Medium | Use `git mv`, verify history with `git log --follow` |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Contexts migrated | Move RoleContext.tsx, ToastContext.tsx |
| 2 | Hooks migrated | Move useArtifactFilter.ts |
| 3 | Utils migrated | Move artifactIcons.ts, artifactSorting.ts, statusOptions.ts |
| 4 | Constants migrated | Move stateOrdering.ts |
| 5 | Barrel exports created | Create index.ts for each subfolder |
| 6 | TDD tests pass | Write module-imports.test.ts FIRST |
| 7 | Regression: all works | Role switching, artifact loading functional |

---

## 6. Task Breakdown

### Task 1: Create TDD module import tests (FIRST)

**Description:** Write tests that verify imports work from new locations.

**File:** `frontend/src/__tests__/shared/module-imports.test.ts`

**Acceptance:** Tests written, initially failing  
**Estimate:** 0.5h

### Task 2: Move contexts

**Description:** Move context files and create barrel export.

**Commands:**
```bash
git mv src/contexts/RoleContext.tsx src/shared/contexts/
git mv src/contexts/ToastContext.tsx src/shared/contexts/
# Create src/shared/contexts/index.ts
```

**Acceptance:** Contexts importable from `@/shared/contexts`  
**Estimate:** 0.5h

### Task 3: Update context imports

**Description:** Update all files importing contexts.

**Search/Replace:**
- Find: `from '../contexts/RoleContext'` or similar
- Replace: `from '@/shared/contexts'`

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 4: Move hooks

**Description:** Move hook files and create barrel export.

**Commands:**
```bash
git mv src/hooks/useArtifactFilter.ts src/shared/hooks/
# Create src/shared/hooks/index.ts
```

**Acceptance:** Hooks importable from `@/shared/hooks`  
**Estimate:** 0.25h

### Task 5: Update hook imports

**Description:** Update all files importing hooks.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.25h

### Task 6: Move utils

**Description:** Move utility files and create barrel export.

**Commands:**
```bash
git mv src/utils/artifactIcons.ts src/shared/utils/
git mv src/utils/artifactSorting.ts src/shared/utils/
git mv src/utils/statusOptions.ts src/shared/utils/
# Create src/shared/utils/index.ts
```

**Acceptance:** Utils importable from `@/shared/utils`  
**Estimate:** 0.25h

### Task 7: Update utils imports

**Description:** Update all files importing utils.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 8: Move constants

**Description:** Move constant files and create barrel export.

**Commands:**
```bash
git mv src/constants/stateOrdering.ts src/shared/constants/
# Create src/shared/constants/index.ts
```

**Acceptance:** Constants importable from `@/shared/constants`  
**Estimate:** 0.25h

### Task 9: Update constants imports

**Description:** Update all files importing constants.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.25h

### Task 10: Run TDD tests (green phase)

**Description:** Verify all module import tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.25h

### Task 11: Delete old folders

**Description:** Remove empty old folders.

**Commands:**
```bash
rmdir src/contexts src/hooks src/utils src/constants
```

**Acceptance:** Old folders removed  
**Estimate:** 0.1h

### Task 12: Regression verification

**Description:** Full manual test of app functionality.

**Acceptance:** All functionality works  
**Estimate:** 0.5h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e010-001 complete (path aliases configured)
- [ ] Dependencies identified

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] Contexts migrated (Tasks 2-3)
- [ ] Hooks migrated (Tasks 4-5)
- [ ] Utils migrated (Tasks 6-7)
- [ ] Constants migrated (Tasks 8-9)
- [ ] Tests passing (Task 10)

### Post-Implementation

- [ ] Old folders deleted (Task 11)
- [ ] Full regression passed (Task 12)
- [ ] Ready for next story (s-e010-003)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD module import tests | 0.5h | | Not Started |
| 2 | Move contexts | 0.5h | | Not Started |
| 3 | Update context imports | 0.5h | | Not Started |
| 4 | Move hooks | 0.25h | | Not Started |
| 5 | Update hook imports | 0.25h | | Not Started |
| 6 | Move utils | 0.25h | | Not Started |
| 7 | Update utils imports | 0.5h | | Not Started |
| 8 | Move constants | 0.25h | | Not Started |
| 9 | Update constants imports | 0.25h | | Not Started |
| 10 | Run tests (green) | 0.25h | | Not Started |
| 11 | Delete old folders | 0.1h | | Not Started |
| 12 | Regression verification | 0.5h | | Not Started |
| **Total** | | **4.1h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
