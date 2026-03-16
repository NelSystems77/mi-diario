import React from 'react';
import './THERAPIST-COMPONENTS-STYLES.css';
import { Users, UserCheck, UserPlus, Calendar } from 'lucide-react';
import './TherapistStats.css';

const TherapistStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-loading">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="therapist-stats">
      <h3>Resumen de tu Práctica</h3>
      
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon-wrapper total">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalPatients || 0}</span>
            <span className="stat-label">Total de Pacientes</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper active">
            <UserCheck size={28} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.activePatients || 0}</span>
            <span className="stat-label">Pacientes Activos</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper pending">
            <UserPlus size={28} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingInvitations || 0}</span>
            <span className="stat-label">Invitaciones Pendientes</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper sessions">
            <Calendar size={28} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.sessionsThisMonth || 0}</span>
            <span className="stat-label">Sesiones Este Mes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistStats;
