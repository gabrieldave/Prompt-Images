# Instrucciones para Desplegar en Vercel

## Configuración Requerida

### Variables de Entorno

Necesitas configurar las siguientes variables de entorno en Vercel:

1. **OPENAI_API_KEY**: Tu clave de API de OpenAI (requerida para las funciones de IA)

### Pasos para Desplegar

1. **Instalar Vercel CLI** (si no lo tienes):
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión en Vercel**:
   ```bash
   vercel login
   ```

3. **Desplegar el proyecto**:
   ```bash
   vercel
   ```
   
   O para producción:
   ```bash
   vercel --prod
   ```

4. **Configurar variables de entorno**:
   - Ve a tu proyecto en el dashboard de Vercel
   - Settings → Environment Variables
   - Agrega `OPENAI_API_KEY` con tu clave de API

### Alternativa: Desplegar desde GitHub

1. Conecta tu repositorio de GitHub con Vercel
2. Vercel detectará automáticamente la configuración
3. Agrega las variables de entorno en el dashboard
4. El despliegue se hará automáticamente en cada push

## Estructura del Proyecto en Vercel

- **API Routes**: `/api/*` → `api/index.ts` (serverless function)
- **Static Files**: Archivos estáticos desde `dist/public`
- **Client Routes**: Todas las rutas se redirigen a `index.html` para SPA routing

## Notas Importantes

- El build se ejecuta automáticamente con `npm run build`
- Los archivos estáticos se sirven desde `dist/public`
- Las funciones serverless tienen un timeout de 60 segundos
- La memoria asignada es de 1024 MB

