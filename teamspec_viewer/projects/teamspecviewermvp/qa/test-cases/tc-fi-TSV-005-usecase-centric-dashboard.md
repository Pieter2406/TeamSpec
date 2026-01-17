---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "Use-Case Centric Dashboard QA"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-005"
filename_pattern: "tc-fi-TSV-005-usecase-centric-dashboard.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-005"
    optional: false
  - type: feature
    pattern: "f-TSV-002"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - dashboard visualization
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-005-usecase-centric-dashboard

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-005 — Use-Case Centric Dashboard](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)  
**Feature:** [f-TSV-002 — Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-005 |
| **Feature Increment** | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |
| **Feature** | [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: Feature-centric layout rendered

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-1
- **Pre-conditions**: FA dashboard loads with feature data.
- **Steps**:
  1. Open FA dashboard.
  2. Observe top-level layout.
- **Expected Result**: Features appear as primary focal artifacts (cards/tree root), not mixed flat lists with other artifact types.
- **Test Data**: Features with linked increments.
- **Automation**: Manual.

### TC-002: Selecting feature reveals relationships tree

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-2, AC-3
- **Pre-conditions**: Feature has linked FIs and stories.
- **Steps**:
  1. Select a feature card.
  2. Expand tree view.
- **Expected Result**: Tree shows Feature → FIs → Epics → Stories with expand/collapse controls.
- **Test Data**: Feature with linked FI/epic/story relationships.
- **Automation**: Manual.

### TC-003: Node details include status and project context

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-4
- **Pre-conditions**: Tree expanded with nodes visible.
- **Steps**:
  1. Inspect FI node; inspect epic node.
- **Expected Result**: Each node shows artifact ID, title, status; FI nodes show project context.
- **Test Data**: Artifacts with status fields and project identifiers.
- **Automation**: Manual.

### TC-004: Quick-view and open-in-reader behaviors

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-5, AC-6
- **Pre-conditions**: Tree nodes visible.
- **Steps**:
  1. Single-click an FI node.
  2. Observe quick-view details panel.
  3. Double-click the same node.
- **Expected Result**: Single-click shows quick-view without losing tree context; double-click opens full artifact in reader.
- **Test Data**: Any tree node.
- **Automation**: Manual.

### TC-005: Badge counts and child visibility

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-7
- **Pre-conditions**: Feature with multiple linked children.
- **Steps**:
  1. View feature card/tree root badges.
  2. Expand children.
- **Expected Result**: Badge counts reflect number of linked FIs and stories; counts match visible children.
- **Test Data**: Feature with ≥2 FIs or stories.
- **Automation**: Manual.

### TC-006: Expand all / collapse all controls

- **Type**: Positive
- **Feature Reference**: [fi-TSV-005: TO-BE Behavior](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md)
- **Acceptance Criteria**: AC-8
- **Pre-conditions**: Tree view rendered.
- **Steps**:
  1. Use expand-all control.
  2. Verify all levels open.
  3. Use collapse-all control.
- **Expected Result**: Expand-all opens all nodes; collapse-all closes them; tree remains responsive.
- **Test Data**: Feature tree with multiple levels.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | Features are primary focal artifacts | TC-001 | [ ] |
| AC-2 | Selecting feature reveals visual tree | TC-002 | [ ] |
| AC-3 | Expand/collapse shows relationships | TC-002 | [ ] |
| AC-4 | Nodes show ID, title, status, project | TC-003 | [ ] |
| AC-5 | Node quick-view without losing context | TC-004 | [ ] |
| AC-6 | Double-click opens full artifact | TC-004 | [ ] |
| AC-7 | Badge counts show linked children | TC-005 | [ ] |
| AC-8 | Expand-all / collapse-all available | TC-006 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| Feature with no linked FIs | Tree shows empty state but remains usable | TC-002 | [ ] |
| Large tree depth | Tree performance and readability remain acceptable | TC-006 | [ ] |

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
