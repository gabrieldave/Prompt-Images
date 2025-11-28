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

async function getApp(): Promise<Express> {
  if (!appInitialized) {
    // Crear un httpServer dummy para registerRoutes (no se usa realmente)
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    
    // Error handler
    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    initializedApp = app;
    appInitialized = true;
  }
  
  return initializedApp!;
}

// Exportar como función serverless para Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    
    // @vercel/node convierte automáticamente VercelRequest/VercelResponse a Express req/res
    // Usamos el wrapper de @vercel/node para manejar la conversión
    return new Promise<void>((resolve, reject) => {
      expressApp(req as any, res as any, (err?: any) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Handler initialization error:', error);
    res.status(500).json({ 
      error: 'Error inicializando la aplicación',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
