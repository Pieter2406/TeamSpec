# Functional Specification: [Feature Name]

<!-- 
  ℹ️ THIS IS A TRANSITIONAL DOCUMENT
  
  This Functional Specification bridges Business Analysis and Feature Canon.
  
  LIFECYCLE:
  1. Created during functional elaboration
  2. Used to refine Feature Canon
  3. RETIRED after Feature Canon stabilizes
  
  Once the Feature Canon (F-XXX.md) is complete and stable,
  this document should be archived and marked as superseded.
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Transitional (Working Document)  
**Lifecycle:** Retired after Feature Canon stabilizes

| Metadata | Details |
| :--- | :--- |
| **Source BA Doc** | [Link to BA Doc] |
| **Owner** | [FA Name] |
| **Tech Lead** | [Arch/Dev Name] |
| **Created** | YYYY-MM-DD |

---

## Target Feature Canon

> ⚠️ This spec elaborates behavior for the Feature Canon below.
> The Feature Canon is the authoritative source.
> This spec is a working document during elaboration only.

| Feature ID | Feature Name | Link |
|------------|--------------|------|
| [F-XXX](../features/F-XXX-name.md) | [Feature Name] | |

---

## 1. Feature Overview

> Summary for Developers - Read this first!

- **Building**: [What]
- **Key Constraints**: [Hard rules]
- **Risks**: [Top technical risks]

> **Reference the Feature Canon** for full behavioral context before developing.

---

## 2. Functional Requirements

### FR-01: [Requirement Name]

- **Description**: Detailed behavior.
- **Alignment**: Maps to Feature Canon section [F-XXX: Current Behavior > ...]
- **Validation**:
  - [Rule 1]
  - [Rule 2]
- **Error States**:
  - If [Condition], show "Error Message".

### FR-02: [Requirement Name]

...

---

## 3. User Interface (UI/UX)

- **Screen 1**: [Link to Figma] - Description of logic.
- **Screen 2**: ...

---

## 4. Role-Based Access

| Role | View | Edit | Delete |
| :--- | :---: | :---: | :---: |
| Admin | ✓ | ✓ | ✓ |
| Viewer | ✓ | — | — |

> Note: These roles and permissions will be documented in the Feature Canon.

---

## 5. Data Interactions

- **Inputs**: [Form fields]
- **Outputs**: [Display fields]

---

## 6. Story Slicing Strategy

> Suggested breakdown of work. Stories will be created by FA referencing this spec.

| Story | Scope | Feature Impact |
|-------|-------|----------------|
| Story 1 | [Core Slice] | Adds Behavior |
| Story 2 | [Edge Case] | Adds Behavior |
| Story 3 | [Refinement] | Changes Behavior |

---

## Authoritative Source Rule

> ⚠️ This Functional Specification is a **transitional planning document**.
> 
> Once stories are implemented:
> - **Feature Canon** is the authoritative reference
> - Stories become historical records
> - This spec may become stale
> 
> **If you discover a discrepancy** between this spec and the Feature Canon:
> - Check Feature file's Change Log to understand what changed
> - If behavior is wrong, file a bug
> - If Feature Canon is stale, run `ts:fa sync`

---

## Document Retirement

> This document should be retired when:

- [ ] Feature Canon (F-XXX) is complete
- [ ] All business rules transferred to Feature Canon
- [ ] All edge cases documented in Feature Canon
- [ ] Stakeholder validation complete
- [ ] Feature Canon is source of truth

**Retirement Status:** [ ] Active / [ ] Superseded  
**Superseded By:** [F-XXX](../features/F-XXX-name.md)  
**Retirement Date:** ________________

---

## Transition Checklist

Before retiring this document:

| Item | Status | Notes |
|------|--------|-------|
| Purpose section in Feature Canon | [ ] | |
| Business Value in Feature Canon | [ ] | |
| Scope (In/Out) in Feature Canon | [ ] | |
| Current Behavior in Feature Canon | [ ] | |
| Business Rules (BR-XXX) in Feature Canon | [ ] | |
| Edge Cases in Feature Canon | [ ] | |
| Roles & Permissions in Feature Canon | [ ] | |

**Transition Verified By:** ________________  
**Date:** ________________
