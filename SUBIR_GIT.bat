@echo off
chcp 65001 >nul
cd /d "C:\Users\dakyo\Documents\Proyectos de apps\prompts imagenes\Prompt-Images"

echo ========================================
echo    SUBIENDO CAMBIOS A GITHUB
echo ========================================
echo.

echo [1/4] Verificando remote...
git remote -v
echo.

echo [2/4] Agregando archivos...
git add -A
echo.

echo [3/4] Creando commit...
git commit -m "feat: Analisis desglosado con categorias seleccionables - Nuevo endpoint analyze-image-structured - 8 categorias con checkboxes - Boton Pegar Imagen - Limite 50MB"
echo.

echo [4/4] Subiendo a GitHub...
git push origin main
echo.

echo ========================================
echo    PROCESO COMPLETADO
echo ========================================
pause

