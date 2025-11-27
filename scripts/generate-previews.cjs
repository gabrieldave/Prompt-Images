/**
 * Script para generar imágenes de preview con DALL-E 3
 * Uso: node scripts/generate-previews.cjs
 */

const fs = require('fs');
const path = require('path');

// Leer .env manualmente (sin dependencia de dotenv)
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: No se encontró archivo .env');
    return null;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^OPENAI_API_KEY\s*=\s*(.+)$/);
    if (match) {
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const OPENAI_API_KEY = loadEnv();
const OUTPUT_DIR = path.join(__dirname, '../client/public/previews');

// Opciones a generar
const PREVIEWS = [
  // ESTILOS - Render Digital
  { id: 'unreal', prompt: 'Unreal Engine 5 photorealistic 3D render of a futuristic city at sunset, raytracing, cinematic lighting' },
  { id: 'octane', prompt: 'Octane render style, glossy 3D abstract shapes with dramatic lighting and reflections' },
  { id: 'raytracing', prompt: 'Ray tracing demonstration, glass spheres with perfect reflections and refractions on checkered floor' },
  { id: 'blender', prompt: 'Blender 3D render, colorful geometric abstract scene with soft lighting' },
  
  // Geometría
  { id: 'lowpoly', prompt: 'Low poly 3D art style, geometric mountain landscape with triangular shapes, minimal colors' },
  { id: 'voxel', prompt: 'Voxel art style like Minecraft, cute blocky character in colorful world' },
  { id: 'isometric', prompt: 'Isometric view of a tiny detailed room interior, miniature diorama style' },
  { id: 'wireframe', prompt: 'Wireframe 3D render of a sports car, blue lines on dark background, technical style' },
  
  // Retro/Glitch
  { id: 'pixel', prompt: '16-bit pixel art style, retro video game scene with character and colorful background' },
  { id: 'glitch', prompt: 'Glitch art style, distorted portrait with RGB color separation and digital artifacts' },
  { id: 'vhs', prompt: 'VHS aesthetic, vintage photo with scan lines, noise, and retro color grading' },
  { id: 'crt', prompt: 'CRT monitor effect, retro screen with scan lines and slight curve distortion' },
  
  // Arte Tradicional
  { id: 'oil', prompt: 'Oil painting style, impressionist landscape with visible brushstrokes, like Monet' },
  { id: 'watercolor', prompt: 'Watercolor painting, soft floral arrangement with bleeding colors and white spaces' },
  { id: 'acrylic', prompt: 'Acrylic painting style, bold colorful abstract art with thick paint texture' },
  { id: 'gouache', prompt: 'Gouache illustration style, flat matte colors, botanical illustration' },
  { id: 'impasto', prompt: 'Impasto painting technique, thick textured paint strokes, Van Gogh style starry night' },
  
  // Dibujo/Tinta
  { id: 'charcoal', prompt: 'Charcoal sketch drawing, dramatic portrait with deep shadows, on textured paper' },
  { id: 'ink', prompt: 'Ink illustration, detailed black and white drawing with crosshatching technique' },
  { id: 'lineart', prompt: 'Clean line art, minimalist continuous line drawing of a face, simple and elegant' },
  { id: 'blueprint', prompt: 'Technical blueprint drawing, architectural floor plan with measurements, blue and white' },
  { id: 'stippling', prompt: 'Stippling dot art technique, portrait made entirely of small dots, black and white' },
  
  // Estilos Culturales
  { id: 'ukiyo', prompt: 'Ukiyo-e Japanese woodblock print style, The Great Wave style, traditional Japanese art' },
  { id: 'artnouveau', prompt: 'Art Nouveau style, Alphonse Mucha inspired, woman with flowing hair and floral elements' },
  { id: 'bauhaus', prompt: 'Bauhaus design style, geometric shapes, primary colors, modernist composition' },
  { id: 'popart', prompt: 'Pop Art style, Andy Warhol inspired, bold colors, halftone dots, comic style' },
  { id: 'renaissance', prompt: 'Renaissance painting style, classical portrait with dramatic chiaroscuro lighting' },
  
  // CÁMARA - Ángulos
  { id: 'low_angle', prompt: 'Low angle photography shot looking up at skyscraper, dramatic heroic perspective' },
  { id: 'high_angle', prompt: 'High angle shot looking down at person walking on street, bird view' },
  { id: 'drone', prompt: 'Drone aerial photography, birds eye view of coastline and beach from above' },
  { id: 'worm', prompt: 'Worms eye view photography, looking up from ground at tall trees in forest' },
  { id: 'dutch', prompt: 'Dutch angle tilted camera shot, urban street scene with dramatic diagonal composition' },
  
  // Lentes
  { id: 'fisheye', prompt: 'Fisheye lens photography, ultra wide distorted view of city square, circular distortion' },
  { id: 'macro', prompt: 'Macro photography extreme close-up of water droplet on flower petal, shallow depth of field' },
  { id: 'telephoto', prompt: 'Telephoto lens photo, compressed background, portrait with beautiful bokeh' },
  { id: 'tiltshift', prompt: 'Tilt-shift photography, miniature effect of city from above, toy-like appearance' },
  { id: 'wideangle', prompt: 'Wide angle lens interior photography, spacious room with dramatic perspective' },
  
  // Tipo Cámara
  { id: 'gopro', prompt: 'GoPro action camera footage style, extreme sports POV, wide angle action shot' },
  { id: 'cctv', prompt: 'CCTV security camera footage aesthetic, grainy, timestamp overlay, surveillance view' },
  { id: 'polaroid', prompt: 'Polaroid instant photo style, vintage colors, white frame, slightly faded' },
  { id: 'thermal', prompt: 'Thermal camera infrared view, heat signature colors, person silhouette in blue and orange' },
  { id: 'double_exp', prompt: 'Double exposure photography, portrait merged with forest trees, artistic overlay' },
  
  // ILUMINACIÓN - Natural
  { id: 'golden', prompt: 'Golden hour photography, warm sunset lighting on landscape, orange and gold tones' },
  { id: 'blue', prompt: 'Blue hour photography, twilight cityscape with deep blue sky and city lights' },
  { id: 'overcast', prompt: 'Overcast soft lighting, portrait with diffused cloudy day light, no harsh shadows' },
  { id: 'moonlight', prompt: 'Moonlight night scene, landscape illuminated by full moon, blue silver tones' },
  { id: 'sunbeam', prompt: 'Sun rays streaming through forest trees, volumetric light beams, magical atmosphere' },
  
  // Artificial
  { id: 'neon', prompt: 'Neon lighting, cyberpunk style portrait with pink and blue neon glow' },
  { id: 'softbox', prompt: 'Studio softbox lighting, professional product photography, clean and perfect' },
  { id: 'hardlight', prompt: 'Hard light photography, dramatic sharp shadows, high contrast portrait' },
  { id: 'volumetric', prompt: 'Volumetric lighting with fog, god rays in misty forest, atmospheric' },
  { id: 'spotlight', prompt: 'Single spotlight dramatic lighting, performer on dark stage, theatrical' },
  
  // Especial
  { id: 'biolum', prompt: 'Bioluminescence glow, jellyfish glowing in dark ocean water, ethereal blue light' },
  { id: 'rim', prompt: 'Rim lighting backlit silhouette, person with glowing edges against bright background' },
  { id: 'candlelight', prompt: 'Candlelight warm scene, intimate dinner setting with flickering candle glow' },
  { id: 'rembrandt', prompt: 'Rembrandt lighting portrait, triangle of light on cheek, classical dramatic' },
  { id: 'chiaroscuro', prompt: 'Chiaroscuro lighting, extreme contrast between light and dark, Caravaggio style' },
  
  // MATERIALES - Sólidos
  { id: 'chrome', prompt: 'Chrome metallic surface, reflective silver material, mirror-like metal texture' },
  { id: 'matte', prompt: 'Matte finish surface, non-reflective smooth material, soft texture' },
  { id: 'gold', prompt: 'Gold metallic material, luxurious shiny golden surface with reflections' },
  { id: 'wood', prompt: 'Wood grain texture, natural carved wooden surface, warm brown tones' },
  { id: 'marble', prompt: 'White marble texture with grey veins, polished stone surface, elegant' },
  { id: 'obsidian', prompt: 'Black obsidian volcanic glass, glossy dark surface with subtle reflections' },
  { id: 'concrete', prompt: 'Raw concrete brutalist texture, grey cement wall, industrial aesthetic' },
  
  // Translúcidos
  { id: 'glass', prompt: 'Translucent glass material, clear transparent surface with light refraction' },
  { id: 'crystal', prompt: 'Crystal prism, rainbow light refraction through clear geometric crystal' },
  { id: 'smoke', prompt: 'Smoke and vapor, wispy ethereal smoke trails on dark background' },
  { id: 'liquid', prompt: 'Liquid water splash, dynamic droplets and waves, crystal clear water' },
  { id: 'holographic', prompt: 'Holographic iridescent material, rainbow shifting colors, futuristic' },
  { id: 'ice', prompt: 'Frozen ice texture, crystalline blue ice surface with cracks and frost' },
  
  // Artesanales
  { id: 'origami', prompt: 'Origami paper art, folded paper crane, delicate paper texture' },
  { id: 'knitted', prompt: 'Knitted wool texture, cozy chunky knit pattern, soft fabric close-up' },
  { id: 'clay', prompt: 'Clay sculpted figure, handmade pottery texture, ceramic art' },
  { id: 'papercut', prompt: 'Paper cutout layered art, intricate paper craft with shadows and depth' },
  { id: 'felt', prompt: 'Felt fabric craft, soft colorful felt texture, handmade aesthetic' },
  
  // VIBES - Futurismo
  { id: 'cyberpunk', prompt: 'Cyberpunk aesthetic, neon-lit rainy city street at night, Blade Runner style' },
  { id: 'solarpunk', prompt: 'Solarpunk eco-future, green sustainable city with plants and solar panels' },
  { id: 'synthwave', prompt: 'Synthwave 80s retro, neon grid, palm trees, sunset, outrun aesthetic' },
  { id: 'scifi', prompt: 'Sci-fi futuristic space station interior, sleek technology, blue lighting' },
  { id: 'afrofuturism', prompt: 'Afrofuturism aesthetic, African-inspired futuristic warrior with advanced technology' },
  
  // Fantasía/Retro
  { id: 'steampunk', prompt: 'Steampunk aesthetic, Victorian brass gears and copper machinery, vintage tech' },
  { id: 'darkfantasy', prompt: 'Dark fantasy gothic castle, medieval architecture, moody stormy atmosphere' },
  { id: 'noir', prompt: 'Film noir style, black and white, detective with hat, dramatic shadows' },
  { id: 'vintage50s', prompt: 'Vintage 1950s Americana, retro diner, classic cars, nostalgic colors' },
  { id: 'vaporwave', prompt: 'Vaporwave aesthetic, pink and purple, Greek statue, retro computer graphics' },
  
  // Abstracto
  { id: 'surreal', prompt: 'Surrealism art, Salvador Dali inspired, melting clocks, dreamlike impossible scene' },
  { id: 'minimal', prompt: 'Minimalist clean design, simple geometric shapes, lots of white space' },
  { id: 'psychedelic', prompt: 'Psychedelic trippy art, colorful swirling patterns, 60s hippie style' },
  { id: 'abstract', prompt: 'Abstract geometric art, colorful shapes and forms, modern composition' },
  { id: 'dreamcore', prompt: 'Dreamcore liminal space, empty nostalgic room, surreal unsettling calm' },
  
  // ANIME
  { id: 'ghibli', prompt: 'Studio Ghibli anime style, soft colors, peaceful countryside scene, hand-drawn' },
  { id: 'shinkai', prompt: 'Makoto Shinkai anime style, incredibly detailed sky with clouds, vibrant colors' },
  { id: 'retro_anime', prompt: '90s retro anime style, cel shaded, vintage Japanese animation aesthetic' },
  { id: 'akira', prompt: 'Akira anime style, cyberpunk motorcycle, neon Tokyo, detailed animation' },
  { id: 'chibi', prompt: 'Chibi anime style, cute character with big head small body, kawaii' },
  
  // Western
  { id: 'pixar', prompt: 'Pixar 3D animation style, cute character with big eyes, detailed render' },
  { id: 'disney2d', prompt: 'Disney 2D classic animation style, princess character, magical sparkles' },
  { id: 'looney', prompt: 'Looney Tunes cartoon style, exaggerated expressions, colorful animation' },
  { id: 'rubberhose', prompt: 'Rubber hose 1930s cartoon style, black and white, bendy limbs, vintage' },
  { id: 'simpsons', prompt: 'Simpsons cartoon style, yellow character, simple animation, TV show aesthetic' },
  
  // Comics
  { id: 'manga', prompt: 'Manga black and white style, Japanese comic, screentone shading, expressive' },
  { id: 'marvel', prompt: 'Marvel comic book style, superhero action pose, bold colors, dynamic' },
  { id: 'graphicnovel', prompt: 'Graphic novel illustration, detailed shading, mature comic art style' },
  { id: 'webtoon', prompt: 'Webtoon Korean comic style, soft pastel colors, romantic scene, clean lines' },
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
  console.log('  GENERADOR DE PREVIEWS CON DALL-E 3');
  console.log('========================================');
  console.log('');
  
  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY no encontrada en .env');
    console.log('');
    console.log('Tu archivo .env debe contener:');
    console.log('OPENAI_API_KEY=sk-...');
    process.exit(1);
  }
  
  console.log('API Key: ' + OPENAI_API_KEY.substring(0, 10) + '...' + OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4));
  console.log('');

  // Crear directorio
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Directorio creado:', OUTPUT_DIR);
  } else {
    console.log('Directorio existe:', OUTPUT_DIR);
  }

  const total = PREVIEWS.length;
  console.log('');
  console.log('Total imagenes: ' + total);
  console.log('Costo estimado: ~$' + (total * 0.04).toFixed(2) + ' USD');
  console.log('');
  console.log('Iniciando en 3 segundos... (Ctrl+C para cancelar)');
  
  await sleep(3000);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < PREVIEWS.length; i++) {
    const preview = PREVIEWS[i];
    const filepath = path.join(OUTPUT_DIR, preview.id + '.png');
    
    if (fs.existsSync(filepath)) {
      console.log('[' + (i + 1) + '/' + total + '] ' + preview.id + ' - Ya existe, saltando');
      skipped++;
      continue;
    }

    try {
      console.log('[' + (i + 1) + '/' + total + '] Generando: ' + preview.id + '...');
      
      const imageUrl = await generateImage(preview.prompt);
      await downloadImage(imageUrl, filepath);
      
      console.log('         OK - Guardado!');
      generated++;
      
      // Esperar para evitar rate limits
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
  console.log('');
  console.log('Generadas: ' + generated);
  console.log('Saltadas:  ' + skipped);
  console.log('Fallidas:  ' + failed);
  console.log('Costo:     ~$' + (generated * 0.04).toFixed(2) + ' USD');
  console.log('');
}

main().catch(err => {
  console.error('');
  console.error('ERROR FATAL:', err.message);
  console.error('');
  process.exit(1);
});
