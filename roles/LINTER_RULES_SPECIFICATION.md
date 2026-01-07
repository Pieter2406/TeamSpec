# TeamSpec Linter Rules Specification

> **Version:** 2.0  
> **Last Updated:** 2026-01-07  
> **Status:** Specification Document

This document specifies all linter rules for enforcing the TeamSpec Feature Canon operating model.

---

## Rule Categories

| Category | Prefix | Purpose |
|----------|--------|---------|
| Project | `TS-PROJ` | Project structure and registration |
| Feature | `TS-FEAT` | Feature Canon integrity |
| Decision | `TS-DEC` | Decision logging |
| Story | `TS-STORY` | Story format and delta compliance |
| ADR | `TS-ADR` | Architecture decisions |
| Dev Plan | `TS-DEVPLAN` | Development planning |
| QA | `TS-QA` | Quality assurance artifacts |
| UAT | `TS-UAT` | User acceptance testing |
| DoD | `TS-DOD` | Definition of Done gates |

---

## Severity Levels

| Level | Description | Blocks Transition |
|-------|-------------|-------------------|
| **ERROR** | Must fix before proceeding | Yes |
| **BLOCKER** | Blocks specific state transitions | Yes (at gate) |
| **WARNING** | Should fix, not blocking | No |
| **INFO** | Informational, no action required | No |

---

## A. Project Rules (TS-PROJ)

### TS-PROJ-001: Project folder must be registered

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/{project-id}/` |
| **Fails If** | `projects/projects-index.md` has no entry for `{project-id}` |
| **Fix Owner** | BA |
| **Blocks** | All states (Backlog through Release) |

**Check Logic:**
```yaml
type: index_contains
index_file: "projects/projects-index.md"
value_from_path: "projects/{project-id}/"
```

---

### TS-PROJ-002: project.yml required with minimum metadata

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/{project-id}/project.yml` |
| **Fails If** | Missing required fields |
| **Fix Owner** | BA |

**Required Fields:**
- `project_id`
- `name`
- `status`
- `stakeholders`
- `roles`

**Check Logic:**
```yaml
type: yaml_required_keys
keys: ["project_id", "name", "status", "stakeholders", "roles"]
```

---

## B. Feature Canon Rules (TS-FEAT)

### TS-FEAT-001: Feature file required for any story link

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Any story referencing `F-XXX` |
| **Fails If** | File `features/F-XXX-*.md` doesn't exist |
| **Fix Owner** | BA (creates feature) / FA (if delegated) |

**Check Logic:**
```yaml
type: file_exists
pattern: "features/F-{id}-*.md"
id_from: story_feature_link
```

---

### TS-FEAT-002: Feature must include canon sections

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/features/F-*.md` |
| **Fails If** | Missing mandatory headings |
| **Fix Owner** | BA (business sections) / FA (behavioral clarity) |

**Required Headings:**
- `Purpose`
- `Scope`
- `Actors` OR `Personas`
- `Main Flow`
- `Business Rules`
- `Edge Cases`
- `Non-Goals`
- `Change Log`

**Check Logic:**
```yaml
type: markdown_required_headings
headings:
  - "Purpose"
  - "Scope"
  - "Actors|Personas"
  - "Main Flow"
  - "Business Rules"
  - "Edge Cases"
  - "Non-Goals"
  - "Change Log"
```

---

### TS-FEAT-003: Feature IDs must be unique within a project

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/features/F-*.md` |
| **Fails If** | Two feature files declare same Feature ID |
| **Fix Owner** | BA / FA |

**Check Logic:**
```yaml
type: unique_frontmatter_or_field
field: "Feature ID"
scope: project
```

---

## C. Decision Log Rules (TS-DEC)

### TS-DEC-001: Decision must link to impacted feature(s)

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/decisions/DEC-*.md` |
| **Fails If** | No feature link table row or `Impacted Features:` list |
| **Fix Owner** | BA |

**Check Logic:**
```yaml
type: markdown_table_min_rows
section_heading: "Features|Impacted Features"
min_rows: 1
```

---

### TS-DEC-002: Story with Adds/Changes must reference decision

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Stories with impact `Adds Behavior` or `Changes Behavior` |
| **Fails If** | No `DEC-XXX` reference AND no "No new business decision required" flag |
| **Fix Owner** | FA (with BA input) |

**Check Logic:**
```yaml
type: conditional_reference
when:
  any_checkbox_checked:
    - "Adds Behavior"
    - "Changes Behavior"
requires:
  any:
    - pattern: "DEC-\\d+"
    - checkbox_checked: "No new business decision required"
```

---

## D. Story Rules (TS-STORY)

### TS-STORY-001: Story must link to project and ≥1 feature

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Fails If** | Missing project link or no feature link |
| **Fix Owner** | FA |

**Check Logic:**
```yaml
type: markdown_contains
all:
  - "Linked Project"
type: markdown_table_min_rows
section_heading: "Linked Feature"
min_rows: 1
```

---

### TS-STORY-002: Story must describe delta-only behavior

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Fails If** | Missing Before/After OR contains full spec sections |
| **Fix Owner** | FA |

**Required Patterns:**
- Must contain `Before (current behavior):` OR `Before:`
- Must contain `After (new behavior):` OR `After:`

**Forbidden Headings:**
- `Full Specification`
- `Complete Requirements`
- `End-to-End Behavior`
- `Full Flow`

**Check Logic:**
```yaml
type: markdown_contains
all:
  - "Before.*:"
  - "After.*:"
type: markdown_forbidden_headings
headings:
  - "Full Specification"
  - "Complete Requirements"
  - "End-to-End Behavior"
  - "Full Flow"
```

---

### TS-STORY-003: Acceptance Criteria must be present and testable

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Fails If** | Missing AC section OR contains placeholders |
| **Fix Owner** | FA |

**Forbidden Patterns:**
- `{TBD}`
- `TBD` (word boundary)
- `???`
- `lorem ipsum`
- `to be defined`
- `placeholder`

**Check Logic:**
```yaml
type: markdown_required_headings
headings: ["Acceptance Criteria"]
type: markdown_forbidden_patterns
patterns:
  - "\\{TBD\\}"
  - "\\bTBD\\b"
  - "\\?\\?\\?"
  - "lorem ipsum"
  - "to be defined"
  - "placeholder"
```

---

### TS-STORY-004: Only SM can assign sprint

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Condition** | Story has `Sprint:` metadata with value other than `-` |
| **Fails If** | Missing `Assigned By: Role: SM` |
| **Fix Owner** | SM |

**Check Logic:**
```yaml
type: conditional_field
when:
  metadata_exists: ["Sprint"]
  metadata_not_equals:
    Sprint: "-"
requires:
  type: markdown_contains
  all:
    - "Assigned By:"
    - "Role: SM"
```

---

### TS-STORY-005: Ready for Development requires DoR checklist complete

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Condition** | Status is `Ready for Development` |
| **Fails If** | Any DoR checkbox unchecked |
| **Fix Owner** | FA |

**Check Logic:**
```yaml
type: checklist_all_checked
when:
  metadata:
    Status: "Ready for Development"
section_heading: "DoR Checklist|Definition of Ready"
```

---

## E. ADR Rules (TS-ADR)

### TS-ADR-001: Feature marked "Architecture Required" must have ADR

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Features/Stories with `ADR Required: Yes` or `Architecture Impact: High|Medium` |
| **Fails If** | No linked ADR in `/adr/` |
| **Fix Owner** | SA |

**Check Logic:**
```yaml
type: conditional_reference
when:
  any_checkbox_checked: ["ADR Required"]
  OR:
    metadata_in:
      Architecture Impact: ["High", "Medium"]
requires:
  pattern: "ADR-\\d+"
```

---

### TS-ADR-002: ADR must link to feature(s) and decision(s)

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/adr/ADR-*.md` |
| **Fails If** | Missing feature link |
| **Fix Owner** | SA |

**Check Logic:**
```yaml
type: markdown_contains
any:
  - "F-\\d+"
  - "Linked Feature"
  - "Related Feature"
```

---

## F. Dev Plan Rules (TS-DEVPLAN)

### TS-DEVPLAN-001: Story in sprint must have dev plan

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Stories with status `In Sprint` |
| **Fails If** | Missing `dev-plans/story-{ID}-tasks.md` |
| **Fix Owner** | DEV |

**Check Logic:**
```yaml
type: file_exists_for_reference
story_path: "stories/**/S-{id}-*.md"
required_file: "dev-plans/story-{id}-tasks.md"
when:
  metadata_in:
    Status: ["In Sprint", "In Progress", "Ready for Testing"]
```

---

### TS-DEVPLAN-002: Dev plan must map tasks to reviewable iterations

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/dev-plans/story-*.md` |
| **Fails If** | Tasks exist without PR/Review artifact field |
| **Fix Owner** | DEV |

**Check Logic:**
```yaml
type: task_list_field_required
field_pattern: "PR|Review|Artifact"
allow_tbd: true  # "TBD PR link" is acceptable initially
```

---

## G. QA Rules (TS-QA)

### TS-QA-001: Feature must have canonical test pack before release

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Features in release scope |
| **Fails If** | No `qa/test-cases/F-{id}-*.md` |
| **Fix Owner** | QA |

**Check Logic:**
```yaml
type: file_exists_for_reference
feature_path: "features/F-{id}-*.md"
required_file: "qa/test-cases/F-{id}-*.md"
when:
  feature_status: "Ready for Release"
```

---

### TS-QA-002: Bugs must be classified

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/qa/bugs/BUG-*.md` |
| **Fails If** | Bug classification doesn't have exactly one option selected |
| **Fix Owner** | QA |

**Classification Options:**
- Implementation defect
- Feature Canon wrong
- Undocumented behavior

**Check Logic:**
```yaml
type: checklist_exactly_one_checked
section_heading: "Bug Classification"
options:
  - "Implementation defect"
  - "Feature Canon wrong"
  - "Undocumented behavior"
```

---

## H. UAT Rules (TS-UAT)

### TS-UAT-001: UAT pack must reference feature and list changes

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | `projects/*/qa/uat/F-*-uat.md` |
| **Fails If** | Missing feature link OR empty "What Changed" table |
| **Fix Owner** | QA (with FA support) |

**Check Logic:**
```yaml
type: markdown_contains
all:
  - "F-\\d+"
type: markdown_table_min_rows
section_heading: "What Changed"
min_rows: 1
```

---

## I. Definition of Done Rules (TS-DOD)

### TS-DOD-001: Story cannot be Done if behavior changed and Canon not updated

| Attribute | Value |
|-----------|-------|
| **Severity** | BLOCKER |
| **Applies To** | `projects/*/stories/**/*.md` |
| **Condition** | Status is `Done` AND impact is `Adds Behavior` or `Changes Behavior` |
| **Fails If** | Feature Change Log doesn't reference story ID OR DoD checkbox unchecked |
| **Fix Owner** | FA |
| **Blocks** | `Ready for Testing → Done` transition |

**THE MOST CRITICAL RULE**

**Check Logic:**
```yaml
type: conditional_gate
when:
  metadata:
    Status: "Done"
  any_checkbox_checked:
    - "Adds Behavior"
    - "Changes Behavior"
requires:
  all:
    - type: checklist_item_checked
      section_heading: "DoD Checklist"
      item_text_contains: "Feature Canon updated"
    - type: referenced_in_feature_changelog
      feature_link_section: "Linked Feature"
      story_id_from_title: true
```

---

### TS-DOD-002: E2E automation must be feature-level, not story-level

| Attribute | Value |
|-----------|-------|
| **Severity** | ERROR |
| **Applies To** | Test automation files |
| **Fails If** | E2E tests stored under story paths or story-specific naming |
| **Fix Owner** | QA Automation |

**Forbidden Patterns in Test Files:**
- Path contains `stories/`
- Filename contains `S-XXX` without `F-XXX`

**Check Logic:**
```yaml
type: file_path_validation
applies_to: "**/*e2e*.{ts,js,py}"
forbidden_patterns:
  - "stories/"
  - "S-\\d+-"  # story-specific naming without feature
allowed_patterns:
  - "qa/test-cases/"
  - "F-\\d+"  # feature-level naming
```

---

## State Transition Gates

### Transition: Backlog → Ready for Development

**Must Pass:**
- `TS-STORY-001` (feature link)
- `TS-STORY-002` (delta only)
- `TS-STORY-003` (testable AC)
- `TS-STORY-005` (DoR complete)
- `TS-ADR-001` (ADR if required)

---

### Transition: Ready for Development → In Sprint

**Must Pass:**
- `TS-STORY-004` (SM assignment)
- `TS-DEVPLAN-001` (dev plan exists, or 24h grace)

---

### Transition: In Sprint → Ready for Testing

**Must Pass:**
- `TS-DEVPLAN-002` (tasks have PR links)
- Dev DoD items complete

---

### Transition: Ready for Testing → Done

**Must Pass:**
- `TS-DOD-001` (Canon sync when behavior changed)
- `TS-QA-002` (bugs classified)

---

### Transition: Done → Ready for Release

**Must Pass:**
- `TS-QA-001` (feature test pack exists)
- `TS-UAT-001` (UAT pack complete)

---

## Rule Summary Table

| Rule ID | Description | Severity | Owner |
|---------|-------------|----------|-------|
| TS-PROJ-001 | Project registered | ERROR | BA |
| TS-PROJ-002 | project.yml complete | ERROR | BA |
| TS-FEAT-001 | Feature exists for story link | ERROR | BA/FA |
| TS-FEAT-002 | Feature has required sections | ERROR | BA/FA |
| TS-FEAT-003 | Feature IDs unique | ERROR | BA/FA |
| TS-DEC-001 | Decision links to features | ERROR | BA |
| TS-DEC-002 | Story references decision | ERROR | FA |
| TS-STORY-001 | Story links to feature | ERROR | FA |
| TS-STORY-002 | Story is delta-only | ERROR | FA |
| TS-STORY-003 | AC testable, no placeholders | ERROR | FA |
| TS-STORY-004 | SM assigns sprint | ERROR | SM |
| TS-STORY-005 | DoR complete for Ready | ERROR | FA |
| TS-ADR-001 | ADR exists when required | ERROR | SA |
| TS-ADR-002 | ADR links to features | ERROR | SA |
| TS-DEVPLAN-001 | Dev plan for sprint stories | ERROR | DEV |
| TS-DEVPLAN-002 | Tasks have PR links | ERROR | DEV |
| TS-QA-001 | Test pack before release | ERROR | QA |
| TS-QA-002 | Bug classified | ERROR | QA |
| TS-UAT-001 | UAT pack complete | ERROR | QA |
| TS-DOD-001 | Canon sync before Done | BLOCKER | FA |
| TS-DOD-002 | E2E tests feature-level | ERROR | QA |

---

## Implementation Notes

### Adding to Templates

To make rules reliable, add explicit signals to templates:

**Story Template:**
- `Status:` field
- `Assigned By: Role: SM` block
- Impact type checkboxes
- `ADR Required` checkbox

**Feature Template:**
- `Feature ID:` field
- `Change Log` section with story references

**Sprint Template:**
- Committed story table with Dev Plan column

### Linter Configuration

This specification can be implemented in:

```yaml
# teamspec-lint.yml
version: 1
policy: "teamspec-hard-gates"
defaults:
  severity: warning
  owner: "team"
  blocking_states: ["Ready for Development", "In Sprint", "Done", "Ready for Release"]

rules:
  # ... rules from this document
```

---

## References

- [ROLES_AND_RESPONSIBILITIES.md](./ROLES_AND_RESPONSIBILITIES.md)
- [WORKFLOW.md](./WORKFLOW.md)
- [PROJECT_STRUCTURE.yml](../context/PROJECT_STRUCTURE.yml)
