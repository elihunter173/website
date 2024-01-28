#!/usr/bin/env bash

set -ex

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"
REPO_DIR="$(git rev-parse --show-toplevel)"

ASTEROIDS="$(mktemp -d -t asteroids-3d.XXX)"
echo "Building asteroids-3d [directory=$ASTEROIDS]"
git clone https://github.com/elihunter173/asteroids-3d.git "$ASTEROIDS"
cd "$ASTEROIDS"
npm install --production
npm run build
cp -r ./dist "$REPO_DIR/static/asteroids"

CITY_GAME="$(mktemp -d -t city-game.XXX)"
echo "Building city-game [directory=$CITY_GAME]"
eval `ssh-agent -s`
ssh-add - <<< "$CITY_GAME_PRIVATE_DEPLOY_KEY"
git clone git@github.com:elihunter173/city-game.git "$CITY_GAME"
cd "$CITY_GAME"
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --no-typescript --target web \
    --out-dir ./out/ \
    --out-name "game" \
    ./target/wasm32-unknown-unknown/web/game.wasm
cat << EOF > ./out/index.html
<!doctype html>
<html lang="en">
<body style="margin: 0px;">
  <script type="module">
    import init from './game.js'
    init().catch((error) => {
      if (!error.message.startsWith("Using exceptions for control flow, don't mind me. This isn't actually an error!")) {
        throw error;
      }
    });
  </script>
</body>
</html>
EOF
cp -r ./assets ./out/.
cp -r ./out "$REPO_DIR/static/the-merp-experiment"
