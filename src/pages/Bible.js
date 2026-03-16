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
