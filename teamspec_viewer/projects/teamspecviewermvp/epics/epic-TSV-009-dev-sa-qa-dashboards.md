---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-009
filename_pattern: epic-TSV-009-dev-sa-qa-dashboards.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-009
    optional: false
    note: At least one FI required
keywords:
  - epic
  - dashboard
  - role selection
  - DEV
  - SA
  - QA
  - developer
  - architect
  - tester
aliases:
  - technical team dashboards epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Active
---

# Epic: `epic-TSV-009-dev-sa-qa-dashboards`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-009 |
| **Status** | Active|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-17 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** Developer, Solution Architect, or QA Engineer,  
**I want** a role-specific dashboard that lets me navigate the artifacts relevant to my role,  
**So that** I can quickly access dev-plans, technical architectures, test cases, and other role-owned artifacts without navigating folder structures.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role selection + dashboard navigation entry points for technical team artifacts | Active |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: DEV, SA, and QA users can reliably find role-owned artifacts and navigate directly to relevant documentation.
- **Business Impact**: Completes the dashboard coverage for technical team roles, enabling full team adoption of the TeamSpec Viewer.
- **Success Metrics**: 
  - Time to find artifact < 30 seconds
  - Dashboard navigation covers 100% of DEV/SA/QA artifact types
  - All technical roles have dedicated dashboard access

### Target State

- A user can select **DEV** and see a curated list of dev-plans, stories, and technical documentation.
- A user can select **SA** and see a curated list of solution designs, technical architectures, and their project increments.
- A user can select **QA** and see a curated list of test cases, regression tests, and bug reports.
- When reading an artifact, `{TBD}` markers are visually highlighted and the user can navigate between occurrences.

---

## Scope

### In Scope

- [ ] Extend RoleSelector to include DEV, SA, QA options
- [ ] DEV dashboard entry points to dev-plans, stories, technical architecture
- [ ] SA dashboard entry points to solution designs, technical architectures, and increments
- [ ] QA dashboard entry points to test cases, regression tests, bug reports
- [ ] `{TBD}` marker highlight + navigation while viewing an artifact (existing behavior)

### Out of Scope

- [ ] Dashboards for other roles (SM, PO, DES)
- [ ] Sprint context selection for DEV dashboard
- [ ] Editing or resolving `{TBD}` items from within the viewer
- [ ] Permissions or access control

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-e009-YYY-description.md`._

| Story ID | Description | Status | Sprint | Estimate |
|----------|-------------|--------|--------|----------|
| [s-e009-001](../stories/done/s-e009-001-extend-role-selector.md) | Extend RoleSelector component to include DEV, SA, QA options | Done | — | 2 SP |
| [s-e009-002](../stories/done/s-e009-002-dev-dashboard-navigation.md) | DEV dashboard navigation entry points to dev-plans, stories, TA docs | Done | — | 5 SP |
| [s-e009-003](../stories/backlog/s-e009-003-sa-dashboard-navigation.md) | SA dashboard navigation entry points to SD, TA, and increments | Backlog | — | 5 SP |
| [s-e009-004](../stories/backlog/s-e009-004-qa-dashboard-navigation.md) | QA dashboard navigation entry points to test cases, regression tests, bugs | Backlog | — | 5 SP |
| [s-e009-005](../stories/done/s-e009-005-backend-api-endpoints.md) | Backend API endpoints for DEV/SA/QA artifact listing | Done | — | 8 SP |
| [s-e009-006](../stories/backlog/s-e009-006-integration-testing.md) | Integration testing for new role dashboards | Backlog | — | 3 SP |
| [s-e009-007](../stories/done/s-e009-007-enable-status-updates.md) | Enable status updates across role dashboards | Done | — | 5 SP |

**Total Stories:** 7  
**Total Estimate:** 33 SP  
**Completed:** 4  
**Remaining:** 3

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | Requires | Done | BA/FA dashboard pattern provides foundation |
| [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | Requires | Active | Target feature for dashboard behavior |
| [epic-TSV-001](epic-TSV-001-dashboard-implementation.md) | Requires | Done | Initial dashboard implementation complete |

### Blocked By

- [ ] None (can proceed when stories are ready)

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Inconsistent artifact structure for DEV/SA/QA across projects | Medium | Medium | Define clear API contracts and validate against teamspec-viewer project |
| Large number of test cases causing performance issues | Low | Medium | Implement pagination/lazy loading |
| Scope creep to include SM/PO/DES dashboards | Medium | Low | Strictly enforce out-of-scope definition |

### Assumptions

- Existing BA/FA dashboard patterns (components, API structure) can be reused
- Dev-plans, test cases, and bug reports follow consistent naming conventions
- Solution designs and technical architectures exist in product structure

---

## Technical Considerations

_High-level technical approach (SA input)._

- **Architecture Impact**: Extends existing dashboard infrastructure; no new architectural patterns required
- **Related TAI**: None required (uses existing ta-TSV-001 patterns)
- **Performance Considerations**: May need pagination for QA artifacts if test case count is high

**Frontend Components:**
- DEVDashboard.tsx (follows FADashboard pattern)
- SADashboard.tsx (follows FADashboard pattern)
- QADashboard.tsx (follows FADashboard pattern)
- DevPlanTree.tsx, TestCaseTree.tsx, BugReportTree.tsx (tree navigation)

**Backend Endpoints:**
- `GET /api/products/:productId/technical-architecture`
- `GET /api/products/:productId/solution-designs`
- `GET /api/projects/:projectId/dev-plans`
- `GET /api/projects/:projectId/test-cases`
- `GET /api/products/:productId/regression-tests`
- `GET /api/projects/:projectId/bug-reports`

---

## Acceptance Criteria

_Epic-level acceptance criteria (rolled up from stories)._

- [ ] All linked stories marked as Done
- [ ] DEV, SA, QA roles selectable in RoleSelector
- [ ] Each role has dedicated dashboard with appropriate artifact navigation
- [ ] Feature Canon updated via `ts:po sync`
- [ ] UAT completed and signed off

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | {TBD} | [ ] |
| All Stories Refined | {TBD} | [ ] |
| Development Start | {TBD} | [ ] |
| Development Complete | {TBD} | [ ] |
| UAT Sign-off | {TBD} | [ ] |
| Canon Synced | {TBD} | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI-Generated | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → Section "Roles & Permissions" (future DEV/QA/SA dashboards mentioned)
- teamspec_viewer/projects/teamspecviewermvp/epics/epic-TSV-001-dashboard-implementation.md → Pattern reference
- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → BA/FA dashboard scope

## Unresolved Items

- Timeline dates → {TBD} (to be determined during sprint planning)

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-EPIC-001 | Feature-Increment link required | ✓ Checked |
| TS-EPIC-002 | TO-BE section required | ✓ Checked |
| TS-EPIC-003 | Epic ID must be unique | ✓ Checked |
| TS-NAMING-EPIC | Naming convention check | ✓ Checked |
