# Dev Plan: `dp-e010-s006-migrate-dashboard-role-modules`

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
| **Dev Plan ID** | dp-e010-s006 |
| **Story** | [s-e010-006](../stories/backlog/s-e010-006-migrate-dashboard-role-modules.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-006](../stories/backlog/s-e010-006-migrate-dashboard-role-modules.md) | Migrate dashboard role modules | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Move role-specific dashboard components from `src/components/` to `src/features/dashboards/{role}/`. Each role folder gets its dashboard page and tree component. This is the largest migration task with 10 components across 5 roles.

**Migration order:** FA → BA → DEV → SA → QA (one role at a time, verify after each)

### 1.2 Components Per Role

| Role | Dashboard | Tree |
|------|-----------|------|
| FA | `FADashboard.tsx` | `FATree.tsx` (uses `ArtifactTree`) |
| BA | `BADashboard.tsx` | `BATree.tsx` |
| DEV | `DEVDashboard.tsx` | `DEVTree.tsx` |
| SA | `SADashboard.tsx` | `SATree.tsx` |
| QA | `QADashboard.tsx` | `QATree.tsx` |

**Additional FA-related components:**
- `FeatureCard.tsx` - FA feature cards
- `BACard.tsx` - BA card component

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| 5 Dashboard components | Moved | Move to `features/dashboards/{role}/` |
| 5 Tree components | Moved | Move to `features/dashboards/{role}/` |
| 2 Card components | Moved | Move to respective role folders |
| Barrel exports | New | Create `index.ts` per role |
| App.tsx routing | Modified | Update dashboard imports |

---

## 2. Technical Design

### 2.1 Target Structure

```
src/features/dashboards/
├── components/              # Shared (from s-e010-005)
│   └── index.ts
├── fa/
│   ├── FADashboard.tsx
│   ├── FATree.tsx
│   ├── FeatureCard.tsx
│   └── index.ts
├── ba/
│   ├── BADashboard.tsx
│   ├── BATree.tsx
│   ├── BACard.tsx
│   └── index.ts
├── dev/
│   ├── DEVDashboard.tsx
│   ├── DEVTree.tsx
│   └── index.ts
├── sa/
│   ├── SADashboard.tsx
│   ├── SATree.tsx
│   └── index.ts
└── qa/
    ├── QADashboard.tsx
    ├── QATree.tsx
    └── index.ts
```

### 2.2 Files to Move

**FA Role:**
| Source | Target |
|--------|--------|
| `src/components/FADashboard.tsx` | `src/features/dashboards/fa/FADashboard.tsx` |
| `src/components/FeatureCard.tsx` | `src/features/dashboards/fa/FeatureCard.tsx` |

**Note:** FATree doesn't exist as separate file - FA uses ArtifactTree directly.

**BA Role:**
| Source | Target |
|--------|--------|
| `src/components/BADashboard.tsx` | `src/features/dashboards/ba/BADashboard.tsx` |
| `src/components/BATree.tsx` | `src/features/dashboards/ba/BATree.tsx` |
| `src/components/BACard.tsx` | `src/features/dashboards/ba/BACard.tsx` |

**DEV Role:**
| Source | Target |
|--------|--------|
| `src/components/DEVDashboard.tsx` | `src/features/dashboards/dev/DEVDashboard.tsx` |
| `src/components/DEVTree.tsx` | `src/features/dashboards/dev/DEVTree.tsx` |

**SA Role:**
| Source | Target |
|--------|--------|
| `src/components/SADashboard.tsx` | `src/features/dashboards/sa/SADashboard.tsx` |
| `src/components/SATree.tsx` | `src/features/dashboards/sa/SATree.tsx` |

**QA Role:**
| Source | Target |
|--------|--------|
| `src/components/QADashboard.tsx` | `src/features/dashboards/qa/QADashboard.tsx` |
| `src/components/QATree.tsx` | `src/features/dashboards/qa/QATree.tsx` |

### 2.3 Barrel Exports

**`src/features/dashboards/fa/index.ts`:**
```typescript
export { FADashboard } from './FADashboard';
export { FeatureCard } from './FeatureCard';
```

**`src/features/dashboards/ba/index.ts`:**
```typescript
export { BADashboard } from './BADashboard';
export { BATree } from './BATree';
export { BACard } from './BACard';
```

**`src/features/dashboards/dev/index.ts`:**
```typescript
export { DEVDashboard } from './DEVDashboard';
export { DEVTree } from './DEVTree';
```

**`src/features/dashboards/sa/index.ts`:**
```typescript
export { SADashboard } from './SADashboard';
export { SATree } from './SATree';
```

**`src/features/dashboards/qa/index.ts`:**
```typescript
export { QADashboard } from './QADashboard';
export { QATree } from './QATree';
```

### 2.4 App.tsx Route Updates

```typescript
// Before
import { FADashboard } from './components/FADashboard';
import { BADashboard } from './components/BADashboard';
import { DEVDashboard } from './components/DEVDashboard';
import { SADashboard } from './components/SADashboard';
import { QADashboard } from './components/QADashboard';

// After
import { FADashboard } from '@/features/dashboards/fa';
import { BADashboard } from '@/features/dashboards/ba';
import { DEVDashboard } from '@/features/dashboards/dev';
import { SADashboard } from '@/features/dashboards/sa';
import { QADashboard } from '@/features/dashboards/qa';
```

### 2.5 Internal Import Updates

Each dashboard file needs internal imports updated:
- Shared components: `@/shared/components`
- Shared contexts/hooks: `@/shared/contexts`, `@/shared/hooks`
- Dashboard shared: `@/features/dashboards/components`
- API: `@/api`

### 2.6 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases) |
| s-e010-002 | Story | Must be complete (shared module) |
| s-e010-003 | Story | Must be complete (shared components) |
| s-e010-004 | Story | Must be complete (feature modules) |
| s-e010-005 | Story | Must be complete (dashboard shared) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/features/dashboards/role-modules.test.tsx`

- [ ] Test: FA dashboard importable from `@/features/dashboards/fa`
- [ ] Test: BA dashboard importable from `@/features/dashboards/ba`
- [ ] Test: DEV dashboard importable from `@/features/dashboards/dev`
- [ ] Test: SA dashboard importable from `@/features/dashboards/sa`
- [ ] Test: QA dashboard importable from `@/features/dashboards/qa`
- [ ] Test: Each dashboard renders without errors

### 3.2 Functionality Tests

- [ ] Test: FATree renders features/epics
- [ ] Test: BATree renders BA artifacts
- [ ] Test: DEVTree renders dev plans/stories
- [ ] Test: SATree renders solution designs
- [ ] Test: QATree renders test cases/bugs
- [ ] Test: Tree selection updates reader panel

### 3.3 Manual Testing

- [ ] Role selector shows all 5 roles
- [ ] Switching to FA shows FADashboard
- [ ] Switching to BA shows BADashboard
- [ ] Switching to DEV shows DEVDashboard
- [ ] Switching to SA shows SADashboard
- [ ] Switching to QA shows QADashboard
- [ ] Clicking tree items updates reader
- [ ] All panels render correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Multiple import breaks | High | High | Migrate one role at a time, verify each |
| Role switching breaks | Medium | High | Test after each role migration |
| Tree rendering issues | Medium | Medium | Verify tree data still loads |
| Large change surface | High | Medium | Commit after each role, easy rollback |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | FA dashboard migrated | Move FADashboard, FeatureCard |
| 2 | BA dashboard migrated | Move BADashboard, BATree, BACard |
| 3 | DEV dashboard migrated | Move DEVDashboard, DEVTree |
| 4 | SA dashboard migrated | Move SADashboard, SATree |
| 5 | QA dashboard migrated | Move QADashboard, QATree |
| 6 | Folder structure complete | All role folders have barrel exports |
| 7 | TDD module tests pass | Write FIRST |
| 8 | Functionality tests pass | Tree renders, selection works |
| 9 | Regression: all dashboards work | Role switching, panels, reader |

---

## 6. Task Breakdown

### Task 1: Create TDD module tests (FIRST)

**Description:** Write tests verifying all role dashboards can be imported.

**File:** `frontend/src/__tests__/features/dashboards/role-modules.test.tsx`

**Acceptance:** Tests written, initially failing  
**Estimate:** 1h

### Task 2: Migrate FA dashboard

**Description:** Move FADashboard, FeatureCard to features/dashboards/fa/.

**Commands:**
```bash
git mv src/components/FADashboard.tsx src/features/dashboards/fa/
git mv src/components/FeatureCard.tsx src/features/dashboards/fa/
# Create src/features/dashboards/fa/index.ts
# Update internal imports in FADashboard.tsx
```

**Acceptance:** FA dashboard renders correctly  
**Estimate:** 1h

### Task 3: Migrate BA dashboard

**Description:** Move BADashboard, BATree, BACard to features/dashboards/ba/.

**Commands:**
```bash
git mv src/components/BADashboard.tsx src/features/dashboards/ba/
git mv src/components/BATree.tsx src/features/dashboards/ba/
git mv src/components/BACard.tsx src/features/dashboards/ba/
# Create src/features/dashboards/ba/index.ts
# Update internal imports
```

**Acceptance:** BA dashboard renders correctly  
**Estimate:** 1h

### Task 4: Migrate DEV dashboard

**Description:** Move DEVDashboard, DEVTree to features/dashboards/dev/.

**Commands:**
```bash
git mv src/components/DEVDashboard.tsx src/features/dashboards/dev/
git mv src/components/DEVTree.tsx src/features/dashboards/dev/
# Create src/features/dashboards/dev/index.ts
# Update internal imports
```

**Acceptance:** DEV dashboard renders correctly  
**Estimate:** 1h

### Task 5: Migrate SA dashboard

**Description:** Move SADashboard, SATree to features/dashboards/sa/.

**Commands:**
```bash
git mv src/components/SADashboard.tsx src/features/dashboards/sa/
git mv src/components/SATree.tsx src/features/dashboards/sa/
# Create src/features/dashboards/sa/index.ts
# Update internal imports
```

**Acceptance:** SA dashboard renders correctly  
**Estimate:** 1h

### Task 6: Migrate QA dashboard

**Description:** Move QADashboard, QATree to features/dashboards/qa/.

**Commands:**
```bash
git mv src/components/QADashboard.tsx src/features/dashboards/qa/
git mv src/components/QATree.tsx src/features/dashboards/qa/
# Create src/features/dashboards/qa/index.ts
# Update internal imports
```

**Acceptance:** QA dashboard renders correctly  
**Estimate:** 1h

### Task 7: Update App.tsx routing

**Description:** Update all dashboard imports in App.tsx.

**Acceptance:** `npx tsc --noEmit` passes, routing works  
**Estimate:** 0.5h

### Task 8: Write functionality tests

**Description:** Write tests for tree rendering and selection behavior.

**Acceptance:** Tests verify tree behavior preserved  
**Estimate:** 1.5h

### Task 9: Run TDD tests (green phase)

**Description:** Verify all module and functionality tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.5h

### Task 10: Regression verification

**Description:** Full manual test of all dashboards and role switching.

**Acceptance:** All dashboards work, role switching smooth  
**Estimate:** 1.5h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e010-001/002/003/004/005 complete
- [ ] Dependencies identified

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] FA migrated (Task 2)
- [ ] BA migrated (Task 3)
- [ ] DEV migrated (Task 4)
- [ ] SA migrated (Task 5)
- [ ] QA migrated (Task 6)
- [ ] App.tsx updated (Task 7)
- [ ] Functionality tests written (Task 8)
- [ ] Tests passing (Task 9)

### Post-Implementation

- [ ] Full regression passed (Task 10)
- [ ] Ready for next story (s-e010-007)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD module tests | 1h | | Not Started |
| 2 | Migrate FA dashboard | 1h | | Not Started |
| 3 | Migrate BA dashboard | 1h | | Not Started |
| 4 | Migrate DEV dashboard | 1h | | Not Started |
| 5 | Migrate SA dashboard | 1h | | Not Started |
| 6 | Migrate QA dashboard | 1h | | Not Started |
| 7 | Update App.tsx routing | 0.5h | | Not Started |
| 8 | Functionality tests | 1.5h | | Not Started |
| 9 | Run tests (green) | 0.5h | | Not Started |
| 10 | Regression verification | 1.5h | | Not Started |
| **Total** | | **10h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
