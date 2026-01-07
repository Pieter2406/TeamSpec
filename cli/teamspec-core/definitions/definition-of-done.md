# Definition of Done (DoD)

> **Version:** 2.0  
> **Owner:** QA (validates completeness), SM (enforces at sprint close)

A story is **Done** when ALL of the following are satisfied.

---

## Mandatory Checklist

### 1. Code Complete ✓

| Check | Required |
|-------|----------|
| All tasks in dev plan marked complete | ✓ |
| Code merged to main/develop branch | ✓ |
| No outstanding TODOs in code (for this story) | ✓ |

### 2. Tests Pass ✓

| Check | Required |
|-------|----------|
| Unit tests written and passing | ✓ |
| Integration tests passing (if applicable) | ✓ |
| Test coverage meets team threshold | ✓ |

**Linter Rule:** `TS-DOD-002` — Tests are feature-level

### 3. Code Reviewed ✓

| Check | Required |
|-------|----------|
| Pull request reviewed and approved | ✓ |
| All review comments addressed | ✓ |
| CI/CD pipeline passing | ✓ |

### 4. Acceptance Criteria Verified ✓

| Check | Required |
|-------|----------|
| All ACs tested and passing | ✓ |
| QA sign-off obtained | ✓ |
| No critical bugs outstanding | ✓ |

### 5. Feature Canon Updated ✓ (CRITICAL)

| Check | Required |
|-------|----------|
| Feature file updated to reflect new behavior | ✓ |
| Change Log entry added with story reference | ✓ |
| Story Ledger updated | ✓ |
| FA verified Canon sync | ✓ |

**Linter Rule:** `TS-DOD-001` — Canon sync required before Done

> ⚠️ **A story CANNOT be Done if it changes behavior and the Feature Canon is NOT updated.**

---

## Canon Sync Process

Before marking a story Done:

1. **FA runs `ts:fa sync`** — Updates Feature Canon
2. **FA updates Change Log** — Links to story ID
3. **FA updates Story Ledger** — Records in `features/story-ledger.md`
4. **QA verifies** — Tests match updated Canon

### Change Log Entry Format

```markdown
| Date | Story | Change Summary | Author |
|------|-------|----------------|--------|
| YYYY-MM-DD | S-XXX | Brief description | FA Name |
```

### Story Ledger Entry Format

```markdown
| Story ID | Title | Sprint | Features Modified | Merged Date |
|----------|-------|--------|-------------------|-------------|
| S-XXX | Story title | Sprint N | F-001, F-002 | YYYY-MM-DD |
```

---

## Optional (Profile-Dependent)

These checks apply based on team profile:

### Regulated Profile

| Check | Applies To |
|-------|------------|
| Compliance checklist signed off | regulated |
| Audit trail documented | regulated |
| Release notes updated | regulated |

### Enterprise Profile

| Check | Applies To |
|-------|------------|
| Documentation updated | enterprise |
| Stakeholder notification sent | enterprise |

---

## Sprint Close Verification

At sprint close, SM verifies:

| Check | Owner |
|-------|-------|
| All "Done" stories have Canon sync | SM |
| Story Ledger is current | FA |
| No orphan stories (behavior change without Canon update) | QA |

---

## Quick Reference

```
DoD = Code + Tests + Review + ACs + Feature Canon Updated
```

**Most Common Failure:** Story marked "Done" without updating Feature Canon.

If Canon is not updated, the story is **NOT DONE**.
