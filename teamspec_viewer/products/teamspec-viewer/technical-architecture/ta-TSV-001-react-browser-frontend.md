---
# === LLM Retrieval Metadata ===
artifact_kind: ta
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: SA
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "ta-TSV-001"
filename_pattern: "ta-TSV-001-react-browser-frontend.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature
    pattern: "f-TSV-*"
    optional: true
    note: "Link to affected features"

# === Search Optimization ===
keywords:
  - technical architecture
  - frontend
  - browser application
  - react
  - typescript
  - tailwind
  - material ui
aliases:
  - frontend stack decision
anti_keywords:
  - business requirements
  - user behavior
  - story
  - feature behavior

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  required_sections:
    - Context
    - Decision
    - Consequences
---

# Technical Architecture: `ta-TSV-001-react-browser-frontend`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-14

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Technical Architecture (Canonical)  
**Lifecycle:** Permanent, versioned

---

## Metadata

| Field | Value |
| :--- | :--- |
| **TA ID** | ta-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Proposed |
| **Date** | 2026-01-14 |
| **Author** | AI-Generated |
| **Superseded By** | — |

---

## Context

TeamSpec Viewer requires a technical foundation to deliver the MVP capabilities defined in the product Business Analysis and Feature Canon, including:
- Role-focused documentation navigation (BA/FA-first MVP slice)
- Markdown reading experience
- Diagram rendering in markdown (Mermaid, PlantUML)

This TA is triggered by the need to set a consistent **frontend technology baseline** for the product.

### Key Constraints / Forces

- The product is intended to be a **pure browser application**.
- The frontend should be built with **React** using **TypeScript**.
- Styling should use **Tailwind CSS**.
- The UI component library should be **Material UI**.

### Critical Open Constraint (Architecture Risk)

TeamSpec artifacts are stored as files in a workspace folder structure (products/projects). A pure browser application cannot directly access arbitrary local files without an explicit data access mechanism.

- The mechanism for **how the browser app reads TeamSpec workspace artifacts** is not yet defined in Product Canon.

---

## Options Considered

### Option 1: Pure browser app (React + TypeScript) with Tailwind + Material UI

**Description**: Implement the viewer UI as a browser application using React+TypeScript, Tailwind for utility styling, and Material UI for component primitives.

**Pros**:
- Aligns with the stated product direction (browser-based).
- Supports rapid UI iteration for role dashboards and navigation.

**Cons**:
- Requires a separate decision for content access (where the artifacts come from in the browser context).

### Option 2: VS Code Extension

**Description**: Implement the viewer as a VS Code extension using webview panels.

**Pros**:
- Direct file system access via VS Code API
- Integrated developer experience

**Cons**:
- Tied to VS Code; not accessible to non-VS Code users
- More complex deployment and update model

**Decision**: Not selected for MVP; may be considered for future integration.

---

## Decision

We are choosing **Option 1** as the frontend baseline:

- **Application type**: Browser application
- **Frontend library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI component library**: Material UI

This decision establishes the UI and development baseline needed to implement the MVP features.

This TA does **not** decide the artifact ingestion / content access mechanism; that is addressed by [ta-TSV-002](ta-TSV-002-hono-backend-server.md) (Hono.js backend server).

---

## Consequences

### Positive

- Establishes a consistent development baseline for UI implementation across MVP features.
- Supports the BA/FA-first MVP slice through a modern, component-based UI approach.

### Negative

- Tailwind + Material UI combined usage requires clear conventions to avoid inconsistent styling outcomes. **Convention**: Use MUI components for structure, Tailwind for spacing/colors, custom CSS for gradients/animations.
- ~~A pure browser app requires an explicit approach for reading TeamSpec artifacts.~~ **Resolved by [ta-TSV-002](ta-TSV-002-hono-backend-server.md)**: Hono.js backend serves workspace files via HTTP API.

---

## Related Decisions

| Decision ID | Decision Title | Relationship |
|-------------|----------------|--------------|
| [ta-TSV-002](ta-TSV-002-hono-backend-server.md) | Hono Backend Server | Related to (resolves artifact access blocker) |

---

## Affected Features

| Feature ID | Feature Name | Impact | Canon Review Needed? |
|------------|--------------|--------|---------------------|
| [f-TSV-002](../features/f-TSV-002-role-specific-dashboards.md) | Role-Specific Dashboards | Sets the UI stack baseline for dashboards | No |
| [f-TSV-003](../features/f-TSV-003-feature-increment-navigation.md) | Feature-Increment Navigation | Sets the UI stack baseline for AS-IS/TO-BE navigation UI | No |
| [f-TSV-006](../features/f-TSV-006-markdown-diagram-rendering.md) | Markdown Diagram Rendering | Constrains diagram rendering integration to browser-compatible approach | No (post-MVP) |
| [f-TSV-007](../features/f-TSV-007-artifact-search.md) | Artifact Search | Sets the UI stack baseline for search UI | No |

---

## Behavior Impact Assessment

### Does this Technical Architecture affect user-observable behavior?

- [x] **No** — Technology baseline decision only (behavior defined by Feature Canon / Feature-Increments)
- [ ] **Yes** — Behavior implications described below

### Behavior Implications (if Yes)

| Technical Decision | Behavior Implication | FA Action |
|--------------------|---------------------|-----------|
| N/A | N/A | N/A |

---

## Implementation Notes

- React + TypeScript codebase conventions → **RESOLVED**: Functional components, hooks, Context for state
- Tailwind + Material UI composition conventions → **RESOLVED**: MUI for structure, Tailwind for spacing/utility, CSS vars for gradients
- Diagram rendering approach for Mermaid and PlantUML → Post-MVP; consider mermaid.js for client-side rendering
- Artifact indexing approach to support role dashboards + search → **RESOLVED**: Server-side via ta-TSV-002 Hono backend

---

## Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | AI-Generated | ✅ | 2026-01-14 |
| Tech Lead | (Self-approved for MVP) | ✅ | 2026-01-15 |
| FA (if behavior affected) | N/A | — | — |

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-TA-001 | Technical Architecture required for architecture-impacting changes |
| TS-TA-002 | Technical Architecture must link to affected features |

---

## Sources Consulted

- templates/ta-template.md → Entire document (structure and required sections)
- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope)
- teamspec_viewer/products/teamspec-viewer/features/features-index.md → Feature list
- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → Feature context
- teamspec_viewer/products/teamspec-viewer/features/f-TSV-006-markdown-diagram-rendering.md → Diagram scope

## Unresolved Items

- ~~Artifact ingestion / content access mechanism for a pure browser app~~ → **Resolved by [ta-TSV-002](ta-TSV-002-hono-backend-server.md)**
- ~~Tailwind + Material UI styling conventions~~ → **RESOLVED**: MUI for components, Tailwind for utilities, CSS vars for theming
- Diagram rendering library/approach for Mermaid and PlantUML → Post-MVP (consider mermaid.js)
- ~~Any related `dec-TSV-*` decision records~~ → **RESOLVED**: None required; TAs are authoritative for technical decisions
