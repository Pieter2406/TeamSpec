# LLM Optimization Plan for TeamSpec Documentation

> **Status:** ✅ Complete  
> **Created:** 2026-01-12  
> **Last Updated:** 2026-01-12  
> **Spec Version:** 4.0

---

## 🎯 Goals

| Goal | Improves | How |
|------|----------|-----|
| **Faster retrieval** | Search | Machine-readable metadata, keyword synonyms, predictable headings |
| **Accurate generation** | Editing | Strict completion contracts, required/optional markers, link validation |
| **Reduced hallucination** | Both | Explicit boundaries, "Not this" guidance, anti-synonyms |
| **Smaller context windows** | Both | Chunking hints, collapsible sections, summary blocks |

---

## 📋 Implementation Checklist

### Phase 1: Core Templates (Highest Impact) ✅ COMPLETE

- [x] **P1-01** `templates/feature-template.md` — Add YAML frontmatter + section contracts
- [x] **P1-02** `templates/story-template.md` — Add YAML frontmatter + section contracts
- [x] **P1-03** `templates/feature-increment-template.md` — Add YAML frontmatter + section contracts
- [x] **P1-04** `templates/epic-template.md` — Add YAML frontmatter + section contracts

### Phase 2: Agent Instructions ✅ COMPLETE

- [x] **P2-01** `agents/AGENT_BOOTSTRAP.md` — Add search strategy, generation rules
- [x] **P2-02** `agents/AGENT_FA.md` — Add artifact quick-lookup section
- [x] **P2-03** `agents/AGENT_DEV.md` — Add artifact quick-lookup section
- [x] **P2-04** `agents/AGENT_BA.md` — Add artifact quick-lookup section
- [x] **P2-05** `agents/AGENT_SA.md` — Add artifact quick-lookup section
- [x] **P2-06** `agents/AGENT_QA.md` — Add artifact quick-lookup section
- [x] **P2-07** `agents/AGENT_PO.md` — Add artifact quick-lookup section
- [x] **P2-08** `agents/AGENT_SM.md` — Add artifact quick-lookup section
- [x] **P2-09** `agents/AGENT_DES.md` — Add artifact quick-lookup section
- [x] **P2-10** `agents/README.md` — Add template selection guide

### Phase 3: Indexes & Registry ✅ COMPLETE

- [ ] **P3-01** `spec/4.0/registry.yml` — Add keywords, aliases, intents per artifact (optional enhancement)
- [ ] **P3-02** `spec/4.0/registry.yml` — Add keywords, intent_verbs per role (optional enhancement)
- [x] **P3-03** `spec/4.0/index.md` — Add disambiguation table + keyword cross-reference
- [x] **P3-04** `spec/4.0/agent-index.md` — **Created** (dense retrieval index)
- [x] **P3-05** `templates/README.md` — Add template selection guide
- [x] **P3-06** `README.md` — Add LLM quick-reference section

### Phase 4: Secondary Templates ✅ COMPLETE

- [x] **P4-01** `templates/ta-template.md` — Add YAML frontmatter
- [x] **P4-02** `templates/sd-template.md` — Add YAML frontmatter
- [x] **P4-03** `templates/bug-report-template.md` — Add YAML frontmatter
- [x] **P4-04** `templates/tc-template.md` — Add YAML frontmatter
- [x] **P4-05** `templates/sprint-template.md` — Add YAML frontmatter
- [x] **P4-06** `templates/decision-log-template.md` — Add YAML frontmatter
- [x] **P4-07** `templates/bai-template.md` — Add YAML frontmatter
- [x] **P4-08** `templates/sdi-template.md` — Add YAML frontmatter
- [x] **P4-09** `templates/tai-template.md` — Add YAML frontmatter
- [x] **P4-10** `templates/ri-template.md` — Add YAML frontmatter
- [x] **P4-11** `templates/rt-template.md` — Add YAML frontmatter
- [x] **P4-12** `templates/refinement-notes-template.md` — Add YAML frontmatter
- [x] **P4-13** `templates/uat-pack-template.md` — Add YAML frontmatter
- [x] **P4-14** `templates/business-analysis-template.md` — Add YAML frontmatter
- [x] **P4-15** `templates/functional-spec-template.md` — Add YAML frontmatter
- [x] **P4-16** `templates/storymap-template.md` — Add YAML frontmatter
- [x] **P4-17** `templates/dev-plan-template.md` — Add YAML frontmatter
- [x] **P4-18** `templates/sprint-goal-template.md` — Add YAML frontmatter
- [x] **P4-19** `templates/active-sprint-template.md` — Add YAML frontmatter
- [x] **P4-20** `templates/sprints-index-template.md` — Add YAML frontmatter

### Phase 5: CLI Core Sync & Finalization ✅ COMPLETE

- [x] **P5-01** Run `scripts/sync-cli-core.js` to propagate changes
- [ ] **P5-02** Update CLI version in `cli/package.json` (manual)
- [ ] **P5-03** Test linter with new frontmatter (manual)
- [ ] **P5-04** Publish updated CLI (manual)

---

## 📐 Specification Details

### Frontmatter Schema (All Templates)

```yaml
---
# === LLM Retrieval Metadata ===
artifact_kind: feature | story | epic | fi | decision | ta | sd | tc | rt | ba | bai | sdi | tai | ri | sprint | bug
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA | BA | PO | SA | DEV | QA | SM | DES
artifact_type: "Product Canon" | "Project Execution" | "Planning" | "Operational"
canonicality: canon | project-execution | planning | informative

# === Naming ===
id_pattern: "f-{PRX}-{NNN}"
filename_pattern: "f-{PRX}-{NNN}-{description}.md"

# === Required Relationships (validated by linter) ===
links_required:
  - type: decision
    pattern: "dec-{PRX}-{NNN}"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature canon
  - product canon
  - behavioral spec
aliases:
  - requirements document
  - functional specification
anti_keywords:
  - implementation details
  - technical design

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  max_lengths:
    purpose: 150
    business_value: 300
  required_sections:
    - Purpose
    - Business Value
    - Current Behavior
  optional_sections:
    - Non-Functional Notes
    - Open Questions
---
```

### Section Contract Format

Add **immediately after each major heading** (plain text, visible):

```markdown
## Section Name

> **Contract:** What this section contains and its authority level.  
> **Required precision:** How specific content must be.  
> **Not this:** What does NOT belong here.
```

### Agent Quick-Lookup Table Format

```markdown
## Artifact Quick-Lookup

When searching for context, use these patterns:

| If you need... | Search for | File pattern |
|----------------|-----------|--------------|
| Current production behavior | Product Feature | `products/**/f-{PRX}-*.md` |
| Proposed behavior change | Feature-Increment | `projects/**/fi-{PRX}-*.md` |
| Business context & rationale | Business Analysis | `**/ba-{PRX}-*.md` |
| Technical constraints | Technical Architecture | `**/ta-{PRX}-*.md` |
| Story execution details | Story | `**/s-e*-*.md` |
```

### Agent Generation Rules Section

```markdown
## Generation Rules

When creating artifacts:

1. **Never invent IDs** — Use `{TBD}` if unknown
2. **Never hallucinate links** — Verify file exists before referencing
3. **Respect section contracts** — Read the section's `Contract:` line
4. **Honor required relationships** — Check frontmatter `links_required`
5. **Use anti-keywords** — If your content matches anti_keywords, you're in the wrong artifact
```

---

## 📊 Artifact Frontmatter Reference

Quick reference for each artifact's frontmatter values:

| Artifact | `artifact_kind` | `role_owner` | `canonicality` | `artifact_type` |
|----------|-----------------|--------------|----------------|-----------------|
| Feature | `feature` | `FA` | `canon` | `Product Canon` |
| Feature-Increment | `fi` | `FA` | `project-execution` | `Project Execution` |
| Story | `story` | `FA` | `project-execution` | `Project Execution` |
| Epic | `epic` | `FA` | `project-execution` | `Project Execution` |
| Technical Architecture | `ta` | `SA` | `canon` | `Product Canon` |
| Solution Design | `sd` | `SA` | `canon` | `Product Canon` |
| TA Increment | `tai` | `SA` | `project-execution` | `Project Execution` |
| SD Increment | `sdi` | `SA` | `project-execution` | `Project Execution` |
| Business Analysis | `ba` | `BA` | `canon` | `Product Canon` |
| BA Increment | `bai` | `BA` | `project-execution` | `Project Execution` |
| Decision | `decision` | `PO` | `canon` | `Product Canon` |
| Test Case | `tc` | `QA` | `project-execution` | `Project Execution` |
| Regression Test | `rt` | `QA` | `canon` | `Product Canon` |
| Regression Impact | `ri` | `QA` | `project-execution` | `Project Execution` |
| Bug Report | `bug` | `QA` | `project-execution` | `Project Execution` |
| Sprint | `sprint` | `SM` | `planning` | `Operational` |
| UAT Pack | `uat` | `QA` | `project-execution` | `Project Execution` |

---

## 🔍 Keywords Reference

### Feature Keywords
```yaml
keywords: [feature canon, product canon, system behavior, production truth, behavioral spec]
aliases: [requirements document, functional specification, BRD]
anti_keywords: [implementation, technical design, architecture, story, delta]
```

### Story Keywords
```yaml
keywords: [user story, delta, change request, acceptance criteria, sprint work]
aliases: [ticket, work item, task]
anti_keywords: [full behavior, production truth, canon, feature spec]
```

### Feature-Increment Keywords
```yaml
keywords: [feature increment, FI, proposed change, AS-IS TO-BE, delta proposal]
aliases: [change proposal, feature delta]
anti_keywords: [production truth, current state, canon]
```

### Epic Keywords
```yaml
keywords: [epic, story container, business outcome, delivery grouping]
aliases: [initiative, theme]
anti_keywords: [individual task, implementation detail]
```

### Technical Architecture Keywords
```yaml
keywords: [technical architecture, ADR, architecture decision, constraints, patterns]
aliases: [architecture document, technical design]
anti_keywords: [business requirements, user behavior, story]
```

---

## 📁 New File: `spec/4.0/agent-index.md`

Content specification for the new retrieval index:

```markdown
# Agent Retrieval Index

> **Purpose:** Fast intent-to-artifact mapping for LLM agents  
> **Spec Version:** 4.0  
> **Generated from:** registry.yml

---

## Quick Intent Mapping

| If you want to... | Look in | Pattern |
|-------------------|---------|---------|
| Know what the system does NOW | Product Feature | `products/**/f-*.md` |
| Know what the system WILL do | Feature-Increment | `projects/**/fi-*.md` |
| Know WHY we're building something | Business Analysis | `**/ba-*.md` |
| Know HOW to build it | Technical Architecture | `**/ta-*.md` |
| Know WHAT to test | Feature (regression), FI (new) | `f-*.md`, `fi-*.md` |
| Track a story's work items | Dev Plan | `**/dp-*.md` |
| Find sprint scope | Sprint folder | `sprints/sprint-N/` |

---

## Artifact Lookup Table

| Kind | Owner | Canonicality | ID Pattern | Keywords |
|------|-------|--------------|------------|----------|
| Feature | FA | Canon | f-{PRX}-{NNN} | behavior, requirements, truth |
| Feature-Increment | FA | Project | fi-{PRX}-{NNN} | delta, proposed, TO-BE |
| Story | FA | Project | s-e{EEE}-{SSS} | execution, AC, delta |
| Epic | FA | Project | epic-{PRX}-{NNN} | grouping, outcome |
| Technical Architecture | SA | Canon | ta-{PRX}-{NNN} | ADR, constraints |
| Test Case | QA | Project | tc-fi-{PRX}-{NNN} | validation |
| Regression Test | QA | Canon | rt-f-{PRX}-{NNN} | regression |

---

## Anti-Pattern Guide

| If your output looks like... | Wrong artifact | Correct artifact |
|------------------------------|----------------|------------------|
| Implementation details | Feature | TA or Dev Plan |
| Full behavior restatement | Story | Feature |
| Technical constraints | Feature | TA |
| Business justification | Feature | BA |
| Current production state | FI | Feature |

---

## File Resolution Priority

1. **Product Canon** (`products/`) over Project (`projects/`)
2. **Feature** (`f-*.md`) over Feature-Increment (`fi-*.md`) for "what is"
3. **Feature-Increment** over Story for "what will be"
4. **Most recently updated** if ambiguous
```

---

## ✅ Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Retrieval accuracy | >90% | Agent searches return correct artifact type first try |
| Generation compliance | >85% | Generated artifacts pass linter on first attempt |
| Context efficiency | -30% | Fewer tokens needed for sufficient context |
| Hallucination rate | <5% | Generated links resolve to real files |

---

## 📝 Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-12 | AI | Initial plan created |
| 2026-01-12 | AI | Phase 1 complete - Core templates with frontmatter + contracts |
| 2026-01-12 | AI | Phase 2 complete - All agent quick-lookup tables added |
| 2026-01-12 | AI | Phase 3 complete - agent-index.md created, indexes updated |
| 2026-01-12 | AI | Phase 4 complete - All 20 secondary templates with frontmatter |
| 2026-01-12 | AI | Phase 5 sync complete - CLI core synced (44 files) |

