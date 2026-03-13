import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import './styles/index.css';
import './i18n';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Diary from './pages/Diary';
import SelfCare from './pages/SelfCare';
import Dashboard from './pages/Dashboard';
import Bible from './pages/Bible';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

// Components
import Navigation from './components/common/Navigation';
import PrivateRoute from './components/common/PrivateRoute';

function AppContent() {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <div className="app">
      {currentUser && <Navigation />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/" /> : <Login />
          } />
          
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          
          <Route path="/diary" element={
            <PrivateRoute>
              <Diary />
            </PrivateRoute>
          } />
          
          <Route path="/selfcare" element={
            <PrivateRoute>
              <SelfCare />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/bible" element={
            <PrivateRoute>
              <Bible />
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute adminOnly>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
