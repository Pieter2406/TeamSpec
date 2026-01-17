---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "Dashboard Filtering Ordering QA"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-007"
filename_pattern: "tc-fi-TSV-007-dashboard-filtering-ordering.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false
  - type: feature
    pattern: "f-TSV-002"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - dashboard filtering
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-007-dashboard-filtering-ordering

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-007 — Dashboard Filtering & Ordering](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)  
**Feature:** [f-TSV-002 — Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-007 |
| **Feature Increment** | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |
| **Feature** | [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: Visibility toggle present and defaulted on

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-1
- **Pre-conditions**: Dashboard loads with artifacts in various states.
- **Steps**:
  1. Open dashboard (BA or FA).
  2. Locate "Show Completed Artifacts" toggle.
- **Expected Result**: Toggle visible and enabled by default (checked/on).
- **Test Data**: Mixed-state artifacts.
- **Automation**: Manual.

### TC-002: Toggle hides terminal states

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-2, AC-4
- **Pre-conditions**: Artifacts with terminal states (done, retired, out-of-scope, deferred, archived) exist.
- **Steps**:
  1. Turn toggle off.
  2. Observe lists/sections for all artifact types.
- **Expected Result**: Terminal-state artifacts hidden across features, FIs, epics, stories, BA artifacts; active items remain.
- **Test Data**: Artifacts tagged with terminal states.
- **Automation**: Manual.

### TC-003: Toggle persistence across reload

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-3
- **Pre-conditions**: Toggle state changed from default.
- **Steps**:
  1. Set toggle off.
  2. Reload page.
  3. Re-open dashboard.
- **Expected Result**: Toggle state restored from localStorage; filtering still applied.
- **Test Data**: Browser storage available.
- **Automation**: Manual.

### TC-004: State ordering priority applied

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-5
- **Pre-conditions**: Artifacts in multiple states present.
- **Steps**:
  1. Ensure toggle on to show all states.
  2. Inspect ordering of artifacts.
- **Expected Result**: Artifacts ordered by defined hierarchy (in-progress → active → ready → draft → proposed → pending → on-hold → deferred → out-of-scope → done → retired → archived).
- **Test Data**: Artifacts covering several states.
- **Automation**: Manual.

### TC-005: Alphabetical ordering within state groups

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-6
- **Pre-conditions**: Multiple artifacts sharing same state.
- **Steps**:
  1. Identify artifacts with same state.
  2. Verify order.
- **Expected Result**: Items within same state sorted alphabetically by title/name.
- **Test Data**: At least two items per state.
- **Automation**: Manual.

### TC-006: Visual clarity and accessibility of sections

- **Type**: Positive / Accessibility
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-7, AC-10
- **Pre-conditions**: Dashboard with grouped states.
- **Steps**:
  1. Inspect visual grouping of active/waiting/completed sections.
  2. Use keyboard to focus toggle and navigate list; use screen reader to announce.
- **Expected Result**: Sections are visually distinct; toggle is keyboard accessible; screen readers announce control and state.
- **Test Data**: N/A.
- **Automation**: Manual.

### TC-007: Mobile responsiveness

- **Type**: Positive
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-8
- **Pre-conditions**: Mobile viewport emulation.
- **Steps**:
  1. Open dashboard on narrow viewport/mobile emulator.
  2. Interact with toggle and verify ordering visibility.
- **Expected Result**: Filter control visible and functional; ordering cues still readable on mobile.
- **Test Data**: Mobile viewport.
- **Automation**: Manual.

### TC-008: Performance unaffected

- **Type**: Non-functional
- **Feature Reference**: [fi-TSV-007: TO-BE Behavior](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md)
- **Acceptance Criteria**: AC-9
- **Pre-conditions**: Dataset representative of typical artifact volume.
- **Steps**:
  1. Measure dashboard load before and after enabling filter.
  2. Toggle visibility multiple times.
- **Expected Result**: No noticeable performance regression; interactions remain responsive.
- **Test Data**: Representative artifact set.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | Visibility toggle exists | TC-001 | [ ] |
| AC-2 | Toggling hides terminal states | TC-002 | [ ] |
| AC-3 | Filter state persists | TC-003 | [ ] |
| AC-4 | Filter applies to all artifact types | TC-002 | [ ] |
| AC-5 | State ordering hierarchy applied | TC-004 | [ ] |
| AC-6 | Alphabetical ordering within groups | TC-005 | [ ] |
| AC-7 | Visual clarity of state grouping | TC-006 | [ ] |
| AC-8 | Mobile responsive | TC-007 | [ ] |
| AC-9 | No performance regression | TC-008 | [ ] |
| AC-10 | Accessibility for filter control | TC-006 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| No terminal-state artifacts present | Toggle off leaves list unchanged without errors | TC-002 | [ ] |
| Unknown/unsupported state value | Item placed after known states or flagged; no crash | TC-004 | [ ] |

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
