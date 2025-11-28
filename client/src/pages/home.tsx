import { motion } from "framer-motion";
import PromptBuilder from "@/components/prompt-builder/PromptBuilder";
import heroBg from "/abstract_dark_digital_art_background.png";
import { Sparkles, Github, Coffee } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden selection:bg-primary/30">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold text-xl md:text-2xl tracking-tight leading-none">
                Image <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">Prompt Architect</span>
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground font-mono tracking-widest uppercase">
                Generador Inteligente de Prompts para IA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </span>
              <span className="opacity-20">|</span>
              <span className="font-mono text-xs">v2.0</span>
            </div>
            
            <a 
              href="https://github.com/gabrieldave/Prompt-Images" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            Crea Prompts <span className="text-primary">Impactantes</span> para Tus Imágenes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Construye prompts profesionales para <strong className="text-white">Gemini</strong>, <strong className="text-white">Midjourney</strong>, <strong className="text-white">DALL-E</strong> y más.
            Usa el modo mago con IA o selecciona manualmente cada característica.
          </p>
          
          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { icon: '🎨', text: 'Constructor Visual' },
              { icon: '🪄', text: 'Modo Mago con IA' },
              { icon: '📚', text: 'Recetas Listas' },
              { icon: '⚡', text: 'Mejora Automática' },
            ].map((feature, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm flex items-center gap-1.5"
              >
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1">
          <PromptBuilder />
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Hecho con <Coffee className="w-3 h-3 text-primary" /> para crear imágenes increíbles
          </p>
          <p className="mt-1 opacity-60">
            Compatible con Gemini, Midjourney, DALL-E, Stable Diffusion y más
          </p>
        </footer>
      </div>
    </div>
  );
}
