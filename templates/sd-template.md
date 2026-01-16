---
# === LLM Retrieval Metadata ===
artifact_kind: sd
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short SD title (20-40 chars)}"

# === Ownership ===
role_owner: SA
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "sd-{PRX}-{NNN}"
filename_pattern: "sd-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: true

# === Search Optimization ===
keywords:
  - solution design
  - integration design
  - system design
  - component design
aliases:
  - design document
  - technical solution
anti_keywords:
  - architecture decision
  - business requirements
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Overview
    - Business Context
    - Solution
  optional_sections:
    - Alternatives
    - Risks
---

# Solution Design: `sd-{PRX}-{NNN}-{description}`

> **ID:** sd-PRX-XXX  
> **Product:** `<product-id>` (PRX)  
> **Target Feature:** `<f-PRX-XXX-feature-name>`  
> **Status:** draft | proposed | approved | implemented

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Solution Design (Canonical)  
**Lifecycle:** Permanent, versioned

---

## Metadata

| Field | Value |
| :--- | :--- |
| **SD ID** | sd-{PRX}-{NNN} |
| **Status** | Proposed / Accepted / Deprecated / Superseded |
| **Date** | YYYY-MM-DD |
| **Author** | [SA Name] |
| **Related Feature** | [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) |
| **Related TA** | [ta-{PRX}-{NNN}](../technical-architecture/ta-{PRX}-{NNN}-*.md) (if applicable) |

---

## 1. Overview

> **Contract:** What this solution accomplishes at a glance.  
> **Required precision:** One paragraph summary.  
> **Not this:** Full technical details (those go in Solution Architecture).

_Brief description of the solution design and what it accomplishes._

---

## 2. Business Context

> **Contract:** Business driver for this design.  
> **Required precision:** Link to Feature Canon and requirements.  
> **Not this:** Technical rationale (that goes in Design Rationale).

> Reference to Feature Canon and business requirements that drove this design.

_What business need or requirement triggered this design?_

---

## 3. Solution Architecture

### 3.1 Components

| Component | Purpose | Technology |
|-----------|---------|-----------|
| [Component A] | [Purpose] | [Tech Stack] |
| [Component B] | [Purpose] | [Tech Stack] |

### 3.2 Data Model

_ERD or conceptual data model showing entities and relationships._

### 3.3 Integration Points

_How this solution integrates with existing systems._

---

## 4. Design Rationale

### 4.1 Why This Design?

_Explain the reasoning behind design decisions._

### 4.2 Alternatives Considered

_What other approaches were evaluated and why they were rejected._

---

## 5. Trade-offs and Constraints

| Trade-off | Impact | Mitigation |
|-----------|--------|-----------|
| [Trade-off 1] | [Impact] | [How we handle it] |
| [Trade-off 2] | [Impact] | [How we handle it] |

---

## 6. Behavior Impact Assessment

> ⚠️ Does this design affect user-observable behavior?

### 6.1 User-Facing Changes

_What users will observe as a result of this design._

### 6.2 Feature Canon Updates Needed

_What sections of Feature Canon need updates to reflect this design._

---

## 7. Implementation Notes

### 7.1 Development Guidelines

_Key implementation guidance for the development team._

### 7.2 Testing Strategy

_How the design will be validated._

---

## 8. Related Documents

| Document | Purpose |
|----------|---------|
| [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) | Feature Canon |
| [ta-{PRX}-{NNN}](../technical-architecture/ta-{PRX}-{NNN}-*.md) | Technical Architecture (if applicable) |

---

## Review & Approval

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
