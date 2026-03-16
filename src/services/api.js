import { auth } from './firebase';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:3001');

// Helper para obtener el token de autenticación
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  return await user.getIdToken();
};

// Helper para hacer peticiones autenticadas
const authenticatedFetch = async (url, options = {}) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }

  return await response.json();
};

// API de usuarios
export const userAPI = {
  // Obtener todos los usuarios
  getAll: async () => {
    return await authenticatedFetch('/api/users');
  },

  // Crear nuevo usuario
  create: async (userData) => {
    return await authenticatedFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Actualizar usuario
  update: async (uid, userData) => {
    return await authenticatedFetch(`/api/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Eliminar usuario
  delete: async (uid) => {
    return await authenticatedFetch(`/api/users/${uid}`, {
      method: 'DELETE',
    });
  },

  // Cambiar rol de usuario
  changeRole: async (uid, role) => {
    return await authenticatedFetch(`/api/users/${uid}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

// API de estadísticas
export const statsAPI = {
  // Obtener estadísticas globales
  getGlobal: async () => {
    return await authenticatedFetch('/api/stats');
  },
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend no disponible:', error);
    return { status: 'ERROR', message: error.message };
  }
};

const apiService = {
  userAPI,
  statsAPI,
  checkBackendHealth,
};

export default apiService;
