import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function stripInlineComment(value) {
  let quote = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if ((char === '"' || char === "'") && value[index - 1] !== "\\") {
      quote = quote === char ? "" : quote || char;
    }
    if (char === "#" && !quote) {
      return value.slice(0, index).trim();
    }
  }
  return value.trim();
}

function parseEnvValue(value) {
  const cleaned = stripInlineComment(String(value || "").trim());
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    return cleaned.slice(1, -1).replaceAll("\\n", "\n");
  }
  return cleaned;
}

export function loadEnvFile({ root = process.cwd(), filename = ".env", override = false } = {}) {
  const envPath = resolve(root, filename);
  if (!existsSync(envPath)) {
    return { loaded: false, path: envPath, keys: [] };
  }

  const keys = [];
  const lines = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const normalized = trimmed.startsWith("export ") ? trimmed.slice("export ".length).trim() : trimmed;
    const equalsIndex = normalized.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = normalized.slice(0, equalsIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    if (!override && process.env[key] !== undefined) continue;

    process.env[key] = parseEnvValue(normalized.slice(equalsIndex + 1));
    keys.push(key);
  }

  return { loaded: true, path: envPath, keys };
}
