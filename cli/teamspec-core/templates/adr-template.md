# ADR-XXX: [Decision Title]

<!--
  ⛔ DEPRECATED TEMPLATE - DO NOT USE

  This template is DEPRECATED as of TeamSpec 4.0.

  USE INSTEAD: ta-template.md (Technical Architecture)

  REASON: TeamSpec 4.0 renamed "ADR" to "Technical Architecture" (TA)
  - Artifact naming: ta-{PRX}-{NNN}-{description}.md
  - Commands: ts:sa ta (not ts:sa adr)

  The commands ts:sa design and ts:sa adr were REMOVED in 4.0.
  See: spec/4.0/registry.yml commands section (REMOVED commands)

  See: spec/4.0/registry.yml for correct artifact patterns
-->

> **Template Version**: 2.0 (DEPRECATED)
> **Last Updated**: 2026-01-07
> **Status**: ⛔ DEPRECATED - Use ta-template.md instead

---

**Document Owner:** SA (Solution Architect)
**Artifact Type:** Technical Decision (DEPRECATED - use Technical Architecture)
**Lifecycle:** Permanent, versioned

---

## Metadata

| Field | Value |
| :--- | :--- |
| **ADR ID** | ADR-XXX |
| **Status** | Proposed / Accepted / Deprecated / Superseded |
| **Date** | YYYY-MM-DD |
| **Author** | [SA Name] |
| **Superseded By** | [ADR-YYY if applicable] |

---

## Context

> What is the problem? Why do we need to make a decision?

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

> We are choosing **Option X** because...

[Clear statement of the decision and primary rationale]

---

## Consequences

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Trade-off 1]
- [Trade-off 2]

---

## Related Decisions

<!-- TEAMSPEC RULE: Link to business decisions that triggered this ADR -->

| Decision ID | Decision Title | Relationship |
|-------------|----------------|--------------|
| [DEC-XXX](../decisions/DEC-XXX-*.md) | [Title] | Triggered by / Related to |

> If this ADR was triggered by a business decision, link it here.

---

## Affected Features

<!-- TEAMSPEC RULE: TS-ADR-002 - ADR must link to features -->

> ⚠️ If this decision affects user-observable behavior, FA must review Feature Canon.

| Feature ID | Feature Name | Impact | Canon Review Needed? |
|------------|--------------|--------|---------------------|
| [F-XXX](../features/F-XXX-name.md) | [Name] | [How this affects behavior] | Yes / No |

---

## Behavior Impact Assessment

> ⚠️ SA provides technical facts. FA translates to Feature Canon behavior.

### Does this ADR affect user-observable behavior?

- [ ] **No** — Internal/technical change only (no Canon update needed)
- [ ] **Yes** — Behavior implications described below

### Behavior Implications (if Yes)

| Technical Decision | Behavior Implication | FA Action |
|--------------------|---------------------|-----------|
| [e.g., Rate limit: 100 req/min] | [e.g., System rejects excess requests] | FA adds to Canon |

> **Workflow:**
> 1. SA creates ADR with technical constraints
> 2. ADR may imply behavior constraints
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

This ADR is referenced in Feature Canon Change Log when it affects documented behavior:

> ADR-XXX: [Title] — Added [feature capability / constraint]

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
| TS-ADR-001 | ADR required for architecture-impacting changes |
| TS-ADR-002 | ADR must link to affected features |
