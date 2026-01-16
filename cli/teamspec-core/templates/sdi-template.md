---
# === LLM Retrieval Metadata ===
artifact_kind: sdi
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short SDI title (20-40 chars)}"

# === Ownership ===
role_owner: SA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "sdi-{PRX}-{NNN}"
filename_pattern: "sdi-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: solution-design
    pattern: "sd-{PRX}-{NNN}"
    optional: false
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: true

# === Search Optimization ===
keywords:
  - solution design increment
  - SDI
  - design delta
  - integration change
aliases:
  - design change proposal
anti_keywords:
  - architecture decision
  - story
  - feature behavior

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Overview
    - AS-IS
    - TO-BE
  optional_sections:
    - Risks
---

# Solution Design Increment: `sdi-{PRX}-{NNN}-{description}`

> **ID:** sdi-PRX-XXX  
> **Product:** `<product-id>` (PRX)  
> **Project:** `<project-id>`  
> **Target SD Feature:** `<sd-PRX-XXX-name>`  
> **Target Feature:** `<f-PRX-XXX-feature-name>`  
> **Status:** draft | proposed | approved | implemented | synced

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Solution Design Increment (Project)  
**Lifecycle:** Project-scoped, merged to Product SD after approval

---

## Metadata

| Field | Value |
| :--- | :--- |
| **SDI ID** | sdi-PRX-XXX |
| **Status** | Proposed / Accepted / Implemented / Synced |
| **Date** | YYYY-MM-DD |
| **Author** | [SA Name] |
| **Target SD** | [sd-PRX-XXX](../../products/PRX/solution-designs/sd-PRX-XXX-*.md) |
| **Feature Increment** | [fi-PRX-XXX](../feature-increments/fi-PRX-XXX-*.md) |

---

## 1. Overview

> **Contract:** Summary of this design increment.  
> **Required precision:** What changes and why for this project.  
> **Not this:** Full SD document (that's the Product SD).

_Brief description of the solution design increment specific to this project._

---

## 2. AS-IS (Current Product SD)

> **Contract:** Current production design state.  
> **Required precision:** Copy from Product SD, do not paraphrase.  
> **Not this:** Proposed changes (those go in TO-BE).

> _Auto-populated from Product Solution Design. DO NOT EDIT unless correcting errors._

_Copy relevant sections from the Product SD._

---

## 3. TO-BE (Project Solution Design)

> **Contract:** Proposed design after this increment.  
> **Required precision:** Specific changes, not full restatement.  
> **Not this:** Current state (that's AS-IS).

### 3.1 New/Changed Design Elements

_Describe what the project-specific solution design includes that product design doesn't._

### 3.2 Design Specifications

_Detailed specifications for this increment._

### 3.3 Out of Scope

_Explicitly state what this increment does NOT include._

---

## 4. Impact Analysis

### 4.1 Feature Implications

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| [f-PRX-XXX] | Modified | _What design changes affect this feature_ |

### 4.2 Technical Architecture Dependencies

_Links to required Technical Architecture (TA) documents._

### 4.3 Implementation Constraints

_Design constraints that affect DEV work._

---

## 5. Behavior Impact Assessment

> ⚠️ Does this SDI affect user-observable behavior?

### 5.1 Changes to Feature Behavior

_What behavior changes result from this design._

### 5.2 Feature Canon Updates

_What sections of Feature Canon need updates based on this SDI._

---

## 6. Integration Notes

### 6.1 Product SD Alignment

_How this project SDI aligns with or extends the product SD._

### 6.2 Merge Strategy

_How this SDI will be merged back to Product SD after project completion._

---

## 7. Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | [Name] | ✅ | YYYY-MM-DD |
| FA | [Name] | ⏳ | |
| Tech Lead | [Name] | ⏳ | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
