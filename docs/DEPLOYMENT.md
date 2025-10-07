# Deployment - Portfolio Tree

Guía completa para desplegar Portfolio Tree en diferentes entornos.

## Opciones de Deployment

### 1. Vercel (Recomendado)

**Ventajas:**
- Deploy automático desde GitHub
- CDN global
- Escalado automático
- SSL gratuito
- Vercel Blob Storage integrado

**Pasos:**

1. **Conectar Repositorio**
   - Ir a [vercel.com](https://vercel.com)
   - Importar proyecto desde GitHub
   - Autorizar acceso al repositorio

2. **Configurar Variables de Entorno**
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="https://tu-dominio.vercel.app"
   NEXTAUTH_SECRET="tu-secreto-generado"
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   BLOB_READ_WRITE_TOKEN="..." # Opcional
   ```

3. **Configurar Base de Datos**
   - Usar Vercel Postgres
   - O conectar PostgreSQL externo

4. **Deploy**
   - Automático en cada push a `main`
   - Preview deployments en PRs

### 2. Servidor Propio con Docker

**Ventajas:**
- Control completo
- Sin costos de hosting
- Datos en tu infraestructura

**Requisitos:**
- Servidor con Docker y Docker Compose
- Puerto 3000 (o configurado) disponible
- Acceso SSH

**Pasos:**

1. **Configurar Servidor**
   ```bash
   # En tu servidor
   apt update && apt upgrade -y
   apt install docker.io docker-compose git -y
   systemctl enable docker
   systemctl start docker
   ```

2. **Clonar Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/portfolio-tree.git
   cd portfolio-tree
   ```

3. **Configurar Variables**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Editar con valores de producción:
   ```env
   NODE_ENV=production
   DATABASE_URL="postgresql://postgres:password@db:5432/portafolios"
   NEXTAUTH_URL="http://tu-dominio.com:3000"
   NEXTAUTH_SECRET="secreto-generado"
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   ```

4. **Iniciar Servicios**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.server.yml up -d
   ```

5. **Verificar**
   ```bash
   docker compose ps
   curl http://localhost:3000/api/health
   ```

### 3. GitHub Actions (CI/CD Automático)

**Configuración incluida en** `.github/workflows/deploy.yml`

**Requisitos:**
- Repositorio en GitHub
- Servidor con SSH configurado
- GitHub Secrets configurados

**GitHub Secrets Necesarios:**

```
SSH_PRIVATE_KEY          # Clave SSH para acceder al servidor
SERVER_HOST              # IP o dominio del servidor
SERVER_USER              # Usuario SSH
SERVER_PORT              # Puerto SSH (default: 22)
NEXTAUTH_SECRET          # Secreto de NextAuth
GITHUB_CLIENT_ID         # OAuth GitHub
GITHUB_CLIENT_SECRET     # OAuth GitHub
```

**Configurar Secrets:**
1. Ir a Settings > Secrets and variables > Actions
2. Añadir cada secret con su valor

**Workflow:**
- Se ejecuta automáticamente en push a `main`
- Pull en el servidor
- Rebuild de contenedores Docker
- Health check automático
- Notificación de estado

## Configuración de Puertos

### Desarrollo Local
```yaml
# docker-compose.yml
ports:
  - "3000:3000"
```

### Servidor (Puerto Personalizado)
```yaml
# docker-compose.server.yml
ports:
  - "8130:3000"  # O el puerto que prefieras
```

Actualizar `NEXTAUTH_URL` acorde:
```env
NEXTAUTH_URL="http://tu-dominio.com:8130"
```

## SSL y Dominio

### Con Nginx Reverse Proxy

1. **Instalar Nginx**
   ```bash
   apt install nginx certbot python3-certbot-nginx
   ```

2. **Configurar Nginx**
   ```nginx
   # /etc/nginx/sites-available/portfolio
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Habilitar Sitio**
   ```bash
   ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

4. **Configurar SSL**
   ```bash
   certbot --nginx -d tu-dominio.com
   ```

5. **Actualizar NEXTAUTH_URL**
   ```env
   NEXTAUTH_URL="https://tu-dominio.com"
   ```

### Con Traefik

```yaml
# docker-compose.traefik.yml
services:
  app:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio.rule=Host(`tu-dominio.com`)"
      - "traefik.http.routers.portfolio.entrypoints=websecure"
      - "traefik.http.routers.portfolio.tls.certresolver=letsencrypt"
```

## Migraciones en Producción

### Primera vez
```bash
# Automático en docker-entrypoint.sh
npx prisma migrate deploy
```

### Actualización con nuevas migraciones
```bash
# Pull cambios
git pull origin main

# Rebuild (ejecuta migraciones automáticamente)
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

### Manual (si es necesario)
```bash
docker compose exec app npx prisma migrate deploy
```

## Backup y Restauración

### Backup de Base de Datos
```bash
# Backup
docker compose exec db pg_dump -U postgres portafolios > backup_$(date +%Y%m%d).sql

# Comprimir
gzip backup_$(date +%Y%m%d).sql
```

### Restauración
```bash
# Descomprimir
gunzip backup_20240101.sql.gz

# Restaurar
cat backup_20240101.sql | docker compose exec -T db psql -U postgres portafolios
```

### Backup de Archivos (Blobs)
```bash
# Con Vercel Blob - automático
# Con almacenamiento local
tar -czf uploads_backup.tar.gz public/uploads
```

## Monitoreo

### Logs
```bash
# Ver logs en tiempo real
docker compose logs -f app

# Últimas 100 líneas
docker compose logs --tail=100 app

# Logs de todos los servicios
docker compose logs -f
```

### Health Check
```bash
# Check manual
curl http://localhost:3000/api/health

# O desde fuera
curl http://tu-dominio.com:3000/api/health
```

### Métricas
```bash
# Uso de recursos
docker stats

# Estado de contenedores
docker compose ps
```

## Actualización

### Método 1: GitHub Actions (Automático)
```bash
git add .
git commit -m "Update"
git push origin main
# El workflow se ejecuta automáticamente
```

### Método 2: Manual en Servidor
```bash
# SSH al servidor
ssh usuario@servidor

# Ir al directorio
cd portfolio-tree

# Pull cambios
git pull origin main

# Rebuild
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

## Troubleshooting

### Error de DNS en GitHub Actions
```yaml
# Usar IP directa en lugar de hostname
SERVER_HOST: 123.456.789.0
```

### Timeout en Docker Build
```bash
# Aumentar timeouts
export COMPOSE_HTTP_TIMEOUT=1800
export DOCKER_CLIENT_TIMEOUT=1800
docker compose up -d --build
```

### Error de Migraciones
```bash
# Ver logs
docker compose logs app

# Ejecutar manualmente
docker compose exec app npx prisma migrate deploy

# Reset (¡cuidado en producción!)
docker compose exec app npx prisma migrate reset
```

### Puerto en Uso
```bash
# Ver qué usa el puerto
lsof -i :3000

# Cambiar puerto en docker-compose
ports:
  - "8130:3000"
```

## Seguridad

### Checklist de Seguridad

- [ ] `NEXTAUTH_SECRET` único y seguro
- [ ] OAuth secrets no expuestos
- [ ] Base de datos con contraseña fuerte
- [ ] Firewall configurado correctamente
- [ ] SSL/TLS habilitado
- [ ] Variables de entorno no en el código
- [ ] Backups automáticos configurados
- [ ] Logs rotados
- [ ] Actualizaciones de seguridad aplicadas

### Generar Secretos Seguros
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# Password de BD
openssl rand -base64 32

# Token personalizado
openssl rand -hex 32
```

---

**Deployment exitoso!**

Tu Portfolio Tree está listo para producción. Recuerda revisar los logs regularmente y mantener backups actualizados.
