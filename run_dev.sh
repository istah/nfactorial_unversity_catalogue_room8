#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ ! -d ".venv" ]; then
  echo "[run_dev] Missing .venv. Create it via 'python -m venv .venv' and install deps." >&2
  exit 1
fi

source .venv/bin/activate
export PYTHONPATH="$ROOT_DIR/backend"

is_port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
  else
    nc -z localhost "$port" >/dev/null 2>&1
  fi
}

pick_port() {
  local preferred="$1"
  local port="$preferred"

  for _ in {1..10}; do
    if ! is_port_in_use "$port"; then
      echo "$port"
      return
    fi
    port=$((port + 1))
  done

  echo "[run_dev] Could not find a free port starting from $preferred" >&2
  exit 1
}

BACKEND_PORT="$(pick_port "${BACKEND_PORT:-8000}")"
FRONTEND_PORT="$(pick_port "${FRONTEND_PORT:-3000}")"

start_backend() {
  echo "[run_dev] Starting backend on http://127.0.0.1:${BACKEND_PORT}"
  uvicorn app.main:create_app \
    --factory \
    --app-dir backend/app \
    --host 127.0.0.1 \
    --port "$BACKEND_PORT"
}

start_frontend() {
  cd "$ROOT_DIR/frontend"
  if [ ! -d node_modules ]; then
    echo "[run_dev] Installing frontend dependencies..."
    npm install
  fi
  echo "[run_dev] Starting frontend on http://localhost:${FRONTEND_PORT}"
  npm run dev -- --port "$FRONTEND_PORT"
}

cleanup() {
  echo "[run_dev] Shutting down..."
  jobs -p | xargs -r kill
}

trap cleanup EXIT

start_backend &
BACKEND_PID=$!

start_frontend &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
