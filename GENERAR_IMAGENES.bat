@echo off
chcp 65001 >nul
title Generador de Previews DALL-E 3

echo.
echo ========================================
echo   GENERADOR DE PREVIEWS CON DALL-E 3
echo ========================================
echo.

REM Ir al directorio del script
cd /d "%~dp0"

echo Directorio: %CD%
echo.

REM Verificar Node
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

REM Verificar .env
if not exist ".env" (
    echo ERROR: Archivo .env no encontrado
    echo Crea un archivo .env con: OPENAI_API_KEY=sk-...
    pause
    exit /b 1
)
echo [OK] Archivo .env encontrado

REM Verificar script
if not exist "scripts\generate-previews.cjs" (
    echo ERROR: Script no encontrado
    pause
    exit /b 1
)
echo [OK] Script encontrado

echo.
echo ========================================
echo   INICIANDO GENERACION
echo   Costo: ~$3.60 USD (90 imagenes)
echo   Tiempo: ~5 minutos
echo ========================================
echo.
echo Presiona cualquier tecla para iniciar...
pause >nul

node scripts\generate-previews.cjs

echo.
echo ========================================
if exist "client\public\previews\unreal.png" (
    echo   EXITO! Imagenes generadas en:
    echo   client\public\previews\
) else (
    echo   Revisa los errores arriba
)
echo ========================================
echo.
pause
