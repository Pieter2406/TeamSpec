# Story: `s-e010-005-migrate-dashboard-shared-components`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e010-005 |
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
**I want** dashboard-shared components moved to a common dashboards folder,  
**So that** components used by all role dashboards are not duplicated.

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

Dashboard-shared components like `QuickViewPanel`, `LinkedStoriesPanel`, `FiltersPanel` exist in flat `src/components/` folder or duplicated across role-specific folders.

### TO-BE (new behavior)

Dashboard-shared components moved to `src/features/dashboards/components/` (or `src/features/dashboards/shared/`), imported via `@/features/dashboards/components/*` aliases by all role-specific dashboards.

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Dashboard panels migrated

**Given** dashboard panel components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/components/`:
- `QuickViewPanel.tsx`
- `LinkedStoriesPanel.tsx`
- `FiltersPanel.tsx`
- Any other dashboard-shared panels

**And** all imports updated to `@/features/dashboards/components/...`

### Scenario 2: Dashboard layout components migrated

**Given** dashboard layout components exist  
**When** migration is performed  
**Then** the following are moved to `src/features/dashboards/components/`:
- `DashboardLayout.tsx` (if exists)
- `DashboardHeader.tsx` (if exists)
- Any shared dashboard layout components

**And** all imports updated

### Scenario 3: Dashboard folder structure created

**Given** dashboards feature needs organization  
**When** folder structure is created  
**Then** the following structure exists:
```
features/
  dashboards/
    components/        # Shared dashboard components
      QuickViewPanel.tsx
      LinkedStoriesPanel.tsx
      FiltersPanel.tsx
    fa/                # FA-specific (placeholder for next story)
    ba/                # BA-specific (placeholder)
    dev/               # DEV-specific (placeholder)
    sa/                # SA-specific (placeholder)
    qa/                # QA-specific (placeholder)
```

### Scenario 4: TDD - Dashboard component tests pass

**Given** dashboard components are migrated  
**When** component tests are run  
**Then** tests verify:
- [ ] All dashboard components importable from `@/features/dashboards/components`
- [ ] `QuickViewPanel` renders with mock data
- [ ] `LinkedStoriesPanel` displays linked stories
- [ ] `FiltersPanel` renders filter controls
- [ ] No missing dependencies

**Test File:** `frontend/src/__tests__/features/dashboards/shared-components.test.tsx`

### Scenario 5: TDD - Components usable by all roles

**Given** dashboard components are shared  
**When** integration tests are run  
**Then** tests verify:
- [ ] FA dashboard can import and use shared components
- [ ] BA dashboard can import and use shared components
- [ ] DEV dashboard can import and use shared components
- [ ] SA dashboard can import and use shared components
- [ ] QA dashboard can import and use shared components
- [ ] No component duplication detected

**Test File:** `frontend/src/__tests__/features/dashboards/role-integration.test.tsx`

### Scenario 6: Regression - All dashboards still work

**Given** imports are updated across all dashboards  
**When** application runs  
**Then** no import errors appear  
**And** FA dashboard renders panels correctly  
**And** BA dashboard renders panels correctly  
**And** DEV dashboard renders panels correctly  
**And** SA dashboard renders panels correctly  
**And** QA dashboard renders panels correctly  
**And** role switching works without errors

---

## Technical Notes

- **Files Moved:**
  - Dashboard-shared components → `src/features/dashboards/components/`
  - Role-specific folders created (empty for now)

- **Dependencies:**
  - s-e010-001 (path aliases)
  - s-e010-002 (shared module)
  - s-e010-003 (shared components)
  - s-e010-004 (feature modules)

- **Testing Strategy:**
  - Write component tests FIRST for each shared component
  - Write integration tests verifying all roles can use components
  - Use git mv to preserve history
  - Test each dashboard independently
  - Verify role switching doesn't break

- **TAI Reference:** tai-TSV-002 § Phase 5 - Dashboard Features (shared components)

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e010-005)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked (Technical Only)
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin + TDD scenarios)
- [x] UX Attached (No UI required)
- [x] Dependencies Clear (Depends on s-e010-001/002/003/004)
- [x] Estimated (3 points)
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (component tests + integration tests + regression)
- [ ] Feature-Increment TO-BE complete (technical only)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
