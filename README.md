# Portfolio Tree# Portfolio Tree



> Plataforma moderna para crear y compartir portafolios profesionales con estructura jerárquica interactiva.> Plataforma moderna para crear y compartir portafolios profesionales con estructura jerárquica interactiva.



[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)



## 🚀 Características Principales

## Características Principales

**Organización Visual**

- Estructura de árbol jerárquica interactiva**Organización Visual**

- Múltiples layouts: tree, grid, kanban, timeline- Estructura de árbol jerárquica interactiva

- Navegación intuitiva y responsive- Múltiples layouts: tree, grid, kanban, timeline

- Navegación intuitiva y responsive

**Sistema Completo de Autenticación**

- Login social: GitHub, Google**Sistema Completo de Autenticación**

- Registro manual con email/contraseña- Login social: GitHub, Google, Facebook

- Sesiones seguras con NextAuth.js- Registro manual con email/contraseña

- URLs únicas personalizadas- Sesiones seguras con NextAuth.js

- URLs únicas personalizadas

**Dashboard de Gestión**

- Editor visual para crear contenido**Dashboard de Gestión**

- Gestión de archivos e imágenes- Editor visual para crear contenido

- Vista previa en tiempo real- Gestión de archivos e imágenes

- Control de visibilidad pública/privada- Vista previa en tiempo real

- Control de visibilidad pública/privada

**Tipos de Contenido**

- `CATEGORY` - Organiza en categorías**Tipos de Contenido**

- `PROJECT` - Proyectos con imágenes y enlaces- `CATEGORY` - Organiza en categorías

- `LANGUAGE` - Tecnologías y lenguajes- `PROJECT` - Proyectos con imágenes y enlaces

- `SKILL` - Habilidades técnicas- `LANGUAGE` - Tecnologías y lenguajes

- `EXPERIENCE` - Experiencia laboral- `SKILL` - Habilidades técnicas

- `EDUCATION` - Formación académica- `EXPERIENCE` - Experiencia laboral

- `DOCUMENTATION` - Recursos y guías- `EDUCATION` - Formación académica

- `DOCUMENTATION` - Recursos y guías

## 🛠️ Stack Tecnológico



### Frontend## Stack Tecnológico

- Next.js 15 (App Router)

- React 19### Frontend

- TypeScript- Next.js 15 (App Router)

- TailwindCSS 4- React 19

- Headless UI- TypeScript

- Heroicons- TailwindCSS 4

- Headless UI

### Backend- Heroicons

- Next.js API Routes

- Prisma ORM### Backend

- NextAuth.js- Next.js API Routes

- Vercel Blob Storage- Prisma ORM

- bcryptjs- NextAuth.js

- Vercel Blob Storage

### Base de Datos- bcryptjs

- PostgreSQL 15

- Migraciones Prisma### Base de Datos

- PostgreSQL 15

## ⚡ Inicio Rápido- Migraciones Prisma



### Opción 1: Docker (Recomendado)

## Inicio Rápido

```powershell

# Clonar repositorio### Opción 1: Docker (Recomendado)

git clone https://github.com/hugocis/portafolio.git

cd portafolio```powershell

# Clonar repositorio

# Iniciar en modo desarrollogit clone https://github.com/hugocis/portafolio.git

.\deploy.ps1 -Devcd portafolio



# O en modo producción# Iniciar en modo desarrollo

.\deploy.ps1 -Prod.\deploy.ps1 -Dev

```

# O en modo producción

**¡Listo!** Tu aplicación estará en http://localhost:3000.\deploy.ps1 -Prod

```

Ver [documentación completa de Docker](./docs/DOCKER.md) para más opciones.

**Listo!** Tu aplicación estará en http://localhost:3000

### Opción 2: Instalación Manual

Ver [documentación completa de Docker](./docs/DOCKER.md) para más opciones.

```bash

# Instalar dependencias### Opción 2: Instalación Manual

npm install

```bash

# Configurar base de datos# Instalar dependencias

createdb portfolio_treenpm install



# Copiar variables de entorno# Configurar base de datos

cp .env.example .env.localcreatedb portfolio_tree

# Editar .env.local con tu configuración

# Copiar variables de entorno

# Ejecutar migracionescp .env.example .env.local

npx prisma migrate dev# Editar .env.local con tu configuración



# Iniciar servidor# Ejecutar migraciones

npm run devnpx prisma migrate dev

```

# Iniciar servidor

## ⚙️ Configuraciónnpm run dev

```

### Variables de Entorno Requeridas



```env## Configuración

# Base de Datos

DATABASE_URL="postgresql://usuario:password@localhost:5432/portfolio_tree"### Variables de Entorno Requeridas



# NextAuth```env

NEXTAUTH_URL="http://localhost:3000"# Base de Datos

NEXTAUTH_SECRET="tu-secreto-generado"DATABASE_URL="postgresql://usuario:password@localhost:5432/portfolio_tree"



# GitHub OAuth (opcional)# NextAuth

OAUTH_GITHUB_ID="tu-client-id"NEXTAUTH_URL="http://localhost:3000"

OAUTH_GITHUB_SECRET="tu-client-secret"NEXTAUTH_SECRET="tu-secreto-generado"



# Google OAuth (opcional)# GitHub OAuth (opcional)

GOOGLE_CLIENT_ID="tu-client-id"GITHUB_CLIENT_ID="tu-client-id"

GOOGLE_CLIENT_SECRET="tu-client-secret"GITHUB_CLIENT_SECRET="tu-client-secret"



# Vercel Blob (opcional, para producción)# Vercel Blob (opcional, para producción)

BLOB_READ_WRITE_TOKEN="tu-token"BLOB_READ_WRITE_TOKEN="tu-token"

``````



### Generar Secretos### Generar Secretos



```bash```bash

# NEXTAUTH_SECRET# NEXTAUTH_SECRET

openssl rand -base64 32openssl rand -base64 32

``````



Ver [Configuración de GitHub OAuth](./docs/GITHUB_SETUP.md) para detalles de OAuth.Ver [Configuración de GitHub OAuth](./docs/GITHUB_SETUP.md) para detalles de OAuth.



## 📖 Guía de Uso#### **Vista Principal**



### 🏠 Página Principal## Estructura del Proyecto- **Resumen** de tu portafolio

- Landing page con presentación del proyecto

- Explorar portafolios públicos- **Estadísticas** de nodos y visitas

- Registro/Login rápido

```- **Acciones rápidas** para crear contenido

### 👤 Registro de Usuario

portfolio-tree/

**Método 1: Registro Manual**

1. Completa el formulario con nombre, username, email y contraseña├── app/                    # Next.js App Router#### **Gestión de Nodos**

2. Tu username será tu URL: `/user/tu-username`

3. Automáticamente accederás al dashboard│   ├── api/               # API endpoints- **Crear Nuevo Nodo**: Botón "+" para añadir contenido



**Método 2: OAuth Social**│   ├── auth/              # Autenticación- **Editar Nodos**: Clic en cualquier nodo para editarlo

1. Selecciona "Continue with GitHub/Google"

2. Autoriza la aplicación│   ├── dashboard/         # Panel admin- **Organizar**: Arrastra y suelta para reorganizar (próximamente)

3. Username generado automáticamente

│   ├── explore/           # Explorar comunidad- **Configurar Visibilidad**: Controla qué se muestra públicamente

### 🎛️ Dashboard

│   └── user/[username]/   # Perfiles públicos

**Vista Principal**

- Resumen de tu portafolio├── components/            # Componentes React### 📝 **4. Creando Contenido**

- Estadísticas de nodos

- Acciones rápidas para crear contenido│   ├── dashboard/         # Componentes admin



**Gestión de Nodos**│   ├── portfolio/         # Visualización#### **Tipos de Nodos Disponibles**

- Crear nuevo nodo con botón "+"

- Editar haciendo clic en cualquier nodo│   └── ui/                # Componentes base

- Configurar visibilidad pública/privada

├── prisma/                # Base de datos**📁 CATEGORY** - Categorías Principales

### 📝 Tipos de Contenido

│   ├── schema.prisma      # Esquema```

**📁 CATEGORY** - Categorías Principales

- Organiza tu contenido en secciones│   └── migrations/        # MigracionesEjemplo: "Desarrollo Web", "Proyectos Mobile", "Diseño UI/UX"

- Título, descripción y contenido detallado

├── lib/                   # Utilidades- Título: nombre de la categoría

**💻 LANGUAGE** - Tecnologías y Lenguajes

- Nivel de experiencia├── types/                 # TypeScript types- Descripción: breve explicación

- Proyectos relacionados

- Certificaciones└── public/                # Archivos estáticos- Contenido: información detallada



**🚀 PROJECT** - Proyectos``````

- URL del proyecto y repositorio

- Galería de imágenes

- Tags tecnológicos

- Contenido markdown## Scripts Disponibles**💻 LANGUAGE** - Tecnologías y Lenguajes



**⚡ SKILL** - Habilidades```

- Nivel: Beginner, Intermediate, Advanced, Expert

- Años de experiencia### DesarrolloEjemplo: "JavaScript", "Python", "React"

- Certificaciones

```bash- Nivel de experiencia

**💼 EXPERIENCE** - Experiencia Laboral

- Empresa y posiciónnpm run dev              # Servidor desarrollo- Proyectos relacionados

- Fechas de inicio y fin

- Responsabilidades y logrosnpm run build           # Build producción- Certificaciones

- Tecnologías utilizadas

npm run start           # Servidor producción```

**🎓 EDUCATION** - Formación

- Instituciónnpm run lint            # Linter

- Título/Certificación

- Fechas y descripción```**🚀 PROJECT** - Proyectos Específicos

- Proyectos destacados

```

**📚 DOCUMENTATION** - Recursos

- Guías técnicas### DockerCampos disponibles:

- Tutoriales

- Referencias```powershell- Título y descripción

- Links externos

.\deploy.ps1 -Dev       # Desarrollo- URL del proyecto live

### 🌐 Perfil Público

.\deploy.ps1 -Prod      # Producción- Repositorio GitHub

Tu portafolio visible en `/user/tu-username` con:

.\deploy.ps1 -Stop      # Detener- URL de demo

**Layouts Disponibles**

- 🌳 **Tree View**: Vista jerárquica tradicional.\deploy.ps1 -Clean     # Limpiar datos- Galería de imágenes

- 📊 **Grid Layout**: Vista de tarjetas organizada

- 📋 **Kanban**: Estilo tablero Kanban```- Tags tecnológicos

- 📅 **Timeline**: Vista cronológica

- Contenido markdown

## 📁 Estructura del Proyecto

### Base de Datos```

```

portafolios/```bash

├── 📁 app/                    # Next.js App Router

│   ├── 📁 api/               # Endpoints de APInpx prisma studio       # UI visual**⚡ SKILL** - Habilidades

│   │   ├── auth/             # Autenticación

│   │   ├── nodes/            # CRUD de nodosnpx prisma migrate dev  # Nueva migración```

│   │   ├── blobs/            # Gestión de archivos

│   │   └── users/            # Gestión de usuariosnpx prisma generate     # Generar clienteEjemplo: "Frontend Development", "Database Design"

│   ├── 📁 auth/              # Páginas de autenticación

│   ├── 📁 dashboard/         # Panel de administración```- Nivel: Beginner, Intermediate, Advanced, Expert

│   ├── 📁 explore/           # Explorar comunidad

│   ├── 📁 user/[username]/   # Perfiles públicos- Años de experiencia

│   ├── layout.tsx           # Layout raíz

│   ├── page.tsx             # Página principal## Documentación- Certificaciones

│   └── globals.css          # Estilos globales

├── 📁 components/            # Componentes React```

│   ├── 📁 dashboard/        # Componentes del dashboard

│   ├── 📁 portfolio/        # Visualización de portafolios- **[Configuración Docker](./docs/DOCKER.md)** - Setup completo con Docker

│   ├── 📁 providers/        # Context providers

│   └── 📁 ui/               # Componentes UI base- **[Sistema de Archivos](./docs/BLOBS.md)** - Gestión de imágenes y archivos**💼 EXPERIENCE** - Experiencia Laboral

├── 📁 hooks/                # Custom React hooks

├── 📁 lib/                  # Utilidades y configuraciones- **[GitHub OAuth](./docs/GITHUB_SETUP.md)** - Configurar login con GitHub```

│   ├── auth.ts             # Configuración NextAuth

│   └── prisma.ts           # Cliente Prisma- **[Deployment](./docs/DEPLOYMENT.md)** - Deploy en diferentes entornos- Empresa y posición

├── 📁 prisma/              # Esquema y migraciones

│   ├── schema.prisma       # Esquema de base de datos- Fechas de inicio y fin

│   └── migrations/         # Archivos de migración

├── 📁 types/               # Definiciones TypeScript## Despliegue- Responsabilidades

├── 📁 public/              # Archivos estáticos

├── 📁 docs/                # Documentación- Logros destacados

├── 🐳 Dockerfile            # Imagen Docker

├── 🐳 docker-compose.yml    # Configuración Docker base### Vercel (Recomendado)- Tecnologías utilizadas

├── 🐳 docker-compose.server.yml # Override para servidor

├── 🐳 docker-entrypoint.sh  # Script de inicialización1. Conectar repositorio a Vercel```

├── 📜 deploy.ps1           # Script de despliegue Windows

└── 📝 README.md            # Este archivo2. Configurar variables de entorno

```

3. Conectar PostgreSQL**🎓 EDUCATION** - Formación

## 🔧 Scripts Disponibles

4. Deploy automático```

### Desarrollo

```bash- Institución

npm run dev              # Servidor de desarrollo

npm run build           # Compilar para producciónVer [Guía completa de Deployment](./docs/DEPLOYMENT.md) para más opciones.- Título/Certificación

npm run start           # Servidor de producción

npm run lint            # Linter ESLint- Fechas

```

### Servidor Propio con Docker- Descripción

### Docker

```powershell```bash- Proyectos destacados

# Desarrollo (hot reload)

.\deploy.ps1 -Dev# En el servidor```



# Produccióngit clone tu-repo.git

.\deploy.ps1 -Prod  

cd portfolio-tree**📚 DOCUMENTATION** - Recursos

# Gestión

.\deploy.ps1 -Stop     # Detener contenedores```

.\deploy.ps1 -Clean    # Limpiar datos y volúmenes

```# Configurar .env- Guías técnicas



### Base de Datoscp .env.example .env- Tutoriales

```bash

npx prisma studio              # Interface visual# Editar .env con valores de producción- Referencias

npx prisma migrate dev         # Nueva migración

npx prisma migrate deploy      # Desplegar migraciones- Links externos

npx prisma generate           # Generar cliente

```# Iniciar con Docker```



## 📚 Documentacióndocker compose -f docker-compose.yml -f docker-compose.server.yml up -d



- **[Configuración Docker](./docs/DOCKER.md)** - Setup completo con Docker```#### **Editor de Nodos**

- **[Sistema de Archivos](./docs/BLOBS.md)** - Gestión de imágenes y archivos

- **[GitHub OAuth](./docs/GITHUB_SETUP.md)** - Configurar login con GitHub- **Interfaz intuitiva** con formularios dinámicos

- **[Deployment](./docs/DEPLOYMENT.md)** - Deploy en diferentes entornos

- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Solución de problemas comunes## Solución de Problemas- **Preview en tiempo real** de cambios



## 🚀 Despliegue- **Validación automática** de campos



### Vercel (Recomendado)### Errores Comunes- **Guardado automático** de borradores

1. Conecta tu repositorio a Vercel

2. Configura variables de entorno

3. Conecta base de datos PostgreSQL

4. Deploy automático con cada push**Error de conexión a base de datos**### 🌐 **5. Perfil Público**



### Servidor Propio con Docker```bash

```bash

# En el servidor# Verificar que PostgreSQL esté corriendoTu portafolio será visible en `/user/tu-username` con:

git clone https://github.com/hugocis/portafolio.git

cd portafoliodocker compose ps



# Configurar .env```#### **Layouts Disponibles**

cp .env.example .env

# Editar .env con valores de producción- **🌳 Tree View**: Vista jerárquica tradicional



# Iniciar con Docker**Error de migraciones**- **📊 Grid Layout**: Vista de tarjetas organizada

docker compose -f docker-compose.yml -f docker-compose.server.yml up -d

```bash- **📋 Kanban**: Estilo tablero Kanban

# Ejecutar migraciones

docker compose exec app npx prisma migrate deploy# Reset y re-aplicar migraciones- **📅 Timeline**: Vista cronológica

```

npx prisma migrate reset

Ver [Guía completa de Deployment](./docs/DEPLOYMENT.md) para más opciones.

npx prisma migrate dev#### **Navegación**

## 🚨 Solución de Problemas

```- **Inspector de Nodos**: Panel lateral con detalles

### Error de conexión a base de datos

```bash- **Filtros**: Por tipo de contenido, tags, etc.

# Verificar que PostgreSQL esté corriendo

docker compose ps**Error de build**- **Búsqueda**: Encuentra contenido específico



# Ver logs```bash- **Enlaces directos**: Comparte secciones específicas

docker compose logs db

```# Limpiar cache



### Error de migracionesrm -rf .next node_modules### 🔍 **6. Explorar Comunidad**

```bash

# Reset y re-aplicar migracionesnpm install

npx prisma migrate reset

npx prisma migrate devnpm run buildEn `/explore` puedes:

```

```- **Descubrir** portafolios públicos

### Error de build

```bash- **Inspirarte** con otros profesionales

# Limpiar cache

rm -rf .next node_modules## Roadmap- **Seguir** tendencias en la comunidad

npm install

npm run build- **Buscar** por tecnologías o roles

```

### Próximas Características

Ver [Troubleshooting completo](./docs/TROUBLESHOOTING.md) para más detalles.

- Drag & Drop para reorganizar nodos## 🎨 Personalización y Configuración

## 🛣️ Roadmap

- Temas personalizables

### Próximas Características

- [ ] Drag & Drop para reorganizar nodos- Analytics de visitas### **Configuración de Perfil**

- [ ] Temas personalizables (claro/oscuro)

- [ ] Subida de imágenes integrada- Exportación a PDF- **Información básica**: Nombre, bio, ubicación

- [ ] Analytics de visitas

- [ ] Comentarios en portafolios- API pública- **Enlaces sociales**: GitHub, LinkedIn, Website

- [ ] Exportación a PDF

- [ ] API pública- Comentarios en portafolios- **Avatar**: Imagen de perfil



### Futuro- **Configuración de privacidad**

- [ ] Colaboración en equipo

- [ ] Marketplace de plantillas### Futuro

- [ ] Integración con LinkedIn

- [ ] App móvil nativa- App móvil nativa### **Personalización Visual**

- [ ] AI-powered suggestions

- Colaboración en equipo- **Temas**: Claro/Oscuro (próximamente)

## 🤝 Contribución

- Marketplace de plantillas- **Layouts**: Múltiples vistas para tu contenido

¡Las contribuciones son bienvenidas! Por favor:

- Integración LinkedIn- **Colores**: Personalización de esquema (próximamente)

1. **Fork** el proyecto

2. **Crea** una rama feature (`git checkout -b feature/AmazingFeature`)- AI-powered suggestions

3. **Commit** tus cambios (`git commit -m 'Add AmazingFeature'`)

4. **Push** a la rama (`git push origin feature/AmazingFeature`)### **SEO y Compartición**

5. **Abre** un Pull Request

## Contribución- **Meta tags** automáticos

### Guías de Contribución

- Sigue las convenciones de código existentes- **Open Graph** para redes sociales

- Añade tests para nuevas características

- Actualiza documentación cuando sea necesarioLas contribuciones son bienvenidas! Por favor:- **URLs amigables**

- Mantén commits atómicos y descriptivos

- **Sitemap** generado automáticamente

## 📄 Licencia

1. Fork el proyecto

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)## 🔧 Scripts y Comandos

## 🙏 Agradecimientos

3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)

- **Next.js** por el increíble framework

- **Prisma** por la excelente abstracción de BD4. Push a la rama (`git push origin feature/AmazingFeature`)### **Desarrollo**

- **TailwindCSS** por hacer el CSS divertido otra vez

- **Vercel** por el hosting y deployment excepcional5. Abre un Pull Request```bash



## 📞 Contacto y Soportenpm run dev              # Servidor de desarrollo



- **Repositorio**: [github.com/hugocis/portafolio](https://github.com/hugocis/portafolio)### Guíasnpm run build           # Compilar para producción

- **Issues**: [GitHub Issues](https://github.com/hugocis/portafolio/issues)

- **Documentación**: Ver carpeta `/docs` para guías detalladas- Seguir convenciones de código existentesnpm run start           # Servidor de producción



---- Añadir tests para nuevas característicasnpm run lint            # Linter ESLint



**Portfolio Tree** 🌳 - *Construye y comparte tu historia profesional de manera visual*- Actualizar documentación```



Desarrollado con ❤️ usando Next.js, React, y TypeScript- Commits atómicos y descriptivos


### **Docker**

## Licencia```powershell

# Desarrollo (hot reload)

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles..\deploy.ps1 -Dev

npm run docker:dev

## Contacto y Soporte

# Producción

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/portfolio-tree/issues).\deploy.ps1 -Prod  

- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/portfolio-tree/discussions)npm run docker:prod

- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/portfolio-tree/wiki)

# Gestión

---.\deploy.ps1 -Stop     # Detener

.\deploy.ps1 -Clean    # Limpiar datos

**Portfolio Tree** - *Construye y comparte tu historia profesional de manera visual*npm run docker:logs    # Ver logs

npm run docker:db      # Acceder a PostgreSQL

Desarrollado con Next.js, React, y TypeScript```


### **Base de Datos**
```bash
npx prisma studio              # Interface visual
npx prisma migrate dev         # Nueva migración
npx prisma migrate deploy      # Desplegar migraciones
npx prisma generate           # Generar cliente
npx prisma db seed            # Poblar con datos de prueba
```

## 📁 Estructura del Proyecto

```
portfolio-tree/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # Endpoints de API
│   │   ├── auth/             # Autenticación
│   │   ├── nodes/            # CRUD de nodos
│   │   └── users/            # Gestión de usuarios
│   ├── 📁 auth/              # Páginas de autenticación
│   ├── 📁 dashboard/         # Panel de administración
│   ├── 📁 explore/           # Explorar comunidad
│   ├── 📁 user/[username]/   # Perfiles públicos
│   ├── layout.tsx           # Layout raíz
│   ├── page.tsx             # Página principal
│   └── globals.css          # Estilos globales
├── 📁 components/            # Componentes React
│   ├── 📁 dashboard/        # Componentes del dashboard
│   ├── 📁 portfolio/        # Visualización de portafolios
│   ├── 📁 providers/        # Context providers
│   └── 📁 ui/               # Componentes UI base
├── 📁 hooks/                # Custom React hooks
├── 📁 lib/                  # Utilidades y configuraciones
│   ├── auth.ts             # Configuración NextAuth
│   └── prisma.ts           # Cliente Prisma
├── 📁 prisma/              # Esquema y migraciones
│   ├── schema.prisma       # Esquema de base de datos
│   └── migrations/         # Archivos de migración
├── 📁 types/               # Definiciones TypeScript
├── 📁 public/              # Archivos estáticos
├── 🐳 Dockerfile            # Imagen Docker unificada
├── 🐳 docker-compose.yml    # Configuración principal
├── 🐳 docker-compose.prod.yml # Override para producción
├── 🐳 docker-entrypoint.sh  # Script de inicialización
├── 📜 deploy.ps1           # Script de despliegue Windows
└── 📝 README.md            # Este archivo
```

## 🚀 Despliegue

### **Vercel (Recomendado para Next.js)**
1. Conecta tu repositorio a Vercel
2. Configura variables de entorno
3. Conecta base de datos PostgreSQL
4. ¡Deploy automático!

### **Docker en Servidor**
```bash
# Clona el repo en el servidor
git clone tu-repo.git
cd portfolio-tree

# Configura variables de entorno
cp .env.example .env.local
# Edita con configuración de producción

# Inicia con Docker
docker-compose up -d

# Ejecuta migraciones
docker-compose exec app npx prisma migrate deploy
```

## 🚨 **Solución de Problemas de Deployment**

### **❌ Error de DNS en GitHub Actions**
Si ves errores como:
```
dial tcp: lookup herokku.duckdns.org: i/o timeout
```

#### **🔍 Diagnóstico Local:**
```powershell
# Ejecutar diagnóstico de conectividad
.\diagnose-connectivity.ps1
```

#### **✅ Soluciones:**

**1. Verificar hostname correcto:**
- Confirmar que `herokku.duckdns.org` es la dirección correcta
- Verificar con el administrador del servidor

**2. Usar IP directa (si conoces la IP):**
```bash
# En GitHub Secrets, añadir:
SERVER_IP=xxx.xxx.xxx.xxx
```

**3. Configurar DNS alternativos:**
```bash
# En tu .env local para testing
SERVER_HOST=IP_DEL_SERVIDOR
```

**4. Deployment manual de emergencia:**
```bash
# Si GitHub Actions falla, usar SSH directo:
ssh usuario@herokku.duckdns.org -p 7122
cd portafolios
git pull origin main
docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build
```

### **🔧 Scripts de Diagnóstico Disponibles:**
- `diagnose-connectivity.ps1` - Test completo de conectividad
- `recovery-deploy.sh` - Deployment con múltiples estrategias
- `deploy.ps1 -Server` - Test local de configuración del servidor

## 🛣️ Roadmap

### **🎯 Próximas Características**
- [ ] **Drag & Drop** para reorganizar nodos
- [ ] **Temas personalizables** (claro/oscuro)
- [ ] **Subida de imágenes** integrada
- [ ] **Analytics** de visitas y engagement
- [ ] **Comentarios** en portafolios públicos
- [ ] **Plantillas** predefinidas de portafolios
- [ ] **Exportación** a PDF
- [ ] **API pública** para integraciones

### **🔮 Futuro Lejano**
- [ ] **Colaboración** en portafolios de equipo
- [ ] **Marketplace** de plantillas
- [ ] **Integración** con LinkedIn/GitHub
- [ ] **App móvil** nativa
- [ ] **AI-powered** suggestions
- [ ] **Portfolio analytics** avanzado

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crea** una rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### **Guías de Contribución**
- Sigue las convenciones de código existentes
- Añade tests para nuevas características
- Actualiza documentación cuando sea necesario
- Mantén commits atómicos y descriptivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Next.js** por el increíble framework
- **Prisma** por la excelente abstracción de BD
- **TailwindCSS** por hacer el CSS divertido otra vez
- **Vercel** por el hosting y deployment excepcional

## 📞 Contacto y Soporte

- **Documentación**: [Consulta DOCKER.md](./DOCKER.md) para Docker
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/portfolio-tree/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/portfolio-tree/discussions)

---

**Portfolio Tree** 🌳 - *Construye y comparte tu historia profesional de manera visual*

Desarrollado con ❤️ usando Next.js, React, y TypeScript
