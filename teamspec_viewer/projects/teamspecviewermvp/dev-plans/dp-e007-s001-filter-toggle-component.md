---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Filter toggle component implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s001"
filename_pattern: "dp-e007-s001-filter-toggle-component.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-001"
    optional: false

---

# Dev Plan: `dp-e007-s001-filter-toggle-component`

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
| **Dev Plan ID** | dp-e007-s001 |
| **Story** | [s-e007-001](../stories/backlog/s-e007-001-filter-toggle-component.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-001](../stories/backlog/s-e007-001-filter-toggle-component.md) | Implement artifact visibility filter toggle | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement a reusable filter toggle component and custom React hook that:
1. Manages filter state (show/hide completed artifacts)
2. Persists state to localStorage
3. Integrates with FA and BA dashboard components
4. Filters artifacts based on terminal state list

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `useArtifactFilter.ts` | New | Custom hook for filter state + localStorage persistence |
| `stateOrdering.ts` | New | Constants for terminal states and state priorities |
| `artifactSorting.ts` | New | Utility functions for filtering artifacts |
| `FADashboard.tsx` | Modified | Integrate filter toggle and apply filtering |
| `BADashboard.tsx` | Modified | Integrate filter toggle and apply filtering |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/constants/stateOrdering.ts` | Create | Define TERMINAL_STATES constant |
| `frontend/src/utils/artifactSorting.ts` | Create | filterArtifacts() utility function |
| `frontend/src/hooks/useArtifactFilter.ts` | Create | Filter state hook with localStorage |
| `frontend/src/components/FADashboard.tsx` | Modify | Add filter toggle, integrate hook |
| `frontend/src/components/BADashboard.tsx` | Modify | Add filter toggle, integrate hook |

### 2.2 Code Implementation

#### 2.2.1 State Constants (`constants/stateOrdering.ts`)

```typescript
// Terminal states (hidden when filter is off)
export const TERMINAL_STATES: string[] = [
  'deferred',
  'out-of-scope',
  'done',
  'retired',
  'archived',
];
```

#### 2.2.2 Filter Utility (`utils/artifactSorting.ts`)

```typescript
import { TERMINAL_STATES } from '../constants/stateOrdering';

interface Artifact {
  id: string;
  title: string;
  status: string;
}

export const filterArtifacts = <T extends Artifact>(
  artifacts: T[],
  showCompleted: boolean
): T[] => {
  if (showCompleted) return artifacts;
  return artifacts.filter(art => !TERMINAL_STATES.includes(art.status));
};
```

#### 2.2.3 Custom Hook (`hooks/useArtifactFilter.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_PREFIX = 'tsv_showCompleted_';

interface UseArtifactFilterOptions {
  role: 'FA' | 'BA';
  defaultValue?: boolean;
}

export const useArtifactFilter = ({
  role,
  defaultValue = true,
}: UseArtifactFilterOptions) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${role}`;

  const [showCompleted, setShowCompletedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? stored === 'true' : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, showCompleted.toString());
    } catch {
      console.warn('Failed to persist filter state');
    }
  }, [showCompleted, storageKey]);

  const setShowCompleted = useCallback((value: boolean) => {
    setShowCompletedState(value);
  }, []);

  return { showCompleted, setShowCompleted };
};
```

#### 2.2.4 Dashboard Integration Pattern

```tsx
// In FADashboard.tsx
import { FormControlLabel, Checkbox, Tooltip, Box } from '@mui/material';
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterArtifacts } from '../utils/artifactSorting';

export const FADashboard: React.FC = () => {
  const { features, loading } = useFeatures();
  const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'FA' });

  const filteredFeatures = useMemo(
    () => filterArtifacts(features, showCompleted),
    [features, showCompleted]
  );

  return (
    <Box>
      <Tooltip title="Show/hide artifacts with states: done, retired, deferred, out-of-scope, archived">
        <FormControlLabel
          control={
            <Checkbox
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
          }
          label="Show Completed Artifacts"
        />
      </Tooltip>
      
      <FeatureList features={filteredFeatures} />
    </Box>
  );
};
```

### 2.3 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| React (useState, useEffect, useMemo) | Existing | Available |
| MUI (Checkbox, FormControlLabel, Tooltip) | Existing | Available |
| localStorage API | Browser | Available |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/constants/stateOrdering.test.ts` | TERMINAL_STATES array |
| `__tests__/utils/artifactSorting.test.ts` | filterArtifacts() function |
| `__tests__/hooks/useArtifactFilter.test.ts` | Hook state management |

### 3.2 Unit Test Cases

```typescript
// filterArtifacts.test.ts
describe('filterArtifacts', () => {
  const mockArtifacts = [
    { id: '1', title: 'Active', status: 'active' },
    { id: '2', title: 'Done', status: 'done' },
    { id: '3', title: 'Draft', status: 'draft' },
    { id: '4', title: 'Retired', status: 'retired' },
  ];

  it('returns all artifacts when showCompleted is true', () => {
    const result = filterArtifacts(mockArtifacts, true);
    expect(result).toHaveLength(4);
  });

  it('filters out terminal states when showCompleted is false', () => {
    const result = filterArtifacts(mockArtifacts, false);
    expect(result).toHaveLength(2);
    expect(result.map(a => a.status)).toEqual(['active', 'draft']);
  });

  it('handles empty array', () => {
    const result = filterArtifacts([], false);
    expect(result).toEqual([]);
  });
});
```

### 3.3 Component Tests

```typescript
// FADashboard.test.tsx
describe('FADashboard filter toggle', () => {
  it('renders filter toggle checkbox', () => {
    render(<FADashboard />);
    expect(screen.getByLabelText('Show Completed Artifacts')).toBeInTheDocument();
  });

  it('filter is checked by default', () => {
    render(<FADashboard />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('hides completed artifacts when unchecked', async () => {
    render(<FADashboard />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    // Verify done/retired artifacts are hidden
  });
});
```

### 3.4 Integration Tests

- Test filter toggle with real artifact data
- Test localStorage persistence across component remounts

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Create `stateOrdering.ts` with TERMINAL_STATES | 0.5 | None |
| 2 | Create `artifactSorting.ts` with filterArtifacts() | 1 | Task 1 |
| 3 | Create `useArtifactFilter.ts` hook | 2 | None |
| 4 | Write unit tests for constants and utilities | 1.5 | Tasks 1-2 |
| 5 | Write unit tests for useArtifactFilter hook | 1.5 | Task 3 |
| 6 | Integrate filter toggle into FADashboard | 2 | Tasks 1-3 |
| 7 | Integrate filter toggle into BADashboard | 1 | Task 6 |
| 8 | Write component tests | 2 | Tasks 6-7 |
| 9 | Manual testing and accessibility verification | 1 | Tasks 6-7 |
| **Total** | | **12.5 hours** | |

---

## 5. Acceptance Criteria Verification

| AC | Implementation | Test |
|----|----------------|------|
| Component Exists | FormControlLabel with Checkbox in dashboard | Component test |
| Toggle Functional | useState + onChange handler | Unit test |
| Default State (checked) | useState initializer returns true | Unit test |
| Filter Applied Immediately | useMemo recomputes on state change | Integration test |
| Correct Terminal States Hidden | filterArtifacts() checks TERMINAL_STATES | Unit test |
| Works on FA Dashboard | Integrate in FADashboard.tsx | Manual test |
| Works on BA Dashboard | Integrate in BADashboard.tsx | Manual test |
| Keyboard Accessible | MUI Checkbox is keyboard accessible | Accessibility test |
| Screen Reader Support | MUI handles ARIA attributes | Accessibility test |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| localStorage unavailable | Low | Hook falls back to in-memory state |
| Artifact missing status field | Medium | Default to showing artifact (not filtering out) |
| Performance with large lists | Low | useMemo prevents unnecessary re-filtering |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for filter toggle implementation |
