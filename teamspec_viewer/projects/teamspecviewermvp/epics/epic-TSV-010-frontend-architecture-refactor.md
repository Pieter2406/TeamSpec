---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-010
filename_pattern: epic-TSV-010-frontend-architecture-refactor.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-009
    optional: false
    note: Linked to dashboard FI
keywords:
  - epic
  - technical refactoring
  - frontend architecture
  - shared components
  - dashboards
aliases:
  - frontend module architecture epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Proposed
---

# Epic: `epic-TSV-010-frontend-architecture-refactor`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-010 |
| **Status** | Proposed|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-18 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** TSV engineering team (FA/DEV/SA/QA),  
**I want** the frontend refactored to a modular folder architecture with shared components and barrel exports,  
**So that** the role dashboards feature can scale, stay maintainable, and enable faster implementation across FA/BA/DEV/SA/QA.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role dashboards (extend BA/FA) | Active |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: Faster dashboard delivery across all roles; consistent tree and status-editing patterns; clearer navigation for engineers.
- **Business Impact**: Reduced development/maintenance cost via shared components; improved reliability and feature parity between dashboards.
- **Success Metrics**:
  - 100% dashboard components use shared StatusDropdown + ArtifactTree
  - Import path reduction: >80% files use barrel exports/aliases
  - Build passes and viewer runs without broken imports

### Target State

- Frontend organized under `shared/`, `features/`, and `api/` modules with barrel exports.
- Role dashboards located under `features/dashboards/{role}/` with shared submodule for common UI.
- Shared components (StatusDropdown, TBDIndicator, ArtifactTree, ArtifactReader) consumed consistently across FA/BA/DEV/SA/QA.
- Path aliases configured (`@/shared`, `@/features`, `@/api`) and adopted across the codebase.

---

## Scope

### In Scope

- [ ] Introduce `shared/` module with components, hooks, contexts, utils, constants
- [ ] Introduce `features/` module with `dashboards/{role}` folders and shared dashboard components
- [ ] Create barrel exports (`index.ts`) for all modules and submodules
- [ ] Configure TS + Vite path aliases and migrate imports
- [ ] Migrate dashboard components (FA/BA/DEV/SA/QA) to new structure
- [ ] Align tree/status components usage across dashboards

### Out of Scope

- [ ] Backend changes (scope: frontend organization only)
- [ ] New user-facing features (refactor-only)
- [ ] Status vocabulary or backend API schema changes

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-e010-YYY-description.md`._

| Story ID | Description | Status | Sprint | Estimate |
|----------|-------------|--------|--------|----------|
| [s-e010-001](../stories/backlog/s-e010-001-setup-folder-structure-aliases.md) | Setup folder structure and path aliases | Backlog | — | 2 |
| [s-e010-002](../stories/backlog/s-e010-002-migrate-shared-module.md) | Migrate shared module (contexts, hooks, utils, constants) | Backlog | — | 3 |
| [s-e010-003](../stories/backlog/s-e010-003-migrate-shared-components.md) | Migrate shared components (ArtifactTree, ArtifactReader, StatusDropdown, TBDIndicator) | Backlog | — | 5 |
| [s-e010-004](../stories/backlog/s-e010-004-migrate-feature-modules.md) | Migrate feature modules (layout, search, product-portfolio) | Backlog | — | 5 |
| [s-e010-005](../stories/backlog/s-e010-005-migrate-dashboard-shared-components.md) | Migrate dashboard shared components (QuickViewPanel, LinkedStoriesPanel, FiltersPanel) | Backlog | — | 3 |
| [s-e010-006](../stories/backlog/s-e010-006-migrate-dashboard-role-modules.md) | Migrate dashboard role modules (FA/BA/DEV/SA/QA dashboards + trees) | Backlog | — | 8 |
| [s-e010-007](../stories/backlog/s-e010-007-migrate-api-module-cleanup.md) | Migrate API module + cleanup old files | Backlog | — | 5 |

**Total Stories:** 7  
**Total Story Points:** 31  
**Completed:** 0  
**Remaining:** 7

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | Requires | Active | Target feature for dashboards behavior |
| [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | Requires | Active | Epic delivers architecture to support FI-TSV-009 |
| [tai-TSV-002](../technical-architecture-increments/tai-TSV-002-frontend-folder-architecture.md) | Guides | Proposed | Technical architecture increment defining structure |

### Blocked By

- [ ] None (can proceed when stories are drafted)

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Large change surface causes broken imports | Medium | High | Incremental migration + CI build checks |
| Divergent dashboard code patterns | Medium | Medium | Enforce shared components + lint rules |
| Path alias misconfiguration | Low | Medium | Validate via `tsc --noEmit` and Vite dev build |

### Assumptions

- Refactor does not change user-observable behavior
- Shared components already exist or can be extracted safely
- Engineers adopt path aliases and barrel export conventions

---

## Technical Considerations

- **Architecture Impact**: Frontend module reorganization; no runtime behavior changes.
- **Related TAI**: [tai-TSV-002-frontend-folder-architecture](../technical-architecture-increments/tai-TSV-002-frontend-folder-architecture.md)
- **Performance Considerations**: Neutral; improved build clarity; potential minor tree-shake improvements via barrels.

---

## Acceptance Criteria

- [ ] All dashboards compile and run post-refactor
- [ ] Shared components used across all role dashboards
- [ ] Path aliases and barrel exports in place; imports updated
- [ ] No broken routes or missing components
- [ ] CI: `npx tsc --noEmit` passes; local `pnpm dev` starts successfully

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | {TBD} | [ ] |
| Stories Drafted | {TBD} | [ ] |
| Migration Start | {TBD} | [ ] |
| Migration Complete | {TBD} | [ ] |
| Verification (build + manual) | {TBD} | [ ] |
| Canon Sync (if any) | {TBD} | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | FA | Initial draft |
