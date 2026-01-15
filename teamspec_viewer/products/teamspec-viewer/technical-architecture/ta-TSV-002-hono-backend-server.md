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
id_pattern: "ta-TSV-002"
filename_pattern: "ta-TSV-002-hono-backend-server.md"

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
  - backend
  - hono
  - file server
  - api
  - artifact access
aliases:
  - backend stack decision
  - file access mechanism
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

# Technical Architecture: `ta-TSV-002-hono-backend-server`

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
| **TA ID** | ta-TSV-002 |
| **Product** | teamspec-viewer (TSV) |
| **Status** | Proposed |
| **Date** | 2026-01-14 |
| **Author** | AI-Generated |
| **Superseded By** | — |

---

## Context

The frontend architecture ([ta-TSV-001](ta-TSV-001-react-browser-frontend.md)) established that TeamSpec Viewer is a pure browser application using React + TypeScript.

A critical open constraint remained: **how does the browser app access TeamSpec workspace artifacts?**

TeamSpec artifacts are stored as markdown files in a local folder structure (`products/`, `projects/`). Browsers cannot directly access arbitrary local files for security reasons.

This TA addresses the **artifact ingestion / content access mechanism**.

### Key Constraints / Forces

- The React frontend runs in the browser and cannot read local files directly.
- TeamSpec workspaces are folder structures on disk.
- The viewer must parse and index markdown files to enable navigation and search.
- The solution should be simple and lightweight for MVP.

---

## Options Considered

### Option 1: Hono.js backend server

**Description**: Use Hono.js as a lightweight backend server that:
- Runs locally alongside the frontend.
- Serves TeamSpec workspace files to the browser via HTTP API.
- Provides endpoints for listing products/projects, reading artifact content, and supporting search indexing.

**Pros**:
- Lightweight, fast, and minimal configuration.
- TypeScript-native (aligns with frontend stack).
- Simple file-serving endpoints are easy to implement.
- Can run on Node.js or other runtimes (Bun, Deno, Cloudflare Workers).

**Cons**:
- Requires running a local server (not a zero-install experience).
- API design and endpoint structure need definition.

### Option 2: Static build ingestion

**Description**: Pre-process the TeamSpec workspace into a static JSON bundle at build time; frontend loads the bundle.

**Pros**:
- No runtime server required.

**Cons**:
- Requires rebuild on every workspace change.
- Not suitable for live/dynamic documentation viewing.

### Option 3: File upload / drag-and-drop

**Description**: User uploads or drags a folder into the browser; frontend parses in-memory.

**Pros**:
- No server required.

**Cons**:
- UX friction for repeated use.
- Browser File System Access API has limited support.
- Large workspaces may cause performance issues in-browser.

---

## Decision

We are choosing **Option 1: Hono.js backend server**.

- **Backend framework**: Hono.js
- **Runtime**: Node.js (MVP baseline; portable to Bun/Deno later)
- **Responsibilities**:
  - Serve TeamSpec workspace files (products, projects, artifacts).
  - Provide API endpoints for listing and reading artifacts.
  - Support artifact indexing for search.

This decision resolves the open blocker in [ta-TSV-001](ta-TSV-001-react-browser-frontend.md) regarding artifact access.

---

## Consequences

### Positive

- Simple, TypeScript-native backend aligns with frontend stack.
- Enables live workspace viewing without rebuild.
- Lightweight and fast for local development and documentation browsing.
- Clear separation: frontend handles UI, backend handles file access.

### Negative

- Users must run a local server to use the viewer (not a single-file experience).
- API endpoint design and workspace path configuration are documented in Implementation Notes.

---

## Related Decisions

| Decision ID | Decision Title | Relationship |
|-------------|----------------|--------------|
| [ta-TSV-001](ta-TSV-001-react-browser-frontend.md) | React Browser Frontend | Related to (frontend consumes backend API) |

---

## Affected Features

| Feature ID | Feature Name | Impact | Canon Review Needed? |
|------------|--------------|--------|---------------------|
| [f-TSV-001](../features/f-TSV-001-product-portfolio-view.md) | Product Portfolio View | Backend provides product/project listing API | No |
| [f-TSV-002](../features/f-TSV-002-role-specific-dashboards.md) | Role-Specific Dashboards | Backend provides artifact listing by type/role | No |
| [f-TSV-003](../features/f-TSV-003-feature-increment-navigation.md) | Feature-Increment Navigation | Backend provides artifact content API | No |
| [f-TSV-007](../features/f-TSV-007-artifact-search.md) | Artifact Search | Backend provides search index / query API | No |

---

## Behavior Impact Assessment

### Does this Technical Architecture affect user-observable behavior?

- [x] **No** — Infrastructure decision; behavior defined by Feature Canon / Feature-Increments
- [ ] **Yes** — Behavior implications described below

### Behavior Implications (if Yes)

| Technical Decision | Behavior Implication | FA Action |
|--------------------|---------------------|-----------|
| — | — | — |

---

## Implementation Notes

- Hono.js project setup and folder structure → **RESOLVED**: `backend/src/index.ts` with `routes/` subfolder
- API endpoint design (list products, list artifacts, read artifact content, search) → **RESOLVED**: See API Design section below
- Workspace path configuration (how does the server know where the TeamSpec folder is?) → **RESOLVED**: `TEAMSPEC_ROOT` environment variable or defaults to parent directory
- CORS configuration for local development → **RESOLVED**: `cors()` middleware enabled for all origins in dev mode

### API Design (Implemented)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/artifacts` | GET | List artifacts with optional type/role filters |
| `/api/artifacts/:path` | GET | Read artifact content (markdown) |
| `/api/products` | GET | List all products |
| `/api/products/:productId/projects` | GET | List projects targeting a product |
| `/api/search` | GET | Search artifacts by query string |

---

## Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | AI-Generated | ✅ | 2026-01-14 |
| Tech Lead | (Self-approved for MVP) | ✅ | 2026-01-15 |
| FA (if behavior affected) | — | — | — |

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-TA-001 | Technical Architecture required for architecture-impacting changes |
| TS-TA-002 | Technical Architecture must link to affected features |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md → Context (open blocker for artifact access)
- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 8 (Constraints: Node.js stack)

## Unresolved Items

- ~~API endpoint design and contracts~~ → **RESOLVED**: See Implementation Notes above
- ~~Workspace path configuration mechanism~~ → **RESOLVED**: `TEAMSPEC_ROOT` env var or parent directory default
- ~~Search indexing approach (server-side vs client-side)~~ → **RESOLVED**: Server-side file-based grep scan (no indexing for MVP)
