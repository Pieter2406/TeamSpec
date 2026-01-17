---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Documentation and release notes"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e007-005"
filename_pattern: "s-e007-005-documentation-release-notes.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-007"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false

---

# Story: `s-e007-005-documentation-release-notes`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e007-005 |
| **Epic** | epic-TSV-007 |
| **Feature-Increment** | fi-TSV-007 |
| **Status** | Backlog |
| **Estimate** | 3 pts |
| **Author** | FA / Documentation |
| **Sprint** | — |
| **Dependency** | All stories s-e007-001 through s-e007-004 completed |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canvas)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** TeamSpec user,  
**I want** to understand how to use the new dashboard filtering and ordering features,  
**So that** I can take full advantage of the new capabilities and don't waste time figuring out what changed.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-007](../epics/epic-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Complete documentation for filtering and ordering features |

---

## Feature Impact

### Impact Type

- [ ] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation
- [x] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

Stories s-e007-001 through s-e007-004 are implemented and tested, but users have no documentation explaining:
- How to use the new "Show Completed Artifacts" filter
- Why artifacts are ordered the way they are
- What the different artifact states mean
- How to find what they're looking for quickly

Users discover features by trial and error, creating confusion and reduced feature adoption.

### TO-BE (new behavior)

Users have comprehensive, user-friendly documentation including:
- **In-app Help**: Tooltips and contextual help explaining filter and ordering
- **Release Notes**: Clear explanation of what changed and why
- **Developer Docs**: Technical documentation for maintainers
- **Feature Canon**: Updated feature documentation reflecting final implementation

---

## Acceptance Criteria

### User-Facing Documentation

- [ ] **Tooltip on Filter Toggle**: Hover/focus tooltip explains "Show Completed Artifacts" (e.g., "Toggle to show/hide finished work items: done, retired, deferred, out-of-scope, archived")
- [ ] **Help Text**: Brief explanation near filter about what completed artifacts are
- [ ] **State Legend**: Visual legend showing what each state means:
  - in-progress = Currently being worked on
  - active = Deployed to production
  - ready = Approved for implementation
  - draft = In development
  - proposed = Proposed, awaiting approval
  - pending = Waiting for external dependency
  - on-hold = Explicitly paused
  - done = Completed and closed
  - retired = No longer in use
  - deferred = Moved to later release
  - out-of-scope = Explicitly excluded
  - archived = Historical reference

### Release Notes

- [ ] **Feature Overview**: 1-2 paragraph summary of new filtering and ordering capabilities
- [ ] **What's New**: 
  - [ ] "Show Completed Artifacts" toggle to hide finished work
  - [ ] Smart state ordering puts active work at top, completed items at bottom
  - [ ] Filter preference saved (remembers your choice across sessions)
- [ ] **Why**: Explain the benefit (faster task discovery, reduced clutter, etc.)
- [ ] **How to Use**: 
  - [ ] Step-by-step instructions for toggling filter
  - [ ] Screenshot of toggle control
  - [ ] Explanation of state grouping with example
- [ ] **State Ordering Explanation**: Document the 12-level state hierarchy and why it matters
- [ ] **FAQ**: Common questions (What if I want to see completed items? Can I customize the order? Etc.)

### Developer Documentation

- [ ] **Architecture**: How filtering and ordering work in the codebase
- [ ] **File Structure**: Where relevant code lives (components, hooks, utilities, constants)
- [ ] **Key Files**:
  - [ ] `hooks/useArtifactFilter.ts`
  - [ ] `utils/artifactSorting.ts`
  - [ ] `constants/stateOrdering.ts`
  - [ ] Components updated: FADashboard.tsx, BADashboard.tsx
- [ ] **Configuration**: How to extend state ordering if new states added
- [ ] **Testing**: Test coverage and test locations
- [ ] **Performance**: Known performance characteristics
- [ ] **Browser Compatibility**: Supported browsers and known limitations

### Feature Canon Update

- [ ] **Feature Updated**: f-TSV-002 updated to reflect new filtering and ordering behavior
- [ ] **Accurate TO-BE**: Feature description matches final implementation exactly
- [ ] **State Ordering Documented**: 12-level state hierarchy documented in feature
- [ ] **Filter Behavior Documented**: How filter toggle works and persists

### Technical Documentation (Internal)

- [ ] **Code Comments**: Key functions documented with JSDoc comments
- [ ] **README**: Project-level README (if applicable) updated with feature overview
- [ ] **Architecture Diagram**: Visual showing how components interact (optional but recommended)
- [ ] **Test Documentation**: Where to find and run tests

### Publication

- [ ] **Release Notes Published**: Posted to changelog, release page, or documentation site
- [ ] **Feature Documentation Accessible**: Users can find help (in-app tooltip + release notes)
- [ ] **Developer Docs Available**: Team can access architecture and code documentation
- [ ] **Feature Canon Synced**: Product Canon updated after deployment (handled by PO via ts:po sync)

---

## Definition of Ready (DoR)

Before story enters in-progress:

- [ ] Story linked to epic via filename ✓
- [ ] Stories s-e007-001 through s-e007-004 implemented and tested ✓
- [ ] Final implementation details known (not changing)
- [ ] Estimate assigned (3 pts) ✓
- [ ] Documentation style guide known (Markdown format, tone, structure)
- [ ] Release notes template available

---

## Definition of Done (DoD)

Before story moves to done:

- [ ] All tooltips and help text written and reviewed
- [ ] Release notes drafted and reviewed by team/PM
- [ ] Developer documentation complete (architecture, files, configuration)
- [ ] Feature Canon updated to match final implementation
- [ ] All links in documentation working
- [ ] Documentation reviewed for accuracy and clarity
- [ ] Published/committed to repository
- [ ] Ready for deployment

---

## Documentation Sections to Create/Update

### 1. In-App Tooltip (Feature: Filter Toggle)

**Location**: Hover/focus on "Show Completed Artifacts" control

**Text:**
> Toggle to show or hide artifacts with completed states: **done, retired, deferred, out-of-scope, archived**. Active work items (in-progress, active, ready, draft, proposed, pending, on-hold) are always visible.

### 2. State Legend (Optional: Display Inline)

**Location**: Near dashboard artifact list or in help sidebar

**Visual:**
```
Active Work (Always Visible)
• In-Progress — Currently being worked on
• Active — Deployed to production
• Ready — Approved for implementation
• Draft — In development, review pending
• Proposed — Proposed, awaiting approval

Waiting (Lower Priority)
• Pending — Waiting for external dependency
• On-Hold — Explicitly paused

Completed (Hidden by Default)
• Done — Completed and closed
• Retired — No longer in use
• Deferred — Moved to later release
• Out-of-Scope — Explicitly excluded
• Archived — Historical reference
```

### 3. Release Notes Template

**File**: `RELEASE_NOTES_TSV_007.md` (or similar)

```markdown
## Dashboard Artifact Filtering and Smart State Ordering

### What's New

Teamspec Viewer dashboards now include two powerful usability improvements:

1. **Artifact Filtering**: Toggle to hide/show completed artifacts and focus on active work
2. **Smart State Ordering**: Artifacts automatically organized by state (active first, completed last)

### Why We Built This

Users told us the dashboard felt cluttered when browsing many artifacts. Work-in-progress items were mixed with completed work, making it hard to quickly find what needed attention. This update improves dashboard scannability and supports rapid task discovery.

### How to Use

#### Filter Completed Artifacts

1. Open FA or BA Dashboard
2. Look for "Show Completed Artifacts" toggle at the top of the artifact list
3. Click toggle to hide/show finished work items
4. Your preference is remembered across sessions

**What counts as "Completed"?**
- Done: Completed and closed
- Retired: No longer in use
- Deferred: Moved to later release
- Out-of-Scope: Explicitly excluded
- Archived: Historical reference

#### Automatic State Ordering

Artifacts are now automatically ordered by priority:
1. **In-Progress** — Active work items (highest priority)
2. **Active** — Items in production
3. **Ready** — Approved for implementation
4. **Draft** — Items in development
5. **Proposed** — Proposed, awaiting approval
6. **Pending** — Waiting for external dependencies
7. **On-Hold** — Explicitly paused
8. **Deferred** — Moved to later release
9. **Out-of-Scope** — Explicitly excluded
10. **Done** — Completed items
11. **Retired** — No longer in use
12. **Archived** — Historical reference

Within each state group, artifacts are alphabetized for consistency.

### FAQ

**Q: Can I reorder artifacts manually?**
A: Not in this release. Artifacts follow the state-based ordering. We're considering custom sort options for future updates.

**Q: What if I always want to see completed artifacts?**
A: The filter defaults to "Show All". Just check "Show Completed Artifacts" and it will be remembered.

**Q: Can I customize the filter for my dashboard?**
A: The current filter toggles completed artifacts on/off. We're open to feedback on additional filtering options.

**Q: How do I change an artifact's state?**
A: Edit the artifact and update the `status:` field in the YAML frontmatter.

### Technical Details

- Filter preference stored in browser localStorage (per role/dashboard)
- Filtering and sorting done client-side for performance
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Accessible via keyboard and screen readers (WCAG 2.1 AA)

### Questions or Feedback?

Contact the TeamSpec team with feedback on the new features.
```

### 4. Developer Documentation

**File**: `docs/filtering-and-ordering.md` (or similar)

**Contents:**

```markdown
# Dashboard Filtering and Ordering Architecture

## Overview

The filtering and ordering feature enables users to focus on active work by:
1. Toggling visibility of completed artifacts
2. Automatically organizing artifacts by state priority

## Components

### useArtifactFilter Hook
**File**: `hooks/useArtifactFilter.ts`
- Manages filter toggle state
- Persists state to localStorage
- Returns { showCompleted, setShowCompleted }

### State Ordering Utilities
**File**: `utils/artifactSorting.ts`
- `sortArtifacts()`: Sort by state priority, then alphabetically
- `groupArtifactsByState()`: Group artifacts by state

### State Priority Configuration
**File**: `constants/stateOrdering.ts`
- `STATE_PRIORITY`: Maps state → priority number (1-12)
- `STATE_GROUPS`: Groups states by category (Active, Waiting, Completed)
- `TERMINAL_STATES`: List of completed states to filter

### Dashboard Components
**Files**: `FADashboard.tsx`, `BADashboard.tsx`
- Use useArtifactFilter hook
- Apply filtering and sorting to artifact lists

## Adding New States

To add a new state in the future:

1. Add to `STATE_PRIORITY` in `constants/stateOrdering.ts` with priority number
2. Update `STATE_GROUPS` if it belongs to a different category
3. Update `TERMINAL_STATES` if it's a completed state
4. Update this documentation
5. Test filtering and sorting with new state

Example:
```typescript
// constants/stateOrdering.ts
export const STATE_PRIORITY = {
  // ... existing states ...
  'in-review': 2.5,  // Insert between 'active' and 'ready'
};
```

## Testing

See stories s-e007-001 through s-e007-004 for test locations and coverage requirements.
```

---

## Acceptance Criteria Validation

- [ ] **Readability**: Documentation is clear and accessible to users at all technical levels
- [ ] **Completeness**: All new features explained; no gaps
- [ ] **Accuracy**: Documentation matches final implementation exactly
- [ ] **Searchability**: Documentation uses keywords users would search for
- [ ] **Accessibility**: Documentation itself is accessible (good contrast, alt text for images, etc.)

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Backlog | Initial story slice from epic-TSV-007; documentation and release story; requires all other stories complete first |
