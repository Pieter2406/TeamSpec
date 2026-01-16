---
# === LLM Retrieval Metadata ===
artifact_kind: ta
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short TA title (20-40 chars)}"

# === Ownership ===
role_owner: SA
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "ta-{PRX}-{NNN}"
filename_pattern: "ta-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: true
    note: "Link to affected features"

# === Search Optimization ===
keywords:
  - technical architecture
  - ADR
  - architecture decision
  - constraints
  - patterns
  - technical design
aliases:
  - architecture document
  - technical decision record
anti_keywords:
  - business requirements
  - user behavior
  - story
  - feature behavior

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  required_sections:
    - Context
    - Decision
    - Consequences
  optional_sections:
    - Alternatives Considered
    - Related Decisions
---

# Technical Architecture: `ta-{PRX}-{NNN}-{description}`

<!--
  ⚠️ TECHNICAL ARCHITECTURE RULES

  Technical Architecture documents technical decisions and design approaches.

  RULES:
  1. Technical Architecture links to features they affect
  2. Technical Architecture links to business decisions that triggered them
  3. SA does NOT update Feature Canon directly - Technical Architecture informs FA
  4. If behavior is affected, FA must review Feature Canon

  NAMING PATTERN: ta-{PRX}-{NNN}-{description}.md
  EXAMPLE: ta-ACME-001-microservices.md

  TEAMSPEC RULES ENFORCED:
  - TS-TA-001: Technical Architecture required for architecture-impacting changes
  - TS-TA-002: Technical Architecture must link to affected features
-->

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Technical Architecture (Canonical)  
**Lifecycle:** Permanent, versioned

---

## Metadata

| Field | Value |
| :--- | :--- |
| **TA ID** | ta-{PRX}-{NNN} |
| **Product** | {product-id} ({PRX}) |
| **Status** | Proposed / Accepted / Deprecated / Superseded |
| **Date** | YYYY-MM-DD |
| **Author** | [SA Name] |
| **Superseded By** | [ta-{PRX}-{NNN} if applicable] |

---

## Context

> **Contract:** The technical situation requiring a decision.  
> **Required precision:** Problem statement, constraints, forces.  
> **Not this:** The solution itself or implementation details.

> What is the problem? Why do we need to make a technical decision?

[Describe the technical situation, constraints, and forces that require a decision.]

---

## Options Considered

### Option 1: [Option Name]

**Description**: [Brief description]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

### Option 2: [Option Name]

**Description**: [Brief description]

**Pros**:
- [Pro 1]

**Cons**:
- [Con 1]

---

## Decision

> **Contract:** The chosen option and why.  
> **Required precision:** Clear statement of choice with primary rationale.  
> **Not this:** Detailed implementation, code samples.

> We are choosing **Option X** because...

[Clear statement of the decision and primary rationale]

---

## Consequences

> **Contract:** Trade-offs accepted by this decision.  
> **Required precision:** Specific positive and negative impacts.  
> **Not this:** Vague "may impact performance" statements.

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Trade-off 1]
- [Trade-off 2]

---

## Related Decisions

<!-- TEAMSPEC RULE: Link to business decisions that triggered this Technical Architecture -->

| Decision ID | Decision Title | Relationship |
|-------------|----------------|--------------|
| [dec-{PRX}-{NNN}](../decisions/dec-{PRX}-{NNN}-*.md) | [Title] | Triggered by / Related to |

> If this Technical Architecture was triggered by a business decision, link it here.

---

## Affected Features

<!-- TEAMSPEC RULE: TS-TA-002 - Technical Architecture must link to features -->

> ⚠️ If this decision affects user-observable behavior, FA must review Feature Canon.

| Feature ID | Feature Name | Impact | Canon Review Needed? |
|------------|--------------|--------|---------------------|
| [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) | [Name] | [How this affects behavior] | Yes / No |

---

## Behavior Impact Assessment

> ⚠️ SA provides technical facts. FA translates to Feature Canon behavior.

### Does this Technical Architecture affect user-observable behavior?

- [ ] **No** — Internal/technical change only (no Canon update needed)
- [ ] **Yes** — Behavior implications described below

### Behavior Implications (if Yes)

| Technical Decision | Behavior Implication | FA Action |
|--------------------|---------------------|-----------|
| [e.g., Rate limit: 100 req/min] | [e.g., System rejects excess requests] | FA adds to Canon |

> **Workflow:**
> 1. SA creates Technical Architecture with technical constraints
> 2. Technical Architecture may imply behavior constraints
> 3. FA incorporates constraints into Feature Canon
> 4. FA owns the behavioral wording

---

## Examples of Behavior-Impacting Decisions

✅ **Include in Feature Impact** (FA must review Canon):
- Changing how errors are reported to users
- Adding/removing functionality constraints
- Changing performance characteristics users observe
- Changing access control or permissions

❌ **Usually no Feature Impact**:
- Internal refactoring (no user-observable change)
- Technology stack decisions (if behavior unchanged)
- Database optimization (if behavior unchanged)

---

## Documentation Trail

This Technical Architecture is referenced in Feature Canon Change Log when it affects documented behavior:

> ta-{PRX}-{NNN}: [Title] — Added [feature capability / constraint]

This maintains traceability between architecture and product behavior.

---

## Implementation Notes

_Technical details for DEV team._

- [Implementation note 1]
- [Implementation note 2]

---

## Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | [Name] | ✅ | YYYY-MM-DD |
| Tech Lead | [Name] | ⏳ | |
| FA (if behavior affected) | [Name] | ⏳ | |

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-TA-001 | Technical Architecture required for architecture-impacting changes |
| TS-TA-002 | Technical Architecture must link to affected features |
