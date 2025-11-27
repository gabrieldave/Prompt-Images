export type Category = 'style' | 'camera' | 'lighting' | 'material' | 'vibe' | 'anime' | 'format' | 'physics' | 'adherence' | 'editing';

export interface PromptOption {
  id: string;
  label: string;
  labelEs: string;
  value: string;
  description?: string;
  descriptionEs?: string;
  category: Category;
  group?: string;
  groupEs?: string;
  previewUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  icon: string;
  description: string;
  promptTemplate: string;
  category: 'producto' | 'marketing' | 'arte' | 'comida' | 'moda' | 'arquitectura' | 'trading' | 'educacion' | 'saas' | 'digital';
}

// Imágenes locales generadas con DALL-E 3
const LOCAL_PREVIEW = (id: string) => `/previews/${id}.png`;

export const PROMPT_OPTIONS: PromptOption[] = [
  // ═══════════════════════════════════════════════════════════════
  // ESTILOS - Render Digital & 3D
  // ═══════════════════════════════════════════════════════════════
  { id: 'unreal', label: 'Unreal Engine 5', labelEs: 'Unreal Engine 5', value: 'Unreal Engine 5 render', category: 'style', group: 'Digital Render', groupEs: 'Render Digital', previewUrl: LOCAL_PREVIEW('unreal') },
  { id: 'octane', label: 'Octane Render', labelEs: 'Octane Render', value: 'Octane Render', category: 'style', group: 'Digital Render', groupEs: 'Render Digital', previewUrl: LOCAL_PREVIEW('octane') },
  { id: 'raytracing', label: 'Ray Tracing', labelEs: 'Ray Tracing', value: 'Ray Tracing', category: 'style', group: 'Digital Render', groupEs: 'Render Digital', previewUrl: LOCAL_PREVIEW('raytracing') },
  { id: 'blender', label: 'Blender Eevee', labelEs: 'Blender Eevee', value: 'Blender Eevee render', category: 'style', group: 'Digital Render', groupEs: 'Render Digital', previewUrl: LOCAL_PREVIEW('blender') },
  
  // Geometría/Estética
  { id: 'lowpoly', label: 'Low Poly', labelEs: 'Low Poly', value: 'Low Poly 3D render', category: 'style', group: 'Geometry', groupEs: 'Geometría', previewUrl: LOCAL_PREVIEW('lowpoly') },
  { id: 'voxel', label: 'Voxel Art', labelEs: 'Arte Voxel', value: 'Voxel Art style (Minecraft-like)', category: 'style', group: 'Geometry', groupEs: 'Geometría', previewUrl: LOCAL_PREVIEW('voxel') },
  { id: 'isometric', label: 'Isometric', labelEs: 'Isométrico', value: 'Isometric View', category: 'style', group: 'Geometry', groupEs: 'Geometría', previewUrl: LOCAL_PREVIEW('isometric') },
  { id: 'wireframe', label: 'Wireframe', labelEs: 'Wireframe', value: 'Wireframe render', category: 'style', group: 'Geometry', groupEs: 'Geometría', previewUrl: LOCAL_PREVIEW('wireframe') },
  
  // Retro/Glitch
  { id: 'pixel', label: 'Pixel Art', labelEs: 'Pixel Art', value: 'Pixel Art (8-bit/16-bit style)', category: 'style', group: 'Retro', groupEs: 'Retro/Glitch', previewUrl: LOCAL_PREVIEW('pixel') },
  { id: 'glitch', label: 'Glitch Art', labelEs: 'Arte Glitch', value: 'Glitch Art with digital artifacts', category: 'style', group: 'Retro', groupEs: 'Retro/Glitch', previewUrl: LOCAL_PREVIEW('glitch') },
  { id: 'vhs', label: 'VHS Effect', labelEs: 'Efecto VHS', value: 'VHS Effect overlay, scan lines', category: 'style', group: 'Retro', groupEs: 'Retro/Glitch', previewUrl: LOCAL_PREVIEW('vhs') },
  { id: 'crt', label: 'CRT Monitor', labelEs: 'Monitor CRT', value: 'CRT Monitor Style with scan lines', category: 'style', group: 'Retro', groupEs: 'Retro/Glitch', previewUrl: LOCAL_PREVIEW('crt') },

  // ═══════════════════════════════════════════════════════════════
  // ESTILOS - Arte Tradicional
  // ═══════════════════════════════════════════════════════════════
  { id: 'oil', label: 'Oil Painting', labelEs: 'Pintura al Óleo', value: 'Oil Painting style', category: 'style', group: 'Traditional', groupEs: 'Pintura', previewUrl: LOCAL_PREVIEW('oil') },
  { id: 'watercolor', label: 'Watercolor', labelEs: 'Acuarela', value: 'Watercolor painting', category: 'style', group: 'Traditional', groupEs: 'Pintura', previewUrl: LOCAL_PREVIEW('watercolor') },
  { id: 'acrylic', label: 'Acrylic', labelEs: 'Acrílico', value: 'Acrylic painting style', category: 'style', group: 'Traditional', groupEs: 'Pintura', previewUrl: LOCAL_PREVIEW('acrylic') },
  { id: 'gouache', label: 'Gouache', labelEs: 'Gouache', value: 'Gouache painting', category: 'style', group: 'Traditional', groupEs: 'Pintura', previewUrl: LOCAL_PREVIEW('gouache') },
  { id: 'impasto', label: 'Impasto', labelEs: 'Impasto', value: 'Impasto thick texture painting', category: 'style', group: 'Traditional', groupEs: 'Pintura', previewUrl: LOCAL_PREVIEW('impasto') },
  
  // Dibujo/Tinta
  { id: 'charcoal', label: 'Charcoal', labelEs: 'Carboncillo', value: 'Charcoal Sketch drawing', category: 'style', group: 'Drawing', groupEs: 'Dibujo/Tinta', previewUrl: LOCAL_PREVIEW('charcoal') },
  { id: 'ink', label: 'Ink Illustration', labelEs: 'Ilustración Tinta', value: 'Ink Illustration', category: 'style', group: 'Drawing', groupEs: 'Dibujo/Tinta', previewUrl: LOCAL_PREVIEW('ink') },
  { id: 'lineart', label: 'Line Art', labelEs: 'Line Art', value: 'Clean Line Art', category: 'style', group: 'Drawing', groupEs: 'Dibujo/Tinta', previewUrl: LOCAL_PREVIEW('lineart') },
  { id: 'blueprint', label: 'Blueprint', labelEs: 'Plano Técnico', value: 'Technical Drawing Blueprint style', category: 'style', group: 'Drawing', groupEs: 'Dibujo/Tinta', previewUrl: LOCAL_PREVIEW('blueprint') },
  { id: 'stippling', label: 'Stippling', labelEs: 'Punteado', value: 'Stippling dot technique', category: 'style', group: 'Drawing', groupEs: 'Dibujo/Tinta', previewUrl: LOCAL_PREVIEW('stippling') },
  
  // Estilos Culturales
  { id: 'ukiyo', label: 'Ukiyo-e', labelEs: 'Ukiyo-e Japonés', value: 'Ukiyo-e Japanese woodblock print style', category: 'style', group: 'Cultural', groupEs: 'Estilos Culturales', previewUrl: LOCAL_PREVIEW('ukiyo') },
  { id: 'artnouveau', label: 'Art Nouveau', labelEs: 'Art Nouveau', value: 'Art Nouveau style', category: 'style', group: 'Cultural', groupEs: 'Estilos Culturales', previewUrl: LOCAL_PREVIEW('artnouveau') },
  { id: 'bauhaus', label: 'Bauhaus', labelEs: 'Bauhaus', value: 'Bauhaus geometric style', category: 'style', group: 'Cultural', groupEs: 'Estilos Culturales', previewUrl: LOCAL_PREVIEW('bauhaus') },
  { id: 'popart', label: 'Pop Art', labelEs: 'Pop Art', value: 'Pop Art style', category: 'style', group: 'Cultural', groupEs: 'Estilos Culturales', previewUrl: LOCAL_PREVIEW('popart') },
  { id: 'renaissance', label: 'Renaissance', labelEs: 'Renacimiento', value: 'Renaissance painting style', category: 'style', group: 'Cultural', groupEs: 'Estilos Culturales', previewUrl: LOCAL_PREVIEW('renaissance') },

  // ═══════════════════════════════════════════════════════════════
  // CÁMARA
  // ═══════════════════════════════════════════════════════════════
  { id: 'low_angle', label: 'Low Angle', labelEs: 'Ángulo Bajo', value: 'Low Angle shot (heroic perspective)', description: 'Makes subject look powerful', descriptionEs: 'Hace al sujeto verse poderoso', category: 'camera', group: 'Angles', groupEs: 'Ángulos', previewUrl: LOCAL_PREVIEW('low_angle') },
  { id: 'high_angle', label: 'High Angle', labelEs: 'Ángulo Alto', value: 'High Angle shot (looking down)', description: 'Makes subject look small', descriptionEs: 'Hace al sujeto verse pequeño', category: 'camera', group: 'Angles', groupEs: 'Ángulos', previewUrl: LOCAL_PREVIEW('high_angle') },
  { id: 'drone', label: "Bird's Eye", labelEs: 'Vista de Dron', value: "Bird's Eye View (drone perspective)", description: 'Aerial top-down view', descriptionEs: 'Vista aérea cenital', category: 'camera', group: 'Angles', groupEs: 'Ángulos', previewUrl: LOCAL_PREVIEW('drone') },
  { id: 'worm', label: "Worm's Eye", labelEs: 'Vista de Gusano', value: "Worm's Eye View (from ground)", description: 'Extreme low angle', descriptionEs: 'Ángulo extremadamente bajo', category: 'camera', group: 'Angles', groupEs: 'Ángulos', previewUrl: LOCAL_PREVIEW('worm') },
  { id: 'dutch', label: 'Dutch Angle', labelEs: 'Ángulo Holandés', value: 'Dutch Angle tilted camera', description: 'Creates tension', descriptionEs: 'Crea tensión', category: 'camera', group: 'Angles', groupEs: 'Ángulos', previewUrl: LOCAL_PREVIEW('dutch') },
  
  // Lentes
  { id: 'fisheye', label: 'Fisheye', labelEs: 'Ojo de Pez', value: 'Fisheye lens ultra wide distortion', category: 'camera', group: 'Lenses', groupEs: 'Lentes', previewUrl: LOCAL_PREVIEW('fisheye') },
  { id: 'macro', label: 'Macro', labelEs: 'Macro', value: 'Macro shot, extreme close-up, shallow depth of field', category: 'camera', group: 'Lenses', groupEs: 'Lentes', previewUrl: LOCAL_PREVIEW('macro') },
  { id: 'telephoto', label: 'Telephoto', labelEs: 'Teleobjetivo', value: 'Telephoto lens, compressed background', category: 'camera', group: 'Lenses', groupEs: 'Lentes', previewUrl: LOCAL_PREVIEW('telephoto') },
  { id: 'tiltshift', label: 'Tilt-Shift', labelEs: 'Tilt-Shift', value: 'Tilt-Shift photography miniature effect', description: 'Miniature/toy effect', descriptionEs: 'Efecto maqueta', category: 'camera', group: 'Lenses', groupEs: 'Lentes', previewUrl: LOCAL_PREVIEW('tiltshift') },
  { id: 'wideangle', label: 'Wide Angle', labelEs: 'Gran Angular', value: 'Wide angle lens', category: 'camera', group: 'Lenses', groupEs: 'Lentes', previewUrl: LOCAL_PREVIEW('wideangle') },
  
  // Tipo de Cámara
  { id: 'gopro', label: 'GoPro', labelEs: 'GoPro', value: 'GoPro action camera footage', category: 'camera', group: 'Camera Type', groupEs: 'Tipo Cámara', previewUrl: LOCAL_PREVIEW('gopro') },
  { id: 'cctv', label: 'CCTV', labelEs: 'Cámara Seguridad', value: 'CCTV security camera footage', category: 'camera', group: 'Camera Type', groupEs: 'Tipo Cámara', previewUrl: LOCAL_PREVIEW('cctv') },
  { id: 'polaroid', label: 'Polaroid', labelEs: 'Polaroid', value: 'Polaroid instant photo style', category: 'camera', group: 'Camera Type', groupEs: 'Tipo Cámara', previewUrl: LOCAL_PREVIEW('polaroid') },
  { id: 'thermal', label: 'Thermal', labelEs: 'Térmica', value: 'Thermal Camera infrared view', category: 'camera', group: 'Camera Type', groupEs: 'Tipo Cámara', previewUrl: LOCAL_PREVIEW('thermal') },
  { id: 'double_exp', label: 'Double Exposure', labelEs: 'Doble Exposición', value: 'Double Exposure effect', category: 'camera', group: 'Camera Type', groupEs: 'Tipo Cámara', previewUrl: LOCAL_PREVIEW('double_exp') },

  // ═══════════════════════════════════════════════════════════════
  // ILUMINACIÓN
  // ═══════════════════════════════════════════════════════════════
  { id: 'golden', label: 'Golden Hour', labelEs: 'Hora Dorada', value: 'Golden Hour warm sunset lighting', description: 'Warm sunset tones', descriptionEs: 'Tonos cálidos de atardecer', category: 'lighting', group: 'Natural', groupEs: 'Natural', previewUrl: LOCAL_PREVIEW('golden') },
  { id: 'blue', label: 'Blue Hour', labelEs: 'Hora Azul', value: 'Blue Hour cold twilight lighting', description: 'Cool dawn/dusk tones', descriptionEs: 'Tonos fríos de amanecer', category: 'lighting', group: 'Natural', groupEs: 'Natural', previewUrl: LOCAL_PREVIEW('blue') },
  { id: 'overcast', label: 'Overcast', labelEs: 'Nublado', value: 'Overcast soft diffused lighting', description: 'Soft, no harsh shadows', descriptionEs: 'Suave, sin sombras duras', category: 'lighting', group: 'Natural', groupEs: 'Natural', previewUrl: LOCAL_PREVIEW('overcast') },
  { id: 'moonlight', label: 'Moonlight', labelEs: 'Luz de Luna', value: 'Moonlight night scene', category: 'lighting', group: 'Natural', groupEs: 'Natural', previewUrl: LOCAL_PREVIEW('moonlight') },
  { id: 'sunbeam', label: 'Sun Rays', labelEs: 'Rayos de Sol', value: 'Sun rays streaming through', category: 'lighting', group: 'Natural', groupEs: 'Natural', previewUrl: LOCAL_PREVIEW('sunbeam') },
  
  // Artificial
  { id: 'neon', label: 'Neon', labelEs: 'Neón', value: 'Neon Cyberpunk lighting, colorful glow', category: 'lighting', group: 'Artificial', groupEs: 'Artificial', previewUrl: LOCAL_PREVIEW('neon') },
  { id: 'softbox', label: 'Studio Softbox', labelEs: 'Softbox Estudio', value: 'Professional Studio Softbox lighting', description: 'Perfect for products', descriptionEs: 'Perfecto para productos', category: 'lighting', group: 'Artificial', groupEs: 'Artificial', previewUrl: LOCAL_PREVIEW('softbox') },
  { id: 'hardlight', label: 'Hard Light', labelEs: 'Luz Dura', value: 'Hard Light with sharp shadows', category: 'lighting', group: 'Artificial', groupEs: 'Artificial', previewUrl: LOCAL_PREVIEW('hardlight') },
  { id: 'volumetric', label: 'Volumetric', labelEs: 'Volumétrica', value: 'Volumetric lighting with god rays and fog', description: 'Dramatic rays through fog', descriptionEs: 'Rayos dramáticos entre niebla', category: 'lighting', group: 'Artificial', groupEs: 'Artificial', previewUrl: LOCAL_PREVIEW('volumetric') },
  { id: 'spotlight', label: 'Spotlight', labelEs: 'Foco', value: 'Spotlight dramatic single source', category: 'lighting', group: 'Artificial', groupEs: 'Artificial', previewUrl: LOCAL_PREVIEW('spotlight') },
  
  // Especiales
  { id: 'biolum', label: 'Bioluminescence', labelEs: 'Bioluminiscencia', value: 'Bioluminescence ethereal glow', category: 'lighting', group: 'Special', groupEs: 'Especial', previewUrl: LOCAL_PREVIEW('biolum') },
  { id: 'rim', label: 'Rim Lighting', labelEs: 'Luz de Contorno', value: 'Rim Lighting backlit silhouette edge', description: 'Glowing edges', descriptionEs: 'Bordes brillantes', category: 'lighting', group: 'Special', groupEs: 'Especial', previewUrl: LOCAL_PREVIEW('rim') },
  { id: 'candlelight', label: 'Candlelight', labelEs: 'Luz de Vela', value: 'Candlelight warm flickering', category: 'lighting', group: 'Special', groupEs: 'Especial', previewUrl: LOCAL_PREVIEW('candlelight') },
  { id: 'rembrandt', label: 'Rembrandt', labelEs: 'Rembrandt', value: 'Rembrandt Lighting classic portrait', description: 'Triangle of light on cheek', descriptionEs: 'Triángulo de luz en mejilla', category: 'lighting', group: 'Special', groupEs: 'Especial', previewUrl: LOCAL_PREVIEW('rembrandt') },
  { id: 'chiaroscuro', label: 'Chiaroscuro', labelEs: 'Claroscuro', value: 'Chiaroscuro dramatic contrast', category: 'lighting', group: 'Special', groupEs: 'Especial', previewUrl: LOCAL_PREVIEW('chiaroscuro') },

  // ═══════════════════════════════════════════════════════════════
  // MATERIALES
  // ═══════════════════════════════════════════════════════════════
  { id: 'chrome', label: 'Chrome', labelEs: 'Cromo', value: 'Metallic Chrome reflective texture', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('chrome') },
  { id: 'matte', label: 'Matte', labelEs: 'Mate', value: 'Matte Finish non-reflective', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('matte') },
  { id: 'gold', label: 'Gold', labelEs: 'Oro', value: 'Gold metallic surface', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('gold') },
  { id: 'wood', label: 'Wood', labelEs: 'Madera', value: 'Carved Wood texture', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('wood') },
  { id: 'marble', label: 'Marble', labelEs: 'Mármol', value: 'White Marble texture with veins', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('marble') },
  { id: 'obsidian', label: 'Obsidian', labelEs: 'Obsidiana', value: 'Black Obsidian glossy', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('obsidian') },
  { id: 'concrete', label: 'Concrete', labelEs: 'Concreto', value: 'Raw Concrete brutalist texture', category: 'material', group: 'Solid', groupEs: 'Sólidos', previewUrl: LOCAL_PREVIEW('concrete') },
  
  // Translúcidos
  { id: 'glass', label: 'Glass', labelEs: 'Vidrio', value: 'Translucent Glass transparent', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('glass') },
  { id: 'crystal', label: 'Crystal', labelEs: 'Cristal', value: 'Crystal Prism refractive', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('crystal') },
  { id: 'smoke', label: 'Smoke', labelEs: 'Humo', value: 'Smoke and Vapor ethereal', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('smoke') },
  { id: 'liquid', label: 'Liquid', labelEs: 'Líquido', value: 'Liquid water droplets splash', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('liquid') },
  { id: 'holographic', label: 'Holographic', labelEs: 'Holográfico', value: 'Holographic iridescent material', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('holographic') },
  { id: 'ice', label: 'Ice', labelEs: 'Hielo', value: 'Frozen Ice crystalline', category: 'material', group: 'Translucent', groupEs: 'Translúcidos', previewUrl: LOCAL_PREVIEW('ice') },
  
  // Artesanales
  { id: 'origami', label: 'Origami', labelEs: 'Origami', value: 'Origami Paper folded', category: 'material', group: 'Craft', groupEs: 'Artesanales', previewUrl: LOCAL_PREVIEW('origami') },
  { id: 'knitted', label: 'Knitted', labelEs: 'Tejido', value: 'Knitted Wool cozy texture', category: 'material', group: 'Craft', groupEs: 'Artesanales', previewUrl: LOCAL_PREVIEW('knitted') },
  { id: 'clay', label: 'Clay', labelEs: 'Arcilla', value: 'Clay modeling sculpted style', category: 'material', group: 'Craft', groupEs: 'Artesanales', previewUrl: LOCAL_PREVIEW('clay') },
  { id: 'papercut', label: 'Paper Cutout', labelEs: 'Recorte Papel', value: 'Paper Cutout layered', category: 'material', group: 'Craft', groupEs: 'Artesanales', previewUrl: LOCAL_PREVIEW('papercut') },
  { id: 'felt', label: 'Felt', labelEs: 'Fieltro', value: 'Felt fabric soft texture', category: 'material', group: 'Craft', groupEs: 'Artesanales', previewUrl: LOCAL_PREVIEW('felt') },

  // ═══════════════════════════════════════════════════════════════
  // VIBES
  // ═══════════════════════════════════════════════════════════════
  { id: 'cyberpunk', label: 'Cyberpunk', labelEs: 'Cyberpunk', value: 'Cyberpunk neon dystopian aesthetic', category: 'vibe', group: 'Future', groupEs: 'Futurismo', previewUrl: LOCAL_PREVIEW('cyberpunk') },
  { id: 'solarpunk', label: 'Solarpunk', labelEs: 'Solarpunk', value: 'Solarpunk eco-future green technology', category: 'vibe', group: 'Future', groupEs: 'Futurismo', previewUrl: LOCAL_PREVIEW('solarpunk') },
  { id: 'synthwave', label: 'Synthwave', labelEs: 'Synthwave', value: 'Synthwave 80s retro neon grid', category: 'vibe', group: 'Future', groupEs: 'Futurismo', previewUrl: LOCAL_PREVIEW('synthwave') },
  { id: 'scifi', label: 'Sci-Fi', labelEs: 'Ciencia Ficción', value: 'Sci-Fi dystopian futuristic', category: 'vibe', group: 'Future', groupEs: 'Futurismo', previewUrl: LOCAL_PREVIEW('scifi') },
  { id: 'afrofuturism', label: 'Afrofuturism', labelEs: 'Afrofuturismo', value: 'Afrofuturism aesthetic', category: 'vibe', group: 'Future', groupEs: 'Futurismo', previewUrl: LOCAL_PREVIEW('afrofuturism') },
  
  // Fantasía/Retro
  { id: 'steampunk', label: 'Steampunk', labelEs: 'Steampunk', value: 'Steampunk Victorian brass copper gears', category: 'vibe', group: 'Fantasy', groupEs: 'Fantasía/Retro', previewUrl: LOCAL_PREVIEW('steampunk') },
  { id: 'darkfantasy', label: 'Dark Fantasy', labelEs: 'Fantasía Oscura', value: 'Dark Fantasy gothic medieval', category: 'vibe', group: 'Fantasy', groupEs: 'Fantasía/Retro', previewUrl: LOCAL_PREVIEW('darkfantasy') },
  { id: 'noir', label: 'Film Noir', labelEs: 'Cine Negro', value: 'Film Noir black and white dramatic shadows', category: 'vibe', group: 'Fantasy', groupEs: 'Fantasía/Retro', previewUrl: LOCAL_PREVIEW('noir') },
  { id: 'vintage50s', label: 'Vintage 50s', labelEs: 'Vintage 50s', value: 'Vintage 1950s retro americana', category: 'vibe', group: 'Fantasy', groupEs: 'Fantasía/Retro', previewUrl: LOCAL_PREVIEW('vintage50s') },
  { id: 'vaporwave', label: 'Vaporwave', labelEs: 'Vaporwave', value: 'Vaporwave pink purple aesthetic greek statues', category: 'vibe', group: 'Fantasy', groupEs: 'Fantasía/Retro', previewUrl: LOCAL_PREVIEW('vaporwave') },
  
  // Abstracto
  { id: 'surreal', label: 'Surrealism', labelEs: 'Surrealismo', value: 'Surrealism dreamlike impossible', category: 'vibe', group: 'Abstract', groupEs: 'Abstracto', previewUrl: LOCAL_PREVIEW('surreal') },
  { id: 'minimal', label: 'Minimalist', labelEs: 'Minimalista', value: 'Minimalist clean simple', category: 'vibe', group: 'Abstract', groupEs: 'Abstracto', previewUrl: LOCAL_PREVIEW('minimal') },
  { id: 'psychedelic', label: 'Psychedelic', labelEs: 'Psicodélico', value: 'Psychedelic trippy colorful patterns', category: 'vibe', group: 'Abstract', groupEs: 'Abstracto', previewUrl: LOCAL_PREVIEW('psychedelic') },
  { id: 'abstract', label: 'Abstract', labelEs: 'Abstracto', value: 'Abstract shapes geometric', category: 'vibe', group: 'Abstract', groupEs: 'Abstracto', previewUrl: LOCAL_PREVIEW('abstract') },
  { id: 'dreamcore', label: 'Dreamcore', labelEs: 'Dreamcore', value: 'Dreamcore liminal nostalgic surreal', category: 'vibe', group: 'Abstract', groupEs: 'Abstracto', previewUrl: LOCAL_PREVIEW('dreamcore') },

  // ═══════════════════════════════════════════════════════════════
  // ANIME
  // ═══════════════════════════════════════════════════════════════
  { id: 'ghibli', label: 'Studio Ghibli', labelEs: 'Studio Ghibli', value: 'Studio Ghibli style soft colors hand-drawn', category: 'anime', group: 'Japanese', groupEs: 'Anime Japonés', previewUrl: LOCAL_PREVIEW('ghibli') },
  { id: 'shinkai', label: 'Makoto Shinkai', labelEs: 'Makoto Shinkai', value: 'Makoto Shinkai style detailed skies vibrant', category: 'anime', group: 'Japanese', groupEs: 'Anime Japonés', previewUrl: LOCAL_PREVIEW('shinkai') },
  { id: 'retro_anime', label: '90s Retro Anime', labelEs: 'Anime Retro 90s', value: '90s Retro Anime style cel shading', category: 'anime', group: 'Japanese', groupEs: 'Anime Japonés', previewUrl: LOCAL_PREVIEW('retro_anime') },
  { id: 'akira', label: 'Akira Style', labelEs: 'Estilo Akira', value: 'Akira cyberpunk anime style detailed', category: 'anime', group: 'Japanese', groupEs: 'Anime Japonés', previewUrl: LOCAL_PREVIEW('akira') },
  { id: 'chibi', label: 'Chibi', labelEs: 'Chibi', value: 'Chibi cute big head small body', category: 'anime', group: 'Japanese', groupEs: 'Anime Japonés', previewUrl: LOCAL_PREVIEW('chibi') },
  
  // Western
  { id: 'pixar', label: 'Pixar Style', labelEs: 'Estilo Pixar', value: 'Pixar 3D animation style cute detailed', category: 'anime', group: 'Western', groupEs: 'Occidental/Cartoon', previewUrl: LOCAL_PREVIEW('pixar') },
  { id: 'disney2d', label: 'Disney 2D', labelEs: 'Disney 2D', value: 'Disney 2D classic animation style', category: 'anime', group: 'Western', groupEs: 'Occidental/Cartoon', previewUrl: LOCAL_PREVIEW('disney2d') },
  { id: 'looney', label: 'Looney Tunes', labelEs: 'Looney Tunes', value: 'Looney Tunes cartoon style exaggerated', category: 'anime', group: 'Western', groupEs: 'Occidental/Cartoon', previewUrl: LOCAL_PREVIEW('looney') },
  { id: 'rubberhose', label: 'Rubber Hose', labelEs: 'Rubber Hose', value: 'Rubber Hose 1930s cartoon style bendy', category: 'anime', group: 'Western', groupEs: 'Occidental/Cartoon', previewUrl: LOCAL_PREVIEW('rubberhose') },
  { id: 'simpsons', label: 'Simpsons Style', labelEs: 'Estilo Simpsons', value: 'Simpsons cartoon style yellow characters', category: 'anime', group: 'Western', groupEs: 'Occidental/Cartoon', previewUrl: LOCAL_PREVIEW('simpsons') },
  
  // Comics
  { id: 'manga', label: 'Manga B&W', labelEs: 'Manga B&N', value: 'Manga black and white screentone style', category: 'anime', group: 'Comics', groupEs: 'Comics/Novelas', previewUrl: LOCAL_PREVIEW('manga') },
  { id: 'marvel', label: 'Marvel/DC', labelEs: 'Marvel/DC', value: 'Marvel DC Comic Book style bold colors', category: 'anime', group: 'Comics', groupEs: 'Comics/Novelas', previewUrl: LOCAL_PREVIEW('marvel') },
  { id: 'graphicnovel', label: 'Graphic Novel', labelEs: 'Novela Gráfica', value: 'Graphic Novel style detailed shading', category: 'anime', group: 'Comics', groupEs: 'Comics/Novelas', previewUrl: LOCAL_PREVIEW('graphicnovel') },
  { id: 'webtoon', label: 'Webtoon', labelEs: 'Webtoon', value: 'Webtoon Manhwa Korean style soft shading', category: 'anime', group: 'Comics', groupEs: 'Comics/Novelas', previewUrl: LOCAL_PREVIEW('webtoon') },

  // ═══════════════════════════════════════════════════════════════
  // FORMATO (sin preview - no son visuales)
  // ═══════════════════════════════════════════════════════════════
  { id: '16:9', label: 'Cinematic (16:9)', labelEs: 'Cine (16:9)', value: 'wide aspect ratio 16:9', description: 'For YouTube, monitors', descriptionEs: 'Para YouTube, monitores', category: 'format', group: 'Ratio', groupEs: 'Proporción' },
  { id: '9:16', label: 'Mobile (9:16)', labelEs: 'Móvil (9:16)', value: 'tall aspect ratio 9:16', description: 'For Stories, Reels, TikTok', descriptionEs: 'Para Stories, Reels, TikTok', category: 'format', group: 'Ratio', groupEs: 'Proporción' },
  { id: '1:1', label: 'Square (1:1)', labelEs: 'Cuadrado (1:1)', value: 'square aspect ratio 1:1', description: 'For Instagram posts', descriptionEs: 'Para posts Instagram', category: 'format', group: 'Ratio', groupEs: 'Proporción' },
  { id: '4:3', label: 'Standard (4:3)', labelEs: 'Estándar (4:3)', value: 'standard aspect ratio 4:3', description: 'Classic photo ratio', descriptionEs: 'Proporción foto clásica', category: 'format', group: 'Ratio', groupEs: 'Proporción' },
  { id: '21:9', label: 'Ultra Wide (21:9)', labelEs: 'Ultra Ancho (21:9)', value: 'ultra wide aspect ratio 21:9', description: 'For banners', descriptionEs: 'Para banners', category: 'format', group: 'Ratio', groupEs: 'Proporción' },
  { id: '4:5', label: 'Portrait (4:5)', labelEs: 'Retrato (4:5)', value: 'portrait aspect ratio 4:5', description: 'Instagram optimal', descriptionEs: 'Óptimo para Instagram', category: 'format', group: 'Ratio', groupEs: 'Proporción' },

  // ═══════════════════════════════════════════════════════════════
  // FOTORREALISMO Y FÍSICA (Imagen 3)
  // ═══════════════════════════════════════════════════════════════
  { id: 'volumetric_light', label: 'Volumetric Light', labelEs: 'Luz Volumétrica', value: 'volumetric lighting with god rays through atmosphere', description: 'Rayos de luz a través de humo o polvo', descriptionEs: 'Rayos de luz a través de humo o polvo', category: 'physics', group: 'Light Physics', groupEs: 'Física de Luz' },
  { id: 'real_reflections', label: 'Real Reflections', labelEs: 'Reflejos Reales', value: 'accurate reflections in mirrors and water, physically based rendering', description: 'Espejos y agua reflejan correctamente', descriptionEs: 'Espejos y agua reflejan correctamente', category: 'physics', group: 'Light Physics', groupEs: 'Física de Luz' },
  { id: 'pbr_materials', label: 'PBR Materials', labelEs: 'Materiales PBR', value: 'physically based rendering (PBR), realistic material properties', description: 'Texturas realistas con propiedades físicas', descriptionEs: 'Texturas realistas con propiedades físicas', category: 'physics', group: 'Materials', groupEs: 'Materiales' },
  { id: 'skin_detail', label: 'Skin Detail', labelEs: 'Detalle de Piel', value: 'detailed skin texture with pores, realistic human skin', description: 'Piel humana con poros y detalles', descriptionEs: 'Piel humana con poros y detalles', category: 'physics', group: 'Materials', groupEs: 'Materiales' },
  { id: 'subsurface_scattering', label: 'Subsurface Scattering', labelEs: 'Dispersión Subsuperficial', value: 'subsurface scattering for organic materials', description: 'Efecto de luz que penetra materiales orgánicos', descriptionEs: 'Efecto de luz que penetra materiales orgánicos', category: 'physics', group: 'Materials', groupEs: 'Materiales' },

  // ═══════════════════════════════════════════════════════════════
  // ADHERENCIA AL PROMPT (Imagen 3)
  // ═══════════════════════════════════════════════════════════════
  { id: 'multiple_subjects', label: 'Multiple Subjects', labelEs: 'Múltiples Sujetos', value: 'multiple distinct subjects with clear separation', description: 'Varios sujetos sin mezclar características', descriptionEs: 'Varios sujetos sin mezclar características', category: 'adherence', group: 'Composition', groupEs: 'Composición' },
  { id: 'position_left', label: 'Position: Left', labelEs: 'Posición: Izquierda', value: 'positioned on the left side', description: 'Sujeto en el lado izquierdo', descriptionEs: 'Sujeto en el lado izquierdo', category: 'adherence', group: 'Position', groupEs: 'Posición' },
  { id: 'position_right', label: 'Position: Right', labelEs: 'Posición: Derecha', value: 'positioned on the right side', description: 'Sujeto en el lado derecho', descriptionEs: 'Sujeto en el lado derecho', category: 'adherence', group: 'Position', groupEs: 'Posición' },
  { id: 'position_center', label: 'Position: Center', labelEs: 'Posición: Centro', value: 'centered in the composition', description: 'Sujeto en el centro', descriptionEs: 'Sujeto en el centro', category: 'adherence', group: 'Position', groupEs: 'Posición' },
  { id: 'position_background', label: 'Position: Background', labelEs: 'Posición: Fondo', value: 'in the background, out of focus', description: 'Elemento en el fondo', descriptionEs: 'Elemento en el fondo', category: 'adherence', group: 'Position', groupEs: 'Posición' },
  { id: 'position_foreground', label: 'Position: Foreground', labelEs: 'Posición: Primer Plano', value: 'in the foreground, sharp focus', description: 'Elemento en primer plano', descriptionEs: 'Elemento en primer plano', category: 'adherence', group: 'Position', groupEs: 'Posición' },
  { id: 'negative_prompt', label: 'Negative Space', labelEs: 'Espacio Negativo', value: 'with ample negative space', description: 'Área vacía para diseño', descriptionEs: 'Área vacía para diseño', category: 'adherence', group: 'Composition', groupEs: 'Composición' },

  // ═══════════════════════════════════════════════════════════════
  // EDICIÓN (Inpainting/Outpainting) (Imagen 3)
  // ═══════════════════════════════════════════════════════════════
  { id: 'inpainting', label: 'Inpainting Ready', labelEs: 'Listo para Inpainting', value: 'image suitable for local editing and inpainting', description: 'Preparado para edición local', descriptionEs: 'Preparado para edición local', category: 'editing', group: 'Editing', groupEs: 'Edición' },
  { id: 'outpainting', label: 'Outpainting Ready', labelEs: 'Listo para Outpainting', value: 'image with extendable borders for outpainting', description: 'Bordes extensibles para ampliar', descriptionEs: 'Bordes extensibles para ampliar', category: 'editing', group: 'Editing', groupEs: 'Edición' },
  { id: 'smart_removal', label: 'Smart Removal Zone', labelEs: 'Zona de Borrado Inteligente', value: 'with areas suitable for intelligent object removal', description: 'Áreas preparadas para borrado', descriptionEs: 'Áreas preparadas para borrado', category: 'editing', group: 'Editing', groupEs: 'Edición' },
];

export const CATEGORIES: { id: Category; label: string; labelEs: string; icon: string; description: string }[] = [
  { id: 'style', label: 'Style', labelEs: 'Estilo', icon: 'Palette', description: 'Estilo visual y técnica de renderizado' },
  { id: 'camera', label: 'Camera', labelEs: 'Cámara', icon: 'Camera', description: 'Ángulos, lentes y tipo de cámara' },
  { id: 'lighting', label: 'Lighting', labelEs: 'Iluminación', icon: 'Sun', description: 'Tipo y ambiente de iluminación' },
  { id: 'material', label: 'Materials', labelEs: 'Materiales', icon: 'Layers', description: 'Texturas y acabados de superficie' },
  { id: 'vibe', label: 'Vibe', labelEs: 'Ambiente', icon: 'Sparkles', description: 'Estética y atmósfera general' },
  { id: 'anime', label: 'Animation', labelEs: 'Animación', icon: 'Film', description: 'Estilos de anime, cartoon y cómic' },
  { id: 'format', label: 'Format', labelEs: 'Formato', icon: 'Maximize', description: 'Proporción y tamaño de imagen' },
  { id: 'physics', label: 'Physics & Realism', labelEs: 'Física y Realismo', icon: 'Zap', description: 'Fotorrealismo avanzado y física (PBR, reflejos, luz volumétrica)' },
  { id: 'adherence', label: 'Prompt Adherence', labelEs: 'Adherencia al Prompt', icon: 'Target', description: 'Control preciso de composición y posicionamiento' },
  { id: 'editing', label: 'Editing Ready', labelEs: 'Listo para Edición', icon: 'Edit', description: 'Preparado para inpainting, outpainting y borrado inteligente' },
];

// ═══════════════════════════════════════════════════════════════
// RECETAS
// ═══════════════════════════════════════════════════════════════
export const RECIPES: Recipe[] = [
  {
    id: 'product_ecommerce',
    title: 'Producto E-commerce',
    icon: 'ShoppingBag',
    description: 'Fondo blanco limpio para tiendas online (Amazon, MercadoLibre)',
    promptTemplate: 'Professional product shot of [PRODUCTO]. Isolated on pure white background. Studio lighting, softbox, soft shadows. Front view, high resolution, sharp focus. No background distractions. 4K quality.',
    category: 'producto'
  },
  {
    id: 'product_luxury',
    title: 'Producto Premium',
    icon: 'Gem',
    description: 'Sobre podio de mármol, ideal para cosmética y joyería',
    promptTemplate: 'Luxury product photography of [PRODUCTO]. Standing on a white marble podium. Minimalist pastel background. Soft lighting casting gentle shadows. 3D render style, clean composition, elegant premium vibe.',
    category: 'producto'
  },
  {
    id: 'product_perfume',
    title: 'Fotografía de Perfume',
    icon: 'Sparkles',
    description: 'Estilo comercial de lujo para fragancias',
    promptTemplate: 'Professional product photography of [PRODUCTO] luxury perfume bottle, made of translucent crystal glass with gold accents. Placed on a black obsidian surface. Studio lighting, softbox, rim lighting to highlight edges. Macro shot, high depth of field, 4k resolution.',
    category: 'producto'
  },
  {
    id: 'food_delivery',
    title: 'Comida para Delivery',
    icon: 'UtensilsCrossed',
    description: 'Ideal para apps como UberEats, Rappi',
    promptTemplate: 'Delicious [COMIDA] on a clean wooden table. Top-down view (90 degrees). Bright even lighting, no harsh shadows. Vibrant colors, steam rising. 4k resolution, perfect for food delivery app menu.',
    category: 'comida'
  },
  {
    id: 'food_commercial',
    title: 'Food Porn Comercial',
    icon: 'Flame',
    description: 'Estilo cinematográfico que provoca hambre',
    promptTemplate: 'Cinematic commercial shot of a juicy [COMIDA]. Melting details, water droplets on fresh ingredients, steam rising. Dark background to make the food pop. Macro lens, professional food photography style.',
    category: 'comida'
  },
  {
    id: 'fashion_flatlay',
    title: 'Ropa Flat Lay',
    icon: 'Shirt',
    description: 'Ropa doblada vista desde arriba para tiendas online',
    promptTemplate: 'Professional flat lay photography of [ROPA] arranged neatly on a light concrete surface. Soft natural lighting from above (top-down view). Minimalist props. High resolution, sharp fabric texture visible.',
    category: 'moda'
  },
  {
    id: 'fashion_editorial',
    title: 'Moda Editorial',
    icon: 'Crown',
    description: 'Estilo revista Vogue, alto impacto',
    promptTemplate: 'High fashion editorial photography. A model wearing [ROPA] posing in a concrete brutalist architecture setting. Dramatic shadows, confident pose, neutral color palette. 4k, Vogue magazine style.',
    category: 'moda'
  },
  {
    id: 'banner_web',
    title: 'Banner Web',
    icon: 'Layout',
    description: 'Con espacio negativo para texto',
    promptTemplate: 'Wide banner background for [TEMA]. On the right side: [ELEMENTO VISUAL]. On the left side: ample negative space, plain dark background for text overlay. High tech style, 16:9 ratio.',
    category: 'marketing'
  },
  {
    id: 'social_lifestyle',
    title: 'Lifestyle Redes Sociales',
    icon: 'Users',
    description: 'Gente feliz, ideal para Instagram/Facebook Ads',
    promptTemplate: 'Instagram ad photo. A group of diverse young people [ACCIÓN] in [LUGAR]. Candid shot, authentic emotion, bright and airy lighting, bokeh background. Square aspect ratio 1:1.',
    category: 'marketing'
  },
  {
    id: 'character_game',
    title: 'Personaje Videojuego',
    icon: 'Gamepad2',
    description: 'Concept art estilo AAA',
    promptTemplate: 'Full body character design of [PERSONAJE]. Wearing [VESTIMENTA]. [AMBIENTE] background. Unreal Engine 5 render, cinematic lighting, dynamic pose, 8k detail.',
    category: 'arte'
  },
  {
    id: 'logo_minimal',
    title: 'Logo Minimalista',
    icon: 'PenTool',
    description: 'Estilo vectorial limpio para branding',
    promptTemplate: 'Minimalist vector logo design of [CONCEPTO]. Flat design, white background, simple geometric lines, [COLORES] color palette. Adobe Illustrator style, no shadows, 2D clean.',
    category: 'arte'
  },
  {
    id: 'interior_design',
    title: 'Diseño Interior',
    icon: 'Home',
    description: 'Visualización arquitectónica estilo revista',
    promptTemplate: 'Interior design of a modern [ESPACIO] with [ESTILO] style. Large windows with sunlight streaming in (Golden Hour). [MATERIALES] furniture, wooden floor, indoor plants. Wide angle lens, photorealistic, architectural digest style.',
    category: 'arquitectura'
  },

  // ═══════════════════════════════════════════════════════════════
  // MARKETING DIGITAL Y VENTAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ad_instagram_story',
    title: 'Anuncio Instagram Story',
    icon: 'Layout',
    description: 'Formato vertical 9:16 para Stories con espacio para texto',
    promptTemplate: 'Instagram Story ad background. [TEMA] on the right side, vibrant colors. Left side: ample negative space with gradient overlay for text. Modern, eye-catching design. Tall aspect ratio 9:16, mobile-optimized.',
    category: 'marketing'
  },
  {
    id: 'ad_facebook_cover',
    title: 'Banner Facebook/LinkedIn',
    icon: 'Layout',
    description: 'Banner horizontal para redes profesionales',
    promptTemplate: 'Professional banner design for [TEMA]. [ELEMENTO] on the right, clean minimalist design on the left with space for logo and text. Corporate blue and white color scheme. Wide aspect ratio 16:9, high resolution.',
    category: 'marketing'
  },
  {
    id: 'ad_tiktok_vertical',
    title: 'Anuncio TikTok Vertical',
    icon: 'Film',
    description: 'Formato vertical llamativo para TikTok Ads',
    promptTemplate: 'TikTok ad vertical format. [PRODUCTO/ACCIÓN] centered, bold vibrant colors, energetic vibe. Text space at top and bottom. Youthful, trendy aesthetic. Tall aspect ratio 9:16, attention-grabbing composition.',
    category: 'marketing'
  },
  {
    id: 'email_marketing_header',
    title: 'Header Email Marketing',
    icon: 'Layout',
    description: 'Banner superior para emails promocionales',
    promptTemplate: 'Email marketing header banner. [PRODUCTO/SERVICIO] on the right, clean white space on the left for headline. Professional gradient background. Wide aspect ratio 16:9, email-safe colors, 600px width optimized.',
    category: 'marketing'
  },
  {
    id: 'landing_page_hero',
    title: 'Hero Landing Page',
    icon: 'Layout',
    description: 'Imagen hero para página de ventas',
    promptTemplate: 'Landing page hero image. [PRODUCTO] prominently displayed, modern tech aesthetic. Left side: negative space for headline and CTA button. Gradient background, professional lighting. Wide aspect ratio 16:9, conversion-optimized layout.',
    category: 'marketing'
  },
  {
    id: 'testimonial_background',
    title: 'Fondo para Testimonios',
    icon: 'Users',
    description: 'Background elegante para mostrar testimonios',
    promptTemplate: 'Elegant testimonial background. Abstract geometric shapes, soft gradient from [COLOR1] to [COLOR2]. Minimalist design, professional vibe. Space in center for testimonial text overlay. Wide aspect ratio 16:9, subtle and clean.',
    category: 'marketing'
  },
  {
    id: 'sale_banner',
    title: 'Banner de Oferta/Sale',
    icon: 'Flame',
    description: 'Banner llamativo para promociones y descuentos',
    promptTemplate: 'Eye-catching sale banner. Bold [COLOR] background, [PRODUCTO] featured prominently. Dynamic composition, energetic vibe. Space for "SALE" or discount text overlay. Wide aspect ratio 16:9, urgent and exciting feel.',
    category: 'marketing'
  },
  {
    id: 'webinar_poster',
    title: 'Poster Webinar/Evento',
    icon: 'Users',
    description: 'Poster para promocionar webinars y eventos online',
    promptTemplate: 'Webinar poster design. [TEMA] represented visually, professional tech aesthetic. Date and time placeholder space. Modern gradient background, clean typography area. Square aspect ratio 1:1, social media optimized.',
    category: 'marketing'
  },

  // ═══════════════════════════════════════════════════════════════
  // TRADING Y FINANZAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'trading_dashboard',
    title: 'Dashboard Trading',
    icon: 'Layout',
    description: 'Visualización de plataforma de trading profesional',
    promptTemplate: 'Professional trading dashboard interface. [MONEDA/ACTIVO] charts and graphs visible, dark theme with neon accents. Modern fintech UI, data visualization. Wide aspect ratio 16:9, professional trading platform aesthetic.',
    category: 'trading'
  },
  {
    id: 'crypto_hero',
    title: 'Hero Crypto/Trading',
    icon: 'Zap',
    description: 'Imagen hero para cursos o servicios de trading',
    promptTemplate: 'Crypto trading hero image. Abstract representation of [CRIPTOMONEDA/TRADING], digital particles and blockchain elements. Futuristic tech aesthetic, blue and purple neon glow. Wide aspect ratio 16:9, high-tech vibe.',
    category: 'trading'
  },
  {
    id: 'trading_course_cover',
    title: 'Portada Curso Trading',
    icon: 'BookOpen',
    description: 'Portada para cursos de trading y finanzas',
    promptTemplate: 'Trading course cover design. [CONCEPTO] visualized with charts, graphs, and financial elements. Professional dark theme with gold accents. Clean composition, space for title. Square aspect ratio 1:1, premium look.',
    category: 'trading'
  },
  {
    id: 'financial_infographic',
    title: 'Infografía Financiera',
    icon: 'Layout',
    description: 'Background para infografías de trading/finanzas',
    promptTemplate: 'Financial infographic background. Abstract financial charts, upward trending graphs, money symbols. Professional blue and green gradient. Clean design with space for data visualization. Wide aspect ratio 16:9, corporate finance style.',
    category: 'trading'
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTOS SAAS Y DIGITALES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'saas_product_hero',
    title: 'Hero Producto SaaS',
    icon: 'Zap',
    description: 'Imagen hero para landing page de SaaS',
    promptTemplate: 'SaaS product hero image. [PRODUCTO] interface mockup or abstract representation. Modern tech aesthetic, blue and purple gradient. Left side: negative space for headline. Wide aspect ratio 16:9, professional B2B vibe.',
    category: 'saas'
  },
  {
    id: 'app_store_screenshot',
    title: 'Screenshot App Store',
    icon: 'Layout',
    description: 'Background para screenshots de aplicaciones',
    promptTemplate: 'App store screenshot background. [APP] interface mockup, clean modern design. Professional lighting, subtle shadows. Space for app screenshots overlay. Square aspect ratio 1:1, mobile app aesthetic.',
    category: 'digital'
  },
  {
    id: 'software_demo',
    title: 'Demo Software/Dashboard',
    icon: 'Layout',
    description: 'Visualización de software o dashboard',
    promptTemplate: 'Software dashboard demo visualization. [SOFTWARE] interface mockup, modern UI design. Dark or light theme, professional look. Clean composition, tech aesthetic. Wide aspect ratio 16:9, SaaS platform style.',
    category: 'saas'
  },
  {
    id: 'digital_product_showcase',
    title: 'Showcase Producto Digital',
    icon: 'Gem',
    description: 'Presentación elegante de producto digital',
    promptTemplate: 'Digital product showcase. [PRODUCTO] displayed elegantly, floating in space. Soft gradient background, professional lighting. Minimalist design, premium feel. Square aspect ratio 1:1, high-end digital product aesthetic.',
    category: 'digital'
  },
  {
    id: 'saas_feature_highlight',
    title: 'Destacado de Feature SaaS',
    icon: 'Zap',
    description: 'Imagen para destacar características de SaaS',
    promptTemplate: 'SaaS feature highlight image. [FEATURE] visualized with icons and abstract elements. Modern gradient background, tech aesthetic. Clean composition with space for feature description. Wide aspect ratio 16:9, professional B2B style.',
    category: 'saas'
  },

  // ═══════════════════════════════════════════════════════════════
  // EDUCACIÓN Y CURSOS ONLINE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'course_thumbnail',
    title: 'Thumbnail Curso Online',
    icon: 'BookOpen',
    description: 'Thumbnail para cursos en Udemy, YouTube, etc.',
    promptTemplate: 'Online course thumbnail. [TEMA] represented visually, bold text area at top. Vibrant colors, educational vibe. Clean composition, eye-catching design. Wide aspect ratio 16:9, YouTube/Udemy optimized.',
    category: 'educacion'
  },
  {
    id: 'course_launch_banner',
    title: 'Banner Lanzamiento Curso',
    icon: 'Flame',
    description: 'Banner para promocionar lanzamiento de curso',
    promptTemplate: 'Course launch banner. [CURSO] theme visualized, "NEW COURSE" or launch text area. Energetic gradient background, educational aesthetic. Wide aspect ratio 16:9, exciting launch vibe, social media ready.',
    category: 'educacion'
  },
  {
    id: 'educational_infographic',
    title: 'Infografía Educativa',
    icon: 'Layout',
    description: 'Background para infografías educativas',
    promptTemplate: 'Educational infographic background. [TEMA] elements and icons, clean design. Soft pastel colors or professional blue gradient. Space for educational content overlay. Wide aspect ratio 16:9, clear and informative style.',
    category: 'educacion'
  },
  {
    id: 'online_class_poster',
    title: 'Poster Clase Online',
    icon: 'Users',
    description: 'Poster para promocionar clases y webinars educativos',
    promptTemplate: 'Online class poster. [MATERIA] theme, professional educational aesthetic. Date and instructor placeholder space. Modern design, academic vibe. Square aspect ratio 1:1, social media friendly.',
    category: 'educacion'
  },
  {
    id: 'certificate_background',
    title: 'Fondo Certificado',
    icon: 'Crown',
    description: 'Background elegante para certificados de curso',
    promptTemplate: 'Elegant certificate background. Ornate border design, [TEMA] subtle elements. Classic gold and blue color scheme, prestigious look. Center space for certificate text. Wide aspect ratio 16:9, formal academic style.',
    category: 'educacion'
  },
  {
    id: 'student_success_story',
    title: 'Historia de Éxito Estudiante',
    icon: 'Users',
    description: 'Background para testimonios de estudiantes',
    promptTemplate: 'Student success story background. Abstract educational elements, graduation cap or achievement symbols. Warm inspiring colors, motivational vibe. Space for testimonial text. Wide aspect ratio 16:9, uplifting and positive.',
    category: 'educacion'
  },

  // ═══════════════════════════════════════════════════════════════
  // VENTAS Y CONVERSIÓN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'sales_funnel_image',
    title: 'Imagen Funnel de Ventas',
    icon: 'Target',
    description: 'Visualización de funnel o proceso de ventas',
    promptTemplate: 'Sales funnel visualization. [PROCESO] represented with arrows and steps. Professional business aesthetic, conversion-focused design. Clean layout, space for step descriptions. Wide aspect ratio 16:9, B2B sales style.',
    category: 'marketing'
  },
  {
    id: 'cta_button_background',
    title: 'Background CTA Button',
    icon: 'Target',
    description: 'Fondo para botones de llamada a la acción',
    promptTemplate: 'CTA button background. [ACCIÓN] theme, bold vibrant [COLOR] gradient. Eye-catching design, conversion-optimized. Space for button text overlay. Wide aspect ratio 16:9, urgent and compelling feel.',
    category: 'marketing'
  },
  {
    id: 'pricing_table_header',
    title: 'Header Tabla de Precios',
    icon: 'Layout',
    description: 'Header para secciones de precios',
    promptTemplate: 'Pricing table header image. [PRODUCTO] represented, professional business aesthetic. Clean design, space for pricing tiers. Modern gradient background, B2B vibe. Wide aspect ratio 16:9, trustworthy and professional.',
    category: 'marketing'
  },
  {
    id: 'money_back_guarantee',
    title: 'Garantía de Devolución',
    icon: 'Gem',
    description: 'Banner para garantías y políticas de devolución',
    promptTemplate: 'Money-back guarantee banner. Trust symbols and security elements. Professional blue and green color scheme, trustworthy vibe. Space for guarantee text. Wide aspect ratio 16:9, confidence-building design.',
    category: 'marketing'
  },
  {
    id: 'limited_time_offer',
    title: 'Oferta por Tiempo Limitado',
    icon: 'Flame',
    description: 'Banner para ofertas con urgencia',
    promptTemplate: 'Limited time offer banner. [PRODUCTO] featured, urgent red and orange gradient. Clock or timer elements, scarcity vibe. Bold design, attention-grabbing. Wide aspect ratio 16:9, FOMO-optimized composition.',
    category: 'marketing'
  },
];

export function getOptionsGroupedByCategory(category: Category): Record<string, PromptOption[]> {
  const options = PROMPT_OPTIONS.filter(opt => opt.category === category);
  return options.reduce((acc, opt) => {
    const group = opt.groupEs || opt.group || 'Otros';
    if (!acc[group]) acc[group] = [];
    acc[group].push(opt);
    return acc;
  }, {} as Record<string, PromptOption[]>);
}
