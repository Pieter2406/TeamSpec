# 08 — Implementation Phases

> **Document:** TeamSpec 4.0 Implementation Plan  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Phase Overview

| Phase | Focus | Duration | Dependencies |
|-------|-------|----------|--------------|
| **Phase 1** | Folder Structure & CLI Foundation | 2-3 days | None |
| **Phase 2** | Agent Updates | 2-3 days | Phase 1 |
| **Phase 3** | Command Implementation | 2 days | Phase 2 |
| **Phase 4** | Linter Updates | 2-3 days | Phase 1 |
| **Phase 5** | Templates & Naming | 1-2 days | Phase 1 |
| **Phase 6** | Testing & Documentation | 2 days | All phases |

**Total Estimated Duration:** 11-15 days

---

## 2. Phase 1: Folder Structure & CLI Foundation

### 2.1 Objectives

- Create new folder structure definitions
- Update CLI to detect workspace versions
- Implement basic `teamspec migrate` command
- Update `teamspec init` for 4.0

### 2.2 Deliverables

| Item | File | Priority |
|------|------|----------|
| Version detection | `cli/lib/cli.js` | P0 |
| Product structure creation | `cli/lib/cli.js` | P0 |
| Updated project structure | `cli/lib/cli.js` | P0 |
| Migration command (basic) | `cli/lib/migrate.js` (new) | P1 |
| products-index.md template | `teamspec-core/templates/` | P1 |
| product.yml template | `teamspec-core/templates/` | P1 |

### 2.3 Tasks

```
[x] 1.1 Create detectWorkspaceVersion() function
[x] 1.2 Create findProducts() helper function
[x] 1.3 Create createProductStructure() function
[x] 1.4 Update createProjectStructure() for feature-increments/
[x] 1.5 Create products-index-template.md
[x] 1.6 Create product-template.yml
[x] 1.7 Create increments-index-template.md
[x] 1.8 Update init flow for product-first/project-first choice
[x] 1.9 Create migrate.js with basic structure
[x] 1.10 Add migrate command to CLI
[x] 1.11 Unit tests for new functions
[x] 1.12 Create project-template.yml
```

### 2.4 Validation

- [x] Fresh `teamspec init` creates products/ and projects/
- [x] Existing 2.0 workspace detected correctly
- [x] `teamspec migrate --dry-run` works without errors

**✅ Phase 1 Complete** (2026-01-09)

---

## 3. Phase 2: Agent Updates

### 3.1 Objectives

- Create new AGENT_PO.md
- Update AGENT_BOOTSTRAP.md with 4.0 rules
- Update BA, FA, SM agents for new workflow
- Minor updates to SA, DEV, QA, DES agents

### 3.2 Deliverables

| Item | File | Priority |
|------|------|----------|
| PO Agent | `teamspec-core/agents/AGENT_PO.md` | P0 |
| Bootstrap updates | `teamspec-core/agents/AGENT_BOOTSTRAP.md` | P0 |
| BA Agent updates | `teamspec-core/agents/AGENT_BA.md` | P0 |
| FA Agent updates | `teamspec-core/agents/AGENT_FA.md` | P0 |
| SM Agent updates | `teamspec-core/agents/AGENT_SM.md` | P1 |
| SA Agent updates | `teamspec-core/agents/AGENT_SA.md` | P2 |
| DEV Agent updates | `teamspec-core/agents/AGENT_DEV.md` | P2 |
| QA Agent updates | `teamspec-core/agents/AGENT_QA.md` | P2 |
| FIX Agent updates | `teamspec-core/agents/AGENT_FIX.md` | P1 |

### 3.3 Tasks

```
[x] 2.1 Create AGENT_PO.md from scratch
[x] 2.2 Update AGENT_BOOTSTRAP.md Section 2 (Canon rules)
[x] 2.3 Update AGENT_BOOTSTRAP.md Section 4 (Role summary)
[x] 2.4 Update AGENT_BOOTSTRAP.md Section 6 (Quality gates)
[x] 2.5 Update AGENT_BOOTSTRAP.md Section 8 (Artifact locations)
[x] 2.6 Update AGENT_BA.md responsibilities
[x] 2.7 Update AGENT_BA.md commands (add feature-increment)
[x] 2.8 Update AGENT_FA.md responsibilities
[x] 2.9 Update AGENT_FA.md story rules (Epic mandatory)
[x] 2.10 Update AGENT_FA.md sync flow (prepare, not execute)
[x] 2.11 Update AGENT_SM.md (deployment gate)
[x] 2.12 Update remaining agents (SA, DEV, QA, DES - version, model refs)
[x] 2.13 Update AGENT_FIX.md (new fix rules: TS-PROD, TS-FI, TS-EPIC)
```

### 3.4 Validation

- [x] All agents pass markdown linting
- [x] Cross-references between agents are correct
- [x] No references to deprecated concepts (project features as canon)

**✅ Phase 2 Complete** (2026-01-09)

---

## 4. Phase 3: Command Implementation

### 4.1 Objectives

- Implement new `ts:po` commands
- Update `ts:ba` commands
- Update `ts:fa` commands
- Add `ts:deploy` workflow

### 4.2 Deliverables

Commands to implement (in agents, CLI handles structure only):

| Command | Agent | Priority |
|---------|-------|----------|
| `ts:po product` | AGENT_PO.md | P0 |
| `ts:po status` | AGENT_PO.md | P1 |
| `ts:po approve` | AGENT_PO.md | P1 |
| `ts:po sync` | AGENT_PO.md | P0 |
| `ts:fa feature-increment` | AGENT_FA.md | P0 |
| `ts:fa sync-proposal` | AGENT_FA.md | P0 |
| `ts:sm deploy-checklist` | AGENT_SM.md | P1 |
| `ts:deploy` | Universal | P1 |

### 4.3 Tasks

```
[x] 3.1 Document ts:po product command flow
[x] 3.2 Document ts:po sync command flow
[x] 3.3 Document ts:fa feature-increment command flow
[x] 3.4 Document ts:fa sync-proposal command flow
[x] 3.5 Update ts:po project for target_products
[x] 3.6 Update ts:fa epic for FI linking
[x] 3.7 Update ts:fa story for Epic linking
[x] 3.8 Update ts:fa slice for Epic-based slicing
[x] 3.9 Document ts:sm deploy-checklist
[x] 3.10 Document ts:deploy workflow
```

### 4.4 Validation

- [x] All commands documented with flow diagrams
- [x] Gate checks defined for each command
- [x] Error handling documented

**✅ Phase 3 Complete** (2026-01-09)

---

## 5. Phase 4: Linter Updates

### 5.1 Objectives

- Add TS-PROD-* rules
- Add TS-FI-* rules
- Add TS-EPIC-* rules
- Update existing rules for 4.0

### 5.2 Deliverables

| Item | File | Priority |
|------|------|----------|
| Product rules | `cli/lib/linter.js` | P0 |
| Feature-Increment rules | `cli/lib/linter.js` | P0 |
| Epic rules | `cli/lib/linter.js` | P0 |
| Updated story rules | `cli/lib/linter.js` | P0 |
| Updated DoD rules | `cli/lib/linter.js` | P1 |
| Version-aware linting | `cli/lib/linter.js` | P0 |

### 5.3 Tasks

```
[ ] 4.1 Add findProducts() to linter context
[ ] 4.2 Implement TS-PROD-001 (registration)
[ ] 4.3 Implement TS-PROD-002 (product.yml)
[ ] 4.4 Implement TS-PROD-003 (bidirectional links)
[ ] 4.5 Implement TS-FI-001 (product/feature reference)
[ ] 4.6 Implement TS-FI-002 (AS-IS/TO-BE sections)
[ ] 4.7 Implement TS-FI-003 (target exists)
[ ] 4.8 Implement TS-EPIC-001 (FI link)
[ ] 4.9 Implement TS-EPIC-002 (TO-BE section)
[ ] 4.10 Implement TS-STORY-006 (Epic link)
[ ] 4.11 Update TS-STORY-001 (demote to warning)
[ ] 4.12 Implement TS-DOD-003 (deployment sync)
[ ] 4.13 Add version detection to lint command
[ ] 4.14 Unit tests for all new rules
```

### 5.4 Validation

- [ ] All new rules have unit tests
- [ ] Linting a 2.0 workspace skips 4.0-only rules
- [ ] Linting a 4.0 workspace runs all rules

---

## 6. Phase 5: Templates & Naming

### 6.1 Objectives

- Create feature-increment template
- Update feature template for products
- Update epic template
- Update story template
- Create product templates

### 6.2 Deliverables

| Item | File | Priority |
|------|------|----------|
| feature-increment-template.md | `teamspec-core/templates/` | P0 |
| product-template.yml | `teamspec-core/templates/` | P0 |
| products-index-template.md | `teamspec-core/templates/` | P1 |
| Updated epic-template.md | `teamspec-core/templates/` | P0 |
| Updated story-template.md | `teamspec-core/templates/` | P0 |
| increments-index-template.md | `teamspec-core/templates/` | P1 |

### 6.3 Tasks

```
[ ] 5.1 Create feature-increment-template.md
[ ] 5.2 Create product-template.yml
[ ] 5.3 Create products-index-template.md
[ ] 5.4 Create increments-index-template.md
[ ] 5.5 Update epic-template.md (FI references)
[ ] 5.6 Update story-template.md (Epic link mandatory)
[ ] 5.7 Update feature-template.md (product context)
[ ] 5.8 Update naming patterns in linter
[ ] 5.9 Add FI naming pattern validation
[ ] 5.10 Add product folder naming validation
```

### 6.4 Validation

- [ ] All templates follow naming conventions
- [ ] Templates include required sections
- [ ] Linter validates naming patterns

---

## 7. Phase 6: Testing & Documentation

### 7.1 Objectives

- Create test workspace for 4.0
- Write integration tests
- Update README and documentation
- Update copilot-instructions.md

### 7.2 Deliverables

| Item | Location | Priority |
|------|----------|----------|
| 4.0 test workspace | `teamspec_test/products/` | P0 |
| CLI integration tests | `cli/test/` | P0 |
| Migration tests | `cli/test/migrate.test.js` | P0 |
| Updated README | `cli/README.md` | P1 |
| copilot-instructions.md | `teamspec-core/copilot-instructions.md` | P0 |

### 7.3 Tasks

```
[ ] 6.1 Create test products in teamspec_test/
[ ] 6.2 Create test projects with feature-increments
[ ] 6.3 Write migrate.test.js
[ ] 6.4 Update cli.test.js for 4.0
[ ] 6.5 Update linter.test.js for new rules
[ ] 6.6 Update CLI README
[ ] 6.7 Update copilot-instructions.md
[ ] 6.8 Manual testing walkthrough
[ ] 6.9 Documentation review
[ ] 6.10 Final linter run on test workspace
```

### 7.4 Validation

- [ ] All tests pass
- [ ] Manual testing complete
- [ ] Documentation accurate

---

## 8. Implementation Order

### 8.1 Recommended Sequence

```
Week 1:
├── Day 1-2: Phase 1 (Folder Structure)
│   └── Version detection, structure creation
├── Day 3-4: Phase 4 (Linter - parallel start)
│   └── New rule categories, context updates
└── Day 5: Phase 5 (Templates)
    └── New templates

Week 2:
├── Day 1-3: Phase 2 (Agents)
│   └── PO agent, Bootstrap, BA, FA updates
├── Day 4: Phase 3 (Commands)
│   └── Command documentation
└── Day 5: Phase 6 (Testing)
    └── Test workspace, integration tests

Week 3 (if needed):
└── Buffer for issues, documentation polish
```

### 8.2 Critical Path

```
Phase 1 (Structure)
    │
    ├──→ Phase 4 (Linter)
    │       │
    │       └──→ Phase 6 (Testing)
    │
    └──→ Phase 2 (Agents)
            │
            └──→ Phase 3 (Commands)
                    │
                    └──→ Phase 6 (Testing)
```

---

## 9. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Migration complexity | High | Medium | Extensive dry-run testing |
| Breaking existing workspaces | High | Low | Version detection, backward compat |
| Agent prompt length | Medium | Medium | Modular agent structure |
| Community confusion | Medium | Medium | Clear documentation, migration guide |

---

## 10. Success Criteria

### 10.1 Technical Success

- [ ] `teamspec init` creates 4.0 structure
- [ ] `teamspec migrate` converts 2.0 → 4.0
- [ ] `teamspec lint` enforces all 4.0 rules
- [ ] All agents reflect 4.0 concepts
- [ ] All tests pass

### 10.2 Documentation Success

- [ ] Migration guide complete and tested
- [ ] Command reference complete
- [ ] Agent documentation updated
- [ ] copilot-instructions.md updated

### 10.3 User Experience Success

- [ ] Clear error messages for 4.0 violations
- [ ] Smooth migration path from 2.0
- [ ] No regression in 2.0 functionality (for non-migrated)

---

## 11. Post-Implementation

### 11.1 Release Checklist

- [ ] Version bump to 4.0.0
- [ ] CHANGELOG update
- [ ] npm publish
- [ ] Announcement/release notes

### 11.2 Future Enhancements

- Multi-product sync in single command
- Visual diff for feature-increment → feature sync
- GitHub Action for CI linting
- VS Code extension updates (if applicable)
