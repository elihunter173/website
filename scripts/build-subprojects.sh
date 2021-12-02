#!/usr/bin/env bash

set -e

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"
REPO_DIR="$(git rev-parse --show-toplevel)"

ASTEROIDS="$(mktemp -d -t asteroids-3d.XXX)"
echo "Building subproject [directory=$ASTEROIDS]"
git clone https://github.com/elihunter173/asteroids-3d.git "$ASTEROIDS"
cd "$ASTEROIDS"
npm install --production
npm run build
cp -r "$ASTEROIDS/dist" "$REPO_DIR/static/asteroids"
