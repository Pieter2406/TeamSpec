---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-005
filename_pattern: epic-TSV-005-usecase-centric-dashboard.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-005
    optional: false
    note: Use-case centric dashboard FI
keywords:
  - epic
  - use-case centric
  - visual navigation
  - artifact tree
  - FA dashboard
  - relationship visualization
aliases:
  - visual dashboard epic
  - tree view epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Done
---

# Epic: `epic-TSV-005-usecase-centric-dashboard`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-005 |
| **Status** | Done|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-16 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** Functional Analyst,  
**I want** a use-case centric dashboard where Features are the primary focal artifacts with a visual tree showing linked Feature-Increments, Epics, and Stories,  
**So that** I can intuitively understand the "change landscape" and navigate artifact relationships without mental mapping.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) | Transform FA dashboard from flat lists to Feature-centric hub with visual artifact tree | Draft |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: FA users see Features as the primary focus with clear visual relationships to FIs, Epics, and Stories — eliminating mental mapping
- **Business Impact**: Faster comprehension of work landscape; reduced onboarding time for new FAs understanding project scope
- **Success Metrics**: 
  - User can trace Feature → FI → Epic → Story in ≤ 3 clicks
  - User identifies all FIs for a Feature in < 5 seconds
  - 80% user preference over flat list view (validation feedback)

### Target State

- FA Dashboard displays Features as primary interactive cards
- Selecting a Feature expands a collapsible tree showing linked FIs, Epics, and Stories
- Visual indicators show relationship counts, statuses, and project context
- Navigation preserves context (tree stays visible while viewing details)

---

## Scope

### In Scope (MVP)

- [ ] Feature cards as primary dashboard elements (replacing equal-weight lists)
- [ ] Collapsible tree view showing Feature → FI → Epic → Story hierarchy
- [ ] Badge counts showing linked artifact totals (e.g., "2 FIs · 1 Epic")
- [ ] Expand/collapse all functionality
- [ ] Click to quick-view artifact summary (tooltip or side panel)
- [ ] Double-click to open full artifact in reader

### Out of Scope (Future Iterations)

- [ ] Graph/network visualization (interactive node diagram)
- [ ] Cross-project filtering and comparison views
- [ ] BA dashboard transformation (separate epic)
- [ ] Automated relationship discovery (relies on explicit YAML links)
- [ ] Relationship editing capabilities

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-e005-YYY-description.md`._

| Story ID | Description | Status | Sprint | Est |
|----------|-------------|--------|--------|-----|
| [s-e005-001](../stories/backlog/s-e005-001-feature-card-layout.md) | Replace FA artifact lists with Feature-centric card layout | Backlog | — | 3 SP |
| [s-e005-002](../stories/backlog/s-e005-002-artifact-tree-component.md) | Create collapsible artifact tree component | Backlog | — | 5 SP |
| [s-e005-003](../stories/backlog/s-e005-003-relationship-api.md) | Backend API for Feature relationships | Backlog | — | 3 SP |
| [s-e005-004](../stories/backlog/s-e005-004-tree-node-interactions.md) | Implement tree node click/hover interactions | Backlog | — | 3 SP |

**Total Stories:** 4  
**Total Estimate:** 14 SP  
**Completed:** 0  
**Remaining:** 4

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [epic-TSV-001](epic-TSV-001-dashboard-implementation.md) | Requires | In Progress | Basic dashboard infrastructure must exist |
| [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | Requires | Proposed | FA dashboard component must be implemented |

### Blocked By

- [ ] None currently identified

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Performance with deeply nested trees | Medium | Medium | Implement lazy loading for deep nodes; virtualize long lists |
| Relationship data incomplete in artifacts | Medium | High | MVP uses explicit links only; provide "no links found" UX |
| Users prefer flat lists | Low | Medium | A/B testing; provide toggle to switch views |

### Assumptions

- Artifacts contain explicit links in YAML frontmatter (e.g., `links_required`)
- MUI TreeView or similar component meets performance needs
- Backend can parse artifact relationships on-demand (no pre-indexing required for MVP)

---

## Technical Considerations

_High-level technical approach (SA input)._

- **Frontend Component**: MUI TreeView with custom node rendering, or custom collapsible tree
- **State Management**: Track expanded node IDs in component state
- **API Enhancement**: New endpoint `GET /api/features/:featureId/relationships` returning nested structure
- **Performance**: Consider caching relationship data after first load

---

## Acceptance Criteria

_Epic-level acceptance criteria (rolled up from stories)._

- [ ] FA Dashboard shows Features as primary focal artifacts (not a flat list among four)
- [ ] User can expand a Feature to see linked FIs, Epics, and Stories in tree form
- [ ] Tree nodes display artifact ID, title, status, and project context
- [ ] Badge counts accurately reflect linked artifact totals
- [ ] Click opens quick-view; double-click opens full reader
- [ ] Expand all / Collapse all buttons function correctly
- [ ] Performance: Tree loads within 1 second for 10 Features with 20 FIs total

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | 2026-01-17 | [ ] |
| All Stories Refined | 2026-01-18 | [ ] |
| Development Start | 2026-01-20 | [ ] |
| Development Complete | 2026-01-24 | [ ] |
| Validation/Feedback | 2026-01-25 | [ ] |
| Iteration Epic Created | 2026-01-27 | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated (FA) | Initial MVP epic draft |

---

## Sources Consulted

- [fi-TSV-005-usecase-centric-dashboard.md](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) → TO-BE section, Acceptance Criteria
- [epic-TSV-001-dashboard-implementation.md](epic-TSV-001-dashboard-implementation.md) → Structure reference
- [FADashboard.tsx](../../frontend/src/components/FADashboard.tsx) → Current implementation baseline

## Unresolved Items

- ~~Exact tree component selection~~ → **RESOLVED**: MUI `@mui/x-tree-view` (SimpleTreeView) with custom `ArtifactTreeNode` rendering
- ~~Backend relationship parsing approach~~ → **RESOLVED**: File-based scanning with YAML frontmatter parsing; FI→Feature link via `Target Feature` field; Epic link via `Epic:` field; Stories by `s-eXXX-*` filename pattern
