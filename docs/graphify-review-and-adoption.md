# Graphify Review And Adoption Decision

**Reviewed:** 2026-07-17  
**Scope:** Graphify documentation linked from `https://graphify.net/leiden-community-detection.html` and the repository's current Graphify installation/output

## Decision

Keep Graphify installed and use it as a **local engineering-navigation and architecture-audit tool**. Do not make it a runtime dependency of the learning app, do not send student data to it, and do not use its inferred edges as authoritative curriculum, safety, privacy, or production-architecture truth.

Graphify is valuable for understanding how this large prototype is connected. It does not replace:

- Supabase/Postgres as the production data layer
- the application RBAC and session enforcement
- the lesson grading and publication gate
- Truth And Fact-Check review
- the AI tutor safety layer
- automated tests and browser verification

## Documentation Reviewed

1. **Knowledge graphs for AI coding assistants**
   - Models code, documentation, diagrams, and rationale as nodes connected by typed edges.
   - The useful idea for this project is structural retrieval: calls, imports, implementation rationale, and source provenance stay visible together.
   - The claimed token reduction is a vendor-reported example, not a guarantee for this repository.

2. **Tree-sitter AST extraction**
   - The deterministic pass extracts structural nodes and call/import edges locally.
   - Extracted facts are distinguishable from later inferred relationships.
   - This is appropriate for auditing our JavaScript server, client, engine, repository, schemas, and scripts.
   - SQL and non-code files need a separately verified parser or ingestion path.

3. **Leiden community detection**
   - Communities are formed from graph topology and edge density rather than a vector database.
   - This is useful for discovering subsystem boundaries and high-degree integration points.
   - A community is an orientation aid, not proof that modules should be split or that a feature is complete.

4. **Graphify and Claude Code integration**
   - Claude can use a pre-tool hook; Codex receives project guidance through `AGENTS.md`.
   - The Codex installer has already been run in this repository.
   - The graph must be refreshed after meaningful code changes or it becomes stale context.

5. **CLI command reference**
   - Build/update the graph, query/path/explain nodes, export graph formats, add external sources, install hooks, and watch changes.
   - For this repository, the highest-value commands are AST extraction, update, query, path, explain, tree, and optional clustered reporting.
   - External URL ingestion must remain staff-controlled and separate from student-facing web research.

6. **Graphify versus alternatives**
   - Graphify is complementary to code search and graph databases, not a universal replacement.
   - Sourcegraph-style search remains useful for broad cross-repository search.
   - Neo4j is useful only if we later need a shared operational graph service; the current local graph is sufficient.
   - Embeddings may still be useful for semantic curriculum/source retrieval, but Graphify's structural graph should remain the source for code navigation.

7. **Leiden page itself**
   - Confirms the core architectural distinction: structural and inferred relationships share one graph but retain provenance.
   - We should preserve that distinction in any agent-generated architecture recommendations.

## Current Repository Evidence

Graphify has been installed for Codex with `graphify codex install`. The repository currently has:

- `graphify-out/graph.json`
- `graphify-out/GRAPH_TREE.html`
- 49 code files indexed
- 2,144 graph nodes
- 4,681 graph edges
- a successful architecture query tracing quiz completion through `src/app.js`, `scripts/serve.mjs`, `src/engine.js`, and `src/repository.js`

The current extraction was code-only and intentionally skipped documentation and images. It also reported that SQL relationships were not included by the Graphify runtime's SQL extractor. Therefore the current graph is useful for JavaScript architecture, but it is not yet a complete source-of-truth graph for the database schema or curriculum documentation.

## Adoption Rules

### Allowed uses

- Find integration points before changing a shared learning or repository function.
- Trace student workflow paths such as lesson -> tutor -> quiz -> mastery -> reward.
- Identify high-degree modules that require extra regression testing.
- Compare documented architecture with actual imports, calls, and route ownership.
- Generate a local visual map for manager and agent review.
- Use inferred edges only as hypotheses that must be checked against source files and tests.

### Prohibited uses

- Indexing student answers, tutor conversations, private account information, secrets, or production database contents.
- Treating a community label as an authorization boundary.
- Letting Graphify publish or modify student-facing lessons automatically.
- Treating inferred or ambiguous edges as factual curriculum or compliance claims.
- Adding Graphify to the browser bundle or production server runtime.
- Sending private source files to external semantic services without an explicit staff-approved policy.

## Recommended Operating Procedure

1. Run a local AST-only extraction after substantial code changes.
2. Run clustered analysis only when subsystem discovery or architecture review requires it.
3. Use `query`, `path`, and `explain` for a narrow engineering question.
4. Confirm every important result in the actual source, tests, route permissions, or database schema.
5. Keep `graphify-out` out of student-facing content and treat generated reports as engineering artifacts.
6. Refresh the graph before a major migration review so stale edges do not guide implementation.

## Recommended Next Improvements

### Priority 1: Add reproducible project commands

Add package scripts for the approved local workflow:

- `graph:extract` for code-only extraction
- `graph:tree` for the interactive hierarchy
- `graph:query` for a documented architecture question

These commands should never include `.env`, `data/app-state.json`, temporary generated images, or production database contents.

The project uses the Python Graphify module entry point for extraction (`python -m graphify`) because the standalone Windows binary did not load the optional SQL grammar. The local installation includes `graphifyy[sql]`, so migration and schema files can be parsed without connecting to production. A live `--postgres` extraction remains optional and must never receive a student-data or production DSN during ordinary code review.

The approved release-review command is now:

```powershell
npm run graph:validate
```

It refreshes the code-only graph and runs `scripts/validate-graphify.mjs`. The validator checks graph shape, edge endpoints, indexed source paths, missing source files, trusted AST-edge integrity, graph freshness, and explicit source claims for the bootstrap, learning catalog, quiz, permission, and Graphify governance paths. It writes `graphify-out/graphify-validation.json` and fails in strict mode when a check is not satisfied. This is an engineering evidence report, not a substitute for `npm test`, database verification, or security review.

### Priority 2: Improve schema coverage

Use the local SQL parser and compare its table/foreign-key output with `src/schema.js` and `db/migrations/0001_k12_learning_foundation.sql`. Do not treat a Graphify SQL graph as a substitute for migration validation. The strict validator now includes explicit evidence claims for the normalized `lessons` schema and the Postgres migration.

### Priority 3: Generate a clustered report for architecture review

Run clustering only on approved code and documentation inputs. Review the largest communities, high-degree nodes, and cross-community edges, then convert confirmed findings into architecture documentation or tests.

### Priority 4: Add freshness checks to engineering workflow

Refresh or verify graph freshness during release review. A stale graph should be labeled stale rather than silently used as current context.

The validator treats `EXTRACTED` AST edges as trusted only when their endpoints and source files exist. `INFERRED` edges are counted and retained for navigation, but are explicitly labeled hypotheses and never qualify as proof of a route, permission, curriculum relationship, or production capability.

### Priority 5: Keep external research separate

Graphify's `add` command can ingest public sources, but curriculum web research must continue through the app's approved Tool Gateway, source ledger, truth review, and manager approval flow. Those systems serve different trust and audit purposes.

## Final Assessment

Graphify is a good fit for this project because the repository has many cross-cutting systems: role-specific app views, V2/V3 lesson adapters, learning evidence, Supabase repositories, visual generation, tutor events, content gates, and school workflows. Its strongest contribution is making those relationships navigable before edits.

The correct implementation is **governed adoption**, not automatic adoption: use Graphify to discover and explain code structure, then use the repository's tests, schema, permissions, review gates, and runtime checks to decide what is true.
