# Configuration changelog

Auto-appended by the pre-commit git hook
([.githooks/pre-commit](../.githooks/pre-commit) → [scripts/log-config-changes.mjs](../scripts/log-config-changes.mjs))
whenever a commit touches a workspace, build, CI or hosting config file.
Application source and design docs are not logged — commit history covers
them. Patterns the script considers "config" live in the script itself.

Newest entries are appended at the bottom. To re-run manually for a preview:
`yarn log:config` (dry-run). To force-skip the hook for a single commit:
`git commit --no-verify`.

---

### 2026-05-29 23:44
- `.githooks/pre-commit`
- `package.json`
