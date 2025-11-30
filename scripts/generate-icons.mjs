import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'client', 'public');

// Leer el SVG
const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

// Tamaños para PWA
const sizes = [192, 512];

console.log('🎨 Generando iconos PNG desde favicon.svg...');

for (const size of sizes) {
  const outputPath = join(publicDir, `icon-${size}x${size}.png`);
  
  try {
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 (background color)
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generado: icon-${size}x${size}.png`);
  } catch (error) {
    console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
  }
}

// También generar favicon.png (32x32 para compatibilidad)
const faviconPath = join(publicDir, 'favicon.png');
try {
  await sharp(svgBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 2, g: 6, b: 23, alpha: 1 }
    })
    .png()
    .toFile(faviconPath);
  
  console.log('✅ Generado: favicon.png (32x32)');
} catch (error) {
  console.error('❌ Error generando favicon.png:', error.message);
}

console.log('✨ ¡Iconos generados exitosamente!');


