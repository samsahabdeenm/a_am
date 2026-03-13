#!/usr/bin/env bash
set -euo pipefail

TARGET_BRANCH="${1:-main}"
MERGE_METHOD="${2:-squash}"
CURRENT_BRANCH="$(git branch --show-current)"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed. Install it first: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Unable to detect current branch." >&2
  exit 1
fi

if [[ "$CURRENT_BRANCH" == "$TARGET_BRANCH" ]]; then
  echo "You are already on '$TARGET_BRANCH'. Create/switch to a feature branch first." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit/stash before running this script." >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' is not configured." >&2
  exit 1
fi

echo "[1/4] Pushing current branch '$CURRENT_BRANCH'..."
git push -u origin "$CURRENT_BRANCH"

echo "[2/4] Creating PR '$CURRENT_BRANCH' -> '$TARGET_BRANCH'..."
PR_URL="$(gh pr create --base "$TARGET_BRANCH" --head "$CURRENT_BRANCH" --fill --json url --jq '.url')"

echo "[3/4] Enabling auto-merge with '$MERGE_METHOD' and deleting branch after merge..."
case "$MERGE_METHOD" in
  squash) gh pr merge "$PR_URL" --auto --squash --delete-branch ;;
  rebase) gh pr merge "$PR_URL" --auto --rebase --delete-branch ;;
  merge) gh pr merge "$PR_URL" --auto --merge --delete-branch ;;
  *)
    echo "Invalid merge method: '$MERGE_METHOD'. Use one of: squash | rebase | merge" >&2
    exit 1
    ;;
esac

echo "[4/4] Done. PR created and set to auto-merge: $PR_URL"
