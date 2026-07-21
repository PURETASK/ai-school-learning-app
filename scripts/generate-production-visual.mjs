import { resolve } from "node:path";
import { loadEnvFile } from "../src/env.js";
import { createStateRepository } from "../src/repository.js";
import {
  addGeneratedVisualAsset,
  createInitialState,
  getVisualLearningAgentAudit,
  markVisualAssetStoragePromoted,
  updateVisualAssetStatus,
  runArtifactRevisionLoop
} from "../src/engine.js";
import { generateOpenAiImage } from "../src/openaiImageService.js";
import { uploadVisualAssetToSupabaseStorage } from "../src/visualAssetStorageService.js";

function argValue(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || "";
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function log(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function hasSupabaseRestConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const secretKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return Boolean(supabaseUrl && secretKey);
}

async function persistVisualAssetViaRest(asset) {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !secretKey) {
    return { accepted: false, error: "SUPABASE_URL and SUPABASE_SECRET_KEY are required for REST fallback persistence." };
  }

  const row = {
    id: asset.id,
    lesson_id: asset.lessonId || null,
    draft_id: asset.draftId || null,
    asset_kind: asset.assetKind || "openai-generated-image",
    placement: asset.placement || "",
    subject_id: asset.subject || "",
    grade: asset.grade || "",
    title: asset.title || asset.caption || asset.id,
    asset_url: asset.storagePublicUrl || asset.assetUrl || "",
    storage_provider: asset.storageProvider || "supabase-storage",
    storage_bucket: asset.storageBucket || "",
    storage_path: asset.storagePath || "",
    storage_public_url: asset.storagePublicUrl || "",
    storage_status: asset.storageStatus || "stored-review",
    source_prompt: asset.sourcePrompt || "",
    source_model: asset.sourceModel || asset.model || "",
    usage: asset.usage || {},
    generation_metadata: asset.generationMetadata || {},
    review_checklist: asset.reviewChecklist || [],
    latest_review: asset.latestReview || {},
    review_history: asset.reviewHistory || [],
    review_version: Number(asset.reviewVersion || 0),
    alt_text: asset.altText || "",
    caption: asset.caption || "",
    license: asset.license || "",
    credit: asset.credit || "",
    status: asset.status || "review",
    approved_by_user_id: asset.approvedByUserId || null,
    approved_at: asset.approvedAt || null,
    created_at: asset.createdAt && Number.isFinite(Date.parse(asset.createdAt)) ? new Date(asset.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/visual_assets?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(row)
  });
  const body = await response.text();
  return {
    accepted: response.ok,
    status: response.status,
    error: response.ok ? "" : body.slice(0, 500),
    body: body.slice(0, 500)
  };
}

loadEnvFile({ root: resolve(process.cwd()) });
process.env.K12_REPOSITORY_TIMEOUT_MS ||= "60000";

const repository = createStateRepository({ root: resolve(process.cwd()), env: process.env });
let persistedState = {};
let repositoryReadError = "";
try {
  persistedState = await repository.readState();
} catch (error) {
  if (!hasSupabaseRestConfig()) throw error;
  repositoryReadError = "Normalized repository read was unavailable; visual generation is using the local seed catalog and will attempt Supabase REST persistence.";
}
const state = { ...createInitialState(), ...persistedState };
if (repositoryReadError) {
  log({ accepted: false, step: "repository-read", warning: repositoryReadError });
}
const audit = getVisualLearningAgentAudit(state);
const requestedSlotId = argValue("slot");
const approve = !hasFlag("no-approve");
const slot =
  (requestedSlotId ? audit.slots.find((item) => item.id === requestedSlotId) : null) ||
  audit.slots.find((item) => item.placement === "lesson-hero") ||
  audit.slots[0];

if (!slot) {
  log({ accepted: false, step: "select-slot", error: "No visual learning opportunity found." });
  process.exitCode = 1;
} else {
  const requestedPrompt = [
    argValue("prompt") || slot.prompt,
    "Style direction: bold cyber-neon academy-world educational illustration, clean readable diagram labels, polished production app art.",
    "Do not show real children, private student data, school logos, branded characters, copyrighted characters, violence, or scary imagery."
  ].join("\n\n");

  const promptRevisionLoop = runArtifactRevisionLoop({
    artifactType: "image_prompt",
    artifact: { ...slot, id: slot.id, prompt: requestedPrompt },
    maxAttempts: Math.max(1, Math.min(3, Number(process.env.K12_ARTIFACT_MAX_ATTEMPTS || 3))),
    creatorId: "visual-learning-agent",
    options: { nextCritic: "Visual Learning Agent" },
    regenerate: ({ artifact, revisionBrief }) => ({
      ...artifact,
      prompt: `${artifact.prompt}\n\nRevision requirements from the critic: ${revisionBrief.specificImprovements.join(" ") || revisionBrief.creatorInstructions}`
    })
  });
  if (!promptRevisionLoop.approved) {
    log({
      accepted: false,
      step: "prompt-quality-gate",
      error: "Image prompt failed the quality gate and was not sent to OpenAI.",
      promptReview: promptRevisionLoop.finalReview,
      revisionHistory: promptRevisionLoop.history
    });
    process.exitCode = 2;
  } else {
    const prompt = String(promptRevisionLoop.finalArtifact.prompt || requestedPrompt).trim();

    log({
    step: "selected-slot",
    slotId: slot.id,
    lessonId: slot.lessonId,
    placement: slot.placement,
    title: slot.title,
    model: process.env.OPENAI_IMAGE_MODEL || "default"
  });

    const generated = await generateOpenAiImage({ prompt, state, env: process.env });
  if (!generated.accepted) {
    log({
      accepted: false,
      step: "openai-generation",
      error: generated.error,
      code: generated.code || "",
      model: generated.plan?.config?.model || process.env.OPENAI_IMAGE_MODEL || "",
      next: generated.code === "billing_hard_limit_reached" ? "Increase OpenAI billing limit or add credits, then rerun this command." : "Fix the OpenAI image generation blocker and rerun."
    });
      process.exitCode = 2;
  } else {
    let nextState = addGeneratedVisualAsset(state, {
      slot,
      prompt,
      b64Json: generated.b64Json,
      model: generated.model,
      outputFormat: generated.outputFormat,
      usage: generated.usage,
      estimatedCostCents: generated.plan?.estimatedCostCents || null,
      generationPlan: {
        ...(generated.plan || {}),
        promptReview: promptRevisionLoop.finalReview,
        revisionHistory: promptRevisionLoop.history
      },
      revisionAttempt: promptRevisionLoop.attempts,
      creatorId: "visual-learning-agent"
    }).state;
    const assetId = nextState.visualAssets[0].id;

    log({
      accepted: true,
      step: "openai-generation",
      assetId,
      model: generated.model,
      outputFormat: generated.outputFormat,
      estimatedCostCents: generated.plan?.estimatedCostCents || null
    });

    const storage = await uploadVisualAssetToSupabaseStorage({ asset: nextState.visualAssets[0], env: process.env });
    if (!storage.accepted) {
      log({
        accepted: false,
        step: "storage-promotion",
        assetId,
        error: storage.error,
        next: "The generated image was not persisted because storage rejected it. Fix storage config or bucket limits, then rerun."
      });
      nextState = {
        ...nextState,
        visualAssets: nextState.visualAssets.map((asset) =>
          asset.id === assetId
            ? {
                ...asset,
                assetUrl: "",
                storageStatus: "storage-failed",
                generationMetadata: {
                  ...(asset.generationMetadata || {}),
                  storageError: storage.error || "Storage promotion failed.",
                  rawImageDiscarded: true
                }
              }
            : asset
        )
      };
      process.exitCode = 3;
    } else {
      nextState = markVisualAssetStoragePromoted(nextState, assetId, storage).state;
      if (approve) {
        nextState = updateVisualAssetStatus(nextState, assetId, "approved");
      }
      const finalAsset = nextState.visualAssets.find((asset) => asset.id === assetId);
      let repositoryError = "";
      let restPersistence = null;
      let persistence = { accepted: false, mode: "none" };
      try {
        await repository.writeVisualWorkflow(nextState);
      } catch (error) {
        repositoryError = error.message || String(error);
      }

      if (hasSupabaseRestConfig()) {
        restPersistence = await persistVisualAssetViaRest(finalAsset);
      }

      if (restPersistence?.accepted && repositoryError) {
        persistence = {
          accepted: true,
          mode: "supabase-rest-fallback",
          repositoryError,
          restStatus: restPersistence.status || null
        };
      } else if (restPersistence?.accepted) {
        persistence = {
          accepted: true,
          mode: "repository+supabase-rest",
          restStatus: restPersistence.status || null
        };
      } else if (!repositoryError) {
        persistence = { accepted: true, mode: "repository" };
      } else {
        persistence = {
          accepted: false,
          mode: "persistence-failed",
          repositoryError,
          restError: restPersistence?.error || "Supabase REST persistence was not configured."
        };
        process.exitCode = 4;
      }
      log({
        accepted: persistence.accepted,
        step: "persisted-production-visual",
        assetId,
        status: finalAsset.status,
        storageStatus: finalAsset.storageStatus,
        storagePublicUrl: finalAsset.storagePublicUrl,
        reviewChecklistCount: finalAsset.reviewChecklist?.length || 0,
        persistence,
        next: persistence.accepted
          ? "The asset is stored in the review queue. Approve it in Manager Review before student-facing publication."
          : "The image was generated but not persisted. Fix the persistence errors and rerun the workflow."
      });
    }
    }
  }
}
