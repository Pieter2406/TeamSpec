# Project Structure Integration Guide

This document explains how the project folder structure is integrated into TeamSpec prompts and how AI assistants should use it.

## Files Created

### 1. **PROJECT_STRUCTURE_REFERENCE.md**
   - **Location:** Repository root
   - **Purpose:** Human-readable documentation of the complete project structure
   - **Audience:** Team members, documentation readers
   - **Content:**
     - Overview of folder organization
     - Detailed descriptions of each folder
     - Naming conventions
     - Cross-reference rules
     - Workflow state machine
     - Quick reference checklists

### 2. **PROJECT_STRUCTURE.yml** 
   - **Location:** `.teamspec/context/PROJECT_STRUCTURE.yml`
   - **Purpose:** Machine-readable encoding of project structure for AI prompt integration
   - **Audience:** AI assistants, automation tools
   - **Content:**
     - Hierarchical folder definitions with metadata
     - Role ownership mappings
     - File naming patterns (regex-style)
     - Workflow state transitions
     - Cross-reference rules
     - Quality gate definitions

## Integration Points

### In the Context Loading Contract

The `_CONTEXT_CONTRACT.md` now explicitly requires:

```markdown
## 4. Load Project Context (if in a project)

- **Load Project Structure Reference**: Always reference 
  `.teamspec/context/PROJECT_STRUCTURE.yml` for folder organization 
  and responsibilities
```

**What this means:**
- Every AI prompt MUST load `PROJECT_STRUCTURE.yml` along with `team.yml` and `project.yml`
- The structure information is part of the context contract—it's mandatory, not optional
- Violations of folder structure rules are treated like violations of the context contract

### In Role-Based Prompts

Each role prompt should reference the structure:

**Example: BA.md**
```markdown
## Context

Before responding, load:
1. .teamspec/context/team.yml
2. .teamspec/context/PROJECT_STRUCTURE.yml

Your ownership:
- Folder: projects/{project-id}/features/
- Folder: projects/{project-id}/epics/
```

**Example: DEV.md**
```markdown
## Folder Structure Reference

Use .teamspec/context/PROJECT_STRUCTURE.yml for:
- Dev plan folder structure: story-XXX-tasks.md (flat, not sprint-specific)
- Story workflow: ready-to-refine/ → ready-for-development/
- Task naming conventions

When creating tasks, follow patterns in PROJECT_STRUCTURE.yml
```

### In Command Prompts

Commands like `ts:fa story`, `ts:dev plan`, etc., should:

1. Load `PROJECT_STRUCTURE.yml` to understand folder locations
2. Validate file paths match the structure
3. Use naming patterns from the structure definition
4. Enforce cross-reference rules

**Example: ts:fa story**
```
Load PROJECT_STRUCTURE.yml → stories.subfolders.backlog
→ Create story in: projects/{project-id}/stories/backlog/S-XXX.md
→ Validate: Story must link to features/F-XXX.md
→ Validate: Naming matches pattern S-[0-9]{3,}-[a-z-]+
```

**Example: ts:dev plan**
```
Load PROJECT_STRUCTURE.yml → dev-plans
→ Create plan in: projects/{project-id}/dev-plans/story-XXX-tasks.md
→ Validate: Plan links to stories/{state}/S-XXX.md
→ Validate: Tasks include effort, status, acceptance criteria
```

## Usage in AI Assistant Prompts

### For ChatGPT / Claude / Cursor with Custom Instructions

Add to your system prompt:

```
## Project Structure Context

Load the following files to understand folder organization:
1. .teamspec/context/PROJECT_STRUCTURE.yml (machine-readable structure)
2. PROJECT_STRUCTURE_REFERENCE.md (human-readable guide)

Key rules:
- Features in projects/{project-id}/features/ (source of truth)
- Stories in projects/{project-id}/stories/{state}/ (backlog, ready-to-refine, ready-for-development)
- Dev plans in projects/{project-id}/dev-plans/story-XXX-tasks.md (flat structure)
- All cross-references must use relative markdown links

When creating artifacts:
- Always validate against PROJECT_STRUCTURE.yml
- Use naming conventions from PROJECT_STRUCTURE.yml
- Include folder paths from PROJECT_STRUCTURE.yml
```

### For GitHub Copilot via .github/copilot-instructions.md

Add section:

```markdown
## Project Folder Structure

Reference `.teamspec/context/PROJECT_STRUCTURE.yml` for:
- Folder ownership by role
- File naming patterns
- Story workflow states
- Cross-reference rules
```

### For .vscode/copilot-context-rules.json

Example configuration:

```json
{
  "contextRules": [
    {
      "pattern": "**/.teamspec/context/PROJECT_STRUCTURE.yml",
      "description": "Project structure reference for all artifacts",
      "priority": 100
    },
    {
      "pattern": "**/projects/*/stories/**/*.md",
      "description": "Story file - must link to features/",
      "action": "validate"
    },
    {
      "pattern": "**/projects/*/dev-plans/**/*.md",
      "description": "Dev plan - must link to story",
      "action": "validate"
    }
  ]
}
```

## Validation Rules Encoded

The `PROJECT_STRUCTURE.yml` enables these automated validations:

### 1. Folder Location Validation
```
If role=DEV and user tries to create artifact in features/ 
→ ERROR: DEV does not own features/ folder
```

### 2. File Naming Validation
```
If folder=features/ and filename=my-feature.md
→ ERROR: Must match pattern F-[0-9]{3,}-[a-z-]+.md
→ SUGGEST: F-001-my-feature.md
```

### 3. Cross-Reference Validation
```
If artifact_type=story and no link to features/
→ ERROR: Stories must link to Features (rule: must_link_to)
→ SUGGEST: Add "## Linked Features\n- [F-XXX](...)"
```

### 4. Workflow State Validation
```
If story in stories/backlog/ and marked "Ready for sprint"
→ ERROR: Story not in ready-for-development/ state
→ SUGGEST: Move to stories/ready-for-development/ first
```

### 5. Quality Gate Validation
```
If story state = "ready-for-development" and no dev-plan exists
→ ERROR: Dev plan missing (Definition of Ready gate)
→ SUGGEST: Create dev-plans/story-XXX-tasks.md
```

## How Prompts Use This

### Example: ts:fa story (Create Story)

```python
# Pseudocode showing how prompt uses PROJECT_STRUCTURE.yml

def create_story(project_id, title, feature_link):
    # Load structure
    structure = load_yaml('.teamspec/context/PROJECT_STRUCTURE.yml')
    
    # Get story folder from structure
    story_folder = structure['project_folders'][2]['subfolders'][0]['path']
    # → stories/backlog/
    
    # Get naming pattern
    pattern = structure['project_folders'][2]['naming_pattern']
    # → S-[0-9]{3,}-[a-z-]+
    
    # Validate feature link exists
    rules = structure['cross_reference_rules']['stories']['must_link_to']
    # → ['features/ (what it implements) - REQUIRED']
    if not feature_link:
        raise Error("Story must link to feature (rule from PROJECT_STRUCTURE.yml)")
    
    # Create story file
    story_path = f"{project_id}/stories/backlog/S-{next_id()}-{slugify(title)}.md"
    return story_path
```

### Example: ts:dev plan (Create Dev Plan)

```python
def create_dev_plan(story_id):
    # Load structure
    structure = load_yaml('.teamspec/context/PROJECT_STRUCTURE.yml')
    
    # Get dev-plans folder
    dev_plan_path = structure['project_folders'][5]['path']
    # → projects/{project-id}/dev-plans/
    
    # Get naming pattern
    pattern = structure['project_folders'][5]['naming_pattern']
    # → story-[0-9]{3,}-tasks.md
    
    # Validate story exists (cross-reference rule)
    rules = structure['cross_reference_rules']['dev_plans']['must_link_to']
    story = find_story(story_id)
    if not story:
        raise Error("Story not found (cannot create dev plan without story)")
    
    # Create plan file in FLAT structure (not sprint-specific)
    plan_path = f"{project_id}/dev-plans/story-{story_id}-tasks.md"
    return plan_path
```

## Benefits of This Encoding

| Benefit | How It Works |
|---------|-------------|
| **Automation** | Tools can programmatically generate correct file paths, naming, folder locations |
| **Validation** | Linters and CI checks can enforce structure rules automatically |
| **Consistency** | All AI assistants follow same folder structure rules |
| **Documentation** | Structure is self-documenting in YAML format |
| **Extensibility** | Easy to add new folders/rules without changing prompt templates |
| **Migration** | When folder structure changes, only PROJECT_STRUCTURE.yml needs updating |
| **Learning** | New team members can learn structure from human-readable reference + machine-readable spec |

## File Locations Summary

```
DelenSpec/
├── PROJECT_STRUCTURE_REFERENCE.md      ← Human-readable guide (root level)
│
└── .teamspec/
    ├── context/
    │   └── PROJECT_STRUCTURE.yml        ← Machine-readable structure (for prompts)
    │
    └── prompts/
        └── _CONTEXT_CONTRACT.md         ← Updated to require PROJECT_STRUCTURE.yml
```

## Next Steps

1. **Update all role prompts** (BA.md, FA.md, DEV.md, etc.) to reference PROJECT_STRUCTURE.yml
2. **Create linter rules** based on PROJECT_STRUCTURE.yml naming patterns
3. **Update CI/CD checks** to validate folder structure and cross-references
4. **Add to IDE context** via .vscode/ or IDE-specific configuration
5. **Document commands** to reference PROJECT_STRUCTURE.yml for implementation

## References

- [PROJECT_STRUCTURE_REFERENCE.md](../PROJECT_STRUCTURE_REFERENCE.md) — Full documentation
- [.teamspec/context/PROJECT_STRUCTURE.yml](./.teamspec/context/PROJECT_STRUCTURE.yml) — Machine-readable structure
- [_CONTEXT_CONTRACT.md](./.teamspec/prompts/_CONTEXT_CONTRACT.md) — Updated context loading
