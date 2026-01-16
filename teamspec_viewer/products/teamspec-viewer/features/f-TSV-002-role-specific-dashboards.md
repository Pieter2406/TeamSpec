---
# === LLM Retrieval Metadata ===
artifact_kind: feature
spec_version: "4.0"
template_version: "4.0.1"
title: "Role-Specific Dashboards"

# === Ownership ===
role_owner: FA
artifact_type: Product Canon
canonicality: canon
lifecycle: permanent

# === Naming ===
id_pattern: "f-TSV-002"
filename_pattern: "f-TSV-002-role-specific-dashboards.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: decision
    pattern: "dec-TSV-*"
    optional: true

# === Search Optimization ===
keywords:
  - role dashboard
  - role-based navigation
  - artifact ownership
aliases:
  - dashboards
anti_keywords:
  - implementation details
  - technical design
  - architecture
  - story
  - delta
  - proposed change
---

# Feature: `f-TSV-002-role-specific-dashboards`

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
| **Feature ID** | f-TSV-002 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Planned |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-14 |
| **Last Updated** | 2026-01-14 |

---

## Governing Decisions

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| ta-TSV-001 | React Browser Frontend | Dashboard UI built with React + TypeScript + MUI |
| ta-TSV-002 | Hono.js Backend | Backend provides artifact listing APIs by role |

---

## Purpose

Enable users to quickly access and browse the artifacts relevant to their TeamSpec role (e.g., BA, FA), without needing to understand folder structures and filename conventions.

---

## Business Value

- **User Impact**: Reduces cognitive load by presenting a curated view of documentation per role.
- **Business Impact**: Improves role productivity and supports consistent application of TeamSpec ownership boundaries.
- **Success Metrics**: User can navigate from role selection to viewing an artifact within 3 clicks

---

## In Scope

- [ ] Provide one dashboard per TeamSpec role.
- [ ] Each dashboard lists the artifacts owned by that role.
- [ ] The dashboard provides quick navigation into those artifacts.
- [ ] `{TBD}` markers in rendered artifacts are highlighted and can be navigated (e.g., next/previous `{TBD}`) so users can quickly identify missing documentation.

---

## Out of Scope

- [ ] Using dashboards as access control / permissions enforcement.
- [ ] Editing artifacts from within the dashboard.
- [ ] Resolving `{TBD}` items within the viewer (the viewer remains read-only).

---

## Actors / Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Business Analyst | Owns BA artifacts | Quickly locate BA documents and BA increments |
| Functional Analyst | Owns features/FIs/epics/stories | Quickly navigate features, FIs, epics, and stories |

---

## Current Behavior

### Role Selection

User selects BA or FA role via RoleSelector component. Selection is stored in RoleContext and persists for the session. User can switch roles at any time via header role badge.

### Role Dashboard Content

- **BA Dashboard**: Lists business-analysis documents and BA increments for the active product/project
- **FA Dashboard**: Lists features, feature-increments, epics, and stories for the active product/project

### User Flows

1. User opens viewer → sees role selection screen
2. User selects BA or FA → sees role-specific dashboard
3. User clicks artifact → artifact content is displayed in reader
4. User can switch roles via header badge

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| No artifacts for role | Display "No artifacts found" message |
| Artifact file missing | Show error toast and remain on dashboard |
| Role not selected | Show RoleSelector component |

---

## Business Rules

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-TSV-005 | Each role owns specific artifact types | When determining dashboard content |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| BA | View BA artifacts and related links |
| FA | View FA artifacts and related links |
| (Future) | DEV, QA, SA, SM, PO dashboards planned post-MVP |

---

## Non-Functional Notes

- **Performance**: Dashboard should load within 1 second; artifact list within 2 seconds
- **Security**: Read-only access; no authentication required for local viewer
- **Accessibility**: WCAG 2.1 AA compliance; keyboard navigation supported
- **Availability**: Local application; availability depends on user's machine

---

## Non-Goals

- Replace TeamSpec tooling for creating artifacts.

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Which role set is authoritative (from spec files vs hardcoded list)? | FA | Resolved | MVP uses hardcoded list (BA, FA); future: derive from spec/4.0/roles.md |
| Q-002 | Should a user be able to switch roles within a session? | FA | Resolved | Yes, via header role badge click |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| [f-TSV-001](f-TSV-001-product-portfolio-view.md) | Depends on (portfolio context) |
| [f-TSV-003](f-TSV-003-feature-increment-navigation.md) | Extends (FA navigation) |
| [f-TSV-004](f-TSV-004-epic-and-story-navigation.md) | Extends (FA navigation) |

---

## Change Log

| Date | Source | Change Summary | Author |
|------|--------|----------------|--------|
| 2026-01-14 | — | Initial feature creation | AI-Generated |
| 2026-01-15 | fi-TSV-001 | TBD resolution for MVP implementation | AI-Generated |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope), item 2 “Role-Specific Dashboards”
- teamspec_viewer/projects/teamspecviewermvp/business-analysis-increments/bai-TSV-001-mvp-ba-fa-holistic-view.md → Section 4.1 (BA + FA delivery focus)

## Unresolved Items

- ~~Current production behavior for this feature~~ → **RESOLVED**: Greenfield product; MVP behavior documented in Current Behavior section above
- ~~Whether dashboards exist for all roles in the first delivery slice~~ → **RESOLVED**: MVP delivers BA and FA dashboards only; other roles (DEV, QA, SA, SM, PO) planned post-MVP
