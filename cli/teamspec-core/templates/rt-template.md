---
# === LLM Retrieval Metadata ===
artifact_kind: rt
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short regression test title (20-40 chars)}"

# === Ownership ===
role_owner: QA
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "rt-f-{PRX}-{NNN}"
filename_pattern: "rt-f-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: false

# === Search Optimization ===
keywords:
  - regression test
  - regression scenario
  - production test
  - feature validation
aliases:
  - regression suite
  - feature tests
anti_keywords:
  - project test
  - acceptance test
  - story test

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Overview
    - Regression Scenarios
  optional_sections:
    - Automation Status
---

# Regression Test: rt-f-{PRX}-{NNN}-{description}

> **Product:** {product-id}  
> **Feature:** [f-{PRX}-{NNN}-{name}](../features/f-{PRX}-{NNN}-{name}.md)  
> **Owner:** QA  
> **Created:** {YYYY-MM-DD}  
> **Last Updated:** {YYYY-MM-DD}

---

## Overview

> **Contract:** Summary of regression coverage for this feature.  
> **Required precision:** What behaviors are protected.  
> **Not this:** Detailed test steps (those go in Scenarios).

Brief description of the regression test coverage for this feature.

---

## Feature Summary

| Aspect | Value |
|--------|-------|
| Feature ID | f-{PRX}-{NNN} |
| Feature Name | {Feature Name} |
| Core Behavior | {One-line summary of what the feature does} |

---

## Regression Scenarios

> **Contract:** Tests validating production feature behavior.  
> **Required precision:** Steps, expected results, criticality.  
> **Not this:** Project-specific tests (those are tc-* files).

### Scenario 1: {Scenario Name}

**Purpose:** {What this scenario validates}

**Preconditions:**
- {Precondition 1}
- {Precondition 2}

**Steps:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Expected Result:**
- {Expected outcome}

**Criticality:** High | Medium | Low

---

### Scenario 2: {Scenario Name}

**Purpose:** {What this scenario validates}

**Preconditions:**
- {Precondition 1}

**Steps:**
1. {Step 1}
2. {Step 2}

**Expected Result:**
- {Expected outcome}

**Criticality:** High | Medium | Low

---

## Edge Cases

| Case | Input | Expected Behavior |
|------|-------|-------------------|
| {Edge case 1} | {Input} | {Behavior} |
| {Edge case 2} | {Input} | {Behavior} |

---

## Integration Points

| System/Feature | Integration Type | Regression Risk |
|----------------|------------------|-----------------|
| {Related feature} | {API/Data/UI} | High | Medium | Low |

---

## Automation Status

| Scenario | Automated | Test ID | Notes |
|----------|-----------|---------|-------|
| Scenario 1 | Yes / No / Partial | {test-id} | {Notes} |
| Scenario 2 | Yes / No / Partial | {test-id} | {Notes} |

---

## Change History

| Date | FI Reference | Change | Author |
|------|--------------|--------|--------|
| {YYYY-MM-DD} | fi-{PRX}-{NNN} | Initial creation | {name} |

---

## Related

- Feature: [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-{name}.md)
- Product: [product.yml](../product.yml)
