import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMPT_OPTIONS, CATEGORIES, RECIPES, Category, Recipe, getOptionsGroupedByCategory, PromptOption } from '@/lib/prompt-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { 
  Copy, 
  RefreshCw, 
  Trash2, 
  Palette, 
  Camera, 
  Sun,
  Layers, 
  Sparkles, 
  Maximize,
  Wand2,
  Check,
  Circle,
  ChevronDown,
  ChevronRight,
  Zap,
  BookOpen,
  ShoppingBag,
  UtensilsCrossed,
  Shirt,
  Home,
  Gamepad2,
  PenTool,
  Layout,
  Users,
  Gem,
  Flame,
  Crown,
  Film,
  Send,
  Loader2,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Eye,
  X,
  ImageIcon,
  Type,
  Target,
  Upload,
  ScanSearch,
  ClipboardPaste,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Componente de Preview de Imagen
function ImagePreview({ option }: { option: PromptOption }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/30">
          <div>
            <h4 className="font-bold text-white text-sm">{option.labelEs}</h4>
            <p className="text-xs text-muted-foreground">{option.descriptionEs || option.value}</p>
          </div>
          <PopoverClose asChild>
            <button 
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </PopoverClose>
        </div>
        
        {/* Image */}
        <div className="relative aspect-video bg-black/20 min-h-[200px]">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="w-10 h-10 opacity-30" />
              <span className="text-xs">No hay imagen disponible</span>
            </div>
          ) : (
            <img 
              src={option.previewUrl} 
              alt={option.labelEs}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-black/30 border-t border-white/10">
          <p className="text-[10px] text-muted-foreground font-mono truncate">
            Prompt: {option.value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Helper para obtener icono
const getIcon = (iconName: string, className = "w-5 h-5") => {
  const icons: Record<string, JSX.Element> = {
    'Palette': <Palette className={className} />,
    'Camera': <Camera className={className} />,
    'Sun': <Sun className={className} />,
    'Layers': <Layers className={className} />,
    'Sparkles': <Sparkles className={className} />,
    'Maximize': <Maximize className={className} />,
    'Film': <Film className={className} />,
    'Zap': <Zap className={className} />,
    'Target': <Target className={className} />,
    'Edit': <Edit className={className} />,
    'ShoppingBag': <ShoppingBag className={className} />,
    'UtensilsCrossed': <UtensilsCrossed className={className} />,
    'Shirt': <Shirt className={className} />,
    'Home': <Home className={className} />,
    'Gamepad2': <Gamepad2 className={className} />,
    'PenTool': <PenTool className={className} />,
    'Layout': <Layout className={className} />,
    'Users': <Users className={className} />,
    'Gem': <Gem className={className} />,
    'Flame': <Flame className={className} />,
    'Crown': <Crown className={className} />,
  };
  return icons[iconName] || <Wand2 className={className} />;
};

export default function PromptBuilder() {
  const [activeTab, setActiveTab] = useState('constructor');
  const [basePrompt, setBasePrompt] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<Category, string | null>>({
    style: null,
    camera: null,
    lighting: null,
    material: null,
    vibe: null,
    anime: null,
    format: null,
    physics: null,
    adherence: null,
    editing: null
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [wizardInput, setWizardInput] = useState('');
  const [wizardOutput, setWizardOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeInputs, setRecipeInputs] = useState<Record<string, string>>({});
  
  // Estado para texto en imagen (OCR Inverso - Imagen 3)
  const [imageText, setImageText] = useState('');
  const [textPosition, setTextPosition] = useState<string>('');
  const [textStyle, setTextStyle] = useState<string>('');
  const [textFont, setTextFont] = useState<string>('');
  
  // Estado para prefijo/rol del prompt
  const [promptPrefix, setPromptPrefix] = useState('Generate an image of');
  
  // Estado para ingeniería inversa (análisis de imagen)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzedPrompt, setAnalyzedPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Estado para análisis estructurado
  interface StructuredAnalysis {
    style: string;
    lighting: string;
    colors: string;
    camera: string;
    atmosphere: string;
    textures: string;
    quality: string;
    subject: string;
  }
  const [structuredAnalysis, setStructuredAnalysis] = useState<StructuredAnalysis | null>(null);
  const [selectedCategories, setSelectedCategories] = useState({
    style: true,
    lighting: true,
    colors: true,
    camera: true,
    atmosphere: true,
    textures: true,
    quality: true,
    subject: false, // Por defecto desactivado
  });
  
  const { toast } = useToast();
  
  // Opciones de prefijo/rol
  const PREFIX_OPTIONS = [
    { value: 'Generate an image of', label: 'Generar imagen' },
    { value: 'Create a photorealistic image of', label: 'Foto realista' },
    { value: 'A professional photograph of', label: 'Foto profesional' },
    { value: 'An artistic illustration of', label: 'Ilustración artística' },
    { value: 'A 3D render of', label: 'Render 3D' },
    { value: 'A digital painting of', label: 'Pintura digital' },
    { value: 'A concept art of', label: 'Concept Art' },
    { value: '', label: 'Sin prefijo' },
  ];

  // Procesar archivo de imagen
  const processImageFile = (file: File) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor usa un archivo de imagen válido.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen es muy grande. Máximo 4MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setAnalyzedPrompt('');
      toast({
        title: "✓ Imagen cargada",
        description: "Ahora puedes analizarla.",
      });
    };
    reader.readAsDataURL(file);
  };

  // Manejar subida de imagen desde input
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processImageFile(file);
  };

  // Manejar pegado desde portapapeles (Ctrl+V)
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          processImageFile(file);
          return;
        }
      }
    }
  };

  // Botón para pegar desde portapapeles usando Clipboard API
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        // Buscar tipo de imagen
        const imageType = item.types.find(type => type.startsWith('image/'));
        
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'pasted-image.png', { type: imageType });
          processImageFile(file);
          return;
        }
      }
      
      toast({
        title: "No hay imagen",
        description: "No se encontró una imagen en el portapapeles. Copia una imagen primero.",
        variant: "destructive"
      });
    } catch (error: any) {
      // Si el navegador no soporta o el usuario denegó permiso
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Permiso denegado",
          description: "Permite el acceso al portapapeles en tu navegador.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo acceder al portapapeles. Intenta arrastrando la imagen.",
          variant: "destructive"
        });
      }
    }
  };

  // Manejar drop de imagen
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Analizar imagen con IA
  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Primero sube una imagen para analizar.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setStructuredAnalysis(null);
    setAnalyzedPrompt('');
    
    try {
      console.log("📤 Enviando imagen para análisis estructurado...");
      
      const response = await fetch('/api/ai/analyze-image-structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: uploadedImage })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar la imagen');
      }

      setStructuredAnalysis(data.analysis);
      // Resetear selecciones (subject desactivado por defecto)
      setSelectedCategories({
        style: true,
        lighting: true,
        colors: true,
        camera: true,
        atmosphere: true,
        textures: true,
        quality: true,
        subject: false,
      });
      
      toast({
        title: "¡Análisis completado!",
        description: "Selecciona las categorías que quieras usar.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo analizar la imagen. Verifica tu conexión.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Generar prompt combinado desde las categorías seleccionadas
  const generateCombinedPrompt = () => {
    if (!structuredAnalysis) return '';
    
    const parts: string[] = [];
    
    if (selectedCategories.subject && structuredAnalysis.subject) {
      parts.push(structuredAnalysis.subject);
    }
    if (selectedCategories.style && structuredAnalysis.style) {
      parts.push(structuredAnalysis.style);
    }
    if (selectedCategories.lighting && structuredAnalysis.lighting) {
      parts.push(structuredAnalysis.lighting);
    }
    if (selectedCategories.colors && structuredAnalysis.colors) {
      parts.push(structuredAnalysis.colors);
    }
    if (selectedCategories.camera && structuredAnalysis.camera) {
      parts.push(structuredAnalysis.camera);
    }
    if (selectedCategories.atmosphere && structuredAnalysis.atmosphere) {
      parts.push(structuredAnalysis.atmosphere);
    }
    if (selectedCategories.textures && structuredAnalysis.textures) {
      parts.push(structuredAnalysis.textures);
    }
    if (selectedCategories.quality && structuredAnalysis.quality) {
      parts.push(structuredAnalysis.quality);
    }
    
    return parts.join(', ');
  };
  
  // Toggle una categoría del análisis estructurado
  const toggleAnalysisCategory = (category: keyof typeof selectedCategories) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Calcular progreso
  const totalCategories = CATEGORIES.length;
  const filledCategories = Object.values(selectedOptions).filter(Boolean).length;
  const progress = (filledCategories / totalCategories) * 100;

  // Generar prompt final
  const generatePrompt = () => {
    const parts = [
      basePrompt,
      selectedOptions.style,
      selectedOptions.camera,
      selectedOptions.lighting,
      selectedOptions.material,
      selectedOptions.vibe,
      selectedOptions.anime,
      selectedOptions.format,
      selectedOptions.physics,
      selectedOptions.adherence,
      selectedOptions.editing
    ].filter(Boolean);
    
    // Agregar texto si existe (OCR Inverso - Imagen 3)
    if (imageText.trim()) {
      let textPart = `with text "${imageText.trim()}"`;
      if (textPosition) textPart += ` ${textPosition}`;
      if (textStyle) textPart += `, ${textStyle}`;
      if (textFont) textPart += `, ${textFont}`;
      parts.push(textPart);
    }
    
    const mainPrompt = parts.length > 0 ? parts.join(', ') : '';
    
    // Agregar prefijo/rol al inicio
    if (promptPrefix && mainPrompt) {
      return `${promptPrefix} ${mainPrompt}`;
    }
    
    return mainPrompt;
  };

  const generatedPrompt = generatePrompt();

  const handleOptionSelect = (category: Category, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
  };

  const handleRandomize = () => {
    const newOptions = { ...selectedOptions };
    CATEGORIES.forEach(cat => {
      const options = PROMPT_OPTIONS.filter(opt => opt.category === cat.id);
      if (options.length > 0) {
        const randomOpt = options[Math.floor(Math.random() * options.length)];
        newOptions[cat.id as Category] = randomOpt.value;
      }
    });
    setSelectedOptions(newOptions);
    toast({
      title: "¡Combinación aleatoria!",
      description: "Se seleccionó una opción de cada categoría.",
    });
  };

  const handleClear = () => {
    setBasePrompt('');
    setSelectedOptions({
      style: null,
      camera: null,
      lighting: null,
      material: null,
      vibe: null,
      anime: null,
      format: null,
      physics: null,
      adherence: null,
      editing: null
    });
    setImageText('');
    setTextPosition('');
    setTextStyle('');
    setTextFont('');
    setPromptPrefix('Generate an image of');
    setWizardInput('');
    setWizardOutput('');
    setSelectedRecipe(null);
    setRecipeInputs({});
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "El prompt está listo para pegar en Gemini, Midjourney o DALL-E.",
    });
  };

  // Modo Mago - Llamar a la IA
  const handleWizardGenerate = async () => {
    if (!wizardInput.trim()) {
      toast({
        title: "Error",
        description: "Escribe una descripción de lo que quieres crear.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: wizardInput })
      });

      if (!response.ok) {
        throw new Error('Error al generar el prompt');
      }

      const data = await response.json();
      setWizardOutput(data.prompt);
      toast({
        title: "¡Prompt generado!",
        description: "La IA ha creado un prompt profesional para ti.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con la IA. Verifica tu conexión.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mejorar prompt con IA
  const handleImprovePrompt = async () => {
    const promptToImprove = generatedPrompt || basePrompt;
    if (!promptToImprove.trim()) {
      toast({
        title: "Error",
        description: "Primero construye un prompt para mejorar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToImprove })
      });

      if (!response.ok) {
        throw new Error('Error al mejorar el prompt');
      }

      const data = await response.json();
      setBasePrompt(data.prompt);
      setSelectedOptions({
        style: null, camera: null, lighting: null,
        material: null, vibe: null, anime: null, format: null,
        physics: null, adherence: null, editing: null
      });
      toast({
        title: "¡Prompt mejorado!",
        description: "La IA ha optimizado tu prompt con detalles profesionales.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con la IA.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generar prompt desde receta
  const generateRecipePrompt = () => {
    if (!selectedRecipe) return '';
    let prompt = selectedRecipe.promptTemplate;
    Object.entries(recipeInputs).forEach(([key, value]) => {
      prompt = prompt.replace(`[${key}]`, value || `[${key}]`);
    });
    return prompt;
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/40 border border-white/10 p-1 h-auto">
          <TabsTrigger 
            value="constructor" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 gap-2"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Constructor</span>
          </TabsTrigger>
          <TabsTrigger 
            value="wizard" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Modo Mago</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reverse" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 gap-2"
          >
            <ScanSearch className="w-4 h-4" />
            <span className="hidden sm:inline">Ing. Inversa</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recipes" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Recetas</span>
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB: CONSTRUCTOR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="constructor">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Panel Izquierdo: Categorías */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Header con progreso */}
              <div className="glass-card p-5 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
                      <Layers className="text-primary w-5 h-5" />
                      Módulos del Constructor
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Selecciona características de cada módulo para construir tu prompt perfecto.
                    </p>
                  </div>
                  <div className="w-full md:w-auto bg-black/40 p-3 rounded-lg border border-white/5 min-w-[180px]">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Completado</span>
                      <span className="font-mono text-primary font-bold">{filledCategories}/{totalCategories}</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Categorías */}
              {CATEGORIES.map((cat, index) => {
                const isFilled = !!selectedOptions[cat.id];
                const isExpanded = expandedCategories[cat.id] !== false;
                const groupedOptions = getOptionsGroupedByCategory(cat.id);
                
                return (
                  <div key={cat.id} className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
                    {/* Header de categoría */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                          isFilled 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-secondary text-muted-foreground border-white/10'
                        }`}>
                          {isFilled ? <Check className="w-4 h-4" /> : getIcon(cat.icon, "w-4 h-4")}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold flex items-center gap-2">
                            {cat.labelEs}
                            {isFilled && (
                              <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10">
                                ✓
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground">{cat.description}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                    </button>

                    {/* Opciones de la categoría */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/5"
                        >
                          <div className="p-4 space-y-4">
                            {Object.entries(groupedOptions).map(([groupName, options]) => (
                              <div key={groupName}>
                                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                                  {groupName}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {options.map(option => {
                                    const isSelected = selectedOptions[cat.id] === option.value;
                                    const hasPreview = !!option.previewUrl;
                                    return (
                                      <div key={option.id} className="flex items-center gap-1">
                                        <motion.button
                                          onClick={() => handleOptionSelect(cat.id, option.value)}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          className={`
                                            px-3 py-2 rounded-lg border text-sm transition-all
                                            ${isSelected 
                                              ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                                              : 'bg-black/30 border-white/10 text-gray-300 hover:border-primary/50 hover:bg-black/50'
                                            }
                                            ${hasPreview ? 'rounded-r-none border-r-0' : ''}
                                          `}
                                        >
                                          {option.labelEs}
                                        </motion.button>
                                        {hasPreview && (
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <button 
                                                className={`
                                                  p-2 rounded-lg rounded-l-none border text-sm transition-all
                                                  ${isSelected 
                                                    ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' 
                                                    : 'bg-black/30 border-white/10 text-muted-foreground hover:text-white hover:bg-black/50'
                                                  }
                                                `}
                                                title="Ver ejemplo"
                                              >
                                                <Eye className="w-3.5 h-3.5" />
                                              </button>
                                            </PopoverTrigger>
                                            <PopoverContent 
                                              className="w-80 p-0 bg-black/90 border-white/10"
                                              side="right"
                                              align="start"
                                            >
                                              <ImagePreview option={option} />
                                            </PopoverContent>
                                          </Popover>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Panel Derecho: Preview */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 flex flex-col gap-4">
                
                {/* Selector de Rol/Prefijo */}
                <Card className="p-4 glass border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Target className="w-4 h-4" />
                    <label className="text-xs font-mono uppercase tracking-wider font-bold">
                      Tipo de Generación
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PREFIX_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setPromptPrefix(opt.value)}
                        className={`
                          px-2.5 py-1.5 rounded-lg text-xs border transition-all
                          ${promptPrefix === opt.value 
                            ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.2)]' 
                            : 'bg-black/30 border-white/10 text-muted-foreground hover:border-green-500/50 hover:text-white'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {promptPrefix && (
                    <p className="text-[10px] text-green-400/60 mt-2 font-mono">
                      → {promptPrefix}...
                    </p>
                  )}
                </Card>

                {/* Input del sujeto principal */}
                <Card className="p-4 glass border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Lightbulb className="w-4 h-4" />
                    <label className="text-xs font-mono uppercase tracking-wider font-bold">
                      Sujeto Principal
                    </label>
                  </div>
                  <Textarea 
                    placeholder="Describe qué quieres crear (ej: Un samurai cyberpunk en Tokyo...)" 
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    className="bg-black/30 border-white/10 focus:border-primary/50 min-h-[80px] resize-none text-sm rounded-lg placeholder:text-muted-foreground/40"
                  />
                </Card>

                {/* Input de texto en imagen (OCR Inverso - Imagen 3) */}
                <Card className="p-4 glass border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-orange-400">
                    <Type className="w-4 h-4" />
                    <label className="text-xs font-mono uppercase tracking-wider font-bold">
                      Texto en Imagen (OCR Inverso)
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-400/20 text-orange-300">Imagen 3</span>
                  </div>
                  <input
                    type="text"
                    placeholder='Ej: "SALE", "Hello World", "Codex Trader 2025"'
                    value={imageText}
                    onChange={(e) => setImageText(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-orange-400/50 focus:outline-none placeholder:text-muted-foreground/40 mb-2"
                  />
                  {imageText && (
                    <>
                      <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                        <span className="text-[10px] text-muted-foreground mr-1">Posición:</span>
                        {[
                          { value: '', label: 'Auto' },
                          { value: 'at the top', label: 'Arriba' },
                          { value: 'at the bottom', label: 'Abajo' },
                          { value: 'in the center', label: 'Centro' },
                          { value: 'on the left', label: 'Izquierda' },
                          { value: 'on the right', label: 'Derecha' },
                        ].map(pos => (
                          <button
                            key={pos.value}
                            onClick={() => setTextPosition(pos.value)}
                            className={`
                              px-2 py-0.5 rounded text-[10px] border transition-all
                              ${textPosition === pos.value 
                                ? 'bg-orange-400/20 border-orange-400 text-orange-300' 
                                : 'bg-black/30 border-white/10 text-muted-foreground hover:border-orange-400/50'
                              }
                            `}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[10px] text-muted-foreground mr-1">Estilo:</span>
                        {[
                          { value: '', label: 'Normal' },
                          { value: 'neon text with glow', label: 'Neón' },
                          { value: 'embossed text', label: 'Relieve' },
                          { value: 'engraved in stone', label: 'Grabado' },
                          { value: 'embroidered text', label: 'Bordado' },
                          { value: 'pixel art text', label: 'Pixel Art' },
                        ].map(style => (
                          <button
                            key={style.value}
                            onClick={() => setTextStyle(style.value)}
                            className={`
                              px-2 py-0.5 rounded text-[10px] border transition-all
                              ${textStyle === style.value 
                                ? 'bg-orange-400/20 border-orange-400 text-orange-300' 
                                : 'bg-black/30 border-white/10 text-muted-foreground hover:border-orange-400/50'
                              }
                            `}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-muted-foreground mr-1">Tipografía:</span>
                        {[
                          { value: '', label: 'Auto' },
                          { value: 'serif font', label: 'Serif' },
                          { value: 'sans-serif font', label: 'Sans-serif' },
                          { value: 'graffiti style', label: 'Graffiti' },
                          { value: 'handwritten style', label: 'Manuscrita' },
                        ].map(font => (
                          <button
                            key={font.value}
                            onClick={() => setTextFont(font.value)}
                            className={`
                              px-2 py-0.5 rounded text-[10px] border transition-all
                              ${textFont === font.value 
                                ? 'bg-orange-400/20 border-orange-400 text-orange-300' 
                                : 'bg-black/30 border-white/10 text-muted-foreground hover:border-orange-400/50'
                              }
                            `}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-2">
                    ✨ Imagen 3 puede generar texto legible y exacto dentro de la imagen
                  </p>
                </Card>

                {/* Prompt generado */}
                <div className="glass-card p-5 rounded-xl border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <h3 className="font-bold">Prompt Generado</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleRandomize} 
                        className="h-8 w-8 hover:bg-primary/20 hover:text-primary" 
                        title="Aleatorio"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleClear} 
                        className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive" 
                        title="Limpiar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-3 border border-white/10 font-mono text-xs leading-relaxed text-gray-300 min-h-[150px] max-h-[250px] overflow-y-auto">
                    {generatedPrompt ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={generatedPrompt}>
                        {generatedPrompt}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2 py-8">
                        <Wand2 className="w-8 h-8 opacity-20" />
                        <span className="italic text-center text-xs">Selecciona opciones para construir tu prompt...</span>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-4 space-y-2 relative z-10">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      onClick={() => handleCopy(generatedPrompt)}
                      disabled={!generatedPrompt}
                    >
                      <Copy className="mr-2 w-4 h-4" />
                      Copiar Prompt
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10 h-10"
                      onClick={handleImprovePrompt}
                      disabled={!generatedPrompt || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 w-4 h-4" />
                      )}
                      Mejorar con IA
                    </Button>
                  </div>
                </div>

                {/* Categorías faltantes */}
                {progress < 100 && progress > 0 && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/80 text-xs">
                    <p className="font-bold mb-1 flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current" /> 
                      Categorías sin seleccionar:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {CATEGORIES.map(cat => (
                        !selectedOptions[cat.id] && (
                          <span key={cat.id} className="bg-black/40 px-2 py-0.5 rounded text-[10px] border border-white/5">
                            {cat.labelEs}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB: MODO MAGO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="wizard">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 rounded-xl border border-primary/20 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Modo Mago</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe lo que quieres en palabras simples y la IA creará un prompt profesional
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                    ¿Qué imagen quieres crear?
                  </label>
                  <Textarea 
                    placeholder="Ejemplo: Quiero una foto de un perfume de lujo que se vea elegante y caro, con fondo oscuro..."
                    value={wizardInput}
                    onChange={(e) => setWizardInput(e.target.value)}
                    className="bg-black/30 border-white/10 focus:border-primary/50 min-h-[120px] resize-none"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold h-12"
                  onClick={handleWizardGenerate}
                  disabled={isLoading || !wizardInput.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generar Prompt Profesional
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output del Mago */}
            <AnimatePresence>
              {wizardOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-6 rounded-xl border border-green-500/30 bg-green-500/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-green-400 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Prompt Generado por IA
                    </h3>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setWizardOutput('')}
                      className="text-muted-foreground hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-white/10 font-mono text-sm leading-relaxed text-gray-200 mb-4">
                    {wizardOutput}
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold"
                    onClick={() => handleCopy(wizardOutput)}
                  >
                    <Copy className="mr-2 w-4 h-4" />
                    Copiar Prompt
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tips para mejores resultados
              </h4>
              <ul className="text-sm text-blue-200/80 space-y-1">
                <li>• Describe el sujeto principal claramente</li>
                <li>• Menciona el ambiente o contexto deseado</li>
                <li>• Indica si quieres un estilo específico (anime, realista, etc.)</li>
                <li>• Especifica el uso (producto, redes sociales, videojuego)</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB: INGENIERÍA INVERSA */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="reverse">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 rounded-xl border border-cyan-500/20 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <ScanSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Ingeniería Inversa</h2>
                  <p className="text-sm text-muted-foreground">
                    Sube una imagen y la IA extraerá el prompt para crear algo similar
                  </p>
                </div>
              </div>

              {/* Área de upload */}
              <div className="space-y-4">
                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Archivo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500"
                    onClick={handlePasteFromClipboard}
                  >
                    <ClipboardPaste className="w-4 h-4 mr-2" />
                    Pegar Imagen
                  </Button>
                </div>

                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Área de preview / drop zone */}
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center transition-all
                    ${uploadedImage 
                      ? 'border-cyan-500/50 bg-cyan-500/5' 
                      : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5 cursor-pointer'
                    }
                  `}
                  onClick={() => !uploadedImage && document.getElementById('image-upload')?.click()}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  tabIndex={0}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Imagen subida" 
                        className="max-h-72 mx-auto rounded-lg shadow-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('image-upload')?.click();
                          }}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Cambiar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                            setAnalyzedPrompt('');
                          }}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Quitar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Arrastra una imagen aquí
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          o usa los botones de arriba
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-12"
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing || !uploadedImage}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Analizando imagen...
                    </>
                  ) : (
                    <>
                      <ScanSearch className="mr-2 w-5 h-5" />
                      Extraer Prompt de la Imagen
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output del análisis estructurado */}
            <AnimatePresence>
              {structuredAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Análisis de Estilo
                    </h3>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setStructuredAnalysis(null);
                        setUploadedImage(null);
                      }}
                      className="text-muted-foreground hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-4">
                    ✨ Selecciona las categorías que quieras incluir en tu prompt:
                  </p>

                  {/* Categorías con checkboxes */}
                  <div className="space-y-2 mb-6">
                    {/* Sujeto - Con advertencia especial */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.subject 
                          ? 'border-orange-500/50 bg-orange-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('subject')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.subject ? 'bg-orange-500 border-orange-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.subject && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-orange-400 text-sm">👤 SUJETO</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">Opcional</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.subject || 'No detectado'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Estilo */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.style 
                          ? 'border-cyan-500/50 bg-cyan-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('style')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.style ? 'bg-cyan-500 border-cyan-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.style && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-cyan-400 text-sm">🎨 ESTILO ARTÍSTICO</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.style}</p>
                        </div>
                      </div>
                    </div>

                    {/* Iluminación */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.lighting 
                          ? 'border-yellow-500/50 bg-yellow-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('lighting')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.lighting ? 'bg-yellow-500 border-yellow-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.lighting && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-yellow-400 text-sm">💡 ILUMINACIÓN</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.lighting}</p>
                        </div>
                      </div>
                    </div>

                    {/* Colores */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.colors 
                          ? 'border-pink-500/50 bg-pink-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('colors')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.colors ? 'bg-pink-500 border-pink-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.colors && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-pink-400 text-sm">🌈 PALETA DE COLORES</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.colors}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cámara */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.camera 
                          ? 'border-blue-500/50 bg-blue-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('camera')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.camera ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.camera && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-blue-400 text-sm">📷 CÁMARA / COMPOSICIÓN</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.camera}</p>
                        </div>
                      </div>
                    </div>

                    {/* Atmósfera */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.atmosphere 
                          ? 'border-purple-500/50 bg-purple-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('atmosphere')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.atmosphere ? 'bg-purple-500 border-purple-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.atmosphere && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-purple-400 text-sm">✨ ATMÓSFERA / VIBE</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.atmosphere}</p>
                        </div>
                      </div>
                    </div>

                    {/* Texturas */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.textures 
                          ? 'border-emerald-500/50 bg-emerald-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('textures')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.textures ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.textures && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-emerald-400 text-sm">🧱 TEXTURAS / MATERIALES</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.textures}</p>
                        </div>
                      </div>
                    </div>

                    {/* Calidad */}
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.quality 
                          ? 'border-red-500/50 bg-red-500/10' 
                          : 'border-white/10 bg-black/30 opacity-60'
                      }`}
                      onClick={() => toggleAnalysisCategory('quality')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedCategories.quality ? 'bg-red-500 border-red-500' : 'border-white/30'
                        }`}>
                          {selectedCategories.quality && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-red-400 text-sm">⚡ CALIDAD / RENDER</span>
                          <p className="text-xs text-gray-400 mt-1 break-words">{structuredAnalysis.quality}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview del prompt combinado */}
                  <div className="mb-4">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                      📝 Prompt resultante:
                    </label>
                    <div className="bg-black/50 rounded-lg p-4 border border-white/10 font-mono text-sm leading-relaxed text-gray-200 min-h-[60px]">
                      {generateCombinedPrompt() || <span className="text-muted-foreground italic">Selecciona al menos una categoría</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                      onClick={() => handleCopy(generateCombinedPrompt())}
                      disabled={!generateCombinedPrompt()}
                    >
                      <Copy className="mr-2 w-4 h-4" />
                      Copiar
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold"
                      disabled={!generateCombinedPrompt()}
                      onClick={() => {
                        const combinedPrompt = generateCombinedPrompt();
                        setBasePrompt(combinedPrompt);
                        setActiveTab('constructor');
                        toast({
                          title: "¡Estilo transferido!",
                          description: "Ahora agrega tu propia descripción en el Constructor.",
                        });
                      }}
                    >
                      <ArrowRight className="mr-2 w-4 h-4" />
                      Personalizar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info */}
            <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                ¿Cómo funciona?
              </h4>
              <ul className="text-sm text-cyan-200/80 space-y-1">
                <li>• <span className="text-cyan-400">Subir Archivo</span> - Selecciona desde tu PC</li>
                <li>• <span className="text-cyan-400">Pegar Imagen</span> - Copia una imagen y pégala</li>
                <li>• <span className="text-cyan-400">Arrastra</span> una imagen directamente al área</li>
                <li>• La IA analizará estilo, iluminación, composición y más</li>
                <li>• Usa el prompt en Gemini, Midjourney, DALL-E, etc.</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB: RECETAS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="recipes">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lista de recetas */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <BookOpen className="text-primary w-5 h-5" />
                  Recetas Rápidas
                </h2>
                <p className="text-sm text-muted-foreground">
                  Templates listos para casos de uso comunes. Selecciona una y personaliza los campos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RECIPES.map(recipe => (
                  <motion.button
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setRecipeInputs({});
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-4 rounded-xl border text-left transition-all
                      ${selectedRecipe?.id === recipe.id
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                        : 'bg-black/30 border-white/10 hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRecipe?.id === recipe.id ? 'bg-primary' : 'bg-white/5'
                      }`}>
                        {getIcon(recipe.icon, "w-5 h-5")}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{recipe.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{recipe.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Panel de personalización */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                {selectedRecipe ? (
                  <div className="glass-card p-5 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      {getIcon(selectedRecipe.icon, "w-5 h-5 text-primary")}
                      {selectedRecipe.title}
                    </h3>

                    {/* Extraer campos del template */}
                    <div className="space-y-3 mb-4">
                      {selectedRecipe.promptTemplate.match(/\[([^\]]+)\]/g)?.map((match, i) => {
                        const field = match.replace(/[\[\]]/g, '');
                        return (
                          <div key={i}>
                            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                              {field}
                            </label>
                            <input
                              type="text"
                              value={recipeInputs[field] || ''}
                              onChange={(e) => setRecipeInputs(prev => ({ ...prev, [field]: e.target.value }))}
                              placeholder={`Escribe ${field.toLowerCase()}...`}
                              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Preview del prompt */}
                    <div className="bg-black/50 rounded-lg p-3 border border-white/10 font-mono text-xs leading-relaxed text-gray-300 mb-4 max-h-[200px] overflow-y-auto">
                      {generateRecipePrompt()}
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                      onClick={() => handleCopy(generateRecipePrompt())}
                    >
                      <Copy className="mr-2 w-4 h-4" />
                      Copiar Prompt
                    </Button>
                  </div>
                ) : (
                  <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">
                      Selecciona una receta para comenzar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
