# 🚀 Backend API - Mi Diario

Backend con **Firebase Admin SDK** para gestión completa de usuarios desde el panel de administración.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Deploy en Vercel](#deploy-en-vercel)
- [Seguridad](#seguridad)

---

## ✨ Características

- ✅ **Firebase Admin SDK** - Control total sobre Firebase
- ✅ **Crear usuarios** - Desde el panel admin con email/password
- ✅ **Gestionar roles** - user, therapist, admin
- ✅ **Eliminar usuarios** - De Authentication y Firestore
- ✅ **Estadísticas** - Datos agregados de la aplicación
- ✅ **Autenticación** - Middleware de verificación de admin
- ✅ **CORS** configurado - Para desarrollo y producción
- ✅ **Deploy en Vercel** - Como serverless functions

---

## 📦 Instalación

### 1. Instalar Dependencias

```bash
cd api
npm install
```

---

## ⚙️ Configuración

### 1. Obtener Service Account Key de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️) → **Service Accounts**
4. Haz clic en **Generate New Private Key**
5. Descarga el archivo JSON
6. **Renómbralo a `serviceAccountKey.json`**
7. **Muévelo a la carpeta `/api`**

⚠️ **IMPORTANTE:** Este archivo contiene credenciales sensibles. **NUNCA** lo subas a Git.

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `/api`:

```bash
PORT=3001
FRONTEND_URL=http://localhost:3000
FIREBASE_DATABASE_URL=https://tu-proyecto-id.firebaseio.com
```

Reemplaza `tu-proyecto-id` con tu ID de proyecto de Firebase.

### 3. Actualizar .gitignore

Asegúrate de que `.gitignore` incluya:

```
api/serviceAccountKey.json
api/.env
api/node_modules
```

---

## 🚀 Uso

### Desarrollo Local

```bash
cd api
npm run dev
```

El servidor estará corriendo en `http://localhost:3001`

### Verificar que funciona

```bash
curl http://localhost:3001/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "Mi Diario Backend API",
  "timestamp": "2024-..."
}
```

---

## 📡 API Endpoints

### Autenticación

Todos los endpoints (excepto `/` y `/api/health`) requieren autenticación.

**Header requerido:**
```
Authorization: Bearer <token>
```

El token se obtiene del frontend con:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

---

### 1. Health Check

```
GET /api/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "message": "Mi Diario Backend API",
  "timestamp": "2024-03-12T..."
}
```

---

### 2. Obtener Usuarios

```
GET /api/users
```

**Requiere:** Admin

**Respuesta:**
```json
{
  "users": [
    {
      "id": "abc123",
      "email": "user@example.com",
      "displayName": "Usuario Test",
      "role": "user",
      "points": 150,
      "level": "sprout"
    }
  ]
}
```

---

### 3. Crear Usuario

```
POST /api/users
```

**Requiere:** Admin

**Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "contraseña123",
  "displayName": "Nuevo Usuario",
  "role": "user",
  "expirationDate": "2025-12-31"
}
```

**Respuesta:**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "uid": "xyz789",
    "email": "nuevo@example.com",
    "displayName": "Nuevo Usuario",
    "role": "user"
  }
}
```

**Errores:**
- `400` - Email ya existe / Email inválido / Contraseña muy corta
- `401` - No autenticado
- `403` - No es admin

---

### 4. Actualizar Usuario

```
PUT /api/users/:uid
```

**Requiere:** Admin

**Body:**
```json
{
  "displayName": "Nombre Actualizado",
  "role": "therapist",
  "expirationDate": "2026-01-01"
}
```

---

### 5. Eliminar Usuario

```
DELETE /api/users/:uid
```

**Requiere:** Admin

**Respuesta:**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

### 6. Cambiar Rol

```
PATCH /api/users/:uid/role
```

**Requiere:** Admin

**Body:**
```json
{
  "role": "admin"
}
```

**Roles válidos:** `user`, `therapist`, `admin`

---

### 7. Estadísticas Globales

```
GET /api/stats
```

**Requiere:** Admin

**Respuesta:**
```json
{
  "totalUsers": 42,
  "totalEntries": 328,
  "activeToday": 15,
  "stats": {
    "avgEntriesPerUser": "7.81"
  }
}
```

---

## 🌐 Deploy en Vercel

### Opción 1: Deploy Automático con GitHub

1. Sube tu código a GitHub
2. Conecta tu repo a Vercel
3. Agrega las variables de entorno en Vercel
4. Deploy automático

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Variables de Entorno en Vercel

En el dashboard de Vercel → Settings → Environment Variables:

```
FRONTEND_URL = https://tu-app.vercel.app
FIREBASE_DATABASE_URL = https://tu-proyecto.firebaseio.com
```

### Service Account Key en Vercel

**Método 1 (Recomendado):** Variables de entorno

En Vercel, crea estas variables:

```
FIREBASE_SERVICE_ACCOUNT = (pega el contenido completo del JSON)
```

Luego actualiza `api/index.js`:

```javascript
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');
```

**Método 2:** Incluir en el deploy (menos seguro)

Asegúrate de que `serviceAccountKey.json` esté en el proyecto al hacer deploy.

---

## 🔐 Seguridad

### Middleware de Autenticación

```javascript
const verifyAdmin = async (req, res, next) => {
  // 1. Verifica que haya token
  // 2. Verifica que el token sea válido
  // 3. Verifica que el usuario sea admin
  // 4. Si todo ok, continúa
};
```

### Reglas de Firestore

Las reglas de Firestore deben permitir que el backend (con Admin SDK) lea/escriba:

```javascript
// Admin SDK tiene permisos totales
// No necesita reglas específicas
```

---

## 🧪 Testing

### Test Manual con cURL

**Crear usuario:**

```bash
# Primero obtén el token del frontend
# Luego:

curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User",
    "role": "user"
  }'
```

**Obtener usuarios:**

```bash
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module './serviceAccountKey.json'"

**Solución:** Descarga el service account key de Firebase y guárdalo como `serviceAccountKey.json` en `/api`

### Error: "EACCES: permission denied"

**Solución:**
```bash
sudo chown -R $USER:$USER api/
```

### Error: "CORS policy"

**Solución:** Actualiza `FRONTEND_URL` en `.env` para que coincida con tu URL del frontend

### Error: "Invalid token"

**Solución:** El token expiró. Obtén uno nuevo desde el frontend

---

## 📁 Estructura

```
api/
├── index.js                      # Servidor Express principal
├── package.json                  # Dependencias
├── .env                          # Variables de entorno (no subir a Git)
├── .env.example                  # Template de variables
├── serviceAccountKey.json        # Firebase Admin (no subir a Git)
└── serviceAccountKey.example.json # Template
```

---

## 🔄 Actualizar Frontend

El frontend ya está configurado para usar el backend. Solo necesitas:

1. Asegúrate de que el backend esté corriendo
2. Actualiza `REACT_APP_API_URL` en el `.env` del frontend:

```env
REACT_APP_API_URL=http://localhost:3001
```

Para producción:
```env
REACT_APP_API_URL=https://tu-api.vercel.app
```

---

## ✅ Checklist de Configuración

- [ ] Backend instalado (`npm install` en /api)
- [ ] Service Account Key descargado y renombrado
- [ ] Archivo `.env` creado con las variables correctas
- [ ] Backend corriendo (`npm run dev`)
- [ ] Health check funciona (`/api/health`)
- [ ] Frontend configurado con `REACT_APP_API_URL`
- [ ] Puedes crear usuarios desde el panel admin
- [ ] Puedes eliminar usuarios
- [ ] Puedes cambiar roles

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del servidor
2. Verifica que el service account key sea válido
3. Confirma que tu usuario sea admin en Firestore
4. Revisa la consola del navegador (F12)

---

## 🎉 ¡Listo!

Ahora tienes un backend completamente funcional con Firebase Admin SDK. El panel de administración puede:

- ✅ Crear usuarios con email/password
- ✅ Eliminar usuarios completamente
- ✅ Cambiar roles fácilmente
- ✅ Ver estadísticas en tiempo real

**Mi Diario - Backend API** 🌱
