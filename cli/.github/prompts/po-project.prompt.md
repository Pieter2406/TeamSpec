---
name: "ts:po-project"
description: "TeamSpec Product Owner: Create new project targeting product(s)"
agent: "agent"
---

# Create new project targeting product(s)

Execute the **project** workflow as a **Product Owner**.

See full role instructions: [AGENT_PO.md](../../.teamspec/agents/AGENT_PO.md)

## Workflow

Create a new Project:
1. Gather project information (name, target products)
2. Create projects/{id}/ folder structure
3. Generate project.yml with target_products
4. Create subfolders per FOLDER_STRUCTURE.yml
5. Initialize index files

## Template

Use template: `/.teamspec/templates/project-template.yml`

## Output

projects/{id}/ structure


---

> Generated from registry.yml - TeamSpec 4.0
