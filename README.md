# Portfolio Tree# Portfolio Tree



> Plataforma moderna para crear y compartir portafolios profesionales con estructura jerárquica interactiva.> Plataforma moderna para crear y compartir portafolios profesionales con estructura jerárquica interactiva.



[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)



## Características Principales## Características Principales



**Organización Visual****Organización Visual**

- Estructura de árbol jerárquica interactiva- Estructura de árbol jerárquica interactiva

- Múltiples layouts: tree, grid, kanban, timeline- Múltiples layouts: tree, grid, kanban, timeline

- Navegación intuitiva y responsive- Navegación intuitiva y responsive



**Sistema Completo de Autenticación****Sistema Completo de Autenticación**

- Login social: GitHub, Google, Facebook- Login social: GitHub, Google, Facebook

- Registro manual con email/contraseña- Registro manual con email/contraseña

- Sesiones seguras con NextAuth.js- Sesiones seguras con NextAuth.js

- URLs únicas personalizadas- URLs únicas personalizadas



**Dashboard de Gestión****Dashboard de Gestión**

- Editor visual para crear contenido- Editor visual para crear contenido

- Gestión de archivos e imágenes- Gestión de archivos e imágenes

- Vista previa en tiempo real- Vista previa en tiempo real

- Control de visibilidad pública/privada- Control de visibilidad pública/privada



**Tipos de Contenido****Tipos de Contenido**

- `CATEGORY` - Organiza en categorías- `CATEGORY` - Organiza en categorías

- `PROJECT` - Proyectos con imágenes y enlaces- `PROJECT` - Proyectos con imágenes y enlaces

- `LANGUAGE` - Tecnologías y lenguajes- `LANGUAGE` - Tecnologías y lenguajes

- `SKILL` - Habilidades técnicas- `SKILL` - Habilidades técnicas

- `EXPERIENCE` - Experiencia laboral- `EXPERIENCE` - Experiencia laboral

- `EDUCATION` - Formación académica- `EDUCATION` - Formación académica

- `DOCUMENTATION` - Recursos y guías- `DOCUMENTATION` - Recursos y guías



## Stack Tecnológico## Stack Tecnológico



### Frontend### Frontend

- Next.js 15 (App Router)- Next.js 15 (App Router)

- React 19- React 19

- TypeScript- TypeScript

- TailwindCSS 4- TailwindCSS 4

- Headless UI- Headless UI

- Heroicons- Heroicons



### Backend### Backend

- Next.js API Routes- Next.js API Routes

- Prisma ORM- Prisma ORM

- NextAuth.js- NextAuth.js

- Vercel Blob Storage- Vercel Blob Storage

- bcryptjs- bcryptjs



### Base de Datos### Base de Datos

- PostgreSQL 15- PostgreSQL 15

- Migraciones Prisma- Migraciones Prisma



## Inicio Rápido## Inicio Rápido



### Opción 1: Docker (Recomendado)### Opción 1: Docker (Recomendado)



```powershell```powershell

# Clonar repositorio# Clonar repositorio

git clone https://github.com/tu-usuario/portfolio-tree.gitgit clone https://github.com/tu-usuario/portfolio-tree.git

cd portfolio-treecd portfolio-tree



# Iniciar en modo desarrollo# Iniciar en modo desarrollo

.\deploy.ps1 -Dev.\deploy.ps1 -Dev



# O en modo producción# O en modo producción

.\deploy.ps1 -Prod.\deploy.ps1 -Prod

``````



**Listo!** Tu aplicación estará en http://localhost:3000**Listo!** Tu aplicación estará en http://localhost:3000



Ver [documentación completa de Docker](./docs/DOCKER.md) para más opciones.Ver [documentación completa de Docker](./docs/DOCKER.md) para más opciones.



### Opción 2: Instalación Manual### Opción 2: Instalación Manual



```bash```bash

# Instalar dependencias# Instalar dependencias

npm installnpm install



# Configurar base de datos# Configurar base de datos

createdb portfolio_treecreatedb portfolio_tree



# Copiar variables de entorno# Copiar variables de entorno

cp .env.example .env.localcp .env.example .env.local

# Editar .env.local con tu configuración# Editar .env.local con tu configuración



# Ejecutar migraciones# Ejecutar migraciones

npx prisma migrate devnpx prisma migrate dev



# Iniciar servidor# Iniciar servidor

npm run devnpm run dev

``````



## Configuración## 📖 Guía de Uso Completa



### Variables de Entorno Requeridas### 🏠 **1. Página Principal**

- **Landing Page** atractiva con call-to-action

```env- **Explorar Portafolios** públicos de otros usuarios

# Base de Datos- **Registro/Login** fácil y rápido

DATABASE_URL="postgresql://usuario:password@localhost:5432/portfolio_tree"

### 👤 **2. Registro de Usuario**

# NextAuth

NEXTAUTH_URL="http://localhost:3000"#### **Método 1: Registro Manual**

NEXTAUTH_SECRET="tu-secreto-generado"1. Haz clic en **"Get Started"** o **"Registrarse"**

2. Completa el formulario:

# GitHub OAuth (opcional)   - **Nombre completo**

GITHUB_CLIENT_ID="tu-client-id"   - **Username** (será tu URL: `/user/tu-username`)

GITHUB_CLIENT_SECRET="tu-client-secret"   - **Email**

   - **Contraseña**

# Vercel Blob (opcional, para producción)3. **¡Automáticamente entrarás al dashboard!**

BLOB_READ_WRITE_TOKEN="tu-token"

```#### **Método 2: OAuth Social**

1. Ve a `/auth/signin`

### Generar Secretos2. Selecciona **"Continue with GitHub"**

3. Autoriza la aplicación

```bash4. Tu username se generará automáticamente

# NEXTAUTH_SECRET

openssl rand -base64 32### 🎛️ **3. Dashboard - Tu Centro de Control**

```

Accede a `/dashboard` para gestionar tu portafolio:

Ver [Configuración de GitHub OAuth](./docs/GITHUB_SETUP.md) para detalles de OAuth.

#### **Vista Principal**

## Estructura del Proyecto- **Resumen** de tu portafolio

- **Estadísticas** de nodos y visitas

```- **Acciones rápidas** para crear contenido

portfolio-tree/

├── app/                    # Next.js App Router#### **Gestión de Nodos**

│   ├── api/               # API endpoints- **Crear Nuevo Nodo**: Botón "+" para añadir contenido

│   ├── auth/              # Autenticación- **Editar Nodos**: Clic en cualquier nodo para editarlo

│   ├── dashboard/         # Panel admin- **Organizar**: Arrastra y suelta para reorganizar (próximamente)

│   ├── explore/           # Explorar comunidad- **Configurar Visibilidad**: Controla qué se muestra públicamente

│   └── user/[username]/   # Perfiles públicos

├── components/            # Componentes React### 📝 **4. Creando Contenido**

│   ├── dashboard/         # Componentes admin

│   ├── portfolio/         # Visualización#### **Tipos de Nodos Disponibles**

│   └── ui/                # Componentes base

├── prisma/                # Base de datos**📁 CATEGORY** - Categorías Principales

│   ├── schema.prisma      # Esquema```

│   └── migrations/        # MigracionesEjemplo: "Desarrollo Web", "Proyectos Mobile", "Diseño UI/UX"

├── lib/                   # Utilidades- Título: nombre de la categoría

├── types/                 # TypeScript types- Descripción: breve explicación

└── public/                # Archivos estáticos- Contenido: información detallada

``````



## Scripts Disponibles**💻 LANGUAGE** - Tecnologías y Lenguajes

```

### DesarrolloEjemplo: "JavaScript", "Python", "React"

```bash- Nivel de experiencia

npm run dev              # Servidor desarrollo- Proyectos relacionados

npm run build           # Build producción- Certificaciones

npm run start           # Servidor producción```

npm run lint            # Linter

```**🚀 PROJECT** - Proyectos Específicos

```

### DockerCampos disponibles:

```powershell- Título y descripción

.\deploy.ps1 -Dev       # Desarrollo- URL del proyecto live

.\deploy.ps1 -Prod      # Producción- Repositorio GitHub

.\deploy.ps1 -Stop      # Detener- URL de demo

.\deploy.ps1 -Clean     # Limpiar datos- Galería de imágenes

```- Tags tecnológicos

- Contenido markdown

### Base de Datos```

```bash

npx prisma studio       # UI visual**⚡ SKILL** - Habilidades

npx prisma migrate dev  # Nueva migración```

npx prisma generate     # Generar clienteEjemplo: "Frontend Development", "Database Design"

```- Nivel: Beginner, Intermediate, Advanced, Expert

- Años de experiencia

## Documentación- Certificaciones

```

- **[Configuración Docker](./docs/DOCKER.md)** - Setup completo con Docker

- **[Sistema de Archivos](./docs/BLOBS.md)** - Gestión de imágenes y archivos**💼 EXPERIENCE** - Experiencia Laboral

- **[GitHub OAuth](./docs/GITHUB_SETUP.md)** - Configurar login con GitHub```

- **[Deployment](./docs/DEPLOYMENT.md)** - Deploy en diferentes entornos- Empresa y posición

- Fechas de inicio y fin

## Despliegue- Responsabilidades

- Logros destacados

### Vercel (Recomendado)- Tecnologías utilizadas

1. Conectar repositorio a Vercel```

2. Configurar variables de entorno

3. Conectar PostgreSQL**🎓 EDUCATION** - Formación

4. Deploy automático```

- Institución

Ver [Guía completa de Deployment](./docs/DEPLOYMENT.md) para más opciones.- Título/Certificación

- Fechas

### Servidor Propio con Docker- Descripción

```bash- Proyectos destacados

# En el servidor```

git clone tu-repo.git

cd portfolio-tree**📚 DOCUMENTATION** - Recursos

```

# Configurar .env- Guías técnicas

cp .env.example .env- Tutoriales

# Editar .env con valores de producción- Referencias

- Links externos

# Iniciar con Docker```

docker compose -f docker-compose.yml -f docker-compose.server.yml up -d

```#### **Editor de Nodos**

- **Interfaz intuitiva** con formularios dinámicos

## Solución de Problemas- **Preview en tiempo real** de cambios

- **Validación automática** de campos

### Errores Comunes- **Guardado automático** de borradores



**Error de conexión a base de datos**### 🌐 **5. Perfil Público**

```bash

# Verificar que PostgreSQL esté corriendoTu portafolio será visible en `/user/tu-username` con:

docker compose ps

```#### **Layouts Disponibles**

- **🌳 Tree View**: Vista jerárquica tradicional

**Error de migraciones**- **📊 Grid Layout**: Vista de tarjetas organizada

```bash- **📋 Kanban**: Estilo tablero Kanban

# Reset y re-aplicar migraciones- **📅 Timeline**: Vista cronológica

npx prisma migrate reset

npx prisma migrate dev#### **Navegación**

```- **Inspector de Nodos**: Panel lateral con detalles

- **Filtros**: Por tipo de contenido, tags, etc.

**Error de build**- **Búsqueda**: Encuentra contenido específico

```bash- **Enlaces directos**: Comparte secciones específicas

# Limpiar cache

rm -rf .next node_modules### 🔍 **6. Explorar Comunidad**

npm install

npm run buildEn `/explore` puedes:

```- **Descubrir** portafolios públicos

- **Inspirarte** con otros profesionales

## Roadmap- **Seguir** tendencias en la comunidad

- **Buscar** por tecnologías o roles

### Próximas Características

- Drag & Drop para reorganizar nodos## 🎨 Personalización y Configuración

- Temas personalizables

- Analytics de visitas### **Configuración de Perfil**

- Exportación a PDF- **Información básica**: Nombre, bio, ubicación

- API pública- **Enlaces sociales**: GitHub, LinkedIn, Website

- Comentarios en portafolios- **Avatar**: Imagen de perfil

- **Configuración de privacidad**

### Futuro

- App móvil nativa### **Personalización Visual**

- Colaboración en equipo- **Temas**: Claro/Oscuro (próximamente)

- Marketplace de plantillas- **Layouts**: Múltiples vistas para tu contenido

- Integración LinkedIn- **Colores**: Personalización de esquema (próximamente)

- AI-powered suggestions

### **SEO y Compartición**

## Contribución- **Meta tags** automáticos

- **Open Graph** para redes sociales

Las contribuciones son bienvenidas! Por favor:- **URLs amigables**

- **Sitemap** generado automáticamente

1. Fork el proyecto

2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)## 🔧 Scripts y Comandos

3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)

4. Push a la rama (`git push origin feature/AmazingFeature`)### **Desarrollo**

5. Abre un Pull Request```bash

npm run dev              # Servidor de desarrollo

### Guíasnpm run build           # Compilar para producción

- Seguir convenciones de código existentesnpm run start           # Servidor de producción

- Añadir tests para nuevas característicasnpm run lint            # Linter ESLint

- Actualizar documentación```

- Commits atómicos y descriptivos

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
