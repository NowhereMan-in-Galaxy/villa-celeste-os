#!/usr/bin/env bash
set -euo pipefail

echo "============================================================"
echo "🔒 Villa Celeste OS '98 — Prepare Repository for Public Release"
echo "============================================================"

if [ ! -d ".git" ]; then
  echo "Error: Must be run from the root of the repository."
  exit 1
fi

echo "1. Removing raw/extracted textbook source folder (textbooks/)..."
rm -rf textbooks/

echo "2. Creating a clean orphan branch without textbook source history..."
git checkout --orphan public-clean-temp
git add -A
git commit -m "feat: initial public release of Villa Celeste OS '98"

echo "3. Replacing main branch with clean history..."
git branch -D main
git branch -m main

echo ""
echo "✅ Clean history created locally!"
echo "To push to GitHub and make the repo public:"
echo "  1. Run: git push -f origin main"
echo "  2. Run: gh repo edit --visibility public --accept-visibility-change-consequences"
echo "     (or change visibility in GitHub Repository Settings -> Danger Zone)"
