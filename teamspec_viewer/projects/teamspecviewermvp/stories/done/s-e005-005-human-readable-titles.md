---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Human-Readable Artifact Titles"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e005-005"
filename_pattern: "s-e005-005-human-readable-titles.md"

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
  - title
  - human readable
  - UX
  - dashboard display
  - frontmatter
aliases:
  - friendly titles
  - artifact display names
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e005-005-human-readable-titles`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e005-005 |
| **Epic** | epic-TSV-005 |
| **Status** | Done |
| **Estimate** | 2 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** BA or FA using the TeamSpec Viewer,  
**I want** all artifacts displayed with their human-readable `title` from frontmatter instead of technical IDs or markdown headings,  
**So that** I can quickly understand what each artifact represents without mentally parsing technical naming conventions.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-005](../../epics/epic-TSV-005-usecase-centric-dashboard.md) | Use-Case Centric Dashboard | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-005](../../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) | Use-case centric dashboard implementation |

---

## Feature Impact

### Impact Type

- [ ] **Adds Behavior**
- [x] **Changes Behavior** — Modifies how artifact titles are displayed
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Role Dashboard Content

Currently, artifact titles are extracted from the first `#` heading in markdown files, which produces technical titles like:
- `Feature: f-TSV-001-product-portfolio-view`
- `Story: s-e001-001-technical-setup`
- `Epic: epic-TSV-005-usecase-centric-dashboard`

These technical titles are displayed in:
- Feature cards on FA dashboard
- Artifact tree nodes
- Search results
- FI detail views
- Linked stories panels

### TO-BE (new behavior)

Artifact titles are extracted from the `title` field in YAML frontmatter, producing user-friendly titles like:
- `Product Portfolio Overview`
- `Technical Project Setup`
- `Use-Case Centric Dashboard`

**Fallback logic:**
1. Use `title` from frontmatter (preferred)
2. Fall back to first `#` heading if no frontmatter title
3. Fall back to filename if no heading found

---

## Acceptance Criteria (AC)

### Scenario 1: Feature card displays frontmatter title

- **Given** a feature file has `title: "Product Portfolio Overview"` in frontmatter
- **When** the feature is displayed on the FA dashboard
- **Then** the card shows "Product Portfolio Overview" as the title
- **And** the technical ID `f-TSV-001` is shown in smaller text below

### Scenario 2: Tree nodes display frontmatter title

- **Given** an artifact tree is expanded for a feature
- **When** FIs, epics, and stories are displayed as tree nodes
- **Then** each node shows the frontmatter title (e.g., "BA and FA Role Dashboards")
- **And** the technical ID is shown as a secondary label

### Scenario 3: Search results display frontmatter title

- **Given** a user searches for "dashboard"
- **When** search results are displayed
- **Then** each result shows the frontmatter title as the primary label
- **And** the technical ID and path are shown as secondary information

### Scenario 4: Fallback to heading when no frontmatter title

- **Given** an artifact file has no `title` field in frontmatter
- **When** the artifact is displayed anywhere in the UI
- **Then** the system falls back to the first `#` heading
- **And** the behavior matches the current implementation

### Scenario 5: BA dashboard uses frontmatter titles

- **Given** the BA dashboard displays business analysis documents
- **When** BA cards and BAI tree nodes are rendered
- **Then** all titles come from frontmatter `title` field

---

## Technical Notes

- **Backend Change**: Update `extractTitle()` in `artifacts.ts` to read `title` from YAML frontmatter first
- **Backend Change**: Update `extractTitle()` in `relationshipService.ts` similarly
- **Backend Change**: Update `extractTitle()` and `extractMetadata()` in `searchService.ts`
- **No Frontend Changes**: Frontend already displays `artifact.title` — only the source changes

---

## UX & Copy

- No UI changes required
- Titles should be 20-40 characters per TeamSpec MV-005 rule

---

## Links

- See Linked Epic section above
- See Linked Feature-Increment section above

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e005-005)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear
- [x] Estimated
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete
- [ ] FA Accepted
- [ ] Story marked Done in backlog
