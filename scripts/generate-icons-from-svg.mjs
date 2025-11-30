import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'client', 'public');

const sourceSvgPath = join(publicDir, 'icon-source.svg');

if (!existsSync(sourceSvgPath)) {
  console.error('❌ Error: No se encontró icon-source.svg');
  process.exit(1);
}

console.log('🎨 Generando iconos desde icon-source.svg...');

async function generateIcons() {
  try {
    // Leer el SVG
    const svgBuffer = readFileSync(sourceSvgPath);
    console.log(`📦 SVG leído: ${svgBuffer.length} bytes`);
    
    // Tamaños a generar
    const sizes = [
      { size: 32, name: 'favicon.png' },
      { size: 64, name: 'favicon-64.png' },
      { size: 192, name: 'icon-192x192.png' },
      { size: 512, name: 'icon-512x512.png' }
    ];

    // Generar cada tamaño
    for (const { size, name } of sizes) {
      const outputPath = join(publicDir, name);
      try {
        await sharp(svgBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
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

    // Copiar favicon-64.png como favicon.png si no existe el de 32
    const favicon32Path = join(publicDir, 'favicon.png');
    const favicon64Path = join(publicDir, 'favicon-64.png');
    if (existsSync(favicon64Path) && !existsSync(favicon32Path)) {
      const favicon64Buffer = await sharp(favicon64Path)
        .resize(32, 32)
        .png()
        .toBuffer();
      writeFileSync(favicon32Path, favicon64Buffer);
      console.log('✅ Generado: favicon.png (32x32 desde 64x64)');
    }

    // Generar favicon.svg (copiar el SVG original pero optimizado)
    const faviconSvgPath = join(publicDir, 'favicon.svg');
    const svgContent = readFileSync(sourceSvgPath, 'utf-8');
    writeFileSync(faviconSvgPath, svgContent, 'utf-8');
    console.log('✅ Generado: favicon.svg');

    // Generar icon-source.png (512x512) para compatibilidad con otros scripts
    const iconSourcePngPath = join(publicDir, 'icon-source.png');
    await sharp(svgBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(iconSourcePngPath);
    console.log('✅ Generado: icon-source.png (512x512) para compatibilidad');

    console.log('✨ ¡Iconos generados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error procesando el SVG:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Ejecutar la función
generateIcons();

