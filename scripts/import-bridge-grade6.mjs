import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLessonBatch } from "../src/engine.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content", "bridge-academy", "grade-6");
const sourceBatchId = "bridge-academy-grade-6-native-batch-1";
const baseUrl = process.env.APP_URL || "http://localhost:4184";
const dryRun = process.argv.includes("--dry-run");

function findJsonFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(folder, entry.name);
    if (entry.isDirectory()) return findJsonFiles(entryPath);
    return entry.name.endsWith(".json") ? [entryPath] : [];
  });
}

const files = findJsonFiles(contentRoot).sort();
const lessons = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
const validation = validateLessonBatch({ sourceBatchId, lessons });

console.log(JSON.stringify({
  sourceBatchId,
  files: files.map((file) => path.relative(root, file)),
  accepted: validation.accepted,
  total: validation.total,
  readyCount: validation.readyCount,
  errors: validation.errors,
  warnings: validation.warnings
}, null, 2));

if (!validation.accepted || dryRun) process.exit(validation.accepted ? 0 : 1);

const response = await fetch(`${baseUrl}/api/content/import`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ sourceBatchId, lessons })
});
const payload = await response.json();
console.log(JSON.stringify({
  imported: response.ok,
  status: response.status,
  result: payload.result || payload
}, null, 2));
if (!response.ok) process.exit(1);
