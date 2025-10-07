# Script de despliegue para Portfolio Tree con Caddy HTTPS (PowerShell)
# Para Windows

param(
    [switch]$SkipDNSCheck,
    [switch]$ViewLogs
)

Write-Host "🚀 Iniciando despliegue de Portfolio Tree con Caddy HTTPS..." -ForegroundColor Cyan
Write-Host ""

# Función para imprimir mensajes con colores
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Verificar si Docker está instalado
try {
    docker --version | Out-Null
    Write-Success "Docker está instalado"
} catch {
    Write-Error "Docker no está instalado. Por favor instala Docker Desktop primero."
    exit 1
}

# Verificar Docker Compose
try {
    docker-compose --version | Out-Null
    Write-Success "Docker Compose está instalado"
} catch {
    Write-Error "Docker Compose no está instalado."
    exit 1
}

# Verificar si existe .env
if (-not (Test-Path .env)) {
    Write-Warning "Archivo .env no encontrado. Copiando desde .env.production..."
    Copy-Item .env.production .env
    Write-Warning "⚠️  IMPORTANTE: Edita el archivo .env con tus valores antes de continuar"
    Write-Warning "   Especialmente:"
    Write-Warning "   - POSTGRES_PASSWORD"
    Write-Warning "   - NEXTAUTH_SECRET (genera con: openssl rand -base64 32)"
    Write-Warning "   - DATABASE_URL (actualiza con el password de PostgreSQL)"
    Write-Host ""
    Read-Host "Presiona Enter cuando hayas editado .env"
}

Write-Success "Archivo .env encontrado"

# Verificar dominio DNS (opcional)
if (-not $SkipDNSCheck) {
    Write-Host ""
    Write-Host "🔍 Verificando configuración DNS para herokku.duckdns.org..." -ForegroundColor Cyan
    try {
        $dnsResult = Resolve-DnsName -Name herokku.duckdns.org -ErrorAction SilentlyContinue
        if ($dnsResult) {
            $ip = $dnsResult | Where-Object { $_.Type -eq 'A' } | Select-Object -First 1 -ExpandProperty IPAddress
            Write-Success "herokku.duckdns.org resuelve a: $ip"
        } else {
            Write-Warning "No se pudo resolver herokku.duckdns.org"
        }
    } catch {
        Write-Warning "No se pudo verificar DNS"
    }
}

# Detener servicios existentes si están corriendo
Write-Host ""
Write-Host "🛑 Deteniendo servicios existentes (si los hay)..." -ForegroundColor Cyan
docker-compose -f docker-compose.caddy.yml down 2>$null
Write-Success "Servicios anteriores detenidos"

# Construir e iniciar servicios
Write-Host ""
Write-Host "🏗️  Construyendo imágenes Docker..." -ForegroundColor Cyan
docker-compose -f docker-compose.caddy.yml build --no-cache

Write-Host ""
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Cyan
docker-compose -f docker-compose.caddy.yml up -d

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verificar estado de servicios
Write-Host ""
Write-Host "📊 Estado de los servicios:" -ForegroundColor Cyan
docker-compose -f docker-compose.caddy.yml ps

# Esperar a que la base de datos esté lista
Write-Host ""
Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Cyan
$maxAttempts = 30
$attempt = 0
$dbReady = $false

while ($attempt -lt $maxAttempts) {
    try {
        $result = docker-compose -f docker-compose.caddy.yml exec -T db pg_isready -U postgres 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "PostgreSQL está listo"
            $dbReady = $true
            break
        }
    } catch {
        # Continuar intentando
    }
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 1
    $attempt++
}

if (-not $dbReady) {
    Write-Error "Timeout esperando PostgreSQL"
    exit 1
}

# Ejecutar migraciones
Write-Host ""
Write-Host "🗄️  Ejecutando migraciones de base de datos..." -ForegroundColor Cyan
try {
    docker-compose -f docker-compose.caddy.yml exec -T app npx prisma migrate deploy
    Write-Success "Migraciones ejecutadas correctamente"
} catch {
    Write-Warning "Error en migraciones (puede ser normal si ya están aplicadas)"
}

# Verificar que Caddy esté obteniendo certificados
Write-Host ""
Write-Host "🔐 Verificando certificados SSL de Caddy..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

$caddyLogs = docker-compose -f docker-compose.caddy.yml logs caddy 2>&1 | Out-String
if ($caddyLogs -match "certificate obtained successfully|serving initial ACME challenges") {
    Write-Success "Caddy está obteniendo/tiene certificados SSL"
} else {
    Write-Warning "Caddy podría estar obteniendo certificados. Revisa los logs:"
    Write-Host "   docker-compose -f docker-compose.caddy.yml logs caddy"
}

# Información final
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Success "🎉 Despliegue completado!"
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Tu aplicación debería estar disponible en:" -ForegroundColor White
Write-Host "   https://herokku.duckdns.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor White
Write-Host "   Ver logs:         docker-compose -f docker-compose.caddy.yml logs -f"
Write-Host "   Ver logs Caddy:   docker-compose -f docker-compose.caddy.yml logs -f caddy"
Write-Host "   Ver logs App:     docker-compose -f docker-compose.caddy.yml logs -f app"
Write-Host "   Reiniciar:        docker-compose -f docker-compose.caddy.yml restart"
Write-Host "   Detener:          docker-compose -f docker-compose.caddy.yml down"
Write-Host ""
Write-Host "🔍 Health check:" -ForegroundColor White
Write-Host "   curl https://herokku.duckdns.org/api/health"
Write-Host ""
Write-Warning "Nota: Los certificados SSL pueden tardar 1-2 minutos en obtenerse"
Write-Host "   Si ves errores de certificado, espera un momento y recarga" -ForegroundColor Gray
Write-Host ""

# Preguntar si quiere ver logs
if (-not $ViewLogs) {
    $response = Read-Host "¿Quieres ver los logs en tiempo real? (s/n)"
    if ($response -match "^[Ss]") {
        $ViewLogs = $true
    }
}

if ($ViewLogs) {
    docker-compose -f docker-compose.caddy.yml logs -f
}
