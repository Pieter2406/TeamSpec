---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: Enable status updates across all role dashboards
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e009-007
filename_pattern: s-e009-007-enable-status-updates.md
links_required:
  - type: epic
    pattern: epic-TSV-009
    optional: false
    note: Epic ID embedded in filename (e009)
  - type: feature-increment
    pattern: fi-TSV-009
    optional: false
    note: Extends role dashboard functionality
keywords:
  - user story
  - status update
  - DEV dashboard
  - SA dashboard
  - QA dashboard
  - BA dashboard
  - status dropdown
  - artifact status
aliases:
  - status update story
  - enable status changes
anti_keywords:
  - full behavior
  - production truth
  - canon
status: Done
---

# Story: `s-e009-007-enable-status-updates`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-007 |
| **Epic** | epic-TSV-009 |
| **Status** | Done|
| **Estimate** | 5 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)

---

## User Story

**As a** TeamSpec user working in DEV, SA, QA, or BA role dashboards  
**I want to** update artifact status directly from the tree view  
**So that** I can manage artifact states without leaving my role-specific dashboard

---

## Linked Epic

**Epic:** [epic-TSV-009-dev-sa-qa-dashboards](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md)

This story contributes to the DEV/SA/QA dashboards epic by adding status update capability to match the FA dashboard experience.

---

## Feature Impact

**Feature Increment:** [fi-TSV-009-dev-sa-qa-role-dashboards](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md)

### AS-IS (Current State)

**Status Updates in FA Dashboard:**
- FA dashboard (ArtifactTree) has full status update functionality
- Users can click status dropdown to change artifact status
- Status changes are persisted via API call to backend
- Optimistic updates with rollback on error
- Loading indicator shows during update

**Status Updates in Other Dashboards:**
- DEVTree component has disabled status dropdowns (`onStatusChange={() => {}}`)
- SATree component has disabled status dropdowns (`onStatusChange={() => {}}`)
- QATree component has disabled status dropdowns (`onStatusChange={() => {}}`)
- BATree component has functional status updates (implemented separately)
- Users see status but cannot change it from these dashboards

### TO-BE (Proposed Change)

**Unified Status Update Experience:**
- All role dashboards (DEV, SA, QA, BA) support status updates in tree views
- Users can click status dropdown in any tree view to change artifact status
- Status changes persist via existing backend API (`PATCH /api/artifacts/status`)
- Consistent UX across all dashboards:
  - Optimistic UI updates
  - Loading indicator during API call
  - Error handling with rollback
  - Success toast notification
  - Parent component refresh to sync state

**Components Affected:**
- `DEVTree.tsx` - Add handleStatusChange implementation
- `SATree.tsx` - Add handleStatusChange implementation
- `QATree.tsx` - Add handleStatusChange implementation
- `BATree.tsx` - Keep existing implementation (already functional)
- `ArtifactTree.tsx` - Keep existing implementation (already functional)

---

## Acceptance Criteria

### AC-1: DEV Dashboard Status Updates
- [ ] User can select epic in DEV dashboard
- [ ] User can change status of stories in tree view
- [ ] User can change status of dev plans in tree view
- [ ] Status change persists to backend
- [ ] Tree view refreshes to show updated status
- [ ] Error toast shown if update fails

### AC-2: SA Dashboard Status Updates
- [ ] User can select SD or TA in SA dashboard
- [ ] User can change status of SD increments in tree view
- [ ] User can change status of TA increments in tree view
- [ ] Status change persists to backend
- [ ] Tree view refreshes to show updated status
- [ ] Error toast shown if update fails

### AC-3: QA Dashboard Status Updates
- [ ] User can select Feature-Increment or Feature in QA dashboard
- [ ] User can change status of test cases in tree view (FI tab)
- [ ] User can change status of regression tests in tree view (Feature tab)
- [ ] Status change persists to backend
- [ ] Tree view refreshes to show updated status
- [ ] Error toast shown if update fails

### AC-4: BA Dashboard Status Updates
- [ ] BA dashboard status updates continue to work (no regression)
- [ ] User can change status of BA increments in tree view
- [ ] Existing functionality preserved

### AC-5: Consistent UX Across Dashboards
- [ ] All dashboards show loading spinner during status update
- [ ] All dashboards perform optimistic UI update
- [ ] All dashboards rollback on error
- [ ] All dashboards show toast notification on error
- [ ] Status dropdown disabled state consistent (disabled for terminal states)

### AC-6: Error Handling
- [ ] Network errors show appropriate error message
- [ ] 404 errors (artifact not found) show specific message
- [ ] 500 errors (server error) show specific message
- [ ] Status rolls back to original value on error
- [ ] Multiple rapid status changes handled gracefully

---

## Technical Notes

### Current Implementation Pattern

The FA dashboard's `ArtifactTree.tsx` has the reference implementation:

```typescript
const handleStatusChange = useCallback(async (
    path: string,
    _artifactType: string,
    currentStatus: string,
    newStatus: string
) => {
    // Optimistic update
    setStatusStates(prev => ({
        ...prev,
        [path]: { status: newStatus, loading: true },
    }));

    try {
        const result = await updateArtifactStatus(path, newStatus);
        if (result.success) {
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: newStatus, loading: false },
            }));
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } else {
            // Rollback on error
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: currentStatus, loading: false },
            }));
            showError(result.error || 'Failed to update status');
        }
    } catch (err) {
        // Rollback on network error
        setStatusStates(prev => ({
            ...prev,
            [path]: { status: currentStatus, loading: false },
        }));
        showError('Network error: Failed to update status');
    }
}, [showError]);
```

### Implementation Approach

1. **Copy Pattern from ArtifactTree.tsx:**
   - Each tree component needs:
     - `statusStates` state map (path → {status, loading})
     - `handleStatusChange` callback with optimistic updates
     - `getEffectiveStatus` helper
     - `isStatusLoading` helper

2. **Wire StatusDropdown Component:**
   - Replace `onStatusChange={() => {}}` with `onStatusChange={(newStatus) => handleStatusChange(...)}`
   - Pass current artifact path, type, and status
   - Pass effective status (from state map or original)
   - Pass loading state to disable dropdown during update

3. **Add Refresh Callback:**
   - Each dashboard needs to pass `onStatusUpdate` callback to tree component
   - Callback should refresh artifact list in parent dashboard
   - Ensures consistency between card list and tree view

4. **Testing Scenarios:**
   - Happy path: status update succeeds
   - Error path: API returns error
   - Network error: fetch throws exception
   - Multiple artifacts: status states don't interfere
   - Rapid changes: debouncing not needed (dropdown disabled during update)

### API Contract

The backend already supports status updates via:
- **Endpoint:** `PATCH /api/artifacts/status`
- **Body:** `{ path: string, status: string }`
- **Response:** `{ success: boolean, error?: string, path: string, newStatus: string }`

No backend changes required.

---

## Dependencies

### Blockers
- None (API already exists, pattern proven in ArtifactTree)

### Related Stories
- s-e006-004 - ArtifactTree status integration (reference implementation)
- s-e006-005 - BATree status integration (reference implementation)
- s-e009-002 - DEV dashboard navigation (component to modify)
- s-e009-003 - SA dashboard navigation (component to modify)
- s-e009-004 - QA dashboard navigation (component to modify)

---

## UX & Copy

### Status Dropdown Behavior
- **Enabled states:** Draft, Proposed, In Progress, Under Review, etc.
- **Disabled states:** Done, Deferred, Out-of-Scope, Removed (terminal states)
- **Loading state:** Dropdown disabled, loading spinner shown
- **Error state:** Status reverts, error toast shown

### Toast Messages
- **Success:** (No toast, silent success with UI update)
- **Error:** "Failed to update status: [error message]"
- **Network error:** "Network error: Failed to update status"

---

## Out of Scope

- Adding new status options (use existing status vocabulary)
- Batch status updates (update one artifact at a time)
- Status history tracking (no audit trail in this story)
- Status validation rules (backend validates, frontend accepts API response)
- Keyboard shortcuts for status changes
- Undo/redo functionality

---

## Definition of Ready Checklist

- [x] Story follows delta format (describes change, not full behavior)
- [x] Linked to Epic via filename (`s-e009-007`)
- [x] Feature Impact section references FI with AS-IS/TO-BE
- [x] All Acceptance Criteria are testable
- [x] Technical Notes provide implementation guidance
- [x] Dependencies identified
- [x] Out of Scope defined
- [x] No TBD/placeholder content
- [x] Estimate assigned (5 points)

---

## Notes

### Why This Story Matters

Currently, users in DEV, SA, and QA roles cannot update artifact status from their dashboards, forcing them to:
- Switch to FA dashboard
- Navigate file system directly
- Edit files manually

This creates friction and reduces the utility of role-specific dashboards. By enabling status updates across all dashboards, we provide a consistent UX and improve productivity for all team members.

### Pattern Reuse

This story leverages the existing, proven implementation from ArtifactTree.tsx and BATree.tsx. The pattern has been validated in production with FA and BA users, so we're extending a known-good solution rather than inventing new UX.

### Risk Assessment

**Low Risk:**
- Pattern is proven in FA/BA dashboards
- Backend API already exists and is stable
- No schema changes required
- No new dependencies
- Isolated to tree components (no cross-cutting concerns)

---

**Status:** Backlog → Ready for Refinement

_Created: 2026-01-18_  
_Last Updated: 2026-01-18_  
_Author: FA_
