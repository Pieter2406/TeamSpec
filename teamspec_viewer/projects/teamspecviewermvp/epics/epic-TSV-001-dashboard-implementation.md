---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-001
filename_pattern: epic-TSV-001-dashboard-implementation.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-*
    optional: false
    note: At least one FI required
keywords:
  - epic
  - dashboard
  - role selection
  - BA
  - FA
  - TBD
aliases:
  - dashboard epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Done
---

# Epic: `epic-TSV-001-dashboard-implementation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-001 |
| **Status** | Done|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-14 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** BA or FA,  
**I want** a role-specific dashboard that lets me navigate the artifacts relevant to my role,  
**So that** I can quickly understand what exists and what is still missing (via `{TBD}` markers) without navigating folder structures.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | BA/FA role selection + dashboard navigation entry points + `{TBD}` highlighting/navigation | Proposed |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: BA and FA users can reliably find role-owned artifacts and identify missing documentation quickly.
- **Business Impact**: Reduces time spent interpreting TeamSpec structure and increases documentation completeness visibility.
- **Success Metrics**: Time to find artifact < 30 seconds; Dashboard navigation covers 100% of BA/FA artifact types

### Target State

- A user can select **BA** or **FA** and see a curated list of role-owned artifacts for the selected product/project context.
- When reading an artifact, `{TBD}` markers are visually highlighted and the user can navigate between occurrences.

---

## Scope

### In Scope

- [ ] BA/FA role selection for this project slice
- [ ] BA dashboard entry points to BA artifacts
- [ ] FA dashboard entry points to FA artifacts
- [ ] `{TBD}` marker highlight + navigation while viewing an artifact

### Out of Scope

- [ ] Dashboards for other roles (DEV, QA, SA, SM, DES)
- [ ] Editing or resolving `{TBD}` items from within the viewer

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-e001-YYY-description.md`._

| Story ID | Description | Status | Sprint |
|----------|-------------|--------|--------|
| [s-e001-001](../stories/backlog/s-e001-001-technical-setup.md) | Technical setup to run frontend/backend locally | Backlog | — |
| [s-e001-002](../stories/backlog/s-e001-002-role-selection.md) | Role selection (BA/FA) + role switching within session | Backlog | — |
| [s-e001-003](../stories/backlog/s-e001-003-ba-dashboard-navigation.md) | BA dashboard navigation entry points to BA artifacts | Backlog | — |
| [s-e001-004](../stories/backlog/s-e001-004-fa-dashboard-navigation.md) | FA dashboard navigation entry points to FA artifacts | Backlog | — |
| [s-e001-005](../stories/backlog/s-e001-005-tbd-marker-navigation.md) | Highlight and navigate `{TBD}` markers in opened artifacts | Backlog | — |

**Total Stories:** 5  
**Completed:** 0  
**Remaining:** 5

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | Requires | Planned | Target feature for dashboard behavior |

### Blocked By

- [ ] None (can proceed when stories are ready)

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dashboard scope creeps beyond BA/FA slice | Medium | High | Keep non-BA/FA roles explicitly out of scope for this Epic |

### Assumptions

- The viewer remains read-only for artifacts.

---

## Technical Considerations

- **Architecture Impact**: Frontend component structure for role-based navigation; backend API endpoints for artifact listing
- **Related TA/TAI**: [TA-001](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) (React frontend), [TA-002](../../products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md) (Hono backend)

---

## Acceptance Criteria

- [ ] All linked stories marked as Done
- [ ] Feature-Increment `fi-TSV-001` acceptance criteria verified by QA

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.2 (AC-1..AC-4)
- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → In Scope (`{TBD}` marker highlighting/navigation)

## Unresolved Items

- Success metrics for dashboard impact → Time to find artifact < 30 seconds (baseline: BAI baseline TBD until measurement system exists)
- Technical considerations / related TA/TAI → TA-001 and TA-002 (filled above)
