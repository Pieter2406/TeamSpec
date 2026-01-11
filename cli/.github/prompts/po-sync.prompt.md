---
name: "ts:po-sync"
description: "TeamSpec Product Owner: Sync project changes to Product Canon (post-deploy)"
agent: "agent"
---

# Sync project changes to Product Canon (post-deploy)

Execute the **sync** workflow as a **Product Owner**.

See full role instructions: [AGENT_PO.md](../../.teamspec/agents/AGENT_PO.md)

## Workflow

Sync Product Canon (post-deployment ONLY):
1. Verify Deployment Verification gate passed
2. For each Feature-Increment in project:
   - Merge TO-BE content into Product Feature
   - Update Feature Change Log
3. Update story-ledger.md
4. Set canon_synced in project.yml
5. Archive or close project


## Output

Updated Product Canon

## Precondition

Deployment Verification gate passed

---

> Generated from registry.yml - TeamSpec 4.0
