@echo off
echo ==========================================
echo   Solinntec - Servidor de Desarrollo
echo ==========================================
echo.

if not exist node_modules (
    echo [1/2] Instalando dependencias...
    call npm install
) else (
    echo [1/2] Dependencias ya instaladas.
)

echo [2/2] Iniciando servidor Vite con Hot Reload...
echo.
npm run dev
pause
