---
# === LLM Retrieval Metadata ===
artifact_kind: feature
spec_version: "4.0"
template_version: "4.0.1"
title: "Inline Status Editing"

# === Ownership ===
role_owner: FA
artifact_type: Product Canon
canonicality: canon
lifecycle: permanent

# === Naming ===
id_pattern: "f-TSV-008"
filename_pattern: "f-TSV-008-inline-status-editing.md"

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
  - status editing
  - inline editing
  - artifact state
  - dropdown
  - status transition
  - workflow state
aliases:
  - state editing
  - status dropdown
anti_keywords:
  - implementation details
  - technical design
  - architecture
  - story
  - delta
  - proposed change
---

# Feature: `f-TSV-008-inline-status-editing`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Feature (Product Canon)  
**Lifecycle:** Permanent, updated via Canon Sync after deployment

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | f-TSV-008 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Planned |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-16 |
| **Last Updated** | 2026-01-16 |

---

## Governing Decisions

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| {TBD} | {TBD} | {TBD} |

---

## Purpose

Enable users to edit the status/state of TeamSpec artifacts directly from the tree view and card UI by selecting from a dropdown of valid status options, with changes persisted to the underlying markdown files.

---

## Business Value

- **User Impact**: Eliminates context switching between viewer and file editor when updating artifact status; streamlines workflow transitions.
- **Business Impact**: Reduces friction in artifact lifecycle management; improves team velocity during sprint ceremonies and status updates.
- **Success Metrics**: Time to update artifact status reduced by 80%; zero manual file editing required for status changes.

---

## In Scope

- [x] Click-to-edit status labels in tree view nodes (features, FIs, epics, stories, BA, BAI, etc.)
- [x] Dropdown showing valid status options based on artifact type
- [x] Persist status changes to markdown file frontmatter via backend API
- [x] Visual feedback during save operation (loading state)
- [x] Optimistic UI update with rollback on failure
- [x] Status options appropriate to each artifact type
- [x] Strict regex patterns defining valid status values per artifact type
- [x] TeamSpec CLI linter enforcement of status patterns (`TS-STATUS-001` rule in `linter.js`)

---

## Out of Scope

- [ ] Bulk status editing (multiple artifacts at once)
- [ ] Status transition validation/workflow enforcement (e.g., cannot go from Done back to Backlog)
- [ ] Audit trail of status changes (beyond markdown git history)
- [ ] Inline editing of other artifact fields (title, description, etc.)
- [ ] Custom status values (only predefined options)

---

## Actors / Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Functional Analyst | Manages feature/FI/epic/story lifecycle | Update story status during refinement and sprint ceremonies |
| Scrum Master | Oversees sprint execution | Quickly update story and epic status during standups |
| Product Owner | Owns product and project artifacts | Update feature and FI status after reviews |
| Business Analyst | Manages BA artifacts | Update BA/BAI status during analysis lifecycle |

---

## Current Behavior

### Status Display

Status labels are displayed as read-only chips/badges in:
- Tree view nodes (ArtifactTree, BATree)
- Feature cards (FeatureCard)
- BA cards (BACard)
- Search results (SearchResults)

### Status Values by Artifact Type

Each artifact type has a strict set of valid status values enforced by regex patterns. The TeamSpec CLI linter (`teamspec lint`) validates these patterns against the `status` field in YAML frontmatter.

| Artifact Type | Valid Status Values | Regex Pattern |
|---------------|---------------------|---------------|
| Feature | Planned, Active, Deprecated, Retired | `^(Planned|Active|Deprecated|Retired)$` |
| Feature-Increment | Proposed, Approved, In-Progress, Done, Rejected | `^(Proposed|Approved|In-Progress|Done|Rejected)$` |
| Epic | Planned, Active, Done, Cancelled | `^(Planned|Active|Done|Cancelled)$` |
| Story | Backlog, Refining, Ready, In-Progress, Done, Deferred, Out-of-Scope | `^(Backlog|Refining|Ready|In-Progress|Done|Deferred|Out-of-Scope)$` |
| Business Analysis | Draft, Active, Deprecated | `^(Draft|Active|Deprecated)$` |
| BA Increment | Proposed, Approved, Done, Rejected | `^(Proposed|Approved|Done|Rejected)$` |
| Solution Design | Draft, Active, Deprecated | `^(Draft|Active|Deprecated)$` |
| SD Increment | Proposed, Approved, Done, Rejected | `^(Proposed|Approved|Done|Rejected)$` |
| Technical Architecture | Draft, Active, Deprecated | `^(Draft|Active|Deprecated)$` |
| TA Increment | Proposed, Approved, Done, Rejected | `^(Proposed|Approved|Done|Rejected)$` |
| Test Case | Draft, Active, Deprecated | `^(Draft|Active|Deprecated)$` |
| Regression Test | Draft, Active, Deprecated | `^(Draft|Active|Deprecated)$` |
| Dev Plan | Draft, In-Progress, Implemented, Blocked | `^(Draft|In-Progress|Implemented|Blocked)$` |

> **Linter Enforcement:** The `teamspec lint` CLI validates status values using these regex patterns. Invalid status values produce lint errors with rule code `TS-STATUS-001`.

### User Flows

1. User views artifact tree with status labels displayed as colored chips
2. User clicks on a status chip
3. Dropdown appears with valid status options for that artifact type
4. User selects new status
5. UI shows loading indicator
6. Backend updates markdown file frontmatter
7. UI confirms success and displays new status
8. On failure, UI reverts to previous status and shows error message

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| File locked/in use | Show error toast, revert to previous status |
| Invalid status value | Reject selection (should not happen with dropdown) |
| Network timeout | Show retry option, revert to previous status |
| File not found | Show error toast, disable editing for that artifact |
| Concurrent edit conflict | Show warning, offer to reload current status |

---

## Business Rules

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-TSV-020 | Status dropdown shows only valid options for the artifact type | When dropdown is opened |
| BR-TSV-021 | Status changes are persisted to markdown frontmatter `status` field | When user selects new status |
| BR-TSV-022 | UI must provide immediate visual feedback during save operation | When status change is submitted |
| BR-TSV-023 | Failed status updates must revert to previous value | When backend returns error |
| BR-TSV-024 | Status values are case-insensitive for matching but preserve original case in file | When reading/writing status |
| BR-TSV-025 | Each artifact type has a strict regex pattern for valid status values | Always; enforced by linter |
| BR-TSV-026 | Status values must match exactly one of the predefined options for the artifact type | When validating or saving status |
| BR-TSV-027 | `teamspec lint` CLI must validate status values against artifact-specific regex patterns | When linting workspace |
| BR-TSV-028 | Invalid status values produce lint error `TS-STATUS-001` with artifact path and expected values | When linter detects invalid status |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| All authenticated users | Can edit status of any visible artifact |

---

## Non-Functional Notes

- **Performance**: Status update should complete within 500ms for local workspace
- **Accessibility**: Dropdown must be keyboard navigable (arrow keys, Enter to select, Escape to cancel)
- **UX**: Click outside dropdown or press Escape to cancel without saving

---

## Non-Goals

- Workflow state machine enforcement (status transitions are unrestricted in MVP)
- Role-based permission checks (any user can edit any artifact)
- Batch/bulk status updates
- Custom status value creation

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Should we enforce valid status transitions (e.g., cannot go backward)? | FA | Resolved | No enforcement in MVP; future feature |
| Q-002 | Should status changes trigger notifications? | FA | Resolved | No notifications in MVP |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| [f-TSV-003](f-TSV-003-feature-increment-navigation.md) | Extends (adds editing to read-only tree) |
| [f-TSV-004](f-TSV-004-epic-and-story-navigation.md) | Extends (adds editing to story status) |

---

## Change Log

| Date | Source | Change Summary | Author |
|------|--------|----------------|--------|
| 2026-01-16 | — | Initial feature creation | FA |

---

## Feature-Increment Ledger

> All Feature-Increments that have modified this feature (via Canon Sync):

| FI ID | Project | Sync Date | Summary |
|-------|---------|-----------|---------|
| — | — | — | No increments synced yet |

**Last FI:** —
**Last Sync:** —

---

## Implementation References

_Links to code, APIs, or technical documentation. Maintained by DEV._

- **Backend API**: `PATCH /api/artifacts/:path/status` (to be implemented)
- **Frontend Components**: Status dropdown component (to be implemented)
- **Markdown Parser**: YAML frontmatter update utility (to be implemented)

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-FEAT-001 | Feature file must exist before Feature-Increments can reference it |
| TS-FEAT-002 | All required sections must be present |
| TS-FEAT-003 | Feature ID must be unique within product |
| TS-NAMING-FEAT | Feature naming must follow f-{PRX}-{NNN}-{description}.md pattern |
| TS-STATUS-001 | Artifact status must match valid regex pattern for its artifact type |

### TS-STATUS-001: Status Validation

**Severity:** ERROR

**Description:** Validates that the `status` field in artifact YAML frontmatter matches one of the valid values for that artifact type.

**Implementation in `linter.js`:**
```javascript
const STATUS_PATTERNS = {
  feature: /^(Planned|Active|Deprecated|Retired)$/i,
  'feature-increment': /^(Proposed|Approved|In-Progress|Done|Rejected)$/i,
  epic: /^(Planned|Active|Done|Cancelled)$/i,
  story: /^(Backlog|Refining|Ready|In-Progress|Done|Deferred|Out-of-Scope)$/i,
  'business-analysis': /^(Draft|Active|Deprecated)$/i,
  'ba-increment': /^(Proposed|Approved|Done|Rejected)$/i,
  'solution-design': /^(Draft|Active|Deprecated)$/i,
  'sd-increment': /^(Proposed|Approved|Done|Rejected)$/i,
  'technical-architecture': /^(Draft|Active|Deprecated)$/i,
  'ta-increment': /^(Proposed|Approved|Done|Rejected)$/i,
  'test-case': /^(Draft|Active|Deprecated)$/i,
  'regression-test': /^(Draft|Active|Deprecated)$/i,
  devplan: /^(Draft|In-Progress|Implemented|Blocked)$/i,
};
```

**Error Message Format:**
```
TS-STATUS-001: Invalid status "{value}" for {artifact_type} at {path}
  Expected one of: {valid_options}
```
