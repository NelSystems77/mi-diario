# 🔍 CÓMO ENCONTRAR TU PROJECT ID DE FIREBASE

Sigue estos pasos para configurar correctamente tu archivo `.env` del backend.

---

## 📋 PASO 1: Ir a Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto (el que creaste para Mi Diario)

---

## ⚙️ PASO 2: Ir a Project Settings

1. Haz clic en el **ícono de engranaje** ⚙️ (arriba a la izquierda)
2. Selecciona **"Project Settings"**

---

## 🎯 PASO 3: Encontrar el Project ID

En la página de configuración verás:

```
Project name: Mi Diario
Project ID: mi-diario-abc123  ← ESTE ES EL QUE NECESITAS
```

**Ejemplo real:**
- Si tu Project ID es: `mi-diario-abc123`
- Entonces tu DATABASE_URL es: `https://mi-diario-abc123.firebaseio.com`

---

## ✏️ PASO 4: Editar tu archivo .env

Abre el archivo `api/.env` y reemplaza:

```env
# ANTES (ejemplo):
FIREBASE_DATABASE_URL=https://TU-PROJECT-ID.firebaseio.com

# DESPUÉS (con tu Project ID real):
FIREBASE_DATABASE_URL=https://mi-diario-abc123.firebaseio.com
```

---

## 📝 ARCHIVO .env COMPLETO

Tu archivo `api/.env` debería verse así:

```env
# Puerto del servidor
PORT=3001

# URL del frontend
FRONTEND_URL=http://localhost:3000

# Firebase Database URL (REEMPLAZA CON TU PROJECT ID)
FIREBASE_DATABASE_URL=https://mi-diario-abc123.firebaseio.com
```

**⚠️ IMPORTANTE:** Reemplaza `mi-diario-abc123` con TU Project ID real.

---

## ✅ VERIFICAR QUE ESTÁ CORRECTO

Después de configurar el `.env`:

1. **Guarda el archivo**
2. **Reinicia el backend** (si ya estaba corriendo):
   ```bash
   # Detén el servidor (Ctrl+C)
   # Vuelve a iniciarlo
   cd api
   npm start
   ```

3. **Deberías ver**:
   ```
   🚀 Backend API running on http://localhost:3001
   📚 Firebase Admin SDK initialized
   ```

4. **Si ves errores**, probablemente el FIREBASE_DATABASE_URL está mal.

---

## 🐛 PROBLEMAS COMUNES

### Error: "Project ID not found"
➡️ **Solución:** Revisa que el Project ID sea exactamente igual al de Firebase Console (case-sensitive)

### Error: "Invalid project ID"
➡️ **Solución:** Asegúrate de usar el formato correcto:
   ```
   https://TU-PROJECT-ID.firebaseio.com
   ```
   (No olvides `https://` ni `.firebaseio.com`)

### Error: "Permission denied"
➡️ **Solución:** Verifica que el archivo `serviceAccountKey.json` esté en `/api`

---

## 📄 EJEMPLO COMPLETO DE .ENV

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
FIREBASE_DATABASE_URL=https://mi-diario-production.firebaseio.com
```

---

## 🎯 RESUMEN RÁPIDO

1. **Project ID** = Lo encuentras en Firebase Console → Settings
2. **DATABASE_URL** = `https://[PROJECT-ID].firebaseio.com`
3. **Guarda** el archivo `.env` en `/api`
4. **Reinicia** el backend
5. ✅ ¡Listo!

---

**¿Listo?** Una vez configurado, continúa con el resto del setup del backend en `BACKEND_SETUP.md`
