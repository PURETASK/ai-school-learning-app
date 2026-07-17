const defaultBucket = "k12-visual-assets";
const defaultFileSizeLimit = 15 * 1024 * 1024;

function trimTrailingSlash(value = "") {
  return String(value || "").replace(/\/+$/, "");
}

function slug(value = "") {
  return String(value || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function contentTypeForFormat(format = "") {
  if (format === "jpg" || format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  if (format === "svg+xml" || format === "svg") return "image/svg+xml";
  return "image/png";
}

export function getVisualAssetStorageConfig(env = {}) {
  const supabaseUrl = trimTrailingSlash(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "");
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";
  const bucket = env.VISUAL_ASSET_STORAGE_BUCKET || defaultBucket;
  const autoCreateBucket = env.VISUAL_ASSET_STORAGE_AUTO_CREATE === "true";
  return {
    ready: Boolean(supabaseUrl && secretKey && bucket),
    supabaseUrl,
    hasSecretKey: Boolean(secretKey),
    bucket,
    autoCreateBucket,
    provider: "supabase-storage"
  };
}

export function parseDataImageUrl(assetUrl = "") {
  const match = String(assetUrl || "").match(/^data:image\/([^;,]+);base64,(.+)$/i);
  if (!match) {
    return {
      accepted: false,
      error: "Only base64 data image URLs can be promoted to storage automatically."
    };
  }
  const outputFormat = match[1].toLowerCase();
  return {
    accepted: true,
    outputFormat,
    contentType: contentTypeForFormat(outputFormat),
    buffer: Buffer.from(match[2], "base64")
  };
}

export function visualAssetStoragePath(asset = {}, outputFormat = "png") {
  const extension = outputFormat === "jpeg" ? "jpg" : outputFormat.replace("+xml", "svg");
  const lessonPart = slug(asset.lessonId || asset.draftId || "unlinked");
  const assetPart = slug(asset.id || asset.title || "visual");
  return `lessons/${lessonPart}/${assetPart}.${extension}`;
}

async function ensureBucket({ config, secretKey, fetchImpl }) {
  if (!config.autoCreateBucket) {
    return { attempted: false, created: false };
  }
  const response = await fetchImpl(`${config.supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      apikey: secretKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: config.bucket,
      name: config.bucket,
      public: true,
      file_size_limit: defaultFileSizeLimit,
      allowed_mime_types: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
    })
  });
  if (response.ok || response.status === 409 || response.status === 400) {
    return { attempted: true, created: response.ok };
  }
  const body = await response.json().catch(() => ({}));
  throw new Error(body.message || body.error || `Bucket setup failed with ${response.status}.`);
}

export async function setupVisualAssetStorageBucket({ env = {}, fetchImpl = fetch, createIfMissing = false } = {}) {
  const config = getVisualAssetStorageConfig(env);
  if (!config.ready) {
    return {
      ready: false,
      bucketReady: false,
      bucketCreated: false,
      error: "Supabase visual asset storage is not configured. Set SUPABASE_URL, SUPABASE_SECRET_KEY, and VISUAL_ASSET_STORAGE_BUCKET."
    };
  }

  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketUrl = `${config.supabaseUrl}/storage/v1/bucket/${encodeURIComponent(config.bucket)}`;
  const headers = {
    Authorization: `Bearer ${secretKey}`,
    apikey: secretKey
  };
  const checkResponse = await fetchImpl(bucketUrl, { method: "GET", headers });
  if (checkResponse.ok) {
    const body = await checkResponse.json().catch(() => ({}));
    return {
      ready: true,
      bucketReady: true,
      bucketCreated: false,
      provider: config.provider,
      bucket: config.bucket,
      public: Boolean(body.public),
      fileSizeLimit: body.file_size_limit || null,
      allowedMimeTypes: body.allowed_mime_types || []
    };
  }

  if (!createIfMissing) {
    return {
      ready: false,
      bucketReady: false,
      bucketCreated: false,
      provider: config.provider,
      bucket: config.bucket,
      error: `Bucket ${config.bucket} was not found or was not reachable.`
    };
  }

  const created = await ensureBucket({ config: { ...config, autoCreateBucket: true }, secretKey, fetchImpl });
  return {
    ready: true,
    bucketReady: true,
    bucketCreated: Boolean(created.created),
    provider: config.provider,
    bucket: config.bucket,
    public: true,
    fileSizeLimit: defaultFileSizeLimit,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
  };
}

export async function uploadVisualAssetToSupabaseStorage({ asset, env = {}, fetchImpl = fetch }) {
  const config = getVisualAssetStorageConfig(env);
  if (!config.ready) {
    return {
      accepted: false,
      error: "Supabase visual asset storage is not configured. Set SUPABASE_URL, SUPABASE_SECRET_KEY, and VISUAL_ASSET_STORAGE_BUCKET."
    };
  }

  const parsed = parseDataImageUrl(asset.assetUrl || "");
  if (!parsed.accepted) {
    return parsed;
  }

  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const path = asset.storagePath || visualAssetStoragePath(asset, parsed.outputFormat);
  await ensureBucket({ config, secretKey, fetchImpl });
  const uploadResponse = await fetchImpl(`${config.supabaseUrl}/storage/v1/object/${encodeURIComponent(config.bucket)}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      apikey: secretKey,
      "Content-Type": parsed.contentType,
      "x-upsert": "true",
      "Cache-Control": "31536000"
    },
    body: parsed.buffer
  });

  if (!uploadResponse.ok) {
    const body = await uploadResponse.json().catch(() => ({}));
    return {
      accepted: false,
      error: body.message || body.error || `Storage upload failed with ${uploadResponse.status}.`
    };
  }

  const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/${encodeURIComponent(config.bucket)}/${path}`;
  return {
    accepted: true,
    provider: config.provider,
    bucket: config.bucket,
    path,
    publicUrl,
    contentType: parsed.contentType,
    sizeBytes: parsed.buffer.byteLength
  };
}
