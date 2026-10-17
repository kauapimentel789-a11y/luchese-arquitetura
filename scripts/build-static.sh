#!/bin/bash
# Gera a versão estática de pré-visualização em out-preview/ (sem a rota de API).
set -e
cd "$(dirname "$0")/.."
mv src/app/api /tmp/_api_backup_$$
trap 'mv /tmp/_api_backup_$$ src/app/api' EXIT
STATIC_EXPORT=1 npx next build
node scripts/postprocess-static.mjs
