import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utilidad de depuración para AsyncStorage
 * Ayuda a identificar problemas de datos compartidos entre usuarios
 */

export const debugStorage = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 DEBUG ASYNCSTORAGE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Obtener todos los datos
    const currentUserId = await AsyncStorage.getItem('currentUserId');
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    console.log('👤 Usuario actual ID:', currentUserId);
    console.log('👥 Total de usuarios registrados:', users.length);
    
    if (users.length > 0) {
      console.log('\n📋 Lista de usuarios:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username || 'Sin nombre'} (${user.email}) - ID: ${user.id}`);
        if (user.id === currentUserId) {
          console.log('     ⭐ <- Usuario actualmente logeado');
        }
      });
    }

    // Buscar todas las claves relacionadas con usuarios
    console.log('\n🔑 Claves de almacenamiento por usuario:');
    const allKeys = await AsyncStorage.getAllKeys();
    const userKeys = allKeys.filter(key => key.startsWith('@PetPal:user_'));
    
    if (userKeys.length === 0) {
      console.log('  ⚠️ No se encontraron datos de usuario específicos');
    } else {
      // Agrupar por usuario
      const keysByUser = {};
      userKeys.forEach(key => {
        const match = key.match(/@PetPal:user_(\d+):(.+)/);
        if (match) {
          const [, userId, dataType] = match;
          if (!keysByUser[userId]) {
            keysByUser[userId] = [];
          }
          keysByUser[userId].push(dataType);
        }
      });

      for (const [userId, dataTypes] of Object.entries(keysByUser)) {
        const user = users.find(u => u.id === userId);
        const userName = user ? (user.username || user.email) : 'Usuario desconocido';
        console.log(`\n  Usuario: ${userName} (ID: ${userId})`);
        
        for (const dataType of dataTypes) {
          const key = `@PetPal:user_${userId}:${dataType}`;
          const data = await AsyncStorage.getItem(key);
          const parsed = data ? JSON.parse(data) : null;
          
          let count = 0;
          if (Array.isArray(parsed)) {
            count = parsed.length;
          } else if (typeof parsed === 'object' && parsed !== null) {
            count = Object.keys(parsed).length;
          }
          
          console.log(`    - ${dataType}: ${count} items`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error en debugStorage:', error);
  }
};

/**
 * Elimina TODOS los datos de TODOS los usuarios (usar con cuidado)
 */
export const clearAllUserData = async () => {
  try {
    console.log('⚠️ Eliminando TODOS los datos...');
    await AsyncStorage.clear();
    console.log('✅ Todos los datos han sido eliminados');
  } catch (error) {
    console.error('❌ Error al eliminar datos:', error);
  }
};

/**
 * Elimina solo los datos de un usuario específico
 */
export const clearUserData = async (userId) => {
  try {
    console.log(`🧹 Eliminando datos del usuario ${userId}...`);
    const allKeys = await AsyncStorage.getAllKeys();
    const userKeys = allKeys.filter(key => key.includes(`user_${userId}`));
    
    if (userKeys.length > 0) {
      await AsyncStorage.multiRemove(userKeys);
      console.log(`✅ ${userKeys.length} claves eliminadas para el usuario ${userId}`);
    } else {
      console.log('ℹ️ No se encontraron datos para este usuario');
    }
  } catch (error) {
    console.error('❌ Error al eliminar datos del usuario:', error);
  }
};
