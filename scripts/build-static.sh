#!/bin/bash
# Gera a versão estática de pré-visualização em out-preview/.
set -e
cd "$(dirname "$0")/.."
STATIC_EXPORT=1 npx next build
node scripts/postprocess-static.mjs
