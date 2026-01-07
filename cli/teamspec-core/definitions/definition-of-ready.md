# Definition of Ready (DoR)

> **Version:** 2.0  
> **Owner:** FA (gates story readiness), SM (enforces in sprint planning)

A story is **Ready** for development when ALL of the following are satisfied.

---

## Mandatory Checklist

### 1. Feature Canon Link ✓

| Check | Required |
|-------|----------|
| Story links to existing Feature(s) in Feature Canon | ✓ |
| Feature file exists in `features/` folder | ✓ |
| Feature link uses correct format: `[F-XXX](../../features/F-XXX-name.md)` | ✓ |

**Linter Rule:** `TS-STORY-001` — Feature link required

### 2. Delta Format ✓

| Check | Required |
|-------|----------|
| Story uses Before/After delta format | ✓ |
| "Before" section references Feature Canon | ✓ |
| "After" section describes ONLY the change | ✓ |
| Story does NOT restate full feature behavior | ✓ |

**Linter Rule:** `TS-STORY-002` — Delta-only format required

### 3. Acceptance Criteria ✓

| Check | Required |
|-------|----------|
| All ACs are testable (Given/When/Then or clear assertions) | ✓ |
| No ambiguous terms ("should work well", "user-friendly") | ✓ |
| ACs cover the delta, not the entire feature | ✓ |

**Linter Rule:** `TS-STORY-003` — ACs must be testable

### 4. FA Acceptance Gate ✓

| Check | Required |
|-------|----------|
| FA has reviewed and initialed the story | ✓ |
| FA confirms delta is correctly scoped | ✓ |
| FA confirms feature link is correct | ✓ |

**Gate:** FA Acceptance section complete in story

### 5. Dev Plan Exists ✓

| Check | Required |
|-------|----------|
| Dev plan file exists in `dev-plans/` | ✓ |
| Story links to dev plan | ✓ |
| Dev plan has no TBD/TODO items | ✓ |

**Linter Rule:** `TS-DEVPLAN-001` — Dev plan required before implementation

---

## Optional (Profile-Dependent)

These checks apply based on team profile:

### Regulated Profile

| Check | Applies To |
|-------|------------|
| Risk assessment completed | regulated |
| Compliance impact documented | regulated |
| Sign-off from compliance officer | regulated |

### Enterprise Profile

| Check | Applies To |
|-------|------------|
| Architecture review completed | enterprise |
| Cross-team dependencies identified | enterprise |

---

## Workflow Gate

Stories MUST be in `stories/ready-for-development/` folder to enter sprint.

| From Folder | To Folder | Owner |
|-------------|-----------|-------|
| `backlog/` | `ready-to-refine/` | FA |
| `ready-to-refine/` | `ready-for-development/` | DEV (after refinement) |
| `ready-for-development/` | Sprint | SM (sprint planning) |

---

## Quick Reference

```
DoR = Feature Link + Delta Format + Testable ACs + FA Gate + Dev Plan
```

If any check fails, the story is **NOT READY** for development.
