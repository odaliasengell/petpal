import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { Card, SectionHeader } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { usePet } from '../contexts/PetContext';

/**
 * UserProfileScreen - Pantalla de perfil del usuario
 * 
 * CAPACIDADES NATIVAS:
 * - Galería de imágenes para foto de perfil
 * - AsyncStorage para guardar datos del usuario
 * - Contador automático de mascotas
 */
const UserProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const { pets } = usePet();
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState(currentUser?.username || 'Usuario');

  useEffect(() => {
    loadUserPhoto();
  }, [currentUser]);

  /**
   * Carga la foto del usuario desde AsyncStorage
   */
  const loadUserPhoto = async () => {
    try {
      const photoKey = `@PetPal:user_${currentUser?.id}:photo`;
      const savedPhoto = await AsyncStorage.getItem(photoKey);
      if (savedPhoto) {
        setUserPhoto(savedPhoto);
      }
    } catch (error) {
      console.error('Error cargando foto de usuario:', error);
    }
  };

  /**
   * Guarda la foto del usuario en AsyncStorage
   */
  const saveUserPhoto = async (uri) => {
    try {
      const photoKey = `@PetPal:user_${currentUser?.id}:photo`;
      await AsyncStorage.setItem(photoKey, uri);
      setUserPhoto(uri);
    } catch (error) {
      console.error('Error guardando foto de usuario:', error);
    }
  };

  /**
   * Muestra opciones para cambiar la foto de perfil
   */
  const handleChangePhoto = () => {
    Alert.alert(
      'Foto de Perfil',
      'Elige una opción:',
      [
        {
          text: 'Tomar Foto',
          onPress: handleTakePhoto
        },
        {
          text: 'Seleccionar de Galería',
          onPress: handleSelectFromGallery
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  /**
   * Abre la cámara para tomar una foto
   */
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        saveUserPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  /**
   * Abre la galería para seleccionar una foto
   */
  const handleSelectFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita acceso a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        saveUserPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  /**
   * Calcula estadísticas del usuario
   */
  const getTotalPets = () => pets.length;
  const getMemberSince = () => {
    if (!currentUser?.createdAt) return 'Hace poco';
    const createdDate = new Date(currentUser.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) !== 1 ? 's' : ''}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) !== 1 ? 'es' : ''}`;
    return `${Math.floor(diffDays / 365)} año${Math.floor(diffDays / 365) !== 1 ? 's' : ''}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        {/* Foto de Perfil */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            onPress={handleChangePhoto}
            activeOpacity={0.8}
            style={styles.photoContainer}
          >
            <View style={styles.photoWrapper}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <Image source={require('../assets/usuarioperfil.png')} style={styles.placeholderIcon} resizeMode="contain" />
                </View>
              )}
            </View>
            <View style={styles.cameraButton}>
              <Image source={require('../assets/foto.png')} style={styles.cameraIcon} resizeMode="contain" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
          
          <TouchableOpacity 
            style={styles.editPhotoButton}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <Text style={styles.editPhotoText}>Cambiar Foto de Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <SectionHeader title="Estadísticas" />
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getTotalPets()}</Text>
                <Text style={styles.statLabel}>Mascota{getTotalPets() !== 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getMemberSince()}</Text>
                <Text style={styles.statLabel}>Miembro desde</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Información de la Cuenta */}
        <View style={styles.section}>
          <SectionHeader title="Información de la Cuenta" />
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Image source={require('../assets/usuarioperfil.png')} style={styles.infoIcon} resizeMode="contain" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre de Usuario</Text>
                <Text style={styles.infoValue}>{currentUser?.username}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Image source={require('../assets/correo.png')} style={styles.infoIcon} resizeMode="contain" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{currentUser?.email}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Image source={require('../assets/calendario.png')} style={styles.infoIcon} resizeMode="contain" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Fecha de Registro</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'No disponible'
                  }
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Mis Mascotas */}
        <View style={styles.section}>
          <SectionHeader title="Mis Mascotas" />
          <Card style={styles.petsCard}>
            {getTotalPets() > 0 ? (
              <>
                <View style={styles.petsHeader}>
                  <Image source={require('../assets/perro.png')} style={styles.petsCountIcon} resizeMode="contain" />
                  <Text style={styles.petsCount}>{getTotalPets()} Mascota{getTotalPets() !== 1 ? 's' : ''} Registrada{getTotalPets() !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.petsList}>
                  {pets.map((pet, index) => (
                    <View key={index} style={styles.petItem}>
                      {pet.photo ? (
                        <Image source={{ uri: pet.photo }} style={styles.petPhotoImage} resizeMode="cover" />
                      ) : (
                        <Image source={require('../assets/animales.png')} style={styles.petEmojiImage} resizeMode="contain" />
                      )}
                      <View style={styles.petInfo}>
                        <Text style={styles.petName}>{pet.nombre}</Text>
                        <Text style={styles.petBreed}>{pet.raza}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noPetsContainer}>
                <Image source={require('../assets/animales.png')} style={styles.noPetsIconImage} resizeMode="contain" />
                <Text style={styles.noPetsText}>Aún no tienes mascotas</Text>
                <Text style={styles.noPetsSubtext}>Agrega tu primera mascota desde el Dashboard</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Botón Cerrar Sesión */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Image source={require('../assets/cerrar secion.png')} style={styles.logoutIconImage} resizeMode="contain" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    elevation: 2,
  },
  photoContainer: {
    position: 'relative',
  },
  photoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSecondary,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 60,
    height: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    elevation: 4,
  },
  cameraIcon: {
    width: 20,
    height: 20,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  editPhotoButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
  },
  editPhotoText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsCard: {
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  infoCard: {
    paddingVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 66,
  },
  petsCard: {
    paddingVertical: spacing.md,
  },
  petsHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  petsCountIcon: {
    width: 48,
    height: 48,
    borderBottomColor: colors.border,
  },
  petsCount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  petsList: {
    paddingTop: spacing.sm,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    bEmojiImage: {
    width: 32,
    height: 32,
    marginRight: spacing.md,
  },
  petorderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  petEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  petEmojiImage: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  petPhotoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  petBreIconImage: {
    width: 60,
    height: 60,
    marginBottom: spacing.md,
  },
  noPetsed: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  noPetsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noPetsIcon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  noPetsText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  noPetsSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutIconImage: {
    width: 20,
    height: 20,
    marginRight: spacing.sm,
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
});

export default UserProfileScreen;
