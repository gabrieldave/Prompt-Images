# 🚀 Guía de Configuración para Vercel

## ⚠️ Problema Común: Error 500 en Modo Mago

Si ves el error "No se pudo conectar con la IA", es porque la variable `OPENAI_API_KEY` no está configurada en Vercel.

## 📋 Pasos para Configurar Variables de Entorno en Vercel

### 1. Ve al Dashboard de Vercel
1. Entra a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `prompt-images-sooty` (o el nombre que tengas)
3. Ve a **Settings** → **Environment Variables**

### 2. Añade la Variable OPENAI_API_KEY
1. Click en **Add New**
2. **Name**: `OPENAI_API_KEY`
3. **Value**: Pega tu API key de OpenAI (la que tienes en el `.env` local)
4. **Environment**: Selecciona:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click en **Save**

### 3. Redespliega el Proyecto
1. Ve a **Deployments**
2. Click en los **3 puntos** del último deployment
3. Selecciona **Redeploy**
4. Espera a que termine el build

## 🔍 Verificar que Funciona

### Opción 1: Endpoint de Health Check
Visita: `https://tu-proyecto.vercel.app/api/health`

Deberías ver:
```json
{
  "status": "ok",
  "openai_configured": true,
  "node_env": "production",
  "vercel": true,
  "timestamp": "..."
}
```

Si `openai_configured` es `false`, la variable no está configurada correctamente.

### Opción 2: Logs de Vercel
1. Ve a **Deployments** → Click en el último deployment
2. Ve a la pestaña **Functions**
3. Click en `/api/ai/wizard`
4. Revisa los logs para ver errores

## 🛠️ Solución de Problemas

### Error: "API key de OpenAI no configurada"
**Causa**: La variable `OPENAI_API_KEY` no está en Vercel o tiene un nombre diferente.

**Solución**:
1. Verifica que el nombre sea exactamente `OPENAI_API_KEY` (case-sensitive)
2. Asegúrate de haber seleccionado todos los ambientes (Production, Preview, Development)
3. Redespliega después de añadir la variable

### Error: "Error al comunicarse con OpenAI"
**Causa**: La API key es inválida o expiró.

**Solución**:
1. Verifica tu API key en [platform.openai.com](https://platform.openai.com/api-keys)
2. Genera una nueva si es necesario
3. Actualiza la variable en Vercel
4. Redespliega

### Error: Timeout o 504
**Causa**: La función serverless está tardando demasiado.

**Solución**:
- Vercel tiene un límite de 10 segundos en el plan Hobby
- Considera usar un plan Pro para timeouts más largos
- O optimiza el prompt para que sea más rápido

## 📝 Checklist Pre-Deploy

- [ ] Variable `OPENAI_API_KEY` añadida en Vercel
- [ ] Variable configurada para Production, Preview y Development
- [ ] Proyecto redesplegado después de añadir variables
- [ ] Endpoint `/api/health` muestra `openai_configured: true`
- [ ] Prueba el Modo Mago y funciona correctamente

## 🔗 Enlaces Útiles

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Vercel Function Logs](https://vercel.com/docs/concepts/functions/serverless-functions#logs)

