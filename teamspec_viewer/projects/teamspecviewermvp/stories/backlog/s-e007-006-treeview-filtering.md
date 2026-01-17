---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Add filtering to artifact tree views"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e007-006"
filename_pattern: "s-e007-006-treeview-filtering.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-007"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false

# === Search Optimization ===
keywords:
  - treeview
  - artifact tree
  - filtering
  - state ordering
  - BA tree
  - FA tree
  - child artifacts
aliases:
  - tree filtering
  - nested filtering
anti_keywords:
  - dashboard cards
  - top-level filtering

---

# Story: `s-e007-006-treeview-filtering`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e007-006 |
| **Epic** | [epic-TSV-007](../../epics/epic-TSV-007-dashboard-filtering-ordering.md) |
| **Status** | Backlog |
| **Estimate** | 3 pts |
| **Author** | FA |
| **Sprint** | — |
| **Dependency** | s-e007-001 (filter toggle must exist first) |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Story (Project Execution)  
**Lifecycle:** Sprint-bound

---

## Linked Artifacts

| Artifact | Type | Relationship |
|----------|------|--------------|
| [fi-TSV-007](../../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Feature-Increment | Implements (treeview portion) |
| [epic-TSV-007](../../epics/epic-TSV-007-dashboard-filtering-ordering.md) | Epic | Parent |
| [s-e007-001](s-e007-001-filter-toggle-component.md) | Story | Dependency (filter hook) |
| [s-e007-002](s-e007-002-state-ordering-logic.md) | Story | Dependency (sorting utilities) |

---

## User Story

**As a** Functional Analyst or Business Analyst  
**I want** the artifact tree views to also respect the "Show Completed" filter  
**So that** I can focus on active work without seeing completed FIs, Epics, and Stories cluttering the tree hierarchy

---

## Feature Impact

| Feature | Section | Change Type |
|---------|---------|-------------|
| [f-TSV-002](../../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | §Treeview | Modified |

---

## AS-IS (Current State)

### Current Treeview Behavior

From stories s-e007-001 through s-e007-003:

- The dashboard **card list** (FADashboard/BADashboard) respects the "Show Completed" filter toggle
- The **ArtifactTree** (Feature → FIs → Epics → Stories) does NOT filter child artifacts
- The **BATree** (BA → BAIs) does NOT filter child artifacts

**Current limitation:**

When a user unchecks "Show Completed Artifacts":
1. ✅ Top-level feature cards are filtered (done features hidden)
2. ❌ When expanding a feature, ALL FIs are shown (including done FIs)
3. ❌ When expanding an FI, ALL epics are shown (including done epics)
4. ❌ When expanding an epic, ALL stories are shown (including done stories)
5. ❌ In BATree: BA document expands to show ALL BAIs (including done BAIs)

**Example current behavior:**

```
Filter: [ ] Show Completed Artifacts (UNCHECKED)

Features Panel:
  f-TSV-001 [active]     ← visible
  f-TSV-002 [done]       ← HIDDEN ✓

ArtifactTree for f-TSV-001:
  └── fi-TSV-001-a [active]   ← visible
  └── fi-TSV-001-b [done]     ← SHOULD BE HIDDEN but IS VISIBLE ❌
      └── epic-001 [done]     ← SHOULD BE HIDDEN but IS VISIBLE ❌
          └── s-e001-001 [done] ← SHOULD BE HIDDEN but IS VISIBLE ❌
```

---

## TO-BE (Proposed State)

### 1. Treeview Filtering

The ArtifactTree and BATree components will:
1. Receive the current `showCompleted` state from the parent dashboard
2. Filter child artifacts at each level (FIs, Epics, Stories, BAIs) based on the filter
3. Apply the same sorting logic (state priority) to visible tree nodes

### 2. Expected Behavior

When "Show Completed Artifacts" is **unchecked**:

```
Filter: [ ] Show Completed Artifacts (UNCHECKED)

Features Panel:
  f-TSV-001 [active]     ← visible

ArtifactTree for f-TSV-001:
  └── fi-TSV-001-a [active]   ← visible
  (fi-TSV-001-b [done] HIDDEN ✓)
      └── epic-001 [active]   ← visible
      (epic-002 [done] HIDDEN ✓)
          └── s-e001-001 [in-progress] ← visible
          (s-e001-002 [done] HIDDEN ✓)
```

When "Show Completed Artifacts" is **checked** (default):

```
Filter: [✓] Show Completed Artifacts

ArtifactTree for f-TSV-001:
  └── fi-TSV-001-a [active]
  └── fi-TSV-001-b [done]      ← now visible
      └── epic-001 [active]
      └── epic-002 [done]      ← now visible
          └── s-e001-001 [in-progress]
          └── s-e001-002 [done] ← now visible
```

### 3. Sorting in Treeview

Tree nodes at each level are sorted by:
1. **Primary**: State priority (in-progress → done)
2. **Secondary**: Alphabetical by title

---

## Acceptance Criteria

### Functional Requirements

- [ ] **AC-001**: ArtifactTree receives `showCompleted` prop from FADashboard
- [ ] **AC-002**: When `showCompleted=false`, FIs with terminal states are hidden from tree
- [ ] **AC-003**: When `showCompleted=false`, Epics with terminal states are hidden from tree
- [ ] **AC-004**: When `showCompleted=false`, Stories with terminal states are hidden from tree
- [ ] **AC-005**: BATree receives `showCompleted` prop from BADashboard
- [ ] **AC-006**: When `showCompleted=false`, BAIs with terminal states are hidden from tree
- [ ] **AC-007**: Visible tree nodes are sorted by state priority at each level
- [ ] **AC-008**: Toggling filter updates tree immediately (no expand/collapse required)
- [ ] **AC-009**: Empty branches are handled gracefully (show message or collapse)

### Edge Cases

- [ ] **AC-010**: Feature with all FIs in terminal state shows "No active increments" message when filter is off
- [ ] **AC-011**: Epic with all stories in terminal state shows "No active stories" message when filter is off
- [ ] **AC-012**: When filter is toggled ON, previously hidden nodes reappear in correct sorted order

### Non-Functional

- [ ] **AC-013**: Filtering/sorting does not cause visible re-render flicker
- [ ] **AC-014**: Tree expansion state is preserved when toggling filter

---

## Technical Notes

### Props Change

```typescript
// ArtifactTree.tsx - Add prop
interface ArtifactTreeProps {
    featureId: string;
    onNodeSelect?: (node: TreeNodeData) => void;
    showCompleted?: boolean;  // NEW
}

// BATree.tsx - Add prop
interface BATreeProps {
    baId: string;
    onNodeSelect?: (node: BATreeNodeData) => void;
    showCompleted?: boolean;  // NEW
}
```

### Integration in Dashboard

```tsx
// FADashboard.tsx
<ArtifactTree
    featureId={expandedFeatureId}
    onNodeSelect={handleNodeSelect}
    showCompleted={showCompleted}  // Pass filter state
/>

// BADashboard.tsx
<BATree
    baId={expandedBAId}
    onNodeSelect={handleNodeSelect}
    showCompleted={showCompleted}  // Pass filter state
/>
```

### Filtering Logic in Tree

```tsx
// Inside ArtifactTree when rendering FIs
const visibleFIs = useMemo(() => {
    const filtered = showCompleted 
        ? data.feature_increments 
        : data.feature_increments.filter(fi => !TERMINAL_STATES.includes(fi.status?.toLowerCase()));
    return sortArtifacts(filtered);
}, [data.feature_increments, showCompleted]);

// Same pattern for epics within each FI
// Same pattern for stories within each epic
```

### Empty State Handling

```tsx
{visibleFIs.length === 0 && (
    <TreeItem
        itemId={`${featureId}-empty`}
        label={
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {showCompleted ? 'No increments' : 'No active increments'}
            </Typography>
        }
    />
)}
```

---

## UX & Copy

| Element | Copy |
|---------|------|
| Empty FIs (filter off) | "No active feature-increments" |
| Empty FIs (filter on) | "No feature-increments" |
| Empty Epics (filter off) | "No active epics" |
| Empty Epics (filter on) | "No epics" |
| Empty Stories (filter off) | "No active stories" |
| Empty Stories (filter on) | "No stories" |
| Empty BAIs (filter off) | "No active increments" |
| Empty BAIs (filter on) | "No increments" |

---

## Out of Scope

- Independent filter toggle within the tree panel (uses dashboard-level toggle)
- Nested filtering preferences (all levels use same filter setting)
- Expand/collapse based on filter state (tree expansion is independent)

---

## Dependencies

- [ ] Story s-e007-001 (filter toggle) completed ✓
- [ ] Story s-e007-002 (state ordering) completed ✓
- [ ] `filterArtifacts()` and `sortArtifacts()` utilities available ✓
- [ ] `TERMINAL_STATES` constant defined ✓

---

## Definition of Ready

- [x] Story linked to epic (via filename)
- [x] Feature-increment referenced
- [x] Acceptance criteria are testable
- [x] Dependencies identified and ready
- [x] Technical approach outlined
- [x] No blocking questions

---

## Definition of Done

- [ ] All acceptance criteria verified
- [ ] ArtifactTree filters FIs, Epics, Stories by state
- [ ] BATree filters BAIs by state
- [ ] Sorting applied at each tree level
- [ ] Empty state messages shown when all children filtered
- [ ] Code reviewed and merged
- [ ] Manual testing passed

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Backlog | Initial story for treeview filtering; extends epic-TSV-007 filtering to tree components |
