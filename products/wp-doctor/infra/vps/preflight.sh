#!/bin/sh
# Read-only inventory. No package installs, container changes, or secret output.
set -eu
printf '\nSystem\n'
uname -srmo
printf '\nCurrent user\n'
id
printf '\nMemory\n'
free -m
printf '\nCPU and load\n'
getconf _NPROCESSORS_ONLN
uptime
printf '\nDisk space\n'
df -h / /var/lib/docker 2>/dev/null || df -h /
printf '\nNode\n'
if command -v node >/dev/null 2>&1; then node --version; else printf 'Node unavailable\n'; fi
printf '\nDocker\n'
if command -v docker >/dev/null 2>&1; then
  docker version --format 'Client {{.Client.Version}} / Server {{.Server.Version}}' || true
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' || true
  docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.PIDs}}' || true
  docker network ls --format 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}' || true
else
  printf 'Docker unavailable\n'
fi
printf '\nRelevant listening ports\n'
if command -v ss >/dev/null 2>&1; then
  ss -lnt | awk 'NR==1 || $4 ~ /:(80|443|5678|8091)$/'
fi
printf '\nProxy service availability\n'
if command -v systemctl >/dev/null 2>&1; then
  for service in docker caddy nginx traefik; do
    printf '%s: ' "$service"
    systemctl is-active "$service" || true
  done
fi
