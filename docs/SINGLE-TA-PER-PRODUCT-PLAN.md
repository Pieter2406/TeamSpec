# Single Technical Architecture Per Product

> **Status:** 📋 Proposed  
> **Created:** 2026-01-17  
> **Spec Version:** 4.0

---

## 🎯 Proposal Summary

**Rule:** Each product has exactly ONE Technical Architecture document with a simplified naming pattern: `ta-{PRX}.md`. Sub-documents are allowed for organizational convenience using the pattern `ta-{PRX}-{topic}.md`.

---

## 📋 Current State (AS-IS)

The current spec allows multiple TA documents per product:

| Location | Pattern | Current Behavior |
|----------|---------|------------------|
| `products/{product-id}/technical-architecture/` | `ta-{PRX}-{NNN}-{description}.md` | Multiple TAs allowed (NNN = 001, 002, ...) |

**Source:** [spec/4.0/artifacts.md](../spec/4.0/artifacts.md) line 26

---

## 📋 Proposed State (TO-BE)

### New Naming Pattern

| Type | Pattern | Example |
|------|---------|---------|
| **Primary TA** | `ta-{PRX}.md` | `ta-ACME.md` |
| **Sub-document** | `ta-{PRX}-{topic}.md` | `ta-ACME-authentication.md` |

### New Rules

1. **One primary TA per product:** `ta-{PRX}.md` (required, singleton)
2. **Sub-documents allowed:** `ta-{PRX}-{topic}.md` for organizational convenience
3. **No NNN numbering:** TA does not use sequential numbering (unlike features, stories, etc.)
4. **Links always use:** `ta-{PRX}` as the canonical reference

### Rationale

- Technical Architecture should be a **unified view** of the product's technical decisions
- Simplified naming (`ta-ACME` vs `ta-ACME-001-microservices`) is cleaner
- No ambiguity — always one canonical TA per product
- Sub-documents allow breakdown without losing single-source-of-truth
- Increments (`tai-{PRX}-{NNN}`) in projects handle proposed changes

---

## 📋 Impact Analysis

### Files to Update

| File | Change Required |
|------|-----------------|
| `spec/4.0/registry.yml` | Change TA naming from `ta-{PRX}-{NNN}-{description}.md` to `ta-{PRX}.md` |
| `spec/4.0/artifacts.md` | Update TA pattern and example |
| `spec/4.0/roles.md` | Update SA owns references |
| `spec/4.0/commands.md` | Update `ts:sa ta` output pattern |
| `spec/4.0/model.md` | Update mermaid diagram reference |
| `spec/4.0/workflows.md` | Update TAI → TA sync pattern |
| `spec/4.0/agent-index.md` | Update TA pattern |
| `spec/4.0/lint-rules.md` | Add lint rule for TA singleton and naming |
| `cli/lib/linter.js` | Implement TA cardinality and naming check |
| `agents/AGENT_SA.md` | Update to enforce single-TA guidance |
| `templates/ta-template.md` | Update naming pattern and sub-document guidance |
| `templates/tai-template.md` | Update target TA reference pattern |
| `templates/sd-template.md` | Update related TA link pattern |
| `templates/decision-log-template.md` | Update TA reference pattern |
| `templates/products-index-template.md` | Update TA pattern comment |

### New Lint Rules

```yaml
TS-TA-001:
  severity: ERROR
  message: "Product {PRX} must have exactly one primary TA: ta-{PRX}.md"
  check: exists(ta-{PRX}.md) AND count(ta-{PRX}.md) == 1

TS-TA-002:
  severity: ERROR  
  message: "Invalid TA naming. Use ta-{PRX}.md for primary or ta-{PRX}-{topic}.md for sub-documents"
  check: filename matches /^ta-[A-Z]{3,4}(-[a-z0-9-]+)?\.md$/

TS-TA-003:
  severity: WARNING
  message: "TA sub-document ta-{PRX}-{topic}.md should be referenced from primary ta-{PRX}.md"
  check: sub-document is linked from primary TA
```

### Link Pattern Updates

All references to TAs should use the simplified pattern:

| Context | Old Pattern | New Pattern |
|---------|-------------|-------------|
| Inline reference | `ta-ACME-001` | `ta-ACME` |
| File link | `[ta-ACME-001](../ta-ACME-001-microservices.md)` | `[ta-ACME](../ta-ACME.md)` |
| TAI target | `ta-ACME-001-microservices` | `ta-ACME` |
| SD related | `ta-{PRX}-{NNN}` | `ta-{PRX}` |

---

## 📋 Migration Guide

For existing products with TA documents:

1. Identify the primary TA
2. Rename to `ta-{PRX}.md`
3. Convert secondary TAs to sub-documents: `ta-{PRX}-{topic}.md`
4. Update all cross-references from `ta-{PRX}-{NNN}` to `ta-{PRX}`
5. Update TAI documents to target `ta-{PRX}`

---

## 📋 Implementation Checklist

### Spec Files
- [ ] **IMPL-01** `spec/4.0/registry.yml` — Update TA artifact naming pattern
- [ ] **IMPL-02** `spec/4.0/artifacts.md` — Update TA row in artifact table
- [ ] **IMPL-03** `spec/4.0/roles.md` — Update SA ownership references
- [ ] **IMPL-04** `spec/4.0/commands.md` — Update `ts:sa ta` output
- [ ] **IMPL-05** `spec/4.0/model.md` — Update mermaid diagram
- [ ] **IMPL-06** `spec/4.0/workflows.md` — Update TAI sync pattern
- [ ] **IMPL-07** `spec/4.0/agent-index.md` — Update TA pattern
- [ ] **IMPL-08** `spec/4.0/lint-rules.md` — Add TS-TA-001, TS-TA-002, TS-TA-003

### Templates
- [ ] **IMPL-09** `templates/ta-template.md` — Update naming and add sub-doc guidance
- [ ] **IMPL-10** `templates/tai-template.md` — Update target TA reference
- [ ] **IMPL-11** `templates/sd-template.md` — Update related TA link
- [ ] **IMPL-12** `templates/decision-log-template.md` — Update TA reference
- [ ] **IMPL-13** `templates/products-index-template.md` — Update TA comment

### CLI/Linter
- [ ] **IMPL-14** `cli/lib/linter.js` — Implement TA singleton check
- [ ] **IMPL-15** `cli/lib/linter.js` — Implement TA naming validation

### Agents
- [ ] **IMPL-16** `agents/AGENT_SA.md` — Update single-TA guidance

---

## 📋 Open Questions

1. Should Solution Designs (`sd-*`) follow a similar singleton pattern?
2. How to handle products that legitimately need separate TAs (e.g., monorepo with multiple services)?
   - **Proposed:** Use sub-documents `ta-{PRX}-{service}.md` that are all linked from the primary `ta-{PRX}.md`

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | — | Simplified naming to `ta-{PRX}.md`, added comprehensive file list |
| 2026-01-17 | — | Initial proposal created |
| 2026-01-17 | — | Initial proposal created |
