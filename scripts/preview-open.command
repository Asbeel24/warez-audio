#!/bin/bash
# Double-click (or run in Terminal) to browse the site preview at http://localhost:4173
cd "$(dirname "$0")"
( sleep 1; open "http://localhost:4173" ) &
if command -v python3 >/dev/null 2>&1; then
  python3 .preview-server.py 4173
else
  npx --yes serve -l 4173 .
fi
