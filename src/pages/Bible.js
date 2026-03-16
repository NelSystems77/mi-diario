
aca esta el formato de la biblia   {"metadata":{"name":"Reina-Valera 1909 w\/Strong's","shortname":"RV1909 S","module":"rv_1909_strongs","year":"1909","publisher":null,"owner":null,"description":"\r\n<h2 align=\"center\"><b>Biblia Reina-Valera 1909<br>con n\u00fameros de Strong<\/b><\/h2>\r\n<p align=\"center\"><b>2017 Edition<\/b><\/p>\r\n\r\n<p align=\"center\">La Santa Biblia<br>\r\nAntiguo y Nuevo Testamento<\/p>\r\n<p align=\"center\">\r\nAntigua versi\u00f3n de Casiodoro de Reina (1569), revisada por Cipriano de Valera (1602)<br>\r\ny cotejada posteriormente con diversas traducciones, y con los textos hebreo y griego.<\/p>\r\n<p align=\"center\">\r\nSociedad B\u00edblica Americana<br>\r\nSociedad B\u00edblica Brit\u00e1nica y Extranjera<\/p>\r\n<p align=\"center\">\r\nThe text of Reina-Valera 1909 is in the public domain.<br> \r\nStrong's numbers tagging developed by Rub\u00e9n G\u00f3mez.<\/p>\r\n<p align=\"center\">\r\nPeriodic updates will be made to the Strong's numbers tagging. Please report any typos to the editor: rubeng@infotelecom.es<\/p><br \/><br \/>This Bible imported from Bible Analyzer <a href='http:\/\/www.bibleanalyzer.com\/download.htm'>http:\/\/www.bibleanalyzer.com\/download.htm<\/a>","lang":"","lang_short":"es","copyright":0,"copyright_statement":"This Bible is in the Public Domain.","url":null,"citation_limit":0,"restrict":0,"italics":0,"strongs":0,"red_letter":0,"paragraph":0,"official":1,"research":0,"module_version":"5.6.21"},"verses":[{"book_name":"G\u00e9nesis","book":1,"chapter":1,"verse":1,"text":"EN el principio{H7225} cri\u00f3{H1254} Dios{H430} los cielos{H8064} y la tierra{H776}."},{"book_name":"G\u00e9nesis","book":1,"chapter":1,"verse":2,"text":"Y la tierra{H776} estaba{H1961} desordenada{H8414} y vac\u00eda{H922}, y las tinieblas{H2822} estaban sobre{H5921} la haz{H6440} del abismo{H8415}, y el Esp\u00edritu{H7307} de Dios{H430} se mov\u00eda{H7363} sobre{H5921} la haz{H6440} de las aguas{H4325}."},{"book_name":"G\u00e9nesis","book":1,"chapter":1,"verse":3,"text":"Y dijo{H559} Dios{H430}: Sea{H1961} la luz{H216}: y fu\u00e9{H1961} la luz{H216}."},{"book_name":"G

Mostrar más
7:26 p. m.

Reconoció formato de biblia JSON y aguardó instrucciones específicas
Reconoció formato de biblia JSON y aguardó instrucciones específicas
Entiendo, veo el formato JSON de la Biblia Reina-Valera 1909 con números de Strong. La estructura es clara:

Metadata:

Información general de la versión (nombre, año, editor, etc.)
Verses:

book_name: Nombre del libro (ej: "Génesis")
book: Número del libro (1-66)
chapter: Número del capítulo
verse: Número del versículo
text: Texto con referencias Strong entre llaves (ej: {H7225} para hebreo, {G####} para griego)
¿Qué te gustaría hacer con este formato? Por ejemplo, podría ayudarte a:

Crear una aplicación web para visualizar/buscar versículos
Convertir este formato a otro (Excel, PDF, Word, etc.)
Crear un lector bíblico interactivo
Extraer o filtrar versículos específicos
Generar documentos formateados con versículos
Crear herramientas de estudio bíblico
¿Qué necesitas específicamente?

continuamos trabajando en Mi diario lo olvidaste?

7:27 p. m.

Reconoció limitaciones de memoria y planificó verificar archivos disponibles
Reconoció limitaciones de memoria y planificó verificar archivos disponibles
Disculpa, no tengo acceso a nuestras conversaciones anteriores - cada sesión comienza sin memoria de chats previos. Déjame revisar si hay archivos de "Mi diario" en tu espacio de trabajo:


Excavated missing context and sought user clarification
Excavated missing context and sought user clarification
No encuentro archivos guardados del proyecto. ¿Podrías ayudarme a retomar?

¿Qué era "Mi diario"? Por ejemplo:

¿Una aplicación web para escribir entradas diarias?
¿Un sistema con la Biblia integrada?
¿Algo con almacenamiento persistente?
¿Tenías un archivo HTML/React que creamos antes?
Si me das un poco de contexto o me compartes el último archivo que teníamos, puedo continuar exactamente donde lo dejamos.


¡Perfecto! Si ya tienes el JSON de la Biblia completa, es mucho mejor integrarlo. Te guío paso a paso: 📋 PASO 1: Preparar la Estructura Crear Carpeta para Data En tu proyecto local, crea esta estructura: mi-diario/ ├── public/ │ └── data/ │ └── biblia.json ← Aquí va tu JSON ├── src/ │ └

pasted

7:29 p. m.

Unable to provide summary - no user prompt detected
Unable to provide summary - no user prompt detected
¡Ah claro! Retomamos "Mi diario" con la integración de la Biblia. Ahora que veo el formato exacto de tu JSON (Reina-Valera 1909 con números de Strong), voy a crear el componente Bible.js adaptado específicamente a esa estructura.

El formato que tienes es un array plano de versículos, lo cual es perfecto. Voy a crear el código optimizado:


The user prompt is empty, so I cannot determine the primary language. However, based on the thinking block being in Spanish, I'll provide the summary in Spanish: Preparó instrucciones claras para integrar archivo
The user prompt is empty, so I cannot determine the primary language. However, based on the thinking block being in Spanish, I'll provide the summary in Spanish: Preparó instrucciones claras para integrar archivo
¡Perfecto! He creado el componente Bible.js optimizado específicamente para tu formato JSON (Reina-Valera 1909 con números de Strong).

🎯 Características del Componente:
✅ Carga completa del JSON desde /public/data/biblia.json
✅ Organización inteligente - convierte el array plano en estructura libro/capítulo
✅ Navegación por libros y capítulos con selectores
✅ Búsqueda global en toda la Biblia (hasta 50 resultados)
✅ Números de Strong - toggle para mostrar/ocultar {H7225} como superíndices
✅ Click en resultados - va directo al versículo
✅ Diseño responsivo y elegante
✅ Manejo de errores con mensajes claros

📋 Pasos para Integrar:
PASO 1: Colocar el JSON
bash
# En tu proyecto mi-diario/
mkdir -p public/data
# Copia tu biblia.json (el que me mostraste) a:
# public/data/biblia.json
PASO 2: Reemplazar Bible.js
bash
# Descarga el archivo Bible.js que te acabo de enviar
# Cópialo a tu proyecto en:
# src/pages/Bible.js
PASO 3: Probar Localmente
bash
npm start
# Navega a la sección Biblia en tu app
PASO 4: Deploy
bash
git add public/data/biblia.json
git add src/pages/Bible.js
git commit -m "feat: Integración completa Biblia RV1909 con Strong's"
git push origin main
```

## 🔍 Cómo Funciona:

**Al cargar:**
- Lee `biblia.json` desde `/public/data/`
- Organiza los 31,102 versículos por libro → capítulo → versículo

**Números de Strong:**
- `{H7225}` = Hebreo (rojo)
- `{G####}` = Griego (rojo)
- Click en el checkbox para mostrarlos/ocultarlos
- Hover sobre el número muestra tooltip

**Búsqueda:**
- Escribe cualquier palabra
- Encuentra hasta 50 versículos
- Click en resultado → va directo al capítulo

## ✨ Ejemplo de Uso Visual:
```
📖 Biblia Reina-Valera 1909
   con números de Strong

[Buscar en toda la Biblia...] [🔍 Buscar] ☑ Mostrar números de Strong

Libro: [Génesis ▼]  Capítulo: [1 ▼]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            Génesis 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1  EN el principioH7225 crióH1254 DiosH430 los cielosH8064...
2  Y la tierraH776 estabaH1961 desordenadaH8414...
🚨 Verificación:
Antes de hacer deploy, verifica:

✅ biblia.json está en public/data/
✅ El JSON es válido (usa JSONLint)
✅ El archivo pesa aprox. 4-6 MB (es normal)
✅ Funciona en localhost:3000
¿Listo para probarlo? ¿Necesitas ayuda con algún paso específico? 📖✨

Bible
JS 

import React, { useState } from 'react'; import { useTranslation } from 'react-i18next'; import { Search, BookMarked } from 'lucide-react'; import './Bible.css'; // Sample Bible data - in production, this would be loaded from a JSON file const bibleBooks = { 'Genesis': { chapters: 50 }, 'Exodus

pasted

como referencia me parece importante veas el contenido actual de Bible.js

7:31 p. m.

Analizó estructura existente para integrar mejoras compatibles
Analizó estructura existente para integrar mejoras compatibles
Perfecto, ahora veo el contexto completo. El Bible.js actual usa:

✅ react-i18next para traducciones
✅ Lucide React para iconos
✅ Bible.css separado
✅ Clases CSS específicas del proyecto
Voy a crear una versión mejorada que mantiene la arquitectura del proyecto pero integra el JSON completo:


Preparó resumen visual integrando archivos necesarios
Preparó resumen visual integrando archivos necesarios
¡Perfecto! Ahora sí, he creado la versión mejorada de Bible.js que respeta completamente la arquitectura de tu proyecto "Mi Diario".

📦 Paquete de Integración Completo
He creado 3 archivos listos para usar:

1️⃣ Bible-MEJORADO.js
El componente React actualizado con:

✅ Mantiene tu estructura (i18next, Lucide icons, clases CSS)
✅ Carga el JSON completo de RV1909 desde /public/data/biblia.json
✅ Búsqueda global en toda la Biblia (100 resultados)
✅ Toggle de números de Strong (H7225, G2316)
✅ Estados de carga y manejo de errores
✅ Click en resultados → va al capítulo
2️⃣ Bible.css
Estilos actualizados con:

✅ Compatibilidad con tus clases existentes
✅ Nuevos estilos para Strong numbers
✅ Loading spinner
✅ Error states
✅ Responsive design mejorado
3️⃣ INTEGRACION-GUIA.md
Guía completa paso a paso con:

✅ Checklist de integración
✅ Troubleshooting
✅ Instrucciones de deploy
✅ FAQs
🚀 Instalación Ultra-Rápida (3 pasos)
bash
# PASO 1: Colocar el JSON
mkdir -p public/data
# Copia tu biblia.json → public/data/biblia.json

# PASO 2: Reemplazar archivos
cp Bible-MEJORADO.js src/pages/Bible.js
cp Bible.css src/pages/Bible.css

# PASO 3: Probar
npm start
```

---

## ✨ Comparación: Antes vs Ahora

| Característica | ANTES | AHORA |
|----------------|-------|-------|
| **Datos** | 6 versículos de muestra | **31,102+ versículos completos** |
| **Búsqueda** | En versículos de muestra | **En toda la Biblia** |
| **Números Strong** | No disponible | **Toggle H/G numbers** |
| **Navegación** | Básica | **Click en resultados → capítulo** |
| **Loading** | Sin feedback | **Spinner + mensajes** |
| **Errores** | Sin manejo | **Mensajes claros + ayuda** |

---

## 🎯 Características Clave

### **Búsqueda Inteligente**
```
Usuario escribe: "amor"
→ Encuentra en 31,102 versículos
→ Muestra hasta 100 resultados
→ Click → va directo al capítulo
```

### **Números de Strong**
```
Texto con Strong: "EN el principio{H7225} crió{H1254}..."
Toggle OFF: "EN el principio crió..."
Toggle ON:  "EN el principioH7225 crióH1254..."
            (como superíndices rojos con tooltip)
Performance Optimizada
javascript
useMemo → organizar 31K versículos (1 sola vez)
useMemo → lista de libros (cachea)
useMemo → capítulos por libro (cachea)
```

---

## 📱 Vista Previa Visual
```
┌────────────────────────────────────────┐
│  📖 Biblia                    🔖       │
├────────────────────────────────────────┤
│                                        │
│  📖 Biblia Reina-Valera 1909          │
│     con números de Strong              │
│     31,102 versículos • 66 libros      │
│                                        │
├────────────────────────────────────────┤
│  🔍 Buscar                             │
│  [amor________________] [🔍 Buscar]    │
│  ☑ Mostrar números de Strong           │
│                                        │
│  Resultados (85)                       │
│  ┌──────────────────────────────────┐ │
│  │ Juan 3:16                        │ │
│  │ Porque de tal manera amó Dios... │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│  📖 Leer la Biblia                    │
│  Libro: [Génesis          ▼]          │
│  Capítulo: [1             ▼]          │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━          │
│          Génesis 1                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━          │
│                                        │
│  1  EN el principioH7225 crióH1254     │
│     DiosH430 los cielosH8064...        │
│                                        │
│  2  Y la tierraH776 estabaH1961...     │
└────────────────────────────────────────┘
⚠️ Importante: Verificar Antes de Deploy
bash
# ✅ Verificar que biblia.json existe
ls -la public/data/biblia.json

# ✅ Verificar sintaxis JSON (copia/pega en jsonlint.com)

# ✅ Probar localmente
npm start
# Ve a Biblia → Selecciona Génesis 1 → Busca "amor"

# ✅ Si todo funciona:
git add .
git commit -m "feat: Biblia RV1909 completa con Strong's"
git push origin main
🎓 Próximos Pasos Opcionales (Futuro)
Si quieres expandir aún más:

Marcadores - Guardar versículos favoritos con localStorage
Notas personales - Agregar comentarios a versículos
Plan de lectura - Calendario diario de lectura
Diccionario Strong - Popup con definiciones de H/G numbers
Compartir versículos - Generar imagen para redes sociales
Audio Biblia - Integrar lectura en voz alta
¿Listo para integrar? Descarga los 3 archivos y sigue la guía. Si tienes alguna pregunta o problema durante la integración, ¡avísame! 📖✨

Bible mejorado
JS 
Bible
Código · CSS 
Integracion guia
Documento · MD 





Claude es IA y puede cometer errores. Por favor, verifica nuevamente las respuestas.
Bible mejorado · JS
Copiar

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookMarked, BookOpen, Eye, EyeOff } from 'lucide-react';
import './Bible.css';
 
const Bible = () => {
  const { t } = useTranslation();
  
  // Estados principales
  const [bibleData, setBibleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de navegación
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showStrongNumbers, setShowStrongNumbers] = useState(false);
 
  // Cargar el JSON de la Biblia
  useEffect(() => {
    const loadBible = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/biblia.json');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar la Biblia`);
        }
        
        const data = await response.json();
        setBibleData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando la Biblia:', err);
        setError(err.message);
        setLoading(false);
      }
    };
 
    loadBible();
  }, []);
 
  // Organizar datos por libro y capítulo
  const organizedData = useMemo(() => {
    if (!bibleData?.verses) return null;
 
    const organized = {};
    
    bibleData.verses.forEach(verse => {
      const bookName = verse.book_name;
      const chapter = verse.chapter;
      
      if (!organized[bookName]) {
        organized[bookName] = {
          bookNumber: verse.book,
          chapters: {}
        };
      }
      
      if (!organized[bookName].chapters[chapter]) {
        organized[bookName].chapters[chapter] = [];
      }
      
      organized[bookName].chapters[chapter].push(verse);
    });
 
    return organized;
  }, [bibleData]);
 
  // Lista de libros únicos ordenados
  const booksList = useMemo(() => {
    if (!organizedData) return [];
    return Object.keys(organizedData).sort((a, b) => 
      organizedData[a].bookNumber - organizedData[b].bookNumber
    );
  }, [organizedData]);
 
  // Capítulos del libro seleccionado
  const chaptersList = useMemo(() => {
    if (!selectedBook || !organizedData) return [];
    return Object.keys(organizedData[selectedBook].chapters)
      .map(Number)
      .sort((a, b) => a - b);
  }, [selectedBook, organizedData]);
 
  // Versículos del capítulo actual
  const currentVerses = useMemo(() => {
    if (!selectedBook || !selectedChapter || !organizedData) return [];
    return organizedData[selectedBook].chapters[selectedChapter] || [];
  }, [selectedBook, selectedChapter, organizedData]);
 
  // Procesar texto de versículo con números de Strong
  const renderVerseText = (text) => {
    if (!showStrongNumbers) {
      return text.replace(/\{[HG]\d+\}/g, '');
    }
 
    const parts = text.split(/(\{[HG]\d+\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{([HG]\d+)\}/);
      if (match) {
        return (
          <sup 
            key={index} 
            className="strong-number"
            title={`Strong's ${match[1]}`}
          >
            {match[1]}
          </sup>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
 
  // Búsqueda en toda la Biblia
  const handleSearch = () => {
    if (!searchTerm.trim() || !bibleData?.verses) {
      setSearchResults([]);
      return;
    }
 
    const results = bibleData.verses
      .filter(verse => {
        const cleanText = verse.text.replace(/\{[HG]\d+\}/g, '').toLowerCase();
        return cleanText.includes(searchTerm.toLowerCase());
      })
      .slice(0, 100); // Máximo 100 resultados
 
    setSearchResults(results);
  };
 
  // Navegar a un versículo desde resultados
  const goToVerse = (verse) => {
    setSelectedBook(verse.book_name);
    setSelectedChapter(verse.chapter);
    setSearchResults([]);
    setSearchTerm('');
    
    // Scroll suave al contenido
    setTimeout(() => {
      const chapterContent = document.querySelector('.chapter-content');
      if (chapterContent) {
        chapterContent.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
 
  // Renderizado condicional para estados de carga
  if (loading) {
    return (
      <div className="bible-page">
        <div className="page-header">
          <h1>{t('bible.title')}</h1>
          <BookMarked size={32} className="page-icon" />
        </div>
        <div className="bible-container">
          <div className="card loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando Biblia Reina-Valera 1909...</p>
          </div>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bible-page">
        <div className="page-header">
          <h1>{t('bible.title')}</h1>
          <BookMarked size={32} className="page-icon" />
        </div>
        <div className="bible-container">
          <div className="card error-state">
            <h3>❌ Error al cargar la Biblia</h3>
            <p className="error-message">{error}</p>
            <div className="error-help">
              <p><strong>Asegúrate de que:</strong></p>
              <ul>
                <li>El archivo <code>biblia.json</code> está en <code>public/data/</code></li>
                <li>El archivo es válido (sin errores de sintaxis)</li>
                <li>El servidor está corriendo correctamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="bible-page">
      <div className="page-header">
        <h1>{t('bible.title')}</h1>
        <BookMarked size={32} className="page-icon" />
      </div>
 
      <div className="bible-container">
        {/* Información de la versión */}
        <div className="bible-version-info card">
          <h3>📖 {bibleData?.metadata?.name || 'Biblia Reina-Valera 1909'}</h3>
          <p className="version-subtitle">
            {bibleData?.metadata?.description ? (
              <span dangerouslySetInnerHTML={{ 
                __html: bibleData.metadata.description.replace(/<[^>]*>/g, '') 
              }} />
            ) : (
              'con números de Strong'
            )}
          </p>
          <div className="bible-stats">
            <span>{bibleData?.verses?.length?.toLocaleString()} versículos</span>
            <span>•</span>
            <span>{booksList.length} libros</span>
          </div>
        </div>
 
        {/* Sección de búsqueda */}
        <div className="search-section card">
          <h3>{t('bible.search')}</h3>
          <div className="search-bar">
            <input
              type="text"
              className="input"
              placeholder="Buscar en toda la Biblia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>
 
          {/* Toggle números de Strong */}
          <div className="strong-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showStrongNumbers}
                onChange={(e) => setShowStrongNumbers(e.target.checked)}
              />
              {showStrongNumbers ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Mostrar números de Strong</span>
            </label>
          </div>
 
          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <div className="results-header">
                <h4>Resultados de búsqueda ({searchResults.length})</h4>
                <button 
                  className="btn-link"
                  onClick={() => setSearchResults([])}
                >
                  Limpiar
                </button>
              </div>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="verse-result"
                    onClick={() => goToVerse(result)}
                  >
                    <span className="verse-reference">
                      {result.book_name} {result.chapter}:{result.verse}
                    </span>
                    <p className="verse-text">
                      {result.text.replace(/\{[HG]\d+\}/g, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
 
        {/* Selección de libro y capítulo */}
        <div className="selection-section card">
          <h3>
            <BookOpen size={20} />
            {t('bible.read') || 'Leer la Biblia'}
          </h3>
          
          <div className="form-group">
            <label>{t('bible.book')}</label>
            <select 
              className="input"
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setSelectedChapter('');
              }}
            >
              <option value="">Seleccionar libro</option>
              {booksList.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>
          </div>
 
          {selectedBook && (
            <div className="form-group">
              <label>{t('bible.chapter')}</label>
              <select 
                className="input"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                <option value="">Seleccionar capítulo</option>
                {chaptersList.map(ch => (
                  <option key={ch} value={ch}>
                    Capítulo {ch}
                  </option>
                ))}
              </select>
            </div>
          )}
 
          {/* Contenido del capítulo */}
          {selectedBook && selectedChapter && (
            <div className="chapter-content">
              <h4>{selectedBook} - Capítulo {selectedChapter}</h4>
              <div className="bible-text">
                {currentVerses.map((verse) => (
                  <p key={verse.verse} className="verse">
                    <span className="verse-number">{verse.verse}</span>
                    <span className="verse-content">
                      {renderVerseText(verse.text)}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
 
        {/* Sección de información */}
        {!selectedBook && searchResults.length === 0 && (
          <div className="info-section card">
            <h3>Bienvenido a la Biblia RV1909</h3>
            <p>
              Esta es la versión completa de la Biblia Reina-Valera 1909 
              con números de Strong para estudio profundo.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <Search size={18} />
                <span>Busca en toda la Biblia</span>
              </div>
              <div className="feature-item">
                <BookOpen size={18} />
                <span>Lee cualquier libro y capítulo</span>
              </div>
              <div className="feature-item">
                <Eye size={18} />
                <span>Activa números de Strong para estudio</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default Bible;
 
