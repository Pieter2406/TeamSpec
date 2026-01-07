# DEC-XXX: [Decision Title]

<!-- 
  ⚠️ DECISION LOG RULES
  
  Business decisions must be logged and linked to affected features.
  
  RULES:
  1. Decisions must link to at least one feature
  2. BA owns business decisions
  3. Decisions that affect scope require feature review
  4. Cross-feature decisions require SA acknowledgment
  
  TEAMSPEC RULES ENFORCED:
  - TS-DEC-001: Decision must link to features
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** BA (Business Analyst)  
**Artifact Type:** Business Decision (Canonical)  
**Lifecycle:** Permanent

---

## Metadata

| Field | Value |
|-------|-------|
| **Decision ID** | DEC-XXX |
| **Date Proposed** | YYYY-MM-DD |
| **Date Confirmed** | YYYY-MM-DD (or "Pending") |
| **Decision Owner(s)** | [Stakeholder Name(s)] |
| **Facilitator** | [BA Name] |
| **Status** | Proposed / Confirmed / Superseded |
| **Type** | Reversible / Costly / Irreversible |
| **Severity** | Minor / Major / Critical |
| **Scope** | Feature / Cross-Feature / Product |
| **Superseded By** | [DEC-YYY if applicable] |

---

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
| [F-XXX](../features/F-XXX-name.md) | [Feature Name] | [Scoped in / Scoped out / Behavior changed / Priority set] |

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
| **Assessment** | No Impact / Requires ADR / Approved |
| **ADR Reference** | [ADR-XXX](../adr/ADR-XXX-*.md) (if required) |

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

### Related Stories (if applicable)

| Story ID | Story Title | Relationship |
|----------|-------------|--------------|
| [S-XXX](../stories/*/S-XXX-*.md) | [Title] | Created from this decision |

### Related Decisions

| Decision ID | Relationship |
|-------------|--------------|
| [DEC-YYY] | Depends on / Superseded by / Related to |

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
