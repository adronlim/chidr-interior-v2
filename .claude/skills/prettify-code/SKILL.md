---
name: prettify-code
description: Check and prettify the source code of the chidr-interior-v2 repo using Prettier (the standard formatter for this Vite/React/TS/Tailwind + Sanity stack). Use when the user asks to prettify, format, beautify, clean up, lint, or auto-style the code, fix indentation/quotes/spacing, sort Tailwind classes, or make formatting consistent across apps/web, apps/studio, scripts, and docs. Defaults to formatting only changed files for cost-efficiency.
---

# Prettify Code

## Overview

This repo (`chidr-interior-v2`, Yarn 1 workspaces) has **no formatter configured yet** — no
`.prettierrc`, no ESLint config. This skill **checks and prettifies** the codebase with
**Prettier**, the de-facto standard auto-formatter for TypeScript, React, JSON, and Markdown.
It bootstraps Prettier on first run, formats consistently without breaking the build, and
verifies the result.

The guiding principle is **cost-effectiveness**: do the least work that achieves a clean,
consistent result. Formatting is mechanical and high-volume, so scope tightly, prefer cheap
local commands over reasoning, and never re-process files that are already clean.

## When to use

Trigger when the user asks to:
- "prettify", "format", "beautify", "clean up", "lint", or "auto-style" the code
- fix inconsistent indentation, quotes, semicolons, trailing commas, or spacing
- sort/organize Tailwind class names
- make formatting consistent across the repo or a workspace

Do **not** use this for logic changes, refactors, or renaming — only mechanical formatting.

## Cost-effectiveness rules (read first)

These keep token/compute cost low. Follow them unless the user explicitly asks for a
full-repo pass.

1. **Default to changed files only.** Most of the time the user wants their recent work
   tidied, not the whole tree reformatted. Scope to what git reports as changed:

   ```bash
   git diff --name-only HEAD --diff-filter=ACMR \
     -- 'apps/**' 'scripts/**' 'docs/**' '*.json' '*.md' \
     | grep -Ev 'dist/|node_modules/|yarn.lock' || true
   ```

   Pass that file list to Prettier. If nothing changed, say so and stop — don't format the
   whole repo "just in case".

2. **Let Prettier find the work, not you.** Prettier's own `--check`/`--write` globbing and
   its cache are far cheaper than reading files into context. **Never** read source files
   into context to hand-edit formatting — that's the slow, expensive path Prettier exists to
   replace.

3. **Use Prettier's cache.** Always pass `--cache`. On repeat runs it skips unchanged files,
   so a second invocation is nearly free.

4. **Don't spawn subagents for this.** Formatting is a deterministic shell task; orchestration
   overhead isn't worth it.

5. **Full-repo only on request.** Offer it as an option ("want me to format the whole repo?")
   but don't do it by default.

## Hard constraints (from CLAUDE.md)

- `yarn build` (tsc + vite) must stay green. **Never** let formatting change behavior.
- Only touch source: `apps/web/src/`, `apps/studio/{schemas,scripts}/`, `scripts/`, `docs/*.md`.
- **Never** format generated/gitignored output: `dist/`, `docs/dist/`, `node_modules/`,
  `yarn.lock`, `apps/*/.env*`.
- Filenames stay kebab-case; do not rename anything.
- `docs/PHASES.md` is append-only — it's excluded in `.prettierignore`; leave it alone.

## Step 1: Bootstrap Prettier (first run only)

Check whether Prettier is already set up:

```bash
ls .prettierrc* prettier.config.* 2>/dev/null
```

If absent, install it once at the repo root (Yarn 1 workspaces — root `-W` flag) with the
Tailwind class-sorting plugin, since `apps/web` uses Tailwind:

```bash
yarn add -W -D prettier prettier-plugin-tailwindcss
```

Then create the config and ignore files (templates in this skill's `resources/`):

- Copy `resources/prettierrc.json` → repo-root `.prettierrc.json`
- Copy `resources/prettierignore` → repo-root `.prettierignore`

Add convenience scripts to the **root** `package.json` if not present, so future runs (and CI)
don't need to rediscover the commands:

```json
"format": "prettier --write --cache .",
"format:check": "prettier --check --cache ."
```

After bootstrap, the *first* format legitimately touches the whole repo (nothing was formatted
before). Tell the user this and confirm before the wide write.

## Step 2: Check before writing

Always show what's wrong before changing anything — cheap, and it tells the user (and you) the
scope. Use the changed-file list from the cost rules, or `.` for a full pass:

```bash
# Changed files (default):
yarn prettier --check --cache <files-from-git-diff>

# Or full repo (on request / right after bootstrap):
yarn prettier --check --cache .
```

`--check` lists files that aren't formatted without altering them. If the list is empty, the
code is already clean — report that and stop.

## Step 3: Prettify

```bash
yarn prettier --write --cache <files-or-.>
```

Scoped examples:

```bash
yarn prettier --write --cache "apps/web/src/**/*.{ts,tsx,css}"
yarn prettier --write --cache "docs/**/*.md"
```

## Step 4: Verify the related code still checks out

"Fully checking" means confirming the formatted code is still valid — Prettier is
non-semantic, but a sanity pass catches surprises and any pre-existing breakage in the
touched area. Run the cheapest sufficient check:

```bash
yarn typecheck          # tsc -b on the web workspace — fast, catches real breakage
```

Run the full build **only** if the user asks for a release-grade guarantee or typecheck
surfaces something ambiguous (it's slower / more costly):

```bash
yarn build
```

If a check fails, inspect `git diff --stat` to confirm the failure isn't from formatting
(it almost never is) and report it as pre-existing. **Do not** rewrite logic to make a check
pass — that's outside this skill's scope.

## Step 5: Summarize

Report concisely:
- which files were reformatted (`git diff --stat`)
- that changes are formatting-only (non-semantic)
- the result of the verification step (typecheck/build status)

Do **not** commit unless the user asks.

## Notes

- Keep `resources/prettierrc.json` minimal — Prettier's defaults are intentionally opinionated;
  only deviate where the repo already does (2-space indent, single quotes).
- The Tailwind plugin reorders `className` strings to canonical order — purely cosmetic, safe.
- This skill does not run ESLint (not configured in this repo). If the user wants lint
  autofixes (unused imports, etc.), flag it as separate work.
