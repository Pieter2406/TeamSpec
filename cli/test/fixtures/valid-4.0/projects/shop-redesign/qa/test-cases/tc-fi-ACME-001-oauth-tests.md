# Test Cases: tc-fi-ACME-001-oauth-tests

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** QA (QA Engineer)
**Artifact Type:** Project Test Cases (Project-scoped)
**Lifecycle:** Project-scoped, merged to Product regression tests after deployment

---

## Test Case Reference

**Feature Increment:** [fi-ACME-001 — OAuth Login](../feature-increments/fi-ACME-001-oauth-login.md)
**Feature:** [f-ACME-001 — User Login](../../products/acme-shop/features/f-ACME-001-user-login.md)
**Test Level:** Feature Increment (project-scoped)

| Metadata | Value |
| :--- | :--- |
| **TC ID** | tc-fi-ACME-001 |
| **Feature Increment** | [fi-ACME-001](../feature-increments/fi-ACME-001-oauth-login.md) |
| **Feature** | [f-ACME-001](../../products/acme-shop/features/f-ACME-001-user-login.md) |
| **Author** | QA Team |
| **Created** | 2026-01-11 |
| **Last Updated** | 2026-01-11 |

---

## Test Scenarios

### TC-001: Google OAuth Button Display

- **Type**: Positive
- **Feature Reference**: fi-ACME-001: TO-BE Behavior
- **Acceptance Criteria**: AC-1 from FI
- **Pre-conditions**: User is on login page
- **Steps**:
  1. Navigate to login page
  2. Observe page layout
- **Expected Result**: "Sign in with Google" button is visible
- **Test Data**: N/A

---

### TC-002: Google OAuth Flow Initiation

- **Type**: Positive
- **Feature Reference**: fi-ACME-001: TO-BE Behavior
- **Acceptance Criteria**: AC-4 from FI
- **Pre-conditions**: User is on login page
- **Steps**:
  1. Click "Sign in with Google" button
  2. Observe redirect
- **Expected Result**: User is redirected to Google OAuth consent screen
- **Test Data**: Valid Google account

---

### TC-003: Successful OAuth Authentication

- **Type**: Positive
- **Feature Reference**: fi-ACME-001: TO-BE Behavior
- **Acceptance Criteria**: AC-1, AC-4
- **Pre-conditions**: User has valid Google account
- **Steps**:
  1. Click "Sign in with Google"
  2. Complete Google OAuth consent
  3. Return to application
- **Expected Result**: User is authenticated and redirected to dashboard
- **Test Data**: Valid Google account credentials

---

### TC-004: OAuth Cancellation

- **Type**: Negative
- **Feature Reference**: fi-ACME-001: TO-BE Behavior
- **Acceptance Criteria**: Error handling
- **Pre-conditions**: User is on Google OAuth consent screen
- **Steps**:
  1. Click "Sign in with Google"
  2. Cancel on Google OAuth screen
- **Expected Result**: User is returned to login page with appropriate message
- **Test Data**: N/A

---

## Test Summary

| TC ID | Title | Priority | Status |
|-------|-------|----------|--------|
| TC-001 | OAuth Button Display | High | Not Run |
| TC-002 | OAuth Flow Initiation | High | Not Run |
| TC-003 | Successful Authentication | Critical | Not Run |
| TC-004 | OAuth Cancellation | Medium | Not Run |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | QA Team | Initial test cases created |
