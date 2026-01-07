# DECISION-001: Remove VS Code Extension in Favor of GitHub Copilot Instructions

**Date:** 2026-01-07  
**Status:** Accepted  
**Deciders:** Product Owner, Engineering Team  

---

## Context

TeamSpec initially developed a custom VS Code extension (`@teamspec` chat participant) to provide role-based AI assistance. However, the extension proved to be:

1. **Complex to maintain** — Requires TypeScript compilation, packaging, and distribution
2. **Buggy** — Action buttons caused infinite loops, command routing was fragile
3. **Redundant** — GitHub Copilot already supports custom instructions via `.github/copilot-instructions.md`
4. **Distribution challenge** — Requires manual VSIX installation or marketplace publishing

## Decision

**Remove the VS Code extension entirely** and rely on GitHub Copilot's native instruction file support.

## Implementation

### What Was Removed
- `vscode-extension/` folder (TypeScript extension code)
- Custom chat participant (`@teamspec`)
- Button commands and action handlers
- Extension packaging and distribution

### What Remains
- `.github/copilot-instructions.md` — Comprehensive instructions for GitHub Copilot
- `/agents/` — Role-specific agent prompts that Copilot reads
- `/templates/` — Document templates
- `/cli/` — TeamSpec CLI for project initialization

### How to Use TeamSpec with GitHub Copilot

Users interact with TeamSpec through GitHub Copilot Chat using natural language and command patterns:

```
# Role commands
ts:ba project          # Business Analyst: Create project
ts:fa story           # Functional Analyst: Create story
ts:dev plan           # Developer: Create dev plan
ts:qa test            # QA: Create test cases

# Quick commands
ts:status             # Project overview
ts:context show       # Show team context
ts:agent fix          # Auto-fix lint errors
```

## Consequences

### Positive
- ✅ **Simpler architecture** — No extension code to maintain
- ✅ **More reliable** — Relies on proven GitHub Copilot infrastructure
- ✅ **Easier distribution** — Users just clone the repo and use Copilot
- ✅ **Better context** — Copilot has full workspace visibility
- ✅ **Cross-IDE support** — Works in any editor with GitHub Copilot

### Negative
- ❌ **No custom UI** — Can't create action buttons or custom panels
- ❌ **Less discoverable** — No slash command autocomplete (users must know `ts:` patterns)
- ❌ **Instruction file limits** — Must fit guidance in single markdown file

### Neutral
- ⚖️ **Command format change** — From `@teamspec /ba-project` to `ts:ba project`
- ⚖️ **Agent loading** — From programmatic to instruction-based

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Fix the extension bugs** | Too much maintenance overhead for limited benefit |
| **Publish to marketplace** | Adds distribution complexity, doesn't solve core issues |
| **Keep both** | Unnecessary duplication of effort |

## Related

- See `.github/copilot-instructions.md` for current implementation
- See `/agents/README.md` for agent architecture
- See `/cli/README.md` for CLI-based workflows

---

**Migration Path for Existing Users:**
1. Uninstall the TeamSpec extension: `code --uninstall-extension teamspec.teamspec`
2. Ensure GitHub Copilot is installed and active
3. Use `ts:` command patterns in Copilot Chat
4. Reference `.github/copilot-instructions.md` for available commands
