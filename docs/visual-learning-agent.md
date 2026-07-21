# Visual Learning Agent

The Visual Learning Agent audits the project for places where images, diagrams, or tutor visuals would improve understanding. It currently scans pilot lessons and unlinked content drafts.

## What It Looks For

- Lesson hero images that anchor the core concept.
- Teaching diagrams that show see, build, explain, and retrieve moves.
- Tutor visuals that can appear during reteach or confusion analysis.
- Misconception repair diagrams that compare a common mistake with the corrected model.
- Group homework workflow diagrams for Bridge and Scholar lessons.
- Draft lesson visuals that need review before publication.

## Prompt Rules

Every generated prompt includes:

- Grade, subject, lesson title, and learning objective.
- Placement in the app, such as lesson hero, teaching diagram, tutor, or misconception repair.
- What the image must show.
- What the learner should do after viewing it.
- Grade-band visual style.
- Safety and accessibility constraints.

Prompts must avoid real children, private data, branded or copyrighted characters, unreadable text, scary imagery, and visual clutter.

## OpenAI API Path

The browser never receives the API key. Image generation runs through the local server endpoint:

```txt
POST /api/visual-agent/generate
```

The server reads:

```txt
OPENAI_API_KEY
OPENAI_IMAGE_MODEL   optional, defaults to gpt-image-2
OPENAI_IMAGE_SIZE    optional, defaults to 1024x1024
OPENAI_IMAGE_QUALITY optional, defaults to medium
OPENAI_IMAGE_FORMAT  optional, defaults to png
```

Generated images are stored as review-only visual assets:

- `assetKind: openai-generated-image`
- `status: review`
- `license: openai-generated-review-required`
- source prompt and checklist preserved

They do not become student-facing assets until a human approves them in the visual asset review workflow.

## Next Build Step

Add budget controls before bulk generation:

- per-run image count limit
- estimated cost display
- parent/admin permission check
- batch approval queue
- image quality rubric before publication
