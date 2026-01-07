# Project Structure Documentation Index

This index helps you find the right documentation for understanding and working with the project folder structure.

## 📚 Documentation Files

### For Understanding the Structure

**START HERE:**
- **[PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md)** — Complete, human-readable guide to all folders, files, naming conventions, and workflows
  - Read this to understand how to organize your work
  - Contains detailed descriptions of each folder
  - Includes quick reference checklists
  - ~1500 lines of comprehensive documentation

### For AI Assistants & Automation

- **[.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml)** — Machine-readable structure encoding
  - Load this in prompts and automation tools
  - YAML format with structured data
  - Contains all naming patterns, folder ownership, validation rules
  - Used by linters and CI/CD tools

- **[.teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md](./.teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md)** — How to use project structure in prompts
  - Read this to understand how to integrate structure into AI assistant prompts
  - Contains examples for ChatGPT, Claude, Copilot
  - Shows pseudocode for how tools should use the structure
  - Includes validation rule examples

### For Quick Reference

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** — One-page quick reference
  - File locations table with current structure
  - Critical rules enforced by linter
  - Quick tips for each role

- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** — GitHub Copilot setup
  - Includes Project Structure Reference section
  - Folder ownership table
  - Story workflow diagram
  - Cross-reference rules

### For Understanding What Changed

- **[PROJECT_STRUCTURE_SUMMARY.md](./PROJECT_STRUCTURE_SUMMARY.md)** — Summary of what was created
  - Files created and updated
  - Key concepts encoded
  - Usage workflow examples
  - Integration checklist

---

## 🎯 Find What You Need

### "I'm a new team member, how do I learn the structure?"
1. Read [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md) — Start with "Overview" section
2. Skim the "Folder Descriptions" section
3. Review "Naming Conventions" for understanding file names
4. Check "Quick Reference Checklist" for common tasks

### "I need to create a story, what folder does it go in?"
1. See [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md#stories--user-stories) → "Stories - User Stories" section
2. Or check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "File Locations" table
3. Or load [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml) → `project_folders[2]` (stories)

### "I'm implementing a dev plan, what naming convention should I use?"
1. [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md#naming-conventions) → "Naming Conventions" section
2. Look for pattern: `story-XXX-tasks.md`

### "I'm building a linter, where are the validation rules?"
1. Load [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml)
2. Check `naming_conventions`, `workflow_states`, `cross_reference_rules`, `quality_gates` sections
3. See examples in [PROJECT_STRUCTURE_INTEGRATION_GUIDE.md](./.teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md) → "Validation Rules Encoded" section

### "I'm updating a prompt/AI assistant, how should I load the structure?"
1. Read [PROJECT_STRUCTURE_INTEGRATION_GUIDE.md](./.teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md)
2. See "Integration Points" section for examples
3. Check "How Prompts Use This" for pseudocode

### "What are the role-to-folder mappings?"
1. [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md#folder-ownership-by-role) → "Folder Ownership by Role" table
2. Or [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml) → `role_responsibilities` section

### "I need to understand the story workflow/state machine"
1. [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md#story-workflow-states) → "Story Workflow States" diagram
2. Or [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml) → `workflow_states` section

### "What are the cross-reference rules?"
1. [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md#cross-references) → "Cross-References" section
2. Or [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml) → `cross_reference_rules` section

---

## 📋 File Organization

```
DelenSpec/
├── PROJECT_STRUCTURE_REFERENCE.md      ← Human-readable (START HERE)
├── PROJECT_STRUCTURE_SUMMARY.md        ← What was created
├── QUICK_REFERENCE.md                  ← Quick lookup table
│
├── .github/
│   └── copilot-instructions.md         ← Includes structure reference
│
└── .teamspec/
    ├── context/
    │   ├── PROJECT_STRUCTURE.yml              ← Machine-readable
    │   └── PROJECT_STRUCTURE_INTEGRATION_GUIDE.md  ← Integration howto
    │
    └── prompts/
        └── _CONTEXT_CONTRACT.md               ← Context loading rules
```

---

## 🔄 Context Loading Order

When AI assistants generate artifacts, they load context in this order:

```
1. .teamspec/context/team.yml               ← Global team config
2. .teamspec/profiles/{profile}.yml         ← (if applicable)
3. projects/{project-id}/project.yml        ← Project-specific config
4. .teamspec/context/PROJECT_STRUCTURE.yml  ← Folder structure rules
```

See [.teamspec/prompts/_CONTEXT_CONTRACT.md](./.teamspec/prompts/_CONTEXT_CONTRACT.md) for the full contract.

---

## ✅ Key Sections Reference

### Folder Descriptions
- **features/** — Feature Canon (source of truth)
- **stories/backlog/** — New stories not yet refined
- **stories/ready-to-refine/** — Stories ready for dev review
- **stories/ready-for-development/** — Refined stories ready for sprint
- **sprints/** — Sprint management
- **dev-plans/** — Development task breakdown (FLAT structure)
- **decisions/** — Decision logs
- **adr/** — Architecture Decision Records
- **qa/** — Test cases and results
- **epics/** — Epic groupings (optional)

See [PROJECT_STRUCTURE_REFERENCE.md](./PROJECT_STRUCTURE_REFERENCE.md) for full descriptions.

### Naming Patterns
- Features: `F-001-feature-name.md`
- Stories: `S-042-story-name.md`
- Architecture: `ADR-005-decision-name.md`
- Decisions: `DECISION-003-decision-name.md`
- Epics: `EPIC-002-epic-name.md`
- Dev Plans: `story-042-tasks.md` (FLAT, no sprint prefix)
- Test Cases: `F-001-test-cases.md`
- Sprints: `sprint-1/`, `sprint-2/`, etc.

### Story Workflow
```
backlog/ → ready-to-refine/ → ready-for-development/ → sprint-N/ → archived
```

### Cross-Reference Requirements
- **Stories MUST link to** Features (in "Linked Features" section)
- **Dev Plans MUST link to** Stories
- **Test Cases should link to** Features and Stories
- All links use relative markdown paths

---

## 🚀 Quick Start

**For a team member:**
```
1. Open PROJECT_STRUCTURE_REFERENCE.md
2. Read the "Overview" section
3. Bookmark the "Folder Descriptions" for reference
4. Use "Quick Reference Checklist" for common tasks
```

**For an AI assistant / prompt:**
```
1. Load .teamspec/context/PROJECT_STRUCTURE.yml
2. Read PROJECT_STRUCTURE_INTEGRATION_GUIDE.md
3. Implement validation rules from the YAML
4. Follow naming patterns when creating files
```

**For a developer implementing linter rules:**
```
1. Load .teamspec/context/PROJECT_STRUCTURE.yml as data
2. Read "Validation Rules Encoded" section of Integration Guide
3. Implement naming pattern validation
4. Implement cross-reference validation
5. Implement workflow state validation
```

---

## 📖 Complete File Guide

| File | Format | Purpose | Audience |
|------|--------|---------|----------|
| PROJECT_STRUCTURE_REFERENCE.md | Markdown | Human-readable guide | Team members, documentation readers |
| PROJECT_STRUCTURE_SUMMARY.md | Markdown | What was created and why | Project managers, framework developers |
| QUICK_REFERENCE.md | Markdown | Quick lookup | All roles, quick reference |
| .teamspec/context/PROJECT_STRUCTURE.yml | YAML | Machine-readable structure | AI assistants, linters, automation |
| .teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md | Markdown | Integration patterns | Prompt engineers, developers |
| .github/copilot-instructions.md | Markdown | Copilot configuration | GitHub Copilot users |
| .teamspec/prompts/_CONTEXT_CONTRACT.md | Markdown | Context loading rules | Framework, all prompts |

---

## 🔗 External References

- [README.md](./README.md) — Project overview (contains workflow diagrams)
- [WORKFLOW_DIAGRAMS.md](./WORKFLOW_DIAGRAMS.md) — Visual workflows (if exists)
- [.teamspec/definitions/](./. teamspec/definitions/) — Quality gates (DoR, DoD)
- [.teamspec/templates/](./. teamspec/templates/) — Document templates

---

## 📝 Notes

- All relative paths in this document are from the repository root
- Structure is encoded in `.teamspec/context/PROJECT_STRUCTURE.yml` for automation
- Human-readable equivalent is in PROJECT_STRUCTURE_REFERENCE.md
- New team members should start with PROJECT_STRUCTURE_REFERENCE.md
- AI assistants should load PROJECT_STRUCTURE.yml during context loading
