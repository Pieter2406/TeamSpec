# Bug: [Title]

<!-- 
  ⚠️ BUG CLASSIFICATION IS MANDATORY
  
  When reporting bugs, you MUST classify whether the issue is:
  - Implementation defect (code doesn't match Canon)
  - Feature Canon wrong (Canon doesn't match business intent)
  - Undocumented behavior (neither covers this case)
  
  Classification determines who fixes what.
  
  TEAMSPEC RULES ENFORCED:
  - TS-QA-002: Bug classification required (exactly one)
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Defect Report  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | BUG-XXX |
| **Severity** | Critical / High / Medium / Low |
| **Priority** | P1 / P2 / P3 / P4 |
| **Environment** | Staging / Dev / Production |
| **Version** | [Build Number] |
| **Reporter** | [Name] |
| **Date Reported** | YYYY-MM-DD |
| **Status** | Open / In Progress / Resolved / Closed |

---

## Description

> Brief summary of the bug.

[Clear, concise description of what's wrong]

---

## Steps to Reproduce

1. Go to ...
2. Click ...
3. Enter ...
4. Observe ...

---

## Expected Result

> What should happen (reference Feature Canon if applicable).

**Feature Canon Reference:** [F-XXX](../../features/F-XXX-name.md), Section: [Section Name]

[What the system should do according to Feature Canon]

---

## Actual Result

> What actually happened.

[What the system actually does]

---

## Evidence

> Attach Screenshots/Logs/Videos

- [ ] Screenshot attached
- [ ] Console logs attached
- [ ] Network trace attached

---

## Bug Classification (MANDATORY)

<!-- TEAMSPEC RULE: TS-QA-002 - Exactly one must be checked -->

> ⚠️ Select **exactly ONE** classification. This determines who fixes what.

### [ ] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

- **Evidence:** Feature Canon says [X], system does [Y]
- **Fix:** DEV fixes code to match Canon
- **Canon Update:** Not required

### [ ] Feature Canon Wrong

**Definition:** Feature Canon doesn't match actual business intent.

- **Evidence:** Business expects [X], Canon says [Y]
- **Fix:** FA updates Feature Canon, then DEV updates code if needed
- **Canon Update:** Required

### [ ] Undocumented Behavior

**Definition:** Neither code nor Feature Canon covers this case.

- **Evidence:** [Scenario] is not documented anywhere
- **Fix:** FA clarifies with BA, updates Canon, then DEV implements
- **Canon Update:** Required

---

## Classification Decision Tree

```
Is the behavior documented in Feature Canon?
├── YES → Does code match Canon?
│   ├── YES → Not a bug (or Canon is wrong → "Feature Canon Wrong")
│   └── NO → "Implementation Defect"
└── NO → "Undocumented Behavior"
```

---

## Resolution Actions by Classification

| Classification | Who Fixes | Action |
|----------------|-----------|--------|
| Implementation Defect | DEV | Fix code to match Canon |
| Feature Canon Wrong | FA → DEV | FA updates Canon; DEV updates code if needed |
| Undocumented Behavior | FA + BA → DEV | FA clarifies with BA; updates Canon; DEV implements |

---

## Feature Reference

| Feature | Section | Expected Behavior |
|---------|---------|-------------------|
| [F-XXX](../../features/F-XXX-name.md) | [Section] | [Brief description from Canon] |

---

## Related Stories / Bugs

| ID | Type | Relationship |
|----|------|--------------|
| [S-XXX] | Story | Introduced behavior |
| [BUG-YYY] | Bug | Related issue |

---

## Resolution

**Resolved By:** ________________  
**Resolution Date:** YYYY-MM-DD  
**Resolution Type:** Code Fix / Canon Update / Not a Bug / Duplicate  
**Fix Version:** [Build Number]

**Resolution Notes:**

[How the bug was fixed]

---

## Verification

**Verified By:** ________________  
**Verification Date:** YYYY-MM-DD  
**Verification Environment:** [Environment]

- [ ] Bug no longer reproduces
- [ ] Feature Canon is accurate
- [ ] Regression tests added

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-QA-002 | Bug classification required (exactly one) |
