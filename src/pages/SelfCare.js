import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Check, Award, BookMarked } from 'lucide-react';
import './SelfCare.css';

const SelfCare = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [checklist, setChecklist] = useState({});
  const [todayPoints, setTodayPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastResetDate, setLastResetDate] = useState('');
  
  // Lista completa de tareas (NUEVA TAREA AGREGADA)
  const selfCareItems = [
    { id: 'makeBed', points: 5, icon: '🛏️' },
    { id: 'shower', points: 5, icon: '🚿' },
    { id: 'brushTeeth', points: 5, icon: '🦷' },
    { id: 'eatWell', points: 5, icon: '🥗' },
    { id: 'sleepEnough', points: 5, icon: '😴' },
    { id: 'goOutside', points: 5, icon: '🌳' },
    { id: 'talkToSomeone', points: 5, icon: '💬' },
    { id: 'listenMusic', points: 5, icon: '🎵' },
    { id: 'writeDiary', points: 5, icon: '📔' },
    { id: 'bibleReading', points: 5, icon: '📖' } // NUEVA TAREA
  ];

  useEffect(() => {
    checkAndResetDaily();
    fetchTodayChecklist();
    fetchUserPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NUEVA FUNCIÓN: Verificar si es un nuevo día y resetear
  const checkAndResetDaily = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const userMetaRef = doc(db, 'selfcare-meta', currentUser.uid);
      const metaDoc = await getDoc(userMetaRef);
      
      if (metaDoc.exists()) {
        const lastReset = metaDoc.data().lastResetDate;
        
        // Si es un nuevo día, resetear
        if (lastReset !== today) {
          await setDoc(userMetaRef, {
            lastResetDate: today
          });
          setLastResetDate(today);
          
          // Limpiar checklist del día anterior
          setChecklist({});
          setTodayPoints(0);
        } else {
          setLastResetDate(lastReset);
        }
      } else {
        // Primera vez, crear documento meta
        await setDoc(userMetaRef, {
          lastResetDate: today
        });
        setLastResetDate(today);
      }
    } catch (error) {
      console.error('Error en reset diario:', error);
    }
  };

  const fetchTodayChecklist = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const checklistRef = doc(db, 'selfcare', `${currentUser.uid}_${today}`);
      const checklistDoc = await getDoc(checklistRef);
      
      if (checklistDoc.exists()) {
        setChecklist(checklistDoc.data().items || {});
        setTodayPoints(checklistDoc.data().points || 0);
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setTotalPoints(userDoc.data().points || 0);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const toggleItem = async (itemId, points) => {
    const isChecked = checklist[itemId];
    const newChecklist = { ...checklist, [itemId]: !isChecked };
    const pointsDelta = isChecked ? -points : points;
    
    setChecklist(newChecklist);
    setTodayPoints(prev => prev + pointsDelta);
    setTotalPoints(prev => prev + pointsDelta);

    try {
      const today = new Date().toISOString().split('T')[0];
      const checklistRef = doc(db, 'selfcare', `${currentUser.uid}_${today}`);
      
      await setDoc(checklistRef, {
        userId: currentUser.uid,
        date: today,
        items: newChecklist,
        points: todayPoints + pointsDelta
      }, { merge: true });

      // Update user's total points
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        points: increment(pointsDelta)
      });
      
      // Update level if necessary
      await updateUserLevel();
    } catch (error) {
      console.error('Error updating checklist:', error);
      // Revert changes on error
      setChecklist(checklist);
      setTodayPoints(prev => prev - pointsDelta);
      setTotalPoints(prev => prev - pointsDelta);
    }
  };

  const updateUserLevel = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const currentPoints = userDoc.data().points || 0;
      
      let newLevel = 'seed';
      if (currentPoints >= 1000) newLevel = 'forest';
      else if (currentPoints >= 500) newLevel = 'youngTree';
      else if (currentPoints >= 200) newLevel = 'sprout';
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        level: newLevel
      });
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  // FILTRAR: Mostrar solo tareas pendientes (no completadas)
  const pendingItems = selfCareItems.filter(item => !checklist[item.id]);
  const completedItems = selfCareItems.filter(item => checklist[item.id]);
  const completedCount = completedItems.length;

  return (
    <div className="selfcare-page">
      <div className="page-header">
        <h1>{t('selfcare.title')}</h1>
        <div className="points-display">
          <Award size={24} />
          <div>
            <div className="points-label">{t('selfcare.todayPoints')}</div>
            <div className="points-value">{todayPoints}</div>
          </div>
        </div>
      </div>

      <div className="progress-card card fade-in">
        <div className="progress-header">
          <span>Progreso del día</span>
          <span>{completedCount}/{selfCareItems.length}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(completedCount / selfCareItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tareas Completadas (Resumen) */}
      {completedItems.length > 0 && (
        <div className="completed-section card fade-in">
          <h3>✅ Completado hoy ({completedItems.length})</h3>
          <div className="completed-tags">
            {completedItems.map(item => (
              <span key={item.id} className="completed-tag">
                {item.icon} {t(`selfcare.${item.id}`)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tareas Pendientes */}
      <div className="checklist-grid">
        {pendingItems.length > 0 ? (
          pendingItems.map(item => (
            <button
              key={item.id}
              className="checklist-item card"
              onClick={() => toggleItem(item.id, item.points)}
            >
              <div className="check-circle">
                <Check size={24} strokeWidth={3} style={{ opacity: 0.3 }} />
              </div>
              <div className="item-content">
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{t(`selfcare.${item.id}`)}</span>
                <span className="item-points">+{item.points} pts</span>
              </div>
            </button>
          ))
        ) : (
          <div className="all-done card">
            <div className="all-done-icon">🎉</div>
            <h3>¡Felicitaciones!</h3>
            <p>Has completado todas las tareas de autocuidado por hoy</p>
            <p className="reset-note">Las tareas se renovarán mañana</p>
          </div>
        )}
      </div>

      <div className="total-points card">
        <h3>{t('selfcare.totalPoints')}</h3>
        <div className="total-points-value">{totalPoints}</div>
        <p className="total-points-message">
          {totalPoints < 200 && "🌱 Sigue cultivando tus hábitos"}
          {totalPoints >= 200 && totalPoints < 500 && "🌿 ¡Estás creciendo!"}
          {totalPoints >= 500 && totalPoints < 1000 && "🌳 ¡Árbol fuerte!"}
          {totalPoints >= 1000 && "🌲 ¡Eres un bosque de bienestar!"}
        </p>
      </div>
    </div>
  );
};

export default SelfCare;
