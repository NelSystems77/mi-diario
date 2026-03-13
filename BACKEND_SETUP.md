# 🚀 SETUP RÁPIDO - Backend API

Esta guía te ayuda a configurar el backend en **5 minutos**.

---

## ⚡ PASOS RÁPIDOS

### 1️⃣ Instalar Dependencias (1 min)

```bash
cd api
npm install
```

---

### 2️⃣ Obtener Service Account Key de Firebase (2 min)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Tu Proyecto → **⚙️ Project Settings** → **Service Accounts**
3. Haz clic en **"Generate New Private Key"**
4. Descarga el archivo JSON
5. **Renómbralo a `serviceAccountKey.json`**
6. **Muévelo a la carpeta `/api`**

**Importante:** Este archivo NO debe subirse a Git (ya está en .gitignore)

---

### 3️⃣ Crear Variables de Entorno (30 seg)

Crea el archivo `api/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
FIREBASE_DATABASE_URL=https://tu-proyecto-id.firebaseio.com
```

**Reemplaza `tu-proyecto-id`** con el ID de tu proyecto de Firebase.

---

### 4️⃣ Iniciar Backend (30 seg)

```bash
cd api
npm start
```

Deberías ver:
```
🚀 Backend API running on http://localhost:3001
📚 Firebase Admin SDK initialized
```

---

### 5️⃣ Verificar que Funciona (30 seg)

En otra terminal:

```bash
curl http://localhost:3001/api/health
```

Si ves esto, ¡funciona! ✅
```json
{
  "status": "OK",
  "message": "Mi Diario Backend API"
}
```

---

### 6️⃣ Configurar Frontend (30 seg)

En el archivo `.env` del **frontend** (raíz del proyecto), agrega:

```env
REACT_APP_API_URL=http://localhost:3001
```

---

### 7️⃣ ¡LISTO! Pruébalo

1. Inicia el frontend: `npm start` (en la raíz)
2. Inicia el backend: `npm start` (en /api)
3. Ve al panel Admin en la app
4. Haz clic en "Crear Usuario"
5. ¡Ahora puedes crear usuarios reales! 🎉

---

## ✅ Checklist

- [ ] Backend instalado (`cd api && npm install`)
- [ ] Service Account Key descargado como `serviceAccountKey.json` en `/api`
- [ ] Archivo `api/.env` creado con las variables correctas
- [ ] Backend corriendo (`npm start` en /api)
- [ ] Frontend `.env` tiene `REACT_APP_API_URL=http://localhost:3001`
- [ ] Puedes crear usuarios desde el panel admin

---

## 🐛 Problemas Comunes

### "Cannot find module './serviceAccountKey.json'"

➡️ **Solución:** Descarga el service account key de Firebase y guárdalo como `serviceAccountKey.json` en la carpeta `/api`

### "Missing or insufficient permissions"

➡️ **Solución:** Verifica que tu usuario en Firestore tenga `role: "admin"`

### "CORS policy error"

➡️ **Solución:** Asegúrate de que `FRONTEND_URL` en `api/.env` sea `http://localhost:3000`

### El backend no inicia

➡️ **Solución:** 
```bash
cd api
rm -rf node_modules
npm install
npm start
```

---

## 📖 Documentación Completa

Para más detalles, lee: **`api/README.md`**

---

## 🎯 ¿Qué Puede Hacer el Backend?

Con el backend configurado, el panel admin puede:

✅ **Crear usuarios** con email y contraseña  
✅ **Eliminar usuarios** completamente (Auth + Firestore)  
✅ **Cambiar roles** con un clic (user ↔ therapist ↔ admin)  
✅ **Ver estadísticas** en tiempo real  
✅ **Gestión completa** de usuarios sin limitaciones del frontend  

---

## 🚀 Deploy en Producción

Cuando estés listo para producción, lee:
- **`api/README.md`** - Sección "Deploy en Vercel"

---

**¡Tu backend está listo!** 🌱
