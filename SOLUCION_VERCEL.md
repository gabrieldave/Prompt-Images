# Solución para Problemas de Conexión con OpenAI en Vercel

## ✅ Verificación Paso a Paso

### 1. Verificar Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Verifica que `OPENAI_API_KEY` esté configurada para **todos los entornos** (Production, Preview, Development)
4. El valor debe comenzar con `sk-` y tener al menos 20 caracteres

### 2. Verificar que la Variable se Aplicó

Después de añadir/modificar la variable:
- **IMPORTANTE**: Debes **redesplegar** el proyecto para que los cambios surtan efecto
- Ve a Deployments → Click en los 3 puntos → Redeploy

### 3. Probar el Endpoint de Diagnóstico

Una vez desplegado, visita:
```
https://tu-proyecto.vercel.app/api/diagnose-env
```

Deberías ver algo como:
```json
{
  "openai_api_key": {
    "exists": true,
    "length": 51,
    "prefix": "sk-proj...",
    "configured": true
  },
  "environment": {
    "node_env": "production",
    "vercel": true,
    "vercel_env": "production"
  }
}
```

Si `exists: false`, significa que la variable no está configurada correctamente.

### 4. Verificar Logs en Vercel

1. Ve a Deployments → Selecciona el último deployment
2. Click en "Functions" tab
3. Busca errores relacionados con `OPENAI_API_KEY`

### 5. Solución de Problemas Comunes

#### Problema: "API key de OpenAI no configurada"
**Solución:**
- Verifica que la variable esté en Vercel Dashboard
- Asegúrate de haber redesplegado después de añadirla
- Verifica que el nombre sea exactamente `OPENAI_API_KEY` (case-sensitive)

#### Problema: La app funciona localmente pero no en Vercel
**Solución:**
- Las variables de `.env` local NO se sincronizan con Vercel
- Debes añadirlas manualmente en Vercel Dashboard
- Cada entorno (Production/Preview/Development) necesita su propia configuración

#### Problema: El endpoint `/api/diagnose-env` muestra `exists: false`
**Solución:**
1. Verifica el nombre de la variable (debe ser exactamente `OPENAI_API_KEY`)
2. Verifica que esté habilitada para el entorno correcto
3. Redespliega el proyecto
4. Espera 1-2 minutos después del despliegue

## 🔧 Configuración Actual

El proyecto está configurado para:
- ✅ Usar Node.js 20.x en Vercel
- ✅ Exportar la app de Express como serverless function
- ✅ Detectar automáticamente el entorno de Vercel
- ✅ Cargar variables de entorno desde Vercel Dashboard

## 📝 Notas Importantes

- **NO** uses `.env` en producción - Vercel no lo lee automáticamente
- Las variables de entorno deben configurarse en Vercel Dashboard
- Después de cambiar variables, **siempre redespliega**
- El endpoint `/api/diagnose-env` te ayuda a diagnosticar problemas










