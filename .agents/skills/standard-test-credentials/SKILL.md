---
name: standard-test-credentials
description: Use the standard SnappyYak test accounts for login or signup verification. Use whenever testing auth flows and avoid creating ad-hoc users.
---

# Standard Test Credentials

## Overview

Use only these credentials when testing login or signup flows.

## Employer Account

- **Fullname**: `Allwell Employer`
- **Email**: `dev@example.com`
- **Password**: `password123`
- **Email (Alt)**: `employer@company.com`
- **Password (Alt)**: `password123`

## Employee Accounts

**Employee 1:**
- **Fullname**: `John Doe`
- **Email**: `john.doe@company.com`
- **Password**: `password123`

**Employee 2:**
- **Fullname**: `Barry Scot`
- **Email**: `barry.scot@company.com`
- **Password**: `password123`

## Notes

- Do not create random test users or make up credentials.
- If login fails, credentials may need re-seeding or a DB reset.
- Delete any non-standard test users created during verification.
