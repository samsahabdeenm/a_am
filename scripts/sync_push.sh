#!/usr/bin/env bash
set -euo pipefail

REMOTE="${1:-origin}"
TARGET_BRANCH="${2:-main}"
CURRENT_BRANCH="$(git branch --show-current)"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository." >&2
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' is not configured."
  echo "Example: git remote add $REMOTE <repo-url>"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit/stash before sync-push."
  exit 1
fi

echo "[1/4] Fetching $REMOTE..."
git fetch "$REMOTE"

echo "[2/4] Rebasing $CURRENT_BRANCH on $REMOTE/$TARGET_BRANCH..."
git rebase "$REMOTE/$TARGET_BRANCH"

echo "[3/4] Pushing $CURRENT_BRANCH -> $REMOTE/$TARGET_BRANCH..."
git push "$REMOTE" "$CURRENT_BRANCH:$TARGET_BRANCH"

echo "[4/4] Done. Push completed without manual conflict flow."
