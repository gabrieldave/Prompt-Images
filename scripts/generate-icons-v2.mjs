import sharp from 'sharp';
import { readFileSync, existsSync, writeFileSync } from 'fs';
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

console.log('🎨 Generando iconos desde icon-source.png...');

// Función async principal
async function generateIcons() {
  try {
    // Leer el archivo como buffer
    const imageBuffer = readFileSync(sourceImagePath);
    console.log(`📦 Buffer leído: ${imageBuffer.length} bytes`);
    
    // Intentar convertir a JPEG primero y luego a PNG (para limpiar metadata)
    const jpegBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 100 })
      .toBuffer();
    
    console.log('✅ Imagen convertida a JPEG intermedio');
    
    // Ahora convertir de JPEG a PNG y redimensionar
    const cleanBuffer = await sharp(jpegBuffer)
      .png()
      .toBuffer();
    
    console.log('✅ Imagen limpiada y convertida a PNG');
  
  // Ahora usar este buffer limpio para generar los iconos
  const sizes = [
    { size: 32, name: 'favicon.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' }
  ];

  for (const { size, name } of sizes) {
    const outputPath = join(publicDir, name);
    try {
      await sharp(cleanBuffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);
      
      // Verificar medidas
      const metadata = await sharp(outputPath).metadata();
      if (metadata.width === size && metadata.height === size) {
        console.log(`✅ Generado: ${name} (${size}x${size})`);
      } else {
        console.error(`⚠️  ${name} tiene medidas incorrectas: ${metadata.width}x${metadata.height}`);
      }
    } catch (error) {
      console.error(`❌ Error generando ${name}:`, error.message);
    }
  }

  // Generar favicon.svg
  const faviconSvgPath = join(publicDir, 'favicon.svg');
  try {
    const svg64Buffer = await sharp(cleanBuffer)
      .resize(64, 64, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toBuffer();
    
    const base64Image = svg64Buffer.toString('base64');
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">
  <image xlink:href="data:image/png;base64,${base64Image}" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
    
    writeFileSync(faviconSvgPath, svgContent, 'utf-8');
    console.log('✅ Generado: favicon.svg (64x64)');
  } catch (error) {
    console.error('❌ Error generando favicon.svg:', error.message);
  }

    console.log('✨ ¡Iconos generados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error procesando la imagen:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Ejecutar la función
generateIcons();

