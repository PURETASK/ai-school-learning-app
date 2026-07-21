import { loadEnvFile } from "../src/env.js";
import { setupVisualAssetStorageBucket } from "../src/visualAssetStorageService.js";

loadEnvFile();

const args = new Set(process.argv.slice(2));
const createIfMissing = args.has("--create") || process.env.VISUAL_ASSET_STORAGE_AUTO_CREATE === "true";

const result = await setupVisualAssetStorageBucket({
  env: process.env,
  createIfMissing
});

console.log(
  JSON.stringify(
    {
      ...result,
      next: result.ready
        ? "Visual asset storage is ready. Generate an image, promote it to storage, then approve it in Admin > Visuals."
        : createIfMissing
          ? "Check SUPABASE_URL, SUPABASE_SECRET_KEY, and storage permissions, then retry npm run storage:setup -- --create."
          : "Create the bucket in Supabase Storage or rerun with npm run storage:setup -- --create."
    },
    null,
    2
  )
);

if (!result.ready) process.exitCode = 1;
