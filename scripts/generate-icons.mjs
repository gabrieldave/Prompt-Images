import sharp from 'sharp';
import { readFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'client', 'public');

// Usar la imagen PNG descargada como fuente
const sourceImagePath = join(publicDir, 'icon-source.png');

if (!existsSync(sourceImagePath)) {
  console.error('❌ Error: No se encontró icon-source.png');
  console.error('   Por favor, descarga la imagen primero desde Supabase');
  process.exit(1);
}

console.log('🎨 Generando iconos desde icon-source.png...');

// Primero, intentar leer la imagen para verificar que está bien
let imageMetadata;
try {
  imageMetadata = await sharp(sourceImagePath).metadata();
  console.log(`📐 Imagen original: ${imageMetadata.width}x${imageMetadata.height}, formato: ${imageMetadata.format}`);
} catch (error) {
  console.error('❌ Error al leer la imagen:', error.message);
  console.log('⚠️  Intentando copiar directamente la imagen...');
  
  // Si sharp no puede leerla, copiar directamente
  copyFileSync(sourceImagePath, join(publicDir, 'favicon.png'));
  copyFileSync(sourceImagePath, join(publicDir, 'icon-192x192.png'));
  copyFileSync(sourceImagePath, join(publicDir, 'icon-512x512.png'));
  console.log('✅ Iconos copiados directamente (sin redimensionar)');
  process.exit(0);
}

// Leer la imagen como buffer primero
const imageBuffer = readFileSync(sourceImagePath);

// Tamaños para PWA
const sizes = [192, 512];

for (const size of sizes) {
  const outputPath = join(publicDir, `icon-${size}x${size}.png`);
  
  try {
    // Intentar procesar desde el buffer
    await sharp(imageBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 (background color)
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generado: icon-${size}x${size}.png`);
  } catch (error) {
    console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
    // Si falla, intentar redimensionar de otra forma
    try {
      await sharp(imageBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✅ Generado (sin fondo): icon-${size}x${size}.png`);
    } catch (error2) {
      // Si todo falla, copiar la imagen original
      copyFileSync(sourceImagePath, outputPath);
      console.log(`⚠️  Copiada imagen original como fallback: icon-${size}x${size}.png`);
    }
  }
}

// Generar favicon.png (32x32 para compatibilidad)
const faviconPath = join(publicDir, 'favicon.png');
try {
  await sharp(imageBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 2, g: 6, b: 23, alpha: 1 }
    })
    .png()
    .toFile(faviconPath);
  
  console.log('✅ Generado: favicon.png (32x32)');
} catch (error) {
  console.error('❌ Error generando favicon.png:', error.message);
  try {
    await sharp(imageBuffer)
      .resize(32, 32)
      .png()
      .toFile(faviconPath);
    console.log('✅ Generado (sin fondo): favicon.png');
  } catch (error2) {
    // Si todo falla, copiar la imagen original
    copyFileSync(sourceImagePath, faviconPath);
    console.log('⚠️  Copiada imagen original como fallback: favicon.png');
  }
}

// También generar favicon.svg desde la imagen PNG (convertir a SVG simple)
// Para esto, crearemos un SVG que referencia la imagen
const faviconSvgPath = join(publicDir, 'favicon.svg');
try {
  // Leer la imagen y convertirla a base64 para incrustarla en el SVG
  const imageBuffer = readFileSync(sourceImagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">
  <image xlink:href="data:image/png;base64,${base64Image}" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  
  const { writeFileSync } = await import('fs');
  writeFileSync(faviconSvgPath, svgContent, 'utf-8');
  
  console.log('✅ Generado: favicon.svg');
} catch (error) {
  console.error('❌ Error generando favicon.svg:', error.message);
}

console.log('✨ ¡Iconos generados exitosamente!');
