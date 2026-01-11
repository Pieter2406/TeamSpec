# Truth Audit Results

> **Date:** 2026-01-11  
> **Status:** Resolved  
> **Purpose:** Document discrepancies found before encoding registry.yml

---

## Ownership Discrepancies

| Artifact | Bootstrap Says | agents/README Says | Resolution |
|----------|---------------|-------------------|------------|
| Products | PO | PO | ✅ Consistent |
| Projects | PO | BA (Quick Ref), PO (correct elsewhere) | → **PO** (fix Quick Ref) |
| Feature-Increments | FA | BA (Quick Ref) | → **FA** (fix Quick Ref) |
| Features | FA | FA | ✅ Consistent |
| Epics | FA | FA | ✅ Consistent |
| Stories | FA | FA | ✅ Consistent |
| Business Analysis | BA | BA | ✅ Consistent |

## Command Discrepancies

| Command | Agent Says | Should Exist | Resolution |
|---------|-----------|--------------|------------|
| `ts:ba epic` | Referenced in AGENT_FA.md | No (FA owns) | → **REMOVE** (use `ts:fa epic`) |
| `ts:ba feature` | Referenced in AGENT_FA.md, AGENT_DES.md | No (FA owns) | → **REMOVE** (use `ts:fa feature`) |
| `ts:deploy` | Listed in agents/README | Yes (deprecated) | → **DEPRECATED ALIAS** |
| `ts:po sync` | Documented | Yes | ✅ Primary canon sync |

## Path Discrepancies

| Artifact | Pattern | Location |
|----------|---------|----------|
| QA test cases (project) | `tc-fi-PRX-NNN-*.md` | `projects/*/qa/test-cases/` |
| QA regression tests (product) | `rt-f-PRX-NNN-*.md` | `products/*/qa/regression-tests/` |

## Version Branding Discrepancies

| File | Current | Required |
|------|---------|----------|
| `cli/lib/cli.js:185` | "TeamSpec 2.0" | "TeamSpec 4.0" |
| `cli/lib/cli.js:1336` | "TeamSpec 2.0" | "TeamSpec 4.0" |
| `cli/teamspec-core/teamspec.yml` | `version: "2.0"` | `version: "4.0"` |
| `templates/README.md` | "TeamSpec 2.0 Templates" | "TeamSpec 4.0 Templates" |

## Example ID Discrepancies

| File | Current | 4.0 Pattern |
|------|---------|-------------|
| Various agents | `S-042`, `F-001` | `s-e001-042-*`, `f-PRX-001-*` |

---

## Resolution Status

All discrepancies have explicit resolutions documented above. Phase 1 (Create Spec Structure) may proceed.
