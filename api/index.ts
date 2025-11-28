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
  const expressApp = await getApp();
  
  // Convertir Vercel request/response a Express format usando @vercel/node
  return new Promise<void>((resolve, reject) => {
    // @vercel/node ya convierte automáticamente, pero necesitamos manejar el callback
    expressApp(req as any, res as any, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
