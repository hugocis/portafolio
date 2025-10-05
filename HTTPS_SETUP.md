# 🔒 Guía de Configuración HTTPS con Cloudflare

## 🎯 Opción 1: URL Bonita con Dominio Personalizado (RECOMENDADO)

### **Paso 1: Obtener un dominio gratis**

1. Ve a **Freenom**: https://www.freenom.com
2. Busca un dominio disponible (ej: `portafolio-hugo.tk`, `.ml`, `.ga`, `.cf`, `.gq`)
3. Selecciona "Get it now" y regístralo gratis por 12 meses
4. Completa el registro

### **Paso 2: Añadir el dominio a Cloudflare**

1. En Cloudflare Dashboard: https://dash.cloudflare.com
2. Click en **"Add a site"**
3. Ingresa tu dominio de Freenom (ej: `portafolio-hugo.tk`)
4. Selecciona el plan **Free**
5. Cloudflare te mostrará 2 nameservers (ej: `john.ns.cloudflare.com` y `mary.ns.cloudflare.com`)

### **Paso 3: Cambiar los nameservers en Freenom**

1. Ve a Freenom: https://my.freenom.com/clientarea.php
2. Click en **"Services"** → **"My Domains"**
3. Click en **"Manage Domain"** de tu dominio
4. Ve a **"Management Tools"** → **"Nameservers"**
5. Selecciona **"Use custom nameservers"**
6. Ingresa los nameservers de Cloudflare
7. Click en **"Change Nameservers"**
8. Espera 5-30 minutos a que se propague

### **Paso 4: Configurar el Public Hostname en Cloudflare**

1. En Cloudflare, ve a **Zero Trust** → **Networks** → **Tunnels**
2. Click en tu tunnel **"portafolio-invernalia"**
3. Ve a la pestaña **"Public Hostname"**
4. Click en **"Add a public hostname"**
5. Configura:
   - **Subdomain:** `www` (o déjalo vacío para usar `portafolio-hugo.tk` directamente)
   - **Domain:** Selecciona tu dominio de Freenom
   - **Path:** (déjalo vacío)
   - **Service:**
     - **Type:** `HTTP`
     - **URL:** `app:3000`
6. Click en **"Save hostname"**

### **Paso 5: Añadir el token a GitHub Secrets**

1. Ve a: https://github.com/hugocis/portafolio/settings/secrets/actions
2. Verifica que existe el secret: `CLOUDFLARE_TUNNEL_TOKEN`
3. Si no existe, añádelo con el token que copiaste antes

### **Paso 6: Actualizar la URL en el código**

Edita el archivo `docker-compose.server.yml` y `.github/workflows/deploy.yml` con tu dominio:

```yaml
NEXTAUTH_URL=https://portafolio-hugo.tk
# o
NEXTAUTH_URL=https://www.portafolio-hugo.tk
```

### **Paso 7: Hacer deploy**

```powershell
git add .
git commit -m "feat: Configure custom domain with Cloudflare Tunnel"
git push origin main
```

---

## 🎯 Opción 2: Quick Tunnel (URL automática)

Si prefieres no configurar dominio ahora:

1. Usa la URL actual: `https://model-belfast-simon-super.trycloudflare.com`
2. Es temporal pero funciona inmediatamente
3. Puedes cambiar a dominio personalizado después

---

## 🎯 Opción 3: Usar DuckDNS con Port Forwarding

Si prefieres usar `herokku.duckdns.org`:

1. Configura port forwarding en tu router: `80 → 8080`, `443 → 8443`
2. Usa Let's Encrypt para obtener certificado
3. URL final: `https://herokku.duckdns.org`

---

## 📝 Dominios gratuitos disponibles

- **Freenom**: `.tk`, `.ml`, `.ga`, `.cf`, `.gq` (gratis 12 meses)
- **DuckDNS**: Ya tienes `herokku.duckdns.org`
- **No-IP**: Subdominios gratis como `tuapp.ddns.net`

---

## 🆘 Si tienes problemas

1. Verifica que los nameservers se hayan propagado: https://www.whatsmydns.net
2. Revisa los logs: `docker logs portafolios-cloudflared-1`
3. Verifica el hostname en Cloudflare Dashboard
