---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
title: Inline Status Editing
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-006
filename_pattern: epic-TSV-006-inline-status-editing.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-006
    optional: false
    note: Inline status editing MVP FI
keywords:
  - epic
  - inline status editing
  - dropdown
  - artifact state
  - frontmatter editing
  - status update
aliases:
  - status editing epic
  - state dropdown epic
anti_keywords:
  - implementation detail
  - code
  - test case
status: Active
---

# Epic: `epic-TSV-006-inline-status-editing`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-006 |
| **Status** | Active|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-16 |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** TeamSpec user (FA, SM, PO, BA),  
**I want** to edit artifact status directly from the tree view by clicking on status chips and selecting from a dropdown,  
**So that** I can update workflow state without context-switching to manually edit markdown files.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | TeamSpec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) | MVP inline status editing with dropdown in tree view and backend API | Proposed |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: Status updates take 2 clicks instead of: open file → find frontmatter → edit → save → close. Eliminates context switching during sprint ceremonies and standups.
- **Business Impact**: Faster artifact lifecycle management; improved team velocity during refinement and daily standups; reduced friction in workflow transitions.
- **Success Metrics**: 
  - Status update completes in < 3 seconds (2 clicks + API response)
  - Zero manual file editing required for status changes
  - 80% reduction in time spent on status updates

### Target State

After this Epic is completed:
- All status chips in ArtifactTree and BATree are clickable
- Clicking opens a dropdown with valid status options for that artifact type
- Selecting a status persists the change to the markdown file via backend API
- UI provides immediate feedback (loading, success, error with rollback)

---

## Scope

### In Scope

- [x] StatusDropdown component for tree view status chips
- [x] Centralized `statusOptions.ts` with valid values per artifact type
- [x] Backend `PATCH /api/artifacts/status` endpoint
- [x] Markdown frontmatter parsing and update logic
- [x] Loading/error states with optimistic UI rollback
- [x] Keyboard navigation for dropdown (arrows, Enter, Escape)

### Out of Scope

- [ ] Status editing in FeatureCard, BACard, SearchResults (tree view only)
- [ ] Bulk status editing (multiple artifacts at once)
- [ ] Status transition validation/workflow enforcement
- [ ] Undo/redo functionality
- [ ] Concurrent edit detection/locking

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-e006-YYY-description.md`._

| Story ID | Description | Status | Sprint |
|----------|-------------|--------|--------|
| s-e006-001 | Create StatusDropdown component with artifact-specific options | Backlog | — |
| s-e006-002 | Create statusOptions.ts utility with valid values per artifact type | Backlog | — |
| s-e006-003 | Implement PATCH /api/artifacts/status backend endpoint | Backlog | — |
| s-e006-004 | Integrate StatusDropdown into ArtifactTree component | Backlog | — |
| s-e006-005 | Integrate StatusDropdown into BATree component | Backlog | — |
| s-e006-006 | Add loading/error states with rollback behavior | Backlog | — |

**Total Stories:** 6  
**Completed:** 0  
**Remaining:** 6

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [epic-TSV-005](epic-TSV-005-usecase-centric-dashboard.md) | Soft | In Progress | Tree view must exist for status chips |
| [f-TSV-008](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md) | Requires | Planned | Feature spec defines valid status values |

### Blocked By

- [ ] None

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| File corruption during write | Low | High | Write to temp file, atomic rename |
| Concurrent edit conflicts | Medium | Medium | MVP: last-write-wins; future: optimistic locking |
| Status in varied frontmatter formats | Medium | Low | Support both `status:` field and metadata table |

### Assumptions

- Backend has write access to workspace files
- YAML frontmatter is well-formed in all artifacts
- Users accept last-write-wins for MVP (no concurrent edit detection)

---

## Technical Considerations

- **Frontend**: MUI Select or Menu component for dropdown
- **Backend**: `gray-matter` library for YAML frontmatter parsing
- **File I/O**: Atomic write pattern (temp file + rename)
- **Validation**: Status validated against artifact type before write

---

## Acceptance Criteria

_Epic-level acceptance criteria (rolled up from stories)._

- [ ] All status chips in ArtifactTree are clickable and show dropdown
- [ ] All status chips in BATree are clickable and show dropdown
- [ ] Dropdown shows only valid status options for artifact type
- [ ] Backend API updates markdown frontmatter correctly
- [ ] UI shows loading state during save
- [ ] UI reverts to previous status on error with toast notification
- [ ] Dropdown is keyboard navigable

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | 2026-01-17 | [ ] |
| All Stories Refined | 2026-01-18 | [ ] |
| Development Start | 2026-01-18 | [ ] |
| Development Complete | 2026-01-20 | [ ] |
| UAT Sign-off | 2026-01-21 | [ ] |
| Canon Synced | 2026-01-21 | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | FA | Initial draft |

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-EPIC-001 | Feature-Increment link required | ✅ Linked to fi-TSV-006 |
| TS-EPIC-002 | TO-BE section required | ✅ Defined |
| TS-EPIC-003 | Epic ID must be unique | ✅ epic-TSV-006 |
| TS-NAMING-EPIC | Naming convention check | ✅ epic-TSV-006-inline-status-editing |
