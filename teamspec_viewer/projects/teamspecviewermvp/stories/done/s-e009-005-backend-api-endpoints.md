---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: Backend API Endpoints for DEV/SA/QA
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e009-005
filename_pattern: s-e009-005-backend-api-endpoints.md
links_required:
  - type: epic
    pattern: epic-TSV-009
    optional: false
  - type: feature-increment
    pattern: fi-TSV-009
    optional: true
keywords:
  - backend API
  - REST endpoints
  - dev-plans API
  - test cases API
  - solution designs API
aliases:
  - API endpoints
anti_keywords:
  - frontend
  - UI component
status: Done
---

# Story: `s-e009-005-backend-api-endpoints`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-005 |
| **Epic** | epic-TSV-009 |
| **Status** | Done|
| **Estimate** | 8 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** frontend developer,  
**I want** backend API endpoints that list DEV, SA, and QA artifacts,  
**So that** the dashboards can fetch and display role-specific artifact data.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) | DEV/SA/QA Role Dashboards | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-009](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role selection + dashboard navigation |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** ta-TSV-002, Section: API Endpoints

- API endpoints exist for:
  - Features: `GET /api/products/:productId/features`
  - Feature-Increments: `GET /api/projects/:projectId/feature-increments`
  - Business Analysis: `GET /api/products/:productId/business-analysis`
  - Epics: `GET /api/projects/:projectId/epics`
  - Stories: `GET /api/projects/:projectId/stories`
- No endpoints exist for dev-plans, test cases, bug reports, SD, TA, SDI, TAI

### TO-BE (new behavior)

New API endpoints are added to support DEV/SA/QA dashboards:

**DEV Endpoints:**
- `GET /api/projects/:projectId/dev-plans` — Lists all dev-plans in project
- `GET /api/products/:productId/technical-architecture` — Lists all TA docs in product
- `GET /api/projects/:projectId/tai` — Lists all TAI docs in project

**SA Endpoints:**
- `GET /api/products/:productId/solution-designs` — Lists all SD docs in product
- `GET /api/projects/:projectId/sdi` — Lists all SDI docs in project
- (TA endpoints shared with DEV)

**QA Endpoints:**
- `GET /api/projects/:projectId/test-cases` — Lists all test cases in project
- `GET /api/products/:productId/regression-tests` — Lists all regression tests in product
- `GET /api/projects/:projectId/bug-reports` — Lists all bug reports in project

Each endpoint returns:
```json
{
  "artifacts": [
    {
      "id": "dp-e001-s001",
      "title": "OAuth Implementation Plan",
      "status": "Draft",
      "path": "projects/.../dev-plans/dp-e001-s001-oauth-impl.md",
      "scope": "project"
    }
  ]
}
```

---

## Acceptance Criteria (AC)

### Scenario 1: List Dev Plans

- **Given** project `teamspecviewermvp` has dev-plans
- **When** `GET /api/projects/teamspecviewermvp/dev-plans` is called
- **Then** response contains array of dev-plan artifacts
- **And** each artifact has id, title, status, and path

### Scenario 2: List Technical Architectures (Product)

- **Given** product `teamspec-viewer` has TA documents
- **When** `GET /api/products/teamspec-viewer/technical-architecture` is called
- **Then** response contains array of TA artifacts
- **And** each artifact scope is "product"

### Scenario 3: List Solution Designs (Product)

- **Given** product `teamspec-viewer` has SD documents
- **When** `GET /api/products/teamspec-viewer/solution-designs` is called
- **Then** response contains array of SD artifacts

### Scenario 4: List SDI (Project)

- **Given** project `teamspecviewermvp` has SDI documents
- **When** `GET /api/projects/teamspecviewermvp/sdi` is called
- **Then** response contains array of SDI artifacts
- **And** each artifact scope is "project"

### Scenario 5: List TAI (Project)

- **Given** project `teamspecviewermvp` has TAI documents
- **When** `GET /api/projects/teamspecviewermvp/tai` is called
- **Then** response contains array of TAI artifacts

### Scenario 6: List Test Cases (Project)

- **Given** project `teamspecviewermvp` has test cases
- **When** `GET /api/projects/teamspecviewermvp/test-cases` is called
- **Then** response contains array of test case artifacts

### Scenario 7: List Regression Tests (Product)

- **Given** product `teamspec-viewer` has regression test documents
- **When** `GET /api/products/teamspec-viewer/regression-tests` is called
- **Then** response contains array of regression test artifacts

### Scenario 8: List Bug Reports (Project)

- **Given** project `teamspecviewermvp` has bug reports
- **When** `GET /api/projects/teamspecviewermvp/bug-reports` is called
- **Then** response contains array of bug report artifacts
- **And** each artifact includes status (Open, In-Progress, Resolved, Closed)

### Scenario 9: Empty Response

- **Given** project has no dev-plans
- **When** `GET /api/projects/:projectId/dev-plans` is called
- **Then** response is `{ "artifacts": [] }`
- **And** HTTP status is 200

### Scenario 10: Invalid Project/Product ID

- **Given** project ID does not exist
- **When** any endpoint is called with invalid ID
- **Then** HTTP status is 404
- **And** error message indicates resource not found

---

## Technical Notes

- **File**: `backend/src/routes/artifacts.ts` (extend existing)
- **Folder Scanning**: Use existing file scanning utilities
- **Metadata Extraction**: Parse YAML frontmatter for title, status
- **Path Patterns**:
  - Dev plans: `projects/*/dev-plans/dp-*.md`
  - Test cases: `projects/*/qa/test-cases/tc-*.md`
  - Bug reports: `projects/*/qa/bug-reports/bug-*.md`
  - SD: `products/*/solution-designs/sd-*.md`
  - TA: `products/*/technical-architecture/ta-*.md`
  - SDI: `projects/*/solution-design-increments/sdi-*.md`
  - TAI: `projects/*/technical-architecture-increments/tai-*.md`
  - Regression tests: `products/*/qa/regression-tests/rt-*.md`

---

## API Response Schema

```typescript
interface ArtifactListResponse {
  artifacts: Array<{
    id: string;
    title: string;
    status: string;
    path: string;
    scope: 'product' | 'project';
  }>;
}
```

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-005)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — No UI required (backend only)
- [x] Dependencies Clear — None
- [x] Estimated — 8 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed (unit tests for each endpoint)
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
