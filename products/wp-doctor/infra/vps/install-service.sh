#!/bin/sh
# Target inspected: srv1162733 / 72.61.71.5. Additive deployment only.
set -eu
umask 077
cd /opt/wpdoctor-runner
test -s reports/isolated-runner/local.latest.json
test -s reports/isolated-runner/controller.latest.json
node/bin/node --input-type=module -e "import fs from 'node:fs';for(const p of ['local.latest.json','controller.latest.json']){if(!JSON.parse(fs.readFileSync('reports/isolated-runner/'+p)).passed)process.exit(1)}"
if ! id wpdoctor-runner >/dev/null 2>&1; then
  useradd --system --user-group --no-create-home --shell /usr/sbin/nologin wpdoctor-runner
fi
usermod -a -G docker wpdoctor-runner
cp .cache/isolated-vps/controller.mjs controller.mjs
chmod 755 /opt/wpdoctor-runner /opt/wpdoctor-runner/node
chmod 644 controller.mjs infra/vps/nginx.conf infra/vps/compose.yml
if [ ! -s /etc/wpdoctor-runner.env ]; then
  printf 'RUNNER_API_SECRET=%s\nRUNNER_IMAGE=wpdoctor-isolated:local\nPORT=8091\nRUNNER_LISTEN_HOST=172.17.0.1\nRUNNER_RELEASE_APPROVED=true\n' "$(openssl rand -hex 32)" > /etc/wpdoctor-runner.env
fi
chmod 600 /etc/wpdoctor-runner.env
cp infra/vps/wpdoctor-runner.service /etc/systemd/system/wpdoctor-runner.service
chmod 644 /etc/systemd/system/wpdoctor-runner.service
systemctl daemon-reload
if ! docker network inspect wpdoctor_proxy >/dev/null 2>&1; then
  docker network create --internal --label wpdoctor.infrastructure=proxy wpdoctor_proxy
fi
test "$(docker network inspect wpdoctor_proxy --format '{{index .Labels "wpdoctor.infrastructure"}}')" = proxy
gateway=$(docker network inspect wpdoctor_proxy --format '{{(index .IPAM.Config 0).Gateway}}')
sed -i "s/^RUNNER_LISTEN_HOST=.*/RUNNER_LISTEN_HOST=$gateway/" /etc/wpdoctor-runner.env
printf 'WPDOCTOR_PROXY_GATEWAY=%s\n' "$gateway" > infra/vps/proxy.env
systemctl enable wpdoctor-runner
systemctl restart wpdoctor-runner
systemctl is-active wpdoctor-runner
if ! docker inspect n8n-traefik-1 --format '{{json .NetworkSettings.Networks}}' | grep -q '"wpdoctor_proxy"'; then
  docker network connect wpdoctor_proxy n8n-traefik-1
fi
docker compose --env-file infra/vps/proxy.env -p wpdoctor-runner -f infra/vps/compose.yml up -d
docker ps --format '{{.Names}} {{.Status}}'
