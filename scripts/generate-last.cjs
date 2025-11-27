const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
}

const OPENAI_API_KEY = loadEnv();
const OUTPUT_DIR = path.join(__dirname, '../client/public/previews');

async function main() {
  console.log('');
  console.log('Generando: artnouveau...');
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: 'Art Nouveau decorative poster design, Alphonse Mucha style, elegant ornamental border with flowing organic curves, peacock feathers and iris flowers, gold and teal colors, vintage 1900s aesthetic',
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('ERROR:', JSON.stringify(error));
    return;
  }

  const data = await response.json();
  const imageUrl = data.data[0].url;
  
  const imgResponse = await fetch(imageUrl);
  const buffer = await imgResponse.arrayBuffer();
  
  const filepath = path.join(OUTPUT_DIR, 'artnouveau.png');
  fs.writeFileSync(filepath, Buffer.from(buffer));
  
  console.log('OK - Guardado!');
  console.log('');
}

main().catch(err => console.error('Error:', err.message));

