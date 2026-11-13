#!/bin/sh
# Run only after inspecting the named host. Does not alter existing n8n services.
set -eu
umask 077
cd /opt/wpdoctor-runner
if [ ! -x node/bin/node ]; then
  mkdir -p node
  curl -fsS --connect-timeout 15 --max-time 60 https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o node-SHASUMS256.txt
  archive=$(awk '$2 ~ /^node-v24\.[0-9]+\.[0-9]+-linux-x64\.tar\.xz$/ { print $2 }' node-SHASUMS256.txt)
  test -n "$archive"
  curl -fsS --connect-timeout 15 --max-time 180 "https://nodejs.org/dist/latest-v24.x/$archive" -o "$archive"
  grep " $archive\$" node-SHASUMS256.txt | sha256sum -c -
  tar -xJf "$archive" --strip-components=1 -C node
fi
node/bin/node --version
docker build -t wpdoctor-isolated:local .cache/isolated-container
