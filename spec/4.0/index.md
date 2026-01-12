# TeamSpec 4.0 Specification

> **Status:** Normative  
> **Version:** 4.0.1  
> **Last Updated:** 2026-01-12

This directory contains the **authoritative specification** for TeamSpec 4.0.

---

## What is Normative

Everything in this directory is **normative** (rules that must be followed):

| Document | Purpose |
|----------|---------|
| [registry.yml](registry.yml) | **THE** source of truth — roles, artifacts, commands, gates |
| [model.md](model.md) | Product/Project/Canon model and invariants |
| [artifacts.md](artifacts.md) | Artifact types, locations, naming patterns |
| [roles.md](roles.md) | Role ownership matrix (generated from registry) |
| [workflows.md](workflows.md) | Phases and handoffs |
| [gates.md](gates.md) | DoR/DoD/Deployment/Sync rules |
| [commands.md](commands.md) | CLI and agent commands (generated from registry) |
| [lint-rules.md](lint-rules.md) | Linter rule IDs, intents, and checks |
| [glossary.md](glossary.md) | Term definitions |
| [agent-index.md](agent-index.md) | **LLM retrieval index** — fast artifact lookup for agents |

---

## If You're Looking For...

Quick disambiguation for common questions:

| You need... | Go to |
|-------------|-------|
| Single source of truth for ALL rules | [registry.yml](registry.yml) |
| Role ownership matrix | [roles.md](roles.md) |
| Artifact naming patterns & locations | [artifacts.md](artifacts.md) |
| Gate checklists (DoR/DoD/Deploy) | [gates.md](gates.md) |
| Term definitions | [glossary.md](glossary.md) |
| LLM retrieval patterns | [agent-index.md](agent-index.md) |
| Template for creating artifacts | `/templates/` folder |
| Agent instructions for AI assistants | `/agents/` folder |
| Current production behavior | `products/**/f-*.md` (Feature Canon) |
| Proposed changes | `projects/**/fi-*.md` (Feature-Increments) |

---

## Keyword Cross-Reference

| Keyword | Relevant Files |
|---------|---------------|
| canon, canonical, truth | registry.yml, model.md, glossary.md |
| story, user story, delta | artifacts.md (story), templates/story-template.md |
| feature, behavior, requirements | artifacts.md (feature), templates/feature-template.md |
| gate, ready, done, deploy | gates.md, definitions/ |
| role, owner, responsibility | roles.md, registry.yml |
| PRX, prefix, naming | artifacts.md, model.md |
| sync, deployment, canon update | gates.md, commands.md |

---

## How to Use This Spec

1. **For humans:** Read the .md files for understanding
2. **For tooling:** Parse registry.yml for automation
3. **For agents:** Use agent-index.md for fast lookup; role tables from registry.yml
4. **For README/docs:** Tables are generated, not hand-written

---

## Invariants

These rules are **always true** in TeamSpec 4.0:

1. Product Canon is updated **only after deployment** (via `ts:po sync`)
2. Every artifact has **exactly one owner role**
3. Stories link to Epics **via filename** (`s-eXXX-YYY-*.md`)
4. Feature-Increments describe **AS-IS (current) and TO-BE (proposed)**
5. PRX (product prefix) is **immutable** after product creation

---

## Directory Structure

```
spec/4.0/
├── index.md                    # This file
├── registry.yml                # SINGLE SOURCE: roles, artifacts, commands, gates
├── model.md                    # Product/Project/Canon model + invariants
├── artifacts.md                # Artifact types, locations, naming patterns
├── roles.md                    # Generated from registry.yml
├── workflows.md                # Phases + handoffs (no commands)
├── gates.md                    # DoR/DoD/Deployment/Sync exact rules
├── commands.md                 # CLI + agent commands, generated from registry
├── glossary.md                 # Definitions: Canon, Feature, FI, Epic, Story
├── audit/                      # Truth audit artifacts
│   └── truth-audit.md
└── decisions/                  # ADR-lite for locked decisions
    └── DECISION-001-operating-model.md
```

---

## Normative vs Informative Content

| Location | Status | Editable By |
|----------|--------|-------------|
| `spec/4.0/**` | **Normative** | Spec maintainers only |
| `README.md` | Informative | Anyone (must link to spec) |
| `agents/*.md` | Semi-normative | Generated sections from registry |
| `docs/**` | Informative | Anyone |

**If any document conflicts with `spec/4.0/registry.yml`, the registry wins.**
