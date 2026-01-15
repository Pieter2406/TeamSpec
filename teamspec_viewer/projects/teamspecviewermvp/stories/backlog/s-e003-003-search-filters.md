---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e003-003"
filename_pattern: "s-e003-003-search-filters.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-003"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-003"
    optional: false

# === Search Optimization ===
keywords:
  - search
  - filters
  - artifact type
  - role filter
  - BA
  - FA
aliases:
  - search filtering
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e003-003-search-filters`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e003-003 |
| **Epic** | epic-TSV-003 |
| **Status** | Backlog |
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** BA or FA,  
**I want** to filter search results by artifact type and role ownership,  
**So that** I can narrow down results to only the document types I'm responsible for.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-003](../../epics/epic-TSV-003-artifact-search.md) | Artifact Search | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-003](../../feature-increments/fi-TSV-003-ba-fa-artifact-search.md) | BA/FA Artifact Search |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-007, Section: Current Behavior

- No deployed search filtering exists (greenfield product).
- No way to narrow search by artifact type or role.

### TO-BE (new behavior)

- The search UI includes filter controls for:
  - **Artifact Type**: Feature, Feature-Increment, Epic, Story, Business Analysis, etc.
  - **Role Ownership**: BA, FA, or "All"
- Filters are applied to search results (client-side or server-side).
- Filter selections persist during the session.
- Filter pills show active filters with ability to clear.

---

## Acceptance Criteria (AC)

### Scenario 1: Artifact type filter

- **Given** the user is on the search results view
- **When** the user selects "Feature-Increment" from the artifact type filter
- **Then** only FI-type results are shown

### Scenario 2: Role ownership filter - BA

- **Given** the user is on the search results view
- **When** the user selects "BA" from the role filter
- **Then** only BA-owned artifacts (e.g., `ba-*`, business-analysis) are shown

### Scenario 3: Role ownership filter - FA

- **Given** the user is on the search results view
- **When** the user selects "FA" from the role filter
- **Then** only FA-owned artifacts (e.g., `f-*`, `fi-*`, `s-*`) are shown

### Scenario 4: Combined filters

- **Given** both artifact type "Story" and role "FA" are selected
- **When** results are filtered
- **Then** only FA-owned story artifacts are displayed

### Scenario 5: Clear filters

- **Given** one or more filters are active
- **When** the user clicks "Clear filters"
- **Then** all filters are removed and full results are displayed

---

## Technical Notes

- Backend: Add query params `?type=feature-increment&role=FA` to `/api/search`.
- Frontend: Filter chips or dropdown selectors next to search input.
- Role detection: Parse `role_owner` from artifact front matter.
- Artifact type detection: Parse `artifact_kind` from front matter or filename pattern.

---

## Out of Scope

- Custom filter combinations saved as presets.
- Filter by date/status.
- Full-text filtering within filter labels.

---

## Definition of Done

- [ ] Artifact type filter implemented (backend + frontend)
- [ ] Role ownership filter implemented (BA, FA options)
- [ ] Combined filters work correctly
- [ ] Active filters displayed as clearable chips
- [ ] Code reviewed and merged
- [ ] Unit and integration tests passing
