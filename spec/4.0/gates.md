# TeamSpec 4.0 Quality Gates

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Gate Overview

| Gate | Owner | Verifier | Approver | When |
|------|-------|----------|----------|------|
| DoR | FA | SM | — | Before story enters development |
| DoD | FA | QA | — | Before story marked complete |
| Deployment | SM | QA | PO | Before production deployment |
| Canon Sync | PO | — | — | After deployment |

---

## Definition of Ready (DoR)

**Owner:** FA  
**Verifier:** SM

### Checklist

Before a story enters `in-progress/`:

- [ ] Story linked to Epic via filename (`s-eXXX-YYY-*.md`)
- [ ] Feature-Increment exists and has AS-IS/TO-BE sections
- [ ] Acceptance Criteria are testable
- [ ] No TBD/placeholder content
- [ ] Estimate assigned

### Enforcement

- Linter rule: `TS-STORY-001` (Epic link required)
- Linter rule: `TS-FI-001` (AS-IS/TO-BE required)
- SM verifies before sprint planning

---

## Definition of Done (DoD)

**Owner:** FA  
**Verifier:** QA

### Checklist

Before a story moves to `done/`:

- [ ] All Acceptance Criteria verified by QA
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] Feature-Increment TO-BE section complete
- [ ] Ready for deployment

### Enforcement

- Linter rule: `TS-DOD-001` (AC verification)
- QA sign-off required
- PR merge gates

---

## Deployment Gate

**Owner:** SM  
**Approver:** PO  
**Verifier:** QA

### Checklist

Before `ts:po sync`:

- [ ] All sprint stories in terminal state (Done/Deferred/Out-of-Scope)
- [ ] All Feature-Increments reviewed
- [ ] QA sign-off obtained
- [ ] **Regression coverage confirmed** (rt-f-* updated OR "no impact" recorded)
- [ ] Code deployed to production
- [ ] Smoke tests passed

### Trigger

SM runs `ts:sm deploy-checklist`

### Enforcement

- SM generates checklist
- QA verifies each item
- PO approves final deployment

---

## Canon Sync Gate

**Owner:** PO

### Precondition

Deployment gate MUST be passed.

### Action

```
ts:po sync
```

### Effect

Feature-Increment TO-BE sections are merged into Product Feature Canon:
- `fi-PRX-NNN-*.md` TO-BE → `f-PRX-NNN-*.md` updated

### Timing

**POST-DEPLOY ONLY**

Canon is NEVER updated before deployment. This ensures:
1. Product Canon always reflects production behavior
2. No "documentation debt" from undeployed features
3. Clear audit trail of what's deployed vs. proposed

---

## QA Two-Layer Model

### Project Test Cases

- **Location:** `projects/{project-id}/qa/test-cases/`
- **Pattern:** `tc-fi-PRX-NNN-*.md`
- **Targets:** Feature-Increment validation
- **Owner:** QA

### Product Regression Tests

- **Location:** `products/{product-id}/qa/regression-tests/`
- **Pattern:** `rt-f-PRX-NNN-*.md`
- **Targets:** Feature regression coverage
- **Owner:** QA

### Promotion Rule

At deployment gate, QA must confirm regression coverage is updated:

1. For each `fi-PRX-NNN` delivered, either:
   - Update/create `rt-f-PRX-NNN-*` regression docs, OR
   - Record "no regression impact" explicitly

2. Linter rule `TS-QA-001` enforces coverage check

---

## Gate Ownership Summary

| Artifact/Decision | Owner | Verifier | Approver |
|-------------------|-------|----------|----------|
| Story ready for dev | FA | SM | — |
| Story complete | FA | QA | — |
| Code deployable | SM | QA | PO |
| Canon update | PO | — | — |
| Regression coverage | QA | — | — |
