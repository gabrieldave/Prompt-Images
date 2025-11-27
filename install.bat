@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   Image Prompt Architect - Instalador
echo ========================================
echo.
echo [1/2] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo.
echo [2/2] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo   Abre tu navegador en:
echo   http://localhost:5000
echo ========================================
echo.
call npm run dev:win
pause
