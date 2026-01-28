import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image,
  SafeAreaView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';
import Button from '../components/Button';

/**
 * CameraScreen - Pantalla de captura de fotos de la mascota
 * 
 * CAPACIDAD NATIVA 1: CÁMARA
 * - Utiliza expo-camera para acceder a la cámara del dispositivo
 * - Solicita permisos nativos de cámara y galería
 * - Permite capturar fotos nuevas o seleccionar de la galería
 * - Guarda las fotos capturadas en el estado
 * 
 * CONCEPTOS TÉCNICOS:
 * - Hooks de React: useState para estado, useEffect para ciclo de vida
 * - Permisos nativos: Camera.useCameraPermissions()
 * - Referencias: useRef para acceder a la instancia de cámara
 * - Async/Await: Para operaciones asíncronas de permisos y captura
 */
const CameraScreen = ({ navigation }) => {
  // Estado para la foto capturada
  const [photo, setPhoto] = useState(null);
  // Estado para mostrar/ocultar la vista de cámara
  const [showCamera, setShowCamera] = useState(false);
  // Hook de permisos de expo-camera (capacidad nativa)
  const [permission, requestPermission] = useCameraPermissions();
  // Referencia a la instancia de cámara
  const cameraRef = useRef(null);

  /**
   * useEffect - Se ejecuta al montar el componente
   * Solicita permisos de galería automáticamente
   */
  useEffect(() => {
    requestGalleryPermissions();
  }, []);

  /**
   * Solicita permisos de galería de imágenes (capacidad nativa)
   * Async/await para manejar promesas
   */
  const requestGalleryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos Requeridos',
        'Necesitamos acceso a tu galería para guardar fotos de tu mascota.'
      );
    }
  };

  /**
   * Maneja la captura de foto desde la cámara
   * PROCESO TÉCNICO:
   * 1. Verifica que la cámara esté lista
   * 2. Llama al método nativo takePictureAsync()
   * 3. Recibe URI de la imagen capturada
   * 4. Actualiza el estado con la foto
   */
  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Calidad 80% (balance calidad/tamaño)
          base64: false, // No necesitamos base64
          exif: false // No necesitamos datos EXIF
        });
        setPhoto(photo);
        setShowCamera(false);
        
        Alert.alert(
          '¡Foto Capturada!',
          'La foto de tu mascota ha sido guardada.',
          [{ text: 'OK' }]
        );
      } catch (error) {
        Alert.alert('Error', 'No se pudo capturar la foto: ' + error.message);
      }
    }
  };

  /**
   * Abre el selector de imágenes nativo (capacidad nativa)
   * PROCESO:
   * 1. Llama a la API nativa de galería
   * 2. Usuario selecciona imagen
   * 3. Retorna URI de la imagen seleccionada
   */
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Permite recortar
        aspect: [1, 1], // Aspecto cuadrado
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
        Alert.alert(
          '¡Imagen Seleccionada!',
          'La foto de tu mascota está lista.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen: ' + error.message);
    }
  };

  /**
   * Maneja el flujo de permisos de cámara
   * ESTADOS DE PERMISOS:
   * - undefined: No se han solicitado
   * - granted: Concedidos
   * - denied: Denegados
   */
  const handleOpenCamera = async () => {
    // Si los permisos no están definidos, solicitarlos
    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos Denegados',
          'Necesitamos acceso a la cámara para tomar fotos de tu mascota.'
        );
        return;
      }
    }

    // Si los permisos fueron denegados
    if (!permission.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos Denegados',
          'Necesitamos acceso a la cámara para tomar fotos de tu mascota.'
        );
        return;
      }
    }

    // Todo OK, mostrar cámara
    setShowCamera(true);
  };

  // Vista de la cámara activa
  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        {/* CameraView: Componente nativo de expo-camera */}
        <CameraView 
          style={styles.camera}
          ref={cameraRef}
          facing="back" // Cámara trasera por defecto
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleTakePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // Vista principal con opciones
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fotos de Mascota</Text>
          <Text style={styles.subtitle}>
            Captura momentos especiales de tu compañero
          </Text>
        </View>

        {/* Preview de foto si existe */}
        {photo && (
          <View style={styles.photoPreview}>
            <Text style={styles.previewLabel}>Última foto capturada:</Text>
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.previewImage} 
            />
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button
            title="Abrir Cámara"
            onPress={handleOpenCamera}
            variant="primary"
          />
          
          <Button
            title="Seleccionar de Galería"
            onPress={handlePickImage}
            variant="secondary"
          />
          
          <Button
            title="Volver al Inicio"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>

        {/* Información técnica */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Capacidades Nativas Utilizadas:</Text>
          <Text style={styles.infoText}>• Acceso a cámara del dispositivo</Text>
          <Text style={styles.infoText}>• Acceso a galería de fotos</Text>
          <Text style={styles.infoText}>• Sistema de permisos nativo</Text>
          <Text style={styles.infoText}>• Edición y recorte de imágenes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  photoPreview: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: spacing.md,
    backgroundColor: colors.paleGray,
  },
  buttonContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  infoBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  // Estilos de cámara
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: spacing.xl,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: spacing.md,
  },
  cancelButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  placeholder: {
    width: 70,
  },
});

export default CameraScreen;
