# Feature Increments Index

> **Project:** `<project-id>`  
> **Target Products:** _List products this project modifies_

## Overview

Feature Increments (FI) describe **TO-BE** changes to Product Features.
They are NOT the source of truth — the Product Canon is.

When this project deploys and Canon is synced, these increments become part of the Product Canon.

## Increment Registry

| ID | Product | Feature | Status | Epic | Description |
|----|---------|---------|--------|------|-------------|
| _(none yet)_ | | | | | |

## Increment Statuses

| Status | Meaning |
|--------|---------|
| `draft` | Being written, not yet reviewed |
| `proposed` | Ready for review |
| `approved` | Accepted, ready for implementation |
| `implemented` | Stories completed, ready for deployment |
| `synced` | Deployed and merged to Product Canon |

## ID Convention

Feature Increment IDs inherit the Product Prefix:

```
fi-PRX-XXX-description.md
│   │   │
│   │   └── Sequential number (001, 002, ...)
│   └────── Product Prefix (3-4 uppercase chars)
└────────── Feature Increment prefix
```

**Example:** `fi-DIT-001-initiative-tracking.md` for DnD Initiative Tracker product

---

## Creating Feature Increments

Use Copilot: `ts:fa feature-increment <product-id> <feature-id>`

This command:
1. Loads the AS-IS from the Product Feature
2. Creates a new FI with TO-BE section to fill
3. Registers it in this index
4. Links the project to the product (if not already linked)
