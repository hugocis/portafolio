# Configuración de GitHub Secrets

Para que el deployment funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio de GitHub.

## Cómo configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, selecciona **Secrets and variables** > **Actions**
4. Haz clic en **New repository secret**

## Secrets requeridos

### 🔐 SSH y Servidor
```
SSH_PRIVATE_KEY
```
**Valor**: Tu clave SSH privada para acceder al servidor Invernalia

### 🗄️ Base de Datos
```
POSTGRES_PASSWORD
```
**Valor**: `1234` (o la contraseña que prefieras para PostgreSQL)

### 🔒 Autenticación
```
NEXTAUTH_SECRET
```
**Valor**: `7ebbf23385322a58181632c9c17a091be5878bf5a73aa45ee7dfa2470478c3a5`

### 🐙 GitHub OAuth
```
GITHUB_CLIENT_ID
```
**Valor**: `Ov23lixepi3LURYUEG0q`

```
GITHUB_CLIENT_SECRET
```
**Valor**: `519734849fd073a606283ebf14a90bf8b88dbfb0`

### 🔐 Encriptación
```
ENCRYPTION_KEY
```
**Valor**: `81cc50d6ac3b63fc7547260ff7f53b0cd319d0f5372d76f287d07f80928f45dc`

```
ENCRYPTION_IV
```
**Valor**: `f83cd90a8e5f021ecafe25a953b82479`

### 🔑 Token CRON
```
CRON_SECRET_TOKEN
```
**Valor**: `UeZ9pV7qWx3Mn0akL6rTbY8CdJ5`

## ⚠️ Importante

- **Nunca** compartas estos valores públicamente
- Los valores mostrados aquí son de ejemplo/desarrollo
- Para producción real, genera nuevos valores seguros:
  - `NEXTAUTH_SECRET`: `openssl rand -base64 32`
  - `ENCRYPTION_KEY`: `openssl rand -hex 32`
  - `ENCRYPTION_IV`: `openssl rand -hex 16`
  - `CRON_SECRET_TOKEN`: `openssl rand -base64 32`

## 📋 Lista de verificación

- [ ] SSH_PRIVATE_KEY configurado
- [ ] POSTGRES_PASSWORD configurado
- [ ] NEXTAUTH_SECRET configurado
- [ ] GITHUB_CLIENT_ID configurado
- [ ] GITHUB_CLIENT_SECRET configurado
- [ ] ENCRYPTION_KEY configurado
- [ ] ENCRYPTION_IV configurado
- [ ] CRON_SECRET_TOKEN configurado

## 🚀 Después de configurar

Una vez que todos los secrets estén configurados, haz un push a la rama `main` para triggear el deployment:

```bash
git add .
git commit -m "Configure production secrets"
git push origin main
```

El workflow se ejecutará automáticamente y debería deployar correctamente con las credenciales seguras.