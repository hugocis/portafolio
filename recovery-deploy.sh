#!/bin/bash
# Script de recuperación para problemas de conectividad en el servidor

echo "🔧 Script de recuperación para Portfolio Tree"
echo "=============================================="

# Función para verificar conectividad
check_connectivity() {
    echo "🔍 Verificando conectividad..."
    
    # Test DNS
    if nslookup google.com > /dev/null 2>&1; then
        echo "✅ DNS funcionando"
    else
        echo "❌ Problemas de DNS"
        return 1
    fi
    
    # Test conectividad HTTP
    if curl -s --max-time 10 http://google.com > /dev/null; then
        echo "✅ Conectividad HTTP funcionando"
    else
        echo "❌ Problemas de conectividad HTTP"
        return 1
    fi
    
    # Test Docker Hub
    if timeout 30s docker pull hello-world:latest > /dev/null 2>&1; then
        echo "✅ Docker registry accesible"
        docker rmi hello-world:latest > /dev/null 2>&1
    else
        echo "⚠️ Problemas con Docker registry"
    fi
}

# Función para usar Dockerfile alternativo
use_stable_dockerfile() {
    echo "🔄 Cambiando a Dockerfile más estable..."
    
    # Backup del Dockerfile original
    if [ -f Dockerfile ] && [ ! -f Dockerfile.original ]; then
        cp Dockerfile Dockerfile.original
    fi
    
    # Usar Dockerfile estable
    if [ -f Dockerfile.stable ]; then
        cp Dockerfile.stable Dockerfile
        echo "✅ Usando Dockerfile estable"
    else
        echo "❌ Dockerfile.stable no encontrado"
        return 1
    fi
}

# Función para despliegue con reintentos
deploy_with_retries() {
    local max_attempts=3
    local wait_time=60
    
    echo "🚀 Iniciando despliegue con reintentos..."
    
    for attempt in $(seq 1 $max_attempts); do
        echo "📝 Intento $attempt/$max_attempts"
        
        # Limpiar antes de cada intento
        echo "🧹 Limpiando recursos..."
        docker compose -f docker-compose.yml -f docker-compose.server.yml down > /dev/null 2>&1 || true
        docker system prune -f > /dev/null 2>&1 || true
        
        # Configurar timeouts largos
        export COMPOSE_HTTP_TIMEOUT=1200
        export DOCKER_CLIENT_TIMEOUT=1200
        
        # Intentar construir
        echo "🔨 Construyendo aplicación..."
        if timeout 1800s docker compose -f docker-compose.yml -f docker-compose.server.yml up -d --build; then
            echo "✅ Construcción exitosa en intento $attempt"
            
            # Verificar que está funcionando
            echo "⏳ Esperando que la aplicación inicie..."
            sleep 90
            
            if docker compose ps | grep -q "Up"; then
                echo "✅ Aplicación funcionando correctamente"
                return 0
            else
                echo "❌ La aplicación no se inició correctamente"
                docker compose logs --tail=20 app
            fi
        else
            echo "❌ Construcción fallida en intento $attempt"
            
            if [ $attempt -lt $max_attempts ]; then
                echo "⏳ Esperando ${wait_time}s antes del siguiente intento..."
                sleep $wait_time
                wait_time=$((wait_time + 30))
            fi
        fi
    done
    
    echo "❌ Todos los intentos fallaron"
    return 1
}

# Función para despliegue sin build (usar imágenes existentes)
deploy_without_build() {
    echo "📦 Intentando usar imágenes existentes..."
    
    if docker images | grep -q portafolios; then
        echo "✅ Imágenes existentes encontradas"
        
        # Detener servicios
        docker compose -f docker-compose.yml -f docker-compose.server.yml down || true
        
        # Iniciar sin build
        if docker compose -f docker-compose.yml -f docker-compose.server.yml up -d; then
            echo "✅ Aplicación iniciada con imágenes existentes"
            return 0
        else
            echo "❌ Falló al usar imágenes existentes"
            return 1
        fi
    else
        echo "❌ No hay imágenes existentes disponibles"
        return 1
    fi
}

# Función principal
main() {
    echo "🏁 Iniciando proceso de recuperación..."
    
    # Verificar conectividad
    if ! check_connectivity; then
        echo "⚠️ Problemas de conectividad detectados"
        echo "💡 Esperando 60 segundos para retry..."
        sleep 60
        
        if ! check_connectivity; then
            echo "❌ Conectividad sigue fallando"
            echo "🔧 Intentando despliegue sin build..."
            
            if deploy_without_build; then
                echo "🎉 Recuperación exitosa usando imágenes existentes"
                exit 0
            else
                echo "❌ Recuperación fallida"
                exit 1
            fi
        fi
    fi
    
    # Intentar despliegue normal
    if deploy_with_retries; then
        echo "🎉 Despliegue exitoso"
    else
        echo "🔄 Intentando con Dockerfile estable..."
        
        if use_stable_dockerfile && deploy_with_retries; then
            echo "🎉 Despliegue exitoso con Dockerfile estable"
        else
            echo "🔧 Intentando despliegue sin build como último recurso..."
            
            if deploy_without_build; then
                echo "🎉 Recuperación exitosa con imágenes existentes"
            else
                echo "❌ Todos los métodos de recuperación fallaron"
                echo "📞 Contacta al administrador del sistema"
                exit 1
            fi
        fi
    fi
    
    # Verificación final
    echo "🔍 Verificación final..."
    sleep 30
    
    if curl -f http://localhost:8130/api/health > /dev/null 2>&1; then
        echo "✅ Aplicación funcionando correctamente"
        echo "🌐 Disponible en: http://herokku.duckdns.org:8130"
    else
        echo "⚠️ La aplicación puede estar iniciándose aún"
        echo "📋 Logs recientes:"
        docker compose logs --tail=10 app
    fi
}

# Ejecutar función principal
main "$@"