# Questions for an Agile/Team Leadership Expert (LLM) + Prompt

## Questions
1. Should TeamSpec ship as **4.0-only** now, or explicitly support **2.0 + 4.0** (dual-mode) for a transition period?
2. If dual-mode, what is the simplest user experience to prevent confusion (e.g., explicit `--model 4.0` flag vs auto-detect)?
3. Which artifacts constitute the “authoritative installed bundle” for users?
   - `.github/copilot-instructions.md` vs `cli/teamspec-core/copilot-instructions.md` vs `.teamspec/*`
4. What’s the minimum acceptable consistency bar before calling the product “TeamSpec 4.0”?
   - docs
   - templates
   - linter rule IDs
   - CLI help text
   - migration support
5. How should legacy 2.0 be handled?
   - delete
   - keep but explicitly labeled `legacy/v2`
   - maintain indefinitely
6. What governance prevents split-brain going forward?
   - single source directory + build step to copy
   - CI check that forbids “TeamSpec 2.0” strings outside legacy

## Ready-to-paste prompt
Copy/paste into your preferred LLM:

---

You are an experienced Agile delivery lead and product operations expert. I’m reviewing a repo that is mid-migration from TeamSpec 2.0 (Feature Canon model) to TeamSpec 4.0 (Product-Canon model: products are AS-IS truth, projects are TO-BE increments).

Given these concrete signals:
- Root docs: `README.md` and `COMMAND_REFERENCE.md` describe 4.0 Product-Canon.
- Tooling: `cli/lib/cli.js` and `cli/lib/linter.js` include 4.0 concepts (products/product.yml, TS-PROD, TS-FI, TS-EPIC).
- Installed config: `.teamspec/teamspec.yml` and `cli/teamspec-core/teamspec.yml` declare version 2.0 and encode 2.0 folder structure.
- Installed Copilot instructions: `.github/copilot-instructions.md` and `cli/teamspec-core/copilot-instructions.md` are written for TeamSpec 2.0.
- Templates: `.teamspec/templates/` and `templates/` are 2.0; `cli/teamspec-core/templates/` is 4.0.
- The repo root is not a 4.0 workspace instance (no `products/` folder), so lint can pass even if 4.0 is incomplete.

Please:
1) Recommend whether we should ship as 4.0-only or dual-mode, and justify based on user confusion risk.
2) Propose a minimal governance model to keep docs/templates/agents/CLI aligned.
3) Provide a prioritized "first 5 fixes" list that maximizes user clarity with minimal engineering.

Constraints:
- Prefer clarity and stability over feature breadth.
- Avoid large refactors; suggest small, high-leverage changes.

---
