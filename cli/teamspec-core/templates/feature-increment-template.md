---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short FI title (20-40 chars)}"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-{PRX}-{NNN}"
filename_pattern: "fi-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: false
    note: "Target feature that this FI modifies"
  - type: epic
    pattern: "epic-{PRX}-{NNN}"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - FI
  - proposed change
  - AS-IS TO-BE
  - delta proposal
  - change proposal
aliases:
  - change request
  - feature delta
  - enhancement proposal
anti_keywords:
  - production truth
  - current state
  - canon
  - implementation details
  - code

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  id_generation: "Use product PRX; NNN is sequential within project"
  as_is_rule: "AS-IS must match current Feature Canon exactly"
  to_be_rule: "TO-BE describes proposed state, not implementation"
  required_sections:
    - Overview
    - AS-IS (Current State)
    - TO-BE (Proposed State)
    - Impact Analysis
  optional_sections:
    - Implementation Notes
---

# Feature Increment: `fi-{PRX}-{NNN}-{description}`

<!--
  ⚠️ TEAMSPEC 4.0 FEATURE-INCREMENT TEMPLATE
  
  Feature-Increments propose changes to Product Canon.
  They bridge the gap between current (AS-IS) and proposed (TO-BE) state.
  
  RULES:
  - Must link to target Feature (f-PRX-XXX)
  - AS-IS must reflect current Feature Canon
  - TO-BE becomes Feature Canon after deployment + sync
  
  TEAMSPEC RULES ENFORCED:
  - TS-FI-001: Must link to existing Feature
  - TS-FI-002: AS-IS/TO-BE sections required
  - TS-FI-003: TO-BE must be complete before sync
-->

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-12

---

> **ID:** fi-{PRX}-{NNN}  
> **Product:** `{product-id}` ({PRX})  
> **Target Feature:** `f-{PRX}-{NNN}-{feature-name}`  
> **Epic:** `epic-{PRX}-{NNN}` _(link when assigned)_  
> **Status:** draft | proposed | approved | implemented | synced

---

## 1. Overview

> **Contract:** Brief description of what this increment changes (1-3 sentences).  
> **Required precision:** Focus on the capability change, not implementation.  
> **Not this:** Full feature description, technical approach, or story-level details.

_{Brief description of what this increment changes.}_

---

## 2. AS-IS (Current State)

> **Contract:** Exact copy of relevant sections from Product Feature Canon.  
> **Required precision:** Must match f-{PRX}-{NNN} verbatim.  
> **Not this:** Paraphrased content, proposed changes, or assumed behavior.
>
> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

_Copy relevant sections from the Product Feature Canon._

### 2.2 Current Limitations

_What can't the current system do that this increment addresses?_

---

## 3. TO-BE (Proposed State)

> **Contract:** Describes what the feature WILL do after implementation and sync.  
> **Required precision:** Testable statements; will become Feature Canon.  
> **Not this:** Implementation details, vague goals, or incomplete descriptions.

### 3.1 New/Changed Behavior

_Describe what the feature WILL do after this increment is implemented._

### 3.2 Acceptance Criteria

- [ ] AC-1: _Testable criterion_
- [ ] AC-2: _Testable criterion_
- [ ] AC-3: _Testable criterion_

### 3.3 Out of Scope

_Explicitly state what this increment does NOT include._

---

## 4. Impact Analysis

> **Contract:** Identifies all features affected and dependencies.  
> **Required precision:** Feature IDs, impact types, risk assessment.  
> **Not this:** Vague statements or missing dependency analysis.

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-{PRX}-{NNN} | Modified | _What changes_ |
| f-{PRX}-{NNN} | Referenced | _No change, just dependency_ |

### 4.2 Dependencies

_Other increments or features this depends on._

### 4.3 Risks

_What could go wrong? How will we mitigate?_

---

## 5. Implementation Notes

### 5.1 Technical Considerations

_High-level technical approach (SA input)._

### 5.2 Testing Strategy

_How will this be validated? (QA input)._

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
