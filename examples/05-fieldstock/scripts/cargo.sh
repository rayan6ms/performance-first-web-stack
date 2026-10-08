#!/bin/sh
set -eu
cd "$(dirname "$0")/../api"
# Optional scoped workaround for a broken host rustup proxy; never changes the host.
if [ -n "${FIELDSTOCK_RUST_BIN:-}" ]; then
  export PATH="$FIELDSTOCK_RUST_BIN:$PATH"
  export RUSTC="$FIELDSTOCK_RUST_BIN/rustc"
  export RUSTDOC="$FIELDSTOCK_RUST_BIN/rustdoc"
  exec "$FIELDSTOCK_RUST_BIN/cargo" "$@"
fi
exec cargo "$@"
