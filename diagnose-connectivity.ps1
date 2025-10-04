# Script de diagnóstico de conectividad para herokku.duckdns.org
Write-Host "🔍 Diagnóstico de Conectividad - herokku.duckdns.org" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Test DNS con diferentes servidores
Write-Host "`n📡 Pruebas de DNS:" -ForegroundColor Yellow

$dnsServers = @("8.8.8.8", "1.1.1.1", "208.67.222.222")
$hostname = "herokku.duckdns.org"

foreach ($dns in $dnsServers) {
    try {
        $result = Resolve-DnsName -Name $hostname -Server $dns -ErrorAction Stop
        Write-Host "✅ DNS $dns : $($result.IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "❌ DNS $dns : Error - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test con nslookup nativo
Write-Host "`n🔍 Prueba con nslookup local:" -ForegroundColor Yellow
try {
    $nslookup = nslookup $hostname 2>&1
    if ($nslookup -match "Address:") {
        Write-Host "✅ nslookup local: OK" -ForegroundColor Green
        Write-Host $nslookup
    } else {
        Write-Host "❌ nslookup local: Sin resolución" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ nslookup local: Error" -ForegroundColor Red
}

# Test de ping
Write-Host "`n🏓 Prueba de ping:" -ForegroundColor Yellow
try {
    $ping = Test-Connection -ComputerName $hostname -Count 2 -ErrorAction Stop
    Write-Host "✅ Ping: OK - Tiempo promedio: $($ping | Measure-Object ResponseTime -Average | Select-Object -ExpandProperty Average)ms" -ForegroundColor Green
} catch {
    Write-Host "❌ Ping: Error - $($_.Exception.Message)" -ForegroundColor Red
}

# Test de puerto SSH (7122)
Write-Host "`n🔌 Prueba de puerto SSH (7122):" -ForegroundColor Yellow
try {
    $tcpTest = Test-NetConnection -ComputerName $hostname -Port 7122 -WarningAction SilentlyContinue
    if ($tcpTest.TcpTestSucceeded) {
        Write-Host "✅ Puerto 7122: Accesible" -ForegroundColor Green
    } else {
        Write-Host "❌ Puerto 7122: No accesible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Puerto 7122: Error - $($_.Exception.Message)" -ForegroundColor Red
}

# Test de puerto HTTP (8130)
Write-Host "`n🌐 Prueba de puerto HTTP (8130):" -ForegroundColor Yellow
try {
    $tcpTest = Test-NetConnection -ComputerName $hostname -Port 8130 -WarningAction SilentlyContinue
    if ($tcpTest.TcpTestSucceeded) {
        Write-Host "✅ Puerto 8130: Accesible" -ForegroundColor Green
    } else {
        Write-Host "❌ Puerto 8130: No accesible (normal si la app no está desplegada)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Puerto 8130: Error - $($_.Exception.Message)" -ForegroundColor Red
}

# Información de red local
Write-Host "`n🖥️ Información de red local:" -ForegroundColor Yellow
$networkConfig = Get-NetIPConfiguration | Where-Object {$_.NetAdapter.Status -eq "Up"}
foreach ($config in $networkConfig) {
    Write-Host "Adaptador: $($config.InterfaceAlias)" -ForegroundColor White
    Write-Host "  IP: $($config.IPv4Address.IPAddress)" -ForegroundColor Gray
    Write-Host "  DNS: $($config.DNSServer.ServerAddresses -join ', ')" -ForegroundColor Gray
}

# Sugerencias basadas en los resultados
Write-Host "`n💡 Sugerencias:" -ForegroundColor Cyan
Write-Host "1. Si DNS falla: Verificar que 'herokku.duckdns.org' sea el hostname correcto" -ForegroundColor White
Write-Host "2. Si ping falla: Podría estar bloqueado por firewall (normal)" -ForegroundColor White
Write-Host "3. Si puerto 7122 falla: Verificar que el servidor esté encendido" -ForegroundColor White
Write-Host "4. Contactar al administrador del servidor para verificar:" -ForegroundColor White
Write-Host "   - Estado del servidor" -ForegroundColor Gray
Write-Host "   - Configuración de red" -ForegroundColor Gray
Write-Host "   - Acceso SSH habilitado" -ForegroundColor Gray

Write-Host "`n🔧 Para usar IP directa, agregar a GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   SERVER_IP=xxx.xxx.xxx.xxx" -ForegroundColor Gray