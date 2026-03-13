const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Inicializar Firebase Admin SDK
// En producción (Vercel), usa variable de entorno
// En desarrollo local, usa el archivo serviceAccountKey.json
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Vercel: cargar desde variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local: cargar desde archivo
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

// Middleware de autenticación - verifica que el usuario sea admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== RUTAS DE USUARIOS ====================

// Obtener todos los usuarios
app.get('/api/users', verifyAdmin, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo usuario
app.post('/api/users', verifyAdmin, async (req, res) => {
  try {
    const { email, password, displayName, role, expirationDate } = req.body;

    // Validaciones
    if (!email || !password || !displayName) {
      return res.status(400).json({ 
        error: 'Email, password y displayName son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Crear usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false
    });

    // Crear documento en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: displayName,
      role: role || 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      points: 0,
      level: 'seed',
      language: 'es',
      quotePreference: 'motivational',
      expirationDate: expirationDate || null
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: displayName,
        role: role || 'user'
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Errores específicos de Firebase
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario
app.put('/api/users/:uid', verifyAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, role, expirationDate } = req.body;

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (role) updateData.role = role;
    if (expirationDate !== undefined) updateData.expirationDate = expirationDate;

    // Actualizar en Authentication si hay displayName
    if (displayName) {
      await auth.updateUser(uid, { displayName });
    }

    // Actualizar en Firestore
    await db.collection('users').doc(uid).update(updateData);

    res.json({ message: 'Usuario actualizado exitosamente' });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario
app.delete('/api/users/:uid', verifyAdmin, async (req, res) => {
  try {
    const { uid } = req.params;

    // Eliminar de Authentication
    await auth.deleteUser(uid);

    // Eliminar de Firestore
    await db.collection('users').doc(uid).delete();

    res.json({ message: 'Usuario eliminado exitosamente' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cambiar rol de usuario
app.patch('/api/users/:uid/role', verifyAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (!['user', 'therapist', 'admin'].includes(role)) {
      return res.status(400).json({ 
        error: 'Rol inválido. Debe ser: user, therapist o admin' 
      });
    }

    await db.collection('users').doc(uid).update({ role });

    res.json({ message: 'Rol actualizado exitosamente' });

  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== RUTAS DE ESTADÍSTICAS ====================

// Obtener estadísticas globales
app.get('/api/stats', verifyAdmin, async (req, res) => {
  try {
    // Total de usuarios
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Total de entradas de diario
    const entriesSnapshot = await db.collection('diaryEntries').get();
    const totalEntries = entriesSnapshot.size;

    // Usuarios activos (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsersSnapshot = await db.collection('diaryEntries')
      .where('date', '>=', sevenDaysAgo.toISOString())
      .get();
    
    const activeUsers = new Set();
    activeUsersSnapshot.forEach(doc => {
      activeUsers.add(doc.data().userId);
    });

    res.json({
      totalUsers,
      totalEntries,
      activeToday: activeUsers.size,
      stats: {
        avgEntriesPerUser: totalUsers > 0 ? (totalEntries / totalUsers).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== RUTA DE SALUD ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mi Diario Backend API',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    name: 'Mi Diario Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      users: {
        list: 'GET /api/users',
        create: 'POST /api/users',
        update: 'PUT /api/users/:uid',
        delete: 'DELETE /api/users/:uid',
        changeRole: 'PATCH /api/users/:uid/role'
      },
      stats: 'GET /api/stats'
    }
  });
});

//  Manejo de errores global (opcional pero recomendado)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

//  Iniciar servidor SOLO en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend local en http://localhost:${PORT}`);
    console.log(`📚 Firebase Admin SDK inicializado localmente`);
  });
}

//  EXPORTACIÓN OBLIGATORIA PARA VERCEL
// Esto permite que Vercel tome el control de las rutas en la nube
module.exports = app;
