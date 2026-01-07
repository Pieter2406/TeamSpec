# Project Structure Documentation Summary

## Overview
Created comprehensive project folder structure documentation and integrated it into TeamSpec prompts and context loading.

## Files Created

### 1. **PROJECT_STRUCTURE_REFERENCE.md** (Root Level)
- **Location:** `DelenSpec/PROJECT_STRUCTURE_REFERENCE.md`
- **Size:** ~1500 lines of documentation
- **Purpose:** Human-readable, comprehensive guide to the project folder structure
- **Audience:** Team members, documentation readers, new team members

**Contains:**
- Detailed descriptions of each folder (features/, stories/, sprints/, dev-plans/, decisions/, adr/, qa/, epics/)
- Folder ownership by role (BA, FA, ARCH, DEV, TEST, SM)
- Naming conventions (F-XXX, S-XXX, ADR-XXX, etc.)
- Story workflow states and transitions
- Cross-reference rules between artifacts
- Quality gate checklists
- Quick reference tables
- Template structures for each artifact type

### 2. **PROJECT_STRUCTURE.yml** (Machine-Readable)
- **Location:** `.teamspec/context/PROJECT_STRUCTURE.yml`
- **Format:** YAML with structured data
- **Purpose:** Machine-readable encoding of project structure for AI prompts and automation
- **Audience:** AI assistants, linters, CI/CD tools, automation scripts

**Contains:**
- Hierarchical folder definitions with metadata
- File naming patterns (regex-style)
- Role-to-folder mappings
- Workflow state machines
- Cross-reference validation rules
- Quality gate definitions
- All information needed to programmatically enforce structure

### 3. **PROJECT_STRUCTURE_INTEGRATION_GUIDE.md** (Framework Integration)
- **Location:** `.teamspec/context/PROJECT_STRUCTURE_INTEGRATION_GUIDE.md`
- **Purpose:** Guide for integrating project structure into AI assistant prompts
- **Audience:** Framework developers, prompt engineers, automation builders

**Contains:**
- How to use the structure files in prompts
- Integration points in role-based commands
- Examples of how prompts should load and use PROJECT_STRUCTURE.yml
- Validation rules that can be enforced
- Pseudocode showing implementation patterns
- Benefits and use cases

## Files Updated

### 1. **_CONTEXT_CONTRACT.md**
- **Location:** `.teamspec/prompts/_CONTEXT_CONTRACT.md`
- **Change:** Added requirement to load PROJECT_STRUCTURE.yml as part of context loading contract
- **Impact:** Every AI assistant prompt MUST now load and respect project structure rules

**Added Section:**
```markdown
## 4. Load Project Context (if in a project)

- **Load Project Structure Reference**: Always reference 
  `.teamspec/context/PROJECT_STRUCTURE.yml` for folder organization 
  and responsibilities
```

### 2. **QUICK_REFERENCE.md**
- **Location:** `QUICK_REFERENCE.md` (root level)
- **Change:** Updated File Locations table with new multi-project structure paths
- **Impact:** Quick reference now points to PROJECT_STRUCTURE_REFERENCE.md

**Updated Table:**
- Changed from flat folder structure to `/projects/{project-id}/` based paths
- Added all workflow-specific story folders (backlog/, ready-to-refine/, ready-for-development/)
- Added dev-plans/ and new QA structure
- Added link to PROJECT_STRUCTURE_REFERENCE.md

## Key Concepts Encoded

### 1. **Folder Ownership by Role**
```yaml
BA:      features/, epics/
FA:      features/, stories/
ARCH:    adr/, decisions/
DEV:     dev-plans/, stories/ready-for-development/
TEST:    qa/
SM:      sprints/, stories/
```

### 2. **Story Workflow States**
```
backlog/ 
  → ready-to-refine/ 
    → ready-for-development/ 
      → sprints/sprint-N/ 
        → archived (feature-ledger.md)
```

### 3. **Naming Patterns**
```
Features:     F-[0-9]{3,}-[a-z-]+.md
Stories:      S-[0-9]{3,}-[a-z-]+.md
Architecture: ADR-[0-9]{3,}-[a-z-]+.md
Decisions:    DECISION-[0-9]{3,}-[a-z-]+.md
Epics:        EPIC-[0-9]{3,}-[a-z-]+.md
Test Cases:   TC-[0-9]{3,}-[description]
Sprints:      sprint-[0-9]+/
Dev Plans:    story-[0-9]{3,}-tasks.md (FLAT)
```

### 4. **Cross-Reference Rules**
```
Stories MUST link to Features
Dev Plans MUST link to Stories
Test Cases should link to Features and Stories
Decisions should link to Features and Stories
ADRs should link to Decisions and Features
```

### 5. **Quality Gates**
```
Definition of Ready:
  ✓ Feature link exists
  ✓ Feature Canon current
  ✓ AC are testable

Definition of Done:
  ✓ Code complete
  ✓ Tests passed
  ✓ Feature Canon updated
  ✓ Added to story-ledger.md
```

## How AI Assistants Use This

### For GitHub Copilot
`.github/copilot-instructions.md` now references:
```markdown
## Project Structure

Load .teamspec/context/PROJECT_STRUCTURE.yml for folder organization
```

### For Custom Instructions / System Prompts
Teams can include in their system prompt:
```
When creating artifacts, reference:
1. PROJECT_STRUCTURE_REFERENCE.md (human-readable)
2. .teamspec/context/PROJECT_STRUCTURE.yml (machine-readable)
```

### For Automation / Linters
Tools can:
1. Load PROJECT_STRUCTURE.yml programmatically
2. Validate file paths match defined folders
3. Enforce naming patterns
4. Check cross-reference rules
5. Validate quality gates

## Usage Workflow

### When Copilot Creates a Story:
1. Loads PROJECT_STRUCTURE.yml
2. Looks up: `project_folders[2].subfolders[0].path` → `stories/backlog/`
3. Looks up naming pattern → `S-[0-9]{3,}-[a-z-]+`
4. Validates cross-reference rule: Story must link to Features
5. Creates: `projects/{project-id}/stories/backlog/S-XXX-name.md`

### When Creating a Dev Plan:
1. Loads PROJECT_STRUCTURE.yml
2. Finds: dev_plans structure (FLAT, not sprint-specific)
3. Gets naming: `story-[0-9]{3,}-tasks.md`
4. Creates: `projects/{project-id}/dev-plans/story-XXX-tasks.md`
5. Validates: Dev plan links to story file

### When a Story is Done:
1. Loads cross-reference rules
2. Checks: Feature file must be updated (FA-AUTO-SYNC)
3. Validates: Story added to story-ledger.md
4. Confirms: All quality gates passed

## Benefits

| Benefit | How Achieved |
|---------|--------------|
| **Consistency** | All AI assistants follow same structure rules |
| **Automation** | Tools can generate correct paths and names programmatically |
| **Validation** | Linters can enforce structure rules automatically |
| **Documentation** | Structure is self-documenting (human + machine readable) |
| **Extensibility** | Changes to structure only require updating PROJECT_STRUCTURE.yml |
| **Learning** | New team members learn from structured documentation |
| **No Ambiguity** | Rules explicitly defined, not left to interpretation |

## Integration Checklist

- [x] Create PROJECT_STRUCTURE_REFERENCE.md (human-readable)
- [x] Create PROJECT_STRUCTURE.yml (machine-readable)
- [x] Create PROJECT_STRUCTURE_INTEGRATION_GUIDE.md (integration guide)
- [x] Update _CONTEXT_CONTRACT.md to require PROJECT_STRUCTURE.yml
- [x] Update QUICK_REFERENCE.md with new structure paths
- [ ] Update individual prompt files (BA.md, FA.md, DEV.md, etc.) to reference PROJECT_STRUCTURE.yml
- [ ] Create linter validation rules based on PROJECT_STRUCTURE.yml
- [ ] Add CI/CD checks for folder structure compliance
- [ ] Configure IDE context (.vscode/) to reference PROJECT_STRUCTURE.yml

## Next Steps for Teams

1. **Read** `PROJECT_STRUCTURE_REFERENCE.md` to understand the organization
2. **Reference** `PROJECT_STRUCTURE.yml` when implementing automation
3. **Update** your `.github/copilot-instructions.md` with structure rules
4. **Configure** your IDE to load `PROJECT_STRUCTURE.yml` as context
5. **Build** linter rules using the structure definitions
6. **Train** your team on naming conventions and folder ownership

## Files at a Glance

```
DelenSpec/
├── PROJECT_STRUCTURE_REFERENCE.md    ← Human-readable (START HERE)
├── README.md
├── QUICK_REFERENCE.md                ← Updated with new structure
│
└── .teamspec/
    ├── context/
    │   ├── PROJECT_STRUCTURE.yml              ← Machine-readable structure
    │   └── PROJECT_STRUCTURE_INTEGRATION_GUIDE.md  ← Integration howto
    │
    └── prompts/
        └── _CONTEXT_CONTRACT.md               ← Updated to require structure
```

## Questions?

- **For understanding the structure:** Read PROJECT_STRUCTURE_REFERENCE.md
- **For implementing in AI prompts:** Read PROJECT_STRUCTURE_INTEGRATION_GUIDE.md
- **For machine processing:** Load PROJECT_STRUCTURE.yml
- **For context loading rules:** See updated _CONTEXT_CONTRACT.md
