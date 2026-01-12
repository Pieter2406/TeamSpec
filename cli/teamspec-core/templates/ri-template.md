---
# === LLM Retrieval Metadata ===
artifact_kind: ri
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "ri-fi-{PRX}-{NNN}"
filename_pattern: "ri-fi-{PRX}-{NNN}.md"

# === Required Relationships ===
links_required:
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: false

# === Search Optimization ===
keywords:
  - regression impact
  - impact assessment
  - deployment gate
  - regression coverage
aliases:
  - impact record
anti_keywords:
  - test case
  - bug report
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  assessment_required: true
  required_sections:
    - Required Fields
    - Regression Test Updates
  optional_sections:
    - Notes
---

# Regression Impact: `ri-fi-{PRX}-{NNN}`

<!--
  ⚠️ REGRESSION IMPACT RECORD (REQUIRED AT DEPLOYMENT GATE)

  This document records the regression test impact assessment for a Feature-Increment.

  NAMING PATTERN: ri-fi-{PRX}-{NNN}.md
  EXAMPLE: ri-fi-ACME-001.md

  REQUIRED FIELDS (per registry.yml):
  - fi_id: Reference to Feature-Increment
  - assessment: 'update-required' | 'no-impact'
  - rationale: Explanation of impact assessment
  - regression_tests: List of rt-f-* files created/updated (if update-required)

  TEAMSPEC RULES ENFORCED:
  - TS-QA-003: Regression impact record required at deployment gate (BLOCKER)
-->

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** QA (QA Engineer)
**Artifact Type:** Regression Impact Record (Post-Deployment)
**Lifecycle:** Created at deployment verification gate, referenced during Canon sync

---

## Required Fields (TS-QA-003)

> ⚠️ **BLOCKER**: All fields below must be completed before deployment gate can pass.

| Field | Value |
| :--- | :--- |
| **fi_id** | fi-{PRX}-{NNN} |
| **assessment** | `update-required` / `no-impact` |
| **rationale** | [Explanation of why this assessment was chosen] |
| **regression_tests** | [List of rt-f-* files - REQUIRED if assessment = update-required] |

---

## Metadata

| Field | Value |
| :--- | :--- |
| **RI ID** | ri-fi-{PRX}-{NNN} |
| **Product** | {product-id} ({PRX}) |
| **Project** | {project-id} |
| **Created** | YYYY-MM-DD |
| **Author** | [QA Name] |
| **Feature Increment** | [fi-{PRX}-{NNN}](../feature-increments/fi-{PRX}-{NNN}-*.md) |
| **Deployment Date** | YYYY-MM-DD |
| **Verification Status** | ✅ Passed / ⚠️ Conditional / ❌ Failed |

---

## 1. Assessment Decision

> ⚠️ **Select exactly ONE assessment type:**

### [ ] Assessment: `update-required`

**Rationale:** [Explain why regression test updates are needed]

**Regression Tests Updated/Created:**

| Regression Test | Target Feature | Action | Status |
|-----------------|----------------|--------|--------|
| [rt-f-{PRX}-{NNN}](../../products/{product-id}/qa/regression-tests/rt-f-{PRX}-{NNN}-*.md) | f-{PRX}-{NNN} | Created / Updated | ✅ Complete |

### [ ] Assessment: `no-impact`

**Rationale:** [Explain why no regression test updates are needed - REQUIRED]

_Examples of valid rationales:_
- _"This FI only affects internal refactoring with no user-observable behavior change"_
- _"Existing regression tests rt-f-ACME-001 and rt-f-ACME-002 already cover this behavior"_
- _"Feature toggle disabled in production; regression tests deferred until toggle enabled"_

---

## 2. Overview

_High-level summary of what was deployed and any regression considerations._

---

## 3. Deployment Verification Summary

### 3.1 What Was Deployed

_Brief description of the Feature Increment deployed._

### 3.2 Deployment Date/Time

- **Deployment Date:** YYYY-MM-DD
- **Deployment Time:** HH:MM UTC
- **Environment:** Production
- **Feature Toggles:** [Enabled/Disabled/N/A]

---

## 4. Regression Testing Results

### 4.1 Test Coverage

| Test Area | Test Cases | Passed | Failed | Notes |
|-----------|------------|--------|--------|-------|
| [Module 1] | [Count] | [✅] | [❌] | |
| [Module 2] | [Count] | [✅] | [❌] | |

### 4.2 Known Issues

| Issue | Severity | Status | Workaround |
|-------|----------|--------|-----------|
| [Issue 1] | [P1/P2/P3] | [Open/Tracking] | [Workaround] |

### 4.3 Affected Features

| Feature | Impact | Verified? | Notes |
|---------|--------|-----------|-------|
| [f-PRX-XXX] | [Impact] | ✅/⚠️/❌ | [Details] |
| [f-PRX-YYY] | [Impact] | ✅/⚠️/❌ | [Details] |

---

## 5. Behavior Changes

### 5.1 User-Observable Changes

_What end users might notice after this deployment._

### 5.2 Performance Impact

_Any performance characteristics affected by this deployment._

### 5.3 Data Impact

_Any data model or data characteristics changed by this deployment._

---

## 6. Canon Sync Readiness

### 6.1 Feature Canon Updates Needed

_What sections of Feature Canon need updates to reflect deployed changes._

### 6.2 Breaking Changes

_Any breaking changes for users or downstream systems._

### 6.3 Deprecations

_Any deprecated APIs or behaviors._

---

## 7. Rollback Considerations

### 7.1 Rollback Risk Level

- [ ] **Low** — Can rollback safely, no data implications
- [ ] **Medium** — Rollback possible but with data considerations
- [ ] **High** — Rollback difficult or impossible, has data implications

### 7.2 Rollback Plan

_If needed, how would we revert this deployment?_

---

## 8. Post-Deployment Monitoring

### 8.1 Key Metrics to Monitor

| Metric | Normal Range | Alert Threshold |
|--------|--------------|-----------------|
| [Metric 1] | [Range] | [Threshold] |
| [Metric 2] | [Range] | [Threshold] |

### 8.2 Support Notes

_Any documentation or communications needed for support team._

---

## 9. Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| QA (Author) | [Name] | ✅ | YYYY-MM-DD |
| QA Lead | [Name] | ⏳ | |
| SM (Gate Owner) | [Name] | ⏳ | |

---

## 10. Canon Sync Record

_Completed after PO runs `ts:po sync`_

| Field | Value |
|-------|-------|
| **Canon Sync Date** | YYYY-MM-DD |
| **Synced By** | [PO Name] |
| **Canon Sync Status** | ✅ Complete |

---

## Linter Rules Enforced

| Rule | Description | Severity |
|------|-------------|----------|
| TS-QA-003 | Regression impact record required at deployment gate | BLOCKER |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial assessment (post-deployment) |
