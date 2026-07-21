import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const graphPath = resolve(process.argv[3] || join(root, "graphify-out", "graph.json"));
const outputPath = resolve(process.argv[4] || join(root, "graphify-out", "graphify-validation.json"));
const strict = process.argv.includes("--strict");

const result = {
  generatedAt: new Date().toISOString(),
  root,
  graphPath: relative(root, graphPath),
  mode: "code-only-structural-validation",
  trustedEdgePolicy: "Only EXTRACTED AST edges with existing endpoints and source files are trusted. INFERRED edges remain hypotheses.",
  checks: [],
  claims: [],
  counts: { nodes: 0, edges: 0, trustedEdges: 0, inferredEdges: 0 }
};

function check(id, passed, details = {}) {
  result.checks.push({ id, passed: Boolean(passed), ...details });
}

function sourceText(path) {
  const absolute = resolve(root, path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function pathIsInside(candidate, parent) {
  const rel = relative(parent, candidate);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

if (!existsSync(graphPath)) {
  check("graph-exists", false, { message: "Run npm run graph:extract first." });
} else {
  let graph = null;
  try {
    graph = JSON.parse(readFileSync(graphPath, "utf8"));
  } catch (error) {
    check("graph-json", false, { message: `Graph JSON could not be parsed: ${error.message}` });
  }

  if (graph) {
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    // Graphify versions use `edges` for extract output and `links` for update output.
    const edges = Array.isArray(graph.edges) ? graph.edges : Array.isArray(graph.links) ? graph.links : [];
    const nodeIds = new Set(nodes.map((node) => node.id).filter(Boolean));
    const trustedEdges = edges.filter((edge) => edge.confidence === "EXTRACTED" && edge._origin === "ast");
    const inferredEdges = edges.filter((edge) => edge.confidence === "INFERRED" || edge._origin === "semantic");
    const unresolvedEdges = edges.filter((edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target));
    const unresolvedImportEdges = unresolvedEdges.filter((edge) => ["imports", "imports_from"].includes(edge.relation));
    const unresolvedSchemaReferenceEdges = unresolvedEdges.filter(
      (edge) => edge.relation === "references" && String(edge.target || "").startsWith("ref_defs_")
    );
    result.counts = {
      nodes: nodes.length,
      edges: edges.length,
      trustedEdges: trustedEdges.length - unresolvedEdges.filter((edge) => edge.confidence === "EXTRACTED" && edge._origin === "ast").length,
      inferredEdges: inferredEdges.length,
      unresolvedEdges: unresolvedEdges.length,
      unresolvedImportEdges: unresolvedImportEdges.length,
      unresolvedSchemaReferenceEdges: unresolvedSchemaReferenceEdges.length
    };

    check("graph-shape", nodes.length > 0 && edges.length > 0, {
      message: "Graph must contain nodes and edges.",
      nodeCount: nodes.length,
      edgeCount: edges.length
    });

    const invalidEdges = unresolvedEdges.filter(
      (edge) => !["imports", "imports_from"].includes(edge.relation) && !unresolvedSchemaReferenceEdges.includes(edge)
    );
    check("edge-endpoints", invalidEdges.length === 0, {
      invalidCount: invalidEdges.length,
      unresolvedImportCount: unresolvedImportEdges.length,
      unresolvedSchemaReferenceCount: unresolvedSchemaReferenceEdges.length,
      message: invalidEdges.length
        ? "Every non-import, non-schema-reference graph edge must point to an indexed node."
        : unresolvedImportEdges.length || unresolvedSchemaReferenceEdges.length
          ? "Unresolved import and JSON-schema references are reported but excluded from trusted graph evidence."
          : "All graph edge endpoints exist."
    });

    const unsafeFiles = nodes
      .map((node) => String(node.source_file || ""))
      .filter(Boolean)
      .filter((file) => {
        const absolute = resolve(root, file);
        return !pathIsInside(absolute, root) || /(^|[\\/])(?:\.env|data[\\/]app-state|tmp|secrets?)(?:[\\/]|$)/i.test(file);
      });
    check("source-path-safety", unsafeFiles.length === 0, {
      unsafeFiles: [...new Set(unsafeFiles)],
      message: "Graphify must not index environment files, private app state, temporary files, or secrets."
    });

    const missingSourceFiles = [...new Set(nodes.map((node) => String(node.source_file || "")).filter(Boolean))]
      .filter((file) => !existsSync(resolve(root, file)));
    check("source-files-exist", missingSourceFiles.length === 0, {
      missingSourceFiles,
      message: "Indexed source files must still exist."
    });

    const invalidTrustedEdges = trustedEdges.filter((edge) => {
      const sourceFile = String(edge.source_file || "");
      if (["imports", "imports_from"].includes(edge.relation) && (!nodeIds.has(edge.source) || !nodeIds.has(edge.target))) return false;
      if (edge.relation === "references" && String(edge.target || "").startsWith("ref_defs_") && !nodeIds.has(edge.target)) return false;
      return !edge.source || !edge.target || !nodeIds.has(edge.source) || !nodeIds.has(edge.target) || !existsSync(resolve(root, sourceFile));
    });
    check("trusted-edge-integrity", invalidTrustedEdges.length === 0, {
      invalidCount: invalidTrustedEdges.length,
      message: "Trusted non-import edges require AST provenance, valid endpoints, and an existing source file. Unresolved imports are not trusted."
    });

    const graphMtime = statSync(graphPath).mtimeMs;
    const codeFiles = [...new Set(nodes.map((node) => String(node.source_file || "")).filter((file) => /\.(?:js|mjs|cjs|json|ts|tsx)$/.test(file)))];
    const newerFiles = codeFiles.filter((file) => statSync(resolve(root, file)).mtimeMs > graphMtime + 1000);
    check("graph-freshness", newerFiles.length === 0, {
      stale: newerFiles,
      message: newerFiles.length ? "Refresh Graphify after source changes." : "Graph is newer than indexed source files."
    });
  }
}

const claims = [
  ["student-bootstrap-route", "scripts/serve.mjs", /pathname === ["']\/api\/bootstrap["']/],
  ["learning-catalog-read-model", "src/repository.js", /export function createLearningCatalogReadModel/],
  ["student-quiz-write-route", "scripts/serve.mjs", /pathname === ["']\/api\/learning\/quiz["']/],
  ["lesson-quiz-client", "src/apiClient.js", /export async function postLessonQuiz/],
  ["repository-permission-check", "scripts/serve.mjs", /requireRepositoryPermission\(session/],
  ["normalized-lessons-schema", "src/schema.js", /id: ["']lessons["']/],
  ["postgres-lessons-migration", "db/migrations/0001_k12_learning_foundation.sql", /create table if not exists public\.["']lessons["']/i],
  ["graphify-governance-doc", "docs/graphify-review-and-adoption.md", /inferred edges.*hypotheses/i]
];

for (const [id, file, pattern] of claims) {
  const text = sourceText(file);
  const passed = Boolean(text) && pattern.test(text);
  result.claims.push({ id, file, passed });
  check(`claim:${id}`, passed, { file, message: passed ? "Source evidence found." : "Expected source evidence was not found." });
}

const failed = result.checks.filter((item) => !item.passed);
result.summary = {
  passed: failed.length === 0,
  failedChecks: failed.map((item) => item.id),
  trustedEdgesOnly: true,
  inferredEdgesAreHypotheses: true
};

writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
if (failed.length && strict) process.exitCode = 1;
