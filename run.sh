#!/usr/bin/env bash
# =============================================================
# run.sh — khởi động toàn bộ web (Backend .NET + Frontend Next.js)
#   ./run.sh               -> chạy cả backend (5161) + frontend (3000)
#   ./run.sh be            -> chỉ backend
#   ./run.sh fe            -> chỉ frontend
#   Ctrl+C                 -> tắt tất cả process đang chạy
# =============================================================
set -euo pipefail

cd "$(dirname "$0")"

BACKEND_DIR="RogAdmin/src/RogAdmin.Api"
FRONTEND_DIR="frontend"
LOG_DIR=".run"
mkdir -p "$LOG_DIR"

BE_PORT=5161
FE_PORT=3000

# -------- kiểm tra môi trường --------
command -v dotnet >/dev/null || { echo "❌ Chưa cài dotnet SDK"; exit 1; }
command -v node   >/dev/null || { echo "❌ Chưa cài Node.js"; exit 1; }

# -------- tiện ích: kiểm tra port đang bị chiếm --------
check_port() {
  local port="$1" label="$2"
  if ss -ltn 2>/dev/null | grep -q ":${port} "; then
    echo "⚠️  Port ${port} (${label}) đang được sử dụng — proceso cũ có thể vẫn chạy. Port mới sẽ được Next/Dotnet gán lại nếu trùng."
  fi
}

# -------- chuẩn bị frontend (node_modules) --------
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "📦 node_modules chưa có — đang npm install frontend..."
  (cd "$FRONTEND_DIR" && npm install --no-audit --no-fund)
fi

# -------- hàm dọn dẹp khi Ctrl+C --------
PIDS=()
cleanup() {
  echo ""
  echo "🛑 Đang dừng toàn bộ services..."
  for pid in "${PIDS[@]:-}"; do
    [ -n "${pid:-}" ] && kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  echo "✅ Đã tắt hết."
  exit 0
}
trap cleanup INT TERM

MODE="${1:-all}"

# -------- Backend (RogAdmin .NET API :5161) --------
start_backend() {
  check_port "$BE_PORT" "backend"
  echo "🚀 Backend  -> http://localhost:${BE_PORT} (Swagger: /swagger) | log: ${LOG_DIR}/be.log"
  (cd "$BACKEND_DIR" && ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS="http://localhost:${BE_PORT}" dotnet run --no-launch-profile) \
    > "${LOG_DIR}/be.log" 2>&1 &
  PIDS+=($!)
}

# -------- Frontend (Next.js :3000) --------
start_frontend() {
  check_port "$FE_PORT" "frontend"
  echo "🚀 Frontend -> http://localhost:${FE_PORT} | log: ${LOG_DIR}/fe.log"
  (cd "$FRONTEND_DIR" && npx next dev -p "${FE_PORT}") \
    > "${LOG_DIR}/fe.log" 2>&1 &
  PIDS+=($!)
}

echo "=============================================="
echo "  APSX — khởi động web"
echo "=============================================="

case "$MODE" in
  all) start_backend; start_frontend ;;
  be)  start_backend ;;
  fe)  start_frontend ;;
  stop)
    echo "🛑 Tắt mọi process apsx đang chạy..."
    pkill -f "RogAdmin.Api" 2>/dev/null || true
    pkill -f "next dev"    2>/dev/null || true
    echo "✅ Xong."
    exit 0
    ;;
  *)
    echo "Dùng: ./run.sh [all|be|fe|stop]"
    exit 1
    ;;
esac

# -------- kiểm tra các service sống --------
sleep 6
if [ "$MODE" != "fe" ]; then
  curl -sf "http://localhost:${BE_PORT}/swagger/index.html" >/dev/null 2>&1 \
    && echo "✅ Backend OK  -> http://localhost:${BE_PORT}" \
    || echo "⏳ Backend chưa phản hồi (đang build lần đầu có thể lâu) — xem ${LOG_DIR}/be.log"
fi
if [ "$MODE" != "be" ]; then
  curl -sf "http://localhost:${FE_PORT}" >/dev/null 2>&1 \
    && echo "✅ Frontend OK -> http://localhost:${FE_PORT}" \
    || echo "⏳ Frontend chưa phản hồi — xem ${LOG_DIR}/fe.log"
fi

echo ""
echo "Nhấn Ctrl+C để tắt mọi services, hoặc chạy \"./run.sh stop\" từ terminal khác."
wait
