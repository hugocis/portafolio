# Configuración de GitHub OAuth

Para configurar el login con GitHub, sigue estos pasos:

## 1. Crear una GitHub OAuth App

1. Ve a [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Llena el formulario:
   - **Application name**: Portfolio Tree (o tu nombre preferido)
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: Portfolio management application
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

3. Clic en "Register application"

## 2. Configurar Variables de Entorno

1. Copia el **Client ID** y **Client Secret** de tu app de GitHub
2. Edita tu archivo `.env`:

```env
GITHUB_CLIENT_ID="tu-client-id-de-github"
GITHUB_CLIENT_SECRET="tu-client-secret-de-github"
```

## 3. Reiniciar el Servidor

```bash
npm run dev
```

## ¡Listo!

Ahora podrás usar "Continue with GitHub" en la página de login.

---

## Registro de Usuarios

Los usuarios pueden registrarse de 3 formas:

### 1. **Registro Manual** (`/auth/register`)
- Formulario completo con nombre, email, username y password
- Validación automática de campos únicos
- Login automático después del registro

### 2. **Login con GitHub**
- Clic en "Continue with GitHub"
- Username generado automáticamente desde GitHub
- Sin necesidad de password

### 3. **Login con Email** (si ya tiene cuenta)
- Usa `/auth/signin`
- Email y password

## URLs Importantes

- **Registro**: http://localhost:3000/auth/register
- **Login**: http://localhost:3000/auth/signin
- **Dashboard**: http://localhost:3000/dashboard
- **Perfil público**: http://localhost:3000/user/[username]