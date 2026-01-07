# Role: Feedback Reporter (All Roles)

> **Command**: `ts:feedback`  
> **Purpose**: Report issues, bugs, or improvement suggestions for the TeamSpec framework

---

## Purpose

Help users report issues, bugs, or improvement suggestions for the TeamSpec framework in a structured way that makes them actionable.

---

## When to Use

Use this command when you:
- Struggle with a TeamSpec command that doesn't work as expected
- Find a bug in a prompt, template, or workflow
- Have a suggestion to improve a prompt or command
- Encounter unclear documentation
- Want to request a new feature

---

## Workflow

### Step 1: Gather Context

Ask the user what type of feedback they want to provide:

1. **🐛 Bug Report** — Something isn't working correctly
2. **📝 Prompt Issue** — A prompt is unclear, incomplete, or produces poor results
3. **💡 Feature Request** — Suggestion for new functionality
4. **📚 Documentation Issue** — Docs are unclear, outdated, or missing
5. **⚡ UX Improvement** — Command is tedious, confusing, or could be better

### Step 2: Collect Details

Based on the feedback type, collect:

**For Bug Reports:**
- Command that failed (e.g., `ts:fa sync`)
- Expected behavior
- Actual behavior
- Steps to reproduce
- Error messages (if any)
- Affected files

**For Prompt Issues:**
- Which prompt file (e.g., `FA-AUTO-SYNC.md`)
- What you were trying to do
- What the prompt produced
- What you expected instead
- Specific section that's problematic

**For Feature Requests:**
- What capability is missing
- Use case / why you need it
- Suggested implementation (optional)

**For Documentation Issues:**
- Which document/section
- What's unclear or wrong
- Suggested improvement

**For UX Improvements:**
- Current friction point
- Proposed improvement
- Impact on workflow

### Step 3: Generate Structured Feedback

Output in this format:

```markdown
# TeamSpec Feedback

**Type**: [Bug Report | Prompt Issue | Feature Request | Documentation | UX Improvement]
**Date**: YYYY-MM-DD
**Reporter**: [user or anonymous]
**Severity**: [Critical | High | Medium | Low]

## Summary

[One-line description]

## Details

### What Happened / Current State
[Description of the issue or current behavior]

### Expected / Desired State
[What should happen instead]

### Steps to Reproduce (if applicable)
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Affected Components
- **Command**: `ts:xxx`
- **Prompt File**: `[file].md`
- **Workflow**: `[workflow].md`
- **Template**: `[template].md`

### Environment
- TeamSpec Version: [version from package.json]
- IDE: VS Code with TeamSpec extension
- OS: [Windows/Mac/Linux]

## Suggested Fix (optional)

[If the user has an idea for how to fix it]

## Related Issues

[Links to related feedback or known issues]
```

### Step 4: Propose GitHub Issue

After generating the structured feedback, offer to create a GitHub issue:

**Ask the user:**
> "Would you like me to create a GitHub issue for this feedback on the TeamSpec repository?"
> 
> Options:
> 1. **Yes, create issue** — I'll help you create an issue at github.com/Pieter2406/TeamSpec/issues
> 2. **No, save locally** — Save to `feedback/FEEDBACK-YYYY-MM-DD-[slug].md`
> 3. **No, just show me** — Display the feedback without saving

**If user chooses to create issue:**

1. Format for GitHub issue:
   - **Title**: `[Type] Brief description`
   - **Labels**: Suggest appropriate labels:
     - `bug` — For bug reports
     - `prompt-issue` — For prompt problems
     - `enhancement` — For feature requests
     - `documentation` — For docs issues
     - `ux` — For UX improvements
   - **Body**: Use the structured feedback markdown

2. Provide the user with:
   - Direct link to create issue: `https://github.com/Pieter2406/TeamSpec/issues/new`
   - Pre-formatted issue content ready to paste

---

## Example Invocations

### Example 1: Bug Report

**User**: `@teamspec /feedback`

**Assistant**: What type of feedback would you like to provide?
1. 🐛 Bug Report
2. 📝 Prompt Issue
3. 💡 Feature Request
4. 📚 Documentation Issue
5. ⚡ UX Improvement

**User**: 1 - The `fa sync` command doesn't update story-ledger.md

**Assistant**: [Collects details, generates structured feedback, offers to create GitHub issue]

### Example 2: Prompt Improvement

**User**: `@teamspec /feedback` - The BA epic prompt doesn't help estimate epic size

**Assistant**: I'll help you report this prompt issue...

---

## GitHub Integration

When creating issues, use these label mappings:

| Feedback Type | GitHub Label |
|---------------|--------------|
| Bug Report | `bug` |
| Prompt Issue | `prompt-issue` |
| Feature Request | `enhancement` |
| Documentation | `documentation` |
| UX Improvement | `ux`, `enhancement` |

**Repository**: `Pieter2406/TeamSpec`

---

## Local Storage

If the user prefers not to create a GitHub issue, save feedback locally:

```
feedback/
├── FEEDBACK-2026-01-05-fa-sync-bug.md
├── FEEDBACK-2026-01-03-epic-sizing.md
└── README.md
```

Create a `feedback/` directory if it doesn't exist.
