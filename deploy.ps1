# Script simple de despliegue para Portfolio Tree
param(
    [switch]$Dev,
    [switch]$Prod,
    [switch]$Server,
    [switch]$NoConflict,
    [switch]$Stop,
    [switch]$Clean
)

Write-Host "Portfolio Tree - Docker Manager" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Verificar Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker no esta instalado." -ForegroundColor Red
    exit 1
}

# Mostrar ayuda si no hay parametros
if (-not ($Dev -or $Prod -or $Server -or $NoConflict -or $Stop -or $Clean)) {
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 -Dev         # Modo desarrollo (hot reload)" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Prod        # Modo produccion local" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Server      # Modo servidor (puerto 8130)" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -NoConflict  # Servidor sin conflictos de puerto" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Stop        # Detener contenedores" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Clean       # Limpiar todo (elimina datos)" -ForegroundColor White
    Write-Host ""
    Write-Host "Opciones especiales:" -ForegroundColor Cyan
    Write-Host "  -NoConflict: Usa BD interna (evita conflicto puerto 5432)" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

# Verificar conflictos de puertos
function Test-PortConflict {
    param($Port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connections.Count -gt 0
    } catch {
        return $false
    }
}

# Detener contenedores
if ($Stop) {
    Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
    docker compose down
    Write-Host "Contenedores detenidos" -ForegroundColor Green
    exit 0
}

# Limpiar todo
if ($Clean) {
    Write-Host "Limpiando contenedores y datos..." -ForegroundColor Red
    docker compose down -v
    Write-Host "Limpieza completada" -ForegroundColor Green
    exit 0
}

# Modo desarrollo
if ($Dev) {
    Write-Host "Iniciando en modo DESARROLLO..." -ForegroundColor Green
    docker compose up --build
}

# Modo produccion local
if ($Prod) {
    Write-Host "Iniciando en modo PRODUCCION LOCAL..." -ForegroundColor Green
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
    
    Write-Host ""
    Write-Host "Aplicacion iniciada en modo produccion" -ForegroundColor Green
    Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Base de datos: localhost:5432" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ver logs: docker compose logs -f app" -ForegroundColor Gray
}

# Modo servidor (simula servidor de Invernalia)
if ($Server) {
    Write-Host "Iniciando en modo SERVIDOR (puerto 8130)..." -ForegroundColor Green
    
    # Verificar conflictos de puertos
    if (Test-PortConflict -Port 8130) {
        Write-Host "Advertencia: Puerto 8130 en uso" -ForegroundColor Yellow
    }
    if (Test-PortConflict -Port 5432) {
        Write-Host "Advertencia: Puerto 5432 en uso (PostgreSQL)" -ForegroundColor Yellow
        Write-Host "Sugerencia: Usar -NoConflict para evitar conflictos" -ForegroundColor Cyan
    }
    
    docker compose -f docker-compose.yml -f docker-compose.server.yml up --build -d
    
    Write-Host ""
    Write-Host "Aplicacion iniciada en modo servidor" -ForegroundColor Green
    Write-Host "URL: http://localhost:8130" -ForegroundColor Cyan
    Write-Host "Health check: http://localhost:8130/api/health" -ForegroundColor Cyan
    Write-Host "Base de datos: localhost:5432" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ver logs: docker compose logs -f app" -ForegroundColor Gray
}

# Modo sin conflictos (para servidores con PostgreSQL existente)
if ($NoConflict) {
    Write-Host "Iniciando en modo SIN CONFLICTOS..." -ForegroundColor Green
    Write-Host "PostgreSQL solo interno (sin puerto externo)" -ForegroundColor Yellow
    
    # Verificar conflicto de puerto de aplicación
    if (Test-PortConflict -Port 8130) {
        Write-Host "Advertencia: Puerto 8130 aun en uso" -ForegroundColor Yellow
        Write-Host "Intentando detener procesos existentes..." -ForegroundColor Yellow
        docker compose down
        Start-Sleep -Seconds 5
    }
    
    docker compose -f docker-compose.yml -f docker-compose.noconflict.yml up --build -d
    
    Write-Host ""
    Write-Host "Aplicacion iniciada SIN conflictos de puerto" -ForegroundColor Green
    Write-Host "URL: http://localhost:8130" -ForegroundColor Cyan
    Write-Host "Health check: http://localhost:8130/api/health" -ForegroundColor Cyan
    Write-Host "Base de datos: SOLO INTERNA (sin acceso externo)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ver logs: docker compose logs -f app" -ForegroundColor Gray
}