---
# === LLM Retrieval Metadata ===
artifact_kind: tai
spec_version: "4.0"
template_version: "4.0.1"
title: "Dashboard state filtering and ordering architecture"

# === Ownership ===
role_owner: SA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tai-TSV-001"
filename_pattern: "tai-TSV-001-dashboard-filtering-ordering.md"

# === Required Relationships ===
links_required:
  - type: technical-architecture
    pattern: "ta-TSV-001"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false

# === Search Optimization ===
keywords:
  - technical architecture increment
  - TAI
  - filtering
  - ordering
  - state management
  - localStorage
  - dashboard architecture
aliases:
  - filtering architecture
  - state ordering architecture
anti_keywords:
  - business requirements
  - story
  - feature behavior

---

# Technical Architecture Increment: `tai-TSV-001-dashboard-filtering-ordering`

> **ID:** tai-TSV-001  
> **Product:** teamspec-viewer (TSV)  
> **Project:** teamspecviewermvp  
> **Target TA:** [ta-TSV-001-react-browser-frontend](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md)  
> **Feature Increment:** [fi-TSV-007-dashboard-filtering-ordering](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)  
> **Status:** proposed

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Technical Architecture Increment (Project)  
**Lifecycle:** Project-scoped, merged to Product TA after approval

---

## Metadata

| Field | Value |
| :--- | :--- |
| **TAI ID** | tai-TSV-001 |
| **Status** | Proposed |
| **Date** | 2026-01-17 |
| **Author** | SA |
| **Target TA** | [ta-TSV-001](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) |
| **Feature Increment** | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |
| **Epic** | [epic-TSV-007](../epics/epic-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Overview

This Technical Architecture Increment defines the frontend architecture patterns for implementing dashboard artifact filtering and smart state ordering capabilities:

1. **State Ordering Configuration**: Centralized, extensible configuration for artifact state priorities
2. **Filtering/Sorting Utilities**: Pure utility functions for filtering and sorting artifact collections
3. **State Persistence Layer**: React hooks with localStorage integration for user preference persistence
4. **Component Integration Pattern**: How filtering and ordering integrate with existing dashboard components

This TAI extends the existing React+TypeScript+MUI frontend architecture (ta-TSV-001) with new patterns for client-side data transformation and user preference persistence.

---

## 2. AS-IS (Current Product TA)

### 2.1 Current Frontend Architecture (from ta-TSV-001)

From [ta-TSV-001-react-browser-frontend](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md):

> **Decision:**
> - Application type: Browser application
> - Frontend library: React
> - Language: TypeScript
> - Styling: Tailwind CSS
> - UI component library: Material UI
>
> **Implementation Notes:**
> - React + TypeScript codebase conventions → Functional components, hooks, Context for state
> - Tailwind + Material UI composition conventions → MUI for structure, Tailwind for spacing/utility

### 2.2 Current Dashboard Architecture

The current FA/BA Dashboard components:
- Receive artifact data from backend API (via `fetch` or custom hooks)
- Render artifacts in a flat list without filtering or ordering logic
- No client-side state transformation layer
- No user preference persistence mechanism

**Current Component Structure:**
```
FADashboard.tsx
├── useFeatures() hook → fetches from /api/features
├── FeatureCard.tsx (renders single feature)
└── ArtifactTree.tsx (nested artifact navigation)

BADashboard.tsx
├── useBusinessAnalysis() hook → fetches from /api/business-analysis
├── BACard.tsx (renders single BA document)
└── ArtifactTree.tsx (nested artifact navigation)
```

**Limitations:**
- No filtering capability (all artifacts displayed)
- No ordering logic (arbitrary display order)
- No preference persistence (no localStorage integration)
- No centralized state configuration

---

## 3. TO-BE (Project Technical Architecture)

### 3.1 New Architecture Elements

This TAI introduces four new architectural patterns:

#### 3.1.1 State Ordering Configuration Layer

**Purpose**: Centralized, extensible configuration for artifact state priorities and groupings.

**Location**: `frontend/src/constants/stateOrdering.ts`

**Architecture Pattern**: Configuration-as-Code

```typescript
// State priority configuration (extensible for future states)
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
export const STATE_GROUPS: Record<string, string[]> = {
  'ACTIVE WORK': ['in-progress', 'active', 'ready', 'draft', 'proposed'],
  'WAITING': ['pending', 'on-hold'],
  'COMPLETED': ['deferred', 'out-of-scope', 'done', 'retired', 'archived'],
};

// Terminal states (hidden by filter toggle)
export const TERMINAL_STATES: string[] = [
  'deferred', 'out-of-scope', 'done', 'retired', 'archived'
];

// Default priority for unknown states
export const DEFAULT_STATE_PRIORITY = 99;
```

**Extensibility**: New states can be added by updating `STATE_PRIORITY` without code changes elsewhere.

#### 3.1.2 Filtering & Sorting Utility Layer

**Purpose**: Pure functions for transforming artifact collections.

**Location**: `frontend/src/utils/artifactSorting.ts`

**Architecture Pattern**: Functional utilities (pure functions, no side effects)

```typescript
import { STATE_PRIORITY, TERMINAL_STATES, DEFAULT_STATE_PRIORITY } from '../constants/stateOrdering';

interface Artifact {
  id: string;
  title: string;
  status: string;
  // ... other fields
}

/**
 * Filter artifacts based on visibility of completed states
 */
export const filterArtifacts = (
  artifacts: Artifact[],
  showCompleted: boolean
): Artifact[] => {
  if (showCompleted) return artifacts;
  return artifacts.filter(art => !TERMINAL_STATES.includes(art.status));
};

/**
 * Sort artifacts by state priority, then alphabetically by title
 */
export const sortArtifacts = (artifacts: Artifact[]): Artifact[] => {
  return [...artifacts].sort((a, b) => {
    const priorityA = STATE_PRIORITY[a.status] ?? DEFAULT_STATE_PRIORITY;
    const priorityB = STATE_PRIORITY[b.status] ?? DEFAULT_STATE_PRIORITY;
    
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.title.localeCompare(b.title);
  });
};

/**
 * Combined filter and sort operation
 */
export const filterAndSortArtifacts = (
  artifacts: Artifact[],
  showCompleted: boolean
): Artifact[] => {
  return sortArtifacts(filterArtifacts(artifacts, showCompleted));
};

/**
 * Group artifacts by state category
 */
export const groupArtifactsByStateCategory = (
  artifacts: Artifact[]
): Record<string, Artifact[]> => {
  // Implementation for visual grouping
};
```

**Design Principles:**
- Pure functions (no side effects)
- Immutable operations (spread operator creates new arrays)
- Type-safe with TypeScript interfaces
- Composable (filter and sort can be used independently)

#### 3.1.3 State Persistence Layer (Custom Hook)

**Purpose**: React hook encapsulating localStorage read/write and React state sync.

**Location**: `frontend/src/hooks/useArtifactFilter.ts`

**Architecture Pattern**: Custom React Hook with localStorage

```typescript
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_PREFIX = 'tsv_showCompleted_';

interface UseArtifactFilterOptions {
  role: 'FA' | 'BA';  // Used for role-specific persistence
  defaultValue?: boolean;
}

interface UseArtifactFilterResult {
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  toggleShowCompleted: () => void;
}

export const useArtifactFilter = ({
  role,
  defaultValue = true,
}: UseArtifactFilterOptions): UseArtifactFilterResult => {
  const storageKey = `${STORAGE_KEY_PREFIX}${role}`;

  // Initialize from localStorage or default
  const [showCompleted, setShowCompletedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? stored === 'true' : defaultValue;
    } catch {
      // localStorage unavailable (private mode, etc.)
      return defaultValue;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, showCompleted.toString());
    } catch {
      // Fail silently if localStorage unavailable
      console.warn('Failed to persist filter state to localStorage');
    }
  }, [showCompleted, storageKey]);

  const setShowCompleted = useCallback((value: boolean) => {
    setShowCompletedState(value);
  }, []);

  const toggleShowCompleted = useCallback(() => {
    setShowCompletedState(prev => !prev);
  }, []);

  return { showCompleted, setShowCompleted, toggleShowCompleted };
};
```

**Error Handling:**
- Graceful degradation when localStorage unavailable
- Silent failures (no user-facing errors)
- Fallback to in-memory state

**Persistence Strategy:**
- Key format: `tsv_showCompleted_{ROLE}` (role-specific)
- Value format: `"true"` | `"false"` (string boolean)
- Sync: Write on state change via useEffect

#### 3.1.4 Component Integration Pattern

**Purpose**: How dashboard components integrate filtering and ordering.

**Pattern**: Compose hooks and utilities in dashboard components.

```typescript
// FADashboard.tsx integration pattern
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterAndSortArtifacts } from '../utils/artifactSorting';

export const FADashboard: React.FC = () => {
  // Existing: Fetch artifacts from API
  const { features, loading, error } = useFeatures();
  
  // NEW: Filter state management with persistence
  const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'FA' });
  
  // NEW: Apply filtering and sorting
  const processedFeatures = useMemo(
    () => filterAndSortArtifacts(features, showCompleted),
    [features, showCompleted]
  );

  return (
    <Box>
      {/* NEW: Filter toggle control */}
      <FormControlLabel
        control={
          <Checkbox
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
          />
        }
        label="Show Completed Artifacts"
      />
      
      {/* Existing: Artifact list (now uses processedFeatures) */}
      <FeatureList features={processedFeatures} />
    </Box>
  );
};
```

**Memoization**: Use `useMemo` for expensive filtering/sorting operations to prevent unnecessary re-computations.

### 3.2 Technical Specifications

#### 3.2.1 File Structure (New Files)

```
frontend/src/
├── constants/
│   └── stateOrdering.ts        # NEW: State priority configuration
├── utils/
│   └── artifactSorting.ts      # NEW: Filter/sort utilities
├── hooks/
│   └── useArtifactFilter.ts    # NEW: Persistence hook
└── components/
    ├── FADashboard.tsx         # MODIFIED: Integrate hook + utilities
    └── BADashboard.tsx         # MODIFIED: Integrate hook + utilities
```

#### 3.2.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FADashboard.tsx                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌──────────────────┐                      │
│  │ useFeatures │────►│ Raw Artifacts    │                      │
│  │   (API)     │     │ (unordered)      │                      │
│  └─────────────┘     └────────┬─────────┘                      │
│                               │                                 │
│  ┌─────────────────┐          │                                │
│  │useArtifactFilter│          │                                │
│  │  (localStorage) │          │                                │
│  └────────┬────────┘          │                                │
│           │                   │                                │
│           ▼                   ▼                                │
│  ┌─────────────────────────────────────┐                       │
│  │     filterAndSortArtifacts()        │                       │
│  │  ┌──────────────┐  ┌─────────────┐  │                       │
│  │  │filterArtifacts│  │sortArtifacts│  │                       │
│  │  └──────────────┘  └─────────────┘  │                       │
│  └────────────────────┬────────────────┘                       │
│                       │                                         │
│                       ▼                                         │
│  ┌─────────────────────────────────────┐                       │
│  │        Processed Artifacts          │                       │
│  │     (filtered + sorted)             │                       │
│  └────────────────────┬────────────────┘                       │
│                       │                                         │
│                       ▼                                         │
│  ┌─────────────────────────────────────┐                       │
│  │          FeatureList                │                       │
│  │     (renders processed list)        │                       │
│  └─────────────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2.3 Performance Considerations

| Operation | Target | Implementation |
|-----------|--------|----------------|
| Filter toggle | <50ms | `useMemo` prevents unnecessary re-renders |
| Sort 100 artifacts | <100ms | Array.sort with simple priority lookup |
| localStorage read | <10ms | Single key lookup on component mount |
| localStorage write | <10ms | Single key write on state change |

**Optimization Strategy:**
- `useMemo` for filtering/sorting operations
- Lazy initialization of localStorage in useState callback
- Avoid re-sorting when only toggle state changes (memoization key includes both artifacts and showCompleted)

#### 3.2.4 Error Handling Strategy

| Scenario | Handling | User Impact |
|----------|----------|-------------|
| localStorage unavailable (private mode) | Fallback to in-memory state | Filter works, but doesn't persist |
| localStorage quota exceeded | Silent failure, log warning | Filter works, but doesn't persist |
| Unknown artifact state | Default priority (99) | Artifact sorted to end of list |
| Missing status field | Treat as unknown state | Artifact sorted to end of list |

### 3.3 Out of Scope

This TAI does NOT include:

- [ ] Backend API changes (filtering/sorting is client-side only)
- [ ] State management library (Redux, Zustand, etc.) — uses React hooks
- [ ] Cross-tab synchronization (localStorage events) — single-tab persistence only
- [ ] Server-side filtering/sorting (all client-side for MVP)
- [ ] Custom sort order persistence (only filter toggle is persisted)
- [ ] User authentication integration (localStorage is browser-scoped, not user-scoped)

---

## 4. Impact Analysis

### 4.1 Feature Implications

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) | Enhanced | Dashboard now includes filtering and ordering capabilities |
| [f-TSV-001](../../products/teamspec-viewer/features/f-TSV-001-basic-reading.md) | None | Viewer reading experience unchanged |
| [f-TSV-003](../../products/teamspec-viewer/features/f-TSV-003-feature-increment-navigation.md) | None | Navigation unchanged (may integrate with ordering in future) |

### 4.2 Technical Architecture Implications

| TA | Impact Type | Description |
|----|-------------|-------------|
| [ta-TSV-001](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) | Extended | New patterns (custom hooks, utility functions) added to frontend architecture |
| [ta-TSV-002](../../products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md) | None | Backend API unchanged |

### 4.3 Implementation Constraints

For DEV implementing stories s-e007-001 through s-e007-005:

1. **TypeScript Required**: All new files must use TypeScript with strict mode
2. **Pure Functions**: Utility functions must be pure (no side effects)
3. **Hook Naming**: Custom hooks must follow `use*` naming convention
4. **Memoization**: Use `useMemo` for expensive computations
5. **Error Handling**: Handle localStorage unavailability gracefully
6. **Testing**: Unit tests required for utilities and hooks

---

## 5. Behavior Impact Assessment

### 5.1 Does this TAI affect user-observable behavior?

- [ ] **No** — Technology baseline decision only
- [x] **Yes** — Behavior implications described below

### 5.2 Behavior Implications

| Technical Decision | Behavior Implication | FA Action |
|--------------------|---------------------|-----------|
| Client-side filtering | Artifacts hide/show immediately (no API call) | Document in fi-TSV-007 TO-BE |
| localStorage persistence | Filter preference survives page reload | Document in fi-TSV-007 TO-BE |
| State ordering | Artifacts always ordered by state priority | Document in fi-TSV-007 TO-BE |
| Role-specific persistence | FA and BA dashboards have independent filter preferences | Document in fi-TSV-007 TO-BE |

### 5.3 Feature Canon Updates

The following Feature Canon sections must be updated after implementation:

- **f-TSV-002 Role-Specific Dashboards**: Add sections describing filtering and ordering behavior
- **fi-TSV-007**: TO-BE section must reflect final architecture decisions

---

## 6. Testing Architecture

### 6.1 Unit Testing

| Component | Test Location | Coverage Target |
|-----------|---------------|-----------------|
| `stateOrdering.ts` | `__tests__/constants/stateOrdering.test.ts` | 100% |
| `artifactSorting.ts` | `__tests__/utils/artifactSorting.test.ts` | 100% |
| `useArtifactFilter.ts` | `__tests__/hooks/useArtifactFilter.test.ts` | >90% |

### 6.2 Integration Testing

| Scenario | Test Approach |
|----------|---------------|
| Dashboard with filter | React Testing Library: render FADashboard, toggle filter, verify artifacts |
| localStorage persistence | Mock localStorage, verify read/write calls |
| Error handling | Mock localStorage.setItem to throw, verify graceful degradation |

### 6.3 E2E Testing

| Scenario | Test Approach |
|----------|---------------|
| Full user flow | Playwright/Cypress: navigate → toggle → reload → verify persistence |
| Cross-browser | Test on Chrome, Firefox, Safari, Edge |

---

## 7. Migration & Rollback

### 7.1 Migration

No migration required — new feature, no existing data to migrate.

### 7.2 Rollback

If rollback needed:
1. Revert component changes (FADashboard.tsx, BADashboard.tsx)
2. Remove new files (constants, utils, hooks)
3. localStorage keys can remain (harmless, will be ignored)

---

## 8. Security Considerations

| Concern | Assessment | Mitigation |
|---------|------------|------------|
| localStorage data sensitivity | Low risk — only stores boolean preference | No sensitive data stored |
| XSS via localStorage | Low risk — no user input stored | Values are hardcoded strings ("true"/"false") |
| Cross-origin access | N/A — localStorage is origin-scoped | Browser enforces same-origin policy |

---

## 9. Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | SA | ✅ Proposed | 2026-01-17 |
| Tech Lead | {TBD} | ⏳ Pending | — |
| FA (behavior affected) | FA | ⏳ Pending | — |

---

## 10. Sources Consulted

- [ta-TSV-001-react-browser-frontend.md](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) → Decision section (frontend stack)
- [fi-TSV-007-dashboard-filtering-ordering.md](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) → Implementation notes (code structure)
- [epic-TSV-007-dashboard-filtering-ordering.md](../epics/epic-TSV-007-dashboard-filtering-ordering.md) → Technical considerations
- templates/tai-template.md → Document structure

---

## 11. Unresolved Items

- [ ] **Tech Lead Review**: Architecture patterns need review before implementation
- [ ] **Testing Framework**: Confirm Jest + React Testing Library available in project
- [ ] **localStorage Key Naming**: Final decision on key format (`tsv_showCompleted_FA` vs alternatives)
- [ ] **Visual Grouping**: Section headers vs inline badges — design decision needed

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | SA | Proposed | Initial TAI for dashboard filtering and ordering architecture |
