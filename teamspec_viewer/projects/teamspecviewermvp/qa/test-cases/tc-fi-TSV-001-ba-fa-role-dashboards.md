---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "BA and FA Dashboard Navigation"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-001"
filename_pattern: "tc-fi-TSV-001-ba-fa-role-dashboards.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-001"
    optional: false
  - type: feature
    pattern: "f-TSV-002"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - role dashboard
  - navigation
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-001-ba-fa-role-dashboards

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-001 — BA/FA Role Dashboards](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)  
**Feature:** [f-TSV-002 — Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-001 |
| **Feature Increment** | [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) |
| **Feature** | [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: BA role dashboard shows BA artifacts

- **Type**: Positive
- **Feature Reference**: [fi-TSV-001: TO-BE Behavior](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)
- **Acceptance Criteria**: AC-1
- **Pre-conditions**: `teamspec-viewer` product and `teamspecviewermvp` project available; BA and BAI artifacts present.
- **Steps**:
  1. Open viewer landing page.
  2. Select **BA** in role selection.
  3. Observe displayed dashboard cards/sections.
  4. Select a BA artifact entry.
- **Expected Result**: BA dashboard lists BA documents and BA increments scoped to the current product/project; selecting an entry opens artifact in reader.
- **Test Data**: BA/BAI files in repository.
- **Automation**: Manual (E2E later).

### TC-002: FA role dashboard shows FA artifacts

- **Type**: Positive
- **Feature Reference**: [fi-TSV-001: TO-BE Behavior](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)
- **Acceptance Criteria**: AC-2
- **Pre-conditions**: `teamspec-viewer` product and `teamspecviewermvp` project available; Feature, FI, Epic, Story artifacts present.
- **Steps**:
  1. Open viewer landing page.
  2. Select **FA** in role selection.
  3. Observe displayed dashboard cards/sections.
  4. Select a Feature-Increment entry and an Epic entry.
- **Expected Result**: FA dashboard lists features, feature-increments, epics, and stories for the active product/project; selecting entries opens artifacts in reader.
- **Test Data**: Feature, FI, Epic, Story files in repository.
- **Automation**: Manual (E2E later).

### TC-003: Dashboard is read-only

- **Type**: Negative
- **Feature Reference**: [fi-TSV-001: TO-BE Behavior](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)
- **Acceptance Criteria**: AC-3
- **Pre-conditions**: Role dashboard rendered for BA or FA.
- **Steps**:
  1. Attempt to edit an artifact from dashboard (e.g., look for edit buttons, inline editors).
  2. Try context menu or keyboard shortcuts for edit/save.
- **Expected Result**: No edit capabilities are available; dashboard only provides navigation links.
- **Test Data**: N/A.
- **Automation**: Manual.

### TC-004: `{TBD}` markers highlighted and navigable

- **Type**: Positive / Boundary
- **Feature Reference**: [fi-TSV-001: TO-BE Behavior](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)
- **Acceptance Criteria**: AC-4
- **Pre-conditions**: Artifact with `{TBD}` markers exists and is opened from dashboard.
- **Steps**:
  1. Open FA dashboard and navigate to an artifact containing `{TBD}`.
  2. Observe rendered content for highlight indicators.
  3. Use provided navigation (next/previous) between `{TBD}` occurrences.
- **Expected Result**: `{TBD}` markers are visually highlighted; navigation between markers works within the artifact.
- **Test Data**: Artifact containing `{TBD}` markers.
- **Automation**: Manual.

### TC-005: Role switching within a session

- **Type**: Positive
- **Feature Reference**: [fi-TSV-001: TO-BE Behavior](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md)
- **Acceptance Criteria**: AC-1, AC-2
- **Pre-conditions**: Session active with one role selected.
- **Steps**:
  1. From FA dashboard, select role switch control.
  2. Switch to BA role.
  3. Switch back to FA role.
- **Expected Result**: Role switching works without page reload; selected role is clearly visible; dashboards render respective artifacts after each switch.
- **Test Data**: N/A.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | BA role navigation to BA artifacts | TC-001, TC-005 | [ ] |
| AC-2 | FA role navigation to FA artifacts | TC-002, TC-005 | [ ] |
| AC-3 | Dashboard is read-only | TC-003 | [ ] |
| AC-4 | `{TBD}` markers highlighted + navigable | TC-004 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| Role switch mid-session | Dashboard updates to selected role without stale data | TC-005 | [ ] |
| Artifact missing `{TBD}` markers | No highlight/navigation shown | TC-004 | [ ] |

---

## Feature Alignment Validation

- [ ] All tests reference Feature Increment or Feature Canon behavior
- [ ] All acceptance criteria are covered
- [ ] No tests for undocumented behavior
- [ ] Feature-Increment is current (no pending updates)
- [ ] Feature Canon is reviewed for conflicts

---

## Test Execution Results

| Date | Tester | Environment | Pass | Fail | Blocked | Notes |
|------|--------|-------------|------|------|---------|-------|
| YYYY-MM-DD | [Name] | [Env] | {N} | {N} | {N} | |

---

## Issues Logged

| Issue ID | Description | Severity | Status | Owner |
|----------|-------------|----------|--------|-------|
| BUG-XXX | [Issue] | P1/P2/P3 | Open | [Owner] |

---

## Test Sign-Off

This test pack validates:

1. ✅ Feature-Increment acceptance criteria are met
2. ✅ Documented behavior works correctly
3. ✅ Edge cases are handled properly

**QA Approved:** [ ] Yes  
**QA Name:** ________________  
**Date:** ________________  
**Sprint:** ________________

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | QA | Initial test cases |
