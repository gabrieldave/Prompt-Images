import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";
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
let appInitialized = false;
let initializedApp: Express | null = null;
let initPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  // Si ya está inicializado, retornar inmediatamente
  if (appInitialized && initializedApp) {
    return initializedApp;
  }
  
  // Si hay una inicialización en progreso, esperar a que termine
  if (initPromise) {
    return initPromise;
  }
  
  // Iniciar la inicialización
  initPromise = (async () => {
    try {
      console.log('🔄 Initializing Express app...');
      
      // Crear un httpServer dummy para registerRoutes (no se usa realmente)
      const httpServer = createServer(app);
      await registerRoutes(httpServer, app);
      
      // Error handler
      app.use((err: any, _req: any, res: any, _next: any) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });
      
      initializedApp = app;
      appInitialized = true;
      console.log('✅ App initialized successfully');
      return app;
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      appInitialized = false;
      initializedApp = null;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

// Exportar como función serverless para Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    
    // Convertir VercelRequest/VercelResponse a formato Express
    // @vercel/node ya hace la conversión automáticamente cuando pasamos req/res directamente
    return new Promise<void>((resolve, reject) => {
      expressApp(req as any, res as any, (err?: any) => {
        if (err) {
          console.error('Express middleware error:', err);
          if (!res.headersSent) {
            res.status(500).json({ 
              error: 'Error procesando la solicitud',
              message: err.message || 'Error desconocido'
            });
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
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
