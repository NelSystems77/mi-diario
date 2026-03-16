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
//import './Therapist.css';

// Firebase imports
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const Therapist = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  // Estados principales
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'patients' | 'patient-record' | 'invite'
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active'); // 'all' | 'active' | 'pending'
  
  // Verificar si el usuario es terapeuta
  const [isTherapist, setIsTherapist] = useState(false);

  // Verificar rol de terapeuta
  useEffect(() => {
    const checkTherapistRole = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsTherapist(userData.isTherapist === true);
        }
      } catch (error) {
        console.error('Error verificando rol de terapeuta:', error);
      }
    };

    checkTherapistRole();
  }, [currentUser]);

  // Cargar pacientes del terapeuta
  useEffect(() => {
    if (!currentUser || !isTherapist) return;

    const loadPatients = async () => {
      try {
        setLoading(true);
        
        // Obtener relaciones terapeuta-paciente
        const relationshipsRef = collection(db, 'therapist-patient-relationships');
        const q = query(
          relationshipsRef,
          where('therapistId', '==', currentUser.uid),
          orderBy('acceptedAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const patientsList = [];
        
        for (const docSnap of snapshot.docs) {
          const relationship = { id: docSnap.id, ...docSnap.data() };
          
          // Obtener datos adicionales del paciente
          const patientDoc = await getDoc(doc(db, 'users', relationship.patientId));
          
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            
            // Contar entradas compartidas
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
                name: patientData.name || 'Sin nombre',
                email: patientData.email,
                createdAt: patientData.createdAt
              },
              sharedEntriesCount: entriesSnapshot.size
            });
          }
        }
        
        setPatients(patientsList);
        calculateStats(patientsList);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando pacientes:', error);
        setLoading(false);
      }
    };

    loadPatients();
  }, [currentUser, isTherapist]);

  // Calcular estadísticas
  const calculateStats = (patientsList) => {
    const active = patientsList.filter(p => p.status === 'active').length;
    const pending = patientsList.filter(p => p.status === 'pending').length;
    
    // Contar sesiones este mes (esto requeriría consultar therapistNotes)
    // Por ahora, estimación simple
    
    setStats({
      totalPatients: patientsList.length,
      activePatients: active,
      pendingInvitations: pending,
      sessionsThisMonth: 0 // TODO: calcular desde therapistNotes
    });
  };

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientData.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Abrir expediente de paciente
  const openPatientRecord = (patient) => {
    setSelectedPatient(patient);
    setActiveView('patient-record');
  };

  // Volver a la lista
  const backToList = () => {
    setSelectedPatient(null);
    setActiveView('patients');
  };

  // Renderizado condicional según acceso
  if (!currentUser) {
    return (
      <div className="therapist-page">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Debes iniciar sesión para acceder al panel de terapeuta.</p>
        </div>
      </div>
    );
  }

  if (!isTherapist) {
    return (
      <div className="therapist-page">
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

  // Renderizado principal
  return (
    <div className="therapist-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>{t('therapist.title') || 'Panel del Terapeuta'}</h1>
          <p className="subtitle">Gestión de pacientes y expedientes</p>
        </div>
        <Users size={32} className="page-icon" />
      </div>

      {/* Navigation Tabs */}
      <div className="therapist-nav">
        <button
          className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <TrendingUp size={18} />
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeView === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveView('patients')}
        >
          <Users size={18} />
          Pacientes ({stats?.activePatients || 0})
        </button>
        <button
          className={`nav-tab ${activeView === 'invite' ? 'active' : ''}`}
          onClick={() => setActiveView('invite')}
        >
          <UserPlus size={18} />
          Invitar Paciente
        </button>
      </div>

      {/* Content Area */}
      <div className="therapist-content">
        {/* VISTA: Dashboard */}
        {activeView === 'dashboard' && (
          <div className="dashboard-view">
            <TherapistStats stats={stats} />
            
            <div className="quick-access">
              <h3>Acceso Rápido</h3>
              <div className="quick-access-grid">
                <div className="quick-card" onClick={() => setActiveView('patients')}>
                  <Users size={24} />
                  <div className="quick-info">
                    <span className="quick-number">{stats?.activePatients || 0}</span>
                    <span className="quick-label">Pacientes Activos</span>
                  </div>
                </div>
                
                <div className="quick-card" onClick={() => setActiveView('invite')}>
                  <UserPlus size={24} />
                  <div className="quick-info">
                    <span className="quick-number">{stats?.pendingInvitations || 0}</span>
                    <span className="quick-label">Invitaciones Pendientes</span>
                  </div>
                </div>
                
                <div className="quick-card">
                  <Calendar size={24} />
                  <div className="quick-info">
                    <span className="quick-number">{stats?.sessionsThisMonth || 0}</span>
                    <span className="quick-label">Sesiones Este Mes</span>
                  </div>
                </div>
                
                <div className="quick-card">
                  <FileText size={24} />
                  <div className="quick-info">
                    <span className="quick-number">
                      {patients.reduce((sum, p) => sum + (p.sharedEntriesCount || 0), 0)}
                    </span>
                    <span className="quick-label">Entradas Compartidas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pacientes Recientes */}
            <div className="recent-patients card">
              <h3>Pacientes Recientes</h3>
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

        {/* VISTA: Lista de Pacientes */}
        {activeView === 'patients' && (
          <div className="patients-view">
            {/* Barra de búsqueda y filtros */}
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

            {/* Lista de Pacientes */}
            <PatientList 
              patients={filteredPatients}
              onSelectPatient={openPatientRecord}
              loading={loading}
            />
          </div>
        )}

        {/* VISTA: Expediente del Paciente */}
        {activeView === 'patient-record' && selectedPatient && (
          <PatientRecord 
            patient={selectedPatient}
            onBack={backToList}
          />
        )}

        {/* VISTA: Invitar Paciente */}
        {activeView === 'invite' && (
          <InvitePatient 
            therapistId={currentUser.uid}
            onSuccess={() => setActiveView('patients')}
          />
        )}
      </div>
    </div>
  );
};

export default Therapist;
