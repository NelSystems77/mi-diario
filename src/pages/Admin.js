import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, TrendingUp, UserPlus, Trash2 } from 'lucide-react';
import { userAPI, statsAPI } from '../services/api';
import './Admin.css';

const Admin = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalEntries: 0
  });
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user',
    expirationDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getGlobal();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await userAPI.create({
        email: newUser.email,
        password: newUser.password,
        displayName: newUser.displayName,
        role: newUser.role,
        expirationDate: newUser.expirationDate
      });
      
      alert('¡Usuario creado exitosamente!');
      setShowCreateUser(false);
      setNewUser({ email: '', password: '', displayName: '', role: 'user', expirationDate: '' });
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
      alert(`Error al crear usuario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await userAPI.delete(userId);
      alert('Usuario eliminado exitosamente');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error al eliminar usuario: ${error.message}`);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const roles = ['user', 'therapist', 'admin'];
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    if (!window.confirm(`¿Cambiar rol a: ${nextRole}?`)) return;
    
    try {
      await userAPI.changeRole(userId, nextRole);
      alert(`Rol actualizado a: ${nextRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      alert(`Error al cambiar rol: ${error.message}`);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>{t('admin.title')}</h1>
          <p>Panel de gestión de usuarios y estadísticas</p>
        </div>
        <Shield size={32} className="admin-icon" />
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card card">
          <Users className="stat-icon" />
          <div>
            <span className="stat-label">Total Usuarios</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
        </div>

        <div className="stat-card card">
          <TrendingUp className="stat-icon" />
          <div>
            <span className="stat-label">Activos (7 días)</span>
            <span className="stat-value">{stats.activeToday}</span>
          </div>
        </div>

        <div className="stat-card card">
          <Shield className="stat-icon" />
          <div>
            <span className="stat-label">Total Entradas</span>
            <span className="stat-value">{stats.totalEntries}</span>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="users-section card">
        <div className="section-header">
          <h3>{t('admin.users')}</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateUser(!showCreateUser)}
          >
            <UserPlus size={20} />
            {t('admin.createUser')}
          </button>
        </div>

        {showCreateUser && (
          <form className="create-user-form" onSubmit={handleCreateUser}>
            <div className="form-row">
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                minLength="6"
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                className="input"
                placeholder="Nombre completo"
                value={newUser.displayName}
                onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                required
              />
              <select
                className="input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">Usuario</option>
                <option value="therapist">Terapeuta</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-row">
              <input
                type="date"
                className="input"
                placeholder="Fecha de expiración (opcional)"
                value={newUser.expirationDate}
                onChange={(e) => setNewUser({ ...newUser, expirationDate: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        )}

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Puntos</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.displayName}</td>
                  <td>
                    <button
                      className={`role-badge ${user.role} clickable`}
                      onClick={() => handleChangeRole(user.id, user.role)}
                      title="Clic para cambiar rol"
                    >
                      {user.role}
                    </button>
                  </td>
                  <td>{user.points || 0}</td>
                  <td>{user.level || 'seed'}</td>
                  <td>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Eliminar usuario"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
