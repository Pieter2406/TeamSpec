---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Add localStorage persistence for filter state"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e007-003"
filename_pattern: "s-e007-003-localstorage-persistence.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-007"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false

---

# Story: `s-e007-003-localstorage-persistence`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e007-003 |
| **Epic** | epic-TSV-007 |
| **Feature-Increment** | fi-TSV-007 |
| **Status** | Backlog |
| **Estimate** | 2 pts |
| **Author** | FA |
| **Sprint** | — |
| **Dependency** | s-e007-001 (filter toggle must exist first) |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canvas)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** TeamSpec user,  
**I want** my filter preference to be remembered across browser sessions,  
**So that** when I return to the dashboard, it's already configured the way I prefer without needing to toggle the filter again.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-007](../epics/epic-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering (Section 3.1.1 - Persistence) |

---

## Feature Impact

### Impact Type

- [ ] **Adds Behavior** — New capability not currently in the feature
- [x] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Dashboard Display

The filter toggle (added in story s-e007-001) controls visibility of completed artifacts. Currently, when a user toggles the filter and then reloads the page or closes/reopens the browser, the filter state resets to the default (show all artifacts). The user must re-toggle the filter every time they visit the dashboard.

### TO-BE (new behavior)

When a user toggles the "Show Completed Artifacts" filter, their preference is saved to the browser's localStorage. When they return to the dashboard (even after closing the browser or switching devices with the same browser sync), the filter toggle automatically reflects their saved preference.

The filter state is specific to each role/dashboard:
- FA Dashboard shows/hides completed artifacts based on FA's saved preference
- BA Dashboard shows/hides completed artifacts based on BA's saved preference
- Filter state persists independently per user/dashboard combo

---

## Acceptance Criteria

### Functional

- [ ] **Filter State Saved**: When user toggles filter on/off, state is saved to localStorage
- [ ] **Filter State Restored**: On page reload, filter toggle reflects the saved state (not reset to default)
- [ ] **localStorage Key Unique**: Each dashboard/role has unique localStorage key (e.g., `showCompleted_FA` vs `showCompleted_BA`)
- [ ] **Default When No Saved State**: If no saved preference exists, default to showing all artifacts (filter checked)
- [ ] **Browser Session Survives**: Filter state persists even after closing browser and reopening it
- [ ] **Cross-Tab Sync (Optional)**: If user opens dashboard in multiple tabs, preference is consistent (localStorage automatically syncs)

### Persistence Details

- [ ] **Key Format**: localStorage key clearly identifies dashboard/role (e.g., `tsv_showCompleted_FA` or `showCompleted_BA_dashboard`)
- [ ] **Value Format**: Stored as boolean string (`"true"` or `"false"`) or JSON
- [ ] **No Sensitive Data**: localStorage doesn't store any sensitive information
- [ ] **No Size Issues**: Storage footprint is minimal (<1KB per user)

### Edge Cases

- [ ] **Private/Incognito Mode**: Works gracefully even if localStorage is unavailable (degrades to default behavior)
- [ ] **Cleared Cache**: If user clears browser cache/localStorage, preference resets to default (acceptable)
- [ ] **Multiple Users**: Filter state is per-user (requires user account context to distinguish; otherwise shared per browser)
- [ ] **Browser Compatibility**: Works on all supported browsers (Chrome, Firefox, Safari, Edge)

### Cleanup

- [ ] **No localStorage Pollution**: Doesn't create unnecessary keys or duplicate entries
- [ ] **Migration Path**: If storage format changes in future, migration handled gracefully

### Testing

- [ ] **Unit Tests**: Test localStorage read/write for toggle state
- [ ] **Component Tests**: Test toggle saves state when clicked; restores on mount
- [ ] **Integration Tests**: Test with real dashboard; toggle persists across page reloads
- [ ] **E2E Tests**: Full user flow: toggle off → reload page → verify toggle is off → clear cache → verify toggle is default

---

## Definition of Ready (DoR)

Before story enters in-progress:

- [ ] Story linked to epic via filename ✓
- [ ] Feature-Increment specifies persistence requirement ✓
- [ ] Story s-e007-001 (filter toggle) completed ✓
- [ ] Estimate assigned (2 pts) ✓
- [ ] localStorage key naming strategy decided (e.g., `showCompleted_FA` vs `tsv_showCompleted_FA`)
- [ ] Default behavior confirmed (show all artifacts when no saved preference)

---

## Definition of Done (DoD)

Before story moves to done:

- [ ] All acceptance criteria verified by QA
- [ ] Code reviewed and merged to main branch
- [ ] Tests passing (unit, component, integration, E2E)
- [ ] localStorage correctly saves and restores filter state
- [ ] Handles edge cases (private mode, no localStorage)
- [ ] No regression in filter toggle functionality (story s-e007-001)
- [ ] Ready for deployment

---

## Technical Notes for DEV

### Implementation Approach

Use a custom React hook to encapsulate localStorage logic (already sketched in story s-e007-001):

```typescript
// hooks/useArtifactFilter.ts
import { useState, useEffect } from 'react';

const LOCALSTORAGE_KEY = 'showCompleted_FA'; // Different key for each dashboard role

export const useArtifactFilter = (defaultValue = true) => {
  const [showCompleted, setShowCompleted] = useState(() => {
    // Initialize from localStorage or use default
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_KEY);
      return stored !== null ? stored === 'true' : defaultValue;
    } catch (e) {
      // localStorage unavailable (private mode, etc.)
      console.warn('localStorage unavailable, using default:', e);
      return defaultValue;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, showCompleted.toString());
    } catch (e) {
      // localStorage full or unavailable; fail silently
      console.warn('Failed to save filter state to localStorage:', e);
    }
  }, [showCompleted]);

  return { showCompleted, setShowCompleted };
};
```

### Integration into Dashboard

```tsx
// In FADashboard.tsx
export const FADashboard = () => {
  const { showCompleted, setShowCompleted } = useArtifactFilter();
  
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
      {/* Rest of dashboard uses showCompleted state */}
    </Box>
  );
};
```

### localStorage Key Strategy

**Recommended approach:** Use role-specific keys to allow different roles to have different preferences
- `showCompleted_FA` for FA Dashboard
- `showCompleted_BA` for BA Dashboard

**Alternative:** Use a single domain-wide key if both dashboards should share the same preference
- `tsv_showCompleted` (shared across all dashboards)

**Decision:** Confirm which approach during sprint planning.

### Error Handling

- Gracefully degrade if localStorage unavailable (private browsing mode, storage quota exceeded)
- Log warnings but don't break the app if localStorage write fails
- Always fall back to default behavior

### Browser Compatibility

localStorage is supported in all modern browsers (IE8+). No polyfills needed.

---

## Data Requirements

- User must have some form of user context or session to distinguish preferences per user (if shared browser)
- For MVP, localStorage keys can be role-based (FA, BA) since each role is a distinct view

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Backlog | Initial story slice from epic-TSV-007; dependent on s-e007-001; implements localStorage persistence per fi-TSV-007 |
