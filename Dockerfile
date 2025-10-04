# Dockerfile unificado para desarrollo y producción
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000

# Script que maneja desarrollo vs producción
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]