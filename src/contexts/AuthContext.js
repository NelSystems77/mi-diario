import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'user');
            console.log('✅ Documento de usuario encontrado. Rol:', userData.role);
          } else {
            console.warn('⚠️ Documento de usuario NO encontrado en Firestore');
            setUserRole('user');
          }
        } catch (error) {
          console.error('❌ Error al obtener documento de usuario:', error);
          setUserRole('user');
        }
      } else {
        setUserRole('user');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    console.log('🔵 Iniciando registro para:', email);
    
    try {
      // Paso 1: Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Usuario creado en Authentication:', user.uid);
      
      // Paso 2: Crear documento en Firestore
      const userData = {
        email: user.email,
        displayName: displayName || '',
        role: email === 'admin@nelsystems.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        points: 0,
        level: 'seed',
        language: 'es',
        quotePreference: 'motivational'
      };
      
      console.log('🔵 Intentando crear documento en Firestore...');
      console.log('📄 Datos del usuario:', userData);
      
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ Documento creado exitosamente en Firestore');
      
      return user;
    } catch (error) {
      console.error('❌ Error en signup:', error);
      console.error('❌ Código de error:', error.code);
      console.error('❌ Mensaje:', error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    console.log('🔵 Intentando login para:', email);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login exitoso');
      return result;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🔵 Cerrando sesión...');
    return signOut(auth);
  };

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
