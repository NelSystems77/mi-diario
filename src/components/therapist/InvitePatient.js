import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './THERAPIST-COMPONENTS-STYLES.css';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
//import './InvitePatient.css';

const InvitePatient = ({ therapistId, onSuccess }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validar email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Enviar invitación
  const sendInvitation = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!email.trim()) {
      setError('Por favor ingresa un email.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido.');
      return;
    }

    if (email === currentUser.email) {
      setError('No puedes invitarte a ti mismo.');
      return;
    }

    try {
      setSending(true);
      setError('');

      // Verificar si ya existe una invitación pendiente
      const invitationsRef = collection(db, 'therapistInvitations');
      const q = query(
        invitationsRef,
        where('therapistId', '==', therapistId),
        where('patientEmail', '==', email.toLowerCase()),
        where('status', '==', 'pending')
      );
      const existingInvitations = await getDocs(q);

      if (!existingInvitations.empty) {
        setError('Ya existe una invitación pendiente para este email.');
        setSending(false);
        return;
      }

      // Verificar si ya existe una relación activa
      const relationshipsRef = collection(db, 'therapist-patient-relationships');
      const relationshipQuery = query(
        relationshipsRef,
        where('therapistId', '==', therapistId),
        where('patientEmail', '==', email.toLowerCase()),
        where('status', '==', 'active')
      );
      const existingRelationships = await getDocs(relationshipQuery);

      if (!existingRelationships.empty) {
        setError('Este paciente ya está en tu lista.');
        setSending(false);
        return;
      }

      // Crear invitación
      const invitationData = {
        therapistId: therapistId,
        therapistName: currentUser.displayName || 'Tu terapeuta',
        therapistEmail: currentUser.email,
        patientEmail: email.toLowerCase(),
        message: message || 'Me gustaría invitarte a conectar en Mi Diario para dar seguimiento a tu proceso.',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'therapistInvitations'), invitationData);

      // TODO: Enviar notificación por email (integrar SendGrid o similar)
      
      setSuccess(true);
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 3000);

      setSending(false);
    } catch (error) {
      console.error('Error enviando invitación:', error);
      setError('Error al enviar la invitación. Por favor intenta de nuevo.');
      setSending(false);
    }
  };

  return (
    <div className="invite-patient-page">
      <div className="invite-card card">
        <div className="invite-header">
          <h2>Invitar Nuevo Paciente</h2>
          <p className="subtitle">
            Envía una invitación por email para conectar con un paciente en Mi Diario
          </p>
        </div>

        {success ? (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h3>¡Invitación Enviada!</h3>
            <p>
              Se ha enviado una invitación a <strong>{email}</strong>.
              El paciente recibirá un email y podrá aceptar la invitación desde
              su configuración en Mi Diario.
            </p>
          </div>
        ) : (
          <form onSubmit={sendInvitation} className="invite-form">
            {/* Email del Paciente */}
            <div className="form-group">
              <label htmlFor="patient-email">Email del Paciente *</label>
              <input
                id="patient-email"
                type="email"
                className="form-input"
                placeholder="paciente@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={sending}
                required
              />
              <span className="input-hint">
                El paciente debe tener una cuenta en Mi Diario o crearla al aceptar la invitación.
              </span>
            </div>

            {/* Mensaje Personalizado */}
            <div className="form-group">
              <label htmlFor="invite-message">Mensaje Personalizado (Opcional)</label>
              <textarea
                id="invite-message"
                className="form-textarea"
                placeholder="Escribe un mensaje personal para acompañar la invitación..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                disabled={sending}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Información sobre Privacidad */}
            <div className="privacy-info">
              <h4>ℹ️ Sobre la Privacidad</h4>
              <ul>
                <li>El paciente decide qué información compartir contigo</li>
                <li>Puede revocar permisos en cualquier momento</li>
                <li>Tus notas de sesión son 100% privadas</li>
                <li>La invitación expira en 7 días</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={sending || !email.trim()}
              >
                <Send size={18} />
                {sending ? 'Enviando...' : 'Enviar Invitación'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Invitaciones Pendientes */}
      <div className="pending-invitations card">
        <h3>Invitaciones Pendientes</h3>
        <p className="section-subtitle">
          Aquí aparecerán las invitaciones que aún no han sido aceptadas.
        </p>
        {/* TODO: Listar invitaciones pendientes desde Firestore */}
        <div className="empty-state">
          <p>No hay invitaciones pendientes</p>
        </div>
      </div>
    </div>
  );
};

export default InvitePatient;
