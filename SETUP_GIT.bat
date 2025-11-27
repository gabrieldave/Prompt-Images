@echo off
chcp 65001 >nul
cd /d "C:\Users\dakyo\Documents\Proyectos de apps\prompts imagenes\Prompt-Images"

echo ========================================
echo    CONFIGURANDO Y SUBIENDO A GITHUB
echo ========================================
echo.

echo [1/6] Verificando si git esta inicializado...
if not exist ".git" (
    echo Inicializando git...
    git init
) else (
    echo Git ya esta inicializado
)
echo.

echo [2/6] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/gabrieldave/Prompt-Images.git
git remote -v
echo.

echo [3/6] Verificando branch...
git branch -M main
echo Branch configurado como 'main'
echo.

echo [4/6] Agregando todos los archivos...
git add -A
echo Archivos agregados
echo.

echo [5/6] Creando commit inicial...
git commit -m "feat: Image Prompt Architect - Constructor de prompts con 100+ estilos visuales"
echo.

echo [6/6] Subiendo a GitHub...
git push -u origin main
echo.

echo ========================================
echo    PROCESO COMPLETADO
echo ========================================
echo.
echo Visita: https://github.com/gabrieldave/Prompt-Images
echo.
pause

