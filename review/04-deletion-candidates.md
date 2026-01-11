# Deletion / Consolidation Candidates (Legacy + Redundancy)

This is a candidate list only. Do not delete blindly: some folders may exist for testing, packaging, or backwards compatibility.

## High-confidence redundancy (needs a single source of truth)
### Templates duplicated across 3 locations
- `templates/` (root) — clearly 2.0 per `templates/README.md`
- `.teamspec/templates/` — also clearly 2.0 per `.teamspec/templates/README.md`
- `cli/teamspec-core/templates/` — clearly 4.0 per its README

**Candidate action:** keep one canonical template source for shipping (likely `cli/teamspec-core/templates/`), and either:
- delete or archive the 2.0 template sets, OR
- move them under an explicit `legacy/v2/` path.

### Agents duplicated across multiple locations
- `agents/` (root)
- `.teamspec/agents/` (installed)
- `cli/teamspec-core/agents/` (ship bundle)

**Risk:** edits can land in one copy but not the others.

**Candidate action:** define which one is authoritative for distribution, and generate/copy others from it.

## Versioned instructions duplicated
- `.github/copilot-instructions.md` — 2.0
- `cli/teamspec-core/copilot-instructions.md` — 2.0

**Candidate action:** if 4.0 is the target, replace these with 4.0 instructions; if dual-mode, version them explicitly.

## Role/spec documents that appear 2.0-centric
- `roles/WORKFLOW.md`
- `roles/LINTER_RULES_SPECIFICATION.md`
- `roles/TEMPLATE_ALIGNMENT_REQUIREMENTS.md`

**Candidate action:** either update to 4.0, or move to a clearly labeled legacy spec section.

## Recently deleted (confirmed via repo diff)
The following were removed and can be dropped from future deletion plans:
- `teamspec_4.0/` planning document set
- `roles/` documentation/spec set
- `projects/teamspec-mvp/` example artifacts

## Safety notes
- `teamspec_test/` likely exists to validate linting and scaffolding behavior.
- Anything under `cli/teamspec-core/` may be used as the "installed" payload; treat it as the distribution artifact.
