---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "localStorage persistence implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s003"
filename_pattern: "dp-e007-s003-localstorage-persistence.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-003"
    optional: false

---

# Dev Plan: `dp-e007-s003-localstorage-persistence`

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
| **Dev Plan ID** | dp-e007-s003 |
| **Story** | [s-e007-003](../stories/backlog/s-e007-003-localstorage-persistence.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-003](../stories/backlog/s-e007-003-localstorage-persistence.md) | Add localStorage persistence for filter state | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

This story enhances the `useArtifactFilter` hook (from s-e007-001) with robust localStorage persistence:
1. Verify localStorage read/write on state changes
2. Add error handling for private browsing mode
3. Ensure persistence survives page reload and browser restart
4. Test edge cases (quota exceeded, unavailable storage)

**Note:** Basic localStorage was implemented in s-e007-001. This story focuses on verification, edge case handling, and comprehensive testing.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `useArtifactFilter.ts` | Modified | Enhance error handling, add fallback logic |
| `useLocalStorage.ts` | New (optional) | Generic localStorage hook for reusability |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/hooks/useArtifactFilter.ts` | Modify | Enhance localStorage handling |
| `frontend/src/hooks/useLocalStorage.ts` | Create (optional) | Generic reusable localStorage hook |
| `frontend/src/__tests__/hooks/useArtifactFilter.test.ts` | Create | Comprehensive persistence tests |

### 2.2 Code Implementation

#### 2.2.1 Enhanced useArtifactFilter Hook

```typescript
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_PREFIX = 'tsv_showCompleted_';

interface UseArtifactFilterOptions {
  role: 'FA' | 'BA';
  defaultValue?: boolean;
}

interface UseArtifactFilterResult {
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  toggleShowCompleted: () => void;
  isPersisted: boolean; // NEW: indicates if localStorage is working
}

/**
 * Check if localStorage is available and functional
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__tsv_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const useArtifactFilter = ({
  role,
  defaultValue = true,
}: UseArtifactFilterOptions): UseArtifactFilterResult => {
  const storageKey = `${STORAGE_KEY_PREFIX}${role}`;
  const storageAvailable = isLocalStorageAvailable();

  // Initialize from localStorage or default
  const [showCompleted, setShowCompletedState] = useState<boolean>(() => {
    if (!storageAvailable) {
      return defaultValue;
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === null) {
        return defaultValue;
      }
      return stored === 'true';
    } catch (error) {
      console.warn('Failed to read filter state from localStorage:', error);
      return defaultValue;
    }
  });

  // Track if persistence is working
  const [isPersisted, setIsPersisted] = useState(storageAvailable);

  // Persist to localStorage on change
  useEffect(() => {
    if (!storageAvailable) {
      setIsPersisted(false);
      return;
    }

    try {
      localStorage.setItem(storageKey, showCompleted.toString());
      setIsPersisted(true);
    } catch (error) {
      // Could be QuotaExceededError or SecurityError
      console.warn('Failed to persist filter state to localStorage:', error);
      setIsPersisted(false);
    }
  }, [showCompleted, storageKey, storageAvailable]);

  const setShowCompleted = useCallback((value: boolean) => {
    setShowCompletedState(value);
  }, []);

  const toggleShowCompleted = useCallback(() => {
    setShowCompletedState(prev => !prev);
  }, []);

  return {
    showCompleted,
    setShowCompleted,
    toggleShowCompleted,
    isPersisted,
  };
};
```

#### 2.2.2 Optional: Generic useLocalStorage Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, boolean] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const [isPersisted, setIsPersisted] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
      setIsPersisted(true);
    } catch {
      setIsPersisted(false);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue, isPersisted];
};
```

### 2.3 localStorage Key Strategy

| Dashboard | Storage Key | Example Value |
|-----------|-------------|---------------|
| FA Dashboard | `tsv_showCompleted_FA` | `"true"` or `"false"` |
| BA Dashboard | `tsv_showCompleted_BA` | `"true"` or `"false"` |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/hooks/useArtifactFilter.test.ts` | Full hook behavior |
| `__tests__/hooks/useLocalStorage.test.ts` | Generic hook (if created) |

### 3.2 Test Cases

```typescript
// useArtifactFilter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useArtifactFilter } from '../useArtifactFilter';

describe('useArtifactFilter persistence', () => {
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('defaults to true when no stored value', () => {
      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );
      expect(result.current.showCompleted).toBe(true);
    });

    it('reads stored value from localStorage', () => {
      mockLocalStorage.setItem('tsv_showCompleted_FA', 'false');
      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );
      expect(result.current.showCompleted).toBe(false);
    });

    it('uses defaultValue parameter when provided', () => {
      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA', defaultValue: false })
      );
      expect(result.current.showCompleted).toBe(false);
    });
  });

  describe('persistence', () => {
    it('saves to localStorage when state changes', () => {
      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      act(() => {
        result.current.setShowCompleted(false);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'tsv_showCompleted_FA',
        'false'
      );
    });

    it('uses role-specific key', () => {
      renderHook(() => useArtifactFilter({ role: 'BA' }));
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'tsv_showCompleted_BA'
      );
    });

    it('persists across component remounts', () => {
      const { result, unmount } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      act(() => {
        result.current.setShowCompleted(false);
      });

      unmount();

      const { result: result2 } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      expect(result2.current.showCompleted).toBe(false);
    });
  });

  describe('error handling', () => {
    it('handles localStorage read failure gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      expect(result.current.showCompleted).toBe(true); // Falls back to default
    });

    it('handles localStorage write failure gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      act(() => {
        result.current.setShowCompleted(false);
      });

      // Should not throw, state still updates
      expect(result.current.showCompleted).toBe(false);
      expect(result.current.isPersisted).toBe(false);
    });

    it('sets isPersisted to false when localStorage unavailable', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      expect(result.current.isPersisted).toBe(false);
    });
  });

  describe('toggleShowCompleted', () => {
    it('toggles the current value', () => {
      const { result } = renderHook(() =>
        useArtifactFilter({ role: 'FA' })
      );

      expect(result.current.showCompleted).toBe(true);

      act(() => {
        result.current.toggleShowCompleted();
      });

      expect(result.current.showCompleted).toBe(false);

      act(() => {
        result.current.toggleShowCompleted();
      });

      expect(result.current.showCompleted).toBe(true);
    });
  });
});
```

### 3.3 Integration Tests

```typescript
// Integration test with real localStorage
describe('useArtifactFilter integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists across page simulated reload', () => {
    // First render
    const { result, unmount } = renderHook(() =>
      useArtifactFilter({ role: 'FA' })
    );

    act(() => {
      result.current.setShowCompleted(false);
    });

    unmount();

    // Simulate page reload - new render
    const { result: result2 } = renderHook(() =>
      useArtifactFilter({ role: 'FA' })
    );

    expect(result2.current.showCompleted).toBe(false);
  });

  it('maintains separate state for FA and BA', () => {
    const { result: faResult } = renderHook(() =>
      useArtifactFilter({ role: 'FA' })
    );
    const { result: baResult } = renderHook(() =>
      useArtifactFilter({ role: 'BA' })
    );

    act(() => {
      faResult.current.setShowCompleted(false);
    });

    expect(faResult.current.showCompleted).toBe(false);
    expect(baResult.current.showCompleted).toBe(true); // Unchanged
  });
});
```

### 3.4 E2E Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Basic persistence | Toggle → Reload page | Toggle state preserved |
| Browser restart | Toggle → Close browser → Reopen | Toggle state preserved |
| Private mode | Open in incognito → Toggle | Works, but doesn't persist |
| Clear cache | Toggle → Clear site data → Reload | Resets to default |
| Multiple tabs | Toggle in tab 1 → Reload tab 2 | Both tabs have same state |

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Add isLocalStorageAvailable() helper | 0.5 | s-e007-001 complete |
| 2 | Add isPersisted return value to hook | 0.5 | Task 1 |
| 3 | Enhance error handling (try/catch) | 1 | Task 1 |
| 4 | Write unit tests for initialization | 1 | Tasks 1-3 |
| 5 | Write unit tests for persistence | 1.5 | Tasks 1-3 |
| 6 | Write unit tests for error handling | 1.5 | Tasks 1-3 |
| 7 | Write integration tests | 1 | Tasks 1-3 |
| 8 | Manual testing in private mode | 0.5 | Tasks 1-3 |
| 9 | Manual testing across browsers | 0.5 | Tasks 1-3 |
| **Total** | | **8 hours** | |

---

## 5. Acceptance Criteria Verification

| AC | Implementation | Test |
|----|----------------|------|
| Filter State Saved | localStorage.setItem in useEffect | Unit test |
| Filter State Restored | localStorage.getItem in useState init | Unit test |
| Unique Key Per Role | `tsv_showCompleted_${role}` | Unit test |
| Default When No Saved State | Return defaultValue if null | Unit test |
| Browser Session Survives | localStorage persists across sessions | Integration test |
| Private Mode Graceful | isLocalStorageAvailable() check | Unit test |
| No Size Issues | <100 bytes per key | Code review |

---

## 6. Edge Cases

| Edge Case | Handling | Test Coverage |
|-----------|----------|---------------|
| localStorage unavailable | Fall back to in-memory state | Unit test |
| QuotaExceededError | Catch, log warning, continue | Unit test |
| Invalid stored value | Treat as default | Unit test |
| Storage cleared mid-session | No effect until reload | Manual test |
| Cross-origin restrictions | Same handling as unavailable | Manual test |

---

## 7. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Private browsing breaks persistence | Low | Graceful degradation; feature still works |
| Storage quota exceeded | Very Low | Only storing ~50 bytes; not a concern |
| Multiple users on shared browser | Low | Filter is per-browser, not per-user (acceptable for MVP) |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for localStorage persistence verification and testing |
