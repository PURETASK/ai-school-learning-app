import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generatePostgresMigration, getMigrationReadiness } from "../src/migrations.js";

const migration = generatePostgresMigration();
const readiness = getMigrationReadiness();
const outputDir = resolve("db", "migrations");
const outputPath = resolve(outputDir, `${migration.id}.sql`);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, migration.sql, "utf8");

console.log(`migration=${migration.id}`);
console.log(`file=${outputPath}`);
console.log(`tables=${migration.tableCount}`);
console.log(`statements=${migration.statementCount}`);
console.log(`rlsPolicies=${migration.rlsPolicyCount}`);
console.log(`indexes=${migration.indexCount}`);
console.log(`ready=${readiness.passed}`);

if (!readiness.passed) {
  console.log(`missingSignals=${readiness.missingSignals.join(", ") || "none"}`);
  process.exitCode = 1;
}
