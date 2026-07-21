const requiredRosterHeaders = ["display_name", "grade", "class_id"];
const maximumRosterRows = 500;

function normalizeHeader(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseCsvLine(line = "") {
  const values = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  values.push(value.trim());
  return values;
}

export function parseRosterCsv(csv = "") {
  const lines = String(csv || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return { accepted: false, headers: [], rows: [], errors: ["CSV is empty."] };
  if (lines.length - 1 > maximumRosterRows) {
    return {
      accepted: false,
      headers: [],
      rows: [],
      errors: [`CSV contains ${lines.length - 1} rows; the maximum import is ${maximumRosterRows}.`]
    };
  }

  let rawHeaders;
  try {
    rawHeaders = parseCsvLine(lines[0]);
  } catch (error) {
    return { accepted: false, headers: [], rows: [], errors: [error.message] };
  }
  const headers = rawHeaders.map(normalizeHeader);
  const missingHeaders = requiredRosterHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length) {
    return { accepted: false, headers, rows: [], errors: [`Missing required column(s): ${missingHeaders.join(", ")}.`] };
  }

  const rows = [];
  const errors = [];
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    try {
      const values = parseCsvLine(lines[lineIndex]);
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
      if (!row.display_name && !row.grade && !row.class_id) continue;
      rows.push({ ...row, rowNumber: lineIndex + 1 });
    } catch (error) {
      errors.push(`Row ${lineIndex + 1}: ${error.message}`);
    }
  }

  return { accepted: errors.length === 0, headers, rows, errors };
}

function csvSafeValue(value = "") {
  const raw = String(value ?? "");
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

function rosterAccountForLearner(state = {}, learnerId = "") {
  return (state.localAccounts || []).find((account) => account.role === "student" && account.studentId === learnerId) || null;
}

export function exportRosterCsv(state = {}, schoolId = "") {
  const schoolClasses = (state.classSections || []).filter((section) => !schoolId || section.schoolId === schoolId);
  const learnersById = new Map((state.learners || []).map((learner) => [learner.id, learner]));
  const headers = ["student_id", "display_name", "grade", "class_id", "class_name", "academy_id", "status", "username", "email"];
  const rows = [];

  for (const section of schoolClasses) {
    for (const learnerId of section.studentIds || []) {
      const learner = learnersById.get(learnerId);
      if (!learner) continue;
      const account = rosterAccountForLearner(state, learner.id);
      rows.push([
        learner.id,
        learner.name,
        learner.grade,
        section.id,
        section.name,
        learner.academyId,
        learner.status || "active",
        account?.username || "",
        account?.email || ""
      ]);
    }
  }

  return [headers, ...rows].map((row) => row.map(csvSafeValue).join(",")).join("\r\n") + "\r\n";
}

export function exportRepositoryRosterCsv(operations = {}) {
  const headers = ["student_id", "display_name", "grade", "class_id", "class_name", "academy_id", "status", "username", "email"];
  const learnersById = new Map((operations.learners || []).map((learner) => [learner.id, learner]));
  const rows = [];
  for (const section of operations.classes || []) {
    for (const learnerId of section.studentIds || []) {
      const learner = learnersById.get(learnerId);
      if (!learner) continue;
      rows.push([
        learner.id,
        learner.name,
        learner.grade,
        section.id,
        section.name,
        learner.academyId,
        learner.status || "active",
        learner.username || "",
        learner.email || ""
      ]);
    }
  }
  return [headers, ...rows].map((row) => row.map(csvSafeValue).join(",")).join("\r\n") + "\r\n";
}

export const rosterImportContract = {
  requiredHeaders: requiredRosterHeaders,
  optionalHeaders: ["student_id", "username", "email", "accommodations"],
  maximumRows: maximumRosterRows
};
