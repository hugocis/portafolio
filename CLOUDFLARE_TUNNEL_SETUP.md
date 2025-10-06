# 🔒 Configuración del Túnel Permanente de Cloudflare

## 📋 Resumen

Has cambiado de **Cloudflare Quick Tunnel** (URLs temporales) a **Cloudflare Tunnel permanente** con token. Esto te da:

✅ **URL permanente** - No cambia con reinicios  
✅ **Custom domain** - Puedes usar tu propio dominio  
✅ **Producción-ready** - Estable y confiable  
✅ **Gratis** - Sin costo adicional  

---

## 🚀 Cómo funciona ahora

### Antes (Quick Tunnel):
```bash
cloudflared tunnel --url http://app:3000
# ❌ Genera: https://random-xyz-123.trycloudflare.com
# ❌ Cambia cada reinicio
```

### Ahora (Tunnel Permanente):
```bash
cloudflared tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
# ✅ Usa tu token configurado
# ✅ URL fija configurada en Cloudflare
# ✅ Nunca cambia
```

---

## 🔧 ¿Dónde está configurado mi túnel?

Tu túnel ya tiene un token configurado en: `CLOUDFLARE_TUNNEL_TOKEN` (GitHub Secret)

### Ver detalles del túnel:

1. **Ve al Dashboard de Cloudflare:**
   https://one.dash.cloudflare.com/

2. **Navega a:**
   - Zero Trust → Networks → Tunnels
   - O busca "Tunnels" en el menú

3. **Ahí verás:**
   - Nombre del túnel
   - Estado (Healthy/Connected)
   - URL pública configurada
   - Rutas configuradas

---

## 🌐 Configurar tu dominio personalizado

Si quieres usar `herokku.duckdns.org` o cualquier otro dominio:

### Opción 1: Usar un subdominio de Cloudflare

Si tienes un dominio en Cloudflare (ejemplo: `midominio.com`):

1. En el dashboard del túnel, ve a **Public Hostname**
2. Haz clic en **Add a public hostname**
3. Configura:
   ```
   Subdomain: portfolio (o el que quieras)
   Domain: midominio.com
   Path: (vacío)
   Service: http://app:3000
   ```
4. Guarda → Ahora tu app estará en `https://portfolio.midominio.com`

### Opción 2: CNAME con DuckDNS

1. En Cloudflare, busca el dominio del túnel (algo como `xxxxx.cfargotunnel.com`)
2. Configura un CNAME en DuckDNS (si es posible) o usa el dominio del túnel directamente

---

## 🔍 Verificar que el túnel funciona

### Desde tu servidor:
```bash
cd portafolios
docker compose logs cloudflared

# Deberías ver algo como:
# ✅ "Connection XXXX registered"
# ✅ "Registered tunnel connection"
```

### Desde el dashboard:
- Ve a tu túnel en Cloudflare
- Verifica que el estado sea **Healthy** (verde)
- Debería mostrar "Active" con conexiones establecidas

---

## 📊 Estado actual

Después del próximo deploy, tu aplicación estará disponible en:

- **https://herokku.duckdns.org** (tu dominio principal)
- **http://herokku.duckdns.org:8130** (acceso directo HTTP)
- **Tu túnel de Cloudflare** (configurado en el dashboard)

---

## 🆘 Troubleshooting

### El túnel no se conecta:

1. **Verifica el token:**
   ```bash
   # Desde el servidor
   cd portafolios
   echo $CLOUDFLARE_TUNNEL_TOKEN
   # Debe mostrar un token largo
   ```

2. **Revisa los logs:**
   ```bash
   docker compose logs cloudflared --tail=50
   ```

3. **Regenera el token:**
   - Ve al dashboard de Cloudflare
   - Tunnels → Tu túnel → Configure
   - Copia el token nuevo
   - Actualiza el secret `CLOUDFLARE_TUNNEL_TOKEN` en GitHub

### "Permission denied" o errores de autenticación:

- Verifica que el token sea correcto
- Asegúrate de que el túnel no esté eliminado en Cloudflare
- Revisa que el token corresponda al túnel correcto

---

## 🔄 Cambios realizados

### `docker-compose.server.yml`:
```diff
- command: tunnel --url http://app:3000
+ command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
```

### Workflow de GitHub:
- ✅ Ya no busca URLs temporales
- ✅ Verifica el estado del túnel permanente
- ✅ Muestra información del túnel en el resumen

---

## 💡 Próximos pasos

1. **Haz un deploy** (push a main) para aplicar los cambios
2. **Verifica el dashboard** de Cloudflare para confirmar la conexión
3. **Configura un dominio personalizado** si lo deseas
4. **Disfruta** de tu túnel permanente 🎉

---

## 📚 Recursos

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Dashboard de Cloudflare](https://one.dash.cloudflare.com/)
- [Configurar dominios públicos](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/routing-to-tunnel/dns/)
