---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "State ordering logic implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s002"
filename_pattern: "dp-e007-s002-state-ordering-logic.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-002"
    optional: false

---

# Dev Plan: `dp-e007-s002-state-ordering-logic`

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
| **Dev Plan ID** | dp-e007-s002 |
| **Story** | [s-e007-002](../stories/backlog/s-e007-002-state-ordering-logic.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-002](../stories/backlog/s-e007-002-state-ordering-logic.md) | Implement smart state ordering logic | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement a 12-level state priority ordering system that:
1. Defines state priorities in a centralized, extensible configuration
2. Sorts artifacts by state priority (primary) and title alphabetically (secondary)
3. Provides visual grouping by state categories (Active Work, Waiting, Completed)
4. Integrates with existing filter toggle from story s-e007-001

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `stateOrdering.ts` | Modified | Add STATE_PRIORITY map and STATE_GROUPS |
| `artifactSorting.ts` | Modified | Add sortArtifacts() and filterAndSortArtifacts() |
| `FADashboard.tsx` | Modified | Apply sorting to filtered artifacts |
| `BADashboard.tsx` | Modified | Apply sorting to filtered artifacts |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/constants/stateOrdering.ts` | Modify | Add STATE_PRIORITY, STATE_GROUPS, DEFAULT_STATE_PRIORITY |
| `frontend/src/utils/artifactSorting.ts` | Modify | Add sortArtifacts(), filterAndSortArtifacts() |
| `frontend/src/components/FADashboard.tsx` | Modify | Use filterAndSortArtifacts() instead of just filter |
| `frontend/src/components/BADashboard.tsx` | Modify | Use filterAndSortArtifacts() instead of just filter |

### 2.2 Code Implementation

#### 2.2.1 State Priority Configuration (`constants/stateOrdering.ts`)

```typescript
// State priority (lower number = higher priority, shown first)
export const STATE_PRIORITY: Record<string, number> = {
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

// State groupings for visual categorization
export const STATE_GROUPS = {
  'ACTIVE WORK': ['in-progress', 'active', 'ready', 'draft', 'proposed'],
  'WAITING': ['pending', 'on-hold'],
  'COMPLETED': ['deferred', 'out-of-scope', 'done', 'retired', 'archived'],
} as const;

// Default priority for unknown states (sorted to end)
export const DEFAULT_STATE_PRIORITY = 99;

// Terminal states (already defined in s-e007-001)
export const TERMINAL_STATES: string[] = [
  'deferred',
  'out-of-scope',
  'done',
  'retired',
  'archived',
];

// Helper to get state category
export const getStateCategory = (status: string): string | null => {
  for (const [category, states] of Object.entries(STATE_GROUPS)) {
    if (states.includes(status as any)) {
      return category;
    }
  }
  return null;
};
```

#### 2.2.2 Sorting Utilities (`utils/artifactSorting.ts`)

```typescript
import {
  STATE_PRIORITY,
  DEFAULT_STATE_PRIORITY,
  TERMINAL_STATES,
} from '../constants/stateOrdering';

interface Artifact {
  id: string;
  title: string;
  status: string;
}

/**
 * Filter artifacts based on visibility of completed states
 * (from s-e007-001)
 */
export const filterArtifacts = <T extends Artifact>(
  artifacts: T[],
  showCompleted: boolean
): T[] => {
  if (showCompleted) return artifacts;
  return artifacts.filter(art => !TERMINAL_STATES.includes(art.status));
};

/**
 * Sort artifacts by state priority, then alphabetically by title
 */
export const sortArtifacts = <T extends Artifact>(artifacts: T[]): T[] => {
  return [...artifacts].sort((a, b) => {
    // Primary sort: state priority (lower number first)
    const priorityA = STATE_PRIORITY[a.status] ?? DEFAULT_STATE_PRIORITY;
    const priorityB = STATE_PRIORITY[b.status] ?? DEFAULT_STATE_PRIORITY;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Secondary sort: alphabetical by title
    return a.title.localeCompare(b.title);
  });
};

/**
 * Combined filter and sort operation
 */
export const filterAndSortArtifacts = <T extends Artifact>(
  artifacts: T[],
  showCompleted: boolean
): T[] => {
  const filtered = filterArtifacts(artifacts, showCompleted);
  return sortArtifacts(filtered);
};

/**
 * Group artifacts by state category for visual display
 */
export const groupArtifactsByCategory = <T extends Artifact>(
  artifacts: T[]
): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  
  // Initialize groups in order
  groups.set('ACTIVE WORK', []);
  groups.set('WAITING', []);
  groups.set('COMPLETED', []);
  groups.set('OTHER', []);
  
  for (const artifact of sortArtifacts(artifacts)) {
    const category = getStateCategory(artifact.status) || 'OTHER';
    const group = groups.get(category) || [];
    group.push(artifact);
    groups.set(category, group);
  }
  
  // Remove empty groups
  for (const [key, value] of groups.entries()) {
    if (value.length === 0) {
      groups.delete(key);
    }
  }
  
  return groups;
};
```

#### 2.2.3 Dashboard Integration

```tsx
// In FADashboard.tsx
import { useMemo } from 'react';
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterAndSortArtifacts } from '../utils/artifactSorting';

export const FADashboard: React.FC = () => {
  const { features, loading } = useFeatures();
  const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'FA' });

  // Apply filtering AND sorting
  const processedFeatures = useMemo(
    () => filterAndSortArtifacts(features, showCompleted),
    [features, showCompleted]
  );

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
          />
        }
        label="Show Completed Artifacts"
      />
      
      {/* Artifacts now ordered by state priority */}
      <FeatureList features={processedFeatures} />
    </Box>
  );
};
```

### 2.3 Visual Grouping (Optional Enhancement)

If visual section headers are desired:

```tsx
// Grouped display with section headers
const groupedFeatures = useMemo(
  () => groupArtifactsByCategory(filterArtifacts(features, showCompleted)),
  [features, showCompleted]
);

return (
  <Box>
    {Array.from(groupedFeatures.entries()).map(([category, artifacts]) => (
      <Box key={category} sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {category}
        </Typography>
        <FeatureList features={artifacts} />
      </Box>
    ))}
  </Box>
);
```

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e007-001 (filter toggle) | Story | Must be completed first |
| Array.sort() | JavaScript | Available |
| String.localeCompare() | JavaScript | Available |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/constants/stateOrdering.test.ts` | STATE_PRIORITY, STATE_GROUPS, getStateCategory() |
| `__tests__/utils/artifactSorting.test.ts` | sortArtifacts(), filterAndSortArtifacts(), groupArtifactsByCategory() |

### 3.2 Unit Test Cases

```typescript
// sortArtifacts.test.ts
describe('sortArtifacts', () => {
  it('sorts by state priority (in-progress before active)', () => {
    const artifacts = [
      { id: '1', title: 'B', status: 'active' },
      { id: '2', title: 'A', status: 'in-progress' },
    ];
    const result = sortArtifacts(artifacts);
    expect(result[0].status).toBe('in-progress');
    expect(result[1].status).toBe('active');
  });

  it('sorts alphabetically within same state', () => {
    const artifacts = [
      { id: '1', title: 'Zebra', status: 'active' },
      { id: '2', title: 'Apple', status: 'active' },
    ];
    const result = sortArtifacts(artifacts);
    expect(result[0].title).toBe('Apple');
    expect(result[1].title).toBe('Zebra');
  });

  it('puts unknown states at end', () => {
    const artifacts = [
      { id: '1', title: 'Unknown', status: 'unknown-state' },
      { id: '2', title: 'Active', status: 'active' },
    ];
    const result = sortArtifacts(artifacts);
    expect(result[0].status).toBe('active');
    expect(result[1].status).toBe('unknown-state');
  });

  it('handles empty array', () => {
    const result = sortArtifacts([]);
    expect(result).toEqual([]);
  });

  it('does not mutate original array', () => {
    const artifacts = [
      { id: '1', title: 'B', status: 'done' },
      { id: '2', title: 'A', status: 'active' },
    ];
    const original = [...artifacts];
    sortArtifacts(artifacts);
    expect(artifacts).toEqual(original);
  });

  it('applies full 12-level state ordering', () => {
    const artifacts = [
      { id: '1', title: 'A', status: 'archived' },
      { id: '2', title: 'B', status: 'in-progress' },
      { id: '3', title: 'C', status: 'done' },
      { id: '4', title: 'D', status: 'active' },
      { id: '5', title: 'E', status: 'pending' },
    ];
    const result = sortArtifacts(artifacts);
    expect(result.map(a => a.status)).toEqual([
      'in-progress', 'active', 'pending', 'done', 'archived'
    ]);
  });
});

describe('filterAndSortArtifacts', () => {
  it('filters then sorts', () => {
    const artifacts = [
      { id: '1', title: 'Done Item', status: 'done' },
      { id: '2', title: 'Zebra Active', status: 'active' },
      { id: '3', title: 'Apple Draft', status: 'draft' },
    ];
    const result = filterAndSortArtifacts(artifacts, false);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Zebra Active'); // active before draft
    expect(result[1].title).toBe('Apple Draft');
  });
});
```

### 3.3 Component Tests

```typescript
// FADashboard ordering test
describe('FADashboard state ordering', () => {
  it('displays artifacts in state priority order', () => {
    const mockFeatures = [
      { id: '1', title: 'Done Feature', status: 'done' },
      { id: '2', title: 'Active Feature', status: 'active' },
      { id: '3', title: 'In Progress Feature', status: 'in-progress' },
    ];
    
    render(<FADashboard features={mockFeatures} />);
    
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('In Progress Feature');
    expect(items[1]).toHaveTextContent('Active Feature');
    expect(items[2]).toHaveTextContent('Done Feature');
  });
});
```

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Add STATE_PRIORITY to stateOrdering.ts | 0.5 | s-e007-001 complete |
| 2 | Add STATE_GROUPS and helper functions | 0.5 | Task 1 |
| 3 | Implement sortArtifacts() | 1 | Task 1 |
| 4 | Implement filterAndSortArtifacts() | 0.5 | Task 3 |
| 5 | Implement groupArtifactsByCategory() (optional) | 1 | Tasks 1-2 |
| 6 | Write unit tests for sorting functions | 2 | Tasks 3-4 |
| 7 | Update FADashboard to use filterAndSortArtifacts | 1 | Task 4 |
| 8 | Update BADashboard to use filterAndSortArtifacts | 0.5 | Task 7 |
| 9 | Add visual grouping (optional) | 2 | Task 5 |
| 10 | Write component tests | 1.5 | Tasks 7-8 |
| 11 | Manual testing and verification | 1 | All |
| **Total** | | **11.5 hours** | |

---

## 5. Acceptance Criteria Verification

| AC | Implementation | Test |
|----|----------------|------|
| Correct State Priority | STATE_PRIORITY map with 12 levels | Unit test |
| Alphabetical Within State | localeCompare() in sort | Unit test |
| Visual Grouping | groupArtifactsByCategory() + section headers | Component test |
| All Artifact Types | Generic <T extends Artifact> | Works with any artifact |
| Works on Both Dashboards | Integrate in FA + BA dashboards | Manual test |
| Immediate Effect | useMemo recomputes on data change | Integration test |
| Performance | <100ms for 100 artifacts | Performance test |
| Extendable | STATE_PRIORITY is a simple object | Code review |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Unknown states break sorting | Medium | DEFAULT_STATE_PRIORITY puts them at end |
| Performance with 500+ artifacts | Low | Array.sort is O(n log n), very fast |
| Visual grouping complexity | Low | Made optional; can ship without headers first |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for state ordering implementation |
