# Executive Summary — TeamSpec 4.0 Implementation Status

## Bottom line
TeamSpec 4.0 (Product-Canon) is **partially implemented** in this repo. The CLI and linter codebase contains 4.0 concepts and rule IDs (e.g., TS-PROD / TS-FI / TS-EPIC), and the `cli/teamspec-core/templates/` set is clearly 4.0.

However, multiple “installed instance” surfaces still present the workspace as TeamSpec 2.0 (Feature Canon). This creates inconsistent operator guidance: an end-user can be told “2.0 structure” while the tooling supports or expects 4.0 concepts.

## Highest-risk inconsistencies
1. **Installed Copilot instructions are 2.0**
   - `.github/copilot-instructions.md` and `cli/teamspec-core/copilot-instructions.md` are titled and written for **TeamSpec 2.0**.
   - These instructions define a `projects/<project-id>/features/`-centric truth model, which conflicts with 4.0’s `products/<product-id>/features/` canon.

2. **Installed TeamSpec config is 2.0**
   - `.teamspec/teamspec.yml` and `cli/teamspec-core/teamspec.yml` declare `version: "2.0"` and encode 2.0 folder structure.

3. **Template sets disagree (2.0 vs 4.0)**
   - `.teamspec/templates/README.md` and `templates/README.md` describe **TeamSpec 2.0 Templates**.
   - `cli/teamspec-core/templates/README.md` describes **TeamSpec 4.0 Product Canon operating model**.

4. **CLI messaging disagrees with CLI implementation goals**
   - `cli/README.md` markets **TeamSpec 2.0**.
   - `cli/lib/cli.js` includes 4.0 structure creation (`products/.../product.yml`) but still prints a “Bootstrap TeamSpec 2.0” banner in at least one location.

## Note on recent cleanup
Several older planning/spec folders were removed (including the prior `teamspec_4.0/` planning docs and `roles/` specs). This reduces future drift, but it also means remaining docs that still reference those paths should be updated.

## Why lint can be green while 4.0 is incomplete
This repo itself is not a 4.0 “workspace” instance at its root (there is no `products/` folder at the repo root). Combined with `.teamspec/teamspec.yml` declaring 2.0, version detection/config likely causes the linter to validate the 2.0 structure, so "✅ No issues found" does **not** demonstrate 4.0 enforcement end-to-end.

## Recommendation (priority order)
1. Decide whether the product is **4.0-only** vs **dual-mode**.
2. Align the “installed instance” surfaces first:
   - Copilot instructions
   - `.teamspec/teamspec.yml` / installed core config
   - template READMEs + template sets
3. Only then align secondary docs (role workflow/spec docs) and clean redundant legacy copies.
