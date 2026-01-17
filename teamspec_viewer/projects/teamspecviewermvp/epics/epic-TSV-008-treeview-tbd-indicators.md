---
# === LLM Retrieval Metadata ===
artifact_kind: epic
spec_version: "4.0"
template_version: "4.0.1"
title: "Treeview TBD Indicators"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "epic-TSV-008"
filename_pattern: "epic-TSV-008-treeview-tbd-indicators.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-008"
    optional: false
    note: "At least one FI required"

# === Search Optimization ===
keywords:
  - epic
  - dashboard UX
  - treeview
  - TBD indicators
  - documentation quality
aliases:
  - missing documentation alert
  - artifact review cue
anti_keywords:
  - implementation detail
  - code
  - test case
---

# Epic: `epic-TSV-008-treeview-tbd-indicators`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-008 |
| **Status** | Proposed |
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-17 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** TeamSpec user (BA/FA),  
**I want** treeview items to show a small warning when an artifact contains `{TBD}` markers,  
**So that** I can quickly identify documents needing review without opening each file.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | TeamSpec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-008](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md) | Show warning on artifacts with `{TBD}` | Draft |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: Users immediately see which artifacts need attention, reducing time wasted opening documents to discover `{TBD}`.
- **Business Impact**: Improves documentation hygiene and review velocity; helps drive Canon readiness.
- **Success Metrics**:  
  - 50% reduction in time to identify missing documentation within a sprint  
  - ≥90% accurate detection of `{TBD}` markers across artifact types

### Target State

- Dashboards display a consistent, accessible warning indicator on tree nodes for artifacts containing `{TBD}` markers.
- Indicator is non-intrusive and does not disrupt sorting/filtering.

---

## Scope

### In Scope

- [ ] Detect `{TBD}` markers in artifact content reliably.
- [ ] Expose `hasTBD` in backend artifact metadata used by dashboards.
- [ ] Render a small warning icon/badge + tooltip in BA/FA tree views.
- [ ] Ensure accessibility (keyboard focus, ARIA labels).

### Out of Scope

- [ ] Inline editing or resolution of `{TBD}` markers.
- [ ] Workflow automation around `{TBD}` management.

---

## Stories

| Story ID | Description | Status | Sprint |
|----------|-------------|--------|--------|
| [s-e008-001](../stories/ready-to-refine/s-e008-001-warning-tag-popover.md) | Warning triangle + "TBD" tag + popover | Ready to Refine | — |
| [s-e008-002](../stories/ready-to-refine/s-e008-002-literal-detection.md) | Detect literal `{TBD}` and expose `hasTBD` | Ready to Refine | — |

**Total Stories:** 4  
**Completed:** 0  
**Remaining:** 2

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | Extends | Active | Adds treeview-level TBD awareness |

### Blocked By

- [ ] None

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| False detection due to template braces | Low | Medium | Strict literal match of `{TBD}` |

### Assumptions

- The viewer has access to raw Markdown content for detection.

---

## Technical Considerations

- Add `hasTBD` flag to artifact relationship/content extraction; similar to existing `status` extraction.
- Keep indicator minimal (icon/badge) and consistent with design system.

---

## Acceptance Criteria

- [ ] Stories s-e008-001..004 marked Done.
- [ ] Indicator visible for artifacts containing `{TBD}` across BA/FA dashboards.
- [ ] Accessibility verified; tooltip present.

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | 2026-01-18 | [ ] |
| Stories Refined | 2026-01-19 | [ ] |
| Development Start | 2026-01-20 | [ ] |
| Development Complete | 2026-01-24 | [ ] |
| UAT Sign-off | 2026-01-25 | [ ] |
| Canon Synced | 2026-01-26 | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI-Generated | Initial draft |

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-EPIC-001 | Feature-Increment link required | ✔ |
| TS-EPIC-002 | TO-BE section required | ✔ |
| TS-EPIC-003 | Epic ID must be unique | ✔ |
| TS-NAMING-EPIC | Naming convention check | ✔ |
