#!/bin/bash
# Script de diagnóstico para verificar nginx y puertos

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 DIAGNÓSTICO DE NGINX Y PUERTOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verificar si nginx está corriendo
echo "1️⃣ Estado de nginx:"
if systemctl is-active --quiet nginx; then
    echo "   ✅ nginx está corriendo"
    systemctl status nginx --no-pager | head -n 5
else
    echo "   ❌ nginx NO está corriendo"
    echo "   Intentando iniciar..."
    sudo systemctl start nginx
fi
echo ""

# 2. Verificar puertos en uso
echo "2️⃣ Puertos en uso:"
echo "   Puerto 80 (HTTP):"
sudo netstat -tlnp | grep ':80 ' || echo "   ⚠️ No está escuchando"
echo ""
echo "   Puerto 443 (HTTPS):"
sudo netstat -tlnp | grep ':443 ' || echo "   ⚠️ No está escuchando"
echo ""
echo "   Puerto 18130 (App):"
sudo netstat -tlnp | grep ':18130 ' || echo "   ⚠️ No está escuchando"
echo ""
echo "   Puerto 8130 (Puerto viejo):"
sudo netstat -tlnp | grep ':8130 ' || echo "   ⚠️ No está escuchando"
echo ""

# 3. Verificar configuración de nginx
echo "3️⃣ Archivos de configuración de nginx:"
echo "   Configuración principal:"
ls -lh /etc/nginx/nginx.conf 2>/dev/null || echo "   ❌ No encontrado"
echo ""
echo "   Sites disponibles:"
ls -lh /etc/nginx/sites-available/ 2>/dev/null || echo "   ❌ No encontrado"
echo ""
echo "   Sites habilitados:"
ls -lh /etc/nginx/sites-enabled/ 2>/dev/null || echo "   ❌ No encontrado"
echo ""

# 4. Buscar configuración de portafolios/herokku
echo "4️⃣ Configuración relacionada con portafolios:"
grep -r "18130\|8130\|portafolio\|herokku" /etc/nginx/sites-available/ 2>/dev/null | head -n 20
echo ""

# 5. Verificar logs de nginx
echo "5️⃣ Últimos errores de nginx:"
sudo tail -n 20 /var/log/nginx/error.log 2>/dev/null || echo "   ⚠️ No se pudo leer el log"
echo ""

# 6. Test de configuración de nginx
echo "6️⃣ Validar configuración de nginx:"
sudo nginx -t
echo ""

# 7. Contenedores Docker
echo "7️⃣ Contenedores Docker corriendo:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Diagnóstico completado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
