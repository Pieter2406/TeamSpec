---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Dashboard artifact filtering and smart state ordering"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-007"
filename_pattern: "fi-TSV-007-dashboard-filtering-ordering.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
    optional: false
    note: "Extends role-specific dashboards with filtering and ordering"
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - dashboard
  - filtering
  - state ordering
  - visibility toggle
  - artifact organization
  - done artifacts
  - active artifacts
aliases:
  - artifact filtering
  - smart ordering
  - state-based sorting
anti_keywords:
  - implementation details
  - code
  - technical design
  - access control

---

# Feature Increment: `fi-TSV-007-dashboard-filtering-ordering`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

> **ID:** fi-TSV-007  
> **Product:** teamspec-viewer (TSV)  
> **Target Feature:** [f-TSV-002-role-specific-dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)  
> **Epic:** epic-TSV-007 (pending assignment)  
> **Status:** proposed

---

## 1. Overview

This feature-increment extends the Role-Specific Dashboards (f-TSV-002) with two critical usability enhancements:

1. **Artifact Visibility Toggle**: Users can hide/show artifacts in "done" or terminal states to reduce visual clutter and focus on active work
2. **Smart State Ordering**: Artifacts are automatically ordered by state, with active/in-progress items prioritized at the top and terminal states (done, retired, deferred, out-of-scope) grouped at the bottom

These changes improve dashboard scannability and support rapid focus on work-in-progress items without losing visibility into completed artifacts.

---

## 2. AS-IS (Current State)

### 2.1 Current Dashboard Behavior

From [f-TSV-002 Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md):

> "Each dashboard lists the artifacts owned by that role. The dashboard provides quick navigation into those artifacts."

**Current limitations:**

1. **No Filtering**: All artifacts are displayed regardless of state, causing visual clutter
   - Users see completed, deferred, and deprecated artifacts mixed with active work
   - Dashboard becomes harder to scan as the number of artifacts grows
   - Users must manually skip over "done" items when looking for work

2. **No State-Based Ordering**: Artifacts are displayed in arbitrary order (likely file creation order or alphabetical)
   - No visual priority given to active/in-progress artifacts
   - Terminal states (done, retired) are not grouped together
   - Users must scan entire list to find items they should focus on

3. **Result**: Users waste cognitive load distinguishing active from completed artifacts; feature's goal of "reducing cognitive load" is undermined by the mix of states

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

#### 3.1.1 Artifact Visibility Toggle

The dashboard displays a **filter control** that allows users to toggle visibility of artifacts in terminal states:

- **Filter Label**: "Show Completed Artifacts" (checkbox or toggle button)
- **Default State**: Checked (all artifacts visible)
- **When Unchecked**: All artifacts with terminal states are hidden from view
  - Terminal states defined as: "done", "retired", "out-of-scope", "deferred"
  - Active states remain visible: "draft", "active", "ready", "in-progress"
  - Archived artifacts may be hidden/shown separately if applicable
- **Behavior**: Filter applies to all artifact types in the current dashboard
  - Features, Feature-Increments, Epics, Stories, Business Analysis docs, etc.
- **Persistence**: Filter state is saved to browser localStorage per user/role/dashboard

**User Experience:**
```
[✓] Show Completed Artifacts    <- Click to toggle

Features:
  [ ] f-TSV-001-basic-reading      [active]
  [ ] f-TSV-002-role-dashboards    [active]
  [ ] f-TSV-003-artifact-search    [ready]
  [ ] f-TSV-005-use-case-centric   [draft]

  (f-TSV-004 [done] hidden when toggle is unchecked)
```

#### 3.1.2 Smart State Ordering

Artifacts in the dashboard are ordered by state, with the following priority:

**STATE ORDERING HIERARCHY** (top to bottom):

| Priority | State | Type | Rationale |
|----------|-------|------|-----------|
| **1 (TOP)** | `in-progress` | Active | Currently being worked on, requires immediate attention |
| **2** | `active` | Active | Deployed and in active use, high priority |
| **3** | `ready` | Active-Adjacent | Approved for implementation, next on pipeline |
| **4** | `draft` | Active-Adjacent | Under development, stakeholder review pending |
| **5** | `proposed` | Active-Adjacent | Proposed but not yet approved |
| **6** | `pending` | Waiting | Waiting for external dependency or decision |
| **7** | `on-hold` | Waiting | Explicitly paused, may resume |
| **8 (BOTTOM)** | `deferred` | Terminal | Moved to later phase/release |
| **9** | `out-of-scope` | Terminal | Explicitly excluded from scope |
| **10** | `done` | Terminal | Completed and closed |
| **11** | `retired` | Terminal | No longer in use, deprecated |
| **12** | `archived` | Terminal | Historical reference only |

**Visual Grouping:**
- **Section 1: Active Work** (states 1-5): Artifacts requiring focus
- **Section 2: Waiting** (states 6-7): Blocked/paused work
- **Section 3: Completed** (states 8-12): Terminal artifacts (hidden by filter when unchecked)

**Within each state group**: Artifacts are ordered alphabetically by title for consistency

**Example Dashboard Display:**

```
Filter: [✓] Show Completed Artifacts

=== ACTIVE WORK ===

IN-PROGRESS
  • epic-TSV-006-inline-status-editing

ACTIVE
  • f-TSV-001-basic-reading
  • f-TSV-002-role-dashboards

READY
  • f-TSV-003-artifact-search

DRAFT
  • f-TSV-005-use-case-centric-dashboard

PROPOSED
  • f-TSV-007-dashboard-filtering-ordering (this feature)

=== WAITING ===

ON-HOLD
  (none)

=== COMPLETED ===

DONE
  • ba-TSV-001-user-research
  • sd-TSV-001-dashboard-design

RETIRED
  (none)

ARCHIVED
  (none)
```

### 3.2 Acceptance Criteria

- [ ] **Visibility Toggle Exists**: Dashboard displays "Show Completed Artifacts" toggle control
- [ ] **Filter Functional**: When toggled off, all artifacts with terminal states (done, retired, out-of-scope, deferred, archived) are hidden
- [ ] **Filter Persistent**: Filter state is saved to browser localStorage; persists across page reloads
- [ ] **Filter Works Across All Artifact Types**: Feature-Increments, Epics, Stories, Business Analysis documents all respect the filter
- [ ] **Smart Ordering Implemented**: Artifacts are ordered by state according to the hierarchy defined in section 3.1.2
- [ ] **Alphabetical Within Groups**: Artifacts with the same state are ordered alphabetically by title/name
- [ ] **Visual Clarity**: Active states and waiting states are visually distinct from completed states (e.g., different sections, colors, or headers)
- [ ] **Mobile Responsive**: Filter control and ordering visible/functional on all screen sizes
- [ ] **No Performance Regression**: Dashboard loads and filters artifacts with same performance as before
- [ ] **Accessibility**: Filter control is keyboard accessible, states announced to screen readers

### 3.3 Out of Scope

This feature-increment does NOT include:

- [ ] Advanced filtering (by author, date, team, etc.) — kept simple with just visibility toggle for completed artifacts
- [ ] Custom sort orders or saved sort preferences
- [ ] Search/filtering within the active artifact list
- [ ] Editing artifact state from the dashboard (remains read-only per f-TSV-002)
- [ ] Changes to individual artifact state definitions (states are as currently documented in artifacts)
- [ ] Archiving or deleting artifacts from the dashboard (remains read-only)

---

## 4. Impact Analysis

### 4.1 Features Affected

| Feature | Impact Type | Details |
|---------|-------------|---------|
| [f-TSV-002-role-specific-dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | **Modified** | Enhanced with filtering and ordering; core goal ("reducing cognitive load") is now better achieved |
| f-TSV-001-basic-reading | **None** | Viewer functionality unaffected; read-only guarantees maintained |
| f-TSV-003-artifact-search | **None** | Search feature unaffected; may benefit from ordering in future integration |

### 4.2 Dependencies

- **Frontend State Management**: Must maintain filter state (localStorage) and ordering logic
- **Backend API**: No changes required; all data already available (states are in artifact YAML)
- **Component Architecture**: Requires updates to:
  - FADashboard component (filter control, ordering logic)
  - BADashboard component (filter control, ordering logic)
  - Artifact list rendering (state-grouped display)

### 4.3 Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Users confused by new filter**: May not understand what "Show Completed Artifacts" does | Medium | Clear labeling, tooltip explaining "done, retired, deferred, out-of-scope" as completed states |
| **Ordering breaks existing workflows**: Users accustomed to old order may be disoriented | Low | Ordering is intuitive (active first, completed last); matches mental models; no permanent artifacts rely on old order |
| **Performance impact with many artifacts**: localStorage or DOM rendering slows with 100+ artifacts | Low | Filtering and ordering done client-side with efficient algorithms; localStorage handles reasonable volumes; pagination not required for MVP |
| **Missing states**: New artifact states added in future not covered by ordering hierarchy | Medium | Document process for adding new states to hierarchy; build state ordering as configuration, not hardcoded |

### 4.4 Related Decisions

**Design Decision Needed (TBD):**
- Visual presentation of state groups (separate sections vs. colored badges vs. indentation)
- Default filter state (show/hide completed by default)
- Whether to include section headers ("Active Work", "Waiting", "Completed") or just state labels

---

## 5. Proposed State Ordering (Final Specification)

Based on common product management and development workflows, this FI proposes the following state ordering:

### 5.1 State Categories & Order

```
PRIORITY 1-5 (ACTIVE WORK - Always Visible at Top)
├─ 1. in-progress    (Currently being worked on)
├─ 2. active         (Deployed, production use)
├─ 3. ready          (Ready for implementation, approved)
├─ 4. draft          (Work in progress, not yet approved)
└─ 5. proposed       (Proposed but awaiting approval)

PRIORITY 6-7 (WAITING - Visible Below Active Work)
├─ 6. pending        (Awaiting external dependency)
└─ 7. on-hold        (Explicitly paused)

PRIORITY 8-12 (COMPLETED - Hidden When Filter Toggled Off)
├─ 8.  deferred      (Moved to later phase/release)
├─ 9.  out-of-scope  (Explicitly excluded)
├─ 10. done          (Completed and closed)
├─ 11. retired       (No longer in use, deprecated)
└─ 12. archived      (Historical reference)
```

### 5.2 Rationale for Ordering

**Why this order optimizes dashboard usability:**

1. **in-progress first** — Users looking at dashboard immediately see what they (or their team) are actively working on
2. **active second** — Production items are shown next, indicating what's live and needs monitoring
3. **ready third** — Next items in pipeline for implementation
4. **draft fourth** — Items under active discussion/review
5. **proposed fifth** — Items not yet vetted but considered
6. **pending/on-hold** — Blocked or paused work grouped together (less urgent)
7. **Terminal states last** — Completed work is available but not cluttering active view

**This matches mental models:**
- Product Managers think: "What's active? What's coming next? What's done?"
- Developers think: "What am I working on? What's approved and ready? What's blocked?"
- QA thinks: "What's ready for testing? What's in-progress? What's done?"

---

## 6. Implementation Notes for DEV

### 6.1 Frontend Components to Update

1. **FADashboard.tsx / BADashboard.tsx**
   - Add filter toggle control (checkbox + label)
   - Implement filter state in useState/localStorage hook
   - Add ordering logic to filter/sort artifact lists

2. **FeatureCard.tsx / ArtifactCard.tsx**
   - Ensure state property is accessible from artifact metadata
   - May benefit from state badge component if not already present

3. **Artifact List / Tree Component**
   - Implement filtering: hide artifacts where state in [done, retired, out-of-scope, deferred, archived]
   - Implement sorting: order by state priority, then alphabetically by title
   - Consider extracting state ordering to a constant/config for maintainability

### 6.2 Data Requirements

- **Artifact State Property**: Must be accessible in all artifact types (features, epics, stories, etc.)
  - Check YAML frontmatter `status:` field
  - Ensure consistent state values across artifact types

### 6.3 Suggested Code Structure

```typescript
// State ordering configuration (extendable)
const STATE_PRIORITY = {
  'in-progress': 1,
  'active': 2,
  'ready': 3,
  'draft': 4,
  'proposed': 5,
  'pending': 6,
  'on-hold': 7,
  'deferred': 8,
  'out-of-scope': 9,
  'done': 10,
  'retired': 11,
  'archived': 12,
};

const TERMINAL_STATES = ['deferred', 'out-of-scope', 'done', 'retired', 'archived'];

// Filter and sort artifacts
const filterAndSortArtifacts = (artifacts, showCompleted) => {
  return artifacts
    .filter(art => showCompleted || !TERMINAL_STATES.includes(art.status))
    .sort((a, b) => {
      const priorityDiff = STATE_PRIORITY[a.status] - STATE_PRIORITY[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return a.title.localeCompare(b.title);
    });
};
```

### 6.4 Testing Strategy

- **Unit Tests**: Test state ordering logic with various artifact combinations
- **Integration Tests**: Test filter toggle with real artifact data
- **E2E Tests**: Test user workflow: toggle filter → artifacts hide/show → reload page → filter persists
- **Accessibility Tests**: Verify toggle is keyboard accessible and screen-reader announced

---

## 7. Relationship to Stories (Epic-TSV-007)

This feature-increment will be broken down into stories within epic-TSV-007:

- Story 1: Implement artifact visibility filter toggle
- Story 2: Implement smart state ordering logic
- Story 3: Add localStorage persistence for filter state
- Story 4: Testing and accessibility verification

---

## 8. Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Proposed | Initial feature-increment proposal; ready for epic/story decomposition |
