---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Feature state tag in sidebar doesn't update reactively when state changes"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-003"
filename_pattern: "bug-teamspecviewermvp-003-sidebar-state-tag-reactivity.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - reactivity
  - state
  - sidebar
  - state tag
  - real-time update
  - feature state
aliases:
  - state update lag
  - sidebar state sync
  - feature state reactivity
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-003-sidebar-state-tag-reactivity`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Investigated → Resolved → Closed

---

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | bug-teamspecviewermvp-003 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Development |
| **Component** | Frontend - Sidebar, Feature State Tag, React State Management |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |
| **Affects Features** | f-TSV-002 (Role-Specific Dashboards) |

---

## Bug Classification

### Bug Type (REQUIRED - exactly one)

- [x] **Implementation Defect** — Code doesn't match Canon
- [ ] **Undocumented Behavior** — Not specified anywhere
- [ ] Canon Wrong — Canon doesn't match intent

### Classification Rationale

**Feature Canon:** [f-TSV-002 Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) specifies that the dashboard provides "quick navigation" with feature cards and artifact trees. The feature requires users to view and manage feature state (status) from the dashboard. An implicit requirement of any dashboard is that displayed information updates in real-time (or at least immediately) when changes are made.

**Current State:** When a user changes a feature's state (e.g., from "draft" to "active" or "ready") through an edit dialog or action, the sidebar state tag remains unchanged. The old state persists in the sidebar until the user manually reloads the page, at which point the sidebar reflects the new state.

**Implementation Defect:** The code fails to implement proper state reactivity. This is a synchronization issue between:
- The backend API (which correctly updates and returns new state)
- The frontend component state (which doesn't update after the API call succeeds)
- The sidebar display (which relies on stale component state)

---

## Description

### Expected Behavior

When a user changes a feature's state (status badge/tag) through any mechanism (edit dialog, action menu, etc.):

1. **Immediate Update**: The sidebar state tag should update immediately to reflect the new state
2. **No Reload Required**: The user should NOT need to refresh the page to see the new state
3. **Live Sync**: The sidebar component should be subscribed to state changes and re-render as soon as the backend confirms the update
4. **Visual Feedback**: The state change should be visually noticeable (slight highlight, animation, or immediate color change)

**Related Feature Requirement:**
> From [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md): "Dashboard provides quick navigation with real-time artifact feedback"

The phrase "real-time artifact feedback" implies that artifact information (including state) should update in real-time without page reload.

### Actual Behavior

**Reproduction Steps:**

1. Open FA Dashboard (as Functional Analyst role)
2. Locate a Feature card in the sidebar with a visible state tag (e.g., "draft", "active")
3. Click on the Feature card to open its details
4. Change the feature's state (e.g., edit the YAML frontmatter or use a state change action)
5. Confirm the state change and close the edit dialog
6. **Expected**: Sidebar state tag immediately shows new state
7. **Actual**: Sidebar state tag still shows old state (stale data)
8. **Workaround**: Manually reload the page (F5 or Ctrl+R) — sidebar now shows correct new state

**Current Behavior Details:**
- State change is successfully persisted to the backend (API call succeeds, file is updated)
- Backend returns the updated feature data with new state
- Frontend receives the response but doesn't update the sidebar component state
- Sidebar continues displaying the old state until page reload forces a fresh data fetch

### Impact on User Experience

1. **Confusion**: User makes a state change, looks at sidebar, and thinks the change didn't work
2. **Double Work**: User may attempt to change the state again because they don't see the update
3. **Inefficiency**: User forced to reload page to verify state changes, breaking workflow
4. **Data Integrity Doubt**: User may question whether changes are being saved
5. **Poor Feature Quality**: The "real-time artifact feedback" promise is broken

---

## Root Cause Analysis

### Likely Root Causes

**Hypothesis 1: Missing State Update After API Call (MOST LIKELY)**

The feature edit/update flow:
1. User modifies feature state in edit dialog
2. Frontend calls API: `PATCH /api/features/{id}` with new state
3. Backend updates file and returns `{ ...feature, state: "new_state" }`
4. **MISSING**: Frontend doesn't call `setState()` or refresh the features list after receiving response
5. Component re-renders with old state still in React state hook
6. Sidebar displays stale data

**Code Pattern (likely issue):**
```tsx
// BAD: API call succeeds but component state not updated
const updateFeatureState = async (featureId, newState) => {
    try {
        const response = await fetch(`/api/features/${featureId}`, {
            method: 'PATCH',
            body: JSON.stringify({ state: newState })
        });
        const updatedFeature = await response.json();
        // ❌ MISSING: setFeatures([...features.map(f => 
        //    f.id === featureId ? updatedFeature : f)])
        // ❌ MISSING: Close dialog and let component re-render with new data
        console.log('Feature updated:', updatedFeature); // Just logs, doesn't update state
    } catch (error) {
        console.error('Update failed:', error);
    }
};
```

**Hypothesis 2: Parent/Child Component State Sync Issue**

- Sidebar component receives features list as props from parent Dashboard component
- When child (Feature card/detail view) updates state, parent Dashboard component doesn't know to refresh
- Sidebar still displays props from old features list
- Parent never calls `setFeatures()` to trigger re-render

**Hypothesis 3: Wrong Data Source in Sidebar**

- Sidebar might be displaying state from a different source (local variable, cache, stale state variable)
- While API and detail view use a different, updated source
- Multiple sources of truth for the same data

---

## Evidence / Investigation Needed

**To Confirm Root Cause, Check:**

1. **Frontend API Response Handling:**
   - In the update feature handler, does it update React state after receiving the response?
   - Does it call `setFeatures()` with the updated feature?
   - Does it invalidate any caches (React Query, SWR, etc.)?

2. **Component Data Flow:**
   - How does Sidebar get feature data? (props from parent, context, API call, Redux, etc.)
   - How does the detail view/edit dialog get feature data? (same source or different?)
   - Are they using the same state management or different instances?

3. **State Management Pattern:**
   - Is the app using React hooks (useState), Redux, Zustand, Context API, or another pattern?
   - Is there a single source of truth for features list?
   - How is that source updated when an API call succeeds?

**Files to Investigate:**
- `frontend/src/components/FeatureCard.tsx` — Sidebar feature display
- `frontend/src/components/FADashboard.tsx` — Parent dashboard component
- `frontend/src/pages/FeatureDetailPage.tsx` or similar — Feature edit/detail view
- `frontend/src/hooks/useFeatures.ts` or similar — Data fetching/state management
- `frontend/src/api/` — API call functions
- Backend API response structure: `backend/src/routes/features.ts` (PATCH endpoint)

---

## Testing Required

- [ ] **Unit Test**: Update feature state through API, verify sidebar reflects change
- [ ] **Integration Test**: Edit feature in detail view, verify sidebar updates immediately
- [ ] **E2E Test**: User workflow: open dashboard → change feature state → verify sidebar updates
- [ ] **Reactivity Test**: Multiple rapid state changes → sidebar keeps pace with updates
- [ ] **No Regression**: Other sidebar features work correctly (expand/collapse, navigation, etc.)
- [ ] **Performance**: State updates don't cause lag or unnecessary re-renders

---

## Acceptance Criteria for Fix

- [ ] Feature state tag in sidebar updates immediately after state change via API
- [ ] No page reload required to see updated state
- [ ] Sidebar stays in sync with backend data source
- [ ] Works for all feature state values (draft, active, ready, deprecated, etc.)
- [ ] Works across multiple dashboards/tabs if feature is open in multiple places
- [ ] No excessive API calls or performance degradation
- [ ] Visual feedback confirms state update (optional: highlight/animation)
- [ ] All existing tests pass, new test added for state reactivity

---

## Proposed Resolution Path

### Step 1: Identify State Management Pattern
- Confirm how features list is managed (useState, Redux, Context, custom hook, etc.)
- Verify there's a single source of truth for features across sidebar and detail view

### Step 2: Trace API Response Handling
- Locate the feature update handler in frontend
- Verify it properly updates the React state after API success
- Ensure it calls `setFeatures()` or equivalent with updated data

### Step 3: Implement State Update
**Example Fix (using useState):**
```tsx
const [features, setFeatures] = useState([]);

const updateFeatureState = async (featureId, newState) => {
    try {
        const response = await fetch(`/api/features/${featureId}`, {
            method: 'PATCH',
            body: JSON.stringify({ state: newState })
        });
        const updatedFeature = await response.json();
        
        // ✅ FIX: Update React state with new feature data
        setFeatures(prevFeatures =>
            prevFeatures.map(f =>
                f.id === featureId ? updatedFeature : f
            )
        );
        
        // Optionally show success toast
        showSuccessMessage(`Feature state updated to: ${newState}`);
    } catch (error) {
        showErrorMessage('Failed to update feature state');
        console.error('Update failed:', error);
    }
};
```

**Example Fix (using React Query):**
```tsx
const { data: features, refetch } = useQuery('features', fetchFeatures);

const mutation = useMutation(updateFeatureState, {
    onSuccess: (updatedFeature) => {
        // ✅ FIX: Invalidate cache to trigger refetch
        queryClient.setQueryData('features', 
            features.map(f => 
                f.id === updatedFeature.id ? updatedFeature : f
            )
        );
    }
});
```

### Step 4: Test State Reactivity
- Verify sidebar updates immediately after state change
- Test with multiple rapid changes
- Verify no page reload needed

### Step 5: Consider Enhancements (Optional)
- Add visual feedback (highlight, animation) when state updates
- Add optimistic updates (show change immediately, rollback if API fails)
- Consider using WebSocket or Server-Sent Events for real-time updates across multiple sessions

---

## Implementation Details for DEV

**Priority Files to Review:**
1. Feature update endpoint: `backend/src/routes/features.ts` (PATCH method)
   - Verify it returns complete updated feature object with new state
   
2. Frontend API client: `frontend/src/api/features.ts` or similar
   - Verify updateFeature() function properly handles response
   
3. State management: `frontend/src/hooks/useFeatures.ts` or Dashboard component
   - Verify setFeatures() is called after API success
   
4. Sidebar component: `frontend/src/components/FeatureCard.tsx`
   - Verify it reads from current state, not stale data

**Code Review Checklist:**
- [ ] API response includes complete, updated feature object
- [ ] Frontend call to updateFeature() is awaited and response is handled
- [ ] Response triggers setState() or cache invalidation
- [ ] Sidebar component re-renders with updated feature data
- [ ] No stale closures or multiple state sources
- [ ] Consider edge cases: concurrent updates, offline scenarios, etc.

---

## Severity & Priority Justification

**Severity: HIGH**
- Core dashboard functionality broken (real-time updates not working)
- User-facing impact (confusing UX, requires manual workaround)
- Affects primary workflow (managing feature state)

**Priority: P1**
- Blocks effective use of the dashboard
- Undermines user confidence in the application
- Should be fixed before next release

---

## Related Issues & Patterns

**Similar Issues to Check For:**
- Do other editable artifacts (epics, stories, business analysis docs) have the same reactivity issue?
- Are there other components that edit data and rely on sidebar updates?
- Check if this is a pattern throughout the application or isolated to features

**Design Pattern Recommendation:**
- Establish a clear pattern for state management (single source of truth)
- Use a state management library (Redux, Zustand, Jotai) if not already in use
- Document how to properly handle API responses and state updates
- Consider using React Query or SWR for automatic cache management

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | QA | Open | Initial bug report - awaiting investigation and implementation |
