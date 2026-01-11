<!-- DO NOT EDIT - Generated from registry.yml -->

# TeamSpec 4.0 Roles

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Role Ownership Matrix

| Role | Owns | Creates | Refuses |
|------|------|---------|---------|
| **PO** (Product Owner) | Products, Product Canon, Projects, PRX assignment, Deployment approval authority, Canon sync | `product.yml`, `project.yml`, `dec-PRX-*.md` | Stories, Technical design, Sprint management |
| **BA** (Business Analyst) | Business Analysis artifacts, Domain knowledge | `ba-PRX-*.md`, `bai-PRX-*.md` | Projects, Features, Feature-Increments, Epics, Stories, Technical design |
| **FA** (Functional Analyst) | Features, Feature-Increments, Epics, Stories, Sync proposals | `f-PRX-*.md`, `fi-PRX-*.md`, `epic-PRX-*.md`, `s-eXXX-YYY-*.md` | Products, Projects, Business intent, Technical design, Canon sync execution |
| **SA** (Solution Architect) | Solution Designs, Technical Architecture | `sd-PRX-*.md`, `ta-PRX-*.md`, `sdi-PRX-*.md`, `tai-PRX-*.md` | Business requirements, Features, Stories |
| **DEV** (Developer) | Implementation, Dev plans | `dp-eXXX-sYYY-*.md` | Feature definitions, Scope changes |
| **QA** (QA Engineer) | Project test cases, Product regression tests, Bug reports | `tc-fi-PRX-*.md`, `rt-f-PRX-*.md`, `bug-*.md` | Feature definitions, Canon updates (except regression tests) |
| **SM** (Scrum Master) | Sprint operations, Deployment gate process | `sprint-N/*` | Prioritization, Acceptance, Scope changes |
| **DES** (Designer) | UX/UI design artifacts | Design documents | Technical implementation, Scope decisions |

---

## Role Details

### PO (Product Owner)

**Full Name:** Product Owner

**Owns:**
- Products (product.yml, structure)
- Product Canon (approval authority)
- Projects (project.yml, scope)
- PRX assignment
- Deployment approval authority
- Canon sync execution

**Creates:**
- `products/{id}/product.yml`
- `projects/{id}/project.yml`
- `products/{id}/decisions/dec-PRX-*.md`

**Reviews:**
- Feature-Increments (for sync)
- Project scope

**Refuses:**
- Stories
- Technical design
- Sprint management

**Commands:**
- `ts:po product`
- `ts:po project`
- `ts:po sync`
- `ts:po status`

---

### BA (Business Analyst)

**Full Name:** Business Analyst

**Owns:**
- Business Analysis artifacts
- Domain knowledge documentation
- Business process documentation

**Creates:**
- `products/{id}/business-analysis/ba-PRX-*.md`
- `projects/{id}/business-analysis-increments/bai-PRX-*.md`

**Reviews:**
- Feature-Increments (business intent)

**Refuses:**
- Projects (PO owns)
- Features (FA owns)
- Feature-Increments (FA owns)
- Epics (FA owns)
- Stories
- Technical design

**Commands:**
- `ts:ba analysis`
- `ts:ba ba-increment`
- `ts:ba review`

---

### FA (Functional Analyst)

**Full Name:** Functional Analyst

**Owns:**
- Features (f-PRX-*.md)
- Feature-Increments (fi-PRX-*.md)
- Epics (epic-PRX-*.md)
- Stories (s-eXXX-YYY-*.md)
- Sync proposals (prepared for PO)

**Creates:**
- `products/{id}/features/f-PRX-*.md`
- `projects/{id}/feature-increments/fi-PRX-*.md`
- `projects/{id}/epics/epic-PRX-*.md`
- `projects/{id}/stories/**/s-eXXX-YYY-*.md`

**Reviews:**
- BA artifacts (for feature translation)
- Stories (for Done status)

**Refuses:**
- Products (PO owns)
- Projects (PO owns)
- Business intent changes (BA owns)
- Technical design (SA owns)
- Canon sync execution (PO owns)

**Commands:**
- `ts:fa feature`
- `ts:fa feature-increment`
- `ts:fa epic`
- `ts:fa story`
- `ts:fa sync-proposal`

---

### SA (Solution Architect)

**Full Name:** Solution Architect

**Owns:**
- Solution Designs (sd-PRX-*.md)
- Technical Architecture (ta-PRX-*.md)

**Creates:**
- `products/{id}/solution-designs/sd-PRX-*.md`
- `products/{id}/technical-architecture/ta-PRX-*.md`
- `projects/{id}/solution-design-increments/sdi-PRX-*.md`
- `projects/{id}/technical-architecture-increments/tai-PRX-*.md`

**Reviews:**
- Feature-Increments (technical feasibility)

**Refuses:**
- Business requirements
- Features (FA owns)
- Stories

**Commands:**
- `ts:sa ta`
- `ts:sa ta-increment`
- `ts:sa sd`
- `ts:sa sd-increment`
- `ts:sa review`

---

### DEV (Developer)

**Full Name:** Developer

**Owns:**
- Implementation
- Dev plans (dp-eXXX-sYYY-*.md)

**Creates:**
- `projects/{id}/dev-plans/dp-eXXX-sYYY-*.md`

**Reviews:**
- Stories (for implementation clarity)
- Technical Architecture (when requested)

**Refuses:**
- Feature definitions
- Scope changes

**Commands:**
- `ts:dev plan`
- `ts:dev implement`

---

### QA (QA Engineer)

**Full Name:** QA Engineer

**Owns:**
- Project test cases (tc-fi-PRX-*.md)
- Product regression tests (rt-f-PRX-*.md)
- Bug reports
- Deployment verification

**Creates:**
- `projects/{id}/qa/test-cases/tc-fi-PRX-NNN-*.md`
- `projects/{id}/qa/bug-reports/bug-{project-id}-NNN-*.md`
- `products/{id}/qa/regression-tests/rt-f-PRX-NNN-*.md`

**Reviews:**
- Stories (for testability)
- Feature-Increments (for test coverage)

**Verifies:**
- DoD compliance
- Deployment readiness (smoke tests)

**Refuses:**
- Feature definitions
- Canon updates (except regression tests)

**Commands:**
- `ts:qa test`
- `ts:qa verify`
- `ts:qa regression`

**Promotion Rule:**
At deployment gate, QA must confirm regression coverage is updated. For each fi-PRX-NNN delivered, either update/create rt-f-PRX-NNN-* regression docs, or record "no regression impact" explicitly.

---

### SM (Scrum Master)

**Full Name:** Scrum Master

**Owns:**
- Sprint operations
- Deployment gate process (checklist, verification)
- Process facilitation

**Creates:**
- `projects/{id}/sprints/sprint-N/*`

**Reviews:**
- DoR compliance
- Deployment readiness

**Refuses:**
- Prioritization (PO decides)
- Acceptance (FA decides)
- Scope changes

**Commands:**
- `ts:sm sprint`
- `ts:sm deploy-checklist`

---

### DES (Designer)

**Full Name:** Designer

**Owns:**
- UX/UI design artifacts

**Creates:**
- Design documents

**Reviews:**
- Features (for UX implications)

**Refuses:**
- Technical implementation
- Scope decisions

**Commands:**
- (No CLI commands currently)
