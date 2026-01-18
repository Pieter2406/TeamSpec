# Dev Plan: `dp-e010-s007-migrate-api-module-cleanup`

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
| **Dev Plan ID** | dp-e010-s007 |
| **Story** | [s-e010-007](../stories/backlog/s-e010-007-migrate-api-module-cleanup.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-007](../stories/backlog/s-e010-007-migrate-api-module-cleanup.md) | Migrate API module + cleanup | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

This is the **final story** in the epic. Two parts:

1. **API Split**: Split monolithic `src/api/artifacts.ts` into domain-specific files
2. **Cleanup**: Remove empty old folders, verify no orphaned files

The API module already exists at `src/api/` with one file (`artifacts.ts`). We need to split it into domain-specific modules while maintaining the same API contract.

### 1.2 Current API Structure

```
src/api/
└── artifacts.ts    # Monolithic - all artifact fetching logic
```

### 1.3 Target API Structure

```
src/api/
├── features.ts     # Feature Canon fetching
├── epics.ts        # Epic fetching
├── stories.ts      # Story fetching
├── devPlans.ts     # Dev plan fetching
├── business.ts     # BA artifact fetching
├── solution.ts     # SA artifact fetching (solution designs, TA)
├── qa.ts           # QA artifact fetching (test cases, bugs)
├── products.ts     # Product/project fetching
└── index.ts        # Barrel export re-exporting all
```

### 1.4 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `artifacts.ts` | Split/Deleted | Split into domain files, then delete |
| Domain API files | New | Create per-domain API modules |
| Barrel export | New | Create `index.ts` re-exporting all |
| Old folders | Deleted | Remove empty contexts/, hooks/, utils/, constants/ |

---

## 2. Technical Design

### 2.1 API Split Plan

Analyze `artifacts.ts` and categorize functions by domain:

**Features Domain (`features.ts`):**
- `fetchFeatures()`
- `fetchFeatureById()`
- Feature-related types

**Epics Domain (`epics.ts`):**
- `fetchEpics()`
- `fetchEpicById()`
- Epic-related types

**Stories Domain (`stories.ts`):**
- `fetchStories()`
- `fetchStoriesByEpic()`
- Story-related types

**Dev Plans Domain (`devPlans.ts`):**
- `fetchDevPlans()`
- `fetchDevPlanById()`
- DevPlan-related types

**Business Domain (`business.ts`):**
- BA artifact fetching (business-analysis)
- BA-related types

**Solution Domain (`solution.ts`):**
- SA artifact fetching (solution-designs, technical-architecture)
- SA-related types

**QA Domain (`qa.ts`):**
- QA artifact fetching (test-cases, bug-reports)
- QA-related types

**Products Domain (`products.ts`):**
- `fetchProducts()`
- `fetchProductById()`
- `fetchProjects()`
- Product/project types

### 2.2 Barrel Export

**`src/api/index.ts`:**
```typescript
// Re-export all domain APIs
export * from './features';
export * from './epics';
export * from './stories';
export * from './devPlans';
export * from './business';
export * from './solution';
export * from './qa';
export * from './products';
```

### 2.3 Cleanup Checklist

**Folders to remove (if empty after all migrations):**
- `src/contexts/` - moved to `src/shared/contexts/`
- `src/hooks/` - moved to `src/shared/hooks/`
- `src/utils/` - moved to `src/shared/utils/`
- `src/constants/` - moved to `src/shared/constants/`
- `src/components/` - moved to `src/shared/components/` and `src/features/`

**Files to verify removed:**
- Old API files (after split)
- Any orphaned component files

### 2.4 Import Update Pattern

```typescript
// Before (if any still using old path)
import { fetchFeatures } from '../api/artifacts';

// After
import { fetchFeatures } from '@/api';
// or
import { fetchFeatures } from '@/api/features';
```

### 2.5 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases) |
| s-e010-002 | Story | Must be complete (shared module) |
| s-e010-003 | Story | Must be complete (shared components) |
| s-e010-004 | Story | Must be complete (feature modules) |
| s-e010-005 | Story | Must be complete (dashboard shared) |
| s-e010-006 | Story | Must be complete (dashboard roles) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/api/api-modules.test.ts`

- [ ] Test: All API functions importable from `@/api`
- [ ] Test: Features API exports `fetchFeatures`, `fetchFeatureById`
- [ ] Test: Epics API exports `fetchEpics`, `fetchEpicById`
- [ ] Test: Stories API exports `fetchStories`
- [ ] Test: DevPlans API exports `fetchDevPlans`
- [ ] Test: Business API exports BA fetchers
- [ ] Test: Solution API exports SA fetchers
- [ ] Test: QA API exports QA fetchers
- [ ] Test: Products API exports product/project fetchers

### 3.2 Integration Tests

**File:** `frontend/src/__tests__/api/api-integration.test.ts`

- [ ] Test: FA dashboard can fetch features
- [ ] Test: BA dashboard can fetch BA artifacts
- [ ] Test: DEV dashboard can fetch stories and dev plans
- [ ] Test: SA dashboard can fetch SA artifacts
- [ ] Test: QA dashboard can fetch test cases and bugs
- [ ] Test: Search can fetch artifacts across domains
- [ ] Test: Product portfolio can fetch products

### 3.3 Manual Testing

- [ ] All dashboards load data correctly
- [ ] Search functionality works
- [ ] Product portfolio displays products
- [ ] Error handling works (network errors)
- [ ] Loading states display correctly

### 3.4 Cleanup Verification

- [ ] No files remain in `src/contexts/`
- [ ] No files remain in `src/hooks/`
- [ ] No files remain in `src/utils/`
- [ ] No files remain in `src/constants/`
- [ ] `src/components/` is empty or contains only non-migrated files
- [ ] `npx tsc --noEmit` passes
- [ ] ESLint passes with no warnings

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API contract changes | Medium | High | Keep function signatures identical |
| Missing exports in barrel | Medium | Medium | Test each export explicitly |
| Circular dependencies | Low | High | Analyze import graph before split |
| Leftover files missed | Medium | Low | Use `find` command to verify |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | API folder structure created | Create domain files |
| 2 | Features API split | Extract features.ts |
| 3 | Epics/Stories/DevPlans split | Extract respective files |
| 4 | BA/SA/QA APIs split | Extract respective files |
| 5 | Barrel export created | Create index.ts |
| 6 | Old API file removed | Delete artifacts.ts |
| 7 | TDD API tests pass | Write FIRST |
| 8 | Integration tests pass | Dashboards fetch data |
| 9 | Regression: all features fetch | End-to-end data loading |
| 10 | Cleanup: no old files remain | Remove empty folders |

---

## 6. Task Breakdown

### Task 1: Create TDD API module tests (FIRST)

**Description:** Write tests verifying API exports before splitting.

**File:** `frontend/src/__tests__/api/api-modules.test.ts`

**Acceptance:** Tests written, initially failing  
**Estimate:** 1h

### Task 2: Analyze artifacts.ts

**Description:** Map all functions/types in artifacts.ts to target domain files.

**Acceptance:** Complete mapping document  
**Estimate:** 0.5h

### Task 3: Create products.ts

**Description:** Extract product/project fetching to products.ts.

**Acceptance:** Products API works  
**Estimate:** 0.5h

### Task 4: Create features.ts

**Description:** Extract feature fetching to features.ts.

**Acceptance:** Features API works  
**Estimate:** 0.5h

### Task 5: Create epics.ts

**Description:** Extract epic fetching to epics.ts.

**Acceptance:** Epics API works  
**Estimate:** 0.5h

### Task 6: Create stories.ts

**Description:** Extract story fetching to stories.ts.

**Acceptance:** Stories API works  
**Estimate:** 0.5h

### Task 7: Create devPlans.ts

**Description:** Extract dev plan fetching to devPlans.ts.

**Acceptance:** DevPlans API works  
**Estimate:** 0.5h

### Task 8: Create business.ts

**Description:** Extract BA artifact fetching to business.ts.

**Acceptance:** Business API works  
**Estimate:** 0.5h

### Task 9: Create solution.ts

**Description:** Extract SA artifact fetching to solution.ts.

**Acceptance:** Solution API works  
**Estimate:** 0.5h

### Task 10: Create qa.ts

**Description:** Extract QA artifact fetching to qa.ts.

**Acceptance:** QA API works  
**Estimate:** 0.5h

### Task 11: Create barrel export

**Description:** Create `src/api/index.ts` re-exporting all domain APIs.

**Acceptance:** All exports available from `@/api`  
**Estimate:** 0.25h

### Task 12: Delete old artifacts.ts

**Description:** Remove old monolithic file after all extractions verified.

**Acceptance:** File deleted, no broken imports  
**Estimate:** 0.25h

### Task 13: Update remaining imports

**Description:** Update any remaining files using old import paths.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 14: Write integration tests

**Description:** Write tests verifying all dashboards can fetch data.

**File:** `frontend/src/__tests__/api/api-integration.test.ts`

**Acceptance:** Tests verify data fetching works  
**Estimate:** 1h

### Task 15: Run TDD tests (green phase)

**Description:** Verify all API tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.25h

### Task 16: Cleanup old folders

**Description:** Remove empty contexts/, hooks/, utils/, constants/, components/ folders.

**Commands:**
```bash
# Verify empty first
ls src/contexts src/hooks src/utils src/constants
# Then remove
rmdir src/contexts src/hooks src/utils src/constants
# Check components - may have remaining files
ls src/components
```

**Acceptance:** Old folders removed  
**Estimate:** 0.25h

### Task 17: Final verification

**Description:** Full build, lint check, and manual testing.

**Commands:**
```bash
npx tsc --noEmit
pnpm run build
pnpm run lint
```

**Acceptance:** All checks pass, app runs correctly  
**Estimate:** 0.5h

### Task 18: Regression verification

**Description:** Full manual test of all features.

**Acceptance:** All functionality works end-to-end  
**Estimate:** 1h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] All previous stories complete
- [ ] artifacts.ts analyzed and mapped

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] artifacts.ts analyzed (Task 2)
- [ ] Products API created (Task 3)
- [ ] Features API created (Task 4)
- [ ] Epics API created (Task 5)
- [ ] Stories API created (Task 6)
- [ ] DevPlans API created (Task 7)
- [ ] Business API created (Task 8)
- [ ] Solution API created (Task 9)
- [ ] QA API created (Task 10)
- [ ] Barrel export created (Task 11)
- [ ] Old file deleted (Task 12)
- [ ] Imports updated (Task 13)
- [ ] Integration tests written (Task 14)
- [ ] Tests passing (Task 15)

### Post-Implementation

- [ ] Old folders cleaned (Task 16)
- [ ] Final verification passed (Task 17)
- [ ] Full regression passed (Task 18)
- [ ] Epic complete!

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD API module tests | 1h | | Not Started |
| 2 | Analyze artifacts.ts | 0.5h | | Not Started |
| 3 | Create products.ts | 0.5h | | Not Started |
| 4 | Create features.ts | 0.5h | | Not Started |
| 5 | Create epics.ts | 0.5h | | Not Started |
| 6 | Create stories.ts | 0.5h | | Not Started |
| 7 | Create devPlans.ts | 0.5h | | Not Started |
| 8 | Create business.ts | 0.5h | | Not Started |
| 9 | Create solution.ts | 0.5h | | Not Started |
| 10 | Create qa.ts | 0.5h | | Not Started |
| 11 | Create barrel export | 0.25h | | Not Started |
| 12 | Delete old artifacts.ts | 0.25h | | Not Started |
| 13 | Update remaining imports | 0.5h | | Not Started |
| 14 | Write integration tests | 1h | | Not Started |
| 15 | Run tests (green) | 0.25h | | Not Started |
| 16 | Cleanup old folders | 0.25h | | Not Started |
| 17 | Final verification | 0.5h | | Not Started |
| 18 | Regression verification | 1h | | Not Started |
| **Total** | | **9h** | | |

---

## 9. Epic Completion Summary

When this story is complete, epic-TSV-010 achieves:

✅ **Folder structure**: `shared/`, `features/`, `api/` organized  
✅ **Path aliases**: `@/shared`, `@/features`, `@/api` configured  
✅ **Shared module**: contexts, hooks, utils, constants centralized  
✅ **Shared components**: ArtifactTree, StatusDropdown, etc. reusable  
✅ **Feature modules**: layout, search, product-portfolio organized  
✅ **Dashboard structure**: fa/, ba/, dev/, sa/, qa/ isolated  
✅ **API split**: Domain-specific API files  
✅ **Cleanup**: No orphaned files, clean structure  

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
