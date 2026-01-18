# Story: `s-e010-004-migrate-feature-modules`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-004 |
| **Epic** | epic-TSV-010 |
| **Status** | Backlog |
| **Estimate** | 5 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer,  
**I want** feature modules (layout, search, product-portfolio) organized into their own folders,  
**So that** each feature is self-contained and easy to locate.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-010](../epics/epic-TSV-010-frontend-architecture-refactor.md) | Frontend Architecture Refactor | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA dashboards with role-specific tree navigation |

---

## Linked Technical Architecture Increment

| TAI ID | Description |
|---------|-------------|
| [tai-TSV-002](../technical-architecture/tai-TSV-002-frontend-folder-architecture.md) | Frontend folder restructure and path aliases |

---

## Feature Impact

### Impact Type

- [x] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** fi-TSV-009 (implicit frontend structure)

Feature-specific components exist in `src/pages/` and `src/components/` mixed together, imported via relative paths.

### TO-BE (new behavior)

Feature modules organized under `src/features/` with subfolders for layout, search, and product-portfolio. Each feature folder contains its components, hooks, and types. Import paths use `@/features/*` aliases.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Layout feature migrated

**Given** layout components exist in `src/pages/`  
**When** migration is performed  
**Then** the following are moved to `src/features/layout/`:
- `Layout.tsx` (main layout component)
- `Header.tsx`
- `Sidebar.tsx`
- `Footer.tsx` (if exists)

**And** all imports updated to `@/features/layout/...`

### Scenario 2: Search feature migrated

**Given** search components exist in `src/pages/` or `src/components/`  
**When** migration is performed  
**Then** the following are moved to `src/features/search/`:
- `SearchPage.tsx`
- `SearchBar.tsx`
- `SearchResults.tsx`
- Any search-specific hooks or utils

**And** all imports updated to `@/features/search/...`

### Scenario 3: Product Portfolio feature migrated

**Given** product portfolio components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/product-portfolio/`:
- `ProductPortfolioPage.tsx`
- `ProductList.tsx`
- `ProductCard.tsx`
- Any portfolio-specific components

**And** all imports updated to `@/features/product-portfolio/...`

### Scenario 4: Feature folder structure standardized

**Given** features are migrated  
**When** folder structure is reviewed  
**Then** each feature folder has consistent structure:
```
features/
  layout/
    Layout.tsx
    Header.tsx
    Sidebar.tsx
  search/
    SearchPage.tsx
    components/
      SearchBar.tsx
      SearchResults.tsx
  product-portfolio/
    ProductPortfolioPage.tsx
    components/
      ProductList.tsx
      ProductCard.tsx
```

### Scenario 5: TDD - Feature module tests pass

**Given** features are migrated with new structure  
**When** module tests are run  
**Then** tests verify:
- [ ] All feature modules importable from `@/features/*`
- [ ] Each feature's main component renders
- [ ] Feature-specific hooks work correctly
- [ ] No missing dependencies
- [ ] TypeScript compilation succeeds

**Test File:** `frontend/src/__tests__/features/module-structure.test.tsx`

### Scenario 6: TDD - Feature routing still works

**Given** feature components are moved  
**When** routing tests are run  
**Then** tests verify:
- [ ] Layout wraps all pages correctly
- [ ] Search page route works (`/search`)
- [ ] Product portfolio route works (`/products`)
- [ ] Navigation between features works
- [ ] 404 handling still works

**Test File:** `frontend/src/__tests__/features/routing.test.tsx`

### Scenario 7: Regression - All features functional

**Given** all imports are updated  
**When** application runs  
**Then** no import errors appear  
**And** layout renders with header and sidebar  
**And** search page loads and search works  
**And** product portfolio page displays products  
**And** navigation between pages works  
**And** all existing feature tests pass

---

## Technical Notes

- **Files Moved:**
  - Layout components → `src/features/layout/`
  - Search components → `src/features/search/`
  - Product Portfolio components → `src/features/product-portfolio/`

- **Dependencies:**
  - s-e010-001 (path aliases)
  - s-e010-002 (shared module)
  - s-e010-003 (shared components)

- **Testing Strategy:**
  - Write module import tests FIRST
  - Write routing tests to verify page access
  - Use git mv to preserve history
  - Test each feature independently
  - Verify navigation flow end-to-end

- **TAI Reference:** tai-TSV-002 § Phase 4 - Feature Modules

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-004)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenarios)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on s-e010-001/002/003)
- [x] Estimated (5 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (module tests + routing tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
