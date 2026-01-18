# Story: `s-e010-006-migrate-dashboard-role-modules`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-006 |
| **Epic** | epic-TSV-010 |
| **Status** | Backlog |
| **Estimate** | 8 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer,  
**I want** role-specific dashboard components organized into their own feature subfolders,  
**So that** each role's dashboard is self-contained and easy to modify.

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

**Reference:** fi-TSV-009, § TO-BE section

Role-specific dashboard components (FADashboard, BADashboard, DEVDashboard, SADashboard, QADashboard) and their trees (FATree, BATree, DEVTree, SATree, QATree) exist in `src/pages/` or `src/components/`.

### TO-BE (new behavior)

Role-specific dashboard components migrated to `src/features/dashboards/{role}/` with each role having its own folder containing dashboard page and tree component. Import paths use `@/features/dashboards/{role}/*` aliases.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: FA dashboard migrated

**Given** FA dashboard components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/fa/`:
- `FADashboard.tsx`
- `FATree.tsx`

**And** imports updated to `@/features/dashboards/fa/...`  
**And** FA dashboard page uses shared components from `@/features/dashboards/components`

### Scenario 2: BA dashboard migrated

**Given** BA dashboard components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/ba/`:
- `BADashboard.tsx`
- `BATree.tsx`

**And** imports updated to `@/features/dashboards/ba/...`  
**And** BA dashboard page uses shared components

### Scenario 3: DEV dashboard migrated

**Given** DEV dashboard components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/dev/`:
- `DEVDashboard.tsx`
- `DEVTree.tsx`

**And** imports updated to `@/features/dashboards/dev/...`  
**And** DEV dashboard page uses shared components

### Scenario 4: SA dashboard migrated

**Given** SA dashboard components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/sa/`:
- `SADashboard.tsx`
- `SATree.tsx`

**And** imports updated to `@/features/dashboards/sa/...`  
**And** SA dashboard page uses shared components

### Scenario 5: QA dashboard migrated

**Given** QA dashboard components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/qa/`:
- `QADashboard.tsx`
- `QATree.tsx`

**And** imports updated to `@/features/dashboards/qa/...`  
**And** QA dashboard page uses shared components

### Scenario 6: Dashboard folder structure complete

**Given** all dashboards are migrated  
**When** folder structure is reviewed  
**Then** the structure matches:
```
features/
  dashboards/
    components/          # Shared (from s-e010-005)
      QuickViewPanel.tsx
      LinkedStoriesPanel.tsx
    fa/
      FADashboard.tsx
      FATree.tsx
    ba/
      BADashboard.tsx
      BATree.tsx
    dev/
      DEVDashboard.tsx
      DEVTree.tsx
    sa/
      SADashboard.tsx
      SATree.tsx
    qa/
      QADashboard.tsx
      QATree.tsx
```

### Scenario 7: TDD - Dashboard module tests pass

**Given** all dashboards are migrated  
**When** module tests are run  
**Then** tests verify:
- [ ] All role dashboards importable from `@/features/dashboards/{role}`
- [ ] Each dashboard renders without errors
- [ ] Each tree renders with mock data
- [ ] Shared components properly imported
- [ ] No missing dependencies

**Test File:** `frontend/src/__tests__/features/dashboards/role-modules.test.tsx`

### Scenario 8: TDD - Dashboard functionality preserved

**Given** dashboards are moved but not modified  
**When** functionality tests are run  
**Then** tests verify:
- [ ] FATree displays features and epics
- [ ] BATree displays business analysis artifacts
- [ ] DEVTree displays dev plans and stories
- [ ] SATree displays solution designs
- [ ] QATree displays test cases and bugs
- [ ] Each dashboard displays artifact content
- [ ] Tree selection updates reader panel

**Test Files:** Per-role test files (e.g., `FADashboard.test.tsx`)

### Scenario 9: Regression - All dashboards work end-to-end

**Given** all imports are updated  
**When** application runs  
**Then** no import errors appear  
**And** role selector shows all roles  
**And** switching to FA shows FADashboard with FATree  
**And** switching to BA shows BADashboard with BATree  
**And** switching to DEV shows DEVDashboard with DEVTree  
**And** switching to SA shows SADashboard with SATree  
**And** switching to QA shows QADashboard with QATree  
**And** clicking tree items updates reader panel  
**And** all existing dashboard tests pass

---

## Technical Notes

- **Files Moved:**
  - FA components → `src/features/dashboards/fa/`
  - BA components → `src/features/dashboards/ba/`
  - DEV components → `src/features/dashboards/dev/`
  - SA components → `src/features/dashboards/sa/`
  - QA components → `src/features/dashboards/qa/`

- **Dependencies:**
  - s-e010-001 (path aliases)
  - s-e010-002 (shared module)
  - s-e010-003 (shared components)
  - s-e010-004 (feature modules)
  - s-e010-005 (dashboard shared components)

- **Testing Strategy:**
  - Write module tests FIRST for each role
  - Write functionality tests for tree and dashboard behavior
  - Use git mv to preserve history
  - Test each role independently
  - Test role switching flow
  - Verify reader panel updates on tree selection

- **TAI Reference:** tai-TSV-002 § Phase 5 - Dashboard Features (role-specific)

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-006)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenarios)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on s-e010-001/002/003/004/005)
- [x] Estimated (8 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (module tests + functionality tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
