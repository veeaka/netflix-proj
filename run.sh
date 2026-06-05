#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[luminary]${NC} $1"; }
warn() { echo -e "${YELLOW}[luminary]${NC} $1"; }
die()  { echo -e "${RED}[luminary]${NC} $1"; exit 1; }

# ── prereq checks ──────────────────────────────────────────────
command -v docker  >/dev/null || die "docker not found"
command -v node    >/dev/null || die "node not found"
command -v npm     >/dev/null || die "npm not found"

# ── env files ──────────────────────────────────────────────────
if [ ! -f backend/.env ]; then
  warn "backend/.env missing — copying from .env.example"
  cp backend/.env.example backend/.env
  warn "Fill backend/.env with TMDB_API_KEY and JWT secrets before continuing."
  warn "Edit it now, then re-run this script."
  exit 1
fi

if [ ! -f frontend/.env ]; then
  warn "frontend/.env missing — copying from .env.example"
  cp frontend/.env.example frontend/.env
fi

# ── docker services ────────────────────────────────────────────
log "Starting Postgres + Redis..."
docker compose up -d

log "Waiting for Postgres..."
until docker compose exec -T postgres psql -U luminary -d luminary_db -c "SELECT 1" > /dev/null 2>&1; do
  sleep 1
done
docker compose exec -T postgres psql -U luminary -d luminary_db -c "GRANT ALL ON SCHEMA public TO luminary;" > /dev/null 2>&1 || true
log "Postgres ready."

# ── npm install ────────────────────────────────────────────────
if [ ! -d node_modules ]; then
  log "Installing dependencies..."
  npm install
fi

# ── prisma ────────────────────────────────────────────────────
log "Pushing DB schema..."
npm run db:generate
npm run db:push

# ── start ─────────────────────────────────────────────────────
log "Starting Luminary..."
log "  API  → http://localhost:4000"
log "  Web  → http://localhost:5173"
echo ""
npm run dev
