import type { VercelRequest, VercelResponse } from '@vercel/node';
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
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Inicializar la app si no está inicializada
    await initializeApp();
    
    // @vercel/node ya convierte VercelRequest/VercelResponse a Express req/res
    // Pero necesitamos crear objetos compatibles manualmente
    // Crear req/res compatibles con Express desde VercelRequest/VercelResponse
    const expressReq = {
      ...req,
      method: req.method || 'GET',
      url: req.url || '/',
      originalUrl: req.url || '/',
      path: req.url?.split('?')[0] || '/',
      query: req.query || {},
      body: req.body,
      headers: req.headers,
      get: (name: string) => req.headers[name.toLowerCase()],
      params: {},
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      protocol: 'https',
      secure: true,
      hostname: req.headers.host || 'unknown',
    } as any;
    
    // Extender res con métodos de Express si no los tiene
    const expressRes = res as any;
    if (!expressRes.statusCode) {
      expressRes.statusCode = 200;
    }
    if (!expressRes.locals) {
      expressRes.locals = {};
    }
    if (!expressRes.status) {
      expressRes.status = function(code: number) {
        this.statusCode = code;
        return this;
      };
    }
    if (!expressRes.set) {
      expressRes.set = function(name: string, value: string) {
        res.setHeader(name, value);
        return this;
      };
    }
    if (!expressRes.get) {
      expressRes.get = function(name: string) {
        return res.getHeader(name);
      };
    }
    
    // Ejecutar la app de Express
    return new Promise<void>((resolve, reject) => {
      app(expressReq, expressRes, (err?: any) => {
        if (err) {
          console.error('Express middleware error:', err);
          if (!expressRes.headersSent) {
            res.status(500).json({ 
              error: 'Error procesando la solicitud',
              message: err.message || 'Error desconocido'
            });
          }
          reject(err);
        } else {
          // Si no hay error y no se envió respuesta, podría ser un 404
          if (!expressRes.headersSent) {
            res.status(404).json({ error: 'Ruta no encontrada' });
          }
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
