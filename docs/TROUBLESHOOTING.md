# Troubleshooting - Portfolio Tree

Soluciones a problemas comunes durante desarrollo y deployment.

## Problemas de Instalación

### Error: "Cannot find module"

**Síntomas:**
```
Error: Cannot find module 'next'
Error: Cannot find module '@prisma/client'
```

**Solución:**
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install

# Regenerar cliente Prisma
npx prisma generate
```

### Error: "Database connection failed"

**Síntomas:**
```
Error: P1001: Can't reach database server
Connection refused at localhost:5432
```

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
# Con Docker:
docker compose ps

# Sin Docker:
pg_isready -h localhost -p 5432

# Verificar DATABASE_URL en .env
echo $DATABASE_URL
```

## Problemas de Migraciones

### Error: "Migration failed"

**Síntomas:**
```
Error: P3009: migrate.lock file is missing
Error: Migration failed to apply cleanly
```

**Solución:**
```bash
# Opción 1: Reset migraciones (¡cuidado en producción!)
npx prisma migrate reset

# Opción 2: Aplicar migraciones manualmente
npx prisma migrate deploy

# Opción 3: Push directo (desarrollo)
npx prisma db push
```

### Error: "Table already exists"

**Síntomas:**
```
Error: P3009: Table `User` already exists on the database
```

**Solución:**
```bash
# Marcar migración como aplicada
npx prisma migrate resolve --applied "nombre_de_migracion"

# O reset completo (desarrollo)
npx prisma migrate reset
```

## Problemas de Autenticación

### Error: "NEXTAUTH_SECRET must be provided"

**Síntomas:**
```
Error: Please define the NEXTAUTH_SECRET environment variable
```

**Solución:**
```bash
# Generar nuevo secreto
openssl rand -base64 32

# Añadir a .env.local
echo "NEXTAUTH_SECRET=tu_secreto_generado" >> .env.local

# Reiniciar servidor
npm run dev
```

### Error: "OAuth redirect URI mismatch"

**Síntomas:**
```
Error: redirect_uri_mismatch
The redirect URI in your request did not match
```

**Solución:**
1. Verificar `NEXTAUTH_URL` en `.env`
2. Verificar callback URL en GitHub OAuth App
3. Deben coincidir exactamente:
```env
NEXTAUTH_URL=http://localhost:3000
# GitHub callback: http://localhost:3000/api/auth/callback/github
```

### Error: "Session not found"

**Síntomas:**
```
Session is null on protected pages
useSession() returns null
```

**Solución:**
```tsx
// Verificar que SessionProvider esté en layout
// app/layout.tsx
import { SessionProvider } from '@/components/providers/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

## Problemas de Docker

### Error: "Port already in use"

**Síntomas:**
```
Error: bind: address already in use
Error starting userland proxy: listen tcp4 0.0.0.0:3000
```

**Solución:**
```bash
# Encontrar proceso usando el puerto
# Windows:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :3000

# Matar proceso o cambiar puerto en docker-compose.yml
ports:
  - "8130:3000"  # En lugar de 3000:3000
```

### Error: "Docker build timeout"

**Síntomas:**
```
dial tcp: i/o timeout
failed to copy: httpReadSeeker: failed open
```

**Solución:**
```bash
# Opción 1: Aumentar timeouts
export COMPOSE_HTTP_TIMEOUT=1800
export DOCKER_CLIENT_TIMEOUT=1800
docker compose up -d --build

# Opción 2: Usar imagen estable
cp Dockerfile.stable Dockerfile
docker compose up -d --build

# Opción 3: Usar imágenes existentes
docker compose up -d
```

### Error: "Container keeps restarting"

**Síntomas:**
```
Container exits immediately
Status: Restarting (1) X seconds ago
```

**Solución:**
```bash
# Ver logs del contenedor
docker compose logs app

# Problemas comunes:
# 1. Error en migraciones - verificar DATABASE_URL
# 2. Puerto ocupado - cambiar puerto
# 3. Dependencia faltante - verificar package.json

# Verificar salud de la BD
docker compose exec db pg_isready
```

## Problemas de Build

### Error: "Build failed"

**Síntomas:**
```
Error: Failed to compile
Type error: Cannot find module
```

**Solución:**
```bash
# Limpiar completamente
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

### Error: "Out of memory"

**Síntomas:**
```
FATAL ERROR: Reached heap limit
JavaScript heap out of memory
```

**Solución:**
```bash
# Aumentar memoria de Node.js
# En package.json:
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}

# O directamente:
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

## Problemas de Deployment

### Error: "SSH connection failed"

**Síntomas:**
```
ssh: connect to host X.X.X.X port 22: Connection timed out
Permission denied (publickey)
```

**Solución:**
```bash
# Verificar conexión SSH
ssh -v usuario@servidor

# Verificar clave SSH
cat ~/.ssh/id_rsa.pub

# Añadir clave al servidor
ssh-copy-id usuario@servidor

# Verificar puerto SSH correcto
ssh -p 7122 usuario@servidor
```

### Error: "GitHub Actions failing"

**Síntomas:**
```
Error: secrets.SERVER_HOST is not defined
Error: Unable to connect to deployment server
```

**Solución:**
1. Verificar que todos los secrets estén configurados:
   - `SERVER_HOST`
   - `SERVER_USER`
   - `SERVER_PORT`
   - `SSH_PRIVATE_KEY`
   - `NEXTAUTH_SECRET`
   - etc.

2. Verificar formato de SSH_PRIVATE_KEY:
```
-----BEGIN OPENSSH PRIVATE KEY-----
contenido_de_la_clave
-----END OPENSSH PRIVATE KEY-----
```

### Error: "DNS resolution failed"

**Síntomas:**
```
dial tcp: lookup domain.duckdns.org: i/o timeout
```

**Solución:**
```bash
# Opción 1: Usar IP directa
SERVER_HOST: 123.456.789.0

# Opción 2: Verificar DNS
nslookup domain.duckdns.org
dig domain.duckdns.org

# Opción 3: Configurar DNS alternativo
# En docker-compose.yml:
services:
  app:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

## Problemas de Rendimiento

### Sitio muy lento

**Solución:**
```bash
# Verificar índices en base de datos
# prisma/schema.prisma
model Node {
  id String @id @default(cuid())
  userId String
  @@index([userId])  // Añadir índices
}

# Aplicar cambios
npx prisma migrate dev

# Verificar cache de Next.js
rm -rf .next
npm run build
```

### Imágenes cargan lento

**Solución:**
```tsx
// Usar Next.js Image con optimización
import Image from 'next/image'

<Image
  src={url}
  alt="description"
  width={800}
  height={600}
  priority  // Para imágenes above-the-fold
  loading="lazy"  // Para el resto
/>
```

## Problemas de Archivos (Blobs)

### Error: "File upload failed"

**Síntomas:**
```
Error: Failed to upload file
File size exceeds limit
```

**Solución:**
```typescript
// Verificar configuración en FileUploader
<FileUploader
  maxSize={10 * 1024 * 1024}  // 10MB
  accept="image/*"
/>

// Verificar límite del servidor
// next.config.ts
export default {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

### Error: "Vercel Blob not configured"

**Síntomas:**
```
Warning: BLOB_READ_WRITE_TOKEN not found
Files saved locally
```

**Solución:**
```bash
# En producción, añadir a .env:
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Obtener token desde Vercel Dashboard:
# 1. Ir a proyecto en Vercel
# 2. Storage > Blob
# 3. Create Store
# 4. Copiar token
```

## Logs y Debugging

### Habilitar logs detallados

```bash
# Next.js
DEBUG=* npm run dev

# Prisma
DEBUG=prisma:* npm run dev

# Docker
docker compose logs -f --tail=100 app
```

### Verificar estado del sistema

```bash
# Verificar servicios
docker compose ps

# Verificar recursos
docker stats

# Verificar conectividad
curl http://localhost:3000/api/health

# Verificar base de datos
docker compose exec db psql -U postgres -c "SELECT version();"
```

## Obtener Ayuda

Si ninguna de estas soluciones funciona:

1. **Revisar logs completos:**
   ```bash
   docker compose logs -f > logs.txt
   ```

2. **Buscar en Issues de GitHub:**
   - [Next.js Issues](https://github.com/vercel/next.js/issues)
   - [Prisma Issues](https://github.com/prisma/prisma/issues)

3. **Crear un Issue en el proyecto:**
   - Incluir logs completos
   - Describir pasos para reproducir
   - Mencionar entorno (OS, versiones, etc.)

4. **Preguntar en Discusiones:**
   - [GitHub Discussions del proyecto]

---

**¿Problema resuelto?** Considera contribuir con la solución a esta guía.
