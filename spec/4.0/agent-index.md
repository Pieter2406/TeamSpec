# Agent Retrieval Index

> **Purpose:** Fast intent-to-artifact mapping for LLM agents  
> **Status:** Normative  
> **Spec Version:** 4.0  
> **Last Updated:** 2026-01-12

This index is optimized for LLM retrieval. Use it to quickly find the right artifact type for any intent.

---

## Quick Intent Mapping

| If you want to... | Look in | Pattern |
|-------------------|---------|---------|
| Know what the system does NOW | Product Feature | `products/**/f-*.md` |
| Know what the system WILL do | Feature-Increment | `projects/**/fi-*.md` |
| Know WHY we're building something | Business Analysis | `**/ba-*.md` |
| Know HOW to build it | Technical Architecture | `**/ta-*.md` |
| Know WHAT to test (new features) | Feature-Increment | `projects/**/fi-*.md` |
| Know WHAT to test (regression) | Product Feature | `products/**/f-*.md` |
| Track a story's work items | Dev Plan | `**/dp-*.md` |
| Find sprint scope | Sprint folder | `sprints/sprint-N/` |
| Find normative rules | Registry | `spec/4.0/registry.yml` |
| Find role responsibilities | Roles | `spec/4.0/roles.md` |
| Find gate requirements | Gates | `spec/4.0/gates.md` |

---

## Artifact Lookup Table

| Kind | `artifact_kind` | Owner | Canonicality | ID Pattern | Primary Keywords |
|------|-----------------|-------|--------------|------------|------------------|
| Feature | `feature` | FA | Canon | `f-{PRX}-{NNN}` | behavior, requirements, production truth |
| Feature-Increment | `fi` | FA | Project | `fi-{PRX}-{NNN}` | delta, proposed, TO-BE, AS-IS |
| Story | `story` | FA | Project | `s-e{EEE}-{SSS}` | execution, AC, delta, task |
| Epic | `epic` | FA | Project | `epic-{PRX}-{NNN}` | grouping, outcome, container |
| Business Analysis | `ba` | BA | Canon | `ba-{PRX}-{NNN}` | business, domain, context |
| BA Increment | `bai` | BA | Project | `bai-{PRX}-{NNN}` | business delta |
| Technical Architecture | `ta` | SA | Canon | `ta-{PRX}-{NNN}` | ADR, architecture, constraints |
| TA Increment | `tai` | SA | Project | `tai-{PRX}-{NNN}` | architecture delta |
| Solution Design | `sd` | SA | Canon | `sd-{PRX}-{NNN}` | design, integration |
| SD Increment | `sdi` | SA | Project | `sdi-{PRX}-{NNN}` | design delta |
| Decision | `decision` | PO | Canon | `dec-{PRX}-{NNN}` | decision, rationale |
| Test Case | `tc` | QA | Project | `tc-fi-{PRX}-{NNN}` | test, validation |
| Regression Test | `rt` | QA | Canon | `rt-f-{PRX}-{NNN}` | regression, production test |
| Regression Impact | `ri` | QA | Project | `ri-fi-{PRX}-{NNN}` | impact assessment |
| Bug Report | `bug` | QA | Project | `bug-{project}-{NNN}` | defect, issue |
| Dev Plan | `devplan` | DEV | Project | `dp-e{EEE}-s{SSS}` | tasks, implementation |
| Sprint | `sprint` | SM | Operational | `sprint-{N}` | planning, ceremony |

---

## Anti-Pattern Guide

Use this to verify you're creating/editing the correct artifact:

| If your output looks like... | Wrong artifact | Correct artifact |
|------------------------------|----------------|------------------|
| Implementation details (code patterns, APIs) | Feature | TA or Dev Plan |
| Full behavior restatement | Story | Feature |
| Technical constraints, architectural patterns | Feature | TA |
| Business justification, domain context | Feature | BA |
| Current production state description | FI | Feature |
| Proposed future state | Feature | FI |
| Individual task breakdown | Story | Dev Plan |
| Test scripts or automation code | Test Case | Separate test repo |

---

## File Resolution Priority

When multiple files might answer a question, prefer in this order:

1. **Product Canon** (`products/`) over Project (`projects/`) for "what is true now"
2. **Feature** (`f-*.md`) over Feature-Increment (`fi-*.md`) for current behavior
3. **Feature-Increment** over Story for proposed behavior details
4. **Registry** (`registry.yml`) over generated docs for normative rules
5. **Most recently updated** file if versions conflict

---

## Keyword Cross-Reference

### By Concept

| Concept | Search Terms | Primary Files |
|---------|--------------|---------------|
| Production truth | canon, canonical, truth, AS-IS | `f-*.md`, `registry.yml` |
| Proposed changes | delta, TO-BE, increment, proposal | `fi-*.md`, `story`, `epic` |
| Business logic | rules, BR-, business rule | `f-*.md` (Business Rules section) |
| User behavior | flow, user journey, scenario | `f-*.md` (Current Behavior section) |
| Technical design | architecture, ADR, pattern | `ta-*.md`, `tai-*.md` |
| Testing | AC, acceptance, test, regression | `tc-*.md`, `rt-*.md`, stories |
| Process | gate, DoR, DoD, deployment | `gates.md`, `registry.yml` |

### By Role

| Role | Primary Artifacts | Search Patterns |
|------|-------------------|-----------------|
| PO | Products, Projects, Decisions | `product.yml`, `project.yml`, `dec-*.md` |
| BA | Business Analysis | `ba-*.md`, `bai-*.md` |
| FA | Features, FIs, Epics, Stories | `f-*.md`, `fi-*.md`, `epic-*.md`, `s-e*.md` |
| SA | Architecture, Solution Design | `ta-*.md`, `tai-*.md`, `sd-*.md`, `sdi-*.md` |
| DEV | Dev Plans, Code | `dp-*.md` |
| QA | Tests, Bugs, Regression | `tc-*.md`, `rt-*.md`, `bug-*.md`, `ri-*.md` |
| SM | Sprints, Ceremonies | `sprint-*/`, `active-sprint.md` |

---

## Frontmatter Reference

All templates include YAML frontmatter with these fields:

```yaml
---
artifact_kind: <type>           # Used for filtering/validation
keywords: [list]                # Search optimization
anti_keywords: [list]           # "Not this" guidance
links_required: [list]          # Mandatory relationships
completion_rules:               # Generation constraints
  required_sections: [list]
  optional_sections: [list]
---
```

**Use frontmatter to:**
- Verify artifact type before editing
- Check required relationships before generating links
- Understand which sections are mandatory

---

## Spec Document Map

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [registry.yml](registry.yml) | Single source of truth | Normative rules, any ambiguity |
| [model.md](model.md) | Product/Project model | Understanding the system |
| [artifacts.md](artifacts.md) | Artifact types & locations | File naming, paths |
| [roles.md](roles.md) | Role responsibilities | Who owns what |
| [gates.md](gates.md) | Quality gates | DoR, DoD, deployment |
| [commands.md](commands.md) | CLI commands | What commands exist |
| [glossary.md](glossary.md) | Term definitions | Definition clarification |
| [lint-rules.md](lint-rules.md) | Linter rules | Validation requirements |
| **agent-index.md** (this file) | LLM retrieval | Fast artifact lookup |

---

## Common Workflows

### "I need to understand current behavior"
1. Find product: `products/{product-id}/product.yml`
2. Find feature: `products/{product-id}/features/f-{PRX}-*.md`
3. Read "Current Behavior" section

### "I need to propose a change"
1. Find/create Feature-Increment: `projects/{project-id}/feature-increments/fi-{PRX}-*.md`
2. Copy AS-IS from Product Feature
3. Write TO-BE with proposed changes

### "I need to write a story"
1. Find Epic: `projects/{project-id}/epics/epic-{PRX}-*.md`
2. Create story with Epic ID in filename: `s-e{EEE}-{SSS}-description.md`
3. Reference FI for AS-IS/TO-BE context
4. Write delta only (not full behavior)

### "I need to implement a story"
1. Read story: `projects/**/s-e*-*.md`
2. Find FI TO-BE: `projects/**/fi-*.md`
3. Check TA constraints: `**/ta-*.md`
4. Create dev plan: `dp-e{EEE}-s{SSS}-tasks.md`
