# Story: `s-e010-002-migrate-shared-module`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-002 |
| **Epic** | epic-TSV-010 |
| **Status** | Backlog |
| **Estimate** | 3 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer,  
**I want** shared contexts, hooks, utils, and constants moved to the shared module,  
**So that** cross-cutting concerns are centralized and easily importable.

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

Shared modules scattered across `src/contexts/`, `src/hooks/`, `src/utils/`, `src/types/`, imported via relative paths.

### TO-BE (new behavior)

Shared modules consolidated under `src/shared/` with subfolders (contexts, hooks, utils, constants), imported via `@/shared/*` aliases. All import statements updated to use new paths.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Contexts migrated

**Given** contexts exist in `src/contexts/`  
**When** migration is performed  
**Then** the following files are moved to `src/shared/contexts/`:
- `RoleContext.tsx`
- `ArtifactContext.tsx`
- Any other context providers

**And** all imports updated to `@/shared/contexts/...`

### Scenario 2: Hooks migrated

**Given** hooks exist in `src/hooks/`  
**When** migration is performed  
**Then** the following files are moved to `src/shared/hooks/`:
- `useArtifacts.ts`
- `useRole.ts`
- Any other custom hooks

**And** all imports updated to `@/shared/hooks/...`

### Scenario 3: Utils migrated

**Given** utilities exist in `src/utils/` or inline  
**When** migration is performed  
**Then** utility files are moved to `src/shared/utils/`:
- `fileUtils.ts`
- `pathUtils.ts`
- Any other utility modules

**And** all imports updated to `@/shared/utils/...`

### Scenario 4: Constants migrated

**Given** constants exist in various files  
**When** migration is performed  
**Then** constants are consolidated in `src/shared/constants/`:
- `roles.ts` (role definitions)
- `paths.ts` (path constants)
- Any other constant definitions

**And** all imports updated to `@/shared/constants/...`

### Scenario 5: Barrel exports created

**Given** shared modules are migrated  
**When** barrel files are created  
**Then** each shared subfolder has an `index.ts` exporting public API  
**And** imports can use shortened paths like `@/shared/contexts` instead of `@/shared/contexts/RoleContext`

### Scenario 6: TDD - Module import tests pass

**Given** shared modules are migrated with new paths  
**When** module import tests are run  
**Then** tests verify:
- [ ] All context providers importable from `@/shared/contexts`
- [ ] All hooks importable from `@/shared/hooks`
- [ ] All utils importable from `@/shared/utils`
- [ ] All constants importable from `@/shared/constants`
- [ ] Barrel exports work correctly
- [ ] No circular dependencies detected

**Test File:** `frontend/src/__tests__/shared/module-imports.test.ts`

### Scenario 7: Regression - All components still work

**Given** import paths are updated  
**When** application runs  
**Then** no import errors appear in console  
**And** all existing functionality works (role switching, artifact loading, etc.)  
**And** all existing tests pass without modification  
**And** TypeScript compilation succeeds with no errors

---

## Technical Notes

- **Files Moved:**
  - `src/contexts/*` → `src/shared/contexts/`
  - `src/hooks/*` → `src/shared/hooks/`
  - `src/utils/*` → `src/shared/utils/`
  - Constants extracted → `src/shared/constants/`

- **Dependencies:** s-e010-001 (path aliases must be configured)

- **Testing Strategy:**
  - Write tests FIRST to verify imports before migration
  - Use git mv to preserve history
  - Run test suite after each subfolder migration
  - Verify no console errors in dev mode

- **TAI Reference:** tai-TSV-002 § Phase 2 - Shared Module

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-002)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenario)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on s-e010-001)
- [x] Estimated (3 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (import tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
