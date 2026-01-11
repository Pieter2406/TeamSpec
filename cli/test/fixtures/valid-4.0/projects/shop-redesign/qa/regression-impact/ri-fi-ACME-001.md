# Regression Impact: ri-fi-ACME-001

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** QA (QA Engineer)
**Artifact Type:** Regression Impact Record (Post-Deployment)
**Lifecycle:** Created at deployment verification gate, referenced during Canon sync

---

## Required Fields (TS-QA-003)

| Field | Value |
| :--- | :--- |
| **fi_id** | fi-ACME-001 |
| **assessment** | update-required |
| **rationale** | OAuth login introduces new authentication flow that must be covered by regression tests |
| **regression_tests** | rt-f-ACME-001-user-login-regression.md (updated with OAuth scenarios) |

---

## Metadata

| Field | Value |
| :--- | :--- |
| **RI ID** | ri-fi-ACME-001 |
| **Product** | acme-shop (ACME) |
| **Project** | shop-redesign |
| **Created** | 2026-01-11 |
| **Author** | QA Team |
| **Feature Increment** | [fi-ACME-001](../../feature-increments/fi-ACME-001-oauth-login.md) |
| **Deployment Date** | 2026-01-11 |
| **Verification Status** | ✅ Passed |

---

## 1. Assessment Decision

### Assessment: `update-required`

The OAuth login feature introduces a new authentication pathway that users can take. This adds new user-facing behavior that must be validated in regression testing.

---

## 2. Rationale

The fi-ACME-001 OAuth Login increment:

1. **Adds new UI elements** - "Sign in with Google" button on login page
2. **Adds new authentication flow** - Google OAuth consent and callback
3. **Integrates with external service** - Google OAuth API
4. **Affects existing feature** - f-ACME-001-user-login now has additional login method

These changes require regression test coverage to ensure:
- Traditional login flow remains functional
- OAuth flow works correctly
- Both flows can coexist without conflict

---

## 3. Regression Test Updates

### Files Created/Updated

| File | Action | Description |
|------|--------|-------------|
| [rt-f-ACME-001-user-login-regression.md](../../../products/acme-shop/qa/regression-tests/rt-f-ACME-001-user-login-regression.md) | Updated | Added OAuth regression scenarios |

### New Regression Scenarios Added

1. **RT-004: OAuth Button Visibility** - Verify OAuth button displays correctly
2. **RT-005: OAuth Flow Completion** - Verify OAuth authentication succeeds
3. **RT-006: OAuth Error Handling** - Verify graceful error handling

---

## 4. Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA | QA Team | 2026-01-11 | ✅ Approved |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | QA Team | Initial regression impact assessment |
