---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-002
filename_pattern: epic-TSV-002-fi-navigation.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-002
    optional: false
keywords:
  - epic
  - feature increment
  - navigation
  - AS-IS TO-BE
aliases:
  - FI navigation epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Done
---

# Epic: `epic-TSV-002-fi-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-002 |
| **Status** | Done|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-15 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** FA,  
**I want** to navigate from features to their associated feature-increments and view AS-IS vs TO-BE content side-by-side,  
**So that** I can understand what changes are proposed without manually searching through files.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-002](../feature-increments/fi-TSV-002-ba-fa-feature-increment-navigation.md) | Feature ↔ Feature-Increment browsing and AS-IS/TO-BE presentation | Proposed |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: FA can quickly understand proposed changes by viewing AS-IS (current) alongside TO-BE (proposed) content.
- **Business Impact**: Reduces context-switching and improves change review efficiency.
- **Success Metrics**: Time to compare AS-IS/TO-BE < 15 seconds; 100% of FIs show linkage to parent feature

### Target State

- Users can select a feature and see all related feature-increments for the current project.
- Users can view AS-IS (from Feature Canon) and TO-BE (from Feature-Increment) content.
- Users can navigate from an FI to its linked stories.

---

## Stories

| Story ID | Title | Status |
|----------|-------|--------|
| [s-e002-001](../stories/backlog/s-e002-001-feature-fi-linking.md) | Feature to FI Linking | Backlog |
| [s-e002-002](../stories/backlog/s-e002-002-as-is-to-be-view.md) | AS-IS / TO-BE View | Backlog |
| [s-e002-003](../stories/backlog/s-e002-003-fi-story-navigation.md) | FI to Story Navigation | Backlog |

---

## Acceptance Criteria (Epic-level)

- [ ] From FA dashboard, a user can navigate to features and discover linked FIs.
- [ ] Selecting an FI shows AS-IS and TO-BE sections.
- [ ] FI view provides navigation to linked stories (when they exist).

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-15 | AI-Generated | Initial epic creation |

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-002-ba-fa-feature-increment-navigation.md → TO-BE and Acceptance Criteria

## Unresolved Items

- None
