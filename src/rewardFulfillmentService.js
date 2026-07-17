const providerIds = new Set(["manual", "tremendous"]);

function boolFromEnv(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function numberFromEnv(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function requestedToday(fulfillment = {}) {
  const raw = fulfillment.requestedAt || fulfillment.completedAt || "";
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return false;
  return new Date(parsed).toISOString().slice(0, 10) === todayKey();
}

export function isGiftCardRewardRequest(request = {}) {
  const text = `${request.rewardTitle || ""} ${request.rewardBenefit || ""}`.toLowerCase();
  return text.includes("gift card") || /\$\s*\d+/.test(text);
}

export function getGiftCardAmountCents(request = {}, env = {}) {
  const explicit = numberFromEnv(env.GIFT_CARD_DEFAULT_CENTS, 0);
  if (explicit > 0) return Math.round(explicit);
  const text = `${request.rewardTitle || ""} ${request.rewardBenefit || ""}`;
  const match = text.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
  if (!match) return 1000;
  return Math.round(Number(match[1]) * 100);
}

export function getGiftCardFulfillmentConfig(env = {}) {
  const requestedProvider = String(env.GIFT_CARD_PROVIDER || "manual").trim().toLowerCase();
  const provider = providerIds.has(requestedProvider) ? requestedProvider : "manual";
  const tremendousBaseUrl = String(env.TREMENDOUS_BASE_URL || "https://testflight.tremendous.com/api/v2").replace(/\/+$/, "");
  return {
    enabled: boolFromEnv(env.GIFT_CARD_FULFILLMENT_ENABLED, false),
    provider,
    mode: provider === "tremendous" ? "external-provider" : "manual-review",
    currencyCode: String(env.GIFT_CARD_CURRENCY || "USD").trim().toUpperCase(),
    dailyLimit: Math.max(0, Math.floor(numberFromEnv(env.GIFT_CARD_DAILY_LIMIT, 5))),
    maxAmountCents: Math.max(100, Math.floor(numberFromEnv(env.GIFT_CARD_MAX_CENTS, 1000))),
    defaultAmountCents: Math.max(100, Math.floor(numberFromEnv(env.GIFT_CARD_DEFAULT_CENTS, 1000))),
    tremendous: {
      baseUrl: tremendousBaseUrl,
      apiKeyConfigured: Boolean(env.TREMENDOUS_API_KEY),
      fundingSourceIdConfigured: Boolean(env.TREMENDOUS_FUNDING_SOURCE_ID),
      productIdConfigured: Boolean(env.TREMENDOUS_PRODUCT_ID),
      campaignIdConfigured: Boolean(env.TREMENDOUS_CAMPAIGN_ID),
      productId: env.TREMENDOUS_PRODUCT_ID || "",
      campaignId: env.TREMENDOUS_CAMPAIGN_ID || "",
      fundingSourceId: env.TREMENDOUS_FUNDING_SOURCE_ID || "",
      liveProductionAllowed: boolFromEnv(env.GIFT_CARD_ALLOW_LIVE_PROVIDER, false)
    }
  };
}

export function getGiftCardFulfillmentReadiness(env = {}) {
  const config = getGiftCardFulfillmentConfig(env);
  const blockers = [];

  if (!config.enabled) blockers.push("GIFT_CARD_FULFILLMENT_ENABLED is not true.");
  if (config.provider === "tremendous") {
    if (!config.tremendous.apiKeyConfigured) blockers.push("TREMENDOUS_API_KEY is missing.");
    if (!config.tremendous.fundingSourceIdConfigured) blockers.push("TREMENDOUS_FUNDING_SOURCE_ID is missing.");
    if (!config.tremendous.productIdConfigured && !config.tremendous.campaignIdConfigured) {
      blockers.push("TREMENDOUS_PRODUCT_ID or TREMENDOUS_CAMPAIGN_ID is required.");
    }
    if (config.tremendous.baseUrl.includes("api.tremendous.com") && !config.tremendous.liveProductionAllowed) {
      blockers.push("Set GIFT_CARD_ALLOW_LIVE_PROVIDER=true before using the live Tremendous API host.");
    }
  }

  return {
    ready: blockers.length === 0,
    blockers,
    provider: config.provider,
    mode: config.mode,
    dailyLimit: config.dailyLimit,
    maxAmountCents: config.maxAmountCents,
    defaultAmountCents: config.defaultAmountCents,
    currencyCode: config.currencyCode,
    externalProviderConfigured:
      config.provider === "tremendous" &&
      config.tremendous.apiKeyConfigured &&
      config.tremendous.fundingSourceIdConfigured &&
      (config.tremendous.productIdConfigured || config.tremendous.campaignIdConfigured)
  };
}

export function createGiftCardFulfillmentPlan({ request = {}, state = {}, env = {}, recipientEmail = "", recipientName = "" }) {
  const config = getGiftCardFulfillmentConfig(env);
  const amountCents = getGiftCardAmountCents(request, env);
  const fulfilledToday = (state.rewardApprovals || []).filter((approval) => requestedToday(approval.fulfillment)).length;
  const blockers = [];

  if (!request.id) blockers.push("Reward request is required.");
  if (!isGiftCardRewardRequest(request)) blockers.push("This reward is not marked as a gift-card reward.");
  if (request.status !== "approved") blockers.push("Gift cards can only be fulfilled after parent approval.");
  if (request.fulfillment?.status === "fulfilled") blockers.push("This gift card has already been fulfilled.");
  if (!config.enabled) blockers.push("Gift-card fulfillment is disabled.");
  if (fulfilledToday >= config.dailyLimit) blockers.push(`Daily gift-card fulfillment limit reached: ${fulfilledToday}/${config.dailyLimit}.`);
  if (amountCents > config.maxAmountCents) blockers.push(`Gift-card amount ${amountCents} cents exceeds ${config.maxAmountCents} cent limit.`);
  if (!String(recipientEmail || "").includes("@")) blockers.push("Parent recipient email is required.");
  if (!String(recipientName || "").trim()) blockers.push("Recipient name is required.");

  const readiness = getGiftCardFulfillmentReadiness(env);
  blockers.push(...readiness.blockers);

  return {
    accepted: blockers.length === 0,
    blockers: [...new Set(blockers)],
    provider: config.provider,
    mode: config.mode,
    amountCents,
    currencyCode: config.currencyCode,
    recipientEmail: String(recipientEmail || "").trim(),
    recipientName: String(recipientName || "").trim(),
    fulfilledToday,
    config,
    readiness
  };
}

function dollarsFromCents(cents) {
  return Math.round(cents) / 100;
}

function tremendousPayload({ request, plan, env }) {
  const reward = {
    value: {
      denomination: dollarsFromCents(plan.amountCents),
      currency_code: plan.currencyCode
    },
    delivery: {
      method: "EMAIL"
    },
    recipient: {
      name: plan.recipientName,
      email: plan.recipientEmail
    },
    external_id: request.id
  };

  if (env.TREMENDOUS_PRODUCT_ID) reward.products = [env.TREMENDOUS_PRODUCT_ID];
  if (env.TREMENDOUS_CAMPAIGN_ID) reward.campaign_id = env.TREMENDOUS_CAMPAIGN_ID;

  return {
    external_id: request.id,
    payment: {
      funding_source_id: env.TREMENDOUS_FUNDING_SOURCE_ID
    },
    rewards: [reward]
  };
}

function providerReferenceFromBody(body = {}) {
  return (
    body.order?.id ||
    body.id ||
    body.order_id ||
    body.rewards?.[0]?.id ||
    body.reward?.id ||
    body.data?.id ||
    ""
  );
}

export async function fulfillGiftCardReward({ request, state = {}, env = {}, recipientEmail = "", recipientName = "", fetchImpl = fetch }) {
  const plan = createGiftCardFulfillmentPlan({ request, state, env, recipientEmail, recipientName });
  if (!plan.accepted) {
    return {
      accepted: false,
      fulfilled: false,
      plan,
      error: plan.blockers[0] || "Gift-card fulfillment is blocked."
    };
  }

  if (plan.provider === "manual") {
    return {
      accepted: true,
      fulfilled: true,
      manualReview: true,
      plan,
      provider: "manual",
      providerReference: `manual-${request.id}-${Date.now()}`,
      deliveryStatus: "manual-review",
      summary: "Gift-card reward was queued for manual parent delivery."
    };
  }

  const response = await fetchImpl(`${plan.config.tremendous.baseUrl}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.TREMENDOUS_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tremendousPayload({ request, plan, env }))
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      accepted: false,
      fulfilled: false,
      plan,
      provider: "tremendous",
      error: body.error?.message || body.message || `Gift-card provider failed with ${response.status}.`,
      providerStatus: response.status,
      providerBody: body
    };
  }

  return {
    accepted: true,
    fulfilled: true,
    plan,
    provider: "tremendous",
    providerReference: providerReferenceFromBody(body),
    deliveryStatus: body.status || body.order?.status || "submitted",
    providerBody: body,
    summary: "Gift-card order was submitted to the configured provider."
  };
}
