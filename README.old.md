# Portfolio Tree

> Plataforma moderna para crear y compartir portafolios profesionales con estructura jerárquica interactiva.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## Características Principales

**Organización Visual**
- Estructura de árbol jerárquica interactiva
- Múltiples layouts: tree, grid, kanban, timeline
- Navegación intuitiva y responsive

**Sistema Completo de Autenticación**
- Login social: GitHub, Google, Facebook
- Registro manual con email/contraseña
- Sesiones seguras con NextAuth.js
- URLs únicas personalizadas

**Dashboard de Gestión**
- Editor visual para crear contenido
- Gestión de archivos e imágenes
- Vista previa en tiempo real
- Control de visibilidad pública/privada

**Tipos de Contenido**
- `CATEGORY` - Organiza en categorías
- `PROJECT` - Proyectos con imágenes y enlaces
- `LANGUAGE` - Tecnologías y lenguajes
- `SKILL` - Habilidades técnicas
- `EXPERIENCE` - Experiencia laboral
- `EDUCATION` - Formación académica
- `DOCUMENTATION` - Recursos y guías

## Stack Tecnológico

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS 4
- Headless UI
- Heroicons

### Backend
- Next.js API Routes
- Prisma ORM
- NextAuth.js
- Vercel Blob Storage
- bcryptjs

### Base de Datos
- PostgreSQL 15
- Migraciones Prisma

## Inicio Rápido

### Opción 1: Docker (Recomendado)

```powershell
# Clonar repositorio
git clone https://github.com/tu-usuario/portfolio-tree.git
cd portfolio-tree

# Iniciar en modo desarrollo
.\deploy.ps1 -Dev

# O en modo producción
.\deploy.ps1 -Prod
```

**Listo!** Tu aplicación estará en http://localhost:3000

Ver [documentación completa de Docker](./docs/DOCKER.md) para más opciones.

### Opción 2: Instalación Manual

```bash
# Instalar dependencias
npm install

# Configurar base de datos
createdb portfolio_tree

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu configuración

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

## 📖 Guía de Uso Completa

### 🏠 **1. Página Principal**
- **Landing Page** atractiva con call-to-action
- **Explorar Portafolios** públicos de otros usuarios
- **Registro/Login** fácil y rápido

### 👤 **2. Registro de Usuario**

#### **Método 1: Registro Manual**
1. Haz clic en **"Get Started"** o **"Registrarse"**
2. Completa el formulario:
   - **Nombre completo**
   - **Username** (será tu URL: `/user/tu-username`)
   - **Email**
   - **Contraseña**
3. **¡Automáticamente entrarás al dashboard!**

#### **Método 2: OAuth Social**
1. Ve a `/auth/signin`
2. Selecciona **"Continue with GitHub"**
3. Autoriza la aplicación
4. Tu username se generará automáticamente

### 🎛️ **3. Dashboard - Tu Centro de Control**

Accede a `/dashboard` para gestionar tu portafolio:

#### **Vista Principal**
- **Resumen** de tu portafolio
- **Estadísticas** de nodos y visitas
- **Acciones rápidas** para crear contenido

#### **Gestión de Nodos**
- **Crear Nuevo Nodo**: Botón "+" para añadir contenido
- **Editar Nodos**: Clic en cualquier nodo para editarlo
- **Organizar**: Arrastra y suelta para reorganizar (próximamente)
- **Configurar Visibilidad**: Controla qué se muestra públicamente

### 📝 **4. Creando Contenido**

#### **Tipos de Nodos Disponibles**

**📁 CATEGORY** - Categorías Principales
```
Ejemplo: "Desarrollo Web", "Proyectos Mobile", "Diseño UI/UX"
- Título: nombre de la categoría
- Descripción: breve explicación
- Contenido: información detallada
```

**💻 LANGUAGE** - Tecnologías y Lenguajes
```
Ejemplo: "JavaScript", "Python", "React"
- Nivel de experiencia
- Proyectos relacionados
- Certificaciones
```

**🚀 PROJECT** - Proyectos Específicos
```
Campos disponibles:
- Título y descripción
- URL del proyecto live
- Repositorio GitHub
- URL de demo
- Galería de imágenes
- Tags tecnológicos
- Contenido markdown
```

**⚡ SKILL** - Habilidades
```
Ejemplo: "Frontend Development", "Database Design"
- Nivel: Beginner, Intermediate, Advanced, Expert
- Años de experiencia
- Certificaciones
```

**💼 EXPERIENCE** - Experiencia Laboral
```
- Empresa y posición
- Fechas de inicio y fin
- Responsabilidades
- Logros destacados
- Tecnologías utilizadas
```

**🎓 EDUCATION** - Formación
```
- Institución
- Título/Certificación
- Fechas
- Descripción
- Proyectos destacados
```

**📚 DOCUMENTATION** - Recursos
```
- Guías técnicas
- Tutoriales
- Referencias
- Links externos
```

#### **Editor de Nodos**
- **Interfaz intuitiva** con formularios dinámicos
- **Preview en tiempo real** de cambios
- **Validación automática** de campos
- **Guardado automático** de borradores

### 🌐 **5. Perfil Público**

Tu portafolio será visible en `/user/tu-username` con:

#### **Layouts Disponibles**
- **🌳 Tree View**: Vista jerárquica tradicional
- **📊 Grid Layout**: Vista de tarjetas organizada
- **📋 Kanban**: Estilo tablero Kanban
- **📅 Timeline**: Vista cronológica

#### **Navegación**
- **Inspector de Nodos**: Panel lateral con detalles
- **Filtros**: Por tipo de contenido, tags, etc.
- **Búsqueda**: Encuentra contenido específico
- **Enlaces directos**: Comparte secciones específicas

### 🔍 **6. Explorar Comunidad**

En `/explore` puedes:
- **Descubrir** portafolios públicos
- **Inspirarte** con otros profesionales
- **Seguir** tendencias en la comunidad
- **Buscar** por tecnologías o roles

## 🎨 Personalización y Configuración

### **Configuración de Perfil**
- **Información básica**: Nombre, bio, ubicación
- **Enlaces sociales**: GitHub, LinkedIn, Website
- **Avatar**: Imagen de perfil
- **Configuración de privacidad**

### **Personalización Visual**
- **Temas**: Claro/Oscuro (próximamente)
- **Layouts**: Múltiples vistas para tu contenido
- **Colores**: Personalización de esquema (próximamente)

### **SEO y Compartición**
- **Meta tags** automáticos
- **Open Graph** para redes sociales
- **URLs amigables**
- **Sitemap** generado automáticamente

## 🔧 Scripts y Comandos

### **Desarrollo**
```bash
npm run dev              # Servidor de desarrollo
npm run build           # Compilar para producción
npm run start           # Servidor de producción
npm run lint            # Linter ESLint
```

### **Docker**
```powershell
# Desarrollo (hot reload)
.\deploy.ps1 -Dev
npm run docker:dev

# Producción
.\deploy.ps1 -Prod  
npm run docker:prod

# Gestión
.\deploy.ps1 -Stop     # Detener
.\deploy.ps1 -Clean    # Limpiar datos
npm run docker:logs    # Ver logs
npm run docker:db      # Acceder a PostgreSQL
```

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
