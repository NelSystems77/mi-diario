import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookMarked } from 'lucide-react';
import './Bible.css';

// Sample Bible data - in production, this would be loaded from a JSON file
const bibleBooks = {
  'Genesis': { chapters: 50 },
  'Exodus': { chapters: 40 },
  'Psalms': { chapters: 150 },
  'Matthew': { chapters: 28 },
  'John': { chapters: 21 },
  'Romans': { chapters: 16 }
};

const sampleVerses = {
  'Psalms-23-1': 'El Señor es mi pastor, nada me faltará.',
  'John-3-16': 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.',
  'Philippians-4-13': 'Todo lo puedo en Cristo que me fortalece.',
  'Isaiah-41-10': 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.',
  'Psalms-27-1': 'Jehová es mi luz y mi salvación; ¿de quién temeré?'
};

const Bible = () => {
  const { t } = useTranslation();
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    if (!searchTerm) return;
    
    const results = Object.entries(sampleVerses)
      .filter(([key, text]) => 
        text.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([key, text]) => ({ reference: key, text }));
    
    setSearchResults(results);
  };

  const getChapterOptions = () => {
    if (!selectedBook) return [];
    const chapters = bibleBooks[selectedBook]?.chapters || 0;
    return Array.from({ length: chapters }, (_, i) => i + 1);
  };

  return (
    <div className="bible-page">
      <div className="page-header">
        <h1>{t('bible.title')}</h1>
        <BookMarked size={32} className="page-icon" />
      </div>

      <div className="bible-container">
        {/* Search Section */}
        <div className="search-section card">
          <h3>{t('bible.search')}</h3>
          <div className="search-bar">
            <input
              type="text"
              className="input"
              placeholder="Buscar versículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(result => (
                <div key={result.reference} className="verse-result">
                  <span className="verse-reference">{result.reference}</span>
                  <p className="verse-text">{result.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Selection */}
        <div className="selection-section card">
          <h3>Leer la Biblia</h3>
          
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
              {Object.keys(bibleBooks).map(book => (
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
                {getChapterOptions().map(ch => (
                  <option key={ch} value={ch}>Capítulo {ch}</option>
                ))}
              </select>
            </div>
          )}

          {selectedBook && selectedChapter && (
            <div className="chapter-content">
              <h4>{selectedBook} - Capítulo {selectedChapter}</h4>
              <div className="bible-text">
                <p className="verse">
                  <span className="verse-number">1</span>
                  {sampleVerses[Object.keys(sampleVerses)[0]]}
                </p>
                <p className="verse">
                  <span className="verse-number">2</span>
                  En esta versión de demostración, el texto completo de la Biblia
                  se cargaría desde un archivo JSON.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section card">
          <h3>Acerca de esta función</h3>
          <p>
            Esta implementación incluye la funcionalidad base para la lectura
            de la Biblia. En la versión de producción, se puede integrar:
          </p>
          <ul>
            <li>Biblia completa en formato JSON offline</li>
            <li>API de Biblia para versiones actualizadas</li>
            <li>Marcadores de versículos favoritos</li>
            <li>Plan de lectura diario</li>
            <li>Notas personales</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bible;
