---
name: "ts:po-product"
description: "TeamSpec Product Owner: Create new product with PRX prefix"
agent: "agent"
---

# Create new product with PRX prefix

Execute the **product** workflow as a **Product Owner**.

See full role instructions: [AGENT_PO.md](../../.teamspec/agents/AGENT_PO.md)

## Workflow

Create a new Product:
1. Gather product information (name, description)
2. Generate unique 3-4 char PRX prefix
3. Create products/{id}/ folder structure
4. Generate product.yml with metadata
5. Create subfolders: business-analysis/, features/, solution-designs/, technical-architecture/, decisions/, qa/regression-tests/
6. Update products-index.md

## Template

Use template: `/.teamspec/templates/product-template.yml`

## Output

products/{id}/ structure


---

> Generated from registry.yml - TeamSpec 4.0
