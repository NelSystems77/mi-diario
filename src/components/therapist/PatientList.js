import React from 'react';
import './THERAPIST-COMPONENTS-STYLES.css';
import { 
  User, 
  Calendar, 
  FileText, 
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
//import './PatientList.css';

const PatientList = ({ patients, onSelectPatient, loading }) => {
  
  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calcular días desde última entrada compartida
  const daysSinceLastEntry = (patient) => {
    // TODO: Implementar cuando tengamos timestamp de última entrada
    return 'N/A';
  };

  // Icono de estado
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
        return <CheckCircle size={16} className="status-icon active" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'inactive':
        return <XCircle size={16} className="status-icon inactive" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="patient-list-loading">
        <div className="loading-spinner"></div>
        <p>Cargando pacientes...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="patient-list-empty card">
        <User size={48} className="empty-icon" />
        <h3>No hay pacientes</h3>
        <p>Invita a tu primer paciente para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="patient-list">
      <div className="list-header">
        <h3>Mis Pacientes ({patients.length})</h3>
      </div>

      <div className="patients-grid">
        {patients.map(patient => (
          <div 
            key={patient.id}
            className="patient-card card"
            onClick={() => onSelectPatient(patient)}
          >
            {/* Header del Card */}
            <div className="patient-card-header">
              <div className="patient-avatar-large">
                {patient.patientData.name.charAt(0).toUpperCase()}
              </div>
              <div className="patient-main-info">
                <h4>{patient.patientData.name}</h4>
                <p className="patient-email-small">{patient.patientData.email}</p>
              </div>
              <div className="patient-status-badge">
                {getStatusIcon(patient.status)}
                <span className={`status-text ${patient.status}`}>
                  {patient.status === 'active' && 'Activo'}
                  {patient.status === 'pending' && 'Pendiente'}
                  {patient.status === 'inactive' && 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Stats del Paciente */}
            <div className="patient-stats">
              <div className="stat-item">
                <FileText size={16} />
                <div className="stat-info">
                  <span className="stat-value">{patient.sharedEntriesCount || 0}</span>
                  <span className="stat-label">Entradas compartidas</span>
                </div>
              </div>

              <div className="stat-item">
                <Calendar size={16} />
                <div className="stat-info">
                  <span className="stat-value">
                    {patient.nextSessionDate 
                      ? formatDate(patient.nextSessionDate)
                      : 'Sin programar'
                    }
                  </span>
                  <span className="stat-label">Próxima sesión</span>
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div className="patient-permissions">
              <span className="permissions-label">Permisos activos:</span>
              <div className="permissions-tags">
                {patient.permissions?.viewDiary && (
                  <span className="permission-tag">📔 Diario</span>
                )}
                {patient.permissions?.viewEmotions && (
                  <span className="permission-tag">😊 Emociones</span>
                )}
                {patient.permissions?.viewSelfcare && (
                  <span className="permission-tag">💚 Autocuidado</span>
                )}
                {patient.permissions?.viewDashboard && (
                  <span className="permission-tag">📊 Dashboard</span>
                )}
                {!patient.permissions?.viewDiary && 
                 !patient.permissions?.viewEmotions && 
                 !patient.permissions?.viewSelfcare && 
                 !patient.permissions?.viewDashboard && (
                  <span className="permission-tag no-permissions">Sin permisos</span>
                )}
              </div>
            </div>

            {/* Footer del Card */}
            <div className="patient-card-footer">
              <span className="relation-date">
                Desde {formatDate(patient.acceptedAt || patient.invitedAt)}
              </span>
              <button className="view-record-btn">
                Ver Expediente →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
