# Thinking Systems Deep-Dive Index — V6

This folder contains the production-control documentation for the ten MVP systems that handle thinking, mistakes, application, evidence, and adaptation.

## Systems
1. Mistake Journal
2. Reteach and Intervention Engine
3. Challenge and Enrichment Engine
4. Problem-Solving Lab
5. Evidence Room
6. Interpretation Lens
7. Discussion Arena
8. Learning Planner
9. Systems Mapper
10. Portfolio / Project Evidence System

## V6 Design Decision
Each system must have:
- a dedicated deep-dive spec;
- a dedicated TypeScript data contract;
- a dedicated UI panel component;
- a clear activation rule;
- an accessibility and child-safety boundary;
- acceptance criteria;
- a future persistence plan.

## Shared System Loop
Evidence → Pattern → Recommendation → Student action → Reflection → Parent/teacher visibility.

## Current MVP Status
These systems are implemented as local-state scaffolds. They are now componentized and documented, but they still need persistence, richer scoring, and real teacher/parent workflows before production release.
