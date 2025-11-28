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

// Helper para convertir VercelRequest a Express Request
function convertRequest(vercelReq: VercelRequest): any {
  return {
    method: vercelReq.method || 'GET',
    url: vercelReq.url || '/',
    originalUrl: vercelReq.url || '/',
    path: vercelReq.url?.split('?')[0] || '/',
    query: vercelReq.query || {},
    body: vercelReq.body,
    headers: vercelReq.headers,
    get: (name: string) => vercelReq.headers[name.toLowerCase()],
    params: {},
  };
}

// Helper para convertir VercelResponse a Express Response
function convertResponse(vercelRes: VercelResponse): any {
  let statusCode = 200;
  let headersSent = false;
  
  return {
    statusCode,
    headersSent,
    status: function(code: number) {
      statusCode = code;
      return this;
    },
    json: function(body: any) {
      if (!headersSent) {
        headersSent = true;
        vercelRes.status(statusCode).json(body);
      }
      return this;
    },
    send: function(body: any) {
      if (!headersSent) {
        headersSent = true;
        vercelRes.status(statusCode).send(body);
      }
      return this;
    },
    end: function(body?: any) {
      if (!headersSent) {
        headersSent = true;
        if (body) {
          vercelRes.status(statusCode).send(body);
        } else {
          vercelRes.status(statusCode).end();
        }
      }
      return this;
    },
    set: function(name: string, value: string) {
      vercelRes.setHeader(name, value);
      return this;
    },
    get: function(name: string) {
      return vercelRes.getHeader(name);
    },
    get headersSent() {
      return headersSent;
    },
  };
}

// Exportar como función serverless para Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Inicializar la app si no está inicializada
    await initializeApp();
    
    // Convertir VercelRequest/VercelResponse a formato Express
    const expressReq = convertRequest(req);
    const expressRes = convertResponse(res);
    
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
