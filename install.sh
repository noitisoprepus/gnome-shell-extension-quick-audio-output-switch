#!/bin/sh
set -eu

cd "$(dirname "$0")"
uuid=quick-audio-output-switch@noitisoprepus.github.io
build_dir=$(mktemp -d)
trap 'rm -rf -- "$build_dir"' EXIT

# Pack the shared module with the usual GNOME extension files
gnome-extensions pack "$uuid" --extra-source=audio.js --out-dir="$build_dir"
gnome-extensions install --force "$build_dir/$uuid.shell-extension.zip"
printf 'Installed %s. Log out and back in, then enable it in Extensions.\n' "$uuid"
