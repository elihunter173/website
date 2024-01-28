#!/usr/bin/env bash

set -ex

HERE="$(dirname "${BASH_SOURCE[0]}")"
cd "$HERE"
REPO_DIR="$(git rev-parse --show-toplevel)"

subproject() {
    proj="$1"
    dir="$(mktemp -d -t "$proj".XXX)"
    echo "Building subproject [directory=$dir]"
    git clone "https://github.com/elihunter173/$proj.git" "$dir"
    cd "$dir"
}

subproject asteroids-3d
npm install --production
npm run build
cp -r ./dist "$REPO_DIR/static/asteroids"

eval `ssh-agent -s`
ssh-add - <<< '${{ secrets.CITY_GAME_PRIVATE_DEPLOY_KEY }}'
subproject city-game
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
