export type Category = 'style' | 'camera' | 'lighting' | 'material' | 'vibe' | 'format';

export interface PromptOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  category: Category;
  group?: string; // Sub-group like "Render Digital" vs "Arte Tradicional"
}

export const PROMPT_OPTIONS: PromptOption[] = [
  // --- STYLES ---
  // Render Digital & 3D
  { id: 'unreal', label: 'Unreal Engine 5', value: 'Unreal Engine 5 render', category: 'style', group: 'Render Digital' },
  { id: 'octane', label: 'Octane Render', value: 'Octane Render', category: 'style', group: 'Render Digital' },
  { id: 'raytracing', label: 'Ray Tracing', value: 'Ray Tracing', category: 'style', group: 'Render Digital' },
  { id: 'blender', label: 'Blender Eevee', value: 'Blender Eevee', category: 'style', group: 'Render Digital' },
  // Geometría
  { id: 'lowpoly', label: 'Low Poly', value: 'Low Poly 3D render', category: 'style', group: 'Geometry' },
  { id: 'voxel', label: 'Voxel Art', value: 'Voxel Art style', category: 'style', group: 'Geometry' },
  { id: 'isometric', label: 'Isometric', value: 'Isometric View', category: 'style', group: 'Geometry' },
  { id: 'wireframe', label: 'Wireframe', value: 'Wireframe render', category: 'style', group: 'Geometry' },
  // Retro/Glitch
  { id: 'pixel', label: 'Pixel Art', value: 'Pixel Art (8-bit/16-bit)', category: 'style', group: 'Retro' },
  { id: 'glitch', label: 'Glitch Art', value: 'Glitch Art', category: 'style', group: 'Retro' },
  { id: 'vhs', label: 'VHS Effect', value: 'VHS Effect overlay', category: 'style', group: 'Retro' },
  // Traditional
  { id: 'oil', label: 'Oil Painting', value: 'Oil Painting', category: 'style', group: 'Traditional' },
  { id: 'watercolor', label: 'Watercolor', value: 'Watercolor painting', category: 'style', group: 'Traditional' },
  { id: 'ink', label: 'Ink Illustration', value: 'Ink Illustration', category: 'style', group: 'Traditional' },
  { id: 'ukiyo', label: 'Ukiyo-e', value: 'Ukiyo-e Japanese style', category: 'style', group: 'Traditional' },
  { id: 'popart', label: 'Pop Art', value: 'Pop Art style', category: 'style', group: 'Traditional' },
  
  // --- CAMERA ---
  // Angles
  { id: 'low_angle', label: 'Low Angle', value: 'Low Angle shot', category: 'camera', group: 'Angles' },
  { id: 'high_angle', label: 'High Angle', value: 'High Angle shot', category: 'camera', group: 'Angles' },
  { id: 'drone', label: 'Drone View', value: "Bird's Eye View", category: 'camera', group: 'Angles' },
  { id: 'worm', label: 'Worm View', value: "Worm's Eye View", category: 'camera', group: 'Angles' },
  // Lenses
  { id: 'fisheye', label: 'Fisheye', value: 'Fisheye lens', category: 'camera', group: 'Lenses' },
  { id: 'macro', label: 'Macro', value: 'Macro shot, extreme close-up', category: 'camera', group: 'Lenses' },
  { id: 'telephoto', label: 'Telephoto', value: 'Telephoto lens', category: 'camera', group: 'Lenses' },
  { id: 'tiltshift', label: 'Tilt-Shift', value: 'Tilt-Shift photography', category: 'camera', group: 'Lenses' },
  // Type
  { id: 'gopro', label: 'GoPro', value: 'GoPro footage', category: 'camera', group: 'Type' },
  { id: 'thermal', label: 'Thermal', value: 'Thermal Camera view', category: 'camera', group: 'Type' },
  { id: 'double_exp', label: 'Double Exposure', value: 'Double Exposure', category: 'camera', group: 'Type' },

  // --- LIGHTING ---
  // Natural
  { id: 'golden', label: 'Golden Hour', value: 'Golden Hour lighting', category: 'lighting', group: 'Natural' },
  { id: 'blue', label: 'Blue Hour', value: 'Blue Hour lighting', category: 'lighting', group: 'Natural' },
  { id: 'overcast', label: 'Overcast', value: 'Overcast soft lighting', category: 'lighting', group: 'Natural' },
  // Artificial
  { id: 'neon', label: 'Neon', value: 'Neon Cyberpunk lighting', category: 'lighting', group: 'Artificial' },
  { id: 'softbox', label: 'Studio Softbox', value: 'Studio Softbox lighting', category: 'lighting', group: 'Artificial' },
  { id: 'volumetric', label: 'Volumetric', value: 'Volumetric lighting with rays', category: 'lighting', group: 'Artificial' },
  // Special
  { id: 'biolum', label: 'Bioluminescence', value: 'Bioluminescence glow', category: 'lighting', group: 'Special' },
  { id: 'rim', label: 'Rim Lighting', value: 'Rim Lighting (Backlit)', category: 'lighting', group: 'Special' },
  { id: 'rembrandt', label: 'Rembrandt', value: 'Rembrandt Lighting', category: 'lighting', group: 'Special' },

  // --- MATERIALS ---
  // Solids
  { id: 'chrome', label: 'Chrome', value: 'Metallic Chrome texture', category: 'material', group: 'Solid' },
  { id: 'matte', label: 'Matte', value: 'Matte Finish', category: 'material', group: 'Solid' },
  { id: 'obsidian', label: 'Obsidian', value: 'Black Obsidian', category: 'material', group: 'Solid' },
  { id: 'marble', label: 'Marble', value: 'White Marble texture', category: 'material', group: 'Solid' },
  // Soft/Translucent
  { id: 'glass', label: 'Glass', value: 'Translucent Glass', category: 'material', group: 'Translucent' },
  { id: 'crystal', label: 'Crystal', value: 'Crystal Prism', category: 'material', group: 'Translucent' },
  { id: 'smoke', label: 'Smoke', value: 'Smoke and Vapor', category: 'material', group: 'Translucent' },
  { id: 'liquid', label: 'Liquid', value: 'Liquid Slime', category: 'material', group: 'Translucent' },
  { id: 'holographic', label: 'Holographic', value: 'Holographic material', category: 'material', group: 'Translucent' },
  // Craft
  { id: 'origami', label: 'Origami', value: 'Origami Paper', category: 'material', group: 'Craft' },
  { id: 'knitted', label: 'Knitted', value: 'Knitted Wool texture', category: 'material', group: 'Craft' },
  { id: 'clay', label: 'Clay', value: 'Clay modeling style', category: 'material', group: 'Craft' },

  // --- VIBES ---
  { id: 'cyberpunk', label: 'Cyberpunk', value: 'Cyberpunk aesthetic', category: 'vibe', group: 'Future' },
  { id: 'solarpunk', label: 'Solarpunk', value: 'Solarpunk Eco-future', category: 'vibe', group: 'Future' },
  { id: 'synthwave', label: 'Synthwave', value: 'Synthwave 80s Retro', category: 'vibe', group: 'Future' },
  { id: 'steampunk', label: 'Steampunk', value: 'Steampunk aesthetic', category: 'vibe', group: 'Retro' },
  { id: 'noir', label: 'Film Noir', value: 'Film Noir style', category: 'vibe', group: 'Retro' },
  { id: 'surreal', label: 'Surrealism', value: 'Surrealism', category: 'vibe', group: 'Abstract' },
  { id: 'minimal', label: 'Minimalist', value: 'Minimalist', category: 'vibe', group: 'Abstract' },

  // --- ASPECT RATIOS ---
  { id: '16:9', label: 'Cinematic (16:9)', value: '--ar 16:9', category: 'format', group: 'Ratio' },
  { id: '9:16', label: 'Mobile (9:16)', value: '--ar 9:16', category: 'format', group: 'Ratio' },
  { id: '1:1', label: 'Square (1:1)', value: '--ar 1:1', category: 'format', group: 'Ratio' },
  { id: '4:3', label: 'Standard (4:3)', value: '--ar 4:3', category: 'format', group: 'Ratio' },
];

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'style', label: 'Style', icon: 'Palette' },
  { id: 'camera', label: 'Camera', icon: 'Camera' },
  { id: 'lighting', label: 'Lighting', icon: 'Zap' },
  { id: 'material', label: 'Materials', icon: 'Layers' },
  { id: 'vibe', label: 'Vibe', icon: 'Sparkles' },
  { id: 'format', label: 'Format', icon: 'Maximize' },
];
