# 🔧 SOLUCIÓN: Colección "users" no aparece en Firebase

## 🎯 Problema

Al registrarte en la app, la colección `users` no se crea en Firestore. Esto sucede porque las reglas de seguridad de Firestore están bloqueando la escritura.

## ✅ SOLUCIÓN RÁPIDA (3 pasos)

### Paso 1: Actualizar Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Reglas**
4. **Reemplaza todo** con estas reglas temporales:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // REGLAS TEMPORALES PARA DESARROLLO
    // Permite crear usuarios durante el registro
    
    match /users/{userId} {
      // Permitir crear usuario durante registro
      allow create: if request.auth != null && request.auth.uid == userId;
      // Permitir leer/escribir su propio documento
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /diaryEntries/{entryId} {
      allow read, write: if request.auth != null;
    }
    
    match /selfcare/{checklistId} {
      allow read, write: if request.auth != null;
    }
    
    match /sharedReports/{reportId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Haz clic en **Publicar**

### Paso 2: Usar la Herramienta de Inicialización

He creado un archivo especial para ayudarte: **`init-firebase.html`**

1. Abre el archivo `init-firebase.html` en tu navegador
2. Pega tu configuración de Firebase (la misma del archivo `.env`)
3. Haz clic en "Inicializar Firebase"
4. Haz clic en "Crear Usuario Admin"
5. ¡Listo! Verás un mensaje de éxito

**Alternativa manual:**

También puedes registrarte normalmente en la app (`localhost:3000`), y ahora sí debería crear la colección.

### Paso 3: Verificar en Firebase

1. Ve a Firebase Console → Firestore Database
2. Deberías ver la colección **users** con tu usuario
3. Haz clic en el documento de tu usuario
4. **IMPORTANTE:** Cambia el campo `role` de `"user"` a `"admin"`
5. Guarda los cambios

## 🔍 ¿Por qué pasó esto?

Las reglas de Firestore originales (`firestore.rules`) requieren que un usuario admin ya exista para crear otros usuarios. Es un problema de "huevo y gallina":

- Para crear usuarios, necesitas permisos de admin
- Para ser admin, necesitas existir en la colección users
- Para existir en users, necesitas crearte... pero no tienes permisos

## 📋 Verificación Paso a Paso

Después de seguir los pasos anteriores:

### ✅ Checklist de Verificación:

1. **Firebase Console → Authentication**
   - [ ] Ves tu usuario registrado

2. **Firebase Console → Firestore Database**
   - [ ] Existe la colección `users`
   - [ ] Existe un documento con tu UID
   - [ ] El documento tiene estos campos:
     - `email`: tu email
     - `displayName`: tu nombre
     - `role`: "admin"
     - `points`: 0
     - `level`: "seed"

3. **En la App (localhost:3000)**
   - [ ] Puedes hacer login
   - [ ] Ves el botón "Admin" en la navegación
   - [ ] Puedes acceder a `/admin`

## 🚨 Si aún no funciona

### Problema: "Missing or insufficient permissions"

**Solución:**
1. Verifica que las reglas de Firestore estén publicadas
2. Cierra sesión en la app y vuelve a iniciar sesión
3. Limpia el cache: Ctrl+Shift+R

### Problema: "Email already in use"

**Solución:**
1. Ve a Firebase Console → Authentication
2. Encuentra tu usuario
3. Elimínalo
4. Vuelve a registrarte

### Problema: La colección se crea pero no puedo ser admin

**Solución:**
1. Ve a Firestore Database
2. Encuentra tu documento en `users`
3. Edita el campo `role` manualmente a `"admin"`
4. Guarda
5. Cierra sesión y vuelve a iniciar sesión en la app

## 🔐 Reglas de Producción (Después de crear usuarios)

Una vez que tengas usuarios creados y funcionando, puedes usar reglas más estrictas.

Copia el contenido de `firestore.rules` (el archivo original) a Firebase Console.

## 📞 Ayuda Adicional

Si sigues teniendo problemas:

1. Abre la Consola del Navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Compártelos para ayudarte mejor

## 🎉 Una vez solucionado

Cuando todo funcione:

1. **Inicia sesión** con tu usuario admin
2. **Crea una entrada** en el diario (prueba el sistema)
3. **Marca hábitos** en autocuidado
4. **Ve al dashboard** para ver gráficas
5. **Ve a Admin** para gestionar usuarios

## 📝 Resumen de Archivos Importantes

- `firestore-dev.rules` - Reglas permisivas para desarrollo
- `firestore.rules` - Reglas estrictas para producción
- `init-firebase.html` - Herramienta de inicialización
- `.env` - Tus credenciales de Firebase

---

**¿Todo funcionando?** ¡Excelente! Ahora puedes disfrutar de Mi Diario 🌱
