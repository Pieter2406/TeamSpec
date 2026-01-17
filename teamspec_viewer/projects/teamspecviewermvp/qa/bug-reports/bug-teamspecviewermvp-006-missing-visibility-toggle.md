---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Missing visibility toggle control"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-006"
filename_pattern: "bug-teamspecviewermvp-006-missing-visibility-toggle.md"

# === Required Relationships ===
links_required:
  - type: project
    pattern: "project.yml"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - defect
  - issue
  - filter toggle
  - visibility control
  - done artifacts
aliases:
  - defect report
  - issue report
anti_keywords:
  - feature request
  - enhancement
  - story
---

# Bug Report: `bug-teamspecviewermvp-006-missing-visibility-toggle`

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-006 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Dev |
| **Version** | Current dev build |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |

---

## Description

Done stories are being filtered out (hidden) from the dashboard view, but there is no visible toggle control that allows users to show/hide completed artifacts. This makes it impossible for users to view completed work or control the filtering behavior.

---

## Steps to Reproduce

1. Open the FA dashboard in the viewer
2. Navigate to Stories section
3. Observe that stories marked as "done" are not visible
4. Look for a "Show Completed Artifacts" toggle or filter control
5. Observe that no such control exists in the UI

---

## Expected Result

**Feature Canon Reference:** [fi-TSV-007-dashboard-filtering-ordering.md](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md), Section: 3.1.1 Artifact Visibility Toggle

Per fi-TSV-007 Section 3.1.1:

- A **filter control** labeled "Show Completed Artifacts" (checkbox or toggle button) should be visible on the dashboard
- **Default State**: Checked (all artifacts visible including done/terminal states)
- **When Unchecked**: Terminal states (done, retired, out-of-scope, deferred) are hidden
- Users can toggle this control to show/hide completed artifacts
- Filter state persists in localStorage

**Acceptance Criteria AC-1:** "Visibility toggle exists"

---

## Actual Result

- Done stories are already filtered/hidden (terminal states not shown)
- No toggle control is visible anywhere on the dashboard
- Users cannot show completed artifacts
- The filtering behavior appears to be hardcoded to hide done items without user control

---

## Evidence

- [ ] Screenshot attached (pending)
- [ ] Console logs attached (N/A)
- [ ] Network trace attached (N/A)

---

## Bug Classification (MANDATORY)

### [X] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

- **Evidence:** fi-TSV-007 Section 3.1.1 specifies "The dashboard displays a **filter control** that allows users to toggle visibility" and AC-1 requires "Visibility toggle exists". The filtering logic may be partially implemented (hiding done items), but the user-facing toggle control required by the Feature-Increment is missing.
- **Fix:** DEV implements the toggle control component as specified in fi-TSV-007
- **Canon Update:** Not required

---

### [ ] Feature Canon Wrong

**Definition:** Feature Canon doesn't match actual business intent.

(Not selected - the FI specification is correct; the implementation is incomplete)

---

### [ ] Undocumented Behavior

**Definition:** Neither code nor Feature Canon covers this case.

(Not selected - the behavior is documented in fi-TSV-007)

---

## Classification Decision Tree

```
Is the behavior documented in Feature Canon?
├── YES → Does code match Canon?
│   ├── YES → Not a bug
│   └── NO → "Implementation Defect" ← THIS BUG
└── NO → "Undocumented Behavior"
```

---

## Resolution Actions

| Classification | Who Fixes | Action |
|----------------|-----------|--------|
| Implementation Defect | DEV | Implement "Show Completed Artifacts" toggle control per fi-TSV-007 Section 3.1.1 |

---

## Impact Analysis

**User Impact:**
- **Severity: High** - Users cannot view completed work in the dashboard
- Users cannot control filtering behavior
- Violates AC-1 of fi-TSV-007

**Business Impact:**
- **Medium** - Reduces dashboard usability; users may need to access filesystem directly to see done artifacts
- Blocks testing of AC-1, AC-2, AC-3 from tc-fi-TSV-007

---

## Suggested Fix

Implement the toggle control as specified in fi-TSV-007:

1. Add a checkbox/toggle button labeled "Show Completed Artifacts" to dashboard header/toolbar
2. Default state: checked (show all artifacts)
3. Wire toggle to filter logic that hides/shows terminal states (done, retired, out-of-scope, deferred)
4. Persist toggle state to localStorage
5. Apply filter across all artifact types (Features, FIs, Epics, Stories, BA artifacts)

**Reference Implementation Notes:** See fi-TSV-007 Section 6.3 for suggested code structure.

---

## Related Artifacts

- **Feature-Increment:** [fi-TSV-007-dashboard-filtering-ordering.md](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Test Cases:** [tc-fi-TSV-007-dashboard-filtering-ordering.md](../test-cases/tc-fi-TSV-007-dashboard-filtering-ordering.md) - TC-001, TC-002, TC-003
- **Feature:** [f-TSV-002-role-specific-dashboards.md](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)

---

## Assigned To

{TBD} - Awaiting DEV assignment

---

## Resolution

**Date Resolved:** {TBD}  
**Resolved By:** {TBD}  
**Fix Description:** {TBD}  
**Verification:** {TBD}

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | QA | Open | Bug reported; missing toggle control for artifact visibility |
