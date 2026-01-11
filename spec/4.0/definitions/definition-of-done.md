# Definition of Done (DoD)

> **Version:** 4.0  
> **Status:** Normative  
> **Owner:** FA (gates story completion)  
> **Verifier:** QA (validates acceptance criteria)  
> **Source:** [registry.yml](../registry.yml)

A story is **Done** when ALL of the following are satisfied.

---

## Mandatory Checklist

Before a story moves to `done/`:

### 1. Acceptance Criteria Verified ✓

| Check | Required |
|-------|----------|
| All ACs tested and passing | ✓ |
| QA sign-off obtained | ✓ |
| No critical bugs outstanding | ✓ |

### 2. Code Complete ✓

| Check | Required |
|-------|----------|
| Code reviewed and approved | ✓ |
| Code merged to main/develop branch | ✓ |
| CI/CD pipeline passing | ✓ |

### 3. Tests Passing ✓

| Check | Required |
|-------|----------|
| Unit tests written and passing | ✓ |
| Integration tests passing (if applicable) | ✓ |
| All automated tests green | ✓ |

### 4. Feature-Increment Complete ✓

| Check | Required |
|-------|----------|
| Feature-Increment TO-BE section complete | ✓ |
| TO-BE accurately reflects implemented behavior | ✓ |
| Ready for deployment | ✓ |

**Note:** Feature-Increment TO-BE is merged into Product Canon AFTER deployment via `ts:po sync`.

---

## What Done Does NOT Include

| Action | When It Happens |
|--------|-----------------|
| Deployment to production | After DoD, during sprint close |
| Canon sync (`ts:po sync`) | After deployment + QA verification |
| Regression test update | At Deployment Verification Gate |

> ⚠️ **Canon is NEVER updated at DoD.** Canon sync happens POST-DEPLOY only.

---

## Enforcement

| Actor | Responsibility |
|-------|----------------|
| FA | Marks story Done after QA verification |
| QA | Verifies all ACs, provides sign-off |
| DEV | Ensures code complete and merged |
| Linter | Automated validation via `teamspec lint` |

---

## Story State Flow

```
backlog/ → ready-to-refine/ → in-progress/ → done/
                   ↑                          │
                 DoR gate                   DoD gate
```

After `done/`, story proceeds to deployment and eventually Canon sync.

---

## Related

- [Definition of Ready](definition-of-ready.md)
- [Gates Overview](../gates.md)
- [Registry (Source of Truth)](../registry.yml)
