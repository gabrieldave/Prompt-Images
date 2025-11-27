import { useState } from 'react';
import { motion } from 'framer-motion';
import { PROMPT_OPTIONS, CATEGORIES, PromptOption, Category } from '@/lib/prompt-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  RefreshCw, 
  Trash2, 
  Palette, 
  Camera, 
  Zap, 
  Layers, 
  Sparkles, 
  Maximize,
  Wand2,
  Check,
  CheckCircle2,
  Circle,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to get icon component
const getIcon = (iconName: string) => {
  switch(iconName) {
    case 'Palette': return <Palette className="w-5 h-5" />;
    case 'Camera': return <Camera className="w-5 h-5" />;
    case 'Zap': return <Zap className="w-5 h-5" />;
    case 'Layers': return <Layers className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Maximize': return <Maximize className="w-5 h-5" />;
    default: return <Wand2 className="w-5 h-5" />;
  }
};

export default function PromptBuilder() {
  const [basePrompt, setBasePrompt] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<Category, string | null>>({
    style: null,
    camera: null,
    lighting: null,
    material: null,
    vibe: null,
    format: null
  });
  const { toast } = useToast();

  // Calculate completion
  const totalCategories = CATEGORIES.length;
  const filledCategories = Object.values(selectedOptions).filter(Boolean).length;
  const progress = (filledCategories / totalCategories) * 100;

  // Generate final prompt string
  const generatedPrompt = [
    basePrompt,
    selectedOptions.style,
    selectedOptions.camera,
    selectedOptions.lighting,
    selectedOptions.material,
    selectedOptions.vibe,
    selectedOptions.format
  ].filter(Boolean).join(', ');

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
        newOptions[cat.id] = randomOpt.value;
      }
    });
    setSelectedOptions(newOptions);
    toast({
      title: "Randomized Full Set",
      description: "Selected one characteristic for every module.",
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
      format: null
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copied to clipboard",
      description: "Ready to paste into Gemini or other AI tools.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* Left Panel: Vertical Scrollable Sections */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        
        <div className="glass-card p-6 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2 text-white">
                <Wand2 className="text-primary w-6 h-6" />
                Builder Modules
              </h2>
              <p className="text-muted-foreground max-w-md">
                Select one characteristic from each module below to build your perfect prompt.
              </p>
            </div>
            <div className="w-full md:w-auto bg-black/40 p-4 rounded-lg border border-white/5 min-w-[200px]">
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-muted-foreground">Completion</span>
                 <span className="font-mono text-primary font-bold">{Math.round(progress)}%</span>
               </div>
               <Progress value={progress} className="h-2 bg-white/10" />
            </div>
          </div>
        </div>

        {CATEGORIES.map((cat, index) => {
          const isFilled = !!selectedOptions[cat.id];
          return (
            <div key={cat.id} className="flex flex-col gap-4">
               <div className="flex items-center gap-3 sticky top-0 z-10 bg-background/95 backdrop-blur-md py-4 border-b border-white/5 lg:static lg:bg-transparent lg:p-0 lg:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isFilled ? 'bg-primary text-white border-primary' : 'bg-secondary text-muted-foreground border-white/10'}`}>
                    {isFilled ? <Check className="w-5 h-5" /> : <span className="font-mono font-bold">{index + 1}</span>}
                  </div>
                  <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    {cat.label}
                    {isFilled && <Badge variant="outline" className="ml-2 text-primary border-primary/30 bg-primary/10">Selected</Badge>}
                  </h3>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {PROMPT_OPTIONS
                    .filter(opt => opt.category === cat.id)
                    .map(option => {
                      const isSelected = selectedOptions[cat.id] === option.value;
                      return (
                        <motion.button
                          key={option.id}
                          onClick={() => handleOptionSelect(cat.id, option.value)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative group text-left p-4 rounded-xl border transition-all duration-200
                            flex flex-col gap-2 h-full overflow-hidden
                            ${isSelected 
                              ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(124,58,237,0.15)]' 
                              : 'bg-secondary/30 border-white/5 hover:border-primary/30 hover:bg-secondary/60'
                            }
                          `}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 p-2">
                              <div className="bg-primary text-white rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                          
                          <span className={`text-[10px] font-mono uppercase tracking-wider opacity-60 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                            {option.group}
                          </span>
                          
                          <span className={`font-medium text-sm md:text-base leading-tight ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {option.label}
                          </span>
                          
                          {/* Hover effect line */}
                          <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${isSelected ? 'w-full bg-primary' : 'w-0 bg-primary group-hover:w-full'}`} />
                        </motion.button>
                      );
                    })}
               </div>
            </div>
          )
        })}
      </div>

      {/* Right Panel: Sticky Preview */}
      <div className="lg:col-span-4">
        <div className="sticky top-8 flex flex-col gap-4">
          
          <Card className="p-5 glass border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Sparkles className="w-4 h-4" />
              <label className="text-xs font-mono uppercase tracking-wider font-bold">
                Core Subject
              </label>
            </div>
            <Textarea 
              placeholder="Describe your subject (e.g., A futuristic cyberpunk samurai...)" 
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="bg-black/20 border-white/10 focus:border-primary/50 min-h-[100px] resize-none text-base rounded-lg placeholder:text-muted-foreground/40"
            />
          </Card>

          <div className="glass-card p-6 rounded-xl border-primary/20 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="font-display font-bold text-lg">Generated Prompt</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={handleRandomize} className="h-8 w-8 hover:bg-primary/20 hover:text-primary" title="Randomize All">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive text-muted-foreground" title="Clear All">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-white/10 relative font-mono text-sm leading-relaxed text-gray-300 min-h-[200px] shadow-inner">
               {generatedPrompt ? (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   key={generatedPrompt}
                 >
                   <span className="text-white font-bold">{basePrompt}</span>
                   {basePrompt && selectedOptions.style && ", "}
                   <span className="text-primary font-medium">{selectedOptions.style}</span>
                   {selectedOptions.camera && ", "}
                   <span className="text-accent font-medium">{selectedOptions.camera}</span>
                   {selectedOptions.lighting && ", "}
                   <span className="text-yellow-400 font-medium">{selectedOptions.lighting}</span>
                   {selectedOptions.material && ", "}
                   <span className="text-pink-400 font-medium">{selectedOptions.material}</span>
                   {selectedOptions.vibe && ", "}
                   <span className="text-purple-400 font-medium">{selectedOptions.vibe}</span>
                   {selectedOptions.format && " "}
                   <span className="text-muted-foreground opacity-70">{selectedOptions.format}</span>
                 </motion.div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2">
                   <Wand2 className="w-8 h-8 opacity-20" />
                   <span className="italic text-center text-xs">Select options from the left to build your prompt...</span>
                 </div>
               )}
            </div>

            <div className="mt-6 relative z-10">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 text-lg shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] hover:-translate-y-0.5 transition-all rounded-xl"
                onClick={handleCopy}
                disabled={!generatedPrompt}
              >
                <Copy className="mr-2 w-5 h-5" />
                Copy to Clipboard
              </Button>
            </div>
          </div>

          {/* Mini Summary of Missing Items */}
          {progress < 100 && progress > 0 && (
             <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/80 text-xs">
               <p className="font-bold mb-2 flex items-center gap-2">
                 <Circle className="w-2 h-2 fill-current" /> 
                 Missing Categories:
               </p>
               <div className="flex flex-wrap gap-1">
                 {CATEGORIES.map(cat => (
                   !selectedOptions[cat.id] && (
                     <span key={cat.id} className="bg-black/40 px-2 py-1 rounded text-[10px] border border-white/5 uppercase tracking-wider">
                       {cat.label}
                     </span>
                   )
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
