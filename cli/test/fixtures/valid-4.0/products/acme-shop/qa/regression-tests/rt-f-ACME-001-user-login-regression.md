# Regression Tests: rt-f-ACME-001-user-login-regression

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** QA (QA Engineer)
**Artifact Type:** Regression Tests (Product Canon)
**Lifecycle:** Permanent, updated after Feature Canon sync

---

## Regression Test Reference

| Metadata | Value |
| :--- | :--- |
| **RT ID** | rt-f-ACME-001 |
| **Product** | acme-shop (ACME) |
| **Feature** | [f-ACME-001-user-login](../../features/f-ACME-001-user-login.md) |
| **Author** | QA Team |
| **Created** | 2026-01-11 |
| **Last Updated** | 2026-01-11 |

---

## Regression Test Scenarios

### RT-001: Basic Login Flow

- **Type**: Positive
- **Feature Reference**: f-ACME-001, §Main Flow
- **Pre-conditions**: User account exists with valid credentials
- **Steps**:
  1. Navigate to login page
  2. Enter valid email
  3. Enter valid password
  4. Click "Login" button
- **Expected Result**: User is authenticated and redirected to dashboard
- **Priority**: Critical

---

### RT-002: Invalid Credentials

- **Type**: Negative
- **Feature Reference**: f-ACME-001, §Edge Cases
- **Pre-conditions**: User account exists
- **Steps**:
  1. Navigate to login page
  2. Enter valid email
  3. Enter invalid password
  4. Click "Login" button
- **Expected Result**: Error message displayed, user remains on login page
- **Priority**: High

---

### RT-003: Password Minimum Length

- **Type**: Boundary
- **Feature Reference**: f-ACME-001, §Business Rules
- **Pre-conditions**: None
- **Steps**:
  1. Attempt login with password less than 8 characters
- **Expected Result**: Validation error displayed
- **Priority**: Medium

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | QA Team | Initial regression test suite |
