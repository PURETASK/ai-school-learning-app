import { syllabusResearchFindings, syllabusResearchSources } from "./data.js";

const maxSnippetLength = 360;

function normalizeText(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html = "", attribute = "", value = "") {
  const tag = String(html).match(new RegExp(`<meta[^>]+${attribute}=["']${value}["'][^>]*>`, "i"))?.[0] || "";
  return tag.match(/content=["']([^"']+)["']/i)?.[1] || "";
}

function extractTitle(html = "") {
  return normalizeText(String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function approvedSourceUrls() {
  return [
    ...syllabusResearchSources.map((source) => source.url),
    ...syllabusResearchFindings.map((finding) => finding.sourceUrl)
  ].filter((url) => /^https:\/\//i.test(url));
}

export function getApprovedLiveSourceTargets() {
  return approvedSourceUrls().map((url) => {
    const parsed = new URL(url);
    return {
      url,
      host: parsed.host,
      path: parsed.pathname
    };
  });
}

export function isApprovedLiveSourceUrl(sourceUrl = "") {
  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  return getApprovedLiveSourceTargets().some((target) => {
    const targetUrl = new URL(target.url);
    return parsed.host === targetUrl.host && parsed.pathname.toLowerCase().startsWith(targetUrl.pathname.toLowerCase().replace(/\/$/, ""));
  });
}

function candidateTerms({ subject = "", grade = "", lessonTitle = "" } = {}) {
  return [
    subject,
    grade ? `grade ${grade}` : "",
    ...String(lessonTitle || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((part) => part.length >= 4)
  ]
    .map((term) => String(term || "").toLowerCase().trim())
    .filter(Boolean);
}

export function extractSourceEvidence(html = "", context = {}) {
  const title = extractTitle(html);
  const description = normalizeText(
    metaContent(html, "name", "description") || metaContent(html, "property", "og:description")
  );
  const bodyText = normalizeText(html);
  const pieces = bodyText
    .split(/(?<=[.!?])\s+/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length >= 80);
  const terms = candidateTerms(context);
  const termMatches = pieces.filter((piece) => {
    const lower = piece.toLowerCase();
    return terms.some((term) => lower.includes(term));
  });
  const snippets = (termMatches.length ? termMatches : pieces)
    .slice(0, 5)
    .map((snippet) => (snippet.length > maxSnippetLength ? `${snippet.slice(0, maxSnippetLength - 3)}...` : snippet));

  return {
    title,
    description,
    snippets,
    wordCount: bodyText ? bodyText.split(/\s+/).length : 0
  };
}

export function createSourceLedgerFromAudit(audit = {}, context = {}) {
  const sourceId = `live-${audit.host || "source"}-${Date.now()}`.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  return {
    id: `${sourceId}-ledger`,
    sourceId,
    sourceName: audit.title || audit.host || "Live curriculum source",
    sourceUrl: audit.url,
    sourceType: "live-web-audit",
    checkedAt: audit.checkedAt,
    subjects: [context.subject || "general"],
    gradeBands: [context.gradeBand || ""].filter(Boolean),
    claim: audit.snippets?.[0] || audit.description || "Live source was fetched and needs staff claim review.",
    troubleSignal: "Staff must confirm which student difficulty or syllabus sequence this source actually supports.",
    redesignMove: "Use the verified claim to update explanation routes, misconception repair, visual supports, or reteach paths after manager approval.",
    status: "live-review"
  };
}

export async function fetchApprovedSourceAudit({ sourceUrl = "", subject = "", grade = "", gradeBand = "", lessonTitle = "", fetchImpl = fetch } = {}) {
  if (!isApprovedLiveSourceUrl(sourceUrl)) {
    const error = new Error("Source URL is not on the approved curriculum research allowlist.");
    error.status = 403;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetchImpl(sourceUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "K12LearningAcademies/0.1 staff-source-audit"
      }
    });
    const contentType = response.headers?.get?.("content-type") || "";
    const html = await response.text();
    const extracted = extractSourceEvidence(html, { subject, grade, lessonTitle });
    const audit = {
      url: sourceUrl,
      host: new URL(sourceUrl).host,
      httpStatus: response.status,
      ok: response.ok,
      contentType,
      checkedAt: new Date().toISOString(),
      ...extracted
    };
    return {
      audit,
      sourceLedger: [createSourceLedgerFromAudit(audit, { subject, gradeBand })]
    };
  } finally {
    clearTimeout(timeout);
  }
}
