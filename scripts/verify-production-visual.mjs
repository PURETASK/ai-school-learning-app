import { resolve } from "node:path";
import { loadEnvFile } from "../src/env.js";

function argValue(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || "";
}

loadEnvFile({ root: resolve(process.cwd()) });

const assetId = argValue("asset").trim();
const baseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const secretKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (!assetId) throw new Error("Usage: npm run visual:verify -- --asset=<asset-id>");
if (!baseUrl || !secretKey) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required.");

const response = await fetch(
  `${baseUrl}/rest/v1/visual_assets?select=id,status,storage_status,storage_public_url,review_version&id=eq.${encodeURIComponent(assetId)}`,
  { headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` } }
);
if (!response.ok) throw new Error(`Supabase visual asset query failed with HTTP ${response.status}.`);

const rows = await response.json();
const asset = rows[0];
if (!asset) throw new Error(`No visual asset found for ${assetId}.`);
if (asset.status !== "approved") throw new Error(`Visual asset ${assetId} is not approved.`);
if (!asset.storage_public_url) throw new Error(`Visual asset ${assetId} has no public storage URL.`);

const objectResponse = await fetch(asset.storage_public_url, { method: "HEAD" });
if (!objectResponse.ok) throw new Error(`Stored visual object returned HTTP ${objectResponse.status}.`);

console.log(JSON.stringify({
  accepted: true,
  assetId: asset.id,
  status: asset.status,
  storageStatus: asset.storage_status || "",
  reviewVersion: Number(asset.review_version || 0),
  publicObjectStatus: objectResponse.status,
  contentType: objectResponse.headers.get("content-type") || ""
}, null, 2));
