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

async function generateIcons() {
  try {
    // Leer metadatos primero
    const metadata = await sharp(sourceImagePath).metadata();
    console.log(`📐 Imagen original: ${metadata.width}x${metadata.height}, formato: ${metadata.format}`);
    
    // Función para generar icono con medidas exactas
    async function generateIcon(size, outputPath) {
      try {
        await sharp(sourceImagePath)
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
        const outputMetadata = await sharp(outputPath).metadata();
        if (outputMetadata.width === size && outputMetadata.height === size) {
          console.log(`✅ Generado: ${outputPath.split(/[/\\]/).pop()} (${size}x${size})`);
          return true;
        } else {
          console.error(`⚠️  ${outputPath} tiene medidas incorrectas: ${outputMetadata.width}x${outputMetadata.height}`);
          return false;
        }
      } catch (error) {
        console.error(`❌ Error generando ${outputPath}:`, error.message);
        return false;
      }
    }

    // Generar favicon.png (32x32)
    await generateIcon(32, join(publicDir, 'favicon.png'));

    // Generar iconos PWA
    await generateIcon(192, join(publicDir, 'icon-192x192.png'));
    await generateIcon(512, join(publicDir, 'icon-512x512.png'));

    // Generar favicon.svg desde la imagen redimensionada a 64x64
    const faviconSvgPath = join(publicDir, 'favicon.svg');
    try {
      const svg64Buffer = await sharp(sourceImagePath)
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
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

generateIcons();
