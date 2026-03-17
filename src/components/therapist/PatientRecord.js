import React, { useState, useEffect } from 'react';
import './THERAPIST-COMPONENTS-STYLES.css';
import { 
  ArrowLeft,
  Calendar,
  FileText,
  TrendingUp,
  Heart,
  CheckSquare,
  Edit3,
  Plus,
  Download,
  AlertCircle
} from 'lucide-react';
import SessionNotes from './SessionNotes';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

const PatientRecord = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [emotionData, setEmotionData] = useState(null);
  const [selfcareData, setSelfcareData] = useState([]);
  const [therapistNotes, setTherapistNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);

  // Cargar datos del paciente
  useEffect(() => {
    const loadPatientData = async () => {
      if (!patient?.patientId) return;
      
      setLoading(true);

      // 1. Cargar entradas del diario
      if (patient.permissions?.viewDiary) {
        try {
          console.log('📖 Intentando cargar diario para patientId:', patient.patientId);
          const diaryRef = collection(db, 'diaryEntries');
          const diaryQuery = query(
            diaryRef,
            where('userId', '==', patient.patientId),
            where('shareWithTherapist', '==', true),
            orderBy('date', 'desc'),
            limit(30)
          );
          console.log('📖 Ejecutando query de diario...');
          const diarySnapshot = await getDocs(diaryQuery);
          console.log('✅ Diario cargado:', diarySnapshot.size, 'entradas');
          
          const entries = diarySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDiaryEntries(entries);

          // Procesar datos emocionales
          if (patient.permissions?.viewEmotions) {
            processEmotionData(entries);
          }
        } catch (error) {
          console.error('❌ ERROR CARGANDO DIARIO:', error.code, '-', error.message);
          setDiaryEntries([]);
        }
      }

      // 2. Cargar datos de autocuidado
      if (patient.permissions?.viewSelfcare) {
        try {
          console.log('💪 Intentando cargar selfcare para patientId:', patient.patientId);
          const selfcareRef = collection(db, 'selfcare');
          const selfcareQuery = query(
            selfcareRef,
            where('userId', '==', patient.patientId),
            orderBy('date', 'desc'),
            limit(30)
          );
          console.log('💪 Ejecutando query de selfcare...');
          const selfcareSnapshot = await getDocs(selfcareQuery);
          console.log('✅ Selfcare cargado:', selfcareSnapshot.size, 'documentos');
          
          const selfcareItems = selfcareSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSelfcareData(selfcareItems);
        } catch (error) {
          console.error('❌ ERROR CARGANDO SELFCARE:', error.code, '-', error.message);
          setSelfcareData([]);
        }
      }

      // 3. Cargar notas del terapeuta
      try {
        console.log('📝 Intentando cargar notas del terapeuta para patientId:', patient.patientId);
        const notesRef = collection(db, 'therapistNotes');
        const notesQuery = query(
          notesRef,
          where('patientId', '==', patient.patientId),
          orderBy('sessionDate', 'desc')
        );
        console.log('📝 Ejecutando query de notas...');
        const notesSnapshot = await getDocs(notesQuery);
        console.log('✅ Notas cargadas:', notesSnapshot.size, 'notas');
        
        const notes = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTherapistNotes(notes);
      } catch (error) {
        console.error('❌ ERROR CARGANDO NOTAS:', error.code, '-', error.message);
        setTherapistNotes([]);
      }

      setLoading(false);
      console.log('✅ Carga de datos del paciente completada');
    };

    loadPatientData();
  }, [patient]);

  // Procesar datos emocionales para Chart.js
  const processEmotionData = (entries) => {
    const last30Days = entries.slice(0, 30).reverse();
    
    const chartData = {
      labels: last30Days.map(entry => {
        const date = entry.date?.toDate ? entry.date.toDate() : new Date(entry.date);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      }),
      datasets: [
        {
          label: 'Estado Emocional',
          data: last30Days.map(entry => {
            const moodMap = { 'green': 3, 'yellow': 2, 'red': 1 };
            return moodMap[entry.mood] || 0;
          }),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4
        },
        {
          label: 'Intensidad Emocional',
          data: last30Days.map(entry => entry.intensity || 0),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4
        }
      ]
    };

    setEmotionData(chartData);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToPDF = () => {
    alert('Exportación a PDF en desarrollo');
  };

  if (loading) {
    return (
      <div className="patient-record-loading">
        <div className="loading-spinner"></div>
        <p>Cargando expediente...</p>
      </div>
    );
  }

  return (
    <div className="patient-record">
      <div className="record-header card">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Volver a Pacientes
        </button>

        <div className="patient-info-header">
          <div className="patient-avatar-xl">
            {patient.patientData.name.charAt(0).toUpperCase()}
          </div>
          <div className="patient-details">
            <h2>{patient.patientData.name}</h2>
            <p className="patient-email">{patient.patientData.email}</p>
            <div className="patient-meta">
              <span>Paciente desde {formatDate(patient.createdAt)}</span>
              <span className={`status-badge-large ${patient.status}`}>
                {patient.status === 'active' ? 'Activo' : 'Pendiente'}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportToPDF}>
              <Download size={18} />
              Exportar PDF
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowNewSessionModal(true)}
            >
              <Plus size={18} />
              Nueva Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="record-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={18} />
          Resumen
        </button>
        <button
          className={`tab ${activeTab === 'diary' ? 'active' : ''}`}
          onClick={() => setActiveTab('diary')}
          disabled={!patient.permissions?.viewDiary}
        >
          <FileText size={18} />
          Diario ({diaryEntries.length})
        </button>
        <button
          className={`tab ${activeTab === 'emotions' ? 'active' : ''}`}
          onClick={() => setActiveTab('emotions')}
          disabled={!patient.permissions?.viewEmotions}
        >
          <Heart size={18} />
          Emociones
        </button>
        <button
          className={`tab ${activeTab === 'selfcare' ? 'active' : ''}`}
          onClick={() => setActiveTab('selfcare')}
          disabled={!patient.permissions?.viewSelfcare}
        >
          <CheckSquare size={18} />
          Autocuidado
        </button>
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <Edit3 size={18} />
          Mis Notas ({therapistNotes.length})
        </button>
      </div>

      <div className="record-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card card">
                <FileText size={24} className="stat-icon" />
                <div className="stat-data">
                  <span className="stat-number">{diaryEntries.length}</span>
                  <span className="stat-label">Entradas Compartidas</span>
                </div>
              </div>

              <div className="stat-card card">
                <Edit3 size={24} className="stat-icon" />
                <div className="stat-data">
                  <span className="stat-number">{therapistNotes.length}</span>
                  <span className="stat-label">Sesiones Registradas</span>
                </div>
              </div>

              <div className="stat-card card">
                <Calendar size={24} className="stat-icon" />
                <div className="stat-data">
                  <span className="stat-number">
                    {patient.nextSessionDate ? formatDate(patient.nextSessionDate) : 'Sin programar'}
                  </span>
                  <span className="stat-label">Próxima Sesión</span>
                </div>
              </div>

              <div className="stat-card card">
                <CheckSquare size={24} className="stat-icon" />
                <div className="stat-data">
                  <span className="stat-number">{selfcareData.length}</span>
                  <span className="stat-label">Días de Autocuidado</span>
                </div>
              </div>
            </div>

            {emotionData && patient.permissions?.viewEmotions && (
              <div className="emotions-chart card">
                <h3>Tendencia Emocional (Últimos 30 días)</h3>
                <div className="chart-container">
                  <Line 
                    data={emotionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {patient.permissions?.viewDiary && diaryEntries.length > 0 && (
              <div className="recent-entries card">
                <h3>Últimas Entradas del Diario</h3>
                {diaryEntries.slice(0, 3).map(entry => (
                  <div key={entry.id} className="entry-preview">
                    <div className="entry-header">
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <span className={`mood-badge ${entry.mood}`}>
                        {entry.mood === 'green' && '🟢 Bien'}
                        {entry.mood === 'yellow' && '🟡 Regular'}
                        {entry.mood === 'red' && '🔴 Mal'}
                      </span>
                    </div>
                    <p className="entry-text">
                      {entry.reflection?.substring(0, 150)}
                      {entry.reflection?.length > 150 && '...'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {therapistNotes.length > 0 && (
              <div className="last-session card">
                <h3>Última Sesión</h3>
                {(() => {
                  const lastNote = therapistNotes[0];
                  return (
                    <div className="session-summary">
                      <div className="session-meta">
                        <Calendar size={16} />
                        <span>{formatDate(lastNote.sessionDate)}</span>
                        <span>•</span>
                        <span>Sesión #{lastNote.sessionNumber}</span>
                      </div>
                      <p><strong>Observaciones:</strong> {lastNote.observations}</p>
                      {lastNote.homework && (
                        <p><strong>Tarea asignada:</strong> {lastNote.homework}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'diary' && (
          <div className="diary-tab">
            {!patient.permissions?.viewDiary ? (
              <div className="no-permission card">
                <AlertCircle size={48} />
                <h3>Sin Permiso</h3>
                <p>El paciente no ha autorizado el acceso a sus entradas de diario.</p>
              </div>
            ) : diaryEntries.length === 0 ? (
              <div className="no-data card">
                <FileText size={48} />
                <h3>Sin Entradas</h3>
                <p>El paciente aún no ha compartido entradas de su diario.</p>
              </div>
            ) : (
              <div className="diary-entries">
                {diaryEntries.map(entry => (
                  <div key={entry.id} className="diary-entry-full card">
                    <div className="entry-header-full">
                      <div className="entry-date-full">
                        <Calendar size={16} />
                        <span>{formatDate(entry.date)}</span>
                        <span className="entry-time">{formatTime(entry.date)}</span>
                      </div>
                      <div className="entry-mood-full">
                        <span className={`mood-badge-large ${entry.mood}`}>
                          {entry.mood === 'green' && '🟢 Estado: Bien'}
                          {entry.mood === 'yellow' && '🟡 Estado: Regular'}
                          {entry.mood === 'red' && '🔴 Estado: Mal'}
                        </span>
                        <span className="intensity-badge">
                          Intensidad: {entry.intensity}/10
                        </span>
                      </div>
                    </div>

                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="entry-emotions">
                        <strong>Emociones del día:</strong>
                        <div className="emotions-tags">
                          {entry.emotions.map((emotion, idx) => (
                            <span key={idx} className="emotion-tag">{emotion}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="entry-content">
                      <div className="content-section">
                        <strong>Reflexión:</strong>
                        <p>{entry.reflection}</p>
                      </div>

                      {entry.reframe && (
                        <div className="content-section highlight">
                          <strong>Replanteamiento positivo:</strong>
                          <p>{entry.reframe}</p>
                        </div>
                      )}

                      {entry.impulses && patient.permissions?.viewImpulses && (
                        <div className="content-section sensitive">
                          <strong>⚠️ Impulsos difíciles:</strong>
                          <p>{entry.impulses}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'emotions' && (
          <div className="emotions-tab">
            {!patient.permissions?.viewEmotions ? (
              <div className="no-permission card">
                <AlertCircle size={48} />
                <h3>Sin Permiso</h3>
                <p>El paciente no ha autorizado el acceso a sus datos emocionales.</p>
              </div>
            ) : emotionData ? (
              <div className="emotions-content">
                <div className="emotions-chart-large card">
                  <h3>Evolución Emocional</h3>
                  <div className="chart-container-large">
                    <Line 
                      data={emotionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="emotion-analysis card">
                  <h3>Análisis de Emociones Frecuentes</h3>
                  {(() => {
                    const allEmotions = diaryEntries.flatMap(e => e.emotions || []);
                    const emotionCounts = {};
                    allEmotions.forEach(emotion => {
                      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
                    });
                    const sortedEmotions = Object.entries(emotionCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 10);

                    return (
                      <div className="emotions-frequency">
                        {sortedEmotions.map(([emotion, count]) => (
                          <div key={emotion} className="emotion-bar">
                            <span className="emotion-name">{emotion}</span>
                            <div className="bar-container">
                              <div 
                                className="bar-fill"
                                style={{ width: `${(count / sortedEmotions[0][1]) * 100}%` }}
                              ></div>
                            </div>
                            <span className="emotion-count">{count}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="no-data card">
                <Heart size={48} />
                <h3>Sin Datos</h3>
                <p>No hay suficientes datos emocionales para mostrar.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'selfcare' && (
          <div className="selfcare-tab">
            {!patient.permissions?.viewSelfcare ? (
              <div className="no-permission card">
                <AlertCircle size={48} />
                <h3>Sin Permiso</h3>
                <p>El paciente no ha autorizado el acceso a sus datos de autocuidado.</p>
              </div>
            ) : selfcareData.length === 0 ? (
              <div className="no-data card">
                <CheckSquare size={48} />
                <h3>Sin Datos</h3>
                <p>El paciente aún no ha registrado actividades de autocuidado.</p>
              </div>
            ) : (
              <div className="selfcare-content">
                <div className="card">
                  <h3>Progreso de Autocuidado</h3>
                  <p>Visualización de hábitos saludables en desarrollo...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <SessionNotes
            patientId={patient.patientId}
            notes={therapistNotes}
            onNotesUpdate={(newNotes) => setTherapistNotes(newNotes)}
          />
        )}
      </div>

      {showNewSessionModal && (
        <SessionNotes
          patientId={patient.patientId}
          notes={therapistNotes}
          onNotesUpdate={(newNotes) => {
            setTherapistNotes(newNotes);
            setShowNewSessionModal(false);
          }}
          isModal={true}
          onClose={() => setShowNewSessionModal(false)}
        />
      )}
    </div>
  );
};

export default PatientRecord;
