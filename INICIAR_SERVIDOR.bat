@echo off
chcp 65001 >nul
title Image Prompt Architect - Servidor

echo.
echo ========================================
echo   IMAGE PROMPT ARCHITECT
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Instalando dependencias...
npm install

echo.
echo [2/2] Iniciando servidor...
echo.
echo Cuando veas "serving on port 5000" esta listo!
echo Abre: http://localhost:5000
echo.
echo Presiona Ctrl+C para detener.
echo ========================================
echo.

set NODE_ENV=development
npx tsx server/index.ts
