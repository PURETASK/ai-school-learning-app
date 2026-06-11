# Repo Setup Commands

## Recommended Fresh Setup

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Then copy this foundation archive into the repo root, preserving folders.

## Install Validation Helpers Later If Needed

The included validator uses Node built-ins. No extra package is required for the `.mjs` validator.

For TypeScript script execution later:

```bash
npm install -D tsx
```

## Useful Scripts To Add To `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "validate:lessons": "node scripts/validate-lessons.mjs"
  }
}
```

## First Check

```bash
node scripts/validate-lessons.mjs
npm run dev
```
