# MI DIARIO

**Progressive Web App para bienestar emocional y autocuidado**

Una aplicación completa de diario emocional diseñada para ayudar a las personas a registrar emociones, desarrollar hábitos positivos y monitorear su progreso personal, con el objetivo de reforzar la salud mental de forma positiva.

![Mi Diario](public/logo512.png)

## 🌟 Características Principales

### 📔 Diario Emocional
- Semáforo emocional (Verde/Amarillo/Rojo)
- Registro de intensidad emocional (escala 1-10)
- Selección de emociones del día
- Espacio para reflexión libre
- Replanteamiento positivo de pensamientos
- Registro de impulsos difíciles (opcional)

### 💚 Sistema de Autocuidado
- Checklist de hábitos saludables diarios
- Sistema gamificado de puntos
- Solo suma puntos (nunca resta)
- Niveles de progreso: Semilla 🌱 → Brote 🌿 → Árbol joven 🌳 → Bosque 🌲

### 📊 Dashboard de Progreso
- Gráficas emocionales (Chart.js)
- Visualización de hábitos completados
- Seguimiento de puntos acumulados
- Calendario emocional
- Exportación de reportes en PDF

### 📖 Integración Bíblica
- Acceso offline a versículos
- Búsqueda de pasajes
- Frases diarias (motivacionales o bíblicas)
- Preparado para API externa futura

### ♿ Accesibilidad (WCAG)
- Modo claro/oscuro/alto contraste
- Soporte para lectores de pantalla
- Textos escalables (4 tamaños)
- Control por voz (Web Speech API)
- Dictado de entradas
- Lectura de textos en voz alta

### 🌍 Multilenguaje
- Español 🇪🇸
- English 🇺🇸
- Deutsch 🇩🇪

### 👥 Sistema de Roles
- **Usuario**: Acceso completo a funciones personales
- **Terapeuta**: Visualización de reportes compartidos
- **Administrador**: Gestión de usuarios y estadísticas globales
  - Usuario admin predefinido: `admin@nelsystems.com` / `123456789AiXmDy`

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Framework principal
- **React Router** - Navegación
- **i18next** - Internacionalización
- **Framer Motion** - Animaciones
- **Chart.js** - Gráficas
- **jsPDF + html2canvas** - Exportación PDF

### Backend & Base de Datos
- **Firebase**
  - Authentication (autenticación de usuarios)
  - Firestore (base de datos NoSQL)
  - Storage (almacenamiento de archivos)

### PWA
- Service Worker (funcionamiento offline)
- Web Manifest (instalabilidad)
- Soporte para Android e iOS

### APIs Web
- **Web Speech API** (voz)
- **Geolocation API** (ubicación)
- **Notification API** (notificaciones)

## 📦 Instalación

### Prerequisitos
- Node.js 16+ y npm
- Cuenta de Firebase
- Cuenta de Vercel (para deployment)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/mi-diario.git
cd mi-diario
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa Authentication (Email/Password)
4. Crea una base de datos Firestore
5. Activa Storage

#### Obtener Credenciales

En la configuración del proyecto de Firebase, copia las credenciales:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id",
  measurementId: "tu-measurement-id"
};
```

#### Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

### 4. Configurar Reglas de Firestore

En la consola de Firebase, ve a Firestore Database → Rules y agrega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Diary entries
    match /diaryEntries/{entryId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Self-care checklist
    match /selfcare/{checklistId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Crear Usuario Administrador

Después de iniciar la aplicación, crea un usuario con el email `admin@nelsystems.com` y manualmente actualiza su rol en Firestore:

```javascript
// En Firestore Console
users / [uid-del-admin] / role: "admin"
```

## 🚀 Desarrollo Local

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Construcción para Producción

```bash
npm run build
```

Esto creará una carpeta `build/` con los archivos optimizados.

## 🌐 Deployment en Vercel

### Opción 1: Deploy desde GitHub

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de entorno de Firebase
5. Deploy

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Configurar Variables de Entorno en Vercel

En el dashboard de Vercel:
1. Ve a Settings → Environment Variables
2. Agrega todas las variables `REACT_APP_FIREBASE_*`
3. Redeploy

## 📁 Estructura del Proyecto

```
mi-diario/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   └── logo512.png
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.js
│   │   │   ├── Navigation.css
│   │   │   └── PrivateRoute.js
│   │   ├── diary/
│   │   ├── selfcare/
│   │   └── dashboard/
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Diary.js
│   │   ├── SelfCare.js
│   │   ├── Dashboard.js
│   │   ├── Bible.js
│   │   ├── Settings.js
│   │   └── Admin.js
│   ├── services/
│   │   └── firebase.js
│   ├── i18n/
│   │   ├── index.js
│   │   └── locales/
│   │       ├── es.json
│   │       ├── en.json
│   │       └── de.json
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   ├── App.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Diseño y Estética

### Paleta de Colores
- Verde suave: `#7BC2A8`
- Azul calmante: `#6BB6D6`
- Lavanda: `#B8A7D4`
- Beige cálido: `#E8D5C4`
- Blanco: `#FEFEFE`

### Tipografía
- Display: Playfair Display (elegante, serif)
- Body: Inter (legible, sans-serif)
- Handwriting: Caveat (para diario)

### Principios de Diseño
- Animaciones suaves y calmantes
- Espaciado generoso
- Componentes redondeados
- Gradientes sutiles
- Shadows suaves

## 🔒 Seguridad

- Autenticación Firebase
- Reglas de seguridad Firestore
- Protección de rutas
- Variables de entorno
- Validación de roles

## 🧪 Testing

```bash
npm test
```

## 📊 Sistema de Puntos

| Acción | Puntos |
|--------|--------|
| Tender cama | +5 |
| Bañarse | +5 |
| Cepillarse dientes | +5 |
| Comer bien | +5 |
| Dormir suficiente | +5 |
| Salir un rato | +5 |
| Hablar con alguien | +5 |
| Escuchar música | +5 |
| Escribir en diario | +5 |

### Niveles

| Nivel | Puntos Requeridos |
|-------|-------------------|
| 🌱 Semilla | 0-199 |
| 🌿 Brote | 200-499 |
| 🌳 Árbol joven | 500-999 |
| 🌲 Bosque | 1000+ |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**NelSystems**
- Email: admin@nelsystems.com

## 🙏 Agradecimientos

- Comunidad de React
- Firebase
- Chart.js
- Vercel
- Todos los colaboradores

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Screenshots (si aplica)
- Navegador y versión

## 🔮 Roadmap

### Versión 2.0
- [ ] Integración con API de Biblia externa
- [ ] Agente IA de apoyo emocional
- [ ] Exportación a múltiples formatos
- [ ] Compartir reportes con terapeuta
- [ ] Modo colaborativo
- [ ] Notificaciones push
- [ ] Sincronización multi-dispositivo
- [ ] Backup automático

### Versión 3.0
- [ ] Aplicación móvil nativa (React Native)
- [ ] Widget de escritorio
- [ ] Integración con wearables
- [ ] Análisis predictivo de patrones emocionales
- [ ] Comunidad de soporte
- [ ] Recursos educativos

## 📞 Soporte

Para soporte técnico, contacta:
- Email: admin@nelsystems.com
- GitHub Issues: [Mi Diario Issues](https://github.com/tu-usuario/mi-diario/issues)

---

**Mi Diario** - Tu compañero de bienestar emocional 🌱
