---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
title: Dashboard artifact filtering and smart state ordering
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: epic-TSV-007
filename_pattern: epic-TSV-007-dashboard-filtering-ordering.md
links_required:
  - type: product
    pattern: product.yml
    optional: false
  - type: feature-increment
    pattern: fi-TSV-007
    optional: false
    note: Dashboard filtering and ordering feature-increment
keywords:
  - epic
  - dashboard
  - filtering
  - state ordering
  - artifact organization
  - visibility
  - usability
aliases:
  - artifact filtering
  - smart ordering
  - dashboard enhancement
anti_keywords:
  - implementation detail
  - code
  - technical design
completion_rules:
  placeholders: 'Fill {braces} only; leave {TBD} if unknown'
  id_generation: Use product PRX (TSV); NNN is sequential (007)
  story_naming: 'Stories use s-e007-YYY pattern (e.g., s-e007-001)'
  required_sections:
    - Epic Summary
    - Linked Product
    - Feature-Increments
    - TO-BE / Business Value
    - Success Metrics
status: Done
---

# Epic: `epic-TSV-007-dashboard-filtering-ordering`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-TSV-007 |
| **Status** | Done|
| **Product** | teamspec-viewer (TSV) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-17 |
| **Estimated Stories** | 4-5 |
| **Feature** | f-TSV-002 (Role-Specific Dashboards) |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound; planned for Sprint N (TBD)

---

## Epic Summary

**As a** TeamSpec user (Product Manager, Developer, QA Engineer),  
**I want** to focus my dashboard view on active/in-progress work items and optionally see completed artifacts,  
**So that** I can quickly identify what needs attention without visual clutter from completed work, and the dashboard helps me prioritize tasks by automatically ordering items by state (active first, completed last).

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [teamspec-viewer](../../products/teamspec-viewer/product.yml) | TSV | Teamspec Viewer |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-TSV-007-dashboard-filtering-ordering](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering | Proposed |

---

## TO-BE / Business Value

### Value Proposition

Completing this epic delivers two critical usability improvements to the Role-Specific Dashboards:

1. **Reduced Cognitive Load**: By filtering and ordering artifacts intelligently, users can focus on active work without scanning past completed items. The feature achieves the core goal of f-TSV-002 ("reduce cognitive load") more effectively.

2. **Faster Task Discovery**: Active/in-progress items are always at the top of the dashboard, making it quick to find what needs attention. Terminal states (done, retired, deferred) are grouped at the bottom and can be hidden.

3. **Consistent Mental Model**: The state ordering (active → ready → draft → proposed → pending → done → retired) matches how users naturally think about work prioritization, reducing friction in navigation.

### Target User Experience

**Before this epic:**
```
Dashboard shows 20+ artifacts (mix of active, draft, done, retired)
User must scan entire list to find items to work on
User sees visual clutter from completed items
User's mental model: "I need to find which items are active"
```

**After this epic:**
```
Dashboard shows only active/in-progress items by default:
  1. in-progress (1 item)
  2. active (2 items)
  3. ready (1 item)
  4. draft (1 item)

[✓] Show Completed Artifacts (optional toggle)

User can optionally expand to see completed work
User's mental model: "Active items are here, completed items are hidden but available"
User scans dashboard in <5 seconds vs. <20 seconds
```

### Measurable Business Value

- **Time Savings**: Reduce time to identify active work items from 20+ seconds to <5 seconds per dashboard view
- **Reduced Errors**: Users less likely to accidentally work on completed items or miss active items they should be focusing on
- **Improved Dashboard Adoption**: Cleaner, more intuitive interface encourages regular dashboard use for task discovery
- **Foundation for Advanced Features**: Clean state ordering enables future enhancements (filtering by author, date, status transitions, etc.)

---

## Scope & Deliverables

### In Scope

- [x] Implement artifact visibility filter toggle ("Show Completed Artifacts")
- [x] Implement smart state ordering (12-level state hierarchy)
- [x] Save filter state to browser localStorage (persists across sessions)
- [x] Apply to all artifact types (Features, Epics, Stories, Business Analysis docs, etc.)
- [x] Mobile-responsive filter control and ordering
- [x] Accessibility compliance (keyboard navigation, screen reader support)
- [x] Visual clarity with section headers or state labels
- [x] Performance verified (no regression with current artifact volume)

### Out of Scope

- [ ] Advanced filtering (by author, date, team, tags)
- [ ] Custom sort orders or saved preferences
- [ ] Search/filtering within artifact list
- [ ] Editing artifact state from dashboard (remains read-only)
- [ ] Archiving/deleting artifacts
- [ ] Real-time synchronization across multiple user sessions
- [ ] Mobile app version (web browser only for MVP)

---

## Success Metrics & Acceptance

### Definition of Done (DoD)

- [ ] All stories in epic are in terminal state (Done, Deferred, Out-of-Scope)
- [ ] Feature-Increment TO-BE section reflects final implementation
- [ ] QA sign-off: Testing requirements met
- [ ] Code review complete and merged to main branch
- [ ] Feature deployed to production
- [ ] User feedback positive (if applicable from internal testers)

### Success Metrics

| Metric | Target | Validation |
|--------|--------|-----------|
| **Time to Find Active Items** | < 5 seconds | Usability testing with 3+ team members |
| **Filter Persistence** | 100% | Cross-session testing (page reload) |
| **State Ordering Accuracy** | 100% | All artifacts ordered per hierarchy |
| **Mobile Responsiveness** | Passes WCAG 2.1 AA | Accessibility audit |
| **Performance** | <100ms filter/sort operation | Benchmark with 100+ artifacts |

---

## State Ordering Specification

This epic delivers the following state ordering hierarchy:

```
ACTIVE WORK (Always Visible, Top Priority)
├─ 1. in-progress    → User/team currently working on
├─ 2. active         → Deployed to production
├─ 3. ready          → Approved for implementation
├─ 4. draft          → In development, review pending
└─ 5. proposed       → Proposed but awaiting approval

WAITING (Visible, Medium Priority)
├─ 6. pending        → Awaiting external dependency
└─ 7. on-hold        → Explicitly paused

COMPLETED (Optional, Low Priority - Hidden by Default)
├─ 8.  deferred      → Moved to later phase/release
├─ 9.  out-of-scope  → Explicitly excluded
├─ 10. done          → Completed and closed
├─ 11. retired       → No longer in use
└─ 12. archived      → Historical reference
```

**Ordering Logic:**
- Primary: Group by state, ordered by priority (1-12)
- Secondary: Within same state, sort alphabetically by title
- Filter: When "Show Completed Artifacts" is OFF, hide states 8-12

---

## Planned Stories (Linked via Epic ID)

This epic will be decomposed into the following stories:

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| s-e007-001 | Implement artifact visibility filter toggle | {TBD} | P0 |
| s-e007-002 | Implement smart state ordering logic | {TBD} | P0 |
| s-e007-003 | Add localStorage persistence for filter state | {TBD} | P1 |
| s-e007-004 | Testing and accessibility verification | {TBD} | P1 |
| s-e007-005 | Documentation and release notes | {TBD} | P2 |

---

## Dependencies & Risks

### External Dependencies

- **Frontend State Management**: Requires working React component state or context (already present)
- **Backend Artifact APIs**: Requires artifact data includes `status` field (already present)
- **Browser localStorage**: Standard feature, no external dependency

### Assumptions

- [ ] All artifacts have consistent `status:` field in YAML frontmatter
- [ ] Browser localStorage available (no special restrictions)
- [ ] Current artifact data includes state information
- [ ] No breaking changes to artifact schema during development

### Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Inconsistent state values** across artifact types | Medium | Audit all artifacts for consistent state values; document standard states |
| **Users confused by filter toggle** | Medium | Clear label + tooltip; help text explaining terminal states |
| **Performance degradation** with 100+ artifacts | Low | Client-side filtering/sorting; can optimize if needed |
| **Missing states** in future artifact types | Medium | Build state ordering as configuration, not hardcoded; easy to extend |
| **Accessibility issues** with filter control | Medium | Test with keyboard navigation and screen readers; WCAG 2.1 AA compliance |

---

## Technical Considerations for DEV

### Components to Update

1. **FADashboard.tsx** / **BADashboard.tsx**
   - Add filter toggle control
   - Integrate filter state (useState + localStorage)
   - Apply ordering logic to artifact lists

2. **Artifact List / Tree Components**
   - Add state-based filtering
   - Add state-based sorting
   - Visual grouping by state (headers or sections)

3. **Shared Utilities** (new)
   - Create `stateOrdering.ts` with STATE_PRIORITY constant
   - Create `filterAndSort()` utility function
   - Make state ordering easily extensible

### Code Structure Recommendation

```typescript
// constants/stateOrdering.ts
export const STATE_PRIORITY = {
  'in-progress': 1,
  'active': 2,
  'ready': 3,
  'draft': 4,
  'proposed': 5,
  'pending': 6,
  'on-hold': 7,
  'deferred': 8,
  'out-of-scope': 9,
  'done': 10,
  'retired': 11,
  'archived': 12,
};

export const TERMINAL_STATES = ['deferred', 'out-of-scope', 'done', 'retired', 'archived'];

// hooks/useArtifactFilter.ts
export const useArtifactFilter = (artifacts, defaultShowCompleted = true) => {
  const [showCompleted, setShowCompleted] = useState(
    localStorage.getItem('showCompleted') !== 'false'
  );

  const filtered = filterAndSortArtifacts(artifacts, showCompleted);

  return { filtered, showCompleted, setShowCompleted };
};
```

### Testing Strategy

- **Unit Tests**: Test state ordering and filtering logic
- **Component Tests**: Test filter toggle interaction and localStorage
- **Integration Tests**: Test with dashboard and real artifact data
- **E2E Tests**: Test full user workflow (toggle → filter → persist → reload)
- **Accessibility Tests**: WCAG 2.1 AA compliance

---

## Related Epics & Features

### Related Features

- **f-TSV-001**: Basic Reading — Viewer functionality, unaffected
- **f-TSV-002**: Role-Specific Dashboards — **Parent feature** being enhanced by this epic
- **f-TSV-003**: Artifact Search — May benefit from ordering in future feature combinations
- **f-TSV-006**: Inline Status Editing — May interact with state changes; verify reactivity

### Related Epics

- **epic-TSV-006**: Inline Status Editing — May need to coordinate on state change reactivity

---

## Epic Governance

### Gate Checklist

**Before Stories Start:**
- [ ] Feature-Increment fi-TSV-007 approved
- [ ] Business value and success metrics confirmed
- [ ] Design approach confirmed (state ordering hierarchy)

**Before Sprint Planning:**
- [ ] Stories created and estimated
- [ ] Dependencies identified
- [ ] Risks assessed and mitigations planned

**Before Release:**
- [ ] All stories in terminal state (Done/Deferred/Out-of-Scope)
- [ ] Feature-Increment TO-BE section finalized
- [ ] QA sign-off obtained
- [ ] Code reviewed and merged
- [ ] User documentation updated

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Proposed | Initial epic proposal; ready for story decomposition; linked to fi-TSV-007 |
