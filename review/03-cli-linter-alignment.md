# CLI + Linter Alignment vs Documentation

## Goal
Verify that (a) CLI behavior matches docs, and (b) linter rules match the documented operating model.

## CLI: documentation vs implementation signals
### Mismatch: CLI README vs actual init capability
- `cli/README.md` claims **2.0 Feature Canon operating model**.
- `cli/lib/cli.js` contains explicit 4.0 signals:
  - header comment: "bootstraps TeamSpec 4.0"
  - can create `products/<product-id>/product.yml` and product structure
  - can create project structure with `feature-increments/` etc.
- `cli/lib/cli.js` also prints a banner line: "Bootstrap TeamSpec 2.0 Feature Canon Operating Model".

**Conclusion:** CLI is functionally moving toward 4.0 but user-facing messaging still advertises 2.0.

### Mismatch: installed copilot instructions
- Both `.github/copilot-instructions.md` and `cli/teamspec-core/copilot-instructions.md` are written for 2.0.
- This conflicts with the CLI’s 4.0 structure creation and with the 4.0 command reference at repo root.

## Linter: implementation vs spec/config
### Implementation contains 4.0 rule set
`cli/lib/linter.js` includes:
- Workspace version detection for 4.0 (presence of `products/<id>/product.yml`)
- TS-PROD rules (product registry, product.yml metadata, project linkage)
- TS-FI rules (feature-increment naming, linkage to product prefix, increment index)
- TS-EPIC rules

### But installed config still declares 2.0
- `.teamspec/teamspec.yml` and `cli/teamspec-core/teamspec.yml` are version 2.0 and encode 2.0 structure.

**Interpretation:** even if the linter supports 4.0, the bundled configuration/instructions can still steer users into 2.0 patterns and cause linter runs to validate the wrong shape depending on detection logic.

## Why "✅ No issues found" may be misleading for 4.0 readiness
This repository root does not contain a `products/` directory, so 4.0 detection heuristics may not activate. Combined with a 2.0 declared config, lint success here does not validate 4.0 enforcement.

## Actionable alignment checklist
1. Decide support strategy: **4.0 only** vs **dual-mode**.
2. If 4.0 only:
   - Update `cli/README.md` to 4.0 messaging.
   - Update installed `copilot-instructions.md` (both root `.github/` and `cli/teamspec-core/`) to 4.0 Product-Canon.
   - Update `cli/teamspec-core/teamspec.yml` + installed `.teamspec/teamspec.yml` to version 4.0 encoding.
   - Ensure CLI banner/console text consistently says 4.0.
3. If dual-mode:
   - Make version selection explicit in docs.
   - Ensure CLI prints which version it detected and why.
   - Provide separate instructions/templates per version.
