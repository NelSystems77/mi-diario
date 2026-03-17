import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Sparkles, BookOpen, Heart, TrendingUp, UserCheck, X } from 'lucide-react';
import RoleBasedRedirect from '../components/common/RoleBasedRedirect';
import './Home.css';

const motivationalQuotes = [
  "Cada día es una nueva oportunidad para crecer.",
  "Pequeños pasos llevan a grandes cambios.",
  "Eres más fuerte de lo que crees.",
  "El autocuidado no es egoísmo, es supervivencia.",
  "Tus sentimientos son válidos."
];

const biblicalVerses = [
  { text: "No temas, porque yo estoy contigo.", ref: "Isaías 41:10" },
  { text: "El Señor es mi pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Jehová es mi luz y mi salvación.", ref: "Salmos 27:1" }
];

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');
  const [quoteType, setQuoteType] = useState('motivational');
  const [invitations, setInvitations] = useState([]);
  const [showInvitationBanner, setShowInvitationBanner] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setQuoteType(userDoc.data().quotePreference || 'motivational');
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    loadInvitations();
  }, [currentUser]);

  useEffect(() => {
    const getRandomQuote = () => {
      if (quoteType === 'biblical') {
        const verse = biblicalVerses[Math.floor(Math.random() * biblicalVerses.length)];
        setDailyQuote(`"${verse.text}" - ${verse.ref}`);
      } else {
        setDailyQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      }
    };
    getRandomQuote();
  }, [quoteType]);

  const loadInvitations = async () => {
    if (!currentUser) return;

    try {
      const invitationsRef = collection(db, 'therapistInvitations');
      const q = query(
        invitationsRef,
        where('patientEmail', '==', currentUser.email),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      const invList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setInvitations(invList);
      setShowInvitationBanner(invList.length > 0);
    } catch (error) {
      console.error('Error cargando invitaciones:', error);
    }
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      // Crear relación terapeuta-paciente
      const relationshipData = {
        therapistId: invitation.therapistId,
        therapistName: invitation.therapistName,
        therapistEmail: invitation.therapistEmail,
        patientId: currentUser.uid,
        patientEmail: currentUser.email,
        patientName: userData?.displayName || currentUser.email,
        status: 'active',
        createdAt: new Date().toISOString(),
        permissions: {
          viewDiary: true,
          viewEmotions: true,
          viewSelfcare: true,
          viewDashboard: true
        }
      };

      await setDoc(doc(db, 'therapist-patient-relationships', `${invitation.therapistId}_${currentUser.uid}`), relationshipData);

      // Actualizar invitación a aceptada
      await updateDoc(doc(db, 'therapistInvitations', invitation.id), {
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      });

      // Recargar invitaciones
      loadInvitations();

      alert('¡Invitación aceptada! Tu terapeuta ahora puede acompañar tu proceso.');
    } catch (error) {
      console.error('Error aceptando invitación:', error);
      alert('Error al aceptar la invitación. Inténtalo de nuevo.');
    }
  };

  const handleRejectInvitation = async (invitation) => {
    try {
      await updateDoc(doc(db, 'therapistInvitations', invitation.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      loadInvitations();
    } catch (error) {
      console.error('Error rechazando invitación:', error);
      alert('Error al rechazar la invitación. Inténtalo de nuevo.');
    }
  };

  const getLevelEmoji = (level) => {
    switch (level) {
      case 'seed': return '🌱';
      case 'sprout': return '🌿';
      case 'youngTree': return '🌳';
      case 'forest': return '🌲';
      default: return '🌱';
    }
  };

  return (
    <RoleBasedRedirect>
      <div className="home-page">
        <div className="home-header fade-in">
          <h1>Hola, {userData?.displayName || 'Amigo/a'} 👋</h1>
          <p className="tagline">{t('app.tagline')}</p>
        </div>

        {/* Banner de Invitaciones */}
        {showInvitationBanner && invitations.length > 0 && (
          <div className="invitation-banner card scale-in">
            <div className="banner-header">
              <UserCheck size={32} className="banner-icon" />
              <div className="banner-title">
                <h3>🎉 ¡Tienes {invitations.length} invitación{invitations.length > 1 ? 'es' : ''} nueva{invitations.length > 1 ? 's' : ''}!</h3>
              </div>
              <button 
                className="banner-close"
                onClick={() => setShowInvitationBanner(false)}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {invitations.map(invitation => (
              <div key={invitation.id} className="invitation-content">
                <div className="invitation-message">
                  <p className="therapist-name">
                    <strong>{invitation.therapistName}</strong> te invita a compartir tu progreso emocional
                  </p>
                  {invitation.message && (
                    <p className="invitation-text">"{invitation.message}"</p>
                  )}
                  <p className="invitation-note">
                    Podrás controlar qué información compartes en Configuración
                  </p>
                </div>
                <div className="invitation-actions">
                  <button 
                    className="btn-accept"
                    onClick={() => handleAcceptInvitation(invitation)}
                  >
                    Aceptar Invitación
                  </button>
                  <button 
                    className="btn-later"
                    onClick={() => navigate('/settings')}
                  >
                    Ver en Configuración
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="daily-quote card scale-in">
          <Sparkles className="quote-icon" />
          <p className="quote-text">{dailyQuote}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon">
              {getLevelEmoji(userData?.level || 'seed')}
            </div>
            <div className="stat-info">
              <span className="stat-label">{t('dashboard.level')}</span>
              <span className="stat-value">{t(`levels.${userData?.level || 'seed'}`)}</span>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">✨</div>
            <div className="stat-info">
              <span className="stat-label">{t('dashboard.points')}</span>
              <span className="stat-value">{userData?.points || 0}</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones rápidas</h2>
          <div className="action-grid">
            <Link to="/diary" className="action-card card">
              <BookOpen size={32} />
              <h3>{t('diary.newEntry')}</h3>
              <p>Registra tus emociones del día</p>
            </Link>

            <Link to="/selfcare" className="action-card card">
              <Heart size={32} />
              <h3>{t('selfcare.title')}</h3>
              <p>Completa tu lista de autocuidado</p>
            </Link>

            <Link to="/dashboard" className="action-card card">
              <TrendingUp size={32} />
              <h3>{t('dashboard.title')}</h3>
              <p>Revisa tu progreso</p>
            </Link>
          </div>
        </div>
      </div>
    </RoleBasedRedirect>
  );
};

export default Home;
