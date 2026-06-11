# 84 — Persistence Privacy and Data Retention

## Purpose

Persistence improves continuity, but it also creates privacy obligations. This document sets boundaries for the MVP and later production build.

## MVP Boundary

V7 localStorage persistence is for prototype/demo use only. It must not be treated as production storage for real children.

## Do Not Persist in MVP

- Public chat messages
- Random direct messages
- Sensitive health, location, identity, or family data
- Behavioral advertising data
- Anything not needed for learning progress

## Safe MVP Records

The app may persist:

- Lesson IDs
- Section completion
- Quiz attempts
- Memory Vault review items
- Mistake categories
- Planner prompts
- Portfolio prompts

## Production Requirements

Before real users:

1. Add authentication.
2. Add role-based access control.
3. Move persistence to a database.
4. Implement parent/guardian data scopes.
5. Add data export.
6. Add deletion request handling.
7. Add data retention policy.
8. Avoid exposing other students' data in dashboards.

## Principle

Persist only what improves learning, safety, or required progress reporting.
