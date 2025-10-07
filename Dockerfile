# Dockerfile unificado para desarrollo y producción con mejor manejo de conectividad
FROM node:18-alpine

# Configurar timeouts y reintentos para npm
ENV NPM_CONFIG_FETCH_TIMEOUT=300000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=10000

WORKDIR /app

# Instalar dependencias del sistema con reintentos
RUN for i in 1 2 3; do \
  apk add --no-cache libc6-compat && break || \
  (echo "Intento $i fallido, reintentando..." && sleep 10); \
  done

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con estrategia de reintentos
RUN for i in 1 2 3; do \
  npm ci --prefer-offline --no-audit --production=false && break || \
  (echo "npm install falló, intento $i/3" && \
  npm cache clean --force && \
  rm -rf node_modules package-lock.json && \
  sleep 15); \
  done

# Copiar código fuente
COPY . .

# Crear directorio de uploads
RUN mkdir -p /app/public/uploads && \
  chmod 755 /app/public/uploads

# Generar cliente Prisma con reintentos
RUN for i in 1 2 3; do \
  npx prisma generate && break || \
  (echo "Prisma generate falló, intento $i/3" && sleep 5); \
  done

# Exponer puerto
EXPOSE 3000

# Script que maneja desarrollo vs producción
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]