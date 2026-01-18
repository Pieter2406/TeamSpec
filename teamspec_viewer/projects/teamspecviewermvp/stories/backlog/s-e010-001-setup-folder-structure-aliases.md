# Story: `s-e010-001-setup-folder-structure-aliases`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-001 |
| **Epic** | epic-TSV-010 |
| **Status** | Backlog |
| **Estimate** | 2 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer,  
**I want** a clear folder structure with path aliases configured,  
**So that** I can organize code by domain and have clean import statements.

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

All frontend code is organized in flat `src/` directory with components/, pages/, api/, etc. Import paths use relative imports like `../../components/ArtifactTree`.

### TO-BE (new behavior)

Frontend code is reorganized into domain-based folders (`shared/`, `features/`, `api/`) with path aliases configured (`@/shared`, `@/features`, `@/api`). Import paths use absolute aliases.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Folder structure created

**Given** the frontend needs domain-based organization  
**When** the folder structure is created  
**Then** the following folders exist:
- `frontend/src/shared/` (with subfolders: `contexts/`, `hooks/`, `utils/`, `constants/`, `components/`)
- `frontend/src/features/` (with subfolders: `layout/`, `search/`, `product-portfolio/`, `dashboards/`)
- `frontend/src/api/`

### Scenario 2: Path aliases configured in Vite

**Given** the new folder structure exists  
**When** vite.config.ts is updated  
**Then** the following aliases are configured:
- `@/shared` → `./src/shared`
- `@/features` → `./src/features`
- `@/api` → `./src/api`

**And** the vite dev server starts successfully with no alias resolution errors

### Scenario 3: Path aliases configured in TypeScript

**Given** vite.config.ts has aliases  
**When** tsconfig.json is updated  
**Then** the `paths` property includes matching aliases:
```json
{
  "@/shared/*": ["./src/shared/*"],
  "@/features/*": ["./src/features/*"],
  "@/api/*": ["./src/api/*"]
}
```

**And** TypeScript compilation succeeds with no path resolution errors

### Scenario 4: TDD - Configuration tests pass

**Given** path alias configuration is complete  
**When** configuration validation tests are run  
**Then** tests verify:
- [ ] Vite config contains all three aliases with correct paths
- [ ] TSConfig paths match Vite aliases exactly
- [ ] Folder structure exists (all required folders present)
- [ ] Build process completes without errors

**Test File:** `frontend/src/__tests__/config/path-aliases.test.ts`

### Scenario 5: Regression - Existing build still works

**Given** folder structure is created but no files moved yet  
**When** the build command runs  
**Then** existing application builds successfully  
**And** all existing relative imports still resolve correctly  
**And** no regression in build time or bundle size

---

## Technical Notes

- **Files Modified:**
  - `frontend/vite.config.ts` — Add `resolve.alias` configuration
  - `frontend/tsconfig.json` — Add `compilerOptions.paths`
  - New folders created under `frontend/src/`

- **Dependencies:** None (foundation story)

- **Testing Strategy:**
  - Create config validation test to verify aliases are correctly defined
  - Run existing test suite to ensure no regressions
  - Manual verification: `npm run build` succeeds

- **TAI Reference:** tai-TSV-002 § Phase 1 - Setup

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-001)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenario)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (None - foundation)
- [x] Estimated (2 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (config validation + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
