# Registry Consistency Review

**Target:** `spec/4.0/registry.yml`
**Version:** 4.0
**Date:** 2026-01-11

## Executive Summary

The `spec/4.0/registry.yml` file is designated as the "SINGLE SOURCE OF TRUTH" for TeamSpec 4.0. However, a review of downstream artifacts (README, Agents, Templates, CLI) reveals significant deviations, particularly in the list of available commands and artifact templates.

## 1. Command Inconsistencies

The Registry defines specific available commands in the `commands:` section. Several commands documented in agents or the README are missing from the Registry, and some removed commands are still referenced.

| Command | Registry Status | Agent/README Usage | Status |
| :--- | :--- | :--- | :--- |
| `ts:deploy` | **REMOVED** (replaced by `ts:po sync`) | Used in `README.md` (Deployment Gate) | ❌ Inconsistent |
| `ts:qa uat` | Missing | Used in `cli/README.md`, `AGENT_QA.md` | ❌ Missing in Registry |
| `ts:qa bug` | Missing | Used in `AGENT_QA.md` | ❌ Missing in Registry |
| `ts:fa slice` | Missing | Used in `AGENT_FA.md` | ❌ Missing in Registry |
| `ts:sm planning` | Missing | Used in `AGENT_SM.md` | ❌ Missing in Registry |
| `ts:sm standup` | Missing | Used in `AGENT_SM.md` | ❌ Missing in Registry |
| `ts:sm retro` | Missing | Used in `AGENT_SM.md` | ❌ Missing in Registry |
| `ts:sm sync` | Missing | Used in `AGENT_SM.md` | ❌ Missing in Registry |

**Recommendation:**

- Add missing commands to `registry.yml` if they are official 4.0 features.
- Update `README.md` to remove references to `ts:deploy`.
- Standardize `ts:sm` subcommands in Registry.

## 2. Template Inconsistencies

The Registry defines `artifacts` with specific logic and locations. Some matching templates appear to be missing or misnamed in the `templates/` directory.

| Artifact (Registry) | Expected Template | Actual Template Status |
| :--- | :--- | :--- |
| `solution-design` | `solution-design-template.md` | ❌ Missing (Found `functional-spec-template.md`?) |
| `technical-architecture` | `technical-architecture-template.md` | ❌ Missing (Found `adr-template.md`?) |
| `sd-increment` | `sd-increment-template.md` | ❌ Missing |
| `ta-increment` | `ta-increment-template.md` | ❌ Missing |
| `ba-increment` | `ba-increment-template.md` | ❌ Missing |
| `regression-impact` | `regression-impact-template.md` | ❌ Missing |
| `project-test-case` | `project-test-case-template.md` | ⚠️ Found `testcases-template.md` (ambiguous) |

**Recommendation:**

- Create missing templates for SA artifacts (`sd`, `ta`) and increments.
- rename `testcases-template.md` to match registry naming if needed.

## 3. Documentation & Agent Inconsistencies

### README.md

- **Line 656**: Mentions `ts:deploy executed to sync to Canon`.
  - **Correction**: Should be `ts:po sync`.
- **Line 609**: Mentions `ts:qa bug`.
  - **Correction**: `ts:qa bug` is not in Registry.

### Agents

- `AGENT_SM.md` defines a rich set of subcommands (`sprint create`, `plan`, `add`, `remove`, `standup`, `retro`) which are likely intended to be part of the `ts:sm` family, but `registry.yml` only broadly defines `ts:sm sprint`.
- `AGENT_FA.md` heavily relies on `ts:fa slice` to break down epics, which is a key workflow step missing from the SSoT.

## 4. Linter Consistency

`cli/lib/linter.js` appears to contain a mix of 2.0 and 4.0 rules.

- **Findings**:
  - `TS-FEAT` rules are marked as "Version-aware" but strict adherence to the Registry's "Linter Rule Categories" (Table 10 in Agents? or `registry.yml` line 633 `TS-FI-001`) implies the linter should be fully updated to support 4.0 specific checks like `TS-FI-001`, `TS-STORY-006` (Epic linking).
  - The Registry lists `TS-QA-003` in `artifacts:regression-impact` (line 339), but I did not verify if this rule exists in `linter.js`.

## Conclusion

The `registry.yml` is currently **incomplete** as a Single Source of Truth. It lacks definitions for several active commands and artifacts used in the Agents and Documentation. To restore consistency, either the Registry must be expanded to include these practical commands, or the Agents/Docs must be trimmed to match the stricter Registry.

**Suggested Path Forward:**

1. **Expand Registry**: Add `ts:qa uat`, `ts:fa slice`, `ts:qa bug`, and detailed `ts:sm` commands to `registry.yml`.
2. **Clean Docs**: Remove `ts:deploy` from `README.md`.
3. **Create Templates**: Add missing SA and Increment templates.
