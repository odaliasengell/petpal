import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { PetAvatar, Card, SectionHeader } from '../components';
import EditModal from '../components/EditModal';
import { usePet } from '../contexts/PetContext';

/**
 * PetProfileScreen - Pantalla de perfil de la mascota
 * 
 * CAPACIDAD NATIVA: GALERÍA DE IMÁGENES
 * - Permite cambiar la foto de perfil de la mascota desde la galería
 * - La foto se sincroniza con el Dashboard usando Context API
 * - Permite editar toda la información del perfil
 */
const PetProfileScreen = () => {
  const { petPhoto, updatePetPhoto, petInfo, updatePetInfo } = usePet();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState({ field: '', value: '', title: '' });

  /**
   * Solicita permisos de galería y cámara al montar el componente
   */
  useEffect(() => {
    requestPermissions();
  }, []);

  // Si no hay mascota, mostrar mensaje
  if (!petInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyTitle}>No hay mascotas</Text>
          <Text style={styles.emptyMessage}>
            Agrega tu primera mascota en el Dashboard para ver su perfil
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Solicita permisos de galería y cámara (capacidad nativa)
   */
  const requestPermissions = async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    
    if (galleryStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert(
        'Permisos Requeridos',
        'Necesitamos acceso a tu cámara y galería para cambiar la foto de perfil.'
      );
    }
  };

  /**
   * Muestra opciones para cambiar la foto
   */
  const handleChangePhoto = () => {
    Alert.alert(
      'Cambiar Foto de Perfil',
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
        updatePetPhoto(result.assets[0].uri);
        Alert.alert(
          '¡Foto Actualizada!',
          'La foto de perfil de tu mascota ha sido actualizada.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
    }
  };

  /**
   * Abre la galería para seleccionar una foto
   * CAPACIDAD NATIVA: ImagePicker.launchImageLibraryAsync()
   */
  const handleSelectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        updatePetPhoto(result.assets[0].uri);
        Alert.alert(
          '¡Foto Actualizada!',
          'La foto de perfil de tu mascota ha sido actualizada.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la foto: ' + error.message);
    }
  };

  /**
   * Calcula el estado de salud según el peso de la mascota
   * @returns {object} { status: string, color: string, emoji: string, message: string }
   */
  const getHealthStatus = () => {
    const peso = parseFloat(petInfo.peso);
    const especie = petInfo.especie?.toLowerCase() || '';
    const raza = petInfo.raza?.toLowerCase() || '';

    // Si no hay peso registrado
    if (!peso || isNaN(peso)) {
      return {
        status: 'Sin datos',
        color: colors.textSecondary,
        emoji: '📊',
        message: 'Agrega el peso para ver el estado de salud'
      };
    }

    // Rangos de peso ideales por especie y raza
    const pesoRangos = {
      perro: {
        // Razas pequeñas
        chihuahua: { min: 1.5, max: 3 },
        pomerania: { min: 1.8, max: 3.5 },
        yorkshire: { min: 2, max: 3.5 },
        pug: { min: 6, max: 9 },
        'shih tzu': { min: 4, max: 7.5 },
        // Razas medianas
        beagle: { min: 9, max: 11 },
        cocker: { min: 12, max: 15 },
        bulldog: { min: 18, max: 25 },
        // Razas grandes
        labrador: { min: 25, max: 36 },
        'golden retriever': { min: 25, max: 34 },
        pastor: { min: 30, max: 40 },
        rottweiler: { min: 35, max: 60 },
        // Default para perros
        default: { min: 8, max: 30 }
      },
      gato: {
        siames: { min: 3, max: 5 },
        persa: { min: 3.5, max: 6 },
        maine: { min: 5, max: 9 },
        bengala: { min: 4, max: 7 },
        default: { min: 3, max: 6 }
      }
    };

    let rangoIdeal;

    // Determinar rango ideal según especie y raza
    if (especie.includes('perro') || especie.includes('dog')) {
      rangoIdeal = pesoRangos.perro[raza] || pesoRangos.perro.default;
    } else if (especie.includes('gato') || especie.includes('cat')) {
      rangoIdeal = pesoRangos.gato[raza] || pesoRangos.gato.default;
    } else {
      // Para otras especies, usar un rango genérico
      rangoIdeal = { min: peso * 0.8, max: peso * 1.2 };
    }

    // Calcular estado de salud
    const pesoMin = rangoIdeal.min;
    const pesoMax = rangoIdeal.max;
    const margenBajo = pesoMin * 0.9; // 10% por debajo
    const margenAlto = pesoMax * 1.1; // 10% por encima

    if (peso < margenBajo) {
      // Bajo peso crítico
      return {
        status: 'Desnutrido',
        color: '#E74C3C',
        emoji: '⚠️',
        message: `Peso muy bajo (ideal: ${pesoMin}-${pesoMax} kg). Consulta al veterinario.`
      };
    } else if (peso < pesoMin) {
      // Bajo peso
      return {
        status: 'Bajo Peso',
        color: '#F39C12',
        emoji: '⬇️',
        message: `Ligeramente bajo (ideal: ${pesoMin}-${pesoMax} kg).`
      };
    } else if (peso >= pesoMin && peso <= pesoMax) {
      // Peso ideal
      return {
        status: 'Saludable',
        color: colors.success,
        emoji: '✅',
        message: `Peso ideal (${pesoMin}-${pesoMax} kg). ¡Excelente!`
      };
    } else if (peso <= margenAlto) {
      // Sobrepeso leve
      return {
        status: 'Sobrepeso',
        color: '#F39C12',
        emoji: '⬆️',
        message: `Ligeramente alto (ideal: ${pesoMin}-${pesoMax} kg).`
      };
    } else {
      // Obesidad
      return {
        status: 'Obesidad',
        color: '#E74C3C',
        emoji: '🚨',
        message: `Peso muy alto (ideal: ${pesoMin}-${pesoMax} kg). Consulta al veterinario.`
      };
    }
  };

  const healthStatus = getHealthStatus();

  /**
   * Abre el modal para editar un campo
   */
  const handleEdit = (field, value, title) => {
    setEditingField({ field, value, title });
    setModalVisible(true);
  };

  /**
   * Guarda los cambios del campo editado
   */
  const handleSave = (field, value) => {
    // Validación para edad máxima de 80
    if (field === 'edad') {
      const edadNum = parseInt(value);
      if (isNaN(edadNum) || edadNum < 0) {
        Alert.alert('Error', 'Por favor ingresa una edad válida.');
        return;
      }
      if (edadNum > 80) {
        Alert.alert('Error', 'La edad máxima permitida es 80 años.');
        return;
      }
    }
    
    updatePetInfo({ [field]: value });
    Alert.alert('¡Actualizado!', 'La información ha sido actualizada correctamente.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil de Mascota</Text>
        </View>

        {/* Avatar y Nombre */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            <PetAvatar size={160} source={petPhoto} />
            <View style={styles.changePhotoButton}>
              <Image source={require('../assets/foto.png')} style={styles.changePhotoIcon} resizeMode="contain" />
            </View>
          </TouchableOpacity>
          <Text style={styles.petName}>{petInfo.nombre}</Text>
          <Text style={styles.petBreed}>{petInfo.raza}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Cambiar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Información Básica */}
        <View style={styles.section}>
          <SectionHeader title="Información Básica" />
          <Card style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('nombre', petInfo.nombre, 'Nombre')}
            >
              <Text style={styles.infoLabel}>Nombre</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.nombre}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('especie', petInfo.especie, 'Especie')}
            >
              <Text style={styles.infoLabel}>Especie</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.especie}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('raza', petInfo.raza, 'Raza')}
            >
              <Text style={styles.infoLabel}>Raza</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.raza}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('edad', petInfo.edad, 'Edad')}
            >
              <Text style={styles.infoLabel}>Edad</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.edad}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('fechaNacimiento', petInfo.fechaNacimiento, 'Fecha de Nacimiento')}
            >
              <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.fechaNacimiento}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Salud y Bienestar */}
        <View style={styles.section}>
          <SectionHeader title="Salud y Bienestar" />
          <Card style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('peso', petInfo.peso, 'Peso')}
            >
              <Text style={styles.infoLabel}>Peso</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.peso}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('altura', petInfo.altura, 'Altura')}
            >
              <Text style={styles.infoLabel}>Altura</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.altura}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Condición</Text>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text style={[styles.infoValue, { color: healthStatus.color, fontWeight: '600' }]}>
                  {healthStatus.emoji} {healthStatus.status}
                </Text>
                <Text style={styles.healthMessage}>{healthStatus.message}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Contacto Veterinario */}
        <View style={styles.section}>
          <SectionHeader title="Veterinario" />
          <TouchableOpacity 
            onPress={() => handleEdit('veterinario', petInfo.veterinario, 'Veterinario')}
            activeOpacity={0.8}
          >
            <Card style={styles.vetCard}>
              <View style={styles.vetIcon}>
                <Image source={require('../assets/veterinario.png')} style={styles.vetIconImage} resizeMode="contain" />
              </View>
              <Text style={styles.vetName}>{petInfo.veterinario}</Text>
              <Text style={styles.editTextSmall}>Editar</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleEdit('clinica', petInfo.clinica, 'Clínica')}
            activeOpacity={0.8}
          >
            <Card style={styles.vetInfoCard}>
              <Text style={styles.vetInfoLabel}>Clínica</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.vetInfoValue}>{petInfo.clinica}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleEdit('telefono', petInfo.telefono, 'Teléfono')}
            activeOpacity={0.8}
          >
            <Card style={styles.vetInfoCard}>
              <Text style={styles.vetInfoLabel}>Teléfono</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.vetContact}>📞 {petInfo.telefono}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Notas Especiales */}
        <View style={styles.section}>
          <SectionHeader title="Notas Especiales" />
          <TouchableOpacity 
            onPress={() => handleEdit('notas', petInfo.notas, 'Notas')}
            activeOpacity={0.8}
          >
            <Card>
              <Text style={styles.notesText}>
                {petInfo.notas}
              </Text>
              <Text style={styles.editTextNote}>Editar notas</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Identificación */}
        <View style={styles.section}>
          <SectionHeader title="Identificación" />
          <Card style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('microchip', petInfo.microchip, 'Microchip')}
            >
              <Text style={styles.infoLabel}>Microchip</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.microchip}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleEdit('placa', petInfo.placa, 'Placa')}
            >
              <Text style={styles.infoLabel}>Placa</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{petInfo.placa}</Text>
                <Text style={styles.editText}>Editar</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Modal de Edición */}
      <EditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        field={editingField.field}
        value={editingField.value}
        title={editingField.title}
      />
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
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    elevation: 4,
  },
  changePhotoIcon: {
    width: 24,
    height: 24,
  },
  petName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  petBreed: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  editButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
  },
  editButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoCard: {
    paddingVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  editIcon: {
    fontSize: fontSize.sm,
    opacity: 0.6,
  },
  editText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  editIconSmall: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  editTextSmall: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  editIconNote: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.md,
    fontWeight: fontWeight.medium,
    textAlign: 'right',
  },
  editTextNote: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.md,
    fontWeight: fontWeight.medium,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  vetCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.sm,
  },
  vetInfoCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  vetIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.vet + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  vetIconText: {
    fontSize: 40,
  },
  vetIconImage: {
    width: 40,
    height: 40,
  },
  vetName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  vetInfoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  vetInfoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  vetClinic: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  vetContactRow: {
    marginTop: spacing.sm,
  },
  vetContact: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },  healthMessage: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
    maxWidth: '100%',
  },  notesText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
    fontWeight: fontWeight.regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PetProfileScreen;
