# Docker - Portfolio Tree

Configuración Docker simplificada para desarrollo y producción. Un solo comando para cada modo.

## Archivos Docker

- `Dockerfile` - Imagen unificada para desarrollo y producción
- `docker-compose.yml` - Configuración principal
- `docker-compose.prod.yml` - Override para producción
- `docker-compose.server.yml` - Override para servidor
- `docker-entrypoint.sh` - Script de inicialización
- `.env` - Variables de entorno

## Inicio Rápido

### Desarrollo (con hot reload)
```powershell
# Script de despliegue (recomendado)
.\deploy.ps1 -Dev

# O con npm
npm run docker:dev

# O con Docker directamente
docker compose up --build
```

### Producción
```powershell
# Script de despliegue (recomendado)
.\deploy.ps1 -Prod

# O con npm
npm run docker:prod

# O con Docker directamente
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Scripts de Gestión

### Script Principal (deploy.ps1)
```powershell
.\deploy.ps1 -Dev     # Desarrollo con hot reload
.\deploy.ps1 -Prod    # Producción optimizada
.\deploy.ps1 -Stop    # Detener contenedores
.\deploy.ps1 -Clean   # Limpiar todo (elimina datos)
```

### Scripts NPM
```bash
npm run docker:dev     # Desarrollo
npm run docker:prod    # Producción  
npm run docker:stop    # Detener
npm run docker:clean   # Limpiar datos
npm run docker:logs    # Ver logs
npm run docker:db      # Acceso a PostgreSQL
```

## Configuración Automática

### Migraciones Automáticas
- Se ejecutan automáticamente al iniciar
- No requiere comandos adicionales
- Fallback a `prisma db push` si fallan

### Modo Desarrollo
- Hot reload habilitado automáticamente
- Código fuente montado como volumen
- Cambios reflejados inmediatamente
- Puerto: 3000

### Modo Producción
- Sin volúmenes de código fuente
- Imagen optimizada con build
- Mejor rendimiento
- Puerto: 3000 (configurable)

### Base de Datos PostgreSQL
- PostgreSQL 15 Alpine
- Datos persistentes en volumen
- Health checks automáticos
- Puerto: 5432

## Arquitectura

```
Docker Compose:
├── db (PostgreSQL 15)
│   ├── Puerto: 5432
│   ├── Usuario: postgres/postgres
│   ├── BD: portafolios
│   ├── Volumen: postgres_data (persistente)
│   └── Health check: pg_isready
└── app (Next.js)
    ├── Puerto: 3000
    ├── Migraciones automáticas
    ├── Dev: hot reload + volúmenes
    ├── Prod: optimizado sin volúmenes
    └── Entrypoint: docker-entrypoint.sh
```

## Variables de Entorno

El archivo `.env` se carga automáticamente:

```env
# Modo de ejecución
NODE_ENV=development  # o production

# Base de datos
DATABASE_URL="postgresql://postgres:postgres@db:5432/portafolios"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"

# OAuth (opcional)
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

## Comandos Útiles

### Gestión de Contenedores
```bash
# Ver estado
docker compose ps

# Ver logs en tiempo real
docker compose logs -f app

# Acceder al contenedor
docker compose exec app sh

# Reiniciar servicios
docker compose restart
```

### Base de Datos
```bash
# Acceso a PostgreSQL
docker compose exec db psql -U postgres -d portafolios

# O con script npm
npm run docker:db

# Prisma Studio
docker compose exec app npx prisma studio

# Migraciones manuales (no necesario)
docker compose exec app npx prisma migrate deploy
```

### Desarrollo
```bash
# Instalar dependencias (requiere rebuild)
docker compose exec app npm install nueva-dependencia

# Linting
docker compose exec app npm run lint

# Regenerar cliente Prisma
docker compose exec app npx prisma generate
```

## Solución de Problemas

### Error de timeout en Docker Registry
```bash
# Error típico:
# dial tcp: i/o timeout
# failed to copy: httpReadSeeker: failed open
```

**Soluciones:**

1. **Script de Recuperación Automática:**
```bash
cd portafolios
chmod +x recovery-deploy.sh
./recovery-deploy.sh
```

2. **Usar Dockerfile Estable:**
```bash
cp Dockerfile.stable Dockerfile
docker compose up -d --build
```

3. **Usar Imágenes Existentes:**
```bash
docker compose up -d
```

4. **Configurar Timeouts Extendidos:**
```bash
export COMPOSE_HTTP_TIMEOUT=1800
export DOCKER_CLIENT_TIMEOUT=1800
docker compose up -d --build
```

### Error de Migraciones
```bash
# Ver logs
docker compose logs app

# Ejecutar migraciones manualmente
docker compose exec app npx prisma migrate deploy

# O reset completo
docker compose exec app npx prisma migrate reset
```

### Puerto en Uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8130:3000"  # En lugar de 3000:3000
```

## Características Destacadas

### Simplicidad
- 1 comando para desarrollo
- 1 comando para producción
- Sin configuración manual
- Variables automáticas

### Migraciones Inteligentes
```bash
# Intenta migraciones, luego db push
npx prisma migrate deploy || npx prisma db push
```

### Desarrollo Óptimo
- Hot reload instantáneo
- Volúmenes montados
- BD persistente
- Sin pérdida de datos

### Producción Lista
- Sin volúmenes
- Build optimizado
- Imagen mínima
- Misma configuración

## Deployment en Servidor

### Configuración Inicial
```bash
# En el servidor
git clone tu-repo.git
cd portfolio-tree

# Configurar variables
cp .env.example .env
# Editar .env con valores de producción

# Iniciar
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d
```

### Actualización
```bash
# Pull cambios
git pull origin main

# Rebuild y reiniciar
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

### Backup
```bash
# Backup de base de datos
docker compose exec db pg_dump -U postgres portafolios > backup.sql

# Restaurar
cat backup.sql | docker compose exec -T db psql -U postgres portafolios
```

---

**Docker nunca fue tan simple!**

Un solo comando, configuración automática, listo para desarrollar o desplegar.
