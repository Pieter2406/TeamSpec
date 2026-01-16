---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Relationship API Endpoint"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e005-003"
filename_pattern: "s-e005-003-relationship-api.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-005"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-005"
    optional: true

# === Search Optimization ===
keywords:
  - relationship API
  - backend
  - feature relationships
  - linked artifacts
aliases:
  - relationships endpoint
anti_keywords:
  - frontend
  - UI
---

# Story: `s-e005-003-relationship-api`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e005-003 |
| **Epic** | epic-TSV-005 |
| **Status** | Done |
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** TeamSpec Viewer application,  
**I want** a backend API endpoint that returns linked artifacts for a Feature,  
**So that** the frontend can render the artifact relationship tree.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-005](../../epics/epic-TSV-005-usecase-centric-dashboard.md) | Use-Case Centric Dashboard | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-005](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) | Use-case centric dashboard with visual artifact tree |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** Technical Architecture

- Backend provides separate endpoints for each artifact type:
  - `GET /api/products/:productId/features` — lists features
  - `GET /api/projects/:projectId/feature-increments` — lists FIs
  - `GET /api/projects/:projectId/epics` — lists epics
  - `GET /api/projects/:projectId/stories` — lists stories
- No endpoint exists to retrieve linked/related artifacts for a given Feature
- Frontend must make 4 separate calls and perform client-side joining

### TO-BE (new behavior)

- New API endpoint: `GET /api/features/:featureId/relationships`
- Endpoint returns a nested structure showing:
  - The Feature details
  - All Feature-Increments that target this Feature (with project context)
  - For each FI: linked Epic (if any)
  - For each Epic: linked Stories
- Response includes artifact ID, title, status, and project for each item

---

## Sprint Assignment

**Sprint:** —  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

---

## Acceptance Criteria (AC)

### Scenario 1: Endpoint returns Feature with linked FIs

- **Given** Feature `f-TSV-002` exists with linked FIs `fi-TSV-001` and `fi-TSV-005`
- **When** client calls `GET /api/features/f-TSV-002/relationships`
- **Then** response includes Feature details
- **And** response includes both FIs in `featureIncrements` array
- **And** each FI includes `project` field indicating owning project

### Scenario 2: FI includes linked Epic

- **Given** `fi-TSV-001` links to `epic-TSV-001`
- **When** relationships are retrieved for `f-TSV-002`
- **Then** `fi-TSV-001` object includes `epic` object with epic details

### Scenario 3: Epic includes linked Stories

- **Given** `epic-TSV-001` has stories `s-e001-001`, `s-e001-002`
- **When** relationships are retrieved
- **Then** epic object includes `stories` array with story details

### Scenario 4: Feature with no linked FIs

- **Given** Feature `f-TSV-999` exists with no linked FIs
- **When** client calls `GET /api/features/f-TSV-999/relationships`
- **Then** response includes Feature details
- **And** `featureIncrements` is an empty array `[]`

### Scenario 5: Response structure

- **Given** a valid Feature ID
- **When** relationships are retrieved
- **Then** response matches this structure:
  ```json
  {
    "feature": {
      "id": "f-TSV-002",
      "title": "Role-Specific Dashboards",
      "status": "Planned"
    },
    "featureIncrements": [
      {
        "id": "fi-TSV-001",
        "title": "BA/FA Role Dashboards",
        "status": "proposed",
        "project": "teamspecviewermvp",
        "epic": {
          "id": "epic-TSV-001",
          "title": "Dashboard Implementation",
          "status": "In Progress",
          "stories": [
            { "id": "s-e001-001", "title": "Technical Setup", "status": "Done" },
            { "id": "s-e001-002", "title": "Role Selection", "status": "Backlog" }
          ]
        }
      }
    ]
  }
  ```

### Scenario 6: Invalid Feature ID

- **Given** Feature ID `f-INVALID-999` does not exist
- **When** client calls `GET /api/features/f-INVALID-999/relationships`
- **Then** response is HTTP 404 with error message

---

## Technical Notes

- **Endpoint**: `GET /api/features/:featureId/relationships`
- **Implementation**: 
  1. Parse Feature file to get metadata
  2. Scan all projects' feature-increments for FIs targeting this Feature
  3. For each FI, check YAML frontmatter for linked epic
  4. For each Epic, scan stories folder for `s-eXXX-*` files
- **Performance**: Consider caching relationship data; scan can be expensive
- **TAI**: Aligns with ta-TSV-002 (Hono.js backend)

---

## UX & Copy

- N/A (backend story)

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e005-003)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin format with JSON schema)
- [x] UX Attached — N/A (backend)
- [x] Dependencies Clear
- [x] Estimated
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete
- [ ] FA Accepted
- [ ] Story marked Done in backlog

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| None | — | — |

> This story has no blockers; can be developed in parallel with s-e005-001.

---

## Sources Consulted

- [fi-TSV-005-usecase-centric-dashboard.md](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) → Section 5.1 "Technical Considerations" (API Enhancement)
- Backend code in `teamspec_viewer/backend/src/`

## Unresolved Items

- ~~Caching strategy for relationship data~~ → **RESOLVED**: MVP uses no caching (on-demand file scan); if performance issues arise, implement in-memory LRU cache with 60-second TTL, invalidated on file watch events
