import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'client', 'public');

const sourceImagePath = join(publicDir, 'icon-source.png');

if (!existsSync(sourceImagePath)) {
  console.error('❌ Error: No se encontró icon-source.png');
  process.exit(1);
}

console.log('🎨 Generando icono único desde icon-source.png...');

try {
  // Leer la imagen y convertirla a base64
  const imageBuffer = readFileSync(sourceImagePath);
  const base64Image = imageBuffer.toString('base64');
  
  // Crear un SVG único que contenga la imagen
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">
  <image xlink:href="data:image/png;base64,${base64Image}" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
  
  // Guardar favicon.svg
  writeFileSync(join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('✅ Generado: favicon.svg');
  
  // Copiar la imagen original como favicon.png (el navegador la redimensionará)
  copyFileSync(sourceImagePath, join(publicDir, 'favicon.png'));
  console.log('✅ Generado: favicon.png (imagen original)');
  
  // Copiar la misma imagen para los iconos PWA
  copyFileSync(sourceImagePath, join(publicDir, 'icon-192x192.png'));
  console.log('✅ Generado: icon-192x192.png (imagen original)');
  
  copyFileSync(sourceImagePath, join(publicDir, 'icon-512x512.png'));
  console.log('✅ Generado: icon-512x512.png (imagen original)');
  
  console.log('✨ ¡Iconos generados exitosamente!');
  console.log('💡 Nota: Los iconos PNG usan la imagen original. El navegador los redimensionará automáticamente.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}



