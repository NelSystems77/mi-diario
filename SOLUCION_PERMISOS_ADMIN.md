# 🔧 SOLUCIÓN: Error de Permisos en Panel Admin

## ❌ Error que estás viendo:

```
Error fetching users: FirebaseError: Missing or insufficient permissions.
Error creating user: FirebaseError: Missing or insufficient permissions.
```

## ✅ SOLUCIÓN (3 PASOS):

### PASO 1: Actualizar Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Reglas**
4. **REEMPLAZA TODO** con este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isTherapistOrAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['therapist', 'admin'];
    }
    
    // Users collection
    match /users/{userId} {
      // Permitir crear usuario durante el registro inicial
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can read and write their own data
      allow read, write: if isOwner(userId);
      
      // ADMINS pueden leer TODOS los usuarios
      allow read: if isAdmin();
      
      // ADMINS pueden crear y eliminar usuarios
      allow create, delete: if isAdmin();
      
      // ADMINS pueden actualizar usuarios
      allow update: if isAdmin();
    }
    
    // Diary entries
    match /diaryEntries/{entryId} {
      // Permitir crear entrada
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      
      // Users can only access their own entries
      allow read, write: if isAuthenticated() && 
                            resource.data.userId == request.auth.uid;
      
      // Admins can read all entries (for statistics)
      allow read: if isAdmin();
    }
    
    // Self-care checklist
    match /selfcare/{checklistId} {
      // Permitir crear checklist
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      
      // Users can only access their own checklists
      allow read, write: if isAuthenticated() && 
                            resource.data.userId == request.auth.uid;
      
      // Admins can read for statistics
      allow read: if isAdmin();
    }
    
    // Shared reports
    match /sharedReports/{reportId} {
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid;
      allow read: if isTherapistOrAdmin() && 
                    resource.data.therapistId == request.auth.uid;
      allow read: if isAdmin();
    }
  }
}
```

5. Haz clic en **Publicar**
6. Espera el mensaje "Las reglas se publicaron correctamente"

### PASO 2: Verificar que seas Admin

1. En Firebase Console, ve a **Firestore Database**
2. Abre la colección **users**
3. Encuentra TU documento de usuario (busca tu email)
4. Verifica que el campo `role` sea **`"admin"`** (no `"user"`)
5. Si NO es admin:
   - Haz clic en el documento
   - Edita el campo `role`
   - Cambia a `"admin"`
   - Guarda

### PASO 3: Cerrar Sesión y Volver a Entrar

1. En la app (`localhost:3000`), **cierra sesión**
2. **Vuelve a iniciar sesión**
3. Ve al panel **Admin**
4. Ahora deberías ver los usuarios y poder crear nuevos

---

## 🔍 VERIFICACIÓN COMPLETA

### En Firebase Console - Firestore:

```
users/
  └── [tu-uid]/
      ├── email: "admin@nelsystems.com"
      ├── displayName: "Administrador"
      ├── role: "admin"  ← DEBE SER "admin"
      ├── points: 0
      └── level: "seed"
```

### En la App:

- ✅ Menú lateral muestra "Admin"
- ✅ Puedes acceder a `/admin`
- ✅ Ves la lista de usuarios
- ✅ Ves estadísticas (Total Usuarios, etc.)
- ✅ Puedes crear usuarios

---

## 🎯 IMPORTANTE: Cómo Crear Usuarios

**Nota:** El panel admin crea un "placeholder" para el usuario. El usuario DEBE:

1. Ir a la app (`localhost:3000`)
2. Hacer clic en **Registrarse**
3. Usar el mismo email que pusiste en el admin
4. Completar el registro

**Alternativa (más fácil):**

Simplemente dile a los usuarios que se registren normalmente en la app, y luego TÚ cambias su rol en Firestore de `"user"` a `"therapist"` si es necesario.

---

## 🐛 Si SIGUE sin funcionar:

### 1. Verifica la Consola del Navegador (F12)

```javascript
// Busca este error específico:
"Missing or insufficient permissions"
```

### 2. Verifica el UID del Usuario

En la consola del navegador, ejecuta:

```javascript
console.log(firebase.auth().currentUser.uid);
```

Luego verifica en Firestore que ESE UID tenga `role: "admin"`

### 3. Limpia Cache y Recarga

```bash
# En el navegador:
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### 4. Verifica las Reglas en Firebase

En Firebase Console → Firestore → Reglas, asegúrate que se vean así:

```javascript
function isAdmin() {
  return isAuthenticated() && 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

La parte clave es `exists(...)` y `get(...).data.role == 'admin'`

---

## 📞 Última Opción: Reglas Súper Permisivas (Solo para Desarrollo)

Si nada funciona, usa estas reglas TEMPORALES:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **ADVERTENCIA:** Estas reglas son MUY inseguras. Solo úsalas para probar, y luego vuelve a las reglas correctas.

---

## ✅ RESUMEN DE LA SOLUCIÓN:

1. **Actualiza las reglas de Firestore** (usa `firestore-FINAL.rules`)
2. **Verifica que tu usuario sea admin** en Firestore
3. **Cierra sesión y vuelve a entrar** en la app
4. **Prueba crear un usuario** en el panel admin

¡Después de estos pasos, debería funcionar perfectamente! 🎉
