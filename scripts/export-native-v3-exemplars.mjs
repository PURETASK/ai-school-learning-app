#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pilotLessons } from "../src/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function getNativeV3ExemplarRecords() {
  return pilotLessons
    .filter((lesson) => lesson.schemaVersion === "3")
    .map((lesson) => JSON.parse(JSON.stringify(lesson)));
}

export function exportNativeV3Exemplars({ outputRoot = path.join(root, "content", "native-v3") } = {}) {
  const records = getNativeV3ExemplarRecords();
  const files = records.map((lesson) => {
    const subject = String(lesson.subject || "general").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const directory = path.join(outputRoot, lesson.academy, "grade-" + lesson.gradeLevel, subject);
    const file = path.join(directory, lesson.id + ".json");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + "\n");
    return file;
  });
  return { records, files };
}

function main() {
  const result = exportNativeV3Exemplars();
  console.log("Exported " + result.files.length + " native V3 exemplar lesson files.");
  for (const file of result.files) console.log("- " + path.relative(root, file));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
