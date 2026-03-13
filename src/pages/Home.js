import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Sparkles, BookOpen, Heart, TrendingUp } from 'lucide-react';
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
  const [userData, setUserData] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');
  const [quoteType, setQuoteType] = useState('motivational');

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
    <div className="home-page">
      <div className="home-header fade-in">
        <h1>Hola, {userData?.displayName || 'Amigo/a'} 👋</h1>
        <p className="tagline">{t('app.tagline')}</p>
      </div>

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
  );
};

export default Home;
