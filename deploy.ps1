# Script simple de despliegue para Portfolio Tree
param(
    [switch]$Dev,
    [switch]$Prod,
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
if (-not ($Dev -or $Prod -or $Stop -or $Clean)) {
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 -Dev         # Modo desarrollo (hot reload)" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Prod        # Modo produccion local" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Stop        # Detener contenedores" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Clean       # Limpiar todo (elimina datos)" -ForegroundColor White
    Write-Host ""
    exit 0
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
    docker compose up --build -d
    
    Write-Host ""
    Write-Host "Aplicacion iniciada en modo produccion" -ForegroundColor Green
    Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Base de datos: localhost:5432" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ver logs: docker compose logs -f app" -ForegroundColor Gray
}