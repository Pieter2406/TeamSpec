---
artifact_kind: feature
spec_version: '4.0'
template_version: 4.0.1
title: Feature Increment Navigation
role_owner: FA
artifact_type: Product Canon
canonicality: canon
lifecycle: permanent
id_pattern: f-TSV-003
filename_pattern: f-TSV-003-feature-increment-navigation.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: decision
    pattern: dec-TSV-*
    optional: true
keywords:
  - feature increment
  - FI navigation
  - AS-IS TO-BE
aliases:
  - FI browser
anti_keywords:
  - implementation details
  - technical design
  - architecture
  - story
  - delta
  - proposed change
status: Active
---

# Feature: `f-TSV-003-feature-increment-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Feature (Product Canon)  
**Lifecycle:** Permanent, updated via Canon Sync after deployment

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | f-TSV-003 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Active|
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-14 |
| **Last Updated** | 2026-01-14 |

---

## Governing Decisions

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| {TBD} | {TBD} | {TBD} |

---

## Purpose

Enable users (especially FA) to browse features and their corresponding feature-increments, and to view AS-IS and TO-BE content in a user-friendly way.

---

## Business Value

- **User Impact**: Helps users understand proposed changes without manually correlating filenames.
- **Business Impact**: Supports change comprehension and reduces analysis effort across projects.
- **Success Metrics**: {TBD}

---

## In Scope

- [ ] Browse features and identify corresponding feature-increments.
- [ ] Show AS-IS and TO-BE sections side-by-side for a selected feature-increment.
- [ ] Display linked stories for each feature-increment.

---

## Out of Scope

- [ ] Editing AS-IS or TO-BE content from within the viewer.

---

## Actors / Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Functional Analyst | Defines features, feature-increments, epics, stories | Navigate from feature → FI → stories |
| Business Analyst | Consumes business context | Understand what changes are being proposed |

---

## Current Behavior

### Feature ↔ Feature-Increment Linking

{TBD}

### AS-IS / TO-BE Presentation

{TBD}

### User Flows

1. {TBD}

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| {TBD} | {TBD} |

---

## Business Rules

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-TSV-002 | Projects propose changes to one or more products | When sourcing feature-increments per product/feature |
| BR-TSV-003 | Features have corresponding Feature-Increments when projects are active | When listing feature-increments for a feature |
| BR-TSV-006 | Artifact relationships are computed from filenames and markdown links | When resolving feature ↔ FI ↔ story relationships |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| FA | View features, feature-increments, and linked stories |
| BA | View BA context and linked features/FIs |

---

## Non-Functional Notes

- **Performance**: {TBD}
- **Security**: {TBD}
- **Accessibility**: {TBD}
- **Availability**: {TBD}

---

## Non-Goals

- Provide a general-purpose markdown workspace.

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Which artifact relationship pathways are required in MVP vs later? | {TBD} | Open | {TBD} |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| [f-TSV-002](f-TSV-002-role-specific-dashboards.md) | Depends on (FA entry point) |
| [f-TSV-004](f-TSV-004-epic-and-story-navigation.md) | Complements (stories exploration) |
| [f-TSV-007](f-TSV-007-artifact-search.md) | Complements (finding FIs/features) |

---

## Change Log

| Date | Source | Change Summary | Author |
|------|--------|----------------|--------|
| 2026-01-14 | — | Initial feature creation | {TBD} |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope), item 3 “Feature-Increment Navigation”

## Unresolved Items

- Current production behavior for this feature → {TBD} (no deployed behavior described in Feature Canon yet)
- Exact AS-IS/TO-BE rendering expectations (layout, diffing vs side-by-side) → {TBD} (requires DES/FA decision)
