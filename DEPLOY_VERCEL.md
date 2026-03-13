# 🚀 DEPLOY EN VERCEL - Guía Completa

## 📋 Requisitos Previos

- [ ] Cuenta de GitHub (gratis)
- [ ] Cuenta de Vercel (gratis - usa login de GitHub)
- [ ] Proyecto Mi Diario funcionando en local
- [ ] Credenciales de Firebase configuradas

---

## 🎯 MÉTODO 1: Deploy con GitHub (Recomendado)

### Paso 1: Subir a GitHub

#### 1.1 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repo: `mi-diario`
3. **Privado** o Público (tu elección)
4. **NO** inicialices con README
5. Haz clic en **"Create repository"**

#### 1.2 Inicializar Git en tu Proyecto

```bash
cd /ruta/a/mi-diario

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - Mi Diario PWA"

# Conectar con GitHub (reemplaza TU-USUARIO y TU-REPO)
git remote add origin https://github.com/TU-USUARIO/mi-diario.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE:** Verifica que `.gitignore` excluya:
```
.env
api/.env
api/serviceAccountKey.json
node_modules
```

---

### Paso 2: Conectar Vercel con GitHub

#### 2.1 Crear Cuenta en Vercel

1. Ve a https://vercel.com/signup
2. Haz clic en **"Continue with GitHub"**
3. Autoriza Vercel para acceder a tus repos

#### 2.2 Importar Proyecto

1. En Vercel Dashboard, haz clic en **"Add New..."** → **"Project"**
2. Busca tu repo `mi-diario`
3. Haz clic en **"Import"**

#### 2.3 Configurar el Proyecto

**Framework Preset:** React (se detecta automáticamente)

**Root Directory:** `./` (raíz del proyecto)

**Build Command:** 
```bash
npm run build
```

**Output Directory:** 
```bash
build
```

**Install Command:**
```bash
npm install
```

---

### Paso 3: Configurar Variables de Entorno

#### 3.1 Variables del Frontend

En la configuración de Vercel, ve a **"Environment Variables"** y agrega:

```
REACT_APP_FIREBASE_API_KEY = [tu-api-key]
REACT_APP_FIREBASE_AUTH_DOMAIN = [tu-proyecto].firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = [tu-proyecto-id]
REACT_APP_FIREBASE_STORAGE_BUCKET = [tu-proyecto].appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = [tu-sender-id]
REACT_APP_FIREBASE_APP_ID = [tu-app-id]
REACT_APP_FIREBASE_MEASUREMENT_ID = [tu-measurement-id]
REACT_APP_API_URL = https://tu-proyecto.vercel.app/api
```

**⚠️ IMPORTANTE:** 
- `REACT_APP_API_URL` debe apuntar a tu dominio de Vercel + `/api`
- Ejemplo: `https://mi-diario-abc123.vercel.app/api`

#### 3.2 Variables del Backend

Agrega también:

```
PORT = 3001
FRONTEND_URL = https://tu-proyecto.vercel.app
FIREBASE_DATABASE_URL = https://[tu-proyecto-id].firebaseio.com
```

#### 3.3 Service Account Key (Método Seguro)

**Opción 1: Como Variable de Entorno (Recomendado)**

1. Abre `api/serviceAccountKey.json`
2. Copia TODO el contenido (el JSON completo)
3. En Vercel, agrega:
   ```
   FIREBASE_SERVICE_ACCOUNT = [pega aquí el JSON completo]
   ```

**Opción 2: Base64 Encoded**

```bash
# En tu terminal local
cat api/serviceAccountKey.json | base64

# Copia el output y agrégalo en Vercel como:
FIREBASE_SERVICE_ACCOUNT_BASE64 = [base64-string]
```

---

### Paso 4: Configurar Serverless Functions

#### 4.1 Crear archivo `vercel.json` (ya existe)

Verifica que `/vercel.json` tenga:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "/api"
  }
}
```

#### 4.2 Actualizar `api/index.js` para Vercel

Al final del archivo, asegúrate de tener:

```javascript
// Actualizar la inicialización de Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Exportar para Vercel
module.exports = app;
```

---

### Paso 5: Deploy

#### 5.1 Hacer Deploy

1. En Vercel, haz clic en **"Deploy"**
2. Espera a que termine (2-5 minutos)
3. ✅ ¡Listo! Tu app está en línea

#### 5.2 Probar la Aplicación

1. Vercel te dará una URL: `https://mi-diario-abc123.vercel.app`
2. Abre esa URL en el navegador
3. Prueba login/registro
4. Prueba el panel de admin (crear usuarios)

---

### Paso 6: Configurar Dominio Personalizado (Opcional)

#### 6.1 Agregar Dominio

1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio (ej: `midiario.com`)
3. Sigue las instrucciones de DNS

#### 6.2 Configurar DNS

En tu proveedor de dominio, agrega:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🎯 MÉTODO 2: Deploy con Vercel CLI

### Instalación

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
# Desde la raíz del proyecto
vercel

# Para producción
vercel --prod
```

Sigue las instrucciones en pantalla.

---

## 🔄 CI/CD Automático

Con el método de GitHub:

✅ **Cada push a `main` → Deploy automático a producción**
✅ **Cada push a otras ramas → Deploy de preview**
✅ **Pull Requests → Deploy de preview automático**

**No necesitas hacer nada más** - Vercel se encarga de todo.

---

## 🐛 Troubleshooting

### Error: "Module not found: Can't resolve 'serviceAccountKey.json'"

**Solución:** Usa variables de entorno en lugar del archivo.

Actualiza `api/index.js`:

```javascript
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');
```

### Error: "CORS policy"

**Solución:** Actualiza `FRONTEND_URL` en variables de entorno:

```
FRONTEND_URL = https://tu-proyecto.vercel.app
```

### Error: "Failed to build"

**Solución:** Revisa los logs en Vercel Dashboard → Deployments → [tu deploy] → Build Logs

Errores comunes:
- Falta una dependencia en `package.json`
- Variables de entorno mal configuradas
- Errores de TypeScript/ESLint

### El frontend funciona pero el backend no

**Solución:** Verifica que `REACT_APP_API_URL` apunte a tu dominio de Vercel + `/api`

```
REACT_APP_API_URL = https://mi-diario-abc123.vercel.app/api
```

---

## ✅ Checklist Final

Antes de hacer deploy:

- [ ] Código subido a GitHub
- [ ] `.gitignore` excluye archivos sensibles
- [ ] `vercel.json` configurado
- [ ] Variables de entorno agregadas en Vercel
- [ ] Service Account Key como variable de entorno
- [ ] `REACT_APP_API_URL` apunta al dominio de Vercel
- [ ] Firebase Rules actualizadas para producción
- [ ] App testeada en local

---

## 🎉 ¡Listo para Producción!

Tu app Mi Diario estará disponible en:

```
https://tu-proyecto.vercel.app
```

**Características en producción:**
- ✅ HTTPS automático (SSL gratis)
- ✅ CDN global (carga rápida en todo el mundo)
- ✅ Backend serverless escalable
- ✅ Rollback instantáneo si algo falla
- ✅ Preview deploys para testing
- ✅ Analytics gratis

---

## 📊 Monitoreo

### Analytics de Vercel

Ve a: Dashboard → Analytics

Verás:
- Número de visitantes
- Páginas más visitadas
- Performance (Core Web Vitals)
- Errores

### Logs del Backend

Ve a: Dashboard → Functions → [tu función] → Logs

---

## 🔐 Seguridad en Producción

### 1. Actualizar Firebase Rules

Usa las reglas de producción (`firestore-FINAL.rules`):

```bash
# En Firebase Console
Firestore → Rules → [pega firestore-FINAL.rules] → Publish
```

### 2. Configurar CORS

Ya está configurado en `api/index.js` para aceptar solo tu dominio:

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

### 3. Rate Limiting (Opcional)

Agrega a `api/index.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});

app.use('/api/', limiter);
```

---

## 💰 Costos

**Vercel Free Tier incluye:**
- ✅ 100 GB bandwidth
- ✅ Serverless functions ilimitadas
- ✅ 100 deployments por día
- ✅ SSL gratis
- ✅ Dominios personalizados

**Suficiente para proyectos pequeños y medianos** 🎉

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Consulta la documentación: https://vercel.com/docs
3. Vercel Discord: https://vercel.com/discord

---

**¡Tu aplicación Mi Diario lista para el mundo!** 🌱🚀
