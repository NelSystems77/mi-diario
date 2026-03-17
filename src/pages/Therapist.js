import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  UserPlus,
  Search,
  Filter
} from 'lucide-react';
import PatientList from '../components/therapist/PatientList';
import PatientRecord from '../components/therapist/PatientRecord';
import InvitePatient from '../components/therapist/InvitePatient';
import TherapistStats from '../components/therapist/TherapistStats';
import './Therapist.css';

// Firebase imports
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const Therapist = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [activeView, setActiveView] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [isTherapist, setIsTherapist] = useState(false);

  useEffect(() => {
    const checkTherapistRole = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsTherapist(userData.isTherapist === true || userData.role === 'therapist');
        }
      } catch (error) {
        console.error('Error verificando rol de terapeuta:', error);
      }
    };

    checkTherapistRole();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !isTherapist) return;

    const loadPatients = async () => {
      try {
        setLoading(true);
        console.log('🔍 Cargando pacientes para therapistId:', currentUser.uid);
        
        const relationshipsRef = collection(db, 'therapist-patient-relationships');
        const q = query(
          relationshipsRef,
          where('therapistId', '==', currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        console.log('📋 Relaciones encontradas:', snapshot.size);
        
        const patientsList = [];
        
        for (const docSnap of snapshot.docs) {
          const relationship = { id: docSnap.id, ...docSnap.data() };
          console.log('👤 Procesando paciente:', relationship.patientName);
          
          try {
            const entriesRef = collection(db, 'diaryEntries');
            const entriesQuery = query(
              entriesRef,
              where('userId', '==', relationship.patientId),
              where('shareWithTherapist', '==', true)
            );
            const entriesSnapshot = await getDocs(entriesQuery);
            
            patientsList.push({
              ...relationship,
              patientData: {
                name: relationship.patientName || 'Sin nombre',
                email: relationship.patientEmail,
                createdAt: relationship.createdAt
              },
              sharedEntriesCount: entriesSnapshot.size
            });
          } catch (error) {
            console.error('Error cargando datos del paciente:', error);
            patientsList.push({
              ...relationship,
              patientData: {
                name: relationship.patientName || 'Sin nombre',
                email: relationship.patientEmail,
                createdAt: relationship.createdAt
              },
              sharedEntriesCount: 0
            });
          }
        }
        
        console.log('✅ Pacientes cargados:', patientsList.length);
        setPatients(patientsList);
        calculateStats(patientsList);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando pacientes:', error);
        setLoading(false);
      }
    };

    loadPatients();
  }, [currentUser, isTherapist]);

  const calculateStats = (patientsList) => {
    const active = patientsList.filter(p => p.status === 'active').length;
    const pending = patientsList.filter(p => p.status === 'pending').length;
    
    setStats({
      totalPatients: patientsList.length,
      activePatients: active,
      pendingInvitations: pending,
      sessionsThisMonth: 0
    });
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientData.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const openPatientRecord = (patient) => {
    setSelectedPatient(patient);
    setActiveView('patient-record');
  };

  const backToList = () => {
    setSelectedPatient(null);
    setActiveView('patients');
  };

  if (!currentUser) {
    return (
      <div className="therapist-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Debes iniciar sesión para acceder al panel de terapeuta.</p>
        </div>
      </div>
    );
  }

  if (!isTherapist) {
    return (
      <div className="therapist-container">
        <div className="access-denied">
          <h2>Acceso Restringido</h2>
          <p>Solo terapeutas verificados pueden acceder a esta sección.</p>
          <p className="help-text">
            Si eres terapeuta y necesitas acceso, contacta al administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-container">
      <div className="therapist-header">
        <Users size={80} className="therapist-icon" />
        <h1>{t('therapist.title') || 'Panel del Terapeuta'}</h1>
        <p>Gestión de pacientes y expedientes</p>
      </div>

      <div className="therapist-tabs">
        <button
          className={`therapist-tab ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <TrendingUp size={18} />
          Dashboard
        </button>
        <button
          className={`therapist-tab ${activeView === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveView('patients')}
        >
          <Users size={18} />
          Pacientes ({stats?.activePatients || 0})
        </button>
        <button
          className={`therapist-tab ${activeView === 'invite' ? 'active' : ''}`}
          onClick={() => setActiveView('invite')}
        >
          <UserPlus size={18} />
          Invitar Paciente
        </button>
      </div>

      <div className="therapist-content">
        {activeView === 'dashboard' && (
          <div className="dashboard-view">
            {loading ? (
              <div className="loading-message">Cargando estadísticas...</div>
            ) : (
              <>
                <TherapistStats stats={stats} />
                
                <div className="quick-access">
                  <h2>Acceso Rápido</h2>
                  <div className="quick-access-grid">
                    <div className="quick-access-item" onClick={() => setActiveView('patients')}>
                      <Users size={24} />
                      <span className="quick-access-count">{stats?.activePatients || 0}</span>
                      <span>Pacientes Activos</span>
                    </div>
                    
                    <div className="quick-access-item" onClick={() => setActiveView('invite')}>
                      <UserPlus size={24} />
                      <span className="quick-access-count">{stats?.pendingInvitations || 0}</span>
                      <span>Invitaciones Pendientes</span>
                    </div>
                    
                    <div className="quick-access-item">
                      <Calendar size={24} />
                      <span className="quick-access-count">{stats?.sessionsThisMonth || 0}</span>
                      <span>Sesiones Este Mes</span>
                    </div>
                    
                    <div className="quick-access-item">
                      <FileText size={24} />
                      <span className="quick-access-count">
                        {patients.reduce((sum, p) => sum + (p.sharedEntriesCount || 0), 0)}
                      </span>
                      <span>Entradas Compartidas</span>
                    </div>
                  </div>
                </div>

                {patients.length > 0 && (
                  <div className="recent-patients">
                    <h2>Pacientes Recientes</h2>
                    <div className="patients-preview-list">
                      {patients.slice(0, 5).map(patient => (
                        <div 
                          key={patient.id} 
                          className="patient-preview"
                          onClick={() => openPatientRecord(patient)}
                        >
                          <div className="patient-avatar">
                            {patient.patientData.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="patient-info">
                            <span className="patient-name">{patient.patientData.name}</span>
                            <span className="patient-email">{patient.patientData.email}</span>
                          </div>
                          <div className="patient-status">
                            <span className={`status-badge ${patient.status}`}>
                              {patient.status === 'active' ? 'Activo' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeView === 'patients' && (
          <div className="patients-view">
            <div className="patients-controls card">
              <div className="search-bar">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar paciente por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  <Filter size={16} />
                  Todos ({patients.length})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('active')}
                >
                  Activos ({patients.filter(p => p.status === 'active').length})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pendientes ({patients.filter(p => p.status === 'pending').length})
                </button>
              </div>
            </div>

            <PatientList 
              patients={filteredPatients}
              onSelectPatient={openPatientRecord}
              loading={loading}
            />
          </div>
        )}

        {activeView === 'patient-record' && selectedPatient && (
          <PatientRecord 
            patient={selectedPatient}
            onBack={backToList}
          />
        )}

        {activeView === 'invite' && (
          <InvitePatient 
            therapistId={currentUser.uid}
            onSuccess={() => {
              setActiveView('patients');
              // Recargar pacientes después de invitar
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Therapist;
