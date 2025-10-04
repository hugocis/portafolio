#!/bin/sh
set -e

echo "🚀 Iniciando Portfolio Tree..."

# Ejecutar migraciones automáticamente
echo "🔄 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy || {
    echo "⚠️ Migraciones fallaron, intentando crear base de datos..."
    npx prisma db push
}

# Verificar modo de ejecución
if [ "$NODE_ENV" = "production" ]; then
    echo "🌐 Iniciando en modo PRODUCCIÓN..."
    npm run build
    exec npm start
else
    echo "🛠️ Iniciando en modo DESARROLLO..."
    exec npm run dev
fi