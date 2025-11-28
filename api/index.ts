import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes.js";
import { createServer } from "http";

// Crear instancia de Express
const app = express();

// Aumentar límite para imágenes en base64 (hasta 50MB)
app.use(
  express.json({
    limit: '50mb',
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Inicializar rutas una sola vez (singleton pattern para Vercel)
let handler: ReturnType<typeof serverless> | null = null;
let appInitialized = false;
let initPromise: Promise<void> | null = null;

async function initializeApp(): Promise<void> {
  if (appInitialized) {
    return;
  }
  
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = (async () => {
    try {
      console.log('🔄 Initializing Express app for Vercel...');
      
      // Crear un httpServer dummy para registerRoutes
      const httpServer = createServer(app);
      await registerRoutes(httpServer, app);
      
      // Error handler
      app.use((err: any, _req: any, res: any, _next: any) => {
        console.error('Express error handler:', err);
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });
      
      // Crear handler serverless usando serverless-http
      handler = serverless(app, {
        binary: ['image/*', 'application/octet-stream'],
      });
      
      appInitialized = true;
      console.log('✅ App initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      appInitialized = false;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

// Exportar como función serverless para Vercel
export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Inicializar la app si no está inicializada
    await initializeApp();
    
    if (!handler) {
      throw new Error('Handler not initialized');
    }
    
    // serverless-http maneja la conversión automáticamente
    return handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL
    });
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Error inicializando la aplicación',
        message: errorMessage
      });
    }
  }
}
