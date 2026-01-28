import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * StorageService - Servicio de utilidades para gestionar AsyncStorage
 * 
 * Proporciona funciones útiles para administrar el almacenamiento local
 */

const STORAGE_KEYS = {
  PETS: '@PetPal:pets',
  ACTIVE_PET_ID: '@PetPal:activePetId',
  CALENDAR_EVENTS: '@PetPal:calendarEvents',
  MOOD_DATA: '@PetPal:moodData',
  MOOD_HISTORY: '@PetPal:moodHistory',
  HEALTH_HISTORY: '@PetPal:healthHistory',
  GALLERY_PHOTOS: '@PetPal:galleryPhotos',
  ALBUMS: '@PetPal:albums',
};

/**
 * Limpia todos los datos almacenados de la aplicación
 * Útil para resetear la app o durante el desarrollo
 */
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    console.log('✅ Todos los datos han sido eliminados');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar datos:', error);
    return false;
  }
};

/**
 * Exporta todos los datos como JSON
 * Útil para hacer backups
 */
export const exportData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const data = await AsyncStorage.multiGet(keys);
    
    const exportedData = {};
    data.forEach(([key, value]) => {
      if (value) {
        exportedData[key] = JSON.parse(value);
      }
    });
    
    console.log('✅ Datos exportados exitosamente');
    return exportedData;
  } catch (error) {
    console.error('❌ Error al exportar datos:', error);
    return null;
  }
};

/**
 * Importa datos desde un objeto JSON
 * Útil para restaurar backups
 */
export const importData = async (data) => {
  try {
    const pairs = Object.entries(data).map(([key, value]) => [
      key,
      JSON.stringify(value)
    ]);
    
    await AsyncStorage.multiSet(pairs);
    console.log('✅ Datos importados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al importar datos:', error);
    return false;
  }
};

/**
 * Obtiene el tamaño aproximado del almacenamiento usado
 */
export const getStorageSize = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const data = await AsyncStorage.multiGet(keys);
    
    let totalSize = 0;
    data.forEach(([, value]) => {
      if (value) {
        totalSize += value.length;
      }
    });
    
    // Convertir a KB
    const sizeInKB = (totalSize / 1024).toFixed(2);
    console.log(`📊 Tamaño de almacenamiento: ${sizeInKB} KB`);
    return sizeInKB;
  } catch (error) {
    console.error('❌ Error al calcular tamaño:', error);
    return 0;
  }
};

/**
 * Obtiene todos los datos almacenados para debugging
 */
export const debugStorage = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const data = await AsyncStorage.multiGet(keys);
    
    console.log('=== DEBUG STORAGE ===');
    data.forEach(([key, value]) => {
      if (value) {
        const parsed = JSON.parse(value);
        console.log(`\n${key}:`, parsed);
      }
    });
    console.log('===================');
    
    return data;
  } catch (error) {
    console.error('❌ Error en debug:', error);
    return null;
  }
};

export default {
  clearAllData,
  exportData,
  importData,
  getStorageSize,
  debugStorage,
};
