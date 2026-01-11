# Epic: epic-ACME-001-auth

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-ACME-001 |
| **Status** | In Progress |
| **Product** | acme-shop (ACME) |
| **Owner** | FA (Functional Analyst) |
| **Created** | 2026-01-11 |

**Document Owner:** FA (Functional Analyst)
**Artifact Type:** Execution (Groups Feature-Increments)
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

**As a** End User,  
**I want** to authenticate using modern OAuth providers,  
**So that** I can log in securely without managing another password.

---

## Linked Product

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [acme-shop](../../products/acme-shop/product.yml) | ACME | ACME Shop |

---

## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-ACME-001](../feature-increments/fi-ACME-001-oauth-login.md) | OAuth Login Integration | Draft |

---

## TO-BE / Business Value

### Value Proposition

- **User Impact**: Users can log in with existing Google accounts, reducing friction
- **Business Impact**: Higher conversion rates, reduced password reset support tickets
- **Success Metrics**: 30% of users using OAuth within 3 months

### Target State

Users will have the option to authenticate via Google OAuth in addition to the existing email/password flow.

---

## Scope

### In Scope

- [x] Google OAuth integration
- [ ] OAuth button on login page
- [ ] Account linking for existing users

### Out of Scope

- Apple Sign-In (future epic)
- Facebook OAuth (not planned)

---

## Stories

| Story ID | Description | Status |
|----------|-------------|--------|
| [s-e001-001](../stories/backlog/s-e001-001-oauth-button.md) | OAuth Button | Backlog |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | FA Team | Initial epic created |
