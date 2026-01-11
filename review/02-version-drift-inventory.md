# Version Drift Inventory (2.0 remnants vs 4.0 sources)

This inventory lists the most prominent “truth surfaces” and what version they communicate.

## 4.0-aligned sources (Product-Canon)
- `README.md` — positions TeamSpec as Product-Canon; warns transition is WIP.
- `COMMAND_REFERENCE.md` — explicitly “TeamSpec 4.0 — Command Reference”.
- `PROJECT_STRUCTURE.yml` — explicitly “Version: 4.0” encoding for Products/Projects.
- `agents/README.md` and multiple agent prompts — describe Product-Canon model.
- `.teamspec/agents/README.md` — explicitly “TeamSpec 4.0 Agent Prompts”.
- `cli/teamspec-core/templates/README.md` — explicitly “Version: 4.0” and product/project model.
- `cli/lib/linter.js` — contains 4.0 rules: TS-PROD, TS-FI, TS-EPIC, plus 4.0 version detection.
- `cli/lib/cli.js` — includes creation logic for 4.0 structure (products + product.yml, projects + increments).

## 2.0 remnants (Feature Canon model)
- `.github/copilot-instructions.md` — titled and written for “TeamSpec 2.0”; describes 2.0 folder structure under `projects/`.
- `cli/teamspec-core/copilot-instructions.md` — also “TeamSpec 2.0” installed instructions.
- `.teamspec/teamspec.yml` — `version: "2.0"`, 2.0 structure encoding.
- `cli/teamspec-core/teamspec.yml` — also `version: "2.0"`.
- `.teamspec/templates/README.md` — “TeamSpec 2.0 Templates”.
- `templates/README.md` — “TeamSpec 2.0 Templates”.
- `cli/README.md` — markets “Bootstrap TeamSpec 2.0 Feature Canon Operating Model”.

## Deleted legacy sources (observed)
The following sources were deleted during cleanup (so they no longer contribute to user-facing drift), but references may still exist in remaining docs:
- `teamspec_4.0/` — previously contained 4.0 planning docs
- `roles/` — previously contained 2.0-centric workflow/spec docs

## Mixed / split-brain directories
These are particularly risky because they look like one “installed bundle” but contain mismatched versions:
- `.teamspec/`:
  - agents appear 4.0
  - templates appear 2.0
  - config is 2.0

## Impact
If this repo is used to publish/ship the CLI + core bundle, the user-facing entrypoints (`cli/README.md`, `copilot-instructions.md`, `.teamspec/teamspec.yml`) will steer users into 2.0 behaviors even when 4.0 support exists.
