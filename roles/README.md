# TeamSpec Roles Documentation Index

> **Version:** 2.0  
> **Last Updated:** 2026-01-07

This directory contains the canonical documentation for TeamSpec role definitions, workflows, and agent prompts.

---

## Core Documents

### Foundational References

| Document | Purpose | Status |
|----------|---------|--------|
| [ROLES_AND_RESPONSIBILITIES.md](./ROLES_AND_RESPONSIBILITIES.md) | Complete role definitions with ownership boundaries, prohibited actions, and hard rules | ✅ Complete |
| [WORKFLOW.md](./WORKFLOW.md) | End-to-end workflow with phases, gates, and handoffs | ✅ Complete |

### Implementation Guides

| Document | Purpose | Status |
|----------|---------|--------|
| [AGENT_PROMPT_CREATION_PLAN.md](./AGENT_PROMPT_CREATION_PLAN.md) | Step-by-step plan for creating role-based agent prompts | ✅ Complete |
| [LINTER_RULES_SPECIFICATION.md](./LINTER_RULES_SPECIFICATION.md) | Complete specification of all linter rules for enforcement | ✅ Complete |
| [TEMPLATE_ALIGNMENT_REQUIREMENTS.md](./TEMPLATE_ALIGNMENT_REQUIREMENTS.md) | Required changes to existing templates | ✅ Complete |

### Agent Prompts (To Be Created)

| Document | Purpose | Status |
|----------|---------|--------|
| AGENT_BOOTSTRAP.md | Core operating model for all agents | 📝 Planned |
| AGENT_BA.md | Business Analyst agent prompt | 📝 Planned |
| AGENT_FA.md | Functional Analyst agent prompt | 📝 Planned |
| AGENT_SA.md | Solution Architect agent prompt | 📝 Planned |
| AGENT_DEV.md | Developer agent prompt | 📝 Planned |
| AGENT_QA.md | QA Engineer agent prompt | 📝 Planned |
| AGENT_SM.md | Scrum Master agent prompt | 📝 Planned |
| AGENT_DES.md | Designer agent prompt | 📝 Planned |

---

## Quick Reference

### Role Summary

| Role | Code | Owns | Never Owns |
|------|------|------|------------|
| Business Analyst | BA | Features, Decisions, Project | Stories, UI, Technical |
| Functional Analyst | FA | Stories, Canon Sync, Behavior | Business Intent, Implementation |
| Solution Architect | SA | ADRs, Technical Approach | Code, Requirements |
| Developer | DEV | Dev Plans, Implementation | Scope, Requirements |
| QA Engineer | QA | Tests, Bug Classification | Canon Updates, Scope |
| Designer | DES | UX Design, Flows | Scope, Priority |
| Scrum Master | SM | Sprints, Metrics | Prioritization, Acceptance |

### Workflow Phases

```
0. Project Init     (BA)
1. Business Analysis (BA)
2. Functional Elaboration (FA)
3. Story Definition (FA)
4. Architecture (SA)
5. Sprint Planning & Dev (SM, DEV)
6. Quality Assurance (QA)
7. Canon Sync (FA) ★ CRITICAL
8. Release (SM, Team)
```

### Critical Gates

| Gate | Blocks | Enforced By |
|------|--------|-------------|
| Feature exists | Story creation | TS-FEAT-001 |
| Story is delta | Ready for Dev | TS-STORY-002 |
| DoR complete | Ready for Dev | TS-STORY-005 |
| Dev plan exists | Sprint start | TS-DEVPLAN-001 |
| Canon synced | Done status | TS-DOD-001 |

---

## Document Relationships

```
ROLES_AND_RESPONSIBILITIES.md
        │
        ├── Defines roles used in ──→ WORKFLOW.md
        │
        ├── Informs creation of ──→ AGENT_PROMPT_CREATION_PLAN.md
        │
        └── Rules encoded in ──→ LINTER_RULES_SPECIFICATION.md
                                        │
                                        └── Applied to ──→ TEMPLATE_ALIGNMENT_REQUIREMENTS.md
```

---

## How to Use These Documents

### For Understanding Roles

1. Start with [ROLES_AND_RESPONSIBILITIES.md](./ROLES_AND_RESPONSIBILITIES.md)
2. Review prohibited actions for your role
3. Understand handoff points in [WORKFLOW.md](./WORKFLOW.md)

### For Creating Agent Prompts

1. Review [AGENT_PROMPT_CREATION_PLAN.md](./AGENT_PROMPT_CREATION_PLAN.md)
2. Use role definitions from ROLES_AND_RESPONSIBILITIES.md
3. Reference gates from WORKFLOW.md
4. Include linter rules from LINTER_RULES_SPECIFICATION.md

### For Updating Templates

1. Review [TEMPLATE_ALIGNMENT_REQUIREMENTS.md](./TEMPLATE_ALIGNMENT_REQUIREMENTS.md)
2. Apply changes to templates in `.teamspec/templates/`
3. Verify linter rules are enforceable

### For Implementing Linter

1. Review [LINTER_RULES_SPECIFICATION.md](./LINTER_RULES_SPECIFICATION.md)
2. Implement rules in `teamspec-lint.yml`
3. Test against template changes

---

## Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| PROJECT_STRUCTURE.yml | `.teamspec/context/` | Folder structure |
| PROJECT_STRUCTURE_REFERENCE.md | Repository root | Human-readable structure guide |
| Definition of Ready | `.teamspec/definitions/` | DoR checklist |
| Definition of Done | `.teamspec/definitions/` | DoD checklist |
| Templates | `.teamspec/templates/` | Document templates |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-07 | Initial creation of roles documentation suite | System |
| 2026-01-07 | Added ROLES_AND_RESPONSIBILITIES.md | System |
| 2026-01-07 | Added WORKFLOW.md | System |
| 2026-01-07 | Added AGENT_PROMPT_CREATION_PLAN.md | System |
| 2026-01-07 | Added LINTER_RULES_SPECIFICATION.md | System |
| 2026-01-07 | Added TEMPLATE_ALIGNMENT_REQUIREMENTS.md | System |
