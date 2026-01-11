# Definition of Ready (DoR)

> **Version:** 4.0  
> **Status:** Normative  
> **Owner:** FA (gates story readiness)  
> **Verifier:** SM (enforces in sprint planning)  
> **Source:** [registry.yml](../registry.yml)

A story is **Ready** for development when ALL of the following are satisfied.

---

## Mandatory Checklist

Before a story enters `in-progress/`:

### 1. Epic Link ✓

| Check | Required |
|-------|----------|
| Story linked to Epic via filename (`s-eXXX-YYY-*.md`) | ✓ |
| Epic file exists in `projects/{project-id}/epics/` | ✓ |

**Linter Rule:** `TS-STORY-001` — Epic link required

### 2. Feature-Increment Reference ✓

| Check | Required |
|-------|----------|
| Story references a Feature-Increment (`fi-PRX-NNN-*.md`) | ✓ |
| Feature-Increment file exists in `projects/{project-id}/feature-increments/` | ✓ |
| Feature-Increment has AS-IS section (current Canon state) | ✓ |
| Feature-Increment has TO-BE section (proposed change) | ✓ |

**Linter Rule:** `TS-FI-001` — AS-IS/TO-BE required

### 3. Acceptance Criteria ✓

| Check | Required |
|-------|----------|
| All ACs are testable (Given/When/Then or clear assertions) | ✓ |
| No ambiguous terms ("should work well", "user-friendly") | ✓ |
| ACs describe the delta (change), not full feature behavior | ✓ |

**Linter Rule:** `TS-STORY-003` — ACs must be testable

### 4. No Placeholders ✓

| Check | Required |
|-------|----------|
| No TBD/TODO/placeholder content in story | ✓ |
| No TBD/TODO content in linked Feature-Increment | ✓ |

**Linter Rule:** `TS-CONTENT-001` — No placeholder content

### 5. Estimate Assigned ✓

| Check | Required |
|-------|----------|
| Story has estimate (points or time) | ✓ |
| Estimate is realistic based on dev plan | ✓ |

---

## Enforcement

| Actor | Responsibility |
|-------|----------------|
| FA | Creates story, ensures all content is complete |
| SM | Verifies checklist before sprint planning |
| Linter | Automated validation via `teamspec lint` |

---

## Related

- [Definition of Done](definition-of-done.md)
- [Gates Overview](../gates.md)
- [Registry (Source of Truth)](../registry.yml)
