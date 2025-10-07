# Configuración de GitHub OAuth

Guía para configurar el login con GitHub en Portfolio Tree.

## Crear GitHub OAuth App

### 1. Acceder a GitHub Developer Settings

Ir a [GitHub Developer Settings](https://github.com/settings/developers) o:
1. Ir a Settings en tu perfil de GitHub
2. Scroll hasta Developer settings
3. Clic en OAuth Apps
4. Clic en New OAuth App

### 2. Configurar la Aplicación

**Development:**
```
Application name: Portfolio Tree (Dev)
Homepage URL: http://localhost:3000
Application description: Portfolio management application
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

**Production:**
```
Application name: Portfolio Tree
Homepage URL: https://tu-dominio.com
Application description: Portfolio management application
Authorization callback URL: https://tu-dominio.com/api/auth/callback/github
```

### 3. Obtener Credenciales

Después de crear la app:
1. Copiar el **Client ID**
2. Generar un **Client Secret**
3. Guardar ambos de forma segura

## Configurar Variables de Entorno

### Development (.env.local)

```env
GITHUB_CLIENT_ID="tu_client_id_de_github"
GITHUB_CLIENT_SECRET="tu_client_secret_de_github"
```

### Production (.env o GitHub Secrets)

**En servidor:**
```env
GITHUB_CLIENT_ID="tu_client_id_de_produccion"
GITHUB_CLIENT_SECRET="tu_client_secret_de_produccion"
```

**En GitHub Actions:**
```
Settings > Secrets and variables > Actions > New repository secret

Añadir:
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
```

## Reiniciar Servidor

### Development
```bash
npm run dev
```

### Production con Docker
```bash
docker compose -f docker-compose.yml -f docker-compose.server.yml restart
```

## Verificar Configuración

1. Ir a `/auth/signin`
2. Debe aparecer el botón "Continue with GitHub"
3. Clic y autorizar la aplicación
4. Debe redirigir al dashboard

## Flujos de Autenticación

### 1. Registro con GitHub
- Usuario hace clic en "Continue with GitHub"
- GitHub autentica y autoriza
- NextAuth crea cuenta automáticamente
- Username generado desde GitHub username
- Redirige al dashboard

### 2. Login con GitHub (usuario existente)
- Usuario hace clic en "Continue with GitHub"
- GitHub autentica
- NextAuth busca cuenta existente
- Si existe, inicia sesión
- Redirige al dashboard

### 3. Vincular cuenta existente
- Usuario con cuenta manual
- Puede vincular GitHub en configuración
- Permite login con ambos métodos

## URLs Importantes

### Development
- **Registro**: http://localhost:3000/auth/register
- **Login**: http://localhost:3000/auth/signin
- **Dashboard**: http://localhost:3000/dashboard
- **Perfil público**: http://localhost:3000/user/[username]

### Production
- **Registro**: https://tu-dominio.com/auth/register
- **Login**: https://tu-dominio.com/auth/signin
- **Dashboard**: https://tu-dominio.com/dashboard
- **Perfil público**: https://tu-dominio.com/user/[username]

## Múltiples Entornos

### Estrategia Recomendada

Crear 2 OAuth Apps en GitHub:

**1. Development**
```
Name: Portfolio Tree (Dev)
Callback: http://localhost:3000/api/auth/callback/github
```

**2. Production**
```
Name: Portfolio Tree
Callback: https://tu-dominio.com/api/auth/callback/github
```

Usar diferentes Client IDs y Secrets en cada entorno.

## Troubleshooting

### Error: "Redirect URI mismatch"

**Causa:** La URL de callback no coincide con la configurada en GitHub.

**Solución:**
1. Verificar `NEXTAUTH_URL` en `.env`
2. Verificar callback URL en GitHub OAuth App
3. Deben coincidir exactamente

### Error: "Client authentication failed"

**Causa:** Client ID o Secret incorrectos.

**Solución:**
1. Verificar `GITHUB_CLIENT_ID` en `.env`
2. Verificar `GITHUB_CLIENT_SECRET` en `.env`
3. Regenerar Client Secret si es necesario

### El botón no aparece

**Causa:** Variables de entorno no cargadas.

**Solución:**
1. Verificar que `.env.local` existe
2. Reiniciar servidor de desarrollo
3. Limpiar cache: `rm -rf .next`

### Usuario no se crea automáticamente

**Causa:** Error en la configuración de NextAuth.

**Solución:**
1. Verificar logs del servidor
2. Revisar `lib/auth.ts`
3. Verificar que la base de datos está accesible

## Seguridad

### Buenas Prácticas

- No commitear Client Secret al repositorio
- Usar diferentes apps para dev y prod
- Regenerar secrets periódicamente
- Monitorear accesos en GitHub
- Revocar apps no utilizadas

### GitHub Secrets en Producción

Para GitHub Actions:
```yaml
env:
  GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
  GITHUB_CLIENT_SECRET: ${{ secrets.GITHUB_CLIENT_SECRET }}
```

## Agregar Más Proveedores OAuth

El sistema está preparado para más proveedores. Configuración similar para:

### Google
```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Facebook
```env
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."
```

Ver [NextAuth.js Providers](https://next-auth.js.org/providers/) para más opciones.

## Testing

### Verificar OAuth localmente

```bash
# 1. Configurar variables
echo "GITHUB_CLIENT_ID=tu_client_id" >> .env.local
echo "GITHUB_CLIENT_SECRET=tu_client_secret" >> .env.local

# 2. Reiniciar servidor
npm run dev

# 3. Probar en navegador
# Ir a http://localhost:3000/auth/signin
# Clic en "Continue with GitHub"
# Debe funcionar sin errores
```

---

**OAuth configurado exitosamente!**

Los usuarios ahora pueden registrarse e iniciar sesión con GitHub de forma segura.
