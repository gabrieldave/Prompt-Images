import { motion } from "framer-motion";
import PromptBuilder from "@/components/prompt-builder/PromptBuilder";
import heroBg from "@assets/generated_images/abstract_dark_digital_art_background.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden selection:bg-primary/30">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <span className="font-display font-bold text-xl text-white">G</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight leading-none">
                Gemini <span className="text-gradient">Architect</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                Advanced Prompt Engineering System
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </span>
            <span className="opacity-20">|</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <PromptBuilder />
        </main>
      </div>
    </div>
  );
}
