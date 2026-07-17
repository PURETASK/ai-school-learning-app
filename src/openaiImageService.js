const modelCostDollars = {
  "gpt-image-2": {
    low: { "1024x1024": 0.006, "1024x1536": 0.005, "1536x1024": 0.005 },
    medium: { "1024x1024": 0.053, "1024x1536": 0.041, "1536x1024": 0.041 },
    high: { "1024x1024": 0.211, "1024x1536": 0.165, "1536x1024": 0.165 }
  },
  "gpt-image-1.5": {
    low: { "1024x1024": 0.009, "1024x1536": 0.013, "1536x1024": 0.013 },
    medium: { "1024x1024": 0.034, "1024x1536": 0.05, "1536x1024": 0.05 },
    high: { "1024x1024": 0.133, "1024x1536": 0.2, "1536x1024": 0.2 }
  },
  "gpt-image-1": {
    low: { "1024x1024": 0.011, "1024x1536": 0.016, "1536x1024": 0.016 },
    medium: { "1024x1024": 0.042, "1024x1536": 0.063, "1536x1024": 0.063 },
    high: { "1024x1024": 0.167, "1024x1536": 0.25, "1536x1024": 0.25 }
  },
  "gpt-image-1-mini": {
    low: { "1024x1024": 0.005, "1024x1536": 0.006, "1536x1024": 0.006 },
    medium: { "1024x1024": 0.011, "1024x1536": 0.015, "1536x1024": 0.015 },
    high: { "1024x1024": 0.036, "1024x1536": 0.052, "1536x1024": 0.052 }
  }
};

const allowedSizes = new Set(["1024x1024", "1024x1536", "1536x1024"]);
const allowedQualities = new Set(["low", "medium", "high"]);
const allowedFormats = new Set(["png", "webp", "jpeg"]);

function numberFromEnv(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function jobCreatedToday(job) {
  const raw = job.createdAt || job.created_at || "";
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return false;
  return new Date(parsed).toISOString().slice(0, 10) === todayKey();
}

function educationalSafetySuffix() {
  return [
    "Create only original educational visuals.",
    "Do not show real children, private student data, branded characters, copyrighted characters, school logos, violence, or scary imagery.",
    "Use clear spacing, high contrast, age-appropriate details, and short readable labels only."
  ].join(" ");
}

export function getOpenAiImageConfig(env = {}) {
  const model = env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const size = allowedSizes.has(env.OPENAI_IMAGE_SIZE) ? env.OPENAI_IMAGE_SIZE : "1024x1024";
  const quality = allowedQualities.has(env.OPENAI_IMAGE_QUALITY) ? env.OPENAI_IMAGE_QUALITY : "medium";
  const outputFormat = allowedFormats.has(env.OPENAI_IMAGE_FORMAT) ? env.OPENAI_IMAGE_FORMAT : "png";
  return {
    enabled: env.OPENAI_IMAGE_ENABLED !== "false",
    hasApiKey: Boolean(env.OPENAI_API_KEY),
    model,
    size,
    quality,
    outputFormat,
    dailyLimit: Math.max(0, Math.floor(numberFromEnv(env.OPENAI_IMAGE_DAILY_LIMIT, 12))),
    maxPromptChars: Math.max(500, Math.floor(numberFromEnv(env.OPENAI_IMAGE_MAX_PROMPT_CHARS, 2200))),
    maxEstimatedCostCents: Math.max(1, numberFromEnv(env.OPENAI_IMAGE_MAX_COST_CENTS, 25))
  };
}

export function estimateImageCostCents({ model, size, quality }) {
  const value = modelCostDollars[model]?.[quality]?.[size];
  if (!value) return null;
  return Math.round(value * 10000) / 100;
}

export function getOpenAiImageReadiness(env = {}) {
  const config = getOpenAiImageConfig(env);
  const estimatedCostCents = estimateImageCostCents(config);
  return {
    ready: config.enabled && config.hasApiKey,
    ...config,
    estimatedCostCents,
    reviewRequired: true,
    studentFacingDirectGeneration: false
  };
}

export function createImageGenerationPlan({ prompt, state = {}, env = {} }) {
  const config = getOpenAiImageConfig(env);
  const rawPrompt = String(prompt || "").trim();
  const safePrompt = `${rawPrompt}\n\nSafety and accessibility requirements: ${educationalSafetySuffix()}`;
  const generatedToday = (state.visualGenerationJobs || []).filter(jobCreatedToday).length;
  const estimatedCostCents = estimateImageCostCents(config);
  const blockers = [];

  if (!config.enabled) blockers.push("OpenAI image generation is disabled by OPENAI_IMAGE_ENABLED=false.");
  if (!config.hasApiKey) blockers.push("OPENAI_API_KEY is not configured on the server.");
  if (!rawPrompt) blockers.push("Image prompt is required.");
  if (safePrompt.length > config.maxPromptChars) blockers.push(`Prompt is ${safePrompt.length} characters; limit is ${config.maxPromptChars}.`);
  if (generatedToday >= config.dailyLimit) blockers.push(`Daily image limit reached: ${generatedToday}/${config.dailyLimit}.`);
  if (estimatedCostCents !== null && estimatedCostCents > config.maxEstimatedCostCents) {
    blockers.push(`Estimated image cost ${estimatedCostCents} cents exceeds ${config.maxEstimatedCostCents} cent limit.`);
  }

  return {
    accepted: blockers.length === 0,
    blockers,
    prompt: safePrompt,
    config,
    generatedToday,
    estimatedCostCents,
    reviewRequired: true
  };
}

export async function generateOpenAiImage({ prompt, state = {}, env = {}, fetchImpl = fetch }) {
  const plan = createImageGenerationPlan({ prompt, state, env });
  if (!plan.accepted) {
    return {
      accepted: false,
      generated: false,
      plan,
      error: plan.blockers[0] || "OpenAI image generation is blocked by policy."
    };
  }

  const openAiResponse = await fetchImpl("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: plan.config.model,
      prompt: plan.prompt,
      size: plan.config.size,
      quality: plan.config.quality,
      output_format: plan.config.outputFormat,
      background: "opaque"
    })
  });

  const body = await openAiResponse.json().catch(() => ({}));
  if (!openAiResponse.ok) {
    return {
      accepted: false,
      generated: false,
      plan,
      error: body.error?.message || `OpenAI image generation failed with ${openAiResponse.status}.`,
      code: body.error?.code || ""
    };
  }

  const image = body.data?.[0];
  if (!image?.b64_json) {
    return {
      accepted: false,
      generated: false,
      plan,
      error: "OpenAI image generation did not return base64 image data."
    };
  }

  return {
    accepted: true,
    generated: true,
    plan,
    b64Json: image.b64_json,
    model: plan.config.model,
    outputFormat: plan.config.outputFormat,
    usage: body.usage || image.usage || null
  };
}
