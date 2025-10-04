# 🌳 Portfolio Tree

Una aplicación web moderna para crear y compartir portafolios profesionales con estructura de árbol interactiva. Organiza tu contenido profesional de manera visual y jerárquica, perfecto para desarrolladores, diseñadores y cualquier profesional que quiera mostrar su trabajo de forma estructurada.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Características Principales

### 🌟 **Organización Visual**
- **Estructura de Árbol Interactiva**: Visualiza tu portafolio como un árbol jerárquico navegable
- **Múltiples Layouts**: Vista de árbol, grid, kanban y timeline
- **Drag & Drop**: Reorganiza tu contenido fácilmente (próximamente)
- **Navegación Intuitiva**: Explora el contenido de manera natural

### 🔐 **Sistema de Autenticación**
- **Login Social**: GitHub, Google, Facebook
- **Registro Manual**: Sistema tradicional de email/contraseña
- **Sesiones Seguras**: Manejo de sesiones con NextAuth.js
- **Perfiles Personalizados**: URLs únicas para cada usuario

### 📊 **Dashboard de Gestión**
- **Editor Visual**: Crea y edita contenido con interfaz intuitiva
- **Gestión de Nodos**: Añade, edita y organiza diferentes tipos de contenido
- **Vista Previa**: Ve cómo se verá tu portafolio antes de publicar
- **Configuración de Visibilidad**: Controla qué contenido es público

### 🎨 **Tipos de Contenido Flexibles**
- **📁 CATEGORY**: Organiza tu contenido en categorías principales
- **💻 LANGUAGE**: Muestra lenguajes de programación y tecnologías
- **🚀 PROJECT**: Proyectos con enlaces, demos e imágenes
- **⚡ SKILL**: Habilidades técnicas y competencias
- **💼 EXPERIENCE**: Experiencia laboral y logros
- **🎓 EDUCATION**: Formación académica y certificaciones
- **📚 DOCUMENTATION**: Recursos, guías y documentación

### 🌐 **Perfiles Públicos**
- **URLs Personalizadas**: `tudominio.com/user/tu-username`
- **Compartición Social**: Enlaces directos a secciones específicas
- **SEO Optimizado**: Metadatos y estructura optimizada para buscadores
- **Responsive**: Perfecto en desktop, tablet y móvil

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **TailwindCSS 4** - Framework CSS utilitario
- **Headless UI** - Componentes accesibles sin estilos
- **Heroicons** - Iconografía moderna

### **Backend**
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Abstracción de base de datos type-safe
- **NextAuth.js** - Autenticación completa
- **bcryptjs** - Hashing seguro de contraseñas

### **Base de Datos**
- **PostgreSQL** - Base de datos relacional robusta
- **Migraciones Prisma** - Control de versiones de esquema
- **Índices Optimizados** - Rendimiento mejorado

### **Herramientas de Desarrollo**
- **ESLint** - Linting y calidad de código
- **Docker** - Containerización completa
- **Hot Reload** - Desarrollo ágil

## 🚀 Guía de Instalación

### 📋 **Prerrequisitos**

- **Node.js** 18 o superior
- **PostgreSQL** 14 o superior
- **npm** o **yarn**
- **Git** (recomendado)

### 🐳 **Opción 1: Instalación con Docker (Recomendado)**

```powershell
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/portfolio-tree.git
cd portfolio-tree

# 2. Configura variables de entorno (opcional)
cp .env.example .env
# Edita .env si necesitas configuraciones específicas

# 3. Inicia en modo desarrollo
.\deploy.ps1 -Dev

# O en modo producción
.\deploy.ps1 -Prod
```

**¡Listo!** Tu aplicación estará corriendo en http://localhost:3000

#### **Características Docker:**
- 🔄 **Migraciones automáticas** - Se ejecutan al iniciar
- 🛠️ **Hot reload** en desarrollo
- 📊 **PostgreSQL incluido** con persistencia
- 🚀 **Un solo comando** para cada modo

### 💻 **Opción 2: Instalación Manual**

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/portfolio-tree.git
cd portfolio-tree

# 2. Instala dependencias
npm install

# 3. Configura PostgreSQL
# Asegúrate de tener PostgreSQL corriendo
createdb portfolio_tree

# 4. Configura variables de entorno
cp .env.example .env.local
# Edita .env.local:
# DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/portfolio_tree"
# NEXTAUTH_SECRET="tu-secreto-super-seguro"
# NEXTAUTH_URL="http://localhost:3000"

# 5. Configura la base de datos
npx prisma migrate dev --name init
npx prisma generate

# 6. Inicia el servidor
npm run dev
```

### 🔑 **Configuración de OAuth (Opcional)**

#### **GitHub OAuth**
1. Ve a [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Crea una nueva OAuth App:
   - **Application name**: Portfolio Tree
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Añade a tu `.env.local`:
   ```
   GITHUB_CLIENT_ID="tu_client_id"
   GITHUB_CLIENT_SECRET="tu_client_secret"
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

### **Variables de Entorno Necesarias**
```bash
# Configuración básica (ya configurada en Docker)
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portafolios"

# NextAuth (usa tus propios valores)
NEXTAUTH_SECRET="tu-secreto-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (opcional - solo si usas autenticación social)
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

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
