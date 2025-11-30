import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'client', 'public');

const sourceImagePath = join(publicDir, 'icon-source.png');

if (!existsSync(sourceImagePath)) {
  console.error('❌ Error: No se encontró icon-source.png');
  process.exit(1);
}

console.log('🎨 Generando iconos usando método alternativo...');

// Intentar usar ImageMagick si está disponible
try {
  const sizes = [
    { size: 32, name: 'favicon.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' }
  ];

  for (const { size, name } of sizes) {
    const outputPath = join(publicDir, name);
    try {
      // Usar ImageMagick para redimensionar
      execSync(`magick "${sourceImagePath}" -resize ${size}x${size}^ -gravity center -extent ${size}x${size} "${outputPath}"`, {
        stdio: 'inherit'
      });
      console.log(`✅ Generado: ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error con ImageMagick para ${name}:`, error.message);
    }
  }

  // Generar favicon.svg
  const faviconSvgPath = join(publicDir, 'favicon.svg');
  const temp64Path = join(publicDir, 'temp-64.png');
  
  try {
    execSync(`magick "${sourceImagePath}" -resize 64x64^ -gravity center -extent 64x64 "${temp64Path}"`, {
      stdio: 'inherit'
    });
    
    const imageBuffer = readFileSync(temp64Path);
    const base64Image = imageBuffer.toString('base64');
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">
  <image xlink:href="data:image/png;base64,${base64Image}" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
    
    writeFileSync(faviconSvgPath, svgContent, 'utf-8');
    console.log('✅ Generado: favicon.svg');
    
    // Eliminar archivo temporal
    const { unlinkSync } = await import('fs');
    unlinkSync(temp64Path);
  } catch (error) {
    console.error('❌ Error generando favicon.svg:', error.message);
  }

  console.log('✨ ¡Iconos generados exitosamente con ImageMagick!');
} catch (error) {
  console.error('❌ ImageMagick no está disponible:', error.message);
  console.log('💡 Por favor, instala ImageMagick o usa una herramienta online para redimensionar los iconos.');
  process.exit(1);
}



