# Story: `s-e010-003-migrate-shared-components`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-003 |
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
**I want** reusable UI components moved to the shared module,  
**So that** components used across features have a single source of truth.

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

Reusable components like `StatusDropdown`, `TBDIndicator`, `ArtifactTree`, `ArtifactReader` exist in flat `src/components/` folder, imported via relative paths.

### TO-BE (new behavior)

Reusable components moved to `src/shared/components/` with clear categorization, imported via `@/shared/components/*` aliases. All import statements updated.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Artifact components migrated

**Given** artifact-related components exist in `src/components/`  
**When** migration is performed  
**Then** the following files are moved to `src/shared/components/`:
- `ArtifactTree.tsx`
- `ArtifactReader.tsx`

**And** all imports updated to `@/shared/components/...`

### Scenario 2: Form components migrated

**Given** form components exist in `src/components/`  
**When** migration is performed  
**Then** the following files are moved to `src/shared/components/`:
- `StatusDropdown.tsx`
- `TBDIndicator.tsx`

**And** all imports updated to `@/shared/components/...`

### Scenario 3: Other shared components migrated

**Given** other reusable components exist  
**When** migration is performed  
**Then** any other cross-feature components are moved to `src/shared/components/`  
**And** feature-specific components remain in their feature folders (not moved)

### Scenario 4: Barrel export created

**Given** shared components are migrated  
**When** barrel file is created  
**Then** `src/shared/components/index.ts` exports all public components  
**And** imports can use `@/shared/components` for named imports

### Scenario 5: TDD - Component import and render tests pass

**Given** components are migrated with new paths  
**When** component tests are run  
**Then** tests verify:
- [ ] All shared components importable from `@/shared/components`
- [ ] Each component renders without errors
- [ ] Component props interfaces are correctly exported
- [ ] No missing dependencies or circular imports
- [ ] TypeScript types resolve correctly

**Test File:** `frontend/src/__tests__/shared/components.test.tsx`

### Scenario 6: TDD - Component behavior unchanged

**Given** components are moved but not modified  
**When** behavior tests are run  
**Then** tests verify:
- [ ] `ArtifactTree` renders tree structure correctly
- [ ] `ArtifactReader` displays artifact content
- [ ] `StatusDropdown` shows all status options
- [ ] `TBDIndicator` displays TBD markers
- [ ] All existing component tests pass

**Test Files:**
- `ArtifactTree.test.tsx`
- `ArtifactReader.test.tsx`
- `StatusDropdown.test.tsx`
- `TBDIndicator.test.tsx`

### Scenario 7: Regression - All pages still render

**Given** import paths are updated across all pages  
**When** application runs  
**Then** no import errors appear  
**And** all pages render shared components correctly  
**And** FA, BA, DEV, SA, QA dashboards display trees and readers  
**And** search page uses shared components  
**And** no visual regressions detected

---

## Technical Notes

- **Files Moved:**
  - `src/components/ArtifactTree.tsx` → `src/shared/components/ArtifactTree.tsx`
  - `src/components/ArtifactReader.tsx` → `src/shared/components/ArtifactReader.tsx`
  - `src/components/StatusDropdown.tsx` → `src/shared/components/StatusDropdown.tsx`
  - `src/components/TBDIndicator.tsx` → `src/shared/components/TBDIndicator.tsx`

- **Dependencies:**
  - s-e010-001 (path aliases)
  - s-e010-002 (shared module for contexts/hooks)

- **Testing Strategy:**
  - Write component import tests FIRST
  - Write behavior regression tests for each component
  - Use git mv to preserve history
  - Verify each page still renders after migration
  - Run visual regression checks (manual or automated)

- **TAI Reference:** tai-TSV-002 § Phase 3 - Shared Components

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-003)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenarios)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on s-e010-001, s-e010-002)
- [x] Estimated (5 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (component tests + behavior tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
