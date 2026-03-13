# ⚡ CONFIGURACIÓN RÁPIDA PARA SUBRUTA

## 🎯 Si tu app debe estar en `/mi-diario` o `/paqueteria`

Sigue estos pasos para configurar la app para una subruta específica.

---

## 📋 OPCIÓN 1: Deploy en `/mi-diario`

### Paso 1: Actualizar package.json

Reemplaza `package.json` con `package.SUBRUTA.json`:

```bash
cp package.SUBRUTA.json package.json
```

O edita manualmente y agrega después de la línea 3:

```json
"homepage": "/mi-diario",
```

### Paso 2: Actualizar manifest.json

Reemplaza `public/manifest.json` con `public/manifest.SUBRUTA.json`:

```bash
cp public/manifest.SUBRUTA.json public/manifest.json
```

### Paso 3: Actualizar App.js

Edita `src/App.js`, línea ~60:

**Antes:**
```javascript
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

**Después:**
```javascript
<Router basename="/mi-diario" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

### Paso 4: Rebuild y Deploy

```bash
npm run build
# Luego despliega la carpeta build/
```

---

## 📋 OPCIÓN 2: Deploy en `/paqueteria` (u otra ruta)

Sigue los mismos pasos pero reemplaza `/mi-diario` con tu ruta:

### Paso 1: package.json
```json
"homepage": "/paqueteria",
```

### Paso 2: manifest.json
```json
"start_url": "/paqueteria/",
"scope": "/paqueteria/",
"icons": [
  {
    "src": "/paqueteria/logo512.png",
    ...
  }
]
```

### Paso 3: App.js
```javascript
<Router basename="/paqueteria" future={{ ... }}>
```

---

## 📋 OPCIÓN 3: Volver a Raíz `/`

Si quieres que esté en la raíz del dominio:

### Paso 1: package.json

**ELIMINA** la línea `"homepage"` si existe.

### Paso 2: manifest.json

Usa el manifest.json original:
```json
"start_url": "/",
"scope": "/",
"icons": [
  {
    "src": "/logo512.png",
    ...
  }
]
```

### Paso 3: App.js

**ELIMINA** el `basename`:

```javascript
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

---

## ✅ VERIFICACIÓN

Después de hacer los cambios:

1. **Rebuild:**
   ```bash
   npm run build
   ```

2. **Verifica rutas en build/index.html:**
   ```html
   <!-- Deberías ver: -->
   <link href="/mi-diario/static/css/main.xyz.css" rel="stylesheet">
   <script src="/mi-diario/static/js/main.xyz.js"></script>
   ```

3. **Deploy y prueba:**
   - Abre `https://tudominio.com/mi-diario/`
   - Los iconos deberían aparecer
   - Firebase debería conectar

---

## 🔄 RESUMEN VISUAL

```
RAÍZ (/)                    SUBRUTA (/mi-diario)
====================        ====================

package.json:               package.json:
(sin homepage)              "homepage": "/mi-diario"

manifest.json:              manifest.json:
"src": "/logo.png"         "src": "/mi-diario/logo.png"
"start_url": "/"           "start_url": "/mi-diario/"

App.js:                     App.js:
<Router>                    <Router basename="/mi-diario">

URL final:                  URL final:
tudominio.com/              tudominio.com/mi-diario/
```

---

## 🚨 IMPORTANTE

**Después de cambiar a subruta:**

1. ✅ Rebuild completo
2. ✅ Limpiar cache del navegador
3. ✅ Desregistrar service worker viejo
4. ✅ Probar en modo incógnito

**En móvil:**
- Borrar cache y datos de navegación
- Desinstalar PWA si estaba instalada
- Volver a instalar

---

## 💡 RECOMENDACIÓN

**Para evitar problemas:**

- Deploy en raíz (`/`) es más simple
- Si DEBES usar subruta, usa Vercel (maneja automáticamente)
- Evita cambiar de ruta después del deploy inicial

---

**Elige tu configuración y sigue los pasos correspondientes** 🎯
