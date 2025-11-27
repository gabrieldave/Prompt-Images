@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo Generando ultima imagen: artnouveau
echo Costo: $0.04 USD
echo.

node scripts\generate-last.cjs

echo.
pause

