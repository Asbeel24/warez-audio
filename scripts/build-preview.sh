#!/usr/bin/env bash
# Builds a static copy of the site (no server, API routes left out) into preview/,
# for browsing locally with any static file server.
set -euo pipefail
cd "$(dirname "$0")/.."
mv app/api .api-off
trap 'mv .api-off app/api' EXIT
rm -rf .next-preview
NEXT_PUBLIC_STATIC_PREVIEW=1 npx next build
rm -rf preview && mv .next-preview preview
cp scripts/preview-open.command preview/打开预览.command
chmod +x preview/打开预览.command
cp scripts/preview-server.py preview/.preview-server.py
echo "preview/ ready"
