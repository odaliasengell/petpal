import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { SectionHeader } from '../components';
import { usePet } from '../contexts/PetContext';

/**
 * GalleryScreen - Pantalla de galería de fotos de mascotas
 * 
 * CAPACIDAD NATIVA: CÁMARA Y GALERÍA DE IMÁGENES
 * - Permite tomar fotos con la cámara del dispositivo
 * - Permite seleccionar y subir fotos desde la galería del dispositivo
 * - Muestra las fotos subidas en una cuadrícula
 * - Solicita permisos nativos para acceder a cámara y galería
 */
const GalleryScreen = () => {
  const { galleryPhotos, addGalleryPhoto, toggleFavorite, albums, createAlbum, addPhotoToAlbum, deletePhoto } = usePet();
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [photoToAddToAlbum, setPhotoToAddToAlbum] = useState(null);
  const [selectAlbumModalVisible, setSelectAlbumModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Datos de ejemplo para la galería (eliminado)

  /**
   * useEffect - Solicita permisos de galería y cámara al montar el componente
   */
  useEffect(() => {
    requestPermissions();
  }, []);
  /**
   * Abre la imagen en pantalla completa
   */
  const handleImagePress = (photo) => {
    setSelectedImage(photo);
    setImageViewerVisible(true);
  };
  /**
   * Solicita permisos de galería, cámara y ubicación (capacidad nativa)
   */
  const requestPermissions = async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    
    if (galleryStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert(
        'Permisos Requeridos',
        'Necesitamos acceso a tu cámara y galería para que puedas capturar y subir fotos de tu mascota.'
      );
    }
    
    if (locationStatus.status !== 'granted') {
      Alert.alert(
        'Permiso de Ubicación',
        'El permiso de ubicación nos permite guardar dónde se tomaron las fotos de tu mascota.'
      );
    }
  };

  /**
   * Abre la cámara para tomar una foto
   * CAPACIDAD NATIVA: ImagePicker.launchCameraAsync()
   */
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Obtener ubicación GPS
        let location = null;
        let address = null;
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === 'granted') {
            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            
            // Obtener dirección a partir de coordenadas
            const geocode = await Location.reverseGeocodeAsync({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
            
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              // Construir dirección legible
              const parts = [
                place.street,
                place.city || place.subregion,
                place.region,
                place.country
              ].filter(Boolean);
              address = parts.join(', ');
            }
            
            location = {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              address: address,
            };
          }
        } catch (error) {
          console.log('No se pudo obtener la ubicación:', error);
        }

        const photoData = {
          uri: result.assets[0].uri,
          date: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          location: location,
        };
        
        addGalleryPhoto(photoData);
        
        const locationText = location 
          ? `\n📍 ${location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}`
          : '';
        
        Alert.alert(
          '¡Foto Capturada!',
          `La foto se ha agregado a tu galería.${locationText}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
    }
  };

  /**
   * Abre la galería del dispositivo para seleccionar una imagen
   * CAPACIDAD NATIVA: ImagePicker.launchImageLibraryAsync()
   */
  const handleUploadPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const photoData = {
          uri: result.assets[0].uri,
          date: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
        };
        
        addGalleryPhoto(photoData);
        
        Alert.alert(
          '¡Foto Agregada!',
          'La foto se ha agregado a tu galería.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen: ' + error.message);
    }
  };

  /**
   * OPTIMIZACIÓN 4: useCallback para funciones
   * Evita recrear funciones en cada render
   */
  const handleCreateAlbum = useCallback(() => {
    if (!newAlbumName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el álbum');
      return;
    }
    createAlbum(newAlbumName.trim());
    setNewAlbumName('');
    setAlbumModalVisible(false);
    Alert.alert('✅ Álbum Creado', `El álbum "${newAlbumName}" ha sido creado.`);
  }, [newAlbumName, createAlbum]);

  const handleAddToAlbum = (photoId) => {
    setPhotoToAddToAlbum(photoId);
    setSelectAlbumModalVisible(true);
  };

  const handleSelectAlbumForPhoto = (albumId) => {
    if (photoToAddToAlbum) {
      addPhotoToAlbum(photoToAddToAlbum, albumId);
      setSelectAlbumModalVisible(false);
      setPhotoToAddToAlbum(null);
      Alert.alert('✅ Agregada al Álbum', 'La foto se agregó al álbum seleccionado.');
    }
  };

  const handleDeletePhoto = (photoId) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deletePhoto(photoId)
        }
      ]
    );
  };

  const handlePhotoLongPress = (photo) => {
    const locationInfo = photo.location 
      ? `\n📍 ${photo.location.address || `Lat: ${photo.location.latitude.toFixed(6)}, Lon: ${photo.location.longitude.toFixed(6)}`}`
      : '\n📍 Sin ubicación';
    
    Alert.alert(
      'Información de Foto',
      `📅 Fecha: ${photo.date}${locationInfo}\n\nSelecciona una acción:`,
      [
        {
          text: photo.isFavorite ? '💔 Quitar de Favoritos' : '❤️ Agregar a Favoritos',
          onPress: () => toggleFavorite(photo.id)
        },
        {
          text: '📁 Agregar a Álbum',
          onPress: () => handleAddToAlbum(photo.id)
        },
        {
          text: '🗑️ Eliminar',
          onPress: () => handleDeletePhoto(photo.id),
          style: 'destructive'
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  /**
   * OPTIMIZACIÓN 5: useMemo para cálculos costosos
   * Filtra fotos solo cuando cambian las dependencias
   */
  const filteredPhotos = useMemo(() => {
    if (selectedAlbum === 'all') return galleryPhotos;
    if (selectedAlbum === 'favorites') return galleryPhotos.filter(p => p.isFavorite);
    return galleryPhotos.filter(p => p.albums.includes(selectedAlbum));
  }, [selectedAlbum, galleryPhotos]);

  const favoriteCount = useMemo(() => {
    return galleryPhotos.filter(p => p.isFavorite).length;
  }, [galleryPhotos]);

  // Componente de encabezado para el FlatList
  const ListHeaderComponent = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Galería</Text>
          <Text style={styles.headerSubtitle}>Momentos especiales de mi mascota</Text>
        </View>
        <TouchableOpacity 
          style={styles.createAlbumButton}
          onPress={() => setAlbumModalVisible(true)}
        >
          <Text style={styles.createAlbumButtonText}>+ Álbum</Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{galleryPhotos.length}</Text>
          <Text style={styles.statLabel}>Fotos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{albums.length - 1}</Text>
          <Text style={styles.statLabel}>Álbumes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favoritas</Text>
        </View>
      </View>

      {/* Botones para capturar/subir fotos */}
      <View style={styles.uploadSection}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          <Image source={require('../assets/foto.png')} style={styles.uploadIcon} resizeMode="contain" />
          <Text style={styles.uploadButtonText}>Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.uploadButton, styles.uploadButtonSecondary]}
          onPress={handleUploadPhoto}
          activeOpacity={0.7}
        >
          <Image source={require('../assets/galeria.png')} style={styles.uploadIcon} resizeMode="contain" />
          <Text style={styles.uploadButtonTextSecondary}>Subir desde Galería</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de Álbumes */}
      <View style={styles.section}>
        <SectionHeader title="Álbumes" />
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.albumsScroll}
        >
          <TouchableOpacity
            style={[
              styles.albumChip,
              selectedAlbum === 'all' && styles.albumChipActive
            ]}
            onPress={() => setSelectedAlbum('all')}
          >
            <Text style={[
              styles.albumChipText,
              selectedAlbum === 'all' && styles.albumChipTextActive
            ]}>
              <Image source={require('../assets/galeria.png')} style={styles.albumChipIcon} resizeMode="contain" /> Todas ({galleryPhotos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.albumChip,
              selectedAlbum === 'favorites' && styles.albumChipActive
            ]}
            onPress={() => setSelectedAlbum('favorites')}
          >
            <Text style={[
              styles.albumChipText,
              selectedAlbum === 'favorites' && styles.albumChipTextActive
            ]}>
              <Image source={require('../assets/favoritos.png')} style={styles.albumChipIcon} resizeMode="contain" /> Favoritas ({favoriteCount})
            </Text>
          </TouchableOpacity>

          {albums.filter(a => a.id !== 'all').map(album => (
            <TouchableOpacity
              key={album.id}
              style={[
                styles.albumChip,
                selectedAlbum === album.id && styles.albumChipActive
              ]}
              onPress={() => setSelectedAlbum(album.id)}
            >
              <Text style={[
                styles.albumChipText,
                selectedAlbum === album.id && styles.albumChipTextActive
              ]}>
                <Image source={require('../assets/albums.png')} style={styles.albumChipIcon} resizeMode="contain" /> {album.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Título de sección de fotos */}
      <View style={styles.section}>
        <SectionHeader 
          title={selectedAlbum === 'all' ? 'Todas las Fotos' : selectedAlbum === 'favorites' ? 'Favoritas' : albums.find(a => a.id === selectedAlbum)?.name || 'Fotos'}
          subtitle={`${filteredPhotos.length} foto${filteredPhotos.length !== 1 ? 's' : ''}`}
        />
        {filteredPhotos.length > 0 && (
          <Text style={styles.deleteHint}>Da click para visualizar la foto</Text>
        )}
      </View>
    </>
  );

  // Componente cuando no hay fotos
  const ListEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Image source={require('../assets/foto.png')} style={styles.emptyIcon} resizeMode="contain" />
      <Text style={styles.emptyText}>No hay fotos aquí</Text>
      <Text style={styles.emptySubtext}>
        {selectedAlbum === 'favorites' 
          ? 'Mantén presionada una foto para agregarla a favoritos'
          : 'Toma o sube fotos para comenzar'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/**
       * OPTIMIZACIÓN 6: FlatList en lugar de ScrollView
       * Renderiza solo los items visibles, mejorando el rendimiento
       */}
      <FlatList
        data={filteredPhotos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item: photo }) => (
          <TouchableOpacity 
            style={styles.photoCard}
            activeOpacity={0.8}
            onPress={() => handleImagePress(photo)}
          >
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.uploadedPhoto}
              resizeMode="cover"
            />
            {photo.isFavorite && (
              <View style={styles.favoriteIndicator}>
                <Image source={require('../assets/favoritos.png')} style={styles.favoriteIcon} resizeMode="contain" />
              </View>
            )}
            <View style={styles.photoOverlay}>
              <Text style={styles.photoDate}>{photo.date}</Text>
            </View>
          </TouchableOpacity>
        )}
        // Optimizaciones adicionales de FlatList
        windowSize={10}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={9}
        columnWrapperStyle={filteredPhotos.length > 0 ? { justifyContent: 'space-between', paddingHorizontal: spacing.lg } : null}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para Crear Álbum */}
      <Modal
        visible={albumModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlbumModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Nuevo Álbum</Text>
            <TextInput
              style={styles.albumInput}
              placeholder="Nombre del álbum"
              placeholderTextColor={colors.textSecondary}
              value={newAlbumName}
              onChangeText={setNewAlbumName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setNewAlbumName('');
                  setAlbumModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleCreateAlbum}
              >
                <Text style={styles.modalButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Seleccionar Álbum */}
      <Modal
        visible={selectAlbumModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectAlbumModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar a Álbum</Text>
            <ScrollView style={styles.albumList}>
              {albums.filter(a => a.id !== 'all').map(album => (
                <TouchableOpacity
                  key={album.id}
                  style={styles.albumListItem}
                  onPress={() => handleSelectAlbumForPhoto(album.id)}
                >
                  <Text style={styles.albumListItemText}>📂 {album.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { marginTop: spacing.md }]}
              onPress={() => {
                setSelectAlbumModalVisible(false);
                setPhotoToAddToAlbum(null);
              }}
            >
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Visualización de Imagen en Grande */}
      <Modal
        visible={imageViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity 
            style={styles.closeImageViewer}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text style={styles.closeImageViewerText}>✕</Text>
          </TouchableOpacity>

          {selectedImage && (
            <>
              <Image 
                source={{ uri: selectedImage.uri }} 
                style={styles.fullImage}
                resizeMode="contain"
              />
              
              <View style={styles.imageInfoOverlay}>
                <View style={styles.imageInfoRow}>
                  <Text style={styles.imageInfoText}>📅 {selectedImage.date}</Text>
                  {selectedImage.location?.address ? (
                    <Text style={styles.imageInfoText}>📍 {selectedImage.location.address}</Text>
                  ) : selectedImage.location ? (
                    <Text style={styles.imageInfoText}>📍 Lat: {selectedImage.location.latitude.toFixed(4)}, Lon: {selectedImage.location.longitude.toFixed(4)}</Text>
                  ) : (
                    <Text style={[styles.imageInfoText, { opacity: 0.6 }]}>📍 Sin ubicación</Text>
                  )}
                </View>
                
                <View style={styles.imageActions}>
                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={() => {
                      toggleFavorite(selectedImage.id);
                    }}
                  >
                    <Image 
                      source={selectedImage.isFavorite ? require('../assets/favoritos.png') : require('../assets/favoritos.png')} 
                      style={[styles.imageActionIcon, !selectedImage.isFavorite && { opacity: 0.3 }]} 
                      resizeMode="contain" 
                    />
                    <Text style={styles.imageActionText}>
                      {selectedImage.isFavorite ? 'Favorita' : 'Favorito'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={() => {
                      setPhotoToAddToAlbum(selectedImage);
                      setImageViewerVisible(false);
                      setSelectAlbumModalVisible(true);
                    }}
                  >
                    <Image source={require('../assets/albums.png')} style={styles.imageActionIcon} resizeMode="contain" />
                    <Text style={styles.imageActionText}>Álbum</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.imageActionButton, styles.deleteActionButton]}
                    onPress={() => {
                      setImageViewerVisible(false);
                      Alert.alert(
                        'Eliminar Foto',
                        '¿Estás seguro de que quieres eliminar esta foto?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: () => deletePhoto(selectedImage.id)
                          }
                        ]
                      );
                    }}
                  >
                    <Image source={require('../assets/eliminar.png')} style={styles.imageActionIcon} resizeMode="contain" />
                    <Text style={styles.imageActionText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  createAlbumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  createAlbumButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    elevation: 2,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  deleteHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  specialMomentsScroll: {
    paddingRight: spacing.lg,
  },
  specialMomentCard: {
    width: 280,
    marginRight: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 4,
  },
  specialMomentImage: {
    width: '100%',
    height: 180,
  },
  specialMomentPlaceholder: {
    flex: 1,
    backgroundColor: colors.primaryLight + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialMomentIcon: {
    fontSize: 64,
  },
  specialMomentInfo: {
    padding: spacing.lg,
  },
  specialMomentTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  specialMomentDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '31%',
    aspectRatio: 1,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    elevation: 2,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 32,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.xs,
  },
  photoDate: {
    fontSize: fontSize.xs,
    color: colors.textWhite,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  albumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  albumIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  albumIconText: {
    fontSize: 28,
  },
  albumInfo: {
    flex: 1,
  },
  albumTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  albumCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  albumArrow: {
    fontSize: fontSize.xxl,
    color: colors.lightGray,
    fontWeight: fontWeight.light,
  },
  uploadSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  uploadButtonSecondary: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.border,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.md,
  },
  uploadButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  uploadButtonTextSecondary: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  favoriteIcon: {
    width: 16,
    height: 16,
  },
  albumsScroll: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  albumChip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
  },
  albumChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  albumChipText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  albumChipTextActive: {
    color: colors.background,
  },
  albumChipIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  albumInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.background,
  },
  modalButtonTextCancel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  albumList: {
    maxHeight: 300,
    marginBottom: spacing.md,
  },
  albumListItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  albumListItemText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  // Estilos para el visor de imagen en grande
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageViewer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeImageViewerText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  fullImage: {
    width: '100%',
    height: '70%',
  },
  imageInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: spacing.lg,
    paddingBottom: 40,
  },
  imageInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  imageInfoText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
    fontWeight: fontWeight.medium,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  imageActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  deleteActionButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
  },
  imageActionIcon: {
    width: 24,
    height: 24,
    marginBottom: spacing.xs,
  },
  imageActionText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
    fontWeight: fontWeight.semibold,
  },
});

export default GalleryScreen;
