import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Heart, 
  BarChart3, 
  BookMarked, 
  Settings, 
  LogOut,
  Users,
  Shield,
  Menu,
  X
} from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const { logout, userRole, userData } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/diary', icon: BookOpen, label: t('nav.diary') },
    { path: '/selfcare', icon: Heart, label: t('nav.selfcare') },
    { path: '/dashboard', icon: BarChart3, label: t('nav.dashboard') },
    { path: '/bible', icon: BookMarked, label: t('nav.bible') },
    { path: '/settings', icon: Settings, label: t('nav.settings') }
  ];
  
  if (userRole === 'therapist' || userData?.isTherapist) {
    navItems.push({ 
      path: '/therapist', 
      icon: Users, 
      label: t('nav.patients') || 'Pacientes', 
    });
  }
  
  if (userRole === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: t('nav.admin') });
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <button 
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <img src="/logo512.png" alt="Mi Diario" className="nav-logo" />
          <h2 className="nav-title">{t('app.name')}</h2>
        </div>

        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button className="nav-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>{t('nav.logout')}</span>
        </button>
      </nav>
    </>
  );
};

export default Navigation;
