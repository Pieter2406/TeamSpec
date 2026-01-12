---
# === LLM Retrieval Metadata ===
artifact_kind: tai
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: SA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tai-{PRX}-{NNN}"
filename_pattern: "tai-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: technical-architecture
    pattern: "ta-{PRX}-{NNN}"
    optional: false
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: true

# === Search Optimization ===
keywords:
  - technical architecture increment
  - TAI
  - architecture delta
  - technical change
aliases:
  - architecture change proposal
anti_keywords:
  - business requirements
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

# Technical Architecture Increment: `tai-{PRX}-{NNN}-{description}`

> **ID:** tai-PRX-XXX  
> **Product:** `<product-id>` (PRX)  
> **Project:** `<project-id>`  
> **Target TA Feature:** `<ta-PRX-XXX-name>`  
> **Target Feature:** `<f-PRX-XXX-feature-name>`  
> **Status:** draft | proposed | approved | implemented | synced

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Technical Architecture Increment (Project)  
**Lifecycle:** Project-scoped, merged to Product TA after approval

---

## Metadata

| Field | Value |
| :--- | :--- |
| **TAI ID** | tai-PRX-XXX |
| **Status** | Proposed / Accepted / Implemented / Synced |
| **Date** | YYYY-MM-DD |
| **Author** | [SA Name] |
| **Target TA** | [ta-PRX-XXX](../../products/PRX/technical-architecture/ta-PRX-XXX-*.md) |
| **Feature Increment** | [fi-PRX-XXX](../feature-increments/fi-PRX-XXX-*.md) |

---

## 1. Overview

> **Contract:** Summary of this architecture increment.  
> **Required precision:** What changes and why for this project.  
> **Not this:** Full TA document (that's the Product TA).

_Brief description of the technical architecture increment specific to this project._

---

## 2. AS-IS (Current Product TA)

> **Contract:** Current production architecture state.  
> **Required precision:** Copy from Product TA, do not paraphrase.  
> **Not this:** Proposed changes (those go in TO-BE).

> _Auto-populated from Product Technical Architecture. DO NOT EDIT unless correcting errors._

_Copy relevant sections from the Product TA._

---

## 3. TO-BE (Project Technical Architecture)

> **Contract:** Proposed architecture after this increment.  
> **Required precision:** Specific changes, not full restatement.  
> **Not this:** Current state (that's AS-IS).

### 3.1 New/Changed Architecture Elements

_Describe what the project-specific architecture includes that product architecture doesn't._

### 3.2 Technical Specifications

_Detailed technical specifications for this increment._

### 3.3 Out of Scope

_Explicitly state what this increment does NOT include._

---

## 4. Impact Analysis

### 4.1 Feature Implications

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| [f-PRX-XXX] | Modified | _What architecture changes affect this feature_ |

### 4.2 Infrastructure Dependencies

_Links to infrastructure or platform requirements._

### 4.3 Implementation Constraints

_Architecture constraints that affect DEV work._

---

## 5. Behavior Impact Assessment

> ⚠️ Does this TAI affect user-observable behavior?

### 5.1 Changes to Feature Behavior

_What behavior changes result from this architecture._

### 5.2 Feature Canon Updates

_What sections of Feature Canon need updates based on this TAI._

---

## 6. Integration Notes

### 6.1 Product TA Alignment

_How this project TAI aligns with or extends the product TA._

### 6.2 Merge Strategy

_How this TAI will be merged back to Product TA after project completion._

---

## 7. Implementation Notes

### 7.1 Development Guidelines

_Key implementation guidance for the development team._

### 7.2 Testing and Validation

_How the architecture will be validated._

---

## 8. Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | [Name] | ✅ | YYYY-MM-DD |
| Tech Lead | [Name] | ⏳ | |
| FA (if behavior affected) | [Name] | ⏳ | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
