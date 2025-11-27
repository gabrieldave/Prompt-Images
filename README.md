# 🎨 Image Prompt Architect

Generador inteligente de prompts para imágenes con IA. Crea prompts profesionales para **Gemini**, **Midjourney**, **DALL-E**, **Stable Diffusion** y más.

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características

### 🔧 Constructor Visual
Selecciona características de cada categoría para construir tu prompt perfecto:
- **Estilos**: Render digital, arte tradicional, dibujo, estilos culturales
- **Cámara**: Ángulos, lentes especiales, tipos de cámara
- **Iluminación**: Natural, artificial, efectos especiales
- **Materiales**: Sólidos, translúcidos, artesanales
- **Ambiente**: Futurismo, fantasía, abstracto
- **Animación**: Anime japonés, cartoon occidental, cómics
- **Formato**: Aspect ratios para diferentes plataformas

### 🪄 Modo Mago (IA)
Describe lo que quieres en palabras simples y la IA (OpenAI) genera un prompt profesional automáticamente.

### 📚 Recetas Rápidas
Templates listos para casos de uso comunes:
- 🛍️ Producto E-commerce
- 💎 Producto Premium
- 🍔 Fotografía de Comida
- 👗 Moda Flat Lay / Editorial
- 🎮 Concept Art Gaming
- 🏠 Diseño Interior
- 📱 Marketing/Banners

### ⚡ Mejora con IA
Botón para mejorar automáticamente cualquier prompt con detalles profesionales.

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- API Key de OpenAI (para funciones de IA)

### Pasos

1. **Clona el repositorio**
```bash
git clone https://github.com/gabrieldave/Prompt-Images.git
cd Prompt-Images
```

2. **Crea el archivo `.env`** en la raíz del proyecto:
```env
OPENAI_API_KEY=tu-api-key-de-openai
```

3. **Instala dependencias**
```bash
npm install
```

4. **Inicia el servidor de desarrollo**

En Windows:
```bash
npm run dev:win
```

En Mac/Linux:
```bash
npm run dev
```

5. **Abre tu navegador** en `http://localhost:5000`

### Instalación Rápida (Windows)
Simplemente ejecuta `install.bat` con doble clic.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **Animaciones**: Framer Motion
- **Backend**: Express.js + Node.js
- **IA**: OpenAI API (GPT-4o-mini)

## 📖 Uso

### Constructor Visual
1. Escribe la descripción principal de tu imagen
2. Selecciona opciones de cada categoría (estilo, cámara, luz, etc.)
3. Copia el prompt generado
4. Opcionalmente, usa "Mejorar con IA" para optimizarlo

### Modo Mago
1. Describe en español qué imagen quieres crear
2. Haz clic en "Generar Prompt Profesional"
3. La IA creará un prompt detallado en inglés
4. Copia y usa en tu herramienta de IA favorita

### Recetas
1. Selecciona una receta según tu caso de uso
2. Completa los campos personalizables
3. Copia el prompt listo

## 🔑 API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ai/wizard` | POST | Genera prompt desde descripción simple |
| `/api/ai/improve` | POST | Mejora un prompt existente |
| `/api/ai/reverse` | POST | Ingeniería inversa de estilo |
| `/api/ai/variations` | POST | Genera variaciones creativas |

## 📝 Licencia

MIT License - Libre para uso personal y comercial.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request.

---

Hecho con 💜 para crear imágenes increíbles

