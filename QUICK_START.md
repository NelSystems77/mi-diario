# 🚀 Quick Start Guide - Mi Diario

**¡Bienvenido a Mi Diario!** Esta guía te ayudará a tener la aplicación funcionando en menos de 10 minutos.

## ⚡ Instalación Rápida

### 1. Instalar Dependencias

```bash
cd mi-diario
npm install
```

### 2. Configurar Firebase (5 minutos)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto nuevo
3. Activa:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
4. Copia las credenciales de configuración
5. Crea archivo `.env`:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 3. Iniciar App

```bash
npm start
```

¡Listo! La app estará en `http://localhost:3000`

## 📝 Primera Vez

1. **Regístrate** con cualquier email
2. **Explora** las funciones:
   - Crear entrada de diario
   - Marcar hábitos de autocuidado
   - Ver tu dashboard
   - Cambiar idioma/tema en configuración

## 🔑 Usuario Administrador

Para acceso admin:

1. Regístrate con: `admin@nelsystems.com` / `123456789AiXmDy`
2. En Firestore Console, edita el usuario
3. Cambia `role` a `"admin"`

O usa cualquier email y cambia el rol manualmente en Firestore.

## 📦 Deploy en Vercel (Opcional)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel --prod
```

O conecta tu repositorio de GitHub en [vercel.com](https://vercel.com)

## 📚 Documentación Completa

- **README.md** - Documentación completa
- **FIREBASE_SETUP.md** - Guía detallada de Firebase
- **VERCEL_DEPLOYMENT.md** - Guía de deployment
- **CONTRIBUTING.md** - Guía para contribuir

## ⚙️ Comandos Disponibles

```bash
npm start          # Desarrollo
npm test           # Tests
npm run build      # Build para producción
```

## 🎨 Características Destacadas

✅ PWA - Funciona offline y es instalable  
✅ Multilenguaje - Español, English, Deutsch  
✅ Accesibilidad - WCAG compliance  
✅ Control por voz - Web Speech API  
✅ Modo oscuro - 3 temas disponibles  
✅ Gamificación - Sistema de puntos y niveles  
✅ Gráficas - Visualización de progreso emocional  
✅ Exportar PDF - Reportes para compartir  

## 🆘 Solución Rápida de Problemas

**Error Firebase:**
- Verifica que el archivo `.env` exista en la raíz
- Confirma que las variables empiecen con `REACT_APP_`
- Reinicia el servidor: `Ctrl+C` y `npm start`

**No se ven los estilos:**
- Limpia cache: `npm start` con Ctrl+Shift+R
- Verifica que `src/styles/index.css` exista

**Build falla:**
- Ejecuta `npm install` de nuevo
- Verifica versión de Node: `node --version` (debe ser 16+)

## 💡 Tips

- El sistema SOLO suma puntos (nunca resta)
- Puedes cambiar el idioma en cualquier momento
- El modo oscuro se guarda automáticamente
- Las entradas del diario son privadas y encriptadas
- Los puntos te hacen subir de nivel automáticamente

## 🌱 Niveles de Usuario

- 0-199 puntos: **Semilla** 🌱
- 200-499 puntos: **Brote** 🌿
- 500-999 puntos: **Árbol joven** 🌳
- 1000+ puntos: **Bosque** 🌲

## 📞 Soporte

- Email: admin@nelsystems.com
- Issues: [GitHub](https://github.com/tu-usuario/mi-diario/issues)

---

**¡Disfruta de Mi Diario!** 💚

Tu compañero de bienestar emocional está listo para acompañarte en tu camino hacia el autocuidado.
