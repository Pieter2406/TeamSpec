# TeamSpec 4.0 Review Findings

> **Date:** 2026-01-11  
> **Reviewer:** Automated Review Agent  
> **Scope:** Full review per `00-review-plan.md`

---

## Executive Summary

The codebase is **functionally 4.0** (CLI creates products/projects structure, linter enforces TS-PROD/TS-FI rules), but **documentation and agent prompts are internally inconsistent**, creating unreliable agent behavior and confusing user guidance.

### Critical Issues (Fix Before Shipping)

| # | Issue | Impact | Phase |
|---|-------|--------|-------|
| 1 | **Ownership contradictions** (BA vs PO vs FA) | Models "pick a truth" inconsistently | 2.5.1 |
| 2 | **FA references forbidden BA commands** (`ts:ba epic`, `ts:ba feature`) | Workflows break | 2.5.2 |
| 3 | **Example IDs use 2.0 format** (`S-042`, `F-001`) | Small models copy examples | 2.5.3 |
| 4 | **"TeamSpec 2.0" in shipped surfaces** (CLI banner, copilot-instructions) | User confusion | 1 |
| 5 | **"Feature Canon" terminology** used for 4.0 model | Semantic drift | 1 |

### Good (Preserve)

- Bootstrap escalation protocol and read-only mode
- Role prompts have "I will not" blocks
- Agent file parity across all 3 directories (100% match)
- Linter correctly enforces TS-PROD-* and TS-PROJ-* rules

---

## Phase 0 — Sources of Truth

### Decision Required

**Recommended:** Ship 4.0-only (greenfield).

### Authoritative Directories

| Content | Authoritative Source | Copies |
|---------|---------------------|--------|
| Agents | `agents/` | `.teamspec/agents/`, `cli/teamspec-core/agents/` |
| Templates | `templates/` | `.teamspec/templates/`, `cli/teamspec-core/templates/` |
| Copilot Instructions | `cli/teamspec-core/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Config | `cli/teamspec-core/teamspec.yml` | `.teamspec/teamspec.yml` |

### Parity Status

| Directory Pair | Status |
|---------------|--------|
| `agents/` ↔ `.teamspec/agents/` | ✅ 100% match (MD5 verified) |
| `agents/` ↔ `cli/teamspec-core/agents/` | ✅ 100% match |

---

## Phase 1 — Version Drift Inventory

### 2.0 Remnants (MUST FIX for 4.0-only)

| File | Current Claim | Required Action |
|------|---------------|-----------------|
| `cli/lib/cli.js:185` | "Bootstrap TeamSpec 2.0 Feature Canon Operating Model" | Change to "4.0 Product-Canon" |
| `cli/lib/cli.js:1336` | "TeamSpec 2.0 initialized successfully" | Change to "4.0" |
| `cli/teamspec-core/copilot-instructions.md` | Title + body = "TeamSpec 2.0" | Rewrite for 4.0 |
| `.github/copilot-instructions.md` | "TeamSpec 2.0" | Rewrite for 4.0 |
| `cli/teamspec-core/teamspec.yml` | `version: "2.0"`, `projects/{project-id}/features` | Update to 4.0 structure |
| `.teamspec/teamspec.yml` | `version: "2.0"` | Update to 4.0 |
| `cli/README.md` | "Bootstrap TeamSpec 2.0" | Update to 4.0 |
| `templates/README.md` | "TeamSpec 2.0 Templates" | Update to 4.0 |

### Terminology Drift

| File | Issue |
|------|-------|
| `agents/AGENT_PO.md:31` | "Feature Canon model" when describing Product/Project separation |

### Banlist for CI

```
BANNED_STRINGS (outside review/, teamspec_test/, fixtures):
- "TeamSpec 2.0"
- "Feature Canon operating model"
- "projects/{project-id}/features" (as default truth location)
```

---

## Phase 2 — Agent Parity

### File Parity: ✅ PASS

All 8 core agents match across:
- `agents/`
- `.teamspec/agents/`
- `cli/teamspec-core/agents/`

### Recommendation

Declare `agents/` as authoritative source. Add CI parity check or build step to sync copies.

---

## Phase 2.5 — Agent Prompt Consistency

### 2.5.1 Ownership Contradictions (CRITICAL)

**Evidence:**

| Source | Who owns Projects? | Who owns Feature-Increments? | Who creates Epics? |
|--------|-------------------|-----------------------------|--------------------|
| `agents/README.md` (Quick Reference) | BA | BA | FA |
| `agents/AGENT_BOOTSTRAP.md` (§2.5) | PO | FA | — |
| `agents/AGENT_BA.md` (§4.1) | ❌ BA cannot create | ❌ BA cannot create | ❌ BA cannot create |
| `agents/AGENT_PO.md` (§3.1) | PO | — | ❌ PO cannot create |
| `agents/AGENT_FA.md` (§3.1) | — | FA | FA |

**Contradictions:**
1. README says BA owns "Projects, Feature-Increments" — but BA agent says BA cannot create either.
2. Bootstrap says PO owns Projects — README says BA owns Projects.
3. README says FA owns Epics — but FA escalation text says "BA creates the Epic first".

### 2.5.2 Command Consistency (CRITICAL)

**FA agent references commands that BA agent forbids:**

| FA Agent Line | Command Referenced | BA Agent Rule |
|---------------|-------------------|---------------|
| `AGENT_FA.md:225` | `ts:ba epic` | BA-006: "BA cannot create projects or feature-increments" |
| `AGENT_FA.md:254` | `ts:ba feature` | BA agent has no `ts:ba feature` command |
| `AGENT_FA.md:881,888` | `ts:ba epic` | Same |

**README inconsistency:**
- `agents/README.md` lists `ts:deploy` but no agent defines it.
- `cli/teamspec-core/agents/README.md` lists `ts:ba epic`, `ts:ba feature` — BA agent forbids these.

### 2.5.3 Example ID Hygiene (MODERATE)

**2.0-style IDs found in agent prompts:**

| File | Line | Example ID | Should Be |
|------|------|-----------|-----------|
| `agents/AGENT_FA.md` | 921-967 | `S-042`, `F-001` | `s-e001-042-*`, `f-PRX-001-*` |
| `agents/AGENT_QA.md` | 715-835 | `F-001` | `f-PRX-001-*` |
| `cli/teamspec-core/copilot-instructions.md` | 224-229 | `F-NNN`, `S-NNN`, `EPIC-NNN` | 4.0 patterns |

### 2.5.4 Prompt Structure

**Missing in agent prompts:**
- No front-loaded "CORE" section (< 25 lines)
- Read-only mode not restated in each agent (relies on Bootstrap)
- Mermaid diagrams add token overhead without behavior value

---

## Phase 3 — CLI vs Docs

### CLI Help Output

```
TeamSpec Init - Bootstrap TeamSpec 2.0 Feature Canon Operating Model  ← 2.0 claim
...
WHAT GETS CREATED (4.0):    ← 4.0 structure
  products/<product-id>/
  projects/<project-id>/
```

**Verdict:** CLI **creates 4.0 structure** but **claims 2.0 in banner**.

### CLI README

`cli/README.md` line 4: "Bootstrap TeamSpec 2.0 Feature Canon Operating Model"

**Verdict:** Docs claim 2.0, CLI creates 4.0.

---

## Phase 4 — Linter Fixtures

### Valid 4.0 Fixture: ✅ PASS

```
cli/test/fixtures/valid-4.0/
├── products/acme-shop/
│   ├── product.yml
│   └── features/
│       ├── f-ACME-001-user-login.md
│       ├── features-index.md
│       └── story-ledger.md
└── projects/shop-redesign/
    ├── project.yml
    └── feature-increments/
        └── fi-ACME-001-oauth-login.md
```

**Result:** `✅ No issues found.`

### Broken 4.0 Fixture: ✅ CORRECTLY FAILS

```
cli/test/fixtures/broken-4.0/
├── products/broken-product/
│   ├── product.yml (missing nested structure)
│   └── features/F-001-wrong-naming.md (2.0 naming)
└── projects/no-link/
    └── project.yml (missing target_products)
```

**Result:** 9 errors with expected rule IDs:
- `TS-PROD-002` (4x) — product.yml missing fields
- `TS-PROD-004` — missing features-index.md
- `TS-PROD-005` — missing story-ledger.md
- `TS-PROJ-002` (2x) — project.yml missing fields
- `TS-PROJ-003` — no target_products

**Verdict:** Linter correctly enforces 4.0 rules.

---

## Phase 5 — Redundancy

### Redundant Directories

| Primary | Copies | Recommendation |
|---------|--------|----------------|
| `agents/` | `.teamspec/agents/`, `cli/teamspec-core/agents/` | Keep `agents/`, delete others OR add build step |
| `templates/` | `.teamspec/templates/`, `cli/teamspec-core/templates/` | Keep `templates/`, sync to others |

### Redundant Files

| File | Redundant With | Action |
|------|---------------|--------|
| `.github/copilot-instructions.md` | `cli/teamspec-core/copilot-instructions.md` | Keep cli/, copy to .github/ on init |

---

## Phase 6 — Documentation Consistency

### Broken References

| File | Reference | Issue |
|------|-----------|-------|
| (none found) | `teamspec_4.0/` | Already deleted |
| (none found) | `roles/` | Already deleted |

### Command Mismatches

| Advertised In | Command | Actual Status |
|--------------|---------|---------------|
| `agents/README.md` | `ts:deploy` | Not defined in any agent |
| `cli/teamspec-core/agents/README.md` | `ts:ba epic`, `ts:ba feature` | Forbidden by BA agent |

---

## Recommended Fix Order

### Priority 1 (Blocks Shipping)

1. **Fix ownership table** — Create single authoritative table in Bootstrap, regenerate README.
2. **Fix FA→BA command references** — Remove `ts:ba epic`, `ts:ba feature` from FA.
3. **Update CLI banner/README** — Change "2.0" to "4.0".
4. **Rewrite copilot-instructions.md** — Full 4.0 rewrite.

### Priority 2 (Quality)

5. **Fix example IDs** — Replace `S-042`/`F-001` with `s-e001-042-*`/`f-PRX-001-*`.
6. **Update teamspec.yml** — Change version to "4.0", fix structure paths.
7. **Add CORE section** to each agent (< 25 lines).
8. **Add read-only mode** restatement to each agent.

### Priority 3 (Maintenance)

9. **Consolidate directories** — Single source for agents/templates.
10. **Add CI checks** — Banlist, parity verification.
