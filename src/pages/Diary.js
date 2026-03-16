import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Calendar, Save, Eye, Share2 } from 'lucide-react';
import './Diary.css';

const Diary = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [trafficLight, setTrafficLight] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [whatHappened, setWhatHappened] = useState('');
  const [thought, setThought] = useState('');
  const [kinderView, setKinderView] = useState('');
  const [difficultImpulses, setDifficultImpulses] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [entries, setEntries] = useState([]);

  const [shareWithTherapist, setShareWithTherapist] = useState(false);
  
  
  const emotions = [
    'happy', 'sad', 'anxious', 'calm', 'angry',
    'grateful', 'hopeful', 'lonely', 'proud', 'frustrated'
  ];

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSave = async () => {
    if (!trafficLight) {
      alert('Por favor selecciona el semáforo emocional');
      return;
    }

    setSaving(true);

    try {
      const entryData = {
        userId: currentUser.uid,
        date: new Date().toISOString(),
        trafficLight,
        intensity,
        emotions: selectedEmotions,
        whatHappened,
        thought,
        kinderView,
        difficultImpulses,
        shareWithTherapist: shareWithTherapist,
        sharedAt: shareWithTherapist ? new Date().toISOString() : null
      };

      await addDoc(collection(db, 'diaryEntries'), entryData);

      // Award points
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        points: increment(5)
      });

      // Reset form
      setTrafficLight('');
      setIntensity(5);
      setSelectedEmotions([]);
      setWhatHappened('');
      setThought('');
      setKinderView('');
      setDifficultImpulses('');
      setShareWithTherapist(false);

      alert('¡Entrada guardada! +5 puntos');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error al guardar la entrada');
    } finally {
      setSaving(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const q = query(
        collection(db, 'diaryEntries'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const entriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData);
      setShowEntries(true);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  return (
    <div className="diary-page">
      <div className="page-header">
        <h1>{t('diary.title')}</h1>
        <button className="btn btn-secondary" onClick={fetchEntries}>
          <Eye size={20} />
          {t('diary.viewEntries')}
        </button>
      </div>

      {!showEntries ? (
        <div className="diary-form fade-in">
          {/* Traffic Light */}
          <div className="form-section card">
            <h3>{t('diary.emotionalTrafficLight')}</h3>
            <div className="traffic-light">
              <button
                className={`traffic-button green ${trafficLight === 'green' ? 'active' : ''}`}
                onClick={() => setTrafficLight('green')}
              >
                <div className="traffic-circle"></div>
                <span>{t('diary.green')}</span>
              </button>
              <button
                className={`traffic-button yellow ${trafficLight === 'yellow' ? 'active' : ''}`}
                onClick={() => setTrafficLight('yellow')}
              >
                <div className="traffic-circle"></div>
                <span>{t('diary.yellow')}</span>
              </button>
              <button
                className={`traffic-button red ${trafficLight === 'red' ? 'active' : ''}`}
                onClick={() => setTrafficLight('red')}
              >
                <div className="traffic-circle"></div>
                <span>{t('diary.red')}</span>
              </button>
            </div>
          </div>

          {/* Intensity */}
          <div className="form-section card">
            <h3>{t('diary.intensity')} ({intensity}/10)</h3>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="intensity-slider"
            />
          </div>

          {/* Emotions */}
          <div className="form-section card">
            <h3>{t('diary.emotions')}</h3>
            <div className="emotions-grid">
              {emotions.map(emotion => (
                <button
                  key={emotion}
                  className={`emotion-tag ${selectedEmotions.includes(emotion) ? 'active' : ''}`}
                  onClick={() => toggleEmotion(emotion)}
                >
                  {t(`emotions.${emotion}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Free Text */}
          <div className="form-section card">
            <h3>{t('diary.whatHappened')}</h3>
            <textarea
              className="input textarea"
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Cuéntame sobre tu día..."
            />
          </div>

          <div className="form-section card">
            <h3>{t('diary.thought')}</h3>
            <textarea
              className="input textarea"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="¿Qué pensamiento apareció?"
            />
          </div>

          <div className="form-section card">
            <h3>{t('diary.kinderView')}</h3>
            <textarea
              className="input textarea"
              value={kinderView}
              onChange={(e) => setKinderView(e.target.value)}
              placeholder="¿Cómo podrías verlo de manera más amable?"
            />
          </div>

          <div className="form-section card">
            <h3>{t('diary.difficultImpulses')}</h3>
            <textarea
              className="input textarea"
              value={difficultImpulses}
              onChange={(e) => setDifficultImpulses(e.target.value)}
              placeholder="Opcional..."
            />
          </div>
                
          <div className="form-section card share-section">
            <label className="share-toggle-container">
              <div className="share-label-group">
                <Share2 size={20} className={shareWithTherapist ? 'icon-active' : ''} />
                <div>
                  <span className="share-title">Compartir con mi terapeuta</span>
                  <p className="share-description">
                    {shareWithTherapist 
                      ? "Visible para tu terapeuta asignado." 
                      : "Solo tú puedes ver esta entrada."}
                  </p>
                </div>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="share-toggle"
                  checked={shareWithTherapist}
                  onChange={(e) => setShareWithTherapist(e.target.checked)}
                />
                <label htmlFor="share-toggle" className="slider"></label>
              </div>
            </label>
          </div>
                    
          <button
            className="btn btn-primary btn-large"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={20} />
            {saving ? 'Guardando...' : t('diary.save')}
          </button>
        </div>
      ) : (
        <div className="entries-list fade-in">
          <button className="btn btn-secondary mb-3" onClick={() => setShowEntries(false)}>
            ← Volver al formulario
          </button>
          {entries.map(entry => (
            <div key={entry.id} className="entry-card card">
              <div className="entry-header">
                <Calendar size={18} />
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className={`traffic-badge ${entry.trafficLight}`}>
                  {entry.trafficLight === 'green' && '🟢'}
                  {entry.trafficLight === 'yellow' && '🟡'}
                  {entry.trafficLight === 'red' && '🔴'}
                </span>
              </div>
              <p><strong>Intensidad:</strong> {entry.intensity}/10</p>
              {entry.emotions.length > 0 && (
                <p><strong>Emociones:</strong> {entry.emotions.map(e => t(`emotions.${e}`)).join(', ')}</p>
              )}
              {entry.whatHappened && (
                <p className="entry-text">{entry.whatHappened}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diary;
