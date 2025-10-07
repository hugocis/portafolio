# 🔧 Fix para Blobs en Docker

## Problema
Las imágenes subidas no se están mostrando correctamente en producción con error 400:
```
GET http://herokku.duckdns.org:8130/_next/image?url=%2Fuploads%2F... 400 (Bad Request)
```

## Cambios Realizados

### 1. ✅ `next.config.ts`
- Agregado `unoptimized: true` para producción sin Vercel Blob
- Configurado headers de cache para `/uploads/*`
- Las imágenes locales ahora se sirven sin optimización de Next.js

### 2. ✅ `app/uploads/[...path]/route.ts` ⭐ NUEVO
- Creada ruta API para servir archivos desde `/uploads/*`
- Maneja correctamente tipos MIME y cache headers
- Soluciona el error 404 al acceder a imágenes subidas

### 3. ✅ `docker-compose.yml` y `docker-compose.server.yml`
- Agregado volumen persistente: `uploads_data:/app/public/uploads`
- El volumen tiene nombre explícito: `portafolios_uploads_data`
- Los archivos subidos ahora persisten entre reinicios del contenedor
- Configurado tanto en desarrollo como producción

### 4. ✅ `Dockerfile`
- Creada carpeta `/app/public/uploads` con permisos correctos
- Asegura que el directorio existe antes del runtime

### 5. ✅ Scripts de configuración
- `scripts/setup-uploads-volume.sh` (Linux/Mac)
- `scripts/setup-uploads-volume.ps1` (Windows)
- Permiten verificar y configurar el volumen antes del deploy

## Despliegue

### Opción 1: Configuración Manual del Volumen (Recomendado para primera vez)

**Desde Windows (tu máquina local):**
```powershell
# 1. Configurar el volumen antes del deploy
.\scripts\setup-uploads-volume.ps1

# 2. Ejecutar el deploy
.\deploy.ps1
```

**Desde el Servidor (SSH):**
```bash
# 1. Configurar el volumen
cd ~/portafolios
chmod +x scripts/setup-uploads-volume.sh
./scripts/setup-uploads-volume.sh

# 2. Ejecutar el deploy
git pull origin main
docker compose -f docker-compose.yml -f docker-compose.server.yml down
docker compose -f docker-compose.yml -f docker-compose.server.yml build --no-cache
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d
```

### Opción 2: Deploy Directo

**Pasos en el servidor:**

1. **Detener contenedores actuales:**
   ```bash
   cd ~/portafolios
   docker compose -f docker-compose.yml -f docker-compose.server.yml down
   ```

2. **Pull del código actualizado:**
   ```bash
   git pull origin main
   ```

3. **Rebuild y restart:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.server.yml build --no-cache
   docker compose -f docker-compose.yml -f docker-compose.server.yml up -d
   ```

4. **Verificar volúmenes:**
   ```bash
   docker volume ls | grep uploads
   docker compose -f docker-compose.yml -f docker-compose.server.yml exec app ls -la /app/public/uploads
   ```

5. **Ver logs:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.server.yml logs -f app
   ```

## Alternativa: Script PowerShell de Deploy Rápido

Desde Windows (tu máquina local):
```powershell
# En c:\Users\Hugo\Desktop\portafolios\
.\deploy.ps1
```

O manualmente:
```powershell
git add .
git commit -m "fix: Arreglar servicio de blobs en Docker"
git push origin main

ssh usuario@herokku.duckdns.org "cd ~/portafolios && git pull && docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build"
```

## Verificación

1. **Subir nueva imagen** desde http://herokku.duckdns.org:8130/dashboard/blobs
2. **Verificar en el inspector** que la URL sea: `/uploads/[timestamp]-[filename]`
3. **Comprobar que se muestra** sin error 400

## Nota sobre Vercel Blob

Si tienes `BLOB_READ_WRITE_TOKEN` configurado, las imágenes se subirán a Vercel Blob y no al sistema local. En ese caso, estas configuraciones no aplicarán.

Para usar almacenamiento local en producción, asegúrate de que `BLOB_READ_WRITE_TOKEN` NO esté definido en tu `.env`.

## Troubleshooting

### Las imágenes antiguas no aparecen
Las imágenes subidas antes de este fix pueden haberse perdido si no había volumen persistente. Deberás subirlas nuevamente.

### Permisos
Si hay errores de permisos:
```bash
docker compose exec app chmod -R 755 /app/public/uploads
docker compose exec app chown -R node:node /app/public/uploads
```

### Verificar contenido del volumen
```bash
docker compose exec app sh
ls -la /app/public/uploads/
cat /app/public/uploads/[nombre-archivo]
exit
```
