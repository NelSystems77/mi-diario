import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  Globe, 
  Moon, 
  Sun, 
  Type, 
  Mic, 
  Volume2,
  Contrast 
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, textSize, setTextSize } = useTheme();
  const { currentUser } = useAuth();
  
  const [quotePreference, setQuotePreference] = useState('motivational');
  const [isListening, setIsListening] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const themes = [
    { value: 'light', label: t('settings.light'), icon: Sun },
    { value: 'dark', label: t('settings.dark'), icon: Moon },
    { value: 'high-contrast', label: t('settings.highContrast'), icon: Contrast }
  ];

  const textSizes = [
    { value: 'sm', label: 'Pequeño' },
    { value: 'base', label: 'Normal' },
    { value: 'lg', label: 'Grande' },
    { value: 'xl', label: 'Extra Grande' }
  ];

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        language: lng
      });
    }
  };

  const changeQuotePreference = async (pref) => {
    setQuotePreference(pref);
    
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        quotePreference: pref
      });
    }
  };

  const startVoiceControl = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = i18n.language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice command:', transcript);
        // Handle voice commands here
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Tu navegador no soporta reconocimiento de voz');
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>

      <div className="settings-container">
        {/* Language Settings */}
        <div className="settings-section card">
          <div className="section-header">
            <Globe size={24} />
            <h3>{t('settings.language')}</h3>
          </div>
          <div className="language-grid">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <span className="flag">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="settings-section card">
          <div className="section-header">
            <Moon size={24} />
            <h3>{t('settings.theme')}</h3>
          </div>
          <div className="theme-grid">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={`theme-option ${theme === value ? 'active' : ''}`}
                onClick={() => setTheme(value)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Size Settings */}
        <div className="settings-section card">
          <div className="section-header">
            <Type size={24} />
            <h3>{t('settings.textSize')}</h3>
          </div>
          <div className="text-size-grid">
            {textSizes.map(size => (
              <button
                key={size.value}
                className={`text-size-option ${textSize === size.value ? 'active' : ''}`}
                onClick={() => setTextSize(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="settings-section card">
          <div className="section-header">
            <Mic size={24} />
            <h3>{t('settings.accessibility')}</h3>
          </div>
          
          <div className="accessibility-options">
            <div className="option-item">
              <div>
                <h4>{t('settings.voiceControl')}</h4>
                <p>Usa tu voz para controlar la aplicación</p>
              </div>
              <button
                className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
                onClick={startVoiceControl}
              >
                <Mic size={18} />
                {isListening ? 'Escuchando...' : 'Activar'}
              </button>
            </div>

            <div className="option-item">
              <div>
                <h4>{t('settings.screenReader')}</h4>
                <p>Escucha el texto en voz alta</p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => speakText('Bienvenido a Mi Diario')}
              >
                <Volume2 size={18} />
                Probar
              </button>
            </div>
          </div>
        </div>

        {/* Daily Quote Preference */}
        <div className="settings-section card">
          <div className="section-header">
            <h3>{t('settings.dailyQuote')}</h3>
          </div>
          <div className="quote-preference">
            <button
              className={`quote-option ${quotePreference === 'motivational' ? 'active' : ''}`}
              onClick={() => changeQuotePreference('motivational')}
            >
              ✨ {t('settings.motivational')}
            </button>
            <button
              className={`quote-option ${quotePreference === 'biblical' ? 'active' : ''}`}
              onClick={() => changeQuotePreference('biblical')}
            >
              📖 {t('settings.biblical')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
