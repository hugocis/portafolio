# 🐳 Docker - Portfolio Tree

Configuración Docker completamente simplificada para desarrollo y producción. **Un solo comando para cada modo**.

## 📁 Archivos Docker

- `Dockerfile` - Imagen unificada para desarrollo y producción
- `docker-compose.yml` - Configuración principal con variables de entorno
- `docker-compose.prod.yml` - Override específico para producción (sin volúmenes)
- `docker-entrypoint.sh` - Script de inicialización con migraciones automáticas
- `.env` - Variables de entorno (copia de `.env.example`)

## 🚀 Inicio Ultra-Rápido

### 🛠️ Desarrollo (con hot reload)
```powershell
# Opción 1: Script de despliegue (recomendado)
.\deploy.ps1 -Dev

# Opción 2: npm script  
npm run docker:dev

# Opción 3: Docker directo
docker compose up --build
```

### 🌐 Producción
```powershell
# Opción 1: Script de despliegue (recomendado)
.\deploy.ps1 -Prod

# Opción 2: npm script
npm run docker:prod

# Opción 3: Docker directo
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## 🎯 Scripts de Gestión

### **Script Principal (`deploy.ps1`)**
```powershell
.\deploy.ps1 -Dev     # 🛠️ Desarrollo con hot reload
.\deploy.ps1 -Prod    # 🚀 Producción optimizada
.\deploy.ps1 -Stop    # 🛑 Detener contenedores
.\deploy.ps1 -Clean   # 🧹 Limpiar todo (elimina datos)
```

### **Scripts NPM**
```bash
npm run docker:dev     # Desarrollo
npm run docker:prod    # Producción  
npm run docker:stop    # Detener
npm run docker:clean   # Limpiar datos
npm run docker:logs    # Ver logs en tiempo real
npm run docker:db      # Acceso directo a PostgreSQL
```

## ⚙️ Configuración Automática

### **🔄 Migraciones Automáticas**
- Se ejecutan **automáticamente** al iniciar cualquier contenedor
- No necesitas comandos adicionales
- Fallback a `prisma db push` si las migraciones fallan

### **🛠️ Modo Desarrollo**
- **Hot reload** habilitado automáticamente
- Código fuente montado como volumen (`.:/app`)
- Cambios reflejados **inmediatamente**
- Comando: `npm run dev`

### **🚀 Modo Producción** 
- **Sin volúmenes** de código fuente
- Imagen **optimizada** con build
- **Mejor rendimiento**
- Comando: `npm run build && npm start`

### **🗄️ Base de Datos PostgreSQL**
- **PostgreSQL 15** Alpine
- **Datos persistentes** en volumen `postgres_data`
- **Health checks** automáticos
- **Puerto 5432** expuesto

## 🏗️ Arquitectura Simplificada

```
Docker Compose Unificado:
├── 🗄️ db (PostgreSQL 15)
│   ├── Puerto: 5432
│   ├── Usuario: postgres/postgres
│   ├── BD: portafolios
│   ├── Volumen: postgres_data (persistente)
│   └── Health check: pg_isready
└── 🌐 app (Next.js)
    ├── Puerto: 3000
    ├── 🔄 Migraciones automáticas
    ├── 🛠️ Desarrollo: hot reload + volúmenes
    ├── 🚀 Producción: optimizado sin volúmenes
    └── 📜 Entrypoint: docker-entrypoint.sh
```

## 🔧 Variables de Entorno

El archivo `.env` se carga automáticamente:

```bash
# Modo de ejecución (automático por script)
NODE_ENV=development  # o production

# Base de datos (configurada automáticamente)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portafolios"

# NextAuth.js (usa tus valores)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"

# OAuth (opcional)
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

## 📋 Comandos Útiles

### **Gestión de Contenedores**
```bash
# Ver estado
docker compose ps

# Ver logs en tiempo real
docker compose logs -f app

# Acceder al contenedor de la app
docker compose exec app sh

# Reiniciar servicios
docker compose restart
```

### **Base de Datos**
```bash
# Acceso directo a PostgreSQL
docker compose exec db psql -U postgres -d portafolios

# O con el script npm
npm run docker:db

# Ver datos
docker compose exec app npx prisma studio

# Ejecutar migraciones manualmente (no necesario)
docker compose exec app npx prisma migrate deploy
```

### **Desarrollo**
```bash
# Instalar nuevas dependencias (requiere rebuild)
docker compose exec app npm install nueva-dependencia

# Ejecutar linting
docker compose exec app npm run lint

# Regenerar cliente Prisma
docker compose exec app npx prisma generate
```

## 🎯 Características Destacadas

### **✨ Simplicidad Extrema**
- **1 comando** para desarrollo: `.\deploy.ps1 -Dev`
- **1 comando** para producción: `.\deploy.ps1 -Prod`
- **Sin configuración manual** de migraciones
- **Variables de entorno automáticas**

### **🔄 Migraciones Inteligentes**
```bash
# En docker-entrypoint.sh:
npx prisma migrate deploy || npx prisma db push
```
- Intenta migraciones primero
- Si fallan, usa `db push` como fallback
- **Siempre funciona** sin intervención manual

### **🛠️ Desarrollo Óptimo**
- **Hot reload** instantáneo
- **Volúmenes montados** para cambios en tiempo real
- **Base de datos persistente** entre reinicios
- **Sin pérdida de datos** durante desarrollo

### **🚀 Producción Lista**
- **Sin volúmenes** de código
- **Build optimizado** de Next.js
- **Imagen mínima** y eficiente
- **Misma configuración** que desarrollo

## 🚨 Solución de Problemas de Conectividad

### **Error de timeout de Docker Registry**
```bash
# Error típico:
# dial tcp 172.64.66.1:443: i/o timeout
# failed to copy: httpReadSeeker: failed open
```

#### **🔧 Soluciones Automáticas (GitHub Actions):**
El workflow incluye:
- ✅ **Reintentos automáticos** (hasta 3 intentos)
- ✅ **Timeouts extendidos** (30 minutos total)
- ✅ **Fallback a imágenes existentes**
- ✅ **Dockerfile alternativo más estable**

#### **🛠️ Soluciones Manuales en el Servidor:**

**1. Script de Recuperación Automática:**
```bash
# En el servidor
cd portafolios
chmod +x recovery-deploy.sh
./recovery-deploy.sh
```

**2. Usar Dockerfile Estable:**
```bash
# Cambiar temporalmente a imagen más estable
cp Dockerfile.stable Dockerfile
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

**3. Usar Imágenes Existentes:**
```bash
# Si ya hay imágenes construidas
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d
```

**4. Configurar Timeouts Extendidos:**
```bash
# Variables de entorno para timeouts largos
export COMPOSE_HTTP_TIMEOUT=1800
export DOCKER_CLIENT_TIMEOUT=1800
export DOCKER_BUILDKIT=1

# Intentar build con timeout extendido
timeout 1800s docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

### **Archivos de Recuperación Disponibles:**
- `Dockerfile` - Imagen principal optimizada
- `Dockerfile.stable` - Imagen alternativa más robusta (node:18-slim)
- `recovery-deploy.sh` - Script automático de recuperación
- `docker-compose.server.yml` - Configuración con límites de recursos

### **Estrategias por Orden de Preferencia:**
1. **🥇 Deploy normal** - GitHub Actions automático
2. **🥈 Deploy con reintentos** - Workflow con 3 intentos
3. **🥉 Script de recuperación** - `./recovery-deploy.sh`
4. **🔧 Dockerfile estable** - `cp Dockerfile.stable Dockerfile`
5. **📦 Imágenes existentes** - `docker compose up -d` (sin --build)

## 🎉 Ventajas de Esta Configuración

### **🎯 Para Desarrolladores**
- **Setup instantáneo** sin configuración manual
- **Hot reload** sin configuración adicional
- **Base de datos incluida** sin instalación local
- **Migraciones automáticas** sin comandos manuales

### **🚀 Para Producción**
- **Mismo entorno** que desarrollo
- **Optimización automática** sin configuración
- **Escalable** con Docker Swarm/Kubernetes
- **Fácil deployment** en cualquier servidor

### **🔧 Para Mantenimiento**
- **Logs centralizados** con `docker compose logs`
- **Backup simple** de volúmenes Docker
- **Rollback fácil** con imágenes versionadas
- **Debugging directo** con `docker compose exec`

---

**¡Docker nunca fue tan simple!** 🐳✨

Un solo comando, configuración automática, y listo para desarrollar o desplegar.