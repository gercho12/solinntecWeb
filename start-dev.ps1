Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Solinntec - Servidor de Desarrollo (PS)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Instalando dependencias..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[1/2] Dependencias ya instaladas." -ForegroundColor Green
}

Write-Host "[2/2] Iniciando servidor Vite con Hot Reload..." -ForegroundColor Green
Write-Host ""
npm run dev
