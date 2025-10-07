#!/bin/bash
# Script para verificar el estado del almacenamiento de uploads

echo "🔍 Verificando configuración de almacenamiento..."
echo ""

# Verificar variable de entorno
if [ -n "$BLOB_READ_WRITE_TOKEN" ]; then
    echo "✅ BLOB_READ_WRITE_TOKEN está configurado"
    echo "   → Usando Vercel Blob Storage (CDN)"
else
    echo "📁 BLOB_READ_WRITE_TOKEN NO está configurado"
    echo "   → Usando almacenamiento local"
    
    # Verificar directorio de uploads
    if [ -d "/app/public/uploads" ]; then
        echo "✅ Directorio /app/public/uploads existe"
        
        FILE_COUNT=$(ls -1 /app/public/uploads 2>/dev/null | wc -l)
        echo "   → Archivos encontrados: $FILE_COUNT"
        
        if [ $FILE_COUNT -gt 0 ]; then
            echo "   → Últimos 5 archivos:"
            ls -lht /app/public/uploads | head -6 | tail -5
        fi
        
        # Verificar permisos
        PERMS=$(stat -c "%a" /app/public/uploads)
        echo "   → Permisos del directorio: $PERMS"
        
        if [ "$PERMS" != "755" ] && [ "$PERMS" != "777" ]; then
            echo "⚠️  Advertencia: Los permisos deberían ser 755 o 777"
        fi
    else
        echo "❌ Directorio /app/public/uploads NO existe"
        echo "   → Esto causará errores 404"
    fi
    
    # Verificar volumen de Docker
    echo ""
    echo "📦 Verificando volumen de Docker..."
    if docker volume inspect portafolios_uploads_data >/dev/null 2>&1; then
        echo "✅ Volumen 'portafolios_uploads_data' existe"
        docker volume inspect portafolios_uploads_data --format '   → Mountpoint: {{ .Mountpoint }}'
    else
        echo "⚠️  Volumen 'portafolios_uploads_data' no encontrado"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
