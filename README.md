# Portfolio Tree

Una aplicación web moderna para crear y compartir portafolios profesionales con estructura de árbol interactiva.

## 🌟 Características

- **Estructura de Árbol**: Organiza tu portafolio en una estructura jerárquica visual
- **Autenticación**: Sistema completo de autenticación con NextAuth.js
- **Dashboard Privado**: Panel de administración para gestionar tu contenido
- **Perfiles Públicos**: URLs personalizadas para compartir tu portafolio
- **Tipos de Contenido**: Proyectos, categorías, habilidades, experiencias y más
- **Responsive**: Diseño adaptativo para todos los dispositivos

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 (App Router), React 18, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **UI Components**: Headless UI, Heroicons
- **TypeScript**: Tipado estático completo

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Instala las dependencias**
   ```bash
   npm install
   ```

2. **Configura las variables de entorno**
   Edita `.env` con tus configuraciones:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Configura la base de datos**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   Ve a [http://localhost:3000](http://localhost:3000)

## 📖 Uso

### Formas de Registrarse

#### 1. **Registro Manual**
1. Ve a http://localhost:3000
2. Clic en "Get Started" o "Registrarse"
3. Llena el formulario con:
   - Nombre completo
   - Username (para tu URL del portafolio)
   - Email
   - Contraseña
4. ¡Automáticamente serás dirigido al dashboard!

#### 2. **Login con GitHub**
1. **Configura GitHub OAuth** (ver sección siguiente)
2. Ve a http://localhost:3000/auth/signin
3. Clic en "Continue with GitHub"
4. Autoriza la aplicación
5. Username generado automáticamente

#### 3. **Login Existente**
- Ve a `/auth/signin` 
- Usa tu email y contraseña

### Configuración de GitHub OAuth

Para habilitar el login con GitHub:

1. **Crea una GitHub OAuth App**:
   - Ve a [GitHub Developer Settings](https://github.com/settings/applications/new)
   - **Application name**: Portfolio Tree
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

2. **Configura variables de entorno**:
   ```bash
   # En tu archivo .env
   GITHUB_CLIENT_ID="tu-client-id"
   GITHUB_CLIENT_SECRET="tu-client-secret"
   ```

3. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

### Creando tu Portafolio

1. **Accede al Dashboard**: `/dashboard` 
2. **Crear Nodos**: Añade categorías, proyectos y contenido
3. **Organizar**: Estructura tu contenido en forma de árbol
4. **Compartir**: Tu portafolio estará en `/user/[tu-username]`

### Tipos de Nodos

- **CATEGORY**: Categorías principales (ej: "Desarrollo Web")
- **LANGUAGE**: Lenguajes de programación
- **PROJECT**: Proyectos específicos con enlaces y demos
- **SKILL**: Habilidades técnicas
- **EXPERIENCE**: Experiencia laboral
- **EDUCATION**: Formación académica
- **DOCUMENTATION**: Documentación y recursos

## 🏗️ Estructura del Proyecto

```
portafolios/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Panel de administración
│   ├── user/[username]/   # Perfiles públicos
│   └── page.tsx          # Página principal
├── components/            # Componentes React
│   ├── dashboard/        # Componentes del dashboard
│   ├── portfolio/        # Componentes del portafolio
│   └── providers/        # Providers de contexto
├── lib/                  # Utilidades y configuraciones
├── prisma/              # Esquema y migraciones de BD
├── types/               # Definiciones de TypeScript
└── public/              # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
```

### Base de Datos

```bash
npx prisma studio              # Interface visual de BD
npx prisma migrate dev         # Crear nueva migración
npx prisma generate           # Generar cliente Prisma
```

---

**Portfolio Tree** - Construye y comparte tu historia profesional de manera visual 🌳
