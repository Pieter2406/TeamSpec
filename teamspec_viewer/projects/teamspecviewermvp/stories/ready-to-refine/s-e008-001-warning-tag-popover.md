---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Treeview TBD warning tag + popover"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e008-001"
filename_pattern: "s-e008-001-warning-tag-popover.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-008"
    optional: false
    note: "Epic ID embedded in filename (e008)"
  - type: feature-increment
    pattern: "fi-TSV-008"
    optional: true
    note: "Implements dashboard behavior change"

# === Search Optimization ===
keywords:
  - user story
  - treeview warning
  - TBD indicator
  - popover tooltip
aliases:
  - warning triangle
  - TBD badge
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e008-001-warning-tag-popover`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e008-001 |
| **Epic** | epic-TSV-008 |
| **Status** | Ready to Refine |
| **Estimate** | {TBD} |
| **Author** | FA |
| **Sprint** | — |

---

## User Story

**As a** BA/FA user,  
**I want** a small TBD warning indicator (triangle icon + "TBD" tag) with a popover explaining what it means,  
**So that** I can immediately understand which artifacts need documentation review and why.

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

Rendered artifacts highlight `{TBD}` markers within the reader. The dashboard treeview does not show a TBD indicator; users must open artifacts to discover missing documentation.

### TO-BE (new behavior)

Dashboard treeview nodes render a **small warning triangle icon + "TBD" tag** when the artifact contains literal `{TBD}` markers. Hover/focus displays a popover explaining: "Contains literal `{TBD}` markers — this document needs review." The indicator is consistent across BA/FA dashboards and accessible.

---

## Acceptance Criteria (AC)

### Scenario 1: Indicator visible for artifacts with `{TBD}`
- **Given** an artifact with at least one literal `{TBD}` marker in its content
- **When** the dashboard treeview renders the artifact node
- **Then** a small warning triangle icon and "TBD" tag appear next to the title

### Scenario 2: Popover explains the indicator
- **Given** an artifact node with the TBD indicator
- **When** the user hovers or focuses the indicator
- **Then** a popover appears with text: "Contains literal `{TBD}` markers — this document needs review"

### Scenario 3: Accessibility
- **Given** a keyboard-only user
- **When** tabbing to the indicator
- **Then** the popover can be triggered; the indicator has appropriate ARIA label ("Contains TBDs — needs review")

### Scenario 4: No indicator when no `{TBD}`
- **Given** an artifact without any `{TBD}` markers
- **When** the dashboard treeview renders the node
- **Then** no TBD indicator appears

---

## Technical Notes

- UI components: `ArtifactTree`, `BATree` list items render an `Indicator` component when `hasTBD` is true
- Tooltip/Popover: Use existing UI library (MUI Tooltip/Popover) with accessible props
- Copy: Use the provided literal text in AC; any changes require BA sign-off

---

## UX & Copy

- Icon: Small warning triangle consistent with design system
- Tag: "TBD" label rendered compactly alongside icon
- Popover text: "Contains literal `{TBD}` markers — this document needs review"

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e008-001)
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
