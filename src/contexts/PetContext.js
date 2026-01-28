import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

/**
 * PetContext - Contexto global para compartir datos de la mascota
 * 
 * Permite que la foto de perfil y otros datos se compartan
 * entre diferentes pantallas de la aplicación.
 * Todos los datos se guardan automáticamente en AsyncStorage
 * Ahora con soporte multi-usuario: cada usuario tiene sus propios datos
 */
const PetContext = createContext();

// Función para generar claves de almacenamiento por usuario
const getUserStorageKey = (userId, dataType) => {
  return `@PetPal:user_${userId}:${dataType}`;
};

export const PetProvider = ({ children }) => {
  const { currentUser } = useAuth();
  // Estados iniciales vacíos - se cargarán desde AsyncStorage
  const [pets, setPets] = useState([]);
  const [activePetId, setActivePetId] = useState(null);
  const [petCalendarEvents, setPetCalendarEvents] = useState({});
  const [petMoodData, setPetMoodData] = useState({});
  const [petMoodHistory, setPetMoodHistory] = useState({});
  const [petHealthHistory, setPetHealthHistory] = useState({});
  const [petGalleryPhotos, setPetGalleryPhotos] = useState({});
  const [petAlbums, setPetAlbums] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // ========== FUNCIONES DE ALMACENAMIENTO ==========
  
  // Guardar datos en AsyncStorage
  const saveToStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error guardando ${key}:`, error);
    }
  };

  // Cargar datos desde AsyncStorage
  const loadFromStorage = async (key, defaultValue) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error cargando ${key}:`, error);
      return defaultValue;
    }
  };

  // Cargar todos los datos al iniciar la app o cuando cambie el usuario
  useEffect(() => {
    // Solo cargar datos si hay un usuario autenticado
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const loadAllData = async () => {
      try {
        const userId = currentUser.id;
        const [
          savedPets,
          savedActivePetId,
          savedCalendarEvents,
          savedMoodData,
          savedMoodHistory,
          savedHealthHistory,
          savedGalleryPhotos,
          savedAlbums,
        ] = await Promise.all([
          loadFromStorage(getUserStorageKey(userId, 'pets'), []), // Usuario nuevo empieza sin mascotas
          loadFromStorage(getUserStorageKey(userId, 'activePetId'), null),
          loadFromStorage(getUserStorageKey(userId, 'calendarEvents'), {}),
          loadFromStorage(getUserStorageKey(userId, 'moodData'), {}),
          loadFromStorage(getUserStorageKey(userId, 'moodHistory'), {}),
          loadFromStorage(getUserStorageKey(userId, 'healthHistory'), {}),
          loadFromStorage(getUserStorageKey(userId, 'galleryPhotos'), {}),
          loadFromStorage(getUserStorageKey(userId, 'albums'), {}),
        ]);

        setPets(savedPets);
        setActivePetId(savedActivePetId || (savedPets.length > 0 ? savedPets[0].id : null));
        setPetCalendarEvents(savedCalendarEvents);
        setPetMoodData(savedMoodData);
        setPetMoodHistory(savedMoodHistory);
        setPetHealthHistory(savedHealthHistory);
        setPetGalleryPhotos(savedGalleryPhotos);
        setPetAlbums(savedAlbums);
      } catch (error) {
        console.error('Error cargando datos:', error);
        // Si hay error, empezar con datos vacíos
        setPets([]);
        setActivePetId(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [currentUser]); // Recargar cuando cambie el usuario

  // Guardar pets cada vez que cambien
  useEffect(() => {
    if (!isLoading && pets.length > 0 && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'pets'), pets);
    }
  }, [pets, isLoading, currentUser]);

  // Guardar activePetId cada vez que cambie
  useEffect(() => {
    if (!isLoading && currentUser && activePetId) {
      saveToStorage(getUserStorageKey(currentUser.id, 'activePetId'), activePetId);
    }
  }, [activePetId, isLoading, currentUser]);

  // Guardar calendar events cada vez que cambien
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'calendarEvents'), petCalendarEvents);
    }
  }, [petCalendarEvents, isLoading, currentUser]);

  // Guardar mood data cada vez que cambie
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'moodData'), petMoodData);
    }
  }, [petMoodData, isLoading, currentUser]);

  // Guardar mood history cada vez que cambie
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'moodHistory'), petMoodHistory);
    }
  }, [petMoodHistory, isLoading, currentUser]);

  // Guardar health history cada vez que cambie
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'healthHistory'), petHealthHistory);
    }
  }, [petHealthHistory, isLoading, currentUser]);

  // Guardar gallery photos cada vez que cambien
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'galleryPhotos'), petGalleryPhotos);
    }
  }, [petGalleryPhotos, isLoading, currentUser]);

  // Guardar albums cada vez que cambien
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveToStorage(getUserStorageKey(currentUser.id, 'albums'), petAlbums);
    }
  }, [petAlbums, isLoading, currentUser]);

  // ========== FIN FUNCIONES DE ALMACENAMIENTO ==========

  // Obtener mascota activa
  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  // Obtener datos de la mascota activa
  const calendarEvents = petCalendarEvents[activePetId] || [];
  const moodData = petMoodData[activePetId] || {
    happiness: 80,
    energy: 65,
    calmness: 50,
    playfulness: 75,
    appetite: 90,
  };
  const moodHistory = petMoodHistory[activePetId] || [];
  const healthHistory = petHealthHistory[activePetId] || [];
  const galleryPhotos = petGalleryPhotos[activePetId] || [];
  const albums = petAlbums[activePetId] || [{ id: 'all', name: 'Todas las Fotos' }];

  // Para mantener compatibilidad con código existente
  const petPhoto = activePet?.photo;
  const petInfo = activePet;

  const updatePetPhoto = (photoUri) => {
    setPets(pets.map(p => 
      p.id === activePetId ? { ...p, photo: photoUri } : p
    ));
  };

  const updatePetInfo = (newInfo) => {
    setPets(pets.map(p => 
      p.id === activePetId ? { ...p, ...newInfo } : p
    ));
  };

  const addPet = (petData) => {
    const newPet = {
      ...petData,
      id: Date.now().toString(),
      photo: null,
    };
    setPets([...pets, newPet]);
    
    // Si es la primera mascota, establecerla como activa
    if (pets.length === 0) {
      setActivePetId(newPet.id);
    }
    
    return newPet.id;
  };

  const deletePet = (petId) => {
    if (pets.length <= 1) {
      alert('No puedes eliminar la única mascota');
      return;
    }
    const updatedPets = pets.filter(p => p.id !== petId);
    setPets(updatedPets);
    
    // Si se elimina la mascota activa, cambiar a la primera mascota restante
    if (activePetId === petId) {
      setActivePetId(updatedPets[0].id);
    }
  };

  const switchActivePet = (petId) => {
    setActivePetId(petId);
  };

  const addCalendarEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
    };
    setPetCalendarEvents({
      ...petCalendarEvents,
      [activePetId]: [...(petCalendarEvents[activePetId] || []), newEvent]
    });
  };

  const deleteCalendarEvent = (eventId) => {
    setPetCalendarEvents({
      ...petCalendarEvents,
      [activePetId]: (petCalendarEvents[activePetId] || []).filter(e => e.id !== eventId)
    });
  };

  const updateCalendarEvent = (eventId, updatedEvent) => {
    setPetCalendarEvents({
      ...petCalendarEvents,
      [activePetId]: (petCalendarEvents[activePetId] || []).map(e => 
        e.id === eventId ? { ...e, ...updatedEvent } : e
      )
    });
  };

  const updateMoodData = (newMoodData) => {
    const currentMood = petMoodData[activePetId] || moodData;
    const updatedMood = { ...currentMood, ...newMoodData };
    
    setPetMoodData({
      ...petMoodData,
      [activePetId]: updatedMood
    });
    
    // Agregar al historial
    const date = new Date();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;
    
    // Determinar estado de ánimo basado en los valores
    const avgMood = Object.values(updatedMood).reduce((a, b) => a + b, 0) / Object.values(updatedMood).length;
    let moodLabel = '';
    let moodColor = '';
    
    if (avgMood >= 80) {
      moodLabel = 'Muy Feliz';
      moodColor = '#FFD700';
    } else if (avgMood >= 60) {
      moodLabel = 'Activo';
      moodColor = '#FF6B9D';
    } else if (avgMood >= 40) {
      moodLabel = 'Tranquilo';
      moodColor = '#9C88FF';
    } else {
      moodLabel = 'Bajo de ánimo';
      moodColor = '#B0B0B0';
    }
    
    const historyEntry = {
      id: Date.now(),
      date: formattedDate,
      mood: moodLabel,
      color: moodColor,
      timestamp: date.getTime()
    };
    
    const currentHistory = petMoodHistory[activePetId] || [];
    setPetMoodHistory({
      ...petMoodHistory,
      [activePetId]: [historyEntry, ...currentHistory].slice(0, 10)
    });
  };

  const addHealthRecord = (record) => {
    // Usar la fecha personalizada si está disponible, sino usar la fecha actual
    const date = record.customDate ? new Date(record.customDate) : new Date();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    const newRecord = {
      ...record,
      id: Date.now(),
      date: formattedDate,
      timestamp: date.getTime(),
    };
    
    setPetHealthHistory({
      ...petHealthHistory,
      [activePetId]: [newRecord, ...(petHealthHistory[activePetId] || [])]
    });
  };

  const deleteHealthRecord = (recordId) => {
    setPetHealthHistory({
      ...petHealthHistory,
      [activePetId]: (petHealthHistory[activePetId] || []).filter(r => r.id !== recordId)
    });
  };

  const addGalleryPhoto = (photoData) => {
    const newPhoto = {
      ...photoData,
      id: Date.now().toString(),
      isFavorite: false,
      albums: ['all'],
    };
    setPetGalleryPhotos({
      ...petGalleryPhotos,
      [activePetId]: [newPhoto, ...(petGalleryPhotos[activePetId] || [])]
    });
  };

  const toggleFavorite = (photoId) => {
    const currentPhotos = petGalleryPhotos[activePetId] || [];
    setPetGalleryPhotos({
      ...petGalleryPhotos,
      [activePetId]: currentPhotos.map(photo => 
        photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo
      )
    });
  };

  const createAlbum = (albumName) => {
    const newAlbum = {
      id: Date.now().toString(),
      name: albumName,
    };
    const currentAlbums = petAlbums[activePetId] || [{ id: 'all', name: 'Todas las Fotos' }];
    setPetAlbums({
      ...petAlbums,
      [activePetId]: [...currentAlbums, newAlbum]
    });
    return newAlbum.id;
  };

  const addPhotoToAlbum = (photoId, albumId) => {
    const currentPhotos = petGalleryPhotos[activePetId] || [];
    setPetGalleryPhotos({
      ...petGalleryPhotos,
      [activePetId]: currentPhotos.map(photo => {
        if (photo.id === photoId) {
          const updatedAlbums = photo.albums.includes(albumId) 
            ? photo.albums 
            : [...photo.albums, albumId];
          return { ...photo, albums: updatedAlbums };
        }
        return photo;
      })
    });
  };

  const deletePhoto = (photoId) => {
    const currentPhotos = petGalleryPhotos[activePetId] || [];
    setPetGalleryPhotos({
      ...petGalleryPhotos,
      [activePetId]: currentPhotos.filter(p => p.id !== photoId)
    });
  };

  // Renderizar siempre, pero los datos estarán vacíos si no hay usuario
  return (
    <PetContext.Provider value={{ 
      // Multi-pet management
      pets,
      activePetId,
      addPet,
      deletePet,
      switchActivePet,
      // Current active pet (backward compatibility)
      petPhoto, 
      updatePetPhoto, 
      petInfo, 
      updatePetInfo,
      // Calendar
      calendarEvents,
      addCalendarEvent,
      deleteCalendarEvent,
      updateCalendarEvent,
      // Mood
      moodData,
      updateMoodData,
      moodHistory,
      // Health
      healthHistory,
      addHealthRecord,
      deleteHealthRecord,
      // Gallery
      galleryPhotos,
      addGalleryPhoto,
      toggleFavorite,
      albums,
      createAlbum,
      addPhotoToAlbum,
      deletePhoto,
      // Storage management
      isLoading,
    }}>
      {children}
    </PetContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet debe usarse dentro de un PetProvider');
  }
  return context;
};
