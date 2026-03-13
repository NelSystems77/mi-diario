# Guía de Contribución

¡Gracias por tu interés en contribuir a Mi Diario! Este documento te guiará a través del proceso.

## Código de Conducta

Este proyecto sigue un código de conducta profesional y respetuoso. Se espera que todos los contribuyentes:

- Sean respetuosos y considerados
- Eviten lenguaje ofensivo o discriminatorio
- Acepten críticas constructivas
- Se enfoquen en lo que es mejor para la comunidad

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. Verifica que no esté ya reportado en [Issues](https://github.com/tu-usuario/mi-diario/issues)
2. Crea un nuevo issue con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Navegador y versión
   - Código relevante

Plantilla de bug report:

```markdown
**Descripción del Bug**
Una descripción clara del problema.

**Pasos para Reproducir**
1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Lo que debería pasar.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno**
- Navegador: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Versión: [e.g. 1.0.0]
```

### Sugerir Features

Para proponer nuevas características:

1. Verifica que no exista ya en [Issues](https://github.com/tu-usuario/mi-diario/issues)
2. Crea un issue con:
   - Título claro
   - Descripción detallada
   - Justificación (por qué es útil)
   - Ejemplos de uso
   - Mockups o wireframes (opcional)

### Pull Requests

#### Proceso

1. **Fork el repositorio**

```bash
# Fork en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/mi-diario.git
cd mi-diario
```

2. **Crea una rama**

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/nombre-del-bug
```

Nomenclatura de ramas:
- `feature/` - Nuevas características
- `fix/` - Correcciones de bugs
- `docs/` - Cambios en documentación
- `style/` - Cambios de estilo (no afectan funcionalidad)
- `refactor/` - Refactoring de código
- `test/` - Agregar o modificar tests

3. **Instala dependencias**

```bash
npm install
```

4. **Haz tus cambios**

- Sigue las guías de estilo del proyecto
- Comenta código complejo
- Actualiza documentación si es necesario
- Agrega tests si aplica

5. **Prueba tus cambios**

```bash
npm start
npm test
npm run build
```

6. **Commit**

Usa mensajes de commit descriptivos:

```bash
git add .
git commit -m "feat: agregar funcionalidad X"
# o
git commit -m "fix: corregir bug en componente Y"
```

Convención de commits:
- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato
- `refactor:` - Refactoring de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

7. **Push**

```bash
git push origin feature/nombre-descriptivo
```

8. **Crea Pull Request**

- Ve a tu fork en GitHub
- Haz clic en "Compare & pull request"
- Describe tus cambios detalladamente
- Referencia issues relacionados

Plantilla de PR:

```markdown
## Descripción
Descripción clara de los cambios.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] He probado mi código
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests (si aplica)

## Screenshots
Si aplica, agrega screenshots.

## Issues Relacionados
Fixes #123
```

## Guías de Estilo

### JavaScript/React

- Usa ES6+ features
- Componentes funcionales con hooks
- PropTypes o TypeScript para type checking
- Destructuring cuando sea apropiado
- Arrow functions para callbacks
- Const/let en lugar de var

Ejemplo:

```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = ({ title, onSave }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    // Lógica
  };

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {/* Contenido */}
    </div>
  );
};

export default MyComponent;
```

### CSS

- Usa CSS Modules o archivos .css específicos por componente
- Sigue la convención BEM cuando sea apropiado
- Usa variables CSS para temas
- Mobile-first approach

```css
.my-component {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.my-component__title {
  font-size: 1.5rem;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .my-component {
    padding: var(--spacing-sm);
  }
}
```

### Estructura de Archivos

```
src/
├── components/
│   └── MyComponent/
│       ├── MyComponent.js
│       ├── MyComponent.css
│       └── index.js
├── pages/
│   └── MyPage.js
├── contexts/
│   └── MyContext.js
└── utils/
    └── helpers.js
```

### Accesibilidad

- Usa semantic HTML
- Agrega labels a todos los inputs
- Incluye alt text en imágenes
- Asegura contraste de colores adecuado
- Prueba con keyboard navigation
- Usa aria-labels cuando sea necesario

```jsx
<button
  className="btn"
  onClick={handleClick}
  aria-label="Guardar cambios"
>
  <Save size={20} />
  <span>Guardar</span>
</button>
```

### Internacionalización

- Usa `useTranslation()` hook
- Agrega traducciones a los 3 idiomas
- No hardcodees texto

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('common.welcome')}</h1>;
};
```

## Testing

Agrega tests para nuevas características:

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component correctly', () => {
  render(<MyComponent />);
  const element = screen.getByText(/Hello/i);
  expect(element).toBeInTheDocument();
});
```

## Documentación

- Documenta funciones complejas
- Actualiza README si cambias funcionalidad
- Agrega comentarios JSDoc para funciones públicas

```javascript
/**
 * Calcula el nivel del usuario basado en puntos
 * @param {number} points - Puntos acumulados del usuario
 * @returns {string} Nivel del usuario ('seed', 'sprout', etc.)
 */
const calculateLevel = (points) => {
  if (points >= 1000) return 'forest';
  if (points >= 500) return 'youngTree';
  if (points >= 200) return 'sprout';
  return 'seed';
};
```

## Review Process

1. Tu PR será revisado por los maintainers
2. Puede haber comentarios o solicitudes de cambios
3. Realiza los cambios solicitados
4. Una vez aprobado, se hará merge

## Reconocimientos

Todos los contribuyentes serán agregados al README en la sección de agradecimientos.

## Preguntas

Si tienes preguntas, puedes:
- Abrir un issue de discusión
- Contactar a admin@nelsystems.com
- Participar en las discusiones del proyecto

## Recursos

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Git Best Practices](https://www.conventionalcommits.org/)

¡Gracias por contribuir a Mi Diario! 🌱
