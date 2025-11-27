@echo off
chcp 65001 >nul
title Generando imagenes faltantes

cd /d "%~dp0"

echo.
echo ========================================
echo   GENERANDO 4 IMAGENES FALTANTES
echo   Costo: ~$0.16 USD
echo ========================================
echo.

node scripts\generate-missing.cjs

echo.
pause

