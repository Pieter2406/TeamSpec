# Products Index

Master index of all products in this workspace.

## Overview

Products represent the **AS-IS** state of your systems. They contain:
- Feature Canon (source of truth for behavior)
- Business Analysis documents
- Solution Designs
- Technical Architecture decisions

Projects propose **TO-BE** changes to products via Feature Increments.

## Product Registry

| Prefix | ID | Name | Status | Active Projects |
|--------|-----|------|--------|-----------------|
| _(none yet)_ | | | | |

---

## Adding Products

Use one of these methods:

1. **CLI:** `teamspec init --product <name>`
2. **Copilot:** `ts:po product`
3. **Manual:** Copy `/.teamspec/templates/product-template.yml`

## Product Structure

Each product folder contains:

```
products/<product-id>/
├── product.yml                 # Product configuration (includes PRX prefix)
├── README.md                   # Product overview
├── business-analysis/          # BA documents (ba-PRX-XXX)
├── features/                   # Feature Canon (f-PRX-XXX)
│   ├── features-index.md
│   └── story-ledger.md
├── solution-designs/           # Solution designs (sd-PRX-XXX)
├── technical-architecture/     # Tech architecture (ta-PRX-XXX)
└── decisions/                  # Product decisions (dec-PRX-XXX)
```
