/**
 * Script para generar las imágenes que fallaron
 */

const fs = require('fs');
const path = require('path');

// Leer .env manualmente
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
}

const OPENAI_API_KEY = loadEnv();
const OUTPUT_DIR = path.join(__dirname, '../client/public/previews');

// Solo las que fallaron - con prompts corregidos
const PREVIEWS = [
  { id: 'oil', prompt: 'Oil painting style, impressionist landscape of sunflowers in a field, visible brushstrokes, like Monet or Van Gogh' },
  { id: 'artnouveau', prompt: 'Art Nouveau decorative style, Alphonse Mucha inspired, ornate floral frame with flowing organic lines and elegant patterns' },
  { id: 'wideangle', prompt: 'Wide angle lens interior photography of a modern living room, spacious with dramatic perspective and natural light' },
  { id: 'marble', prompt: 'White marble texture with elegant grey veins, polished luxurious stone surface, classical architectural detail' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImage(prompt) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const data = await response.json();
  return data.data[0].url;
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function main() {
  console.log('');
  console.log('========================================');
  console.log('  GENERANDO IMAGENES FALTANTES');
  console.log('========================================');
  console.log('');
  
  console.log('Total: ' + PREVIEWS.length + ' imagenes');
  console.log('Costo: ~$' + (PREVIEWS.length * 0.04).toFixed(2) + ' USD');
  console.log('');

  let generated = 0;
  let failed = 0;

  for (let i = 0; i < PREVIEWS.length; i++) {
    const preview = PREVIEWS[i];
    const filepath = path.join(OUTPUT_DIR, preview.id + '.png');
    
    // Eliminar si existe (para regenerar)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    try {
      console.log('[' + (i + 1) + '/' + PREVIEWS.length + '] Generando: ' + preview.id + '...');
      
      const imageUrl = await generateImage(preview.prompt);
      await downloadImage(imageUrl, filepath);
      
      console.log('         OK - Guardado!');
      generated++;
      
      if (i < PREVIEWS.length - 1) {
        await sleep(1500);
      }
      
    } catch (error) {
      console.error('         ERROR: ' + error.message);
      failed++;
    }
  }

  console.log('');
  console.log('========================================');
  console.log('  COMPLETADO');
  console.log('========================================');
  console.log('Generadas: ' + generated);
  console.log('Fallidas:  ' + failed);
  console.log('');
}

main().catch(console.error);

