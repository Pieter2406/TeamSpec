---
# === LLM Retrieval Metadata ===
artifact_kind: tc
spec_version: "4.0"
template_version: "4.0.1"
title: "Product Portfolio Navigation QA"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tc-fi-TSV-004"
filename_pattern: "tc-fi-TSV-004-product-portfolio-navigation.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-TSV-004"
    optional: false
  - type: feature
    pattern: "f-TSV-001"
    optional: true

# === Search Optimization ===
keywords:
  - test case
  - test scenario
  - validation
  - product portfolio
anti_keywords:
  - regression test
  - automated test code
  - unit test
---

# Test Cases: tc-fi-TSV-004-product-portfolio-navigation

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Project Test Cases (Project-scoped)  
**Lifecycle:** Project-scoped, merged to Product feature tests after approval

---

## Test Case Reference

**Feature Increment:** [fi-TSV-004 — Product Portfolio Navigation](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)  
**Feature:** [f-TSV-001 — Product Portfolio View](../../products/teamspec-viewer/features/f-TSV-001-product-portfolio-view.md)  
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-TSV-004 |
| **Feature Increment** | [fi-TSV-004](../feature-increments/fi-TSV-004-product-portfolio-navigation.md) |
| **Feature** | [f-TSV-001](../../products/teamspec-viewer/features/f-TSV-001-product-portfolio-view.md) |
| **Author** | QA |
| **Created** | 2026-01-17 |
| **Last Updated** | 2026-01-17 |

---

## Test Scenarios

> **Contract:** Specific test cases validating FI behavior.  
> **Required precision:** Steps, expected results, AC mapping.  
> **Not this:** Automation code or unit tests.

### TC-001: Products list discovered from filesystem

- **Type**: Positive
- **Feature Reference**: [fi-TSV-004: TO-BE Behavior](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)
- **Acceptance Criteria**: AC-1
- **Pre-conditions**: Products directory populated; viewer backend can read product.yml.
- **Steps**:
  1. Open product portfolio view.
  2. Observe list of products presented.
- **Expected Result**: All products from `products/` are listed.
- **Test Data**: Multiple product folders (including `teamspec-viewer`).
- **Automation**: Manual.

### TC-002: Product entries show name, prefix, status

- **Type**: Positive
- **Feature Reference**: [fi-TSV-004: TO-BE Behavior](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)
- **Acceptance Criteria**: AC-2
- **Pre-conditions**: Product entries visible.
- **Steps**:
  1. Inspect product row/card for `teamspec-viewer`.
- **Expected Result**: Product name, PRX prefix, and status displayed; status uses product.yml value or default.
- **Test Data**: product.yml for listed products.
- **Automation**: Manual.

### TC-003: Selecting product shows targeting projects

- **Type**: Positive
- **Feature Reference**: [fi-TSV-004: TO-BE Behavior](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)
- **Acceptance Criteria**: AC-3
- **Pre-conditions**: Projects exist with target_products referencing product.
- **Steps**:
  1. Select `teamspec-viewer` product entry.
  2. Observe projects listing.
- **Expected Result**: Projects targeting the product are listed with project name/ID and status.
- **Test Data**: project.yml with target_products including `teamspec-viewer`.
- **Automation**: Manual.

### TC-004: Context visible in UI

- **Type**: Positive
- **Feature Reference**: [fi-TSV-004: TO-BE Behavior](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)
- **Acceptance Criteria**: AC-4
- **Pre-conditions**: Product and project selected.
- **Steps**:
  1. After TC-003 selection, inspect header/breadcrumb.
- **Expected Result**: Selected product and project context displayed in UI.
- **Test Data**: N/A.
- **Automation**: Manual.

### TC-005: MVP default context preselected

- **Type**: Positive / Boundary
- **Feature Reference**: [fi-TSV-004: TO-BE Behavior](../feature-increments/fi-TSV-004-product-portfolio-navigation.md)
- **Acceptance Criteria**: AC-5
- **Pre-conditions**: Fresh load (no stored selection).
- **Steps**:
  1. Load viewer for the first time or clear storage.
  2. Observe initial product/project context.
- **Expected Result**: Default context is `teamspec-viewer` product with `teamspecviewermvp` project selected (hardcoded MVP behavior).
- **Test Data**: Clean browser storage.
- **Automation**: Manual.

---

## Acceptance Criteria Coverage

| AC ID | AC Description | Test ID | Status |
|-------|----------------|---------|--------|
| AC-1 | View list of products from products directory | TC-001 | [ ] |
| AC-2 | Product entry shows name, prefix, status | TC-002 | [ ] |
| AC-3 | Select product to see targeting projects | TC-003 | [ ] |
| AC-4 | Selected context visible in UI | TC-004 | [ ] |
| AC-5 | Default context loads TSV/teamspecviewermvp | TC-005 | [ ] |

---

## Edge Case Coverage

| Edge Case | Feature Behavior | Test ID | Status |
|-----------|-----------------|---------|--------|
| Missing project.yml for some projects | Projects without valid metadata are omitted gracefully | TC-003 | [ ] |
| Single product present | Auto-select single product as default | TC-001 | [ ] |

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
