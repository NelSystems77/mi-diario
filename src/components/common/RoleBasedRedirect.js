import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente que redirige automáticamente según el rol del usuario
 * - Admin → /admin
 * - Terapeuta → /therapist
 * - Usuario normal → / (Home)
 */
const RoleBasedRedirect = ({ children }) => {
  const { userData, userRole, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const currentPath = window.location.pathname;

    // Si ya está en la ruta correcta, no redirigir
    if (
      (userRole === 'admin' && currentPath === '/admin') ||
      (userRole === 'therapist' && currentPath === '/therapist') ||
      ((userData?.isTherapist || userRole === 'therapist') && currentPath === '/therapist')
    ) {
      return;
    }

    // Redirigir según rol
    if (userRole === 'admin') {
      navigate('/admin', { replace: true });
    } else if (userRole === 'therapist' || userData?.isTherapist) {
      navigate('/therapist', { replace: true });
    }
    // Usuario normal se queda en Home (no redirige)

  }, [userData, userRole, currentUser, navigate]);

  return children;
};

export default RoleBasedRedirect;
