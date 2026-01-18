# Story: `s-e010-007-migrate-api-module-cleanup`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-007 |
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
**I want** the API module organized and split into domain-specific files,  
**So that** API logic is maintainable and not monolithic.

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

**Reference:** fi-TSV-009 (implicit API structure)

API logic exists in monolithic `src/api/artifacts.ts` file with all artifact fetching logic mixed together.

### TO-BE (new behavior)

API module moved to `src/api/` folder and split into domain-specific files (features.ts, epics.ts, stories.ts, devPlans.ts, etc.). Import paths use `@/api/*` aliases. Old files removed, imports updated across application.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: API folder structure created

**Given** API logic needs organization  
**When** API module is migrated  
**Then** the following structure exists:
```
api/
  features.ts        # Feature Canon fetching
  epics.ts           # Epic fetching
  stories.ts         # Story fetching
  devPlans.ts        # Dev plan fetching
  business.ts        # BA artifact fetching
  solution.ts        # SA artifact fetching
  qa.ts              # QA artifact fetching
  index.ts           # Barrel export
```

### Scenario 2: Features API split

**Given** feature fetching logic exists  
**When** API is split  
**Then** `api/features.ts` contains:
- `fetchFeatures()`
- `fetchFeatureById()`
- Feature-related types

**And** exports are available from `@/api/features` or `@/api`

### Scenario 3: Epics/Stories/DevPlans API split

**Given** project artifact fetching logic exists  
**When** API is split  
**Then**:
- `api/epics.ts` contains `fetchEpics()`, `fetchEpicById()`
- `api/stories.ts` contains `fetchStories()`, `fetchStoryById()`
- `api/devPlans.ts` contains `fetchDevPlans()`, `fetchDevPlanById()`

**And** all exports available from `@/api`

### Scenario 4: BA/SA/QA APIs split

**Given** role-specific artifact fetching exists  
**When** API is split  
**Then**:
- `api/business.ts` contains BA artifact fetching
- `api/solution.ts` contains SA artifact fetching
- `api/qa.ts` contains QA artifact fetching

**And** all exports available from `@/api`

### Scenario 5: Barrel export created

**Given** API files are split  
**When** barrel file is created  
**Then** `api/index.ts` re-exports all API functions  
**And** imports can use `import { fetchFeatures, fetchEpics } from '@/api'`

### Scenario 6: Old API file removed

**Given** API is split into new files  
**When** migration is complete  
**Then** old monolithic `artifacts.ts` is deleted  
**And** all imports updated to new paths  
**And** no references to old file remain

### Scenario 7: TDD - API module tests pass

**Given** API is split and migrated  
**When** API tests are run  
**Then** tests verify:
- [ ] All API functions importable from `@/api`
- [ ] Feature API functions fetch correct data
- [ ] Epic/Story/DevPlan APIs fetch correct data
- [ ] BA/SA/QA APIs fetch correct data
- [ ] Error handling works correctly
- [ ] TypeScript types are correctly exported

**Test File:** `frontend/src/__tests__/api/api-modules.test.ts`

### Scenario 8: TDD - API functionality unchanged

**Given** API is refactored but behavior unchanged  
**When** integration tests are run  
**Then** tests verify:
- [ ] All dashboards can fetch their artifacts
- [ ] Search can fetch artifacts
- [ ] Product portfolio can fetch products
- [ ] Error handling works as before
- [ ] Loading states work as before

**Test File:** `frontend/src/__tests__/api/api-integration.test.ts`

### Scenario 9: Regression - All features still fetch data

**Given** all imports are updated to new API paths  
**When** application runs  
**Then** no import errors appear  
**And** FA dashboard loads features correctly  
**And** BA dashboard loads BA artifacts correctly  
**And** DEV dashboard loads stories and dev plans correctly  
**And** SA dashboard loads SA artifacts correctly  
**And** QA dashboard loads test cases and bugs correctly  
**And** search fetches artifacts correctly  
**And** all existing API tests pass

### Scenario 10: Cleanup - No old files remain

**Given** migration is complete  
**When** workspace is checked  
**Then** no old flat structure files remain in:
- `src/components/` (only feature-specific components if any)
- `src/pages/` (only app entry or routes)
- `src/contexts/` (folder removed)
- `src/hooks/` (folder removed)
- `src/utils/` (folder removed)

**And** all imports resolve correctly  
**And** TypeScript compilation has no errors  
**And** linter passes with no warnings

---

## Technical Notes

- **Files Created:**
  - `src/api/features.ts`
  - `src/api/epics.ts`
  - `src/api/stories.ts`
  - `src/api/devPlans.ts`
  - `src/api/business.ts`
  - `src/api/solution.ts`
  - `src/api/qa.ts`
  - `src/api/index.ts`

- **Files Deleted:**
  - Old monolithic API file(s)
  - Empty old folders (contexts, hooks, utils, components)

- **Dependencies:**
  - s-e010-001 (path aliases)
  - s-e010-002 (shared module)
  - s-e010-003 (shared components)
  - s-e010-004 (feature modules)
  - s-e010-005 (dashboard shared)
  - s-e010-006 (dashboard roles)

- **Testing Strategy:**
  - Write API module tests FIRST
  - Write integration tests for all features
  - Split API incrementally (one domain at a time)
  - Test after each split
  - Verify all dashboards still work
  - Run full regression suite

- **TAI Reference:** tai-TSV-002 § Phase 6 - API Split & § Phase 7 - Cleanup

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-007)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenarios)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on all previous stories)
- [x] Estimated (5 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (module tests + integration tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
