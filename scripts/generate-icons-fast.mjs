import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'client', 'public');
const sourceImagePath = join(publicDir, 'icon-source.png');

if (!existsSync(sourceImagePath)) {
  console.error('❌ Error: No se encontró icon-source.png');
  process.exit(1);
}

console.log('🎨 Generando iconos...');

// Copiar directamente los archivos (sin procesamiento)
copyFileSync(sourceImagePath, join(publicDir, 'favicon.png'));
copyFileSync(sourceImagePath, join(publicDir, 'icon-192x192.png'));
copyFileSync(sourceImagePath, join(publicDir, 'icon-512x512.png'));

// Crear SVG simple
const imageBuffer = readFileSync(sourceImagePath);
const base64 = imageBuffer.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64"><image xlink:href="data:image/png;base64,${base64}" width="64" height="64" preserveAspectRatio="xMidYMid slice"/></svg>`;
writeFileSync(join(publicDir, 'favicon.svg'), svg, 'utf-8');

console.log('✅ Iconos generados');
console.log('   - favicon.png');
console.log('   - favicon.svg');
console.log('   - icon-192x192.png');
console.log('   - icon-512x512.png');



