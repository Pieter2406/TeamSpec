# Test Cases: [Feature Name]

<!-- 
  ⚠️ TESTS ARE FEATURE-LEVEL, NOT STORY-LEVEL
  
  Test cases validate Feature Canon behavior, not individual stories.
  
  RULES:
  1. Tests reference Feature Canon sections
  2. Tests are canonical (survive story completion)
  3. If behavior doesn't match Canon, classify the issue
  4. Do not create story-specific test cases
  
  TEAMSPEC RULES ENFORCED:
  - TS-DOD-002: Tests are feature-level
  - TS-QA-001: Tests must reference Feature Canon
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Canonical (Feature-level)  
**Lifecycle:** Permanent, evolves with Feature Canon

---

## Test Case Reference

**Feature:** [F-XXX — Feature Name](../../features/F-XXX-name.md)  
**Test Level:** Feature (not Story)

| Metadata | Value |
| :--- | :--- |
| **Feature** | [F-XXX](../../features/F-XXX-name.md) – [Feature Name] |
| **Author** | [QA Name] |
| **Created** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |

<!-- TEAMSPEC RULE: TS-DOD-002 - Tests are feature-level -->

> ⚠️ Test cases are canonical and feature-level.
> Do not create story-specific test cases.
> Test against Feature Canon, not individual stories.

---

## Test Scenarios

### TC-001: [Title]

- **Type**: Positive / Negative / Boundary
- **Feature Reference**: F-XXX: Current Behavior > [Section]
- **Business Rule**: BR-XXX-001 (if applicable)
- **Pre-conditions**: [Setup required]
- **Steps**:
  1. [Action 1]
  2. [Action 2]
- **Expected Result**: [What should happen]
- **Canon Alignment**: ✓ Matches Feature Canon documented behavior

### TC-002: [Title]

- **Type**: Positive / Negative / Boundary
- **Feature Reference**: F-XXX: Current Behavior > [Section]
- **Business Rule**: BR-XXX-002 (if applicable)
- **Pre-conditions**: [Setup required]
- **Steps**:
  1. [Action 1]
  2. [Action 2]
- **Expected Result**: [What should happen]
- **Canon Alignment**: ✓ Matches Feature Canon documented behavior

---

## Edge Case Coverage

| Edge Case | Feature Canon Section | Test ID | Status |
|-----------|----------------------|---------|--------|
| [Edge case 1] | F-XXX: Edge Cases | TC-003 | [ ] |
| [Edge case 2] | F-XXX: Edge Cases | TC-004 | [ ] |

---

## Business Rule Validation

| Rule ID | Rule Description | Test ID | Status |
|---------|------------------|---------|--------|
| BR-XXX-001 | [Rule description] | TC-001 | [ ] |
| BR-XXX-002 | [Rule description] | TC-002 | [ ] |

---

## Feature Alignment Validation

Before marking tests as "Complete":

- [ ] All tests reference Feature Canon behavior
- [ ] No tests for undocumented behavior
- [ ] If behavior doesn't match Feature Canon, flagged for investigation
- [ ] Feature file is current (no ⚠️ pending updates)
- [ ] Business rules (BR-XXX) are all tested

---

## Post-Test Documentation Check

After testing is complete:

- [ ] If behavior matches Feature Canon: ✅ Pass
- [ ] If behavior doesn't match Feature Canon:
  - [ ] Is Feature Canon wrong? Flag for FA sync.
  - [ ] Is implementation wrong? File bug for DEV.
  - [ ] Is this undocumented behavior? Alert FA immediately.

---

## Test Execution Log

| Date | Tester | Environment | Pass | Fail | Blocked | Notes |
|------|--------|-------------|------|------|---------|-------|
| YYYY-MM-DD | [Name] | [Env] | {N} | {N} | {N} | |

---

## Sign-Off

This test pack is evidence that:

1. ✅ Documented behavior works correctly
2. ✅ No undocumented behavior was introduced
3. ✅ Feature Canon is accurate and complete

**QA Approved:** [ ] Yes  
**QA Name:** ________________  
**Date:** ________________

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-QA-001 | Tests must reference Feature Canon |
| TS-DOD-002 | Tests are feature-level, not story-level |
