# Visual Asset Production Pipeline

This pipeline turns lesson visual needs into reviewed production assets.

Production visuals must also follow the self-grading loop in [Self-Grading, Critic, And Revision Rubric](self-grading-review-rubric.md). Image prompts should score `90+` before generation, and generated images should score `90+`, be storage-backed, and have no critical blockers before approval.

## Required Environment

Server-only values:

```txt
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your-server-only-supabase-secret-key
VISUAL_ASSET_STORAGE_BUCKET=k12-visual-assets
OPENAI_API_KEY=your-server-only-openai-api-key
OPENAI_IMAGE_ENABLED=true
OPENAI_IMAGE_DAILY_LIMIT=12
OPENAI_IMAGE_MAX_COST_CENTS=25
```

Browser-safe values:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Do not put server-only keys in browser code.

## Setup

1. Apply the schema:

```powershell
npm run db:apply
npm run db:verify
```

2. Create or verify the Storage bucket:

```powershell
npm run storage:setup -- --create
```

3. Generate one real production visual, promote it to Storage, and approve it:

```powershell
npm run visual:generate-one
```

Optional controls:

```powershell
npm run visual:generate-one -- --slot=g3-fractions-number-line-lesson-hero-core
npm run visual:generate-one -- --no-approve
```

The default bucket is `k12-visual-assets`. Approved generated images are stored under:

```txt
lessons/<lesson-id>/<asset-id>.<format>
```

The bucket should allow at least 15 MB per file because generated PNG/WebP outputs can be larger than 5 MB.

## Staff Workflow

1. Open the Visuals/Admin area.
2. Pick a recommended visual slot from the Visual Learning Agent.
3. Generate an image with OpenAI.
4. The image enters the review queue as `openai-generated-image` with `pending-storage`.
5. Staff reviews prompt, caption, alt text, license, and checklist.
6. Click `Promote to storage`.
7. The server uploads the data image to Supabase Storage and records `storage_public_url`.
8. Staff approves or rejects the visual.
9. Student-facing lessons should only use approved assets with either:
   - generated SVG fallback, or
   - storage-backed public URL.

The Visuals screen also exposes the master backlog state for every audited slot. Each slot is reported as `missing`, `review`, `rejected`, `approved-pending-storage`, or `approved`. The generation queue prioritizes incomplete slots, while the manager status panel keeps the full high-priority lesson and tutor queue visible. This prevents the documented visual plan from becoming a disconnected checklist.

## Review Gate

Every generated visual must keep:

- source prompt
- source model
- usage metadata
- review checklist
- caption
- alt text
- license
- credit
- storage provider/status
- approval status

Students should never directly trigger OpenAI image generation or storage writes.

## Billing And Provider Blockers

If OpenAI returns `billing_hard_limit_reached`, the app is working but the OpenAI project cannot create paid images. Increase the OpenAI billing limit or add credits, then rerun:

```powershell
npm run visual:generate-one
```

If the Postgres snapshot write closes the connection after Storage succeeds, the script falls back to Supabase REST and upserts the approved row directly into `visual_assets`.

## Current Limitations

- Bucket policies are managed in Supabase. Keep the bucket public only for reviewed lesson images.
- The app stores generated image metadata and public URLs, not unrestricted upload credentials.
- Full K-12 image production still needs batch generation, review staffing, and age-band art direction.
