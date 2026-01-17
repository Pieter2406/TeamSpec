---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Testing and accessibility verification"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s004"
filename_pattern: "dp-e007-s004-testing-accessibility.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-004"
    optional: false

---

# Dev Plan: `dp-e007-s004-testing-accessibility`

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
| **Dev Plan ID** | dp-e007-s004 |
| **Story** | [s-e007-004](../stories/backlog/s-e007-004-testing-accessibility.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV / QA |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-004](../stories/backlog/s-e007-004-testing-accessibility.md) | Testing and accessibility verification | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Comprehensive testing and accessibility verification for the dashboard filtering and ordering feature:
1. Complete unit test coverage for all new code
2. Component tests for dashboard integration
3. E2E tests for full user workflows
4. Accessibility audit (WCAG 2.1 AA compliance)
5. Performance benchmarking
6. Cross-browser compatibility testing

### 1.2 Testing Scope

| Area | Test Type | Tools |
|------|-----------|-------|
| Constants | Unit | Jest |
| Utilities | Unit | Jest |
| Hooks | Unit | Jest + React Testing Library |
| Components | Component | React Testing Library |
| User Flows | E2E | Playwright |
| Accessibility | Automated + Manual | axe-core, NVDA, VoiceOver |
| Performance | Benchmark | Chrome DevTools, Jest |

---

## 2. Technical Design

### 2.1 Test File Structure

```
frontend/src/__tests__/
├── constants/
│   └── stateOrdering.test.ts
├── utils/
│   └── artifactSorting.test.ts
├── hooks/
│   └── useArtifactFilter.test.ts
├── components/
│   ├── FADashboard.test.tsx
│   └── BADashboard.test.tsx
└── e2e/
    └── dashboard-filtering.spec.ts
```

### 2.2 Unit Tests

#### 2.2.1 Constants Tests (`stateOrdering.test.ts`)

```typescript
import {
  STATE_PRIORITY,
  STATE_GROUPS,
  TERMINAL_STATES,
  DEFAULT_STATE_PRIORITY,
  getStateCategory,
} from '../../constants/stateOrdering';

describe('stateOrdering constants', () => {
  describe('STATE_PRIORITY', () => {
    it('has 12 defined states', () => {
      expect(Object.keys(STATE_PRIORITY)).toHaveLength(12);
    });

    it('has in-progress as highest priority (1)', () => {
      expect(STATE_PRIORITY['in-progress']).toBe(1);
    });

    it('has archived as lowest priority (12)', () => {
      expect(STATE_PRIORITY['archived']).toBe(12);
    });

    it('has unique priority values', () => {
      const values = Object.values(STATE_PRIORITY);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('has consecutive priorities from 1 to 12', () => {
      const values = Object.values(STATE_PRIORITY).sort((a, b) => a - b);
      expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
  });

  describe('STATE_GROUPS', () => {
    it('has three groups', () => {
      expect(Object.keys(STATE_GROUPS)).toHaveLength(3);
    });

    it('ACTIVE WORK contains expected states', () => {
      expect(STATE_GROUPS['ACTIVE WORK']).toContain('in-progress');
      expect(STATE_GROUPS['ACTIVE WORK']).toContain('active');
      expect(STATE_GROUPS['ACTIVE WORK']).toContain('ready');
      expect(STATE_GROUPS['ACTIVE WORK']).toContain('draft');
      expect(STATE_GROUPS['ACTIVE WORK']).toContain('proposed');
    });

    it('WAITING contains expected states', () => {
      expect(STATE_GROUPS['WAITING']).toContain('pending');
      expect(STATE_GROUPS['WAITING']).toContain('on-hold');
    });

    it('COMPLETED contains terminal states', () => {
      TERMINAL_STATES.forEach(state => {
        expect(STATE_GROUPS['COMPLETED']).toContain(state);
      });
    });
  });

  describe('TERMINAL_STATES', () => {
    it('contains 5 terminal states', () => {
      expect(TERMINAL_STATES).toHaveLength(5);
    });

    it('includes done, retired, deferred, out-of-scope, archived', () => {
      expect(TERMINAL_STATES).toContain('done');
      expect(TERMINAL_STATES).toContain('retired');
      expect(TERMINAL_STATES).toContain('deferred');
      expect(TERMINAL_STATES).toContain('out-of-scope');
      expect(TERMINAL_STATES).toContain('archived');
    });
  });

  describe('getStateCategory', () => {
    it('returns ACTIVE WORK for in-progress', () => {
      expect(getStateCategory('in-progress')).toBe('ACTIVE WORK');
    });

    it('returns WAITING for pending', () => {
      expect(getStateCategory('pending')).toBe('WAITING');
    });

    it('returns COMPLETED for done', () => {
      expect(getStateCategory('done')).toBe('COMPLETED');
    });

    it('returns null for unknown state', () => {
      expect(getStateCategory('unknown')).toBeNull();
    });
  });
});
```

#### 2.2.2 Utilities Tests (`artifactSorting.test.ts`)

```typescript
import {
  filterArtifacts,
  sortArtifacts,
  filterAndSortArtifacts,
  groupArtifactsByCategory,
} from '../../utils/artifactSorting';

describe('artifactSorting utilities', () => {
  const mockArtifacts = [
    { id: '1', title: 'Feature A', status: 'done' },
    { id: '2', title: 'Feature B', status: 'active' },
    { id: '3', title: 'Feature C', status: 'in-progress' },
    { id: '4', title: 'Feature D', status: 'draft' },
    { id: '5', title: 'Feature E', status: 'retired' },
    { id: '6', title: 'Feature F', status: 'pending' },
  ];

  describe('filterArtifacts', () => {
    it('returns all when showCompleted is true', () => {
      const result = filterArtifacts(mockArtifacts, true);
      expect(result).toHaveLength(6);
    });

    it('filters terminal states when showCompleted is false', () => {
      const result = filterArtifacts(mockArtifacts, false);
      expect(result).toHaveLength(4);
      expect(result.map(a => a.status)).not.toContain('done');
      expect(result.map(a => a.status)).not.toContain('retired');
    });

    it('returns empty array for empty input', () => {
      expect(filterArtifacts([], false)).toEqual([]);
    });

    it('preserves all artifacts when none are terminal', () => {
      const activeOnly = [
        { id: '1', title: 'A', status: 'active' },
        { id: '2', title: 'B', status: 'draft' },
      ];
      const result = filterArtifacts(activeOnly, false);
      expect(result).toHaveLength(2);
    });
  });

  describe('sortArtifacts', () => {
    it('sorts by state priority', () => {
      const result = sortArtifacts(mockArtifacts);
      expect(result[0].status).toBe('in-progress');
      expect(result[1].status).toBe('active');
      expect(result[2].status).toBe('draft');
    });

    it('sorts alphabetically within same state', () => {
      const sameState = [
        { id: '1', title: 'Zebra', status: 'active' },
        { id: '2', title: 'Apple', status: 'active' },
        { id: '3', title: 'Mango', status: 'active' },
      ];
      const result = sortArtifacts(sameState);
      expect(result.map(a => a.title)).toEqual(['Apple', 'Mango', 'Zebra']);
    });

    it('does not mutate original array', () => {
      const original = [...mockArtifacts];
      sortArtifacts(mockArtifacts);
      expect(mockArtifacts).toEqual(original);
    });

    it('handles unknown states by putting them at end', () => {
      const withUnknown = [
        { id: '1', title: 'Unknown', status: 'mystery' },
        { id: '2', title: 'Active', status: 'active' },
      ];
      const result = sortArtifacts(withUnknown);
      expect(result[0].status).toBe('active');
      expect(result[1].status).toBe('mystery');
    });
  });

  describe('filterAndSortArtifacts', () => {
    it('filters then sorts', () => {
      const result = filterAndSortArtifacts(mockArtifacts, false);
      expect(result).toHaveLength(4);
      expect(result[0].status).toBe('in-progress');
    });

    it('only sorts when showCompleted is true', () => {
      const result = filterAndSortArtifacts(mockArtifacts, true);
      expect(result).toHaveLength(6);
      expect(result[0].status).toBe('in-progress');
    });
  });

  describe('groupArtifactsByCategory', () => {
    it('groups artifacts by state category', () => {
      const result = groupArtifactsByCategory(mockArtifacts);
      expect(result.get('ACTIVE WORK')).toBeDefined();
      expect(result.get('WAITING')).toBeDefined();
      expect(result.get('COMPLETED')).toBeDefined();
    });

    it('sorts within each group', () => {
      const result = groupArtifactsByCategory(mockArtifacts);
      const activeWork = result.get('ACTIVE WORK')!;
      expect(activeWork[0].status).toBe('in-progress');
    });
  });
});
```

### 2.3 Component Tests

```typescript
// FADashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FADashboard } from '../../components/FADashboard';

// Mock the useFeatures hook
jest.mock('../../hooks/useFeatures', () => ({
  useFeatures: () => ({
    features: [
      { id: '1', title: 'Done Feature', status: 'done' },
      { id: '2', title: 'Active Feature', status: 'active' },
      { id: '3', title: 'In Progress', status: 'in-progress' },
    ],
    loading: false,
    error: null,
  }),
}));

describe('FADashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('filter toggle', () => {
    it('renders filter toggle checkbox', () => {
      render(<FADashboard />);
      expect(screen.getByLabelText('Show Completed Artifacts')).toBeInTheDocument();
    });

    it('filter is checked by default', () => {
      render(<FADashboard />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('hides completed artifacts when unchecked', async () => {
      render(<FADashboard />);
      const checkbox = screen.getByRole('checkbox');
      
      // Initially all visible
      expect(screen.getByText('Done Feature')).toBeInTheDocument();
      
      await userEvent.click(checkbox);
      
      // Done feature should be hidden
      expect(screen.queryByText('Done Feature')).not.toBeInTheDocument();
      expect(screen.getByText('Active Feature')).toBeInTheDocument();
    });

    it('shows completed artifacts when re-checked', async () => {
      render(<FADashboard />);
      const checkbox = screen.getByRole('checkbox');
      
      await userEvent.click(checkbox); // Hide
      await userEvent.click(checkbox); // Show again
      
      expect(screen.getByText('Done Feature')).toBeInTheDocument();
    });
  });

  describe('state ordering', () => {
    it('displays artifacts in state priority order', () => {
      render(<FADashboard />);
      
      const items = screen.getAllByTestId('feature-card');
      expect(items[0]).toHaveTextContent('In Progress');
      expect(items[1]).toHaveTextContent('Active Feature');
      expect(items[2]).toHaveTextContent('Done Feature');
    });
  });

  describe('accessibility', () => {
    it('filter toggle is keyboard accessible', async () => {
      render(<FADashboard />);
      const checkbox = screen.getByRole('checkbox');
      
      checkbox.focus();
      expect(checkbox).toHaveFocus();
      
      await userEvent.keyboard(' '); // Space to toggle
      expect(checkbox).not.toBeChecked();
    });

    it('has proper ARIA attributes', () => {
      render(<FADashboard />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked');
    });
  });
});
```

### 2.4 E2E Tests (Playwright)

```typescript
// e2e/dashboard-filtering.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Filtering', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
    await page.goto('/fa-dashboard');
  });

  test('filter toggle shows/hides completed artifacts', async ({ page }) => {
    // Find filter toggle
    const toggle = page.getByLabel('Show Completed Artifacts');
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeChecked();

    // Count initial artifacts
    const initialCount = await page.locator('[data-testid="feature-card"]').count();

    // Uncheck filter
    await toggle.click();
    await expect(toggle).not.toBeChecked();

    // Verify fewer artifacts shown
    const filteredCount = await page.locator('[data-testid="feature-card"]').count();
    expect(filteredCount).toBeLessThan(initialCount);

    // Re-check filter
    await toggle.click();
    await expect(toggle).toBeChecked();

    // Verify all artifacts shown again
    const restoredCount = await page.locator('[data-testid="feature-card"]').count();
    expect(restoredCount).toBe(initialCount);
  });

  test('filter state persists across page reload', async ({ page }) => {
    // Uncheck filter
    const toggle = page.getByLabel('Show Completed Artifacts');
    await toggle.click();
    await expect(toggle).not.toBeChecked();

    // Reload page
    await page.reload();

    // Verify filter state persisted
    const toggleAfterReload = page.getByLabel('Show Completed Artifacts');
    await expect(toggleAfterReload).not.toBeChecked();
  });

  test('artifacts are sorted by state priority', async ({ page }) => {
    const cards = page.locator('[data-testid="feature-card"]');
    
    // Get all status badges
    const statuses = await cards.locator('[data-testid="status-badge"]').allTextContents();
    
    // Verify in-progress comes before active, active before done, etc.
    const priorityOrder = ['in-progress', 'active', 'ready', 'draft', 'proposed', 
                          'pending', 'on-hold', 'deferred', 'out-of-scope', 
                          'done', 'retired', 'archived'];
    
    let lastPriority = -1;
    for (const status of statuses) {
      const currentPriority = priorityOrder.indexOf(status.toLowerCase());
      expect(currentPriority).toBeGreaterThanOrEqual(lastPriority);
      lastPriority = currentPriority;
    }
  });

  test('filter is keyboard accessible', async ({ page }) => {
    // Tab to filter toggle
    await page.keyboard.press('Tab');
    const toggle = page.getByLabel('Show Completed Artifacts');
    await expect(toggle).toBeFocused();

    // Space to toggle
    await page.keyboard.press('Space');
    await expect(toggle).not.toBeChecked();

    // Space again to toggle back
    await page.keyboard.press('Space');
    await expect(toggle).toBeChecked();
  });
});

test.describe('Cross-browser', () => {
  test('works in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox only');
    await page.goto('/fa-dashboard');
    await expect(page.getByLabel('Show Completed Artifacts')).toBeVisible();
  });

  test('works in WebKit/Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'WebKit only');
    await page.goto('/fa-dashboard');
    await expect(page.getByLabel('Show Completed Artifacts')).toBeVisible();
  });
});
```

### 2.5 Accessibility Testing

#### Automated Tests (axe-core)

```typescript
// accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FADashboard } from '../../components/FADashboard';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('FADashboard has no accessibility violations', async () => {
    const { container } = render(<FADashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('filter toggle meets WCAG AA color contrast', async () => {
    const { container } = render(<FADashboard />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
```

#### Manual Accessibility Checklist

| Check | Tool | Pass Criteria |
|-------|------|---------------|
| Keyboard navigation | Manual | Tab reaches toggle, Space/Enter activates |
| Focus indicator | Manual | Clear visual focus ring on toggle |
| Screen reader | NVDA/VoiceOver | Label, state, and changes announced |
| Color contrast | axe DevTools | ≥4.5:1 for text, ≥3:1 for UI |
| Touch target | Manual | ≥44x44px on mobile |

### 2.6 Performance Testing

```typescript
// performance.test.ts
describe('Performance', () => {
  it('filters 100 artifacts in <50ms', () => {
    const artifacts = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      title: `Feature ${i}`,
      status: ['active', 'done', 'draft'][i % 3],
    }));

    const start = performance.now();
    filterAndSortArtifacts(artifacts, false);
    const end = performance.now();

    expect(end - start).toBeLessThan(50);
  });

  it('sorts 500 artifacts in <100ms', () => {
    const artifacts = Array.from({ length: 500 }, (_, i) => ({
      id: String(i),
      title: `Feature ${i}`,
      status: Object.keys(STATE_PRIORITY)[i % 12],
    }));

    const start = performance.now();
    sortArtifacts(artifacts);
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
  });
});
```

---

## 3. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Write unit tests for stateOrdering.ts | 1.5 | s-e007-001, s-e007-002 |
| 2 | Write unit tests for artifactSorting.ts | 2 | s-e007-001, s-e007-002 |
| 3 | Write unit tests for useArtifactFilter.ts | 2 | s-e007-003 |
| 4 | Write component tests for FADashboard | 2 | Tasks 1-3 |
| 5 | Write component tests for BADashboard | 1 | Task 4 |
| 6 | Set up Playwright E2E tests | 1 | Tasks 4-5 |
| 7 | Write E2E test scenarios | 3 | Task 6 |
| 8 | Set up axe-core accessibility tests | 1 | Tasks 4-5 |
| 9 | Run automated accessibility audit | 1 | Task 8 |
| 10 | Manual accessibility testing (NVDA, VoiceOver) | 2 | Tasks 4-5 |
| 11 | Performance benchmarking | 1 | Tasks 1-2 |
| 12 | Cross-browser testing | 1.5 | Task 6 |
| 13 | Document test results and coverage | 1 | All |
| **Total** | | **20 hours** | |

---

## 4. Test Coverage Targets

| Area | Target Coverage |
|------|-----------------|
| stateOrdering.ts | 100% |
| artifactSorting.ts | 100% |
| useArtifactFilter.ts | >95% |
| FADashboard.tsx (new code) | >85% |
| BADashboard.tsx (new code) | >85% |

---

## 5. Acceptance Criteria Verification

| AC | Test Type | Status |
|----|-----------|--------|
| Unit tests passing | Unit | ⏳ |
| Integration tests passing | Component | ⏳ |
| E2E tests passing | Playwright | ⏳ |
| WCAG 2.1 AA compliance | axe + Manual | ⏳ |
| Keyboard navigation works | E2E | ⏳ |
| Screen reader support | Manual | ⏳ |
| <50ms filter operation | Performance | ⏳ |
| <100ms sort operation | Performance | ⏳ |
| Cross-browser compatible | E2E | ⏳ |

---

## 6. QA Test Report Template

```markdown
# QA Test Report: Epic TSV-007

## Summary
- **Date:** YYYY-MM-DD
- **Tester:** [Name]
- **Build:** [version/commit]
- **Overall Status:** Pass / Fail / Pass with issues

## Test Results

### Unit Tests
- Total: XX
- Passed: XX
- Failed: XX
- Coverage: XX%

### Component Tests
- Total: XX
- Passed: XX
- Failed: XX

### E2E Tests
- Total: XX
- Passed: XX
- Failed: XX

### Accessibility Audit
- axe violations: XX
- WCAG AA status: Pass / Fail

### Performance
- Filter 100 artifacts: XX ms
- Sort 500 artifacts: XX ms

### Browser Compatibility
- Chrome: Pass / Fail
- Firefox: Pass / Fail
- Safari: Pass / Fail
- Edge: Pass / Fail

## Issues Found
1. [Issue description, severity, status]

## Recommendations
- [Any improvements or concerns]

## Sign-off
- [ ] QA approved
- [ ] Ready for release
```

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV/QA | Draft | Initial dev plan for comprehensive testing and accessibility verification |
