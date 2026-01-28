import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import StorageService from '../services/StorageService';
import { colors } from '../theme';

/**
 * SettingsScreen - Pantalla de configuración
 * 
 * Proporciona opciones para gestionar el almacenamiento de datos
 */
const SettingsScreen = () => {
  const [storageSize, setStorageSize] = useState('0');

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Configuración</Text>
        <Text style={styles.subtitle}>Gestión de datos y almacenamiento</Text>
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
          <Text style={styles.buttonIcon}>🗑️</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  buttonContent: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 12,
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
    margin: 20,
    marginTop: 0,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SettingsScreen;
