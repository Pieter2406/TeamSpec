---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short test case title (20-40 chars)}"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-{PRX}-{NNN}"
filename_pattern: "tc-fi-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: false
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - verification
  - acceptance test
aliases:
  - test spec
  - test script
anti_keywords:
  - regression test
  - automated test code
  - unit test

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Test Case Reference
    - Test Scenarios
  optional_sections:
    - Test Data
    - Automation Notes
---

# Test Cases: `tc-fi-{PRX}-{NNN}-{description}`

<!-- 
  ⚠️ PROJECT-LEVEL TEST CASES
  
  Test cases for Feature Increments validate project-specific test scenarios.
  These are created during sprint planning and refined during development.
  
  RULES:
  1. Test cases reference Feature-Increment behavior
  2. Tests can reference Feature Canon sections
  3. Tests are specific to the project sprint
  4. Linked to acceptance criteria
  
  TEAMSPEC RULES ENFORCED:
  - TS-DOD-003: Tests are feature-increment level
  - TS-QA-002: Tests must reference Feature Canon or Increment Canon
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-PRX-XXX — Increment Name](../feature-increments/fi-PRX-XXX-*.md)  
**Feature:** [F-XXX — Feature Name](../../products/PRX/features/F-XXX-name.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-PRX-XXX |
| **Feature Increment** | [fi-PRX-XXX](../feature-increments/fi-PRX-XXX-*.md) |
| **Feature** | [F-XXX](../../products/PRX/features/F-XXX-name.md) |
| **Author** | [QA Name] |
| **Created** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: [Title]

- **Type**: Positive / Negative / Boundary
- **Feature Reference**: [fi-PRX-XXX: TO-BE Behavior](../feature-increments/fi-PRX-XXX-*.md)
- **Acceptance Criteria**: AC-1 from FI
- **Pre-conditions**: [Setup required]
- **Steps**:
  1. [Action 1]
  2. [Action 2]
- **Expected Result**: [What should happen]
- **Test Data**: [Data needed]
- **Automation**: Manual / Automated

### TC-002: [Title]

- **Type**: Positive / Negative / Boundary
- **Feature Reference**: [fi-PRX-XXX: TO-BE Behavior](../feature-increments/fi-PRX-XXX-*.md)
- **Acceptance Criteria**: AC-2 from FI
- **Pre-conditions**: [Setup required]
- **Steps**:
  1. [Action 1]
  2. [Action 2]
- **Expected Result**: [What should happen]
- **Test Data**: [Data needed]
- **Automation**: Manual / Automated

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | [From FI] | TC-001 | [ ] |
| AC-2 | [From FI] | TC-002 | [ ] |
| AC-3 | [From FI] | TC-003 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| [Edge case 1] | [How it should behave] | TC-004 | [ ] |
| [Edge case 2] | [How it should behave] | TC-005 | [ ] |

---

## Feature Alignment Validation

Before marking tests as "Complete":

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
| YYYY-MM-DD | @author | Initial test cases |
