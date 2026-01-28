import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * PetContext - Contexto global para compartir datos de la mascota
 * 
 * Permite que la foto de perfil y otros datos se compartan
 * entre diferentes pantallas de la aplicación.
 * Todos los datos se guardan automáticamente en AsyncStorage
 */
const PetContext = createContext();

// Claves de almacenamiento
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

export const PetProvider = ({ children }) => {
  // Estados iniciales vacíos - se cargarán desde AsyncStorage
  const [pets, setPets] = useState([]);
  const [activePetId, setActivePetId] = useState('1');
  const [petCalendarEvents, setPetCalendarEvents] = useState({});
  const [petMoodData, setPetMoodData] = useState({});
  const [petMoodHistory, setPetMoodHistory] = useState({});
  const [petHealthHistory, setPetHealthHistory] = useState({});
  const [petGalleryPhotos, setPetGalleryPhotos] = useState({});
  const [petAlbums, setPetAlbums] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Datos por defecto para inicializar
  const defaultPets = [
    {
      id: '1',
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Golden Retriever',
      edad: '3 años',
      fechaNacimiento: '15 de Marzo, 2021',
      peso: '8.5 kg',
      altura: '55 cm',
      veterinario: 'Dr. Carlos Méndez',
      clinica: 'Clínica Veterinaria Pet Care',
      telefono: '(555) 123-4567',
      microchip: '982000123456789',
      placa: 'PET-2024-001',
      notas: 'Luna es una perrita muy activa y juguetona. Le encanta correr en el parque y jugar con otros perros. Es importante mantener su rutina de ejercicio diario. Tiene alergia leve al pollo, usar alimento especial hipoalergénico.',
      photo: null,
    }
  ];

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

  // Cargar todos los datos al iniciar la app
  useEffect(() => {
    const loadAllData = async () => {
      try {
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
          loadFromStorage(STORAGE_KEYS.PETS, defaultPets),
          loadFromStorage(STORAGE_KEYS.ACTIVE_PET_ID, '1'),
          loadFromStorage(STORAGE_KEYS.CALENDAR_EVENTS, {}),
          loadFromStorage(STORAGE_KEYS.MOOD_DATA, {}),
          loadFromStorage(STORAGE_KEYS.MOOD_HISTORY, {}),
          loadFromStorage(STORAGE_KEYS.HEALTH_HISTORY, {}),
          loadFromStorage(STORAGE_KEYS.GALLERY_PHOTOS, {}),
          loadFromStorage(STORAGE_KEYS.ALBUMS, {}),
        ]);

        setPets(savedPets);
        setActivePetId(savedActivePetId);
        setPetCalendarEvents(savedCalendarEvents);
        setPetMoodData(savedMoodData);
        setPetMoodHistory(savedMoodHistory);
        setPetHealthHistory(savedHealthHistory);
        setPetGalleryPhotos(savedGalleryPhotos);
        setPetAlbums(savedAlbums);
      } catch (error) {
        console.error('Error cargando datos:', error);
        // Si hay error, usar datos por defecto
        setPets(defaultPets);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Guardar pets cada vez que cambien
  useEffect(() => {
    if (!isLoading && pets.length > 0) {
      saveToStorage(STORAGE_KEYS.PETS, pets);
    }
  }, [pets, isLoading]);

  // Guardar activePetId cada vez que cambie
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.ACTIVE_PET_ID, activePetId);
    }
  }, [activePetId, isLoading]);

  // Guardar calendar events cada vez que cambien
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.CALENDAR_EVENTS, petCalendarEvents);
    }
  }, [petCalendarEvents, isLoading]);

  // Guardar mood data cada vez que cambie
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.MOOD_DATA, petMoodData);
    }
  }, [petMoodData, isLoading]);

  // Guardar mood history cada vez que cambie
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.MOOD_HISTORY, petMoodHistory);
    }
  }, [petMoodHistory, isLoading]);

  // Guardar health history cada vez que cambie
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.HEALTH_HISTORY, petHealthHistory);
    }
  }, [petHealthHistory, isLoading]);

  // Guardar gallery photos cada vez que cambien
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.GALLERY_PHOTOS, petGalleryPhotos);
    }
  }, [petGalleryPhotos, isLoading]);

  // Guardar albums cada vez que cambien
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.ALBUMS, petAlbums);
    }
  }, [petAlbums, isLoading]);

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

  // Mostrar un indicador de carga mientras se cargan los datos
  if (isLoading) {
    return null; // o un componente de carga si lo tienes
  }

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
