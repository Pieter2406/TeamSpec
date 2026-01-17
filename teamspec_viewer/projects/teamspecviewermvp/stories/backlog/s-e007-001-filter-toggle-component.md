---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Implement artifact visibility filter toggle"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e007-001"
filename_pattern: "s-e007-001-filter-toggle-component.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-007"
    optional: false
    note: "Epic ID embedded in filename (e007)"
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false
    note: "Implements artifact visibility toggle from FI"

# === Search Optimization ===
keywords:
  - filter toggle
  - visibility control
  - completed artifacts
  - user story
  - dashboard enhancement
aliases:
  - show/hide filter
  - completed artifacts toggle
anti_keywords:
  - full behavior
  - implementation detail
  - code

---

# Story: `s-e007-001-filter-toggle-component`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e007-001 |
| **Epic** | epic-TSV-007 |
| **Feature-Increment** | fi-TSV-007 |
| **Status** | Backlog |
| **Estimate** | 3 pts |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canvas)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** TeamSpec user (FA, BA, Developer),  
**I want** to toggle visibility of completed artifacts on the dashboard,  
**So that** I can focus on active work without visual clutter from finished items.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-007](../epics/epic-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering (Section 3.1.1) |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Dashboard Display

Currently, the Role-Specific Dashboard displays all artifacts owned by the user's role, regardless of their state. Users see a flat list that includes active items (draft, active, ready) mixed with completed items (done, retired, deferred). There is no filtering mechanism to hide or show artifacts based on state.

### TO-BE (new behavior)

The Role-Specific Dashboard displays a **filter toggle control** labeled "Show Completed Artifacts" that allows users to:

1. **Toggle Visibility**: Click/tap to toggle between showing and hiding artifacts in terminal states
2. **Default Behavior**: All artifacts shown by default (filter toggle is checked)
3. **Filtered View**: When unchecked, artifacts with terminal states (done, retired, out-of-scope, deferred, archived) are hidden from the dashboard
4. **Active States Remain**: Artifacts with active states (draft, active, ready, in-progress, proposed, pending, on-hold) always remain visible
5. **Control Placement**: Filter toggle appears at the top of the artifact list, before the list begins

---

## Acceptance Criteria

### Functional

- [ ] **Component Exists**: Dashboard displays "Show Completed Artifacts" toggle control (checkbox or toggle button)
- [ ] **Toggle Functional**: Clicking toggle changes the visual state (checked/unchecked)
- [ ] **Default State**: Toggle is checked by default (all artifacts visible initially)
- [ ] **Filter Applied Immediately**: Artifacts hide/show immediately when toggle changes (no page reload needed)
- [ ] **Correct Terminal States Hidden**: When toggled off, all artifacts with states [done, retired, out-of-scope, deferred, archived] are hidden
- [ ] **Active States Visible**: When toggled off, all artifacts with states [draft, active, ready, in-progress, proposed, pending, on-hold] remain visible
- [ ] **Works on All Dashboard Types**: Filter works on both FA Dashboard and BA Dashboard
- [ ] **Works for All Artifact Types**: Filter applies to all artifact types listed (Features, Epics, Stories, Feature-Increments, Business Analysis docs, etc.)

### Persistence

- [ ] **Filter State Persists**: Toggle state is saved to browser localStorage
- [ ] **Persistence Key**: Uses a unique key per dashboard/role (e.g., `showCompleted_FA` or `showCompleted_BA`)
- [ ] **Survives Page Reload**: Filter state survives browser page refresh (F5)
- [ ] **Survives Browser Close**: Filter state persists across browser sessions

### Usability

- [ ] **Clear Label**: Label text is clear and understandable ("Show Completed Artifacts")
- [ ] **Tooltip/Help**: Hover tooltip explains which states are considered "completed" (done, retired, deferred, out-of-scope, archived)
- [ ] **Visual Feedback**: Toggle shows clear checked/unchecked state
- [ ] **Placement**: Toggle appears prominently at top of artifact list, not buried in menu or hidden

### Accessibility

- [ ] **Keyboard Accessible**: Toggle can be activated via Tab and Space/Enter keys
- [ ] **Screen Reader Announced**: Toggle label is announced by screen readers with proper ARIA attributes
- [ ] **Focus Visible**: Focus indicator visible when keyboard navigating to toggle
- [ ] **No Color-Only Indication**: Completed state not indicated by color alone; has additional affordance

### Technical

- [ ] **No Performance Regression**: Toggle action triggers filter in <100ms
- [ ] **Mobile Responsive**: Toggle control is visible and functional on mobile/tablet screen sizes
- [ ] **No Blocking**: Filter implementation doesn't block other dashboard functionality

### Testing

- [ ] **Unit Tests**: Tests for toggle state management and localStorage interaction
- [ ] **Component Tests**: Tests for toggle render, click handling, and artifact visibility changes
- [ ] **Integration Tests**: Tests with real dashboard and artifact data
- [ ] **E2E Tests**: User flow: load dashboard → toggle off → artifacts hidden → reload page → toggle state persisted

---

## Definition of Ready (DoR)

Before story enters in-progress:

- [ ] Story linked to epic via filename ✓
- [ ] Feature-Increment exists with AS-IS/TO-BE sections ✓
- [ ] Acceptance Criteria are testable ✓
- [ ] No TBD/placeholder content ✓
- [ ] Estimate assigned (3 pts) ✓
- [ ] Terminal states list confirmed (done, retired, out-of-scope, deferred, archived)
- [ ] Active states list confirmed (draft, active, ready, in-progress, proposed, pending, on-hold)

---

## Definition of Done (DoD)

Before story moves to done:

- [ ] All acceptance criteria verified by QA
- [ ] Code reviewed and merged to main branch
- [ ] Tests passing (unit, component, integration, E2E)
- [ ] Feature-Increment TO-BE section reflects implementation
- [ ] No regression in other dashboard features
- [ ] Ready for deployment

---

## Technical Notes for DEV

### Frontend Components to Update

1. **FADashboard.tsx / BADashboard.tsx**
   - Import filter toggle component (create or use existing MUI Checkbox/Switch)
   - Add state hook for showCompleted: `const [showCompleted, setShowCompleted] = useState(...)`
   - Add localStorage hook to persist state
   - Render toggle control at top of artifact list
   - Pass showCompleted prop to child artifact list component

2. **Create useArtifactFilter Hook** (recommended)
   ```tsx
   const useArtifactFilter = (defaultValue = true) => {
     const [showCompleted, setShowCompleted] = useState(() => {
       const stored = localStorage.getItem('showCompleted');
       return stored !== null ? stored === 'true' : defaultValue;
     });
     
     useEffect(() => {
       localStorage.setItem('showCompleted', showCompleted.toString());
     }, [showCompleted]);
     
     return { showCompleted, setShowCompleted };
   };
   ```

### Code Pattern

```tsx
// In Dashboard component
const { showCompleted, setShowCompleted } = useArtifactFilter();

return (
  <div>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
          />
        }
        label="Show Completed Artifacts"
        title="Show/hide artifacts with states: done, retired, deferred, out-of-scope, archived"
      />
    </Box>
    
    <ArtifactList artifacts={artifacts} showCompleted={showCompleted} />
  </div>
);
```

### Data Requirements

- Artifacts must have accessible `status` field from YAML frontmatter
- Terminal state values: 'done', 'retired', 'out-of-scope', 'deferred', 'archived'
- Implementation independent of how artifacts are fetched (API vs. static data)

---

## UX & Copy

**Toggle Label:** "Show Completed Artifacts"

**Tooltip/Hover Text:** "Toggle to hide/show completed work items (done, retired, deferred, out-of-scope, archived)"

**Alternative Labels (if needed):**
- "Show All Work" / "Show Active Only"
- "Completed Artifacts" (with separate on/off labels)

**Recommendation:** Use "Show Completed Artifacts" for clarity and consistency with state terminology.

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Backlog | Initial story slice from epic-TSV-007; ready for sprint planning |
