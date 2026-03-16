import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './THERAPIST-COMPONENTS-STYLES.css';
import { 
  Plus,
  Save,
  X,
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import './SessionNotes.css';

const SessionNotes = ({ patientId, notes, onNotesUpdate, isModal, onClose }) => {
  const { currentUser } = useAuth();
  const [showNewNoteForm, setShowNewNoteForm] = useState(isModal || false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    sessionType: 'followup',
    mainTopics: [],
    observations: '',
    interventions: '',
    homework: '',
    nextSessionGoals: '',
    patientMood: 5,
    progressRating: 5,
    riskAssessment: 'none',
    duration: 60
  });

  // Temas principales predefinidos
  const topicOptions = [
    'Ansiedad',
    'Depresión',
    'Relaciones',
    'Trabajo',
    'Familia',
    'Autoestima',
    'Trauma',
    'Estrés',
    'Sueño',
    'Alimentación',
    'Otro'
  ];

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle de temas
  const toggleTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      mainTopics: prev.mainTopics.includes(topic)
        ? prev.mainTopics.filter(t => t !== topic)
        : [...prev.mainTopics, topic]
    }));
  };

  // Guardar nota
  const saveNote = async () => {
    if (!formData.observations.trim()) {
      alert('Por favor ingresa al menos las observaciones de la sesión.');
      return;
    }

    try {
      setSaving(true);

      const noteData = {
        therapistId: currentUser.uid,
        patientId: patientId,
        sessionDate: new Date(formData.sessionDate),
        sessionNumber: notes.length + 1,
        sessionType: formData.sessionType,
        mainTopics: formData.mainTopics,
        observations: formData.observations,
        interventions: formData.interventions,
        homework: formData.homework,
        nextSessionGoals: formData.nextSessionGoals,
        patientMood: parseInt(formData.patientMood),
        progressRating: parseInt(formData.progressRating),
        riskAssessment: formData.riskAssessment,
        duration: parseInt(formData.duration),
        isPrivate: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingNote) {
        // Actualizar nota existente
        await updateDoc(doc(db, 'therapistNotes', editingNote.id), {
          ...noteData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Crear nueva nota
        await addDoc(collection(db, 'therapistNotes'), noteData);
      }

      // Resetear formulario
      setFormData({
        sessionDate: new Date().toISOString().split('T')[0],
        sessionType: 'followup',
        mainTopics: [],
        observations: '',
        interventions: '',
        homework: '',
        nextSessionGoals: '',
        patientMood: 5,
        progressRating: 5,
        riskAssessment: 'none',
        duration: 60
      });

      setShowNewNoteForm(false);
      setEditingNote(null);
      
      // Recargar notas
      // TODO: En producción, deberías recargar desde Firestore
      if (onNotesUpdate) {
        // Temporal: agregar la nota localmente
        onNotesUpdate([noteData, ...notes]);
      }

      if (isModal && onClose) {
        onClose();
      }

      setSaving(false);
    } catch (error) {
      console.error('Error guardando nota:', error);
      alert('Error al guardar la nota. Por favor intenta de nuevo.');
      setSaving(false);
    }
  };

  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Renderizado del formulario
  const renderNoteForm = () => (
    <div className="note-form card">
      <div className="form-header">
        <h3>{editingNote ? 'Editar Nota de Sesión' : 'Nueva Nota de Sesión'}</h3>
        <button 
          className="close-btn"
          onClick={() => {
            setShowNewNoteForm(false);
            setEditingNote(null);
            if (isModal && onClose) onClose();
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="form-body">
        {/* Fecha y Tipo de Sesión */}
        <div className="form-row">
          <div className="form-group">
            <label>Fecha de la Sesión</label>
            <input
              type="date"
              value={formData.sessionDate}
              onChange={(e) => handleInputChange('sessionDate', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Tipo de Sesión</label>
            <select
              value={formData.sessionType}
              onChange={(e) => handleInputChange('sessionType', e.target.value)}
              className="form-input"
            >
              <option value="initial">Inicial</option>
              <option value="followup">Seguimiento</option>
              <option value="crisis">Crisis</option>
              <option value="discharge">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duración (min)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="form-input"
              min="15"
              max="180"
              step="15"
            />
          </div>
        </div>

        {/* Temas Principales */}
        <div className="form-group">
          <label>Temas Principales Abordados</label>
          <div className="topics-selector">
            {topicOptions.map(topic => (
              <button
                key={topic}
                type="button"
                className={`topic-btn ${formData.mainTopics.includes(topic) ? 'selected' : ''}`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="form-group">
          <label>Observaciones de la Sesión *</label>
          <textarea
            value={formData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            className="form-textarea"
            placeholder="Describe lo que observaste durante la sesión, el estado del paciente, puntos importantes discutidos..."
            rows="4"
            required
          />
        </div>

        {/* Intervenciones */}
        <div className="form-group">
          <label>Intervenciones Realizadas</label>
          <textarea
            value={formData.interventions}
            onChange={(e) => handleInputChange('interventions', e.target.value)}
            className="form-textarea"
            placeholder="Técnicas utilizadas, herramientas proporcionadas, estrategias discutidas..."
            rows="3"
          />
        </div>

        {/* Tarea para el Paciente */}
        <div className="form-group">
          <label>Tarea Asignada</label>
          <textarea
            value={formData.homework}
            onChange={(e) => handleInputChange('homework', e.target.value)}
            className="form-textarea"
            placeholder="Tareas o ejercicios para que el paciente realice antes de la próxima sesión..."
            rows="2"
          />
        </div>

        {/* Objetivos para Próxima Sesión */}
        <div className="form-group">
          <label>Objetivos para Próxima Sesión</label>
          <textarea
            value={formData.nextSessionGoals}
            onChange={(e) => handleInputChange('nextSessionGoals', e.target.value)}
            className="form-textarea"
            placeholder="Qué se trabajará en la siguiente sesión..."
            rows="2"
          />
        </div>

        {/* Evaluaciones */}
        <div className="form-row">
          <div className="form-group">
            <label>Estado de Ánimo del Paciente (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.patientMood}
              onChange={(e) => handleInputChange('patientMood', e.target.value)}
              className="form-range"
            />
            <span className="range-value">{formData.patientMood}/10</span>
          </div>

          <div className="form-group">
            <label>Evaluación de Progreso (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.progressRating}
              onChange={(e) => handleInputChange('progressRating', e.target.value)}
              className="form-range"
            />
            <span className="range-value">{formData.progressRating}/10</span>
          </div>
        </div>

        {/* Evaluación de Riesgo */}
        <div className="form-group">
          <label className="risk-label">
            <AlertTriangle size={16} />
            Evaluación de Riesgo
          </label>
          <select
            value={formData.riskAssessment}
            onChange={(e) => handleInputChange('riskAssessment', e.target.value)}
            className={`form-input risk-select ${formData.riskAssessment}`}
          >
            <option value="none">Ninguno</option>
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
          </select>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setShowNewNoteForm(false);
              setEditingNote(null);
              if (isModal && onClose) onClose();
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={saveNote}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Nota'}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizado de la lista de notas
  const renderNotesList = () => (
    <div className="notes-list">
      <div className="notes-header">
        <h3>Historial de Sesiones ({notes.length})</h3>
        {!isModal && (
          <button
            className="btn-primary"
            onClick={() => setShowNewNoteForm(true)}
          >
            <Plus size={18} />
            Nueva Sesión
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="no-notes card">
          <Calendar size={48} />
          <h4>Sin sesiones registradas</h4>
          <p>Comienza registrando tu primera sesión con este paciente.</p>
        </div>
      ) : (
        <div className="notes-timeline">
          {notes.map((note, index) => (
            <div key={note.id || index} className="note-card card">
              <div className="note-header">
                <div className="note-meta">
                  <Calendar size={16} />
                  <span className="note-date">{formatDate(note.sessionDate)}</span>
                  <span className="note-number">Sesión #{note.sessionNumber}</span>
                  <span className={`note-type ${note.sessionType}`}>
                    {note.sessionType === 'initial' && 'Inicial'}
                    {note.sessionType === 'followup' && 'Seguimiento'}
                    {note.sessionType === 'crisis' && 'Crisis'}
                    {note.sessionType === 'discharge' && 'Alta'}
                  </span>
                </div>
                <div className="note-actions">
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingNote(note);
                      setFormData({
                        sessionDate: note.sessionDate?.toDate 
                          ? note.sessionDate.toDate().toISOString().split('T')[0]
                          : new Date(note.sessionDate).toISOString().split('T')[0],
                        sessionType: note.sessionType,
                        mainTopics: note.mainTopics || [],
                        observations: note.observations,
                        interventions: note.interventions || '',
                        homework: note.homework || '',
                        nextSessionGoals: note.nextSessionGoals || '',
                        patientMood: note.patientMood || 5,
                        progressRating: note.progressRating || 5,
                        riskAssessment: note.riskAssessment || 'none',
                        duration: note.duration || 60
                      });
                      setShowNewNoteForm(true);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>

              {note.mainTopics && note.mainTopics.length > 0 && (
                <div className="note-topics">
                  {note.mainTopics.map((topic, idx) => (
                    <span key={idx} className="topic-tag">{topic}</span>
                  ))}
                </div>
              )}

              <div className="note-content">
                <div className="note-section">
                  <strong>Observaciones:</strong>
                  <p>{note.observations}</p>
                </div>

                {note.interventions && (
                  <div className="note-section">
                    <strong>Intervenciones:</strong>
                    <p>{note.interventions}</p>
                  </div>
                )}

                {note.homework && (
                  <div className="note-section highlight">
                    <strong>Tarea asignada:</strong>
                    <p>{note.homework}</p>
                  </div>
                )}

                {note.nextSessionGoals && (
                  <div className="note-section">
                    <strong>Objetivos próxima sesión:</strong>
                    <p>{note.nextSessionGoals}</p>
                  </div>
                )}
              </div>

              <div className="note-footer">
                <div className="note-ratings">
                  <span>Ánimo: {note.patientMood}/10</span>
                  <span>•</span>
                  <span>Progreso: {note.progressRating}/10</span>
                  <span>•</span>
                  <span className={`risk-badge ${note.riskAssessment}`}>
                    Riesgo: {note.riskAssessment === 'none' ? 'Ninguno' : 
                             note.riskAssessment === 'low' ? 'Bajo' :
                             note.riskAssessment === 'medium' ? 'Medio' : 'Alto'}
                  </span>
                </div>
                <div className="note-duration">
                  <Clock size={14} />
                  <span>{note.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renderizado principal
  if (isModal) {
    return (
      <div className="session-modal-overlay">
        <div className="session-modal">
          {renderNoteForm()}
        </div>
      </div>
    );
  }

  return (
    <div className="session-notes">
      {showNewNoteForm ? renderNoteForm() : renderNotesList()}
    </div>
  );
};

export default SessionNotes;
