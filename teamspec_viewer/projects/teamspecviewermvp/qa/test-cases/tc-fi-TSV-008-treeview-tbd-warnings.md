---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "Treeview TBD Indicator Tests"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-008"
filename_pattern: "tc-fi-TSV-008-treeview-tbd-warnings.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-008"
    optional: false
  - type: feature
    pattern: "f-TSV-002"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - TBD indicator
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-008-treeview-tbd-warnings

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-008 — Treeview TBD Warning Indicators](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)  
**Feature:** [f-TSV-002 — Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-008 |
| **Feature Increment** | [fi-TSV-008](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md) |
| **Feature** | [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: Indicator appears for artifacts with `{TBD}`

- **Type**: Positive
- **Feature Reference**: [fi-TSV-008: TO-BE Behavior](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)
- **Acceptance Criteria**: AC-1, AC-4
- **Pre-conditions**: Artifact containing `{TBD}` markers exists and is listed in dashboard tree.
- **Steps**:
  1. Load dashboard tree.
  2. Locate artifact known to contain `{TBD}`.
- **Expected Result**: Node shows warning icon/badge indicating `{TBD}` presence.
- **Test Data**: Artifact file with `{TBD}` markers.
- **Automation**: Manual.

### TC-002: Tooltip accessibility

- **Type**: Positive / Accessibility
- **Feature Reference**: [fi-TSV-008: TO-BE Behavior](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)
- **Acceptance Criteria**: AC-2
- **Pre-conditions**: Indicator visible.
- **Steps**:
  1. Hover or focus indicator.
  2. Use keyboard to focus node and invoke tooltip.
- **Expected Result**: Tooltip text "Contains TBDs — needs review" appears; readable by screen reader; keyboard focus works.
- **Test Data**: N/A.
- **Automation**: Manual.

### TC-003: Indicator updates when `{TBD}` removed or added

- **Type**: Positive / Dynamic
- **Feature Reference**: [fi-TSV-008: TO-BE Behavior](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)
- **Acceptance Criteria**: AC-3
- **Pre-conditions**: Ability to modify artifact content (simulate file change).
- **Steps**:
  1. Observe indicator for artifact with `{TBD}`.
  2. Remove `{TBD}` markers from file and refresh data.
  3. Add `{TBD}` back and refresh.
- **Expected Result**: Indicator disappears after removal; reappears after adding; no stale flags.
- **Test Data**: Artifact file adjustable between states.
- **Automation**: Manual.

### TC-004: No indicator when no `{TBD}` present

- **Type**: Negative
- **Feature Reference**: [fi-TSV-008: TO-BE Behavior](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)
- **Acceptance Criteria**: AC-4
- **Pre-conditions**: Artifact without `{TBD}` markers.
- **Steps**:
  1. Locate artifact with no `{TBD}`.
- **Expected Result**: No warning icon/badge shown for the node.
- **Test Data**: Clean artifact file.
- **Automation**: Manual.

### TC-005: Applies across artifact types

- **Type**: Positive
- **Feature Reference**: [fi-TSV-008: TO-BE Behavior](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md)
- **Acceptance Criteria**: AC-5
- **Pre-conditions**: BA, FI, Feature, Epic, Story artifacts with `{TBD}` present.
- **Steps**:
  1. Inspect indicators for different artifact types in BA and FA dashboards.
- **Expected Result**: Indicator logic applies consistently to all artifact types rendered in dashboards.
- **Test Data**: Mixed artifact types with `{TBD}` markers.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | Tree nodes show indicator for `{TBD}` | TC-001 | [ ] |
| AC-2 | Tooltip accessible with correct text | TC-002 | [ ] |
| AC-3 | Indicator updates when `{TBD}` changes | TC-003 | [ ] |
| AC-4 | No indicator when `{TBD}` absent | TC-001, TC-004 | [ ] |
| AC-5 | Works across BA and FA dashboards | TC-005 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| Very large artifact content | Detection still accurate without timeout | TC-003 | [ ] |
| `{TBD}` inside code blocks | Still counted as marker (per literal match) | TC-003 | [ ] |

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
