---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Backend Status Update API"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e006-003"
filename_pattern: "s-e006-003-backend-status-api.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-006"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-006"
    optional: true

# === Search Optimization ===
keywords:
  - backend API
  - PATCH endpoint
  - status update
  - frontmatter
  - markdown editing
aliases:
  - status API
anti_keywords:
  - frontend
  - UI
---

# Story: `s-e006-003-backend-status-api`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e006-003 |
| **Epic** | epic-TSV-006 |
| **Status** | Backlog |
| **Estimate** | 5 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** frontend application,  
**I want** to call a backend API to update artifact status in markdown files,  
**So that** status changes persist to the filesystem and survive page reloads.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-006](../../epics/epic-TSV-006-inline-status-editing.md) | Inline Status Editing | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-006](../../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) | MVP inline status editing with dropdown |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-008, Section: Current Behavior

- No backend API exists for updating artifact status
- Status changes require manual file editing
- Backend only reads markdown files, does not write

### TO-BE (new behavior)

- New endpoint: `PATCH /api/artifacts/status`
- Request body: `{ "path": "relative/path/to/file.md", "status": "NewStatus" }`
- Response (success): `{ "success": true, "path": "...", "previousStatus": "Old", "newStatus": "New" }`
- Response (error): `{ "success": false, "error": "Invalid status 'X' for type 'Y'. Valid: [...]" }`
- Backend behavior:
  1. Reads markdown file from workspace
  2. Parses YAML frontmatter using `gray-matter`
  3. Determines artifact type from `artifact_kind` field or filename pattern
  4. Validates status against valid options for artifact type
  5. Updates `status` field in frontmatter (or metadata table if present)
  6. Writes file back, preserving content integrity
  7. Returns previous and new status

---

## Acceptance Criteria (AC)

### Scenario 1: Successful Status Update

- **Given** file `products/teamspec-viewer/features/f-TSV-001.md` with status "Planned"
- **When** PATCH `/api/artifacts/status` with `{ "path": "products/teamspec-viewer/features/f-TSV-001.md", "status": "Active" }`
- **Then** response is `{ "success": true, "previousStatus": "Planned", "newStatus": "Active" }`
- **And** file now contains `status: Active` in frontmatter

### Scenario 2: Invalid Status Rejected

- **Given** artifact type is "feature"
- **When** PATCH with status "Unknown"
- **Then** response is `{ "success": false, "error": "Invalid status 'Unknown' for artifact type 'feature'. Valid options: Planned, Active, Deprecated, Retired" }`
- **And** file is NOT modified

### Scenario 3: File Not Found

- **Given** path points to non-existent file
- **When** PATCH is called
- **Then** response is `{ "success": false, "error": "File not found: ..." }`

### Scenario 4: Preserve File Content

- **Given** markdown file with frontmatter and body content
- **When** status is updated
- **Then** all frontmatter fields except `status` are unchanged
- **And** markdown body content is unchanged

### Scenario 5: Handle Metadata Table Format

- **Given** file has status in metadata table format (`| **Status** | Planned |`)
- **When** status is updated
- **Then** both frontmatter and metadata table are updated if present

---

## Technical Notes

- **Route**: `backend/src/routes/artifacts.ts` — add PATCH handler
- **Service**: `backend/src/services/statusService.ts` — new service for status logic
- **Library**: `gray-matter` for frontmatter parsing
- **Validation**: Share status options with frontend (or duplicate for MVP)
- **File Write**: Use atomic write pattern (write to .tmp, rename)

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e006-003)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — No UI required (backend only)
- [x] Dependencies Clear — None
- [x] Estimated — 5 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
