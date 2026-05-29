#!/usr/bin/env node
/**
 * Scan staged files for configuration changes and append an entry to
 * docs/CONFIG-LOG.md. Stages the updated log so it lands in the same commit.
 *
 * Invoked by the pre-commit hook (.githooks/pre-commit). Also runnable as
 * `yarn log:config` for ad-hoc previews — without --commit it just prints
 * what would be logged.
 *
 * "Config" here means workspace/build/CI/hosting files that affect how the
 * project is wired up. Application source and design docs are NOT logged —
 * commit history covers those.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const COMMIT_MODE = process.argv.includes('--commit');

const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
process.chdir(root);

// Patterns matched against basename (loose, anywhere in tree)
const BASENAME_PATTERNS = [
  /^package\.json$/,
  /^yarn\.lock$/,
  /^tsconfig.*\.json$/,
  /^vite\.config\.[mc]?[jt]s$/,
  /^tailwind\.config\.[mc]?[jt]s$/,
  /^postcss\.config\.[mc]?[jt]s$/,
  /^sanity\.config\.[mc]?[jt]s$/,
  /^sanity\.cli\.[mc]?[jt]s$/,
  /^deskStructure\.[mc]?[jt]s$/,
  /^\.gitignore$/,
  /^\.nvmrc$/,
  /^\.env\.example$/,
  /^\.editorconfig$/,
  /^netlify\.toml$/,
  /^vercel\.json$/,
];

// Patterns matched against full path
const PATH_PATTERNS = [
  /^\.github\/workflows\//,
  /^\.githooks\//,
];

function isConfig(path) {
  return (
    BASENAME_PATTERNS.some((p) => p.test(basename(path))) ||
    PATH_PATTERNS.some((p) => p.test(path))
  );
}

function stagedFiles() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
  });
  return out.split('\n').filter(Boolean);
}

function readSubject() {
  // commit-msg hook would give us argv[1]; pre-commit doesn't have the message
  // yet. Fall back to whatever's already in COMMIT_EDITMSG (e.g. -m flag,
  // merge templates) — otherwise leave blank.
  const path = resolve(root, '.git/COMMIT_EDITMSG');
  if (!existsSync(path)) return '';
  const first = readFileSync(path, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#'));
  return first ?? '';
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const HEADER = `# Configuration changelog

Auto-appended by the pre-commit git hook
([.githooks/pre-commit](../.githooks/pre-commit) → [scripts/log-config-changes.mjs](../scripts/log-config-changes.mjs))
whenever a commit touches a workspace, build, CI or hosting config file.
Application source and design docs are not logged — commit history covers
them. Patterns the script considers "config" live in the script itself.

Newest entries are appended at the bottom. To re-run manually for a preview:
\`yarn log:config\` (dry-run). To force-skip the hook for a single commit:
\`git commit --no-verify\`.

---
`;

function ensureLog(path) {
  if (existsSync(path)) return;
  writeFileSync(path, HEADER);
}

function appendEntry(path, ts, subject, files) {
  const subjectLine = subject ? ` · ${subject}` : '';
  const block = `\n### ${ts}${subjectLine}\n${files.map((f) => `- \`${f}\``).join('\n')}\n`;
  appendFileSync(path, block);
}

const files = stagedFiles().filter(isConfig);

if (files.length === 0) {
  if (!COMMIT_MODE) console.log('No config changes staged.');
  process.exit(0);
}

const logPath = resolve(root, 'docs/CONFIG-LOG.md');

if (!COMMIT_MODE) {
  console.log(`Would log ${files.length} config file(s) to docs/CONFIG-LOG.md:`);
  for (const f of files) console.log(`  - ${f}`);
  console.log('\n(dry-run — pass --commit, or use the pre-commit hook, to write)');
  process.exit(0);
}

ensureLog(logPath);
appendEntry(logPath, timestamp(), readSubject(), files);
execSync(`git add "${logPath}"`);
console.log(`✓ Appended ${files.length} config change(s) to docs/CONFIG-LOG.md`);
