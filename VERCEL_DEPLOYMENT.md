# Guía de Deployment en Vercel

Esta guía te ayudará a desplegar Mi Diario en Vercel de manera profesional.

## Prerequisitos

- Cuenta de GitHub
- Cuenta de Vercel (gratis)
- Proyecto Mi Diario en un repositorio de GitHub
- Firebase configurado (ver FIREBASE_SETUP.md)

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Subir el proyecto a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Commit
git commit -m "Initial commit - Mi Diario PWA"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/mi-diario.git

# Push
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Haz clic en "Sign Up" o "Login"
3. Selecciona "Continue with GitHub"
4. Autoriza a Vercel a acceder a tus repositorios
5. Haz clic en "Import Project"
6. Encuentra tu repositorio "mi-diario"
7. Haz clic en "Import"

### Paso 3: Configurar el Proyecto

En la pantalla de configuración:

**Framework Preset:** Create React App (se detecta automáticamente)

**Root Directory:** `./` (raíz del proyecto)

**Build Command:** `npm run build`

**Output Directory:** `build`

### Paso 4: Agregar Variables de Entorno

En la sección "Environment Variables", agrega todas las variables de Firebase:

| Name | Value |
|------|-------|
| REACT_APP_FIREBASE_API_KEY | Tu API Key |
| REACT_APP_FIREBASE_AUTH_DOMAIN | tu-proyecto.firebaseapp.com |
| REACT_APP_FIREBASE_PROJECT_ID | tu-proyecto-id |
| REACT_APP_FIREBASE_STORAGE_BUCKET | tu-proyecto.appspot.com |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | 123456789 |
| REACT_APP_FIREBASE_APP_ID | 1:123:web:abc |
| REACT_APP_FIREBASE_MEASUREMENT_ID | G-ABC123 |

**Importante:** Marca todas las variables para los tres ambientes:
- Production
- Preview
- Development

### Paso 5: Deploy

1. Haz clic en "Deploy"
2. Espera a que termine el proceso (1-3 minutos)
3. ¡Listo! Tu app está en línea

## Opción 2: Deploy con Vercel CLI

### Instalación de Vercel CLI

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Deploy

Desde la raíz del proyecto:

```bash
# Deploy de prueba
vercel

# Deploy a producción
vercel --prod
```

### Agregar Variables de Entorno

```bash
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
# ... etc
```

O usa el archivo `.env`:

```bash
vercel env pull
```

## Configuración Post-Deploy

### 1. Dominio Personalizado

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a "Settings" → "Domains"
3. Agrega tu dominio personalizado:
   - `midominio.com`
   - `www.midominio.com`
4. Sigue las instrucciones para configurar DNS

### 2. HTTPS

Vercel proporciona HTTPS automáticamente con certificados SSL gratuitos.

### 3. PWA y Service Worker

Vercel sirve correctamente el service worker. Verifica:
1. Abre tu sitio
2. Abre DevTools → Application → Service Workers
3. Deberías ver el service worker registrado

### 4. Configurar Cache

El archivo `vercel.json` ya incluye configuración de cache óptima:
- Static assets: cache 1 año
- Service worker: sin cache (siempre actualizado)

### 5. Environment-Specific Builds

Para diferentes ambientes:

```bash
# Preview (staging)
git push origin develop
# Se deployea automáticamente a preview URL

# Production
git push origin main
# Se deployea automáticamente a producción
```

## Monitoreo y Analytics

### Analytics de Vercel

1. Ve a tu proyecto en Vercel
2. Navega a "Analytics"
3. Aquí verás métricas de rendimiento y uso

### Web Vitals

Vercel mide automáticamente:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## Continuous Deployment

### Git Push Auto-Deploy

Cada push a `main` deployea automáticamente a producción.

### Preview Deployments

Cada Pull Request crea un deployment de preview único con su propia URL.

## Troubleshooting

### Build Fails

**Error:** "Command failed with exit code 1"

**Solución:**
1. Verifica que todas las dependencias estén en `package.json`
2. Asegúrate de que el build funcione localmente: `npm run build`
3. Revisa los logs de build en Vercel

### Variables de Entorno No Funcionan

**Error:** Firebase configuration error

**Solución:**
1. Verifica que todas las variables empiecen con `REACT_APP_`
2. Redeploy después de agregar variables
3. Usa `vercel env ls` para listar variables

### PWA No Se Instala

**Solución:**
1. Verifica que `manifest.json` sea accesible
2. Asegúrate de que HTTPS esté activo
3. Limpia cache del navegador
4. Prueba en modo incógnito

### Service Worker No Se Registra

**Solución:**
1. Verifica la ruta en `public/service-worker.js`
2. Asegúrate de que el registro esté en `index.js`
3. Limpia cache de service workers en DevTools

## Optimizaciones

### 1. Code Splitting

React ya hace code splitting automáticamente.

### 2. Image Optimization

Usa el componente `<Image>` de Vercel (opcional):

```bash
npm install next/image
```

### 3. Lighthouse Score

Objetivo de puntuación:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Ejecuta audit:
```bash
npx lighthouse https://tu-sitio.vercel.app
```

## URLs Importantes

Después del deploy, tendrás:

**Production URL:**
`https://mi-diario.vercel.app`
o tu dominio personalizado

**Preview URLs:**
`https://mi-diario-git-branch-usuario.vercel.app`

**Dashboard:**
`https://vercel.com/tu-usuario/mi-diario`

## Actualizar la Aplicación

### Método 1: Git Push

```bash
# Hacer cambios
git add .
git commit -m "Actualización X"
git push origin main
# Deploy automático
```

### Método 2: Vercel CLI

```bash
vercel --prod
```

### Rollback

Si necesitas revertir a una versión anterior:

1. Ve a Vercel Dashboard
2. Navega a "Deployments"
3. Encuentra el deployment anterior
4. Haz clic en "..." → "Promote to Production"

## Seguridad

### Headers de Seguridad

Agrega a `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Environment Variables Protection

Nunca commites el archivo `.env` al repositorio. Está en `.gitignore`.

## Costo

Vercel es **GRATIS** para:
- Proyectos ilimitados
- 100GB bandwidth/mes
- 100 deployments/día
- Dominios personalizados
- HTTPS automático
- Serverless functions

## Soporte

Si tienes problemas:
- [Documentación de Vercel](https://vercel.com/docs)
- [Soporte de Vercel](https://vercel.com/support)
- [GitHub Issues del proyecto](https://github.com/tu-usuario/mi-diario/issues)

---

¡Tu aplicación Mi Diario está ahora en producción! 🎉
