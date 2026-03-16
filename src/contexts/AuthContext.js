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
  const [userData, setUserData] = useState(null);  // ← AGREGADO
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);  // ← AGREGADO
            setUserRole(data.role || 'user');
            console.log('✅ Documento de usuario encontrado. Rol:', data.role);
            console.log('✅ userData completo:', data);  // ← DEBUG
          } else {
            console.warn('⚠️ Documento de usuario NO encontrado en Firestore');
            setUserData(null);  // ← AGREGADO
            setUserRole('user');
          }
        } catch (error) {
          console.error('❌ Error al obtener documento de usuario:', error);
          setUserData(null);  // ← AGREGADO
          setUserRole('user');
        }
      } else {
        setUserData(null);  // ← AGREGADO
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
      const newUserData = {
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
      console.log('📄 Datos del usuario:', newUserData);
      
      await setDoc(doc(db, 'users', user.uid), newUserData);
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
    userData,      // ← AGREGADO
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
