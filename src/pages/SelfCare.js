import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Check, Award } from 'lucide-react';
import './SelfCare.css';

const SelfCare = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [checklist, setChecklist] = useState({});
  const [todayPoints, setTodayPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const selfCareItems = [
    { id: 'makeBed', points: 5 },
    { id: 'shower', points: 5 },
    { id: 'brushTeeth', points: 5 },
    { id: 'eatWell', points: 5 },
    { id: 'sleepEnough', points: 5 },
    { id: 'goOutside', points: 5 },
    { id: 'talkToSomeone', points: 5 },
    { id: 'listenMusic', points: 5 },
    { id: 'writeDiary', points: 5 }
  ];

  useEffect(() => {
    fetchTodayChecklist();
    fetchUserPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const completedCount = Object.values(checklist).filter(Boolean).length;

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

      <div className="checklist-grid">
        {selfCareItems.map(item => (
          <button
            key={item.id}
            className={`checklist-item card ${checklist[item.id] ? 'checked' : ''}`}
            onClick={() => toggleItem(item.id, item.points)}
          >
            <div className="check-circle">
              {checklist[item.id] && <Check size={24} strokeWidth={3} />}
            </div>
            <div className="item-content">
              <span className="item-label">{t(`selfcare.${item.id}`)}</span>
              <span className="item-points">+{item.points} pts</span>
            </div>
          </button>
        ))}
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
