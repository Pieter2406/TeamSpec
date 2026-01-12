---
# === LLM Retrieval Metadata ===
artifact_kind: decision
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: PO
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "dec-{PRX}-{NNN}"
filename_pattern: "dec-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature
    pattern: "f-{PRX}-{NNN}"
    optional: false
    note: "Must link to affected features"

# === Search Optimization ===
keywords:
  - decision
  - business decision
  - rationale
  - scope decision
  - priority decision
aliases:
  - decision record
  - decision log entry
anti_keywords:
  - technical architecture
  - implementation
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Context
    - Decision
    - Impact
  optional_sections:
    - Alternatives Considered
---

# Decision: `dec-{PRX}-{NNN}-{description}`

<!--
  ⚠️ DECISION LOG RULES

  Product-level business decisions must be logged and linked to affected features.

  RULES:
  1. Decisions must link to at least one feature
  2. PO owns product decisions (not BA)
  3. Decisions that affect scope require feature review
  4. Cross-feature decisions require SA acknowledgment

  NAMING PATTERN: dec-{PRX}-{NNN}-{description}.md
  EXAMPLE: dec-ACME-001-payment-provider.md

  TEAMSPEC RULES ENFORCED:
  - TS-DEC-001: Decision must link to features
-->

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** PO (Product Owner)
**Artifact Type:** Product Decision (Canonical)
**Lifecycle:** Permanent

---

## Metadata

| Field | Value |
|-------|-------|
| **Decision ID** | dec-{PRX}-{NNN} |
| **Product** | {product-id} ({PRX}) |
| **Date Proposed** | YYYY-MM-DD |
| **Date Confirmed** | YYYY-MM-DD (or "Pending") |
| **Decision Owner** | PO (Product Owner) |
| **Facilitator** | [BA Name] |
| **Status** | Proposed / Confirmed / Superseded |
| **Type** | Reversible / Costly / Irreversible |
| **Severity** | Minor / Major / Critical |
| **Scope** | Feature / Cross-Feature / Product |
| **Superseded By** | [dec-{PRX}-{NNN} if applicable] |

---

## Context

> **Contract:** Business context and constraints that led to this decision.  
> **Required precision:** Specific situation, stakeholders, and drivers.  
> **Not this:** The decision itself or technical implementation.

## Context

_What situation or problem prompted this decision?_

[Describe the business situation, trigger event, or problem that requires a decision.]

**Background**:
- [Context point 1]
- [Context point 2]

**Stakeholders Involved**:
- [Name/Role]
- [Name/Role]

---

## Decision

_What did we decide? State explicitly and unambiguously._

**Decision Statement**:

[Clear, action-oriented statement of what was decided.]

**In Scope** (as a result of this decision):
- [ ] [Capability/feature/behavior 1]
- [ ] [Capability/feature/behavior 2]

**Out of Scope** (explicitly excluded):
- [ ] [What we explicitly chose NOT to do]
- [ ] [Deferred items]

---

## Impacted Features

<!-- TEAMSPEC RULE: TS-DEC-001 - Decision must link to features -->

> ⚠️ At least one feature must be linked.
> If this decision doesn't impact any feature, it may not need to be logged.

| Feature ID | Feature Name | Impact Description |
|------------|--------------|-------------------|
| [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) | [Feature Name] | [Scoped in / Scoped out / Behavior changed / Priority set] |

---

## Alternatives Considered

### Option 1: [Alternative Name]

**Description**: [Brief description]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

**Why Rejected**: [Reason]

### Option 2: [Alternative Name]

**Description**: [Brief description]

**Pros**:
- [Pro 1]

**Cons**:
- [Con 1]

**Why Rejected**: [Reason]

---

## Consequences

### Positive Consequences
- [Benefit 1]
- [Benefit 2]

### Negative Consequences (Trade-offs)
- [Trade-off 1]
- [Trade-off 2]

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [Mitigation] |

---

## Reversal Cost

_What would it cost to reverse this decision later?_

**Effort**: [Time estimate]  
**Cost**: [Financial or resource cost]  
**Risk**: [Technical debt, user impact]

**Reversal Difficulty**: Low / Medium / High / Irreversible

---

## Architecture Acknowledgment

> **Required if**: Type = `Irreversible` OR Scope = `Cross-Feature` / `Product`

| Field | Value |
|-------|-------|
| **Acknowledged By** | [SA Name] |
| **Date** | YYYY-MM-DD |
| **Assessment** | No Impact / Requires TA / Approved |
| **TA Reference** | [ta-{PRX}-{NNN}](../technical-architecture/ta-{PRX}-{NNN}-*.md) (if required) |

**Architecture Notes**:
[SA assessment of technical implications]

---

## Confirmation Record

_Stakeholder confirmation that decision is accurate and approved._

| Stakeholder | Role | Confirmed? | Date | Notes |
|-------------|------|------------|------|-------|
| [Name] | [Role] | ✅ / ⏳ / ❌ | YYYY-MM-DD | |

**Confirmation Method**: [Email / Meeting / Async]  
**Review Window**: [X days from Date Proposed]

---

## References

### Business Analysis

| Document | Link | Relevant Section |
|----------|------|------------------|
| [BA Title] | [Link] | [Section] |

### Related Feature-Increments (if applicable)

| FI ID | Description | Relationship |
|-------|-------------|--------------|
| [fi-{PRX}-{NNN}](../../projects/{project-id}/feature-increments/fi-{PRX}-{NNN}-*.md) | [Brief description] | Created from this decision |

### Related Decisions

| Decision ID | Relationship |
|-------------|--------------|
| [dec-{PRX}-{NNN}] | Depends on / Superseded by / Related to |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Initial decision recorded | [Name] |

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-DEC-001 | Decision must link to at least one feature |
