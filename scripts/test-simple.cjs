const fs = require('fs');
const path = require('path');

console.log('=== TEST SIMPLE ===');
console.log('Directorio actual:', __dirname);

// Leer .env
const envPath = path.join(__dirname, '../.env');
console.log('Buscando .env en:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env EXISTE');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('Contenido (primeros 50 chars):', content.substring(0, 50));
} else {
  console.log('.env NO EXISTE');
}

// Crear archivo de test
const testPath = path.join(__dirname, '../client/public/test-output.txt');
fs.mkdirSync(path.dirname(testPath), { recursive: true });
fs.writeFileSync(testPath, 'Script ejecutado correctamente: ' + new Date().toISOString());
console.log('Archivo creado:', testPath);
console.log('=== FIN TEST ===');

