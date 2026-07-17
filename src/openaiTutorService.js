const defaultFetch = typeof fetch === "function" ? fetch : null;

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function trimText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function providerError(payload = {}, fallback = "OpenAI tutor request failed.") {
  const error = new Error(String(payload.error?.message || payload.message || payload.error || fallback));
  error.status = Number(payload.status) || 502;
  error.provider = "openai";
  return error;
}

function tutorConfig(env = process.env) {
  return {
    enabled: env.OPENAI_TUTOR_ENABLED !== "false",
    apiKey: String(env.OPENAI_API_KEY || "").trim(),
    model: String(env.OPENAI_TUTOR_MODEL || "gpt-4.1-mini").trim(),
    dailyLimit: positiveInteger(env.OPENAI_TUTOR_DAILY_LIMIT, 30),
    maxInputChars: positiveInteger(env.OPENAI_TUTOR_MAX_INPUT_CHARS, 2200),
    maxOutputTokens: positiveInteger(env.OPENAI_TUTOR_MAX_OUTPUT_TOKENS, 700),
    dailyTokenLimit: positiveInteger(env.OPENAI_TUTOR_DAILY_TOKEN_LIMIT, 42000),
    minimumReviewAverage: Math.min(Math.max(Number(env.OPENAI_TUTOR_MIN_REVIEW_AVERAGE || 4), 1), 5)
  };
}

export function getOpenAiTutorReadiness(env = process.env) {
  const config = tutorConfig(env);
  const missing = [];
  if (!config.apiKey) missing.push("OPENAI_API_KEY");
  if (!config.model) missing.push("OPENAI_TUTOR_MODEL");
  return {
    enabled: config.enabled,
    configured: Boolean(config.apiKey),
    ready: config.enabled && missing.length === 0,
    model: config.model || "not-configured",
    dailyLimit: config.dailyLimit,
    maxInputChars: config.maxInputChars,
    maxOutputTokens: config.maxOutputTokens,
    dailyTokenLimit: config.dailyTokenLimit,
    minimumReviewAverage: config.minimumReviewAverage,
    missing
  };
}

function countProviderCallsToday(state = {}) {
  const today = new Date().toISOString().slice(0, 10);
  return (state.aiLogs || []).filter((log) => {
    if (log.provider !== "openai") return false;
    const rawDate = log.providerAttachedAt || log.timestamp || "";
    const parsed = Date.parse(rawDate);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === today;
  }).length;
}

function countProviderTokensToday(state = {}) {
  const today = new Date().toISOString().slice(0, 10);
  return (state.aiLogs || []).reduce((total, log) => {
    if (log.provider !== "openai") return total;
    const parsed = Date.parse(log.providerAttachedAt || log.timestamp || "");
    if (!Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 10) !== today) return total;
    return total + Number(log.providerUsage?.totalTokens || 0);
  }, 0);
}

export function createTutorGenerationPlan({ state = {}, input = "", env = process.env } = {}) {
  const config = tutorConfig(env);
  const normalizedInput = trimText(input, config.maxInputChars);
  const providerCallsToday = countProviderCallsToday(state);
  const providerTokensToday = countProviderTokensToday(state);
  const blockers = [];
  if (!config.enabled) blockers.push("OpenAI tutor provider is disabled.");
  if (!config.apiKey) blockers.push("OPENAI_API_KEY is not configured on the server.");
  if (!normalizedInput) blockers.push("A student confusion statement is required.");
  if (providerCallsToday >= config.dailyLimit) blockers.push("The daily OpenAI tutor limit has been reached.");
  if (providerTokensToday >= config.dailyTokenLimit) blockers.push("The daily OpenAI tutor token budget has been reached.");

  return {
    accepted: blockers.length === 0,
    input: normalizedInput,
    providerCallsToday,
    providerTokensToday,
    dailyLimit: config.dailyLimit,
    dailyTokenLimit: config.dailyTokenLimit,
    blockers,
    config: {
      model: config.model,
      maxInputChars: config.maxInputChars,
      maxOutputTokens: config.maxOutputTokens,
      dailyTokenLimit: config.dailyTokenLimit,
      minimumReviewAverage: config.minimumReviewAverage
    }
  };
}

function safeUsage(usage = {}) {
  return {
    inputTokens: Number(usage.input_tokens || usage.prompt_tokens || 0) || 0,
    outputTokens: Number(usage.output_tokens || usage.completion_tokens || 0) || 0,
    totalTokens: Number(usage.total_tokens || 0) || 0
  };
}

function extractOutputText(payload = {}) {
  if (typeof payload.output_text === "string") return payload.output_text.trim();
  const parts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function parseStructuredTutorOutput(text = "") {
  const candidates = [String(text || "").trim()];
  const fenced = String(text || "").match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.unshift(fenced[1].trim());
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // The provider may return a plain response; the caller can still quality-review it.
    }
  }
  return { text: String(text || "").trim() };
}

function normalizeProviderResponse(payload = {}, maxChars = 4000) {
  const rawText = trimText(payload.text || payload.response, maxChars);
  return {
    text: rawText,
    analysis: trimText(payload.analysis, 900),
    nextStep: trimText(payload.nextStep, 500),
    prompt: trimText(payload.prompt, 500),
    hintPath: Array.isArray(payload.hintPath) ? payload.hintPath.map((item) => trimText(item, 260)).filter(Boolean).slice(0, 5) : [],
    nextQuestion: trimText(payload.nextQuestion, 500),
    visualHint: trimText(payload.visualHint, 700),
    firstPrinciplesPrompt: trimText(payload.firstPrinciplesPrompt, 700),
    modeId: trimText(payload.modeId, 80),
    type: "provider-tutor"
  };
}

async function callOpenAi(path, body, { config, fetchImpl }) {
  if (typeof fetchImpl !== "function") throw new Error("Fetch API is unavailable for OpenAI tutor requests.");
  const response = await fetchImpl(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw providerError({ ...payload, status: response.status });
  return payload;
}

export async function generateOpenAiTutorResponse({
  state = {},
  lesson = {},
  support = {},
  studentInput = "",
  localResponse = {},
  ageBand = "K-5",
  explanationMode = "diagnose",
  env = process.env,
  fetchImpl = defaultFetch
} = {}) {
  const config = tutorConfig(env);
  const plan = createTutorGenerationPlan({ state, input: studentInput, env });
  if (!plan.accepted) return { accepted: false, provider: "openai", plan, fallback: true };

  const moderation = await callOpenAi("moderations", {
    model: "omni-moderation-latest",
    input: plan.input
  }, { config, fetchImpl });
  const moderationResult = moderation.results?.[0] || {};
  if (moderationResult.flagged) {
    return {
      accepted: false,
      blocked: true,
      provider: "openai",
      moderation: { flagged: true, categories: moderationResult.categories || {} },
      plan,
      fallback: true
    };
  }

  const context = {
    lessonTitle: trimText(lesson.title, 180),
    learningObjective: trimText(lesson.objective || lesson.learningObjective, 500),
    subject: trimText(lesson.subject, 100),
    ageBand: trimText(ageBand, 40),
    explanationMode: trimText(explanationMode, 80),
    teachingSummary: trimText(support.summary, 700),
    commonMisunderstandings: Array.isArray(support.commonMisunderstandings)
      ? support.commonMisunderstandings.slice(0, 4).map((item) => trimText(item.mistake || item, 260))
      : [],
    localDiagnosis: trimText(localResponse.analysis, 700),
    localNextQuestion: trimText(localResponse.nextQuestion || localResponse.nextStep, 500)
  };
  const instructions = [
    "You are a guarded K-12 tutor inside a learning app.",
    "Teach the method, not the final answer. Ask a guiding question or give one small hint before solving student work.",
    "Start by naming what may be confusing in the student's own words.",
    "Use a concrete example, visual description, metaphor, or first-principles question when it helps.",
    "Never request personal information. Do not claim to be a human, guarantee a grade, or answer a live quiz directly.",
    "Return only a JSON object with keys: text, analysis, nextStep, hintPath, nextQuestion, visualHint, firstPrinciplesPrompt, modeId.",
    "hintPath must be an array of no more than five short steps. Keep the response age-appropriate and under 900 words.",
    `Lesson context: ${JSON.stringify(context)}`
  ].join("\n");
  const input = `Student confusion statement:\n${plan.input}`;
  const generated = await callOpenAi("responses", {
    model: config.model,
    store: false,
    max_output_tokens: config.maxOutputTokens,
    instructions,
    input
  }, { config, fetchImpl });
  const outputText = extractOutputText(generated);
  const response = normalizeProviderResponse(parseStructuredTutorOutput(outputText), 4000);
  if (!response.text) {
    return { accepted: false, provider: "openai", plan, moderation: { flagged: false }, fallback: true, error: "OpenAI tutor returned an empty response." };
  }
  return {
    accepted: true,
    provider: "openai",
    model: config.model,
    requestId: String(generated.id || ""),
    response,
    moderation: { flagged: false, categories: moderationResult.categories || {} },
    usage: safeUsage(generated.usage),
    plan,
    fallback: false
  };
}
