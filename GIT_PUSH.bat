@echo off
cd /d "C:\Users\dakyo\Documents\Proyectos de apps\prompts imagenes\Prompt-Images"

git init
git remote remove origin 2>nul
git remote add origin https://github.com/gabrieldave/Prompt-Images.git
git branch -M main
git add -A
git commit -m "feat: Image Prompt Architect - Constructor de prompts con 100+ estilos visuales"
git push -u origin main

echo COMPLETADO

