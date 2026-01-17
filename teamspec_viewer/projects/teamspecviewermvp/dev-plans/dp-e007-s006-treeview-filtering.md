---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Treeview filtering implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s006"
filename_pattern: "dp-e007-s006-treeview-filtering.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-006"
    optional: false

---

# Dev Plan: `dp-e007-s006-treeview-filtering`

> **Template Version**: 4.0.1
> **Last Updated**: 2026-01-17

---

**Document Owner:** DEV (Developer)
**Artifact Type:** Execution (Implementation Plan)
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e007-s006 |
| **Story** | [s-e007-006](../stories/backlog/s-e007-006-treeview-filtering.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-006](../stories/backlog/s-e007-006-treeview-filtering.md) | Add filtering to artifact tree views | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Extend the existing ArtifactTree and BATree components to:
1. Accept a `showCompleted` prop from parent dashboard
2. Filter child artifacts (FIs, Epics, Stories, BAIs) at each tree level
3. Apply the same sorting logic used in dashboards
4. Show empty state messages when all children are filtered out

This story depends on s-e007-001 (filter toggle) and s-e007-002 (state ordering logic), which provide the `useArtifactFilter` hook and `filterArtifacts`/`sortArtifacts` utilities.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ArtifactTree.tsx` | Modified | Add `showCompleted` prop, filter FIs/Epics/Stories |
| `BATree.tsx` | Modified | Add `showCompleted` prop, filter BAIs |
| `FADashboard.tsx` | Modified | Pass `showCompleted` to ArtifactTree |
| `BADashboard.tsx` | Modified | Pass `showCompleted` to BATree |

---

## 2. Technical Design

### 2.1 Files to Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/ArtifactTree.tsx` | Modify | Add showCompleted prop and filtering logic |
| `frontend/src/components/BATree.tsx` | Modify | Add showCompleted prop and filtering logic |
| `frontend/src/components/FADashboard.tsx` | Modify | Pass showCompleted to ArtifactTree |
| `frontend/src/components/BADashboard.tsx` | Modify | Pass showCompleted to BATree |

### 2.2 Code Implementation

#### 2.2.1 ArtifactTree Props Extension

```typescript
// ArtifactTree.tsx - Extend props interface
interface ArtifactTreeProps {
    featureId: string;
    onNodeSelect?: (node: TreeNodeData) => void;
    showCompleted?: boolean;  // NEW - defaults to true
}
```

#### 2.2.2 ArtifactTree Filtering Logic

```typescript
import { useMemo } from 'react';
import { filterArtifacts, sortArtifacts } from '../utils/artifactSorting';
import { TERMINAL_STATES } from '../constants/stateOrdering';

// Inside ArtifactTree component
export function ArtifactTree({
    featureId,
    onNodeSelect,
    showCompleted = true,  // Default to showing all
}: ArtifactTreeProps) {
    // ... existing state and effects ...

    // Filter and sort FIs based on showCompleted
    const visibleFIs = useMemo(() => {
        if (!relationships) return [];
        const filtered = showCompleted
            ? relationships.featureIncrements
            : relationships.featureIncrements.filter(fi =>
                !TERMINAL_STATES.includes(fi.status?.toLowerCase() || '')
              );
        return sortArtifacts(filtered);
    }, [relationships, showCompleted]);

    // Render FI with filtered children
    const renderFI = (fi: FIInfo) => {
        // Filter epics within this FI
        const visibleEpics = useMemo(() => {
            if (!fi.epic) return [];
            const epics = [fi.epic];
            const filtered = showCompleted
                ? epics
                : epics.filter(e =>
                    !TERMINAL_STATES.includes(e.status?.toLowerCase() || '')
                  );
            return sortArtifacts(filtered);
        }, [fi.epic, showCompleted]);

        // ... render logic ...
    };

    // Similar filtering for Stories within Epics
    const renderEpic = (epic: EpicInfo, fiProject: string) => {
        const visibleStories = useMemo(() => {
            const filtered = showCompleted
                ? epic.stories
                : epic.stories.filter(s =>
                    !TERMINAL_STATES.includes(s.status?.toLowerCase() || '')
                  );
            return sortArtifacts(filtered);
        }, [epic.stories, showCompleted]);

        // Render with visibleStories instead of epic.stories
    };
}
```

#### 2.2.3 Empty State Handling

```tsx
// Empty state for FIs
{visibleFIs.length === 0 && (
    <TreeItem
        itemId={`${feature.id}-empty`}
        label={
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {showCompleted ? 'No feature-increments' : 'No active feature-increments'}
            </Typography>
        }
    />
)}

// Empty state for Stories
{visibleStories.length === 0 && (
    <TreeItem
        itemId={`${epic.id}-empty`}
        label={
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {showCompleted ? 'No stories' : 'No active stories'}
            </Typography>
        }
    />
)}
```

#### 2.2.4 BATree Props Extension

```typescript
// BATree.tsx - Extend props interface
interface BATreeProps {
    baId: string;
    onNodeSelect?: (node: BATreeNodeData) => void;
    showCompleted?: boolean;  // NEW - defaults to true
}
```

#### 2.2.5 BATree Filtering Logic

```typescript
// Inside BATree component
export function BATree({
    baId,
    onNodeSelect,
    showCompleted = true,
}: BATreeProps) {
    // Filter and sort BAIs
    const visibleBAIs = useMemo(() => {
        if (!relationships) return [];
        const filtered = showCompleted
            ? relationships.baIncrements
            : relationships.baIncrements.filter(bai =>
                !TERMINAL_STATES.includes(bai.status?.toLowerCase() || '')
              );
        return sortArtifacts(filtered);
    }, [relationships, showCompleted]);

    // Empty state handling
    {visibleBAIs.length === 0 && (
        <TreeItem
            itemId={`${ba.id}-empty`}
            label={
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    {showCompleted ? 'No increments' : 'No active increments'}
                </Typography>
            }
        />
    )}
}
```

#### 2.2.6 Dashboard Integration

```tsx
// FADashboard.tsx - Pass showCompleted to ArtifactTree
<ArtifactTree
    featureId={expandedFeatureId}
    onNodeSelect={handleNodeSelect}
    showCompleted={showCompleted}  // From useArtifactFilter hook
/>

// BADashboard.tsx - Pass showCompleted to BATree
<BATree
    baId={expandedBAId}
    onNodeSelect={handleNodeSelect}
    showCompleted={showCompleted}  // From useArtifactFilter hook
/>
```

### 2.3 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `filterArtifacts()` utility | Existing | Available (s-e007-002) |
| `sortArtifacts()` utility | Existing | Available (s-e007-002) |
| `TERMINAL_STATES` constant | Existing | Available (s-e007-001) |
| `useArtifactFilter` hook | Existing | Available (s-e007-001) |
| MUI TreeView | Existing | Available |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/components/ArtifactTree.test.tsx` | Tree filtering and empty states |
| `__tests__/components/BATree.test.tsx` | Tree filtering and empty states |

### 3.2 Unit Test Cases

```typescript
// ArtifactTree.test.tsx
describe('ArtifactTree filtering', () => {
    const mockRelationships = {
        feature: { id: 'f-1', title: 'Feature', status: 'active', path: '' },
        featureIncrements: [
            { id: 'fi-1', title: 'FI Active', status: 'active', project: 'p1', path: '' },
            { id: 'fi-2', title: 'FI Done', status: 'done', project: 'p1', path: '' },
        ],
    };

    it('shows all FIs when showCompleted is true', () => {
        render(<ArtifactTree featureId="f-1" showCompleted={true} />);
        expect(screen.getByText('FI Active')).toBeInTheDocument();
        expect(screen.getByText('FI Done')).toBeInTheDocument();
    });

    it('hides done FIs when showCompleted is false', () => {
        render(<ArtifactTree featureId="f-1" showCompleted={false} />);
        expect(screen.getByText('FI Active')).toBeInTheDocument();
        expect(screen.queryByText('FI Done')).not.toBeInTheDocument();
    });

    it('shows empty message when all FIs are filtered', () => {
        // Mock all FIs as done
        render(<ArtifactTree featureId="f-1" showCompleted={false} />);
        expect(screen.getByText('No active feature-increments')).toBeInTheDocument();
    });

    it('preserves tree expansion state when toggling filter', async () => {
        render(<ArtifactTree featureId="f-1" showCompleted={true} />);
        // Expand a node, then toggle filter, verify expansion preserved
    });
});
```

### 3.3 Integration Tests

- Test filter toggle updates tree immediately
- Test sorting is applied at each tree level
- Test FADashboard passes showCompleted correctly
- Test BADashboard passes showCompleted correctly

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Add showCompleted prop to ArtifactTreeProps | 0.5 | None |
| 2 | Implement FI filtering in ArtifactTree | 1 | Task 1 |
| 3 | Implement Epic filtering in ArtifactTree | 1 | Task 2 |
| 4 | Implement Story filtering in ArtifactTree | 1 | Task 3 |
| 5 | Add empty state messages to ArtifactTree | 0.5 | Task 4 |
| 6 | Add showCompleted prop to BATreeProps | 0.5 | None |
| 7 | Implement BAI filtering in BATree | 1 | Task 6 |
| 8 | Add empty state messages to BATree | 0.5 | Task 7 |
| 9 | Update FADashboard to pass showCompleted | 0.5 | Tasks 1-5 |
| 10 | Update BADashboard to pass showCompleted | 0.5 | Tasks 6-8 |
| 11 | Write unit tests for ArtifactTree filtering | 1.5 | Tasks 1-5 |
| 12 | Write unit tests for BATree filtering | 1 | Tasks 6-8 |
| 13 | Manual testing and edge case verification | 1 | All tasks |
| **Total** | | **10.5 hours** | |

---

## 5. Acceptance Criteria Verification

| AC | Implementation | Test |
|----|----------------|------|
| AC-001: ArtifactTree receives showCompleted prop | Add to props interface | Unit test |
| AC-002: FIs filtered when showCompleted=false | useMemo with TERMINAL_STATES | Unit test |
| AC-003: Epics filtered when showCompleted=false | Filter within renderEpic | Unit test |
| AC-004: Stories filtered when showCompleted=false | Filter within renderEpic | Unit test |
| AC-005: BATree receives showCompleted prop | Add to props interface | Unit test |
| AC-006: BAIs filtered when showCompleted=false | useMemo with TERMINAL_STATES | Unit test |
| AC-007: Tree nodes sorted by state priority | sortArtifacts() at each level | Unit test |
| AC-008: Filter toggle updates tree immediately | useMemo dependency on showCompleted | Integration test |
| AC-009: Empty branches show message | Conditional TreeItem render | Unit test |
| AC-010: All FIs terminal shows message | Empty state check | Unit test |
| AC-011: All stories terminal shows message | Empty state check | Unit test |
| AC-012: Hidden nodes reappear on toggle | useMemo recomputes | Integration test |
| AC-013: No render flicker | useMemo memoization | Visual test |
| AC-014: Expansion state preserved | expandedItems state independent | Integration test |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Performance with deeply nested trees | Low | useMemo prevents unnecessary recomputation |
| Expansion state reset on filter toggle | Medium | Keep expandedItems state separate from filtering |
| Missing status field on artifact | Low | Default to empty string, treat as non-terminal |
| Inconsistent status casing | Low | Normalize to lowercase before comparison |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for treeview filtering |
