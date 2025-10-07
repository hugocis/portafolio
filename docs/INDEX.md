# Documentación - Portfolio Tree

Índice completo de la documentación del proyecto.

## Documentación Principal

### [README.md](../README.md)
Punto de entrada principal con:
- Características del proyecto
- Stack tecnológico
- Guía de inicio rápido
- Configuración básica
- Scripts disponibles
- Enlaces a documentación detallada

## Guías de Configuración

### [Docker Setup](./DOCKER.md)
Configuración completa de Docker:
- Inicio rápido (desarrollo y producción)
- Scripts de gestión
- Arquitectura de contenedores
- Variables de entorno
- Comandos útiles
- Solución de problemas de conectividad

### [Deployment](./DEPLOYMENT.md)
Guías de despliegue:
- Vercel (recomendado)
- Servidor propio con Docker
- GitHub Actions (CI/CD)
- Configuración de puertos
- SSL y dominios
- Migraciones en producción
- Backup y restauración
- Actualización

### [GitHub OAuth](./GITHUB_SETUP.md)
Configuración de autenticación:
- Crear GitHub OAuth App
- Configurar variables de entorno
- Múltiples entornos (dev/prod)
- Flujos de autenticación
- Troubleshooting OAuth
- Agregar más proveedores

## Guías de Funcionalidades

### [Sistema de Archivos (Blobs)](./BLOBS.md)
Gestión de archivos e imágenes:
- Almacenamiento (local y Vercel Blob)
- Tipos de archivo soportados
- Páginas de gestión
- API endpoints
- Modelo de base de datos
- Componentes disponibles
- Uso en código

## Solución de Problemas

### [Troubleshooting](./TROUBLESHOOTING.md)
Soluciones a problemas comunes:
- Problemas de instalación
- Errores de migraciones
- Problemas de autenticación
- Errores de Docker
- Problemas de build
- Errores de deployment
- Problemas de rendimiento
- Debugging y logs

## Documentación Archivada

### [docs/old/](./old/)
Versiones anteriores de documentación (para referencia histórica):
- BLOBS.md (versión anterior)
- DOCKER.md (versión anterior)
- GITHUB_SECRETS.md (configuración de secrets)
- GITHUB_SETUP.md (versión anterior)
- PORT_CONFIG.md (configuración de puertos)

## Estructura de Archivos

```
docs/
├── INDEX.md              # Este archivo
├── DOCKER.md            # Setup Docker
├── DEPLOYMENT.md        # Guías de deploy
├── BLOBS.md             # Sistema de archivos
├── GITHUB_SETUP.md      # OAuth setup
├── TROUBLESHOOTING.md   # Solución de problemas
└── old/                 # Documentación archivada
    ├── BLOBS.md
    ├── DOCKER.md
    ├── GITHUB_SECRETS.md
    ├── GITHUB_SETUP.md
    └── PORT_CONFIG.md
```

## Guías Rápidas

### Inicio Rápido con Docker
```powershell
.\deploy.ps1 -Dev
```
Ver: [Docker Setup](./DOCKER.md)

### Configurar OAuth
1. Crear GitHub OAuth App
2. Añadir credenciales a `.env.local`
3. Reiniciar servidor

Ver: [GitHub OAuth](./GITHUB_SETUP.md)

### Deploy en Vercel
1. Conectar repositorio
2. Configurar variables
3. Deploy automático

Ver: [Deployment - Vercel](./DEPLOYMENT.md#1-vercel-recomendado)

### Solucionar Error Común
- **Build failed**: [Troubleshooting - Build](./TROUBLESHOOTING.md#error-build-failed)
- **Database error**: [Troubleshooting - Database](./TROUBLESHOOTING.md#error-database-connection-failed)
- **Docker timeout**: [Troubleshooting - Docker](./TROUBLESHOOTING.md#error-docker-build-timeout)

## Contribuir a la Documentación

### Guías de Estilo
- Usar lenguaje claro y conciso
- Evitar emojis excesivos
- Incluir ejemplos de código
- Usar badges para tecnologías
- Organizar con encabezados apropiados
- Separar temas en archivos diferentes
- Mantener README.md como punto de entrada

### Estructura de Documentos
```markdown
# Título del Documento

> Breve descripción (opcional)

## Sección Principal 1
Contenido...

### Subsección
Detalles...

## Ejemplos de Código
```bash
comando ejemplo
```
```

### Actualizar Documentación
1. Editar el archivo correspondiente en `docs/`
2. Mantener consistencia con otros documentos
3. Actualizar este índice si añades nuevos archivos
4. Hacer commit con mensaje descriptivo

## Enlaces Externos Útiles

### Framework y Herramientas
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Deployment
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/actions)

### Authentication
- [NextAuth.js Documentation](https://next-auth.js.org)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)

## Contacto

Para preguntas sobre la documentación:
- Abrir un [Issue](https://github.com/tu-usuario/portfolio-tree/issues)
- Participar en [Discussions](https://github.com/tu-usuario/portfolio-tree/discussions)

---

**Última actualización**: Octubre 2025
