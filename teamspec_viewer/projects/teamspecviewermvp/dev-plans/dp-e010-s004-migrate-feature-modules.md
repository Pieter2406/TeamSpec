# Dev Plan: `dp-e010-s004-migrate-feature-modules`

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
| **Dev Plan ID** | dp-e010-s004 |
| **Story** | [s-e010-004](../stories/backlog/s-e010-004-migrate-feature-modules.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-004](../stories/backlog/s-e010-004-migrate-feature-modules.md) | Migrate feature modules | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Organize feature-specific components into `src/features/` subfolders:
- **Layout**: `Header.tsx`, `RoleSelector.tsx` → `src/features/layout/`
- **Search**: `SearchBar.tsx`, `SearchFilters.tsx`, `SearchResults.tsx` → `src/features/search/`
- **Product Portfolio**: `ProductPortfolio.tsx`, `ProductCard.tsx`, `ProductDetail.tsx`, `ProjectsList.tsx` → `src/features/product-portfolio/`

**Note:** Dashboard components are handled in stories s-e010-005 and s-e010-006.

### 1.2 Component Classification

| Component | Target Feature Folder |
|-----------|----------------------|
| `Header.tsx` | `features/layout/` |
| `RoleSelector.tsx` | `features/layout/` |
| `SearchBar.tsx` | `features/search/` |
| `SearchFilters.tsx` | `features/search/` |
| `SearchResults.tsx` | `features/search/` |
| `ProductPortfolio.tsx` | `features/product-portfolio/` |
| `ProductCard.tsx` | `features/product-portfolio/` |
| `ProductDetail.tsx` | `features/product-portfolio/` |
| `ProjectsList.tsx` | `features/product-portfolio/` |

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| Layout components | Moved | Move to `features/layout/` |
| Search components | Moved | Move to `features/search/` |
| Product components | Moved | Move to `features/product-portfolio/` |
| Barrel exports | New | Create `index.ts` for each feature |
| App.tsx routing | Modified | Update imports for routes |

---

## 2. Technical Design

### 2.1 Files to Move

**Layout Feature:**
| Source | Target |
|--------|--------|
| `src/components/Header.tsx` | `src/features/layout/Header.tsx` |
| `src/components/RoleSelector.tsx` | `src/features/layout/RoleSelector.tsx` |

**Search Feature:**
| Source | Target |
|--------|--------|
| `src/components/SearchBar.tsx` | `src/features/search/SearchBar.tsx` |
| `src/components/SearchFilters.tsx` | `src/features/search/SearchFilters.tsx` |
| `src/components/SearchResults.tsx` | `src/features/search/SearchResults.tsx` |

**Product Portfolio Feature:**
| Source | Target |
|--------|--------|
| `src/components/ProductPortfolio.tsx` | `src/features/product-portfolio/ProductPortfolio.tsx` |
| `src/components/ProductCard.tsx` | `src/features/product-portfolio/ProductCard.tsx` |
| `src/components/ProductDetail.tsx` | `src/features/product-portfolio/ProductDetail.tsx` |
| `src/components/ProjectsList.tsx` | `src/features/product-portfolio/ProjectsList.tsx` |

### 2.2 Barrel Exports

**`src/features/layout/index.ts`:**
```typescript
export { Header } from './Header';
export { RoleSelector } from './RoleSelector';
```

**`src/features/search/index.ts`:**
```typescript
export { SearchBar } from './SearchBar';
export { SearchFilters } from './SearchFilters';
export { SearchResults } from './SearchResults';
```

**`src/features/product-portfolio/index.ts`:**
```typescript
export { ProductPortfolio } from './ProductPortfolio';
export { ProductCard } from './ProductCard';
export { ProductDetail } from './ProductDetail';
export { ProjectsList } from './ProjectsList';
```

### 2.3 App.tsx Updates

Update routing imports:
```typescript
// Before
import { Header } from './components/Header';
import { ProductPortfolio } from './components/ProductPortfolio';

// After
import { Header } from '@/features/layout';
import { ProductPortfolio } from '@/features/product-portfolio';
```

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e010-001 | Story | Must be complete (path aliases) |
| s-e010-002 | Story | Must be complete (shared module) |
| s-e010-003 | Story | Must be complete (shared components) |

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

**File:** `frontend/src/__tests__/features/module-structure.test.tsx`

- [ ] Test: Layout components importable from `@/features/layout`
- [ ] Test: Search components importable from `@/features/search`
- [ ] Test: Product components importable from `@/features/product-portfolio`
- [ ] Test: Each feature's main component renders

### 3.2 Routing Tests

**File:** `frontend/src/__tests__/features/routing.test.tsx`

- [ ] Test: Layout wraps all pages
- [ ] Test: Search route accessible
- [ ] Test: Product portfolio route accessible
- [ ] Test: Navigation between features works

### 3.3 Manual Testing

- [ ] Header renders with role selector
- [ ] Search page loads and search works
- [ ] Product portfolio displays products
- [ ] Product detail pages work
- [ ] Navigation between all pages works

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Routing breaks | Medium | High | Test routes after each feature migration |
| Layout not wrapping | Medium | High | Verify Header renders first |
| Search not working | Low | Medium | Test search functionality end-to-end |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Layout feature migrated | Move Header, RoleSelector |
| 2 | Search feature migrated | Move SearchBar, SearchFilters, SearchResults |
| 3 | Product Portfolio migrated | Move ProductPortfolio, cards, detail |
| 4 | Feature folder structure standardized | Create barrel exports |
| 5 | TDD module tests pass | Write FIRST |
| 6 | TDD routing tests pass | Write after module tests |
| 7 | Regression: all features functional | Navigation, search, portfolio work |

---

## 6. Task Breakdown

### Task 1: Create TDD module tests (FIRST)

**Description:** Write tests verifying feature modules can be imported.

**File:** `frontend/src/__tests__/features/module-structure.test.tsx`

**Acceptance:** Tests written, initially failing  
**Estimate:** 0.5h

### Task 2: Migrate layout feature

**Description:** Move Header, RoleSelector to features/layout/.

**Commands:**
```bash
git mv src/components/Header.tsx src/features/layout/
git mv src/components/RoleSelector.tsx src/features/layout/
# Create src/features/layout/index.ts
```

**Acceptance:** Layout components importable  
**Estimate:** 0.5h

### Task 3: Update layout imports

**Description:** Update App.tsx and other files importing layout components.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 4: Migrate search feature

**Description:** Move search components to features/search/.

**Commands:**
```bash
git mv src/components/SearchBar.tsx src/features/search/
git mv src/components/SearchFilters.tsx src/features/search/
git mv src/components/SearchResults.tsx src/features/search/
# Create src/features/search/index.ts
```

**Acceptance:** Search components importable  
**Estimate:** 0.5h

### Task 5: Update search imports

**Description:** Update files importing search components.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 6: Migrate product portfolio feature

**Description:** Move product components to features/product-portfolio/.

**Commands:**
```bash
git mv src/components/ProductPortfolio.tsx src/features/product-portfolio/
git mv src/components/ProductCard.tsx src/features/product-portfolio/
git mv src/components/ProductDetail.tsx src/features/product-portfolio/
git mv src/components/ProjectsList.tsx src/features/product-portfolio/
# Create src/features/product-portfolio/index.ts
```

**Acceptance:** Product components importable  
**Estimate:** 0.5h

### Task 7: Update product portfolio imports

**Description:** Update files importing product components.

**Acceptance:** `npx tsc --noEmit` passes  
**Estimate:** 0.5h

### Task 8: Create routing tests

**Description:** Write tests verifying all routes work.

**File:** `frontend/src/__tests__/features/routing.test.tsx`

**Acceptance:** Tests verify navigation  
**Estimate:** 0.5h

### Task 9: Run TDD tests (green phase)

**Description:** Verify all module and routing tests pass.

**Acceptance:** All tests green  
**Estimate:** 0.25h

### Task 10: Regression verification

**Description:** Full manual test of navigation and features.

**Acceptance:** All features work end-to-end  
**Estimate:** 1h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] s-e010-001 complete (path aliases)
- [ ] s-e010-002 complete (shared module)
- [ ] s-e010-003 complete (shared components)
- [ ] Dependencies identified

### Implementation

- [ ] TDD tests written (Task 1)
- [ ] Layout migrated (Tasks 2-3)
- [ ] Search migrated (Tasks 4-5)
- [ ] Product portfolio migrated (Tasks 6-7)
- [ ] Routing tests written (Task 8)
- [ ] Tests passing (Task 9)

### Post-Implementation

- [ ] Full regression passed (Task 10)
- [ ] Ready for next story (s-e010-005)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD module tests | 0.5h | | Not Started |
| 2 | Migrate layout | 0.5h | | Not Started |
| 3 | Update layout imports | 0.5h | | Not Started |
| 4 | Migrate search | 0.5h | | Not Started |
| 5 | Update search imports | 0.5h | | Not Started |
| 6 | Migrate product portfolio | 0.5h | | Not Started |
| 7 | Update portfolio imports | 0.5h | | Not Started |
| 8 | Create routing tests | 0.5h | | Not Started |
| 9 | Run tests (green) | 0.25h | | Not Started |
| 10 | Regression verification | 1h | | Not Started |
| **Total** | | **5.25h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
