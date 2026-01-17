---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Detect literal `{TBD}` and expose `hasTBD`"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e008-002"
filename_pattern: "s-e008-002-literal-detection.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-008"
    optional: false
    note: "Epic ID embedded in filename (e008)"
  - type: feature-increment
    pattern: "fi-TSV-008"
    optional: true
    note: "Implements backend detection + UI flag"

# === Search Optimization ===
keywords:
  - user story
  - TBD detection
  - literal token
  - backend flag
aliases:
  - hasTBD
  - tbd-scanner
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e008-002-literal-detection`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e008-002 |
| **Epic** | epic-TSV-008 |
| **Status** | Ready to Refine |
| **Estimate** | {TBD} |
| **Author** | FA |
| **Sprint** | — |

---

## User Story

**As a** dashboard user,  
**I want** detection of the **literal** `{TBD}` token in artifact Markdown content (case-sensitive, with braces) and a backend `hasTBD` flag,  
**So that** the treeview can reliably show indicators only when true `{TBD}` markers exist.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-008](../epics/epic-TSV-008-treeview-tbd-indicators.md) | Treeview TBD Indicators | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-008](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md) | Show warning on artifacts with `{TBD}` |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature

### AS-IS (current behavior)

**Reference:** f-TSV-002-role-specific-dashboards, In Scope

Rendered artifacts highlight `{TBD}` markers within the reader. The backend does not expose a `hasTBD` flag for dashboard use; treeview cannot indicate TBD presence.

### TO-BE (new behavior)

Backend relationship/content extraction computes `hasTBD` by scanning raw Markdown for the **exact literal** token `{TBD}` (uppercase, curly braces). The API returns `hasTBD` with artifact metadata; frontend uses it to render indicators.

---

## Acceptance Criteria (AC)

### Scenario 1: Literal match only
- **Given** raw Markdown content
- **When** scanning for TBD markers
- **Then** match ONLY the exact `{TBD}` sequence (uppercase T-B-D, curly braces)

### Scenario 2: Non-matches
- **Given** content containing "TBD" (without braces), `{tbd}` (lowercase), or code samples with braces but not the token
- **When** scanning
- **Then** do NOT count these as matches

### Scenario 3: API flag exposed
- **Given** the backend relationship/content service
- **When** computing metadata
- **Then** include `hasTBD: true|false` per artifact in the API response consumed by dashboards

### Scenario 4: Performance & tests
- **Given** large Markdown files
- **When** scanning
- **Then** detection runs efficiently; unit tests verify positive/negative cases

---

## Technical Notes

- Detection: Use a strict regex or string search for the exact token; e.g., `/\{TBD\}/` with case-sensitive flag
- Placement: Implement in backend content/relationship extraction (e.g., `relationshipService.ts`)
- API: Extend response DTO(s) to include `hasTBD`

---

## UX & Copy

- No UI copy changes in this story (backend-only); see s-e008-001 for UI text

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e008-002)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [ ] AC Defined (Gherkin or checklist)
- [ ] UX Attached (or "No UI required")
- [ ] Dependencies Clear
- [ ] Estimated
- [ ] Small enough for one sprint
