import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMPT_OPTIONS, CATEGORIES, PromptOption, Category } from '@/lib/prompt-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to get icon component
const getIcon = (iconName: string) => {
  switch(iconName) {
    case 'Palette': return <Palette className="w-4 h-4" />;
    case 'Camera': return <Camera className="w-4 h-4" />;
    case 'Zap': return <Zap className="w-4 h-4" />;
    case 'Layers': return <Layers className="w-4 h-4" />;
    case 'Sparkles': return <Sparkles className="w-4 h-4" />;
    case 'Maximize': return <Maximize className="w-4 h-4" />;
    default: return <Wand2 className="w-4 h-4" />;
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
  const [activeTab, setActiveTab] = useState<Category>('style');
  const { toast } = useToast();

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
      title: "Randomized!",
      description: "A unique combination has been generated.",
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Panel: Builder Controls */}
      <div className="lg:col-span-7 flex flex-col gap-4 h-full">
        <div className="glass-card p-6 rounded-xl flex-1 flex flex-col overflow-hidden">
          <div className="mb-4">
            <h2 className="text-xl font-display font-bold mb-2 flex items-center gap-2">
              <Wand2 className="text-primary" />
              Parameter Selector
            </h2>
            <p className="text-sm text-muted-foreground">
              Select components from the Gemini Expert Manual to build your prompt.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)} className="flex-1 flex flex-col">
            <ScrollArea className="w-full pb-2">
              <TabsList className="bg-secondary/50 border border-white/5 p-1 h-auto flex w-full justify-start">
                {CATEGORIES.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                  >
                    {getIcon(cat.icon)}
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <div className="flex-1 overflow-hidden mt-4 relative">
              {CATEGORIES.map(cat => (
                <TabsContent key={cat.id} value={cat.id} className="h-full m-0 absolute inset-0">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-20">
                      {PROMPT_OPTIONS
                        .filter(opt => opt.category === cat.id)
                        .map(option => {
                          const isSelected = selectedOptions[cat.id] === option.value;
                          return (
                            <motion.button
                              key={option.id}
                              onClick={() => handleOptionSelect(cat.id, option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                relative group text-left p-3 rounded-lg border transition-all duration-200
                                flex flex-col gap-1 h-full
                                ${isSelected 
                                  ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                                  : 'bg-secondary/30 border-white/5 hover:border-primary/30 hover:bg-secondary/50'
                                }
                              `}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className={`text-xs font-mono mb-1 opacity-60 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                  {option.group}
                                </span>
                                {isSelected && <Check className="w-3 h-3 text-primary" />}
                              </div>
                              <span className={`font-medium text-sm ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {option.label}
                              </span>
                            </motion.button>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Right Panel: Preview & Actions */}
      <div className="lg:col-span-5 flex flex-col gap-4 h-full">
        
        {/* Base Prompt Input */}
        <Card className="p-4 glass border-white/5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
            Subject / Core Idea
          </label>
          <Textarea 
            placeholder="e.g. A futuristic city on Mars..." 
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            className="bg-secondary/30 border-white/10 focus:border-primary/50 min-h-[80px] resize-none text-lg"
          />
        </Card>

        {/* Live Preview */}
        <div className="glass-card p-6 rounded-xl flex-1 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="font-display font-bold text-lg">Final Prompt</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRandomize} className="h-8 w-8" title="Randomize All">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleClear} className="h-8 w-8 text-destructive hover:text-destructive" title="Clear All">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-white/5 relative font-mono text-sm leading-relaxed text-gray-300 overflow-y-auto">
             {generatedPrompt ? (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 key={generatedPrompt} // Animate on change
               >
                 <span className="text-white font-semibold">{basePrompt}</span>
                 {basePrompt && selectedOptions.style && ", "}
                 <span className="text-primary">{selectedOptions.style}</span>
                 {selectedOptions.camera && ", "}
                 <span className="text-accent">{selectedOptions.camera}</span>
                 {selectedOptions.lighting && ", "}
                 <span className="text-yellow-400">{selectedOptions.lighting}</span>
                 {selectedOptions.material && ", "}
                 <span className="text-pink-400">{selectedOptions.material}</span>
                 {selectedOptions.vibe && ", "}
                 <span className="text-purple-400">{selectedOptions.vibe}</span>
                 {selectedOptions.format && " "}
                 <span className="text-muted-foreground opacity-70">{selectedOptions.format}</span>
               </motion.div>
             ) : (
               <span className="text-muted-foreground/50 italic">Select options to build your prompt...</span>
             )}
          </div>

          <div className="mt-4 relative z-10">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
              onClick={handleCopy}
              disabled={!generatedPrompt}
            >
              <Copy className="mr-2 w-4 h-4" />
              Copy Prompt
            </Button>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedOptions).map(([key, value]) => {
             if(!value) return null;
             const category = CATEGORIES.find(c => c.id === key);
             return (
               <Badge key={key} variant="secondary" className="bg-secondary/50 border-white/10 px-3 py-1.5">
                 <span className="opacity-50 mr-2 text-[10px] uppercase">{category?.label}:</span>
                 {value}
                 <button 
                   onClick={() => handleOptionSelect(key as Category, value)}
                   className="ml-2 hover:text-destructive transition-colors"
                 >
                   ×
                 </button>
               </Badge>
             )
          })}
        </div>
      </div>
    </div>
  );
}
