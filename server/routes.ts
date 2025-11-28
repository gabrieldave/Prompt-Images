import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";

// Sistema de prompts para el asistente de IA
const SYSTEM_PROMPT_WIZARD = `Eres un experto en generación de imágenes con IA (Gemini, Midjourney, DALL-E, Stable Diffusion). 
Tu trabajo es convertir descripciones simples en prompts profesionales y detallados.

REGLAS:
1. Siempre incluye los 4 pilares: Estilo + Cámara + Iluminación + Material/Textura
2. Usa términos técnicos en inglés para mejor compatibilidad
3. Sé específico con colores, materiales y ambientes
4. Incluye calidad (4K, 8K, high resolution) y estilo de renderizado cuando aplique
5. Responde SOLO con el prompt generado, sin explicaciones adicionales
6. El prompt debe ser en inglés para mejor compatibilidad con las IAs

EJEMPLO:
Input: "quiero una imagen de un gato espacial"
Output: "A majestic space cat floating in zero gravity, wearing a sleek astronaut helmet with golden visor. Nebula background with purple and blue cosmic clouds. Unreal Engine 5 render, volumetric lighting with rim light effect, metallic chrome suit texture. Low angle shot, 8K resolution, cinematic composition, sci-fi aesthetic."`;

const SYSTEM_PROMPT_IMPROVE = `Eres un experto en optimización de prompts para generación de imágenes con IA.
Tu trabajo es tomar un prompt existente y mejorarlo significativamente.

MEJORAS QUE DEBES APLICAR:
1. Añadir detalles de iluminación si faltan (Golden Hour, Neon, Volumetric, etc.)
2. Especificar ángulo de cámara si no está claro
3. Añadir calidad y resolución (4K, 8K, high detail)
4. Incluir estilo de renderizado (Unreal Engine, Octane, etc.) si aplica
5. Mejorar la descripción de materiales y texturas
6. Añadir ambiente/vibe si falta (Cyberpunk, Minimalist, etc.)
7. Mantener la esencia original pero hacerlo más profesional

REGLAS:
- Responde SOLO con el prompt mejorado, sin explicaciones
- El prompt debe ser en inglés
- No cambies el sujeto principal, solo mejora los detalles técnicos`;

const SYSTEM_PROMPT_REVERSE = `Eres un experto analizando imágenes y describiendo sus características técnicas.
El usuario te describirá una imagen o te dará un concepto, y debes generar un prompt detallado para replicar ese estilo.

ANALIZA Y DESCRIBE:
1. Estilo visual (fotorrealista, anime, pintura, 3D render, etc.)
2. Tipo de iluminación (natural, artificial, colores)
3. Ángulo de cámara y composición
4. Materiales y texturas visibles
5. Paleta de colores dominante
6. Ambiente/mood general
7. Calidad y nivel de detalle

REGLAS:
- Responde SOLO con el prompt que replicaría esa imagen/estilo
- El prompt debe ser en inglés
- Sé muy específico y detallado`;

const SYSTEM_PROMPT_IMAGE_ANALYSIS = `Eres un experto en análisis de imágenes y generación de prompts para IA.
El usuario te mostrará una imagen y debes analizarla profundamente para generar un prompt que permita crear algo similar.

ANALIZA DETALLADAMENTE:
1. **Sujeto principal**: ¿Qué es lo que muestra la imagen? (persona, objeto, paisaje, etc.)
2. **Estilo artístico**: ¿Es fotorrealista, ilustración, anime, pintura al óleo, 3D render, etc.?
3. **Iluminación**: ¿Natural, artificial, neón, Golden Hour, dramática, suave?
4. **Ángulo de cámara**: ¿Frontal, cenital, contrapicado, macro, wide angle?
5. **Paleta de colores**: ¿Cuáles son los colores dominantes y el mood?
6. **Texturas y materiales**: ¿Qué texturas son visibles?
7. **Composición**: ¿Cómo está compuesta la imagen?
8. **Ambiente/Vibe**: ¿Cyberpunk, minimalista, vintage, futurista, etc.?

REGLAS IMPORTANTES:
- Genera UN SOLO prompt completo y detallado en INGLÉS
- El prompt debe ser usable directamente en Midjourney, DALL-E o Gemini
- NO incluyas explicaciones, solo el prompt
- Sé MUY específico con los detalles técnicos
- Incluye calidad (4K, 8K, high detail) y estilo de render si aplica`;

const SYSTEM_PROMPT_IMAGE_ANALYSIS_STRUCTURED = `Eres un experto en análisis de imágenes para generación con IA.
Analiza la imagen y devuelve un JSON con las siguientes categorías SEPARADAS.
Cada categoría debe contener una descripción en INGLÉS, técnica y detallada, lista para usar en prompts.

RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO, sin explicaciones ni texto adicional.

El formato EXACTO debe ser:
{
  "style": "descripción del estilo artístico (anime, photorealistic, oil painting, 3D render, etc.)",
  "lighting": "descripción de la iluminación (golden hour, neon glow, dramatic shadows, soft ambient, etc.)",
  "colors": "paleta de colores dominante (warm tones, muted blues, high contrast, etc.)",
  "camera": "ángulo y composición (close-up, wide shot, low angle, cinematic framing, etc.)",
  "atmosphere": "ambiente y mood (melancholic, energetic, peaceful, cyberpunk, nostalgic, etc.)",
  "textures": "materiales y texturas visibles (smooth skin, metallic, fabric details, etc.)",
  "quality": "calidad y render (8K, high detail, Unreal Engine 5, etc.)",
  "subject": "descripción del sujeto principal (young woman, sports car, mountain landscape, etc.)"
}

REGLAS:
- Cada campo debe ser una frase en INGLÉS, descriptiva y usable directamente en un prompt
- NO incluyas el nombre del campo en la descripción
- Sé específico y técnico
- El campo "subject" describe QUÉ hay en la imagen (el usuario puede elegir no usarlo)
- Si no hay información clara para un campo, pon una descripción genérica apropiada`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Endpoint de diagnóstico/health check
  app.get("/api/health", (req, res) => {
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    res.json({
      status: "ok",
      openai_configured: hasOpenAIKey,
      node_env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      timestamp: new Date().toISOString()
    });
  });
  
  // Endpoint: Modo Mago - Convierte descripción simple en prompt profesional
  app.post("/api/ai/wizard", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Se requiere una descripción" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ OPENAI_API_KEY no encontrada");
        console.error("NODE_ENV:", process.env.NODE_ENV);
        console.error("VERCEL:", process.env.VERCEL);
        console.error("Variables que contienen 'OPENAI':", Object.keys(process.env).filter(k => k.toUpperCase().includes('OPENAI')));
        return res.status(500).json({ 
          error: "API key de OpenAI no configurada. Ve a Vercel → Settings → Environment Variables y añade OPENAI_API_KEY. Luego redespliega el proyecto.",
          debug: {
            hasKey: false,
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL
          }
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_WIZARD },
            { role: "user", content: description }
          ],
          max_tokens: 500,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return res.status(response.status).json({ error: "Error al comunicarse con OpenAI" });
      }

      const data = await response.json();
      const generatedPrompt = data.choices[0]?.message?.content?.trim();

      res.json({ prompt: generatedPrompt });
    } catch (error) {
      console.error("Error in /api/ai/wizard:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ 
        error: `Error interno del servidor: ${errorMessage}`,
        debug: {
          hasOpenAIKey: !!process.env.OPENAI_API_KEY,
          nodeEnv: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL
        }
      });
    }
  });

  // Endpoint: Mejorar Prompt existente
  app.post("/api/ai/improve", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Se requiere un prompt" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ OPENAI_API_KEY no encontrada");
        console.error("NODE_ENV:", process.env.NODE_ENV);
        console.error("VERCEL:", process.env.VERCEL);
        console.error("Variables que contienen 'OPENAI':", Object.keys(process.env).filter(k => k.toUpperCase().includes('OPENAI')));
        return res.status(500).json({ 
          error: "API key de OpenAI no configurada. Ve a Vercel → Settings → Environment Variables y añade OPENAI_API_KEY. Luego redespliega el proyecto.",
          debug: {
            hasKey: false,
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL
          }
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_IMPROVE },
            { role: "user", content: `Mejora este prompt: ${prompt}` }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return res.status(response.status).json({ error: "Error al comunicarse con OpenAI" });
      }

      const data = await response.json();
      const improvedPrompt = data.choices[0]?.message?.content?.trim();

      res.json({ prompt: improvedPrompt });
    } catch (error) {
      console.error("Error in /api/ai/improve:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint: Ingeniería Inversa - Describir estilo para replicar
  app.post("/api/ai/reverse", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Se requiere una descripción del estilo" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ OPENAI_API_KEY no encontrada");
        console.error("NODE_ENV:", process.env.NODE_ENV);
        console.error("VERCEL:", process.env.VERCEL);
        console.error("Variables que contienen 'OPENAI':", Object.keys(process.env).filter(k => k.toUpperCase().includes('OPENAI')));
        return res.status(500).json({ 
          error: "API key de OpenAI no configurada. Ve a Vercel → Settings → Environment Variables y añade OPENAI_API_KEY. Luego redespliega el proyecto.",
          debug: {
            hasKey: false,
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL
          }
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_REVERSE },
            { role: "user", content: `Genera un prompt para replicar este estilo/imagen: ${description}` }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return res.status(response.status).json({ error: "Error al comunicarse con OpenAI" });
      }

      const data = await response.json();
      const reversePrompt = data.choices[0]?.message?.content?.trim();

      res.json({ prompt: reversePrompt });
    } catch (error) {
      console.error("Error in /api/ai/reverse:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint: Analizar imagen y extraer prompt (Ingeniería Inversa)
  app.post("/api/ai/analyze-image", async (req, res) => {
    try {
      const { imageBase64, imageUrl } = req.body;
      
      console.log("📸 Analyze-image request received");
      console.log("Has imageBase64:", !!imageBase64);
      console.log("Has imageUrl:", !!imageUrl);
      
      if (!imageBase64 && !imageUrl) {
        return res.status(400).json({ error: "Se requiere una imagen (base64 o URL)" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ No API key found!");
        return res.status(500).json({ error: "API key de OpenAI no configurada" });
      }
      console.log("✓ API key found");

      // Construir el contenido de la imagen para GPT-4 Vision
      let imageContent: any;
      if (imageBase64) {
        // Verificar tamaño del base64 (OpenAI tiene límite de ~20MB)
        const sizeInMB = (imageBase64.length * 0.75) / (1024 * 1024);
        console.log(`📊 Image size: ~${sizeInMB.toFixed(2)} MB`);
        
        imageContent = {
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
            detail: "low" // Usar "low" para reducir costo y evitar errores
          }
        };
      } else {
        imageContent = {
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "low"
          }
        };
      }

      console.log("🚀 Sending to OpenAI...");
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Usar mini que es más rápido y barato
          messages: [
            { role: "system", content: SYSTEM_PROMPT_IMAGE_ANALYSIS },
            { 
              role: "user", 
              content: [
                { type: "text", text: "Analiza esta imagen y genera un prompt detallado para recrear algo similar:" },
                imageContent
              ]
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      console.log("📬 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ OpenAI API error:", JSON.stringify(errorData, null, 2));
        
        // Mensaje más específico según el error
        if (response.status === 400) {
          return res.status(400).json({ 
            error: errorData.error?.message || "Error con la imagen. Intenta con otra imagen." 
          });
        }
        if (response.status === 429) {
          return res.status(429).json({ error: "Límite de API excedido. Intenta en unos segundos." });
        }
        return res.status(response.status).json({ error: "Error al analizar la imagen" });
      }

      const data = await response.json();
      const extractedPrompt = data.choices[0]?.message?.content?.trim();

      console.log("✅ Successfully extracted prompt!");
      res.json({ prompt: extractedPrompt });
    } catch (error) {
      console.error("❌ Error in /api/ai/analyze-image:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint: Analizar imagen de forma ESTRUCTURADA (desglosada por categorías)
  app.post("/api/ai/analyze-image-structured", async (req, res) => {
    try {
      const { imageBase64, imageUrl } = req.body;
      
      console.log("📸 Analyze-image-structured request received");
      
      if (!imageBase64 && !imageUrl) {
        return res.status(400).json({ error: "Se requiere una imagen (base64 o URL)" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ No API key found!");
        return res.status(500).json({ error: "API key de OpenAI no configurada" });
      }

      // Construir el contenido de la imagen
      let imageContent: any;
      if (imageBase64) {
        imageContent = {
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
            detail: "low"
          }
        };
      } else {
        imageContent = {
          type: "image_url",
          image_url: { url: imageUrl, detail: "low" }
        };
      }

      console.log("🚀 Sending to OpenAI for structured analysis...");
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_IMAGE_ANALYSIS_STRUCTURED },
            { 
              role: "user", 
              content: [
                { type: "text", text: "Analiza esta imagen y devuelve el JSON estructurado:" },
                imageContent
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      console.log("📬 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ OpenAI API error:", JSON.stringify(errorData, null, 2));
        return res.status(response.status).json({ 
          error: errorData.error?.message || "Error al analizar la imagen" 
        });
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content?.trim();
      
      // Limpiar el JSON si viene con markdown
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      try {
        const analysis = JSON.parse(content);
        console.log("✅ Successfully extracted structured analysis!");
        res.json({ analysis });
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", content);
        // Si falla el parse, devolver como texto
        res.json({ 
          analysis: {
            style: content,
            lighting: "",
            colors: "",
            camera: "",
            atmosphere: "",
            textures: "",
            quality: "8K, high detail",
            subject: ""
          }
        });
      }
    } catch (error) {
      console.error("❌ Error in /api/ai/analyze-image-structured:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint: Generar variaciones creativas
  // Endpoint de diagnóstico para verificar variables de entorno en Vercel
  app.get("/api/diagnose-env", (req, res) => {
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const keyLength = process.env.OPENAI_API_KEY?.length || 0;
    const keyPrefix = process.env.OPENAI_API_KEY?.substring(0, 7) || 'N/A';
    
    res.json({
      openai_api_key: {
        exists: hasOpenAIKey,
        length: keyLength,
        prefix: hasOpenAIKey ? `${keyPrefix}...` : 'N/A',
        configured: hasOpenAIKey && keyLength > 20
      },
      environment: {
        node_env: process.env.NODE_ENV || 'not set',
        vercel: !!process.env.VERCEL,
        vercel_env: process.env.VERCEL_ENV || 'not set',
        port: process.env.PORT || 'not set'
      },
      all_env_keys: Object.keys(process.env)
        .filter(k => k.toUpperCase().includes('OPENAI') || k.toUpperCase().includes('API'))
        .sort()
    });
  });

  app.post("/api/ai/variations", async (req, res) => {
    try {
      const { prompt, count = 3 } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Se requiere un prompt base" });
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ OPENAI_API_KEY no encontrada");
        console.error("NODE_ENV:", process.env.NODE_ENV);
        console.error("VERCEL:", process.env.VERCEL);
        console.error("Variables que contienen 'OPENAI':", Object.keys(process.env).filter(k => k.toUpperCase().includes('OPENAI')));
        return res.status(500).json({ 
          error: "API key de OpenAI no configurada. Ve a Vercel → Settings → Environment Variables y añade OPENAI_API_KEY. Luego redespliega el proyecto.",
          debug: {
            hasKey: false,
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL
          }
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: `Eres un experto en prompts de imágenes. Genera ${count} variaciones creativas del prompt dado.
              Cada variación debe:
              1. Mantener la esencia del sujeto principal
              2. Cambiar significativamente el estilo, iluminación o ambiente
              3. Ser única y diferente a las demás
              
              FORMATO DE RESPUESTA:
              Devuelve SOLO un JSON array con las variaciones, sin explicaciones.
              Ejemplo: ["variación 1", "variación 2", "variación 3"]` 
            },
            { role: "user", content: `Genera ${count} variaciones de: ${prompt}` }
          ],
          max_tokens: 1000,
          temperature: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return res.status(response.status).json({ error: "Error al comunicarse con OpenAI" });
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      try {
        const variations = JSON.parse(content);
        res.json({ variations });
      } catch {
        // Si no es JSON válido, intentar extraer las variaciones
        res.json({ variations: [content] });
      }
    } catch (error) {
      console.error("Error in /api/ai/variations:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  return httpServer;
}
