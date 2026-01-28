import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import StorageService from '../services/StorageService';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';

/**
 * SettingsScreen - Pantalla de configuración
 * 
 * Proporciona opciones para gestionar el almacenamiento de datos y sesión
 */
const SettingsScreen = () => {
  const [storageSize, setStorageSize] = useState('0');
  const { currentUser, logout } = useAuth();

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Confirmar',
      '¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.clearAllData();
            if (success) {
              Alert.alert('✅ Éxito', 'Todos los datos han sido eliminados. Por favor, reinicia la aplicación.');
            }
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    const data = await StorageService.exportData();
    if (data) {
      // Aquí podrías implementar compartir los datos
      console.log('Datos exportados:', data);
      Alert.alert('✅ Éxito', 'Datos exportados. Revisa la consola.');
    }
  };

  const handleDebugStorage = async () => {
    await StorageService.debugStorage();
    Alert.alert('✅ Éxito', 'Revisa la consola para ver los datos.');
  };

  const handleGetStorageSize = async () => {
    const size = await StorageService.getStorageSize();
    setStorageSize(size);
    Alert.alert('📊 Tamaño de almacenamiento', `${size} KB`);
  };

  const handleLogout = () => {
    Alert.alert(
      '🚪 Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              Alert.alert('✅ Sesión cerrada', 'Has cerrado sesión correctamente');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Configuración</Text>
        <Text style={styles.subtitle}>Gestión de datos y almacenamiento</Text>
        {currentUser && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>👤 {currentUser.username}</Text>
            <Text style={styles.userInfoEmail}>{currentUser.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonIcon}>🚪</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
            <Text style={styles.buttonSubtext}>Salir de tu cuenta</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Almacenamiento Local</Text>
        <Text style={styles.sectionDescription}>
          Todos tus datos se guardan automáticamente en el dispositivo.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStorageSize}
        >
          <Text style={styles.buttonIcon}>📊</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Ver tamaño de almacenamiento</Text>
            <Text style={styles.buttonSubtext}>
              {storageSize !== '0' ? `${storageSize} KB` : 'Toca para calcular'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleDebugStorage}
        >
          <Text style={styles.buttonIcon}>🔍</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Ver datos almacenados</Text>
            <Text style={styles.buttonSubtext}>Muestra los datos en consola</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportData}
        >
          <Text style={styles.buttonIcon}>📤</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Exportar datos</Text>
            <Text style={styles.buttonSubtext}>Hacer backup de tu información</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zona de peligro</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClearData}
        >
          <Image source={require('../assets/eliminar.png')} style={styles.buttonIcon} resizeMode="contain" />
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonText, styles.dangerText]}>
              Eliminar todos los datos
            </Text>
            <Text style={styles.buttonSubtext}>
              Esta acción no se puede deshacer
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          ℹ️ Los datos se guardan automáticamente después de cada cambio.
        </Text>
        <Text style={styles.infoText}>
          📱 Toda la información se almacena localmente en tu dispositivo.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textWhite,
    opacity: 0.9,
  },
  userInfo: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfoText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  userInfoEmail: {
    fontSize: fontSize.md,
    color: colors.textWhite,
    opacity: 0.8,
  },
  section: {
    margin: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  buttonIcon: {
    width: fontSize.xxl,
    height: fontSize.xxl,
    marginRight: spacing.lg,
  },
  buttonContent: {
    flex: 1,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  buttonSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerText: {
    color: '#D32F2F',
  },
  info: {
    margin: spacing.xl,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.lg,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: '#1565C0',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});

export default SettingsScreen;
