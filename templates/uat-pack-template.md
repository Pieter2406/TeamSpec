---
# === LLM Retrieval Metadata ===
artifact_kind: uat
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: release-bound

# === Naming ===
id_pattern: "uat-f-{PRX}-{NNN}"
filename_pattern: "uat-f-{PRX}-{NNN}.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: false

# === Search Optimization ===
keywords:
  - UAT
  - user acceptance testing
  - stakeholder validation
  - acceptance pack
aliases:
  - acceptance test
  - stakeholder signoff
anti_keywords:
  - regression test
  - unit test
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Pre-UAT Checklist
    - Test Scenarios
    - Sign-off
  optional_sections:
    - Notes
---

# UAT Pack: `uat-f-{PRX}-{NNN}-{feature-name}`

<!-- 
  ⚠️ UAT VALIDATES FEATURE CANON
  
  This UAT pack validates behavior as documented in the Feature Canon.
  
  RULES:
  1. UAT tests Feature Canon behavior
  2. Stakeholders sign off that behavior matches Canon
  3. Any discrepancies must be classified (bug or Canon wrong)
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Acceptance Validation  
**Lifecycle:** Release-bound

---

**To**: [Stakeholder Name]  
**From**: [Project Team]  
**Date**: [Date]  
**Feature ID**: [F-XXX](../features/F-XXX-name.md)

---

## Pre-UAT Checklist

Before you begin UAT, please note:

- [ ] Feature Canon is current (no pending documentation syncs)
- [ ] All stories related to this feature are marked "Done"
- [ ] Implementation has been validated by QA
- [ ] Feature Canon Change Log is up to date

---

## What Changed in This Release

| Feature | Change Summary | Story | Impact Type |
|---------|----------------|-------|-------------|
| [F-XXX] | [What changed from previous behavior] | [S-XXX] | Added / Changed |

**If this is your first time using this feature, see "Current Behavior" below.**

---

## Current Behavior (from Feature Canon)

See the full feature documentation: [F-XXX](../features/F-XXX-name.md)

**Key capabilities**:
- [Capability 1]
- [Capability 2]

**Business Rules**:
- BR-XXX-001: [Rule description]
- BR-XXX-002: [Rule description]

---

## Objective

Please verify that the [Feature] meets your business needs and that behavior matches what was specified.

---

## Environment

- **URL**: [Staging Link]
- **Login**: [Credentials]
- **Test Data**: [Data setup instructions]

---

## Scenarios

> Please perform these actions and mark Pass/Fail.

| ID | Action (Business Language) | Expected Outcome (from Feature Canon) | Pass/Fail | Notes |
|:---|:---|:---|:---:|:---|
| 1 | [Action description] | [Expected per Canon] | [ ] | |
| 2 | [Action description] | [Expected per Canon] | [ ] | |
| 3 | [Action description] | [Expected per Canon] | [ ] | |

---

## Edge Case Validation

| ID | Edge Case | Expected Outcome | Pass/Fail | Notes |
|:---|:---|:---|:---:|:---|
| E1 | [Edge case] | [Expected per Canon] | [ ] | |

---

## Feedback

> Please note any issues or concerns.

**Issues Found:**

| Issue # | Description | Severity | Screenshot? |
|---------|-------------|----------|-------------|
| 1 | | | [ ] |

**General Feedback:**

[Open text for stakeholder comments]

---

## Issue Classification Guide

If you find an issue, please help us classify it:

| If... | Then it's a... |
|-------|----------------|
| System does something different than documented | Implementation defect |
| Documented behavior doesn't match what you expected | Canon may need update |
| System does something not mentioned anywhere | Undocumented behavior |

---

## Sign-Off

**I have verified that the system behavior matches the documented Feature Canon and approve this release.**

| Stakeholder | Role | Approved | Date | Signature |
|-------------|------|----------|------|-----------|
| [Name] | [Role] | ☐ Yes / ☐ No | | |

---

## Post-UAT Actions

### If Approved:
- [ ] Release can proceed
- [ ] Feature Canon confirmed accurate

### If Issues Found:
- [ ] Bugs filed: [BUG-XXX, BUG-YYY]
- [ ] Canon updates needed: [List]
- [ ] Re-UAT scheduled: [Date]

---

## Evidence Record

This UAT pack is evidence that:
1. ✅ Documented behavior was validated by stakeholders
2. ✅ No undocumented scope changes were introduced
3. ✅ Feature Canon is accurate and complete

**UAT Completed:** [ ] Yes / [ ] No  
**QA Coordinator:** ________________  
**Date:** ________________
