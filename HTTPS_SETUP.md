# 🔒 Guía de Configuración HTTPS con Cloudflare

## 🎯 Configuración Simple con Cloudflare Quick Tunnel

### **Opción Automática (SIN configuración de dominio)**

El proyecto está configurado para usar **Cloudflare Quick Tunnel** que te da una URL automática.

#### **Pasos:**

1. **Hacer push del código:**
   ```powershell
   git add .
   git commit -m "feat: Add Cloudflare Quick Tunnel for HTTPS"
   git push origin main
   ```

2. **Ver los logs del servidor después del deploy:**
   - Conéctate por SSH a tu servidor
   - Ejecuta: `docker logs portafolios-cloudflared-1`
   - Verás una línea como:
     ```
     Your quick Tunnel has been created! Visit it at:
     https://abc-def-123.trycloudflare.com
     ```

3. **¡Listo!** Usa esa URL para acceder con HTTPS

---

## 🔧 Opción Avanzada (con dominio propio)

Si prefieres usar un dominio personalizado:

### **1️⃣ Obtener un dominio gratis**

Opciones:
- **Freenom**: https://www.freenom.com (dominios .tk, .ml, .ga gratis)
- **DuckDNS**: Ya tienes `herokku.duckdns.org`
- **Comprar uno**: Namecheap, Google Domains (~$10/año)

### **2️⃣ Añadir dominio a Cloudflare**

1. En Cloudflare Dashboard: **Add a site**
2. Ingresa tu dominio
3. Selecciona plan **Free**
4. Cambia los nameservers en tu proveedor de dominio
5. Espera a que se active (5-10 min)

### **3️⃣ Configurar Tunnel con dominio**

1. Añade el token a GitHub Secrets: `CLOUDFLARE_TUNNEL_TOKEN`
2. Configura el Public Hostname en Cloudflare
3. Actualiza `NEXTAUTH_URL` en el código

---

## 📝 Recomendación

**Usa Quick Tunnel primero** para probarlo rápido, luego puedes configurar un dominio personalizado si lo necesitas.

---

## 🆘 Si tienes problemas

Revisa los logs: `docker logs portafolios-cloudflared-1`
