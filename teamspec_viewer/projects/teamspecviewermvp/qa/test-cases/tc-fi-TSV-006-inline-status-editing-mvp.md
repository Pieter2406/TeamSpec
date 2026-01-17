---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "Inline Status Editing Tests"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-006"
filename_pattern: "tc-fi-TSV-006-inline-status-editing-mvp.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-006"
    optional: false
  - type: feature
    pattern: "f-TSV-008"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - status editing
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-006-inline-status-editing-mvp

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-006 — Inline Status Editing MVP](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)  
**Feature:** [f-TSV-008 — Inline Status Editing](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-006 |
| **Feature Increment** | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |
| **Feature** | [f-TSV-008](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: Status dropdown opens from chip

- **Type**: Positive
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-1
- **Pre-conditions**: Artifact tree rendered with status chips.
- **Steps**:
  1. Click status chip on a tree node.
- **Expected Result**: Dropdown opens with valid options for that artifact type; current status highlighted.
- **Test Data**: Artifact with status chip.
- **Automation**: Manual.

### TC-002: Selecting status updates via backend

- **Type**: Positive
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-2, AC-3
- **Pre-conditions**: Backend PATCH endpoint available; valid status selected.
- **Steps**:
  1. Open dropdown (TC-001).
  2. Select a valid different status.
- **Expected Result**: Backend called; status chip updates to new value on success; response reflects previous and new status.
- **Test Data**: Valid status per artifact type.
- **Automation**: Manual.

### TC-003: Invalid status rejected with error

- **Type**: Negative
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-4, AC-5
- **Pre-conditions**: Ability to trigger invalid status (e.g., tampered request or mocked option).
- **Steps**:
  1. Attempt to send invalid status value to backend (e.g., via devtools/mock).
- **Expected Result**: Backend rejects with descriptive error message; UI reverts chip to previous status and shows error toast.
- **Test Data**: Invalid status string.
- **Automation**: Manual.

### TC-004: Keyboard navigation in dropdown

- **Type**: Positive
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-6
- **Pre-conditions**: Dropdown open.
- **Steps**:
  1. Use arrow keys to navigate options.
  2. Press Enter to select; press Escape to close.
- **Expected Result**: Keyboard controls navigate options; Enter selects and applies; Escape cancels without change.
- **Test Data**: N/A.
- **Automation**: Manual.

### TC-005: Status options sourced from centralized config

- **Type**: Positive / Structural
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-7
- **Pre-conditions**: Code uses `statusOptions.ts` or equivalent config; inspect options rendered.
- **Steps**:
  1. Compare dropdown options with documented options per artifact type.
- **Expected Result**: Options match centralized configuration values for the artifact type.
- **Test Data**: Artifact of each supported type.
- **Automation**: Manual.

### TC-006: Error handling rollback

- **Type**: Negative
- **Feature Reference**: [fi-TSV-006: TO-BE Behavior](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md)
- **Acceptance Criteria**: AC-5
- **Pre-conditions**: Backend simulated failure (e.g., network error).
- **Steps**:
  1. Trigger status change with backend failure.
- **Expected Result**: Chip reverts to previous status; error toast displayed; no persistent change written.
- **Test Data**: Network/blocking condition.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | Clicking status chip opens dropdown | TC-001 | [ ] |
| AC-2 | Dropdown selection calls backend and updates | TC-002 | [ ] |
| AC-3 | Backend validates status per artifact type | TC-002 | [ ] |
| AC-4 | Invalid status rejected | TC-003 | [ ] |
| AC-5 | UI rollback and error toast on failure | TC-003, TC-006 | [ ] |
| AC-6 | Keyboard navigation supported | TC-004 | [ ] |
| AC-7 | Status options centralized in config | TC-005 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| Artifact without status field | Backend handles missing status gracefully | TC-006 | [ ] |
| Slow backend response | UI shows loading state until completion | TC-002 | [ ] |

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
