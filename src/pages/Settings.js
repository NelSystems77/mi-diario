import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  Globe, 
  Moon, 
  Sun, 
  Type, 
  Mic, 
  Volume2,
  Contrast,
  UserCheck, // NUEVO
  X,         // NUEVO
  Check      // NUEVO
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, textSize, setTextSize } = useTheme();
  const { currentUser } = useAuth();
  
  // Estados existentes
  const [quotePreference, setQuotePreference] = useState('motivational');
  const [isListening, setIsListening] = useState(false);

  // NUEVO: Estados del Terapeuta
  const [therapistRelationship, setTherapistRelationship] = useState(null);
  const [invitations, setInvitations] = useState([]);

  // NUEVO: Efecto para cargar datos del terapeuta
  useEffect(() => {
    loadTherapistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // NUEVO: Función para cargar la relación e invitaciones
  const loadTherapistData = async () => {
    if (!currentUser) return;

    try {
      // Cargar relación activa con terapeuta
      const relationshipsRef = collection(db, 'therapist-patient-relationships');
      const q = query(
        relationshipsRef,
        where('patientId', '==', currentUser.uid),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setTherapistRelationship({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }

      // Cargar invitaciones pendientes
      const invitationsRef = collection(db, 'therapistInvitations');
      const invQuery = query(
        invitationsRef,
        where('patientEmail', '==', currentUser.email), // Asume que currentUser tiene email
        where('status', '==', 'pending')
      );
      const invSnapshot = await getDocs(invQuery);
      const invList = invSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitations(invList);
    } catch (error) {
      console.error('Error cargando datos del terapeuta:', error);
    }
  };

  // NUEVO: Función para alternar permisos
  const togglePermission = async (permission) => {
    if (!therapistRelationship) return;

    try {
      const newPermissions = {
        ...therapistRelationship.permissions,
        [permission]: !therapistRelationship.permissions[permission]
      };

      await updateDoc(doc(db, 'therapist-patient-relationships', therapistRelationship.id), {
        permissions: newPermissions
      });

      setTherapistRelationship({
        ...therapistRelationship,
        permissions: newPermissions
      });
    } catch (error) {
      console.error('Error actualizando permisos:', error);
    }
  };

  // Arrays de configuración existentes
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

  // Funciones existentes
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
        {/* Settings de Lenguaje */}
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

        {/* Settings de Tema */}
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

        {/* Settings de Tamaño de Texto */}
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

        {/* Settings de Accesibilidad */}
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

        {/* Settings de Frase Diaria */}
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

        {/* --- NUEVA SECCIÓN: MI TERAPEUTA --- */}
        <div className="settings-section card">
          <div className="section-header">
            <UserCheck size={24} />
            <h3>Mi Terapeuta</h3>
          </div>

          {therapistRelationship ? (
            <div className="therapist-info">
              <div className="therapist-card">
                <div className="therapist-header">
                  <h4>{therapistRelationship.therapistName}</h4>
                  <p>{therapistRelationship.therapistEmail}</p>
                </div>

                <div className="permissions-control">
                  <h5>Permisos de Acceso</h5>
                  <p className="permissions-note">
                    Controla qué información puede ver tu terapeuta
                  </p>

                  <div className="permission-toggles">
                    <label className="permission-toggle">
                      <input
                        type="checkbox"
                        checked={therapistRelationship.permissions?.viewDiary || false}
                        onChange={() => togglePermission('viewDiary')}
                      />
                      <span>Ver entradas del diario</span>
                    </label>

                    <label className="permission-toggle">
                      <input
                        type="checkbox"
                        checked={therapistRelationship.permissions?.viewEmotions || false}
                        onChange={() => togglePermission('viewEmotions')}
                      />
                      <span>Ver gráficas emocionales</span>
                    </label>

                    <label className="permission-toggle">
                      <input
                        type="checkbox"
                        checked={therapistRelationship.permissions?.viewSelfcare || false}
                        onChange={() => togglePermission('viewSelfcare')}
                      />
                      <span>Ver progreso de autocuidado</span>
                    </label>

                    <label className="permission-toggle">
                      <input
                        type="checkbox"
                        checked={therapistRelationship.permissions?.viewDashboard || false}
                        onChange={() => togglePermission('viewDashboard')}
                      />
                      <span>Ver dashboard completo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-therapist">
              <p>No tienes un terapeuta asignado</p>
            </div>
          )}

          {/* Invitaciones Pendientes */}
          {invitations.length > 0 && (
            <div className="pending-invitations">
              <h5>Invitaciones Pendientes</h5>
              {invitations.map(invitation => (
                <div key={invitation.id} className="invitation-card">
                  <div className="invitation-info">
                    <strong>{invitation.therapistName}</strong>
                    <p>{invitation.message}</p>
                  </div>
                  <div className="invitation-actions">
                    <button className="btn btn-primary btn-accept">
                      <Check size={16} />
                      Aceptar
                    </button>
                    <button className="btn btn-secondary btn-reject">
                      <X size={16} />
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* --- FIN SECCIÓN MI TERAPEUTA --- */}

      </div>
    </div>
  );
};

export default Settings;
