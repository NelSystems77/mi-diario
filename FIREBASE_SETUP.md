# Configuración de Firebase

Este documento te guía paso a paso para configurar Firebase en tu proyecto Mi Diario.

## 1. Crear Proyecto de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto: "Mi Diario" (o como prefieras)
4. Acepta los términos y condiciones
5. Habilita Google Analytics (opcional)
6. Haz clic en "Crear proyecto"

## 2. Configurar Authentication

1. En el panel izquierdo, ve a **Compilación** → **Authentication**
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita:
   - **Correo electrónico/Contraseña** (actívalo)
4. Guarda los cambios

## 3. Crear Base de Datos Firestore

1. En el panel izquierdo, ve a **Compilación** → **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona modo de inicio: **Modo de prueba** (por ahora)
4. Selecciona ubicación: elige la más cercana a tus usuarios
5. Haz clic en "Habilitar"

### Aplicar Reglas de Seguridad

1. Ve a la pestaña "Reglas"
2. Copia y pega el contenido del archivo `firestore.rules` del proyecto
3. Haz clic en "Publicar"

## 4. Configurar Storage

1. En el panel izquierdo, ve a **Compilación** → **Storage**
2. Haz clic en "Comenzar"
3. Acepta las reglas predeterminadas
4. Selecciona la misma ubicación que Firestore
5. Haz clic en "Listo"

### Reglas de Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 5. Obtener Credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Desplázate hasta "Tus apps"
3. Haz clic en el ícono web `</>`
4. Registra la app: "Mi Diario Web"
5. **NO** marques "Configure Firebase Hosting"
6. Copia el objeto de configuración:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

## 6. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123
```

## 7. Crear Usuario Administrador

### Opción 1: Desde la aplicación

1. Inicia la aplicación: `npm start`
2. Regístrate con email: `admin@nelsystems.com`
3. Contraseña: `123456789AiXmDy`

### Opción 2: Desde Firebase Console

1. Ve a **Authentication** → **Users**
2. Haz clic en "Agregar usuario"
3. Email: `admin@nelsystems.com`
4. Contraseña: `123456789AiXmDy`
5. Haz clic en "Agregar usuario"

### Asignar rol de administrador

1. Ve a **Firestore Database**
2. Encuentra el documento del usuario creado en la colección `users`
3. Edita el documento
4. Agrega/edita el campo `role` con valor `"admin"`
5. Guarda

## 8. Estructura de Datos Recomendada

### Colección: `users`
```javascript
{
  email: string,
  displayName: string,
  role: 'user' | 'therapist' | 'admin',
  points: number,
  level: 'seed' | 'sprout' | 'youngTree' | 'forest',
  createdAt: timestamp,
  language: 'es' | 'en' | 'de',
  quotePreference: 'motivational' | 'biblical',
  expirationDate: timestamp (optional)
}
```

### Colección: `diaryEntries`
```javascript
{
  userId: string,
  date: timestamp,
  trafficLight: 'green' | 'yellow' | 'red',
  intensity: number (1-10),
  emotions: array[string],
  whatHappened: string,
  thought: string,
  kinderView: string,
  difficultImpulses: string
}
```

### Colección: `selfcare`
```javascript
{
  userId: string,
  date: string (YYYY-MM-DD),
  items: {
    makeBed: boolean,
    shower: boolean,
    brushTeeth: boolean,
    eatWell: boolean,
    sleepEnough: boolean,
    goOutside: boolean,
    talkToSomeone: boolean,
    listenMusic: boolean,
    writeDiary: boolean
  },
  points: number
}
```

## 9. Índices de Firestore

Para mejorar el rendimiento, crea estos índices:

1. **diaryEntries**
   - Campos: `userId` (Ascending), `date` (Descending)

2. **selfcare**
   - Campos: `userId` (Ascending), `date` (Descending)

Firebase te pedirá crear estos índices automáticamente cuando ejecutes las queries.

## 10. Verificar Configuración

Ejecuta el proyecto:

```bash
npm start
```

Prueba:
1. Registro de usuario
2. Login
3. Crear entrada de diario
4. Marcar hábitos de autocuidado
5. Ver dashboard

Si todo funciona correctamente, ¡tu configuración de Firebase está lista!

## Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de Firestore estén publicadas
- Asegúrate de que el usuario esté autenticado

### Error: "Firebase App named '[DEFAULT]' already exists"
- Ya existe una instancia de Firebase
- Revisa que no estés importando Firebase en múltiples lugares

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Consola de Firebase](https://console.firebase.google.com/)
- [Firebase en React](https://firebase.google.com/docs/web/setup)
