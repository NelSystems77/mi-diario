import React, { useState, useEffect, useRef } from 'react';
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
  
  const tabsRef = useRef(null);

  // Cargar datos del paciente
  useEffect(() => {
    const loadPatientData = async () => {
      if (!patient?.patientId) return;
      
      setLoading(true);

      // 1. Cargar entradas del diario
      if (patient.permissions?.viewDiary) {
        try {
          const diaryRef = collection(db, 'diaryEntries');
          const diaryQuery = query(
            diaryRef,
            where('userId', '==', patient.patientId),
            where('shareWithTherapist', '==', true),
            orderBy('date', 'desc'),
            limit(30)
          );
          const diarySnapshot = await getDocs(diaryQuery);
          
          const entries = diarySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDiaryEntries(entries);

          if (patient.permissions?.viewEmotions) {
            processEmotionData(entries);
          }
        } catch (error) {
          console.error('Error cargando diario:', error);
          setDiaryEntries([]);
        }
      }

      // 2. Cargar datos de autocuidado
      if (patient.permissions?.viewSelfcare) {
        try {
          const selfcareRef = collection(db, 'selfcare');
          const selfcareQuery = query(
            selfcareRef,
            where('userId', '==', patient.patientId),
            orderBy('date', 'desc'),
            limit(30)
          );
          const selfcareSnapshot = await getDocs(selfcareQuery);
          
          const selfcareItems = selfcareSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSelfcareData(selfcareItems);
        } catch (error) {
          console.error('Error cargando selfcare:', error);
          setSelfcareData([]);
        }
      }

      // 3. Cargar notas del terapeuta
      try {
        const notesRef = collection(db, 'therapistNotes');
        const notesQuery = query(
          notesRef,
          where('patientId', '==', patient.patientId),
          orderBy('sessionDate', 'desc')
        );
        const notesSnapshot = await getDocs(notesQuery);
        
        const notes = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTherapistNotes(notes);
      } catch (error) {
        console.error('Error cargando notas:', error);
        setTherapistNotes([]);
      }

      setLoading(false);
    };

    loadPatientData();
  }, [patient]);

  // Navegación automática de tabs
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`button[data-tab="${tabName}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        });
      }
    }
  };

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
            return moodMap[entry.trafficLight] || 0;
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

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      
      const checkNewPage = (requiredSpace = 20) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };
      
      // Header con gradiente
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('Mi Diario', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text('Expediente del Paciente', pageWidth / 2, 28, { align: 'center' });
      
      yPosition = 50;
      
      // Información del Paciente
      doc.setTextColor(45, 52, 54);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Información del Paciente', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Nombre: ${patient.patientData.name}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Email: ${patient.patientData.email}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Estado: ${patient.status === 'active' ? 'Activo' : 'Pendiente'}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Fecha de ingreso: ${formatDate(patient.createdAt)}`, 20, yPosition);
      yPosition += 15;
      
      doc.setDrawColor(225, 232, 237);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;
      
      // Estadísticas
      checkNewPage(60);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Resumen Estadístico', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      const stats = [
        { label: 'Entradas compartidas', value: diaryEntries.length },
        { label: 'Sesiones registradas', value: therapistNotes.length },
        { label: 'Días de autocuidado', value: selfcareData.length }
      ];
      
      stats.forEach(stat => {
        doc.text(`${stat.label}: ${stat.value}`, 20, yPosition);
        yPosition += 7;
      });
      
      yPosition += 10;
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;
      
      // Entradas del Diario
      if (patient.permissions?.viewDiary && diaryEntries.length > 0) {
        checkNewPage(60);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Entradas del Diario', 20, yPosition);
        yPosition += 10;
        
        const validEntries = diaryEntries.filter(entry => 
          entry.whatHappened || entry.thought || entry.kinderView || entry.difficultImpulses
        );
        
        validEntries.slice(0, 10).forEach((entry, index) => {
          checkNewPage(50);
          
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`${formatDate(entry.date)}`, 20, yPosition);
          
          const moodMap = { 'green': 'Bien', 'yellow': 'Regular', 'red': 'Mal' };
          const moodText = moodMap[entry.trafficLight] || 'Sin especificar';
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(`Estado: ${moodText}`, 100, yPosition);
          doc.text(`Intensidad: ${entry.intensity || 0}/10`, 150, yPosition);
          yPosition += 7;
          
          if (entry.emotions && entry.emotions.length > 0) {
            doc.setFont(undefined, 'italic');
            const emotionsText = entry.emotions.join(', ');
            doc.text(`Emociones: ${emotionsText}`, 25, yPosition);
            yPosition += 6;
            doc.setFont(undefined, 'normal');
          }
          
          if (entry.whatHappened) {
            doc.setFont(undefined, 'bold');
            doc.text('Qué pasó:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitText = doc.splitTextToSize(entry.whatHappened, pageWidth - 55);
            splitText.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
            yPosition += 3;
          }
          
          if (entry.thought) {
            doc.setFont(undefined, 'bold');
            doc.text('Pensamiento:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitText = doc.splitTextToSize(entry.thought, pageWidth - 55);
            splitText.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
            yPosition += 3;
          }
          
          if (entry.kinderView) {
            doc.setFont(undefined, 'bold');
            doc.text('Vista más amable:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitText = doc.splitTextToSize(entry.kinderView, pageWidth - 55);
            splitText.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
            yPosition += 3;
          }
          
          if (entry.difficultImpulses && patient.permissions?.viewImpulses) {
            doc.setFont(undefined, 'bold');
            doc.setTextColor(133, 100, 4);
            doc.text('⚠ Impulsos difíciles:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitText = doc.splitTextToSize(entry.difficultImpulses, pageWidth - 55);
            splitText.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
            doc.setTextColor(45, 52, 54);
            yPosition += 3;
          }
          
          yPosition += 8;
          
          if (index < validEntries.length - 1) {
            doc.setDrawColor(225, 232, 237);
            doc.line(25, yPosition, pageWidth - 25, yPosition);
            yPosition += 10;
          }
        });
        
        if (validEntries.length > 10) {
          doc.setFontSize(10);
          doc.setFont(undefined, 'italic');
          doc.text(`... y ${validEntries.length - 10} entradas más`, 20, yPosition);
          yPosition += 10;
        } else if (validEntries.length === 0) {
          doc.setFontSize(10);
          doc.setFont(undefined, 'italic');
          doc.text('No hay entradas con contenido para mostrar', 20, yPosition);
          yPosition += 10;
        }
        
        yPosition += 5;
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 15;
      }
      
      // Notas del Terapeuta
      if (therapistNotes.length > 0) {
        checkNewPage(60);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Notas del Terapeuta', 20, yPosition);
        yPosition += 10;
        
        therapistNotes.slice(0, 5).forEach((note, index) => {
          checkNewPage(50);
          
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`Sesión #${note.sessionNumber || index + 1}`, 20, yPosition);
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(formatDate(note.sessionDate), 120, yPosition);
          yPosition += 7;
          
          if (note.observations) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text('Observaciones:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitObs = doc.splitTextToSize(note.observations, pageWidth - 55);
            splitObs.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
          }
          
          if (note.homework) {
            yPosition += 3;
            doc.setFont(undefined, 'bold');
            doc.text('Tarea asignada:', 25, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitHW = doc.splitTextToSize(note.homework, pageWidth - 55);
            splitHW.forEach(line => {
              checkNewPage();
              doc.text(line, 30, yPosition);
              yPosition += 5;
            });
          }
          
          yPosition += 10;
        });
        
        if (therapistNotes.length > 5) {
          doc.setFontSize(10);
          doc.setFont(undefined, 'italic');
          doc.text(`... y ${therapistNotes.length - 5} sesiones más`, 20, yPosition);
          yPosition += 10;
        }
      }
      
      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generado el ${new Date().toLocaleDateString('es-ES')} | Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          'Mi Diario - Expediente Confidencial',
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
      
      const fileName = `Expediente_${patient.patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      alert('✅ PDF generado exitosamente');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('❌ Error al generar el PDF. Inténtalo de nuevo.');
    }
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

      <div className="record-tabs" ref={tabsRef}>
        <button
          data-tab="overview"
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabClick('overview')}
        >
          <TrendingUp size={18} />
          Resumen
        </button>
        <button
          data-tab="diary"
          className={`tab ${activeTab === 'diary' ? 'active' : ''}`}
          onClick={() => handleTabClick('diary')}
          disabled={!patient.permissions?.viewDiary}
        >
          <FileText size={18} />
          Diario ({diaryEntries.length})
        </button>
        <button
          data-tab="emotions"
          className={`tab ${activeTab === 'emotions' ? 'active' : ''}`}
          onClick={() => handleTabClick('emotions')}
          disabled={!patient.permissions?.viewEmotions}
        >
          <Heart size={18} />
          Emociones
        </button>
        <button
          data-tab="selfcare"
          className={`tab ${activeTab === 'selfcare' ? 'active' : ''}`}
          onClick={() => handleTabClick('selfcare')}
          disabled={!patient.permissions?.viewSelfcare}
        >
          <CheckSquare size={18} />
          Autocuidado
        </button>
        <button
          data-tab="notes"
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => handleTabClick('notes')}
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
                            stepSize: 1,
                            color: '#f8f9fa',
                            font: { size: 12, weight: 'bold' }
                          },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                          ticks: {
                            color: '#f8f9fa',
                            font: { size: 11 }
                          },
                          grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#f8f9fa',
                            font: { size: 14, weight: 'bold' },
                            padding: 15
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(45, 52, 54, 0.95)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: '#667eea',
                          borderWidth: 2
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
                      <span className={`mood-badge ${entry.trafficLight}`}>
                        {entry.trafficLight === 'green' && '🟢 Bien'}
                        {entry.trafficLight === 'yellow' && '🟡 Regular'}
                        {entry.trafficLight === 'red' && '🔴 Mal'}
                      </span>
                    </div>
                    <p className="entry-text">
                      {entry.whatHappened?.substring(0, 150) || entry.thought?.substring(0, 150) || 'Sin contenido'}
                      {(entry.whatHappened?.length > 150 || entry.thought?.length > 150) && '...'}
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
                        <span className={`mood-badge-large ${entry.trafficLight}`}>
                          {entry.trafficLight === 'green' && '🟢 Estado: Bien'}
                          {entry.trafficLight === 'yellow' && '🟡 Estado: Regular'}
                          {entry.trafficLight === 'red' && '🔴 Estado: Mal'}
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
                      {entry.whatHappened && (
                        <div className="content-section">
                          <strong>Qué pasó:</strong>
                          <p>{entry.whatHappened}</p>
                        </div>
                      )}

                      {entry.thought && (
                        <div className="content-section">
                          <strong>Pensamiento:</strong>
                          <p>{entry.thought}</p>
                        </div>
                      )}

                      {entry.kinderView && (
                        <div className="content-section highlight">
                          <strong>Vista más amable:</strong>
                          <p>{entry.kinderView}</p>
                        </div>
                      )}

                      {entry.difficultImpulses && patient.permissions?.viewImpulses && (
                        <div className="content-section sensitive">
                          <strong>⚠️ Impulsos difíciles:</strong>
                          <p>{entry.difficultImpulses}</p>
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
                              stepSize: 1,
                              color: '#f8f9fa',
                              font: { size: 14, weight: 'bold' }
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                          },
                          x: {
                            ticks: {
                              color: '#f8f9fa',
                              font: { size: 12 }
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              color: '#f8f9fa',
                              font: { size: 16, weight: 'bold' },
                              padding: 20
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(45, 52, 54, 0.95)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#667eea',
                            borderWidth: 2
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
              <div className="selfcare-content-full">
                <div className="selfcare-summary card">
                  <h3>Resumen de Autocuidado</h3>
                  <div className="selfcare-stats-grid">
                    <div className="selfcare-stat">
                      <div className="stat-icon-small">📅</div>
                      <div>
                        <div className="stat-number-small">{selfcareData.length}</div>
                        <div className="stat-label-small">Días registrados</div>
                      </div>
                    </div>
                    <div className="selfcare-stat">
                      <div className="stat-icon-small">✅</div>
                      <div>
                        <div className="stat-number-small">
                          {selfcareData.reduce((sum, day) => sum + day.points, 0)}
                        </div>
                        <div className="stat-label-small">Puntos totales</div>
                      </div>
                    </div>
                    <div className="selfcare-stat">
                      <div className="stat-icon-small">⭐</div>
                      <div>
                        <div className="stat-number-small">
                          {Math.round(selfcareData.reduce((sum, day) => sum + day.points, 0) / selfcareData.length)}
                        </div>
                        <div className="stat-label-small">Promedio por día</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="selfcare-tasks card">
                  <h3>Progreso por Actividad</h3>
                  {(() => {
                    const taskCounts = {};
                    const taskLabels = {
                      makeBed: '🛏️ Tender la cama',
                      shower: '🚿 Bañarse',
                      brushTeeth: '🦷 Cepillarse los dientes',
                      eatWell: '🥗 Comer bien',
                      sleepEnough: '😴 Dormir suficiente',
                      goOutside: '🌳 Salir un rato',
                      talkToSomeone: '💬 Hablar con alguien',
                      listenMusic: '🎵 Escuchar música',
                      writeDiary: '📔 Escribir en el diario',
                      bibleReading: '📖 Lectura Bíblica'
                    };

                    selfcareData.forEach(day => {
                      if (day.items) {
                        Object.keys(day.items).forEach(task => {
                          if (day.items[task] === true) {
                            taskCounts[task] = (taskCounts[task] || 0) + 1;
                          }
                        });
                      }
                    });

                    const sortedTasks = Object.entries(taskCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 10);

                    return (
                      <div className="task-progress-list">
                        {sortedTasks.map(([taskId, count]) => (
                          <div key={taskId} className="task-progress-item">
                            <span className="task-name">{taskLabels[taskId] || taskId}</span>
                            <div className="task-bar-container">
                              <div 
                                className="task-bar-fill"
                                style={{ width: `${(count / selfcareData.length) * 100}%` }}
                              />
                            </div>
                            <span className="task-count">{count}/{selfcareData.length}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="selfcare-calendar card">
                  <h3>Últimos 30 Días</h3>
                  <div className="calendar-grid">
                    {selfcareData.slice(0, 30).reverse().map((day, index) => {
                      const date = new Date(day.date);
                      const dayNumber = date.getDate();
                      const completionRate = (Object.values(day.items || {}).filter(v => v === true).length / 10) * 100;
                      
                      return (
                        <div 
                          key={index} 
                          className="calendar-day"
                          style={{
                            backgroundColor: completionRate >= 80 ? '#00b894' :
                                            completionRate >= 50 ? '#fdcb6e' :
                                            completionRate >= 20 ? '#fab1a0' : '#dfe6e9'
                          }}
                          title={`${date.toLocaleDateString('es-ES')}: ${Math.round(completionRate)}% completado`}
                        >
                          {dayNumber}
                        </div>
                      );
                    })}
                  </div>
                  <div className="calendar-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#00b894' }}></div>
                      <span>80-100%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#fdcb6e' }}></div>
                      <span>50-79%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#fab1a0' }}></div>
                      <span>20-49%</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#dfe6e9' }}></div>
                      <span>0-19%</span>
                    </div>
                  </div>
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
