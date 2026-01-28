import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Slider from '@react-native-community/slider';

const EditMoodModal = ({ visible, onClose, onSave, currentMood, editingMetric }) => {
  const [happiness, setHappiness] = useState(currentMood.happiness);
  const [energy, setEnergy] = useState(currentMood.energy);
  const [calmness, setCalmness] = useState(currentMood.calmness);
  const [playfulness, setPlayfulness] = useState(currentMood.playfulness);
  const [appetite, setAppetite] = useState(currentMood.appetite);

  const handleSave = () => {
    onSave({
      happiness,
      energy,
      calmness,
      playfulness,
      appetite,
    });
    Alert.alert('✅ Actualizado', 'El estado emocional ha sido actualizado.');
    onClose();
  };

  const moodSettings = [
    { 
      key: 'happiness', 
      label: 'Felicidad', 
      value: happiness, 
      setValue: setHappiness, 
      color: colors.happy,
      icon: '😊'
    },
    { 
      key: 'energy', 
      label: 'Energía', 
      value: energy, 
      setValue: setEnergy, 
      color: colors.playful,
      icon: '⚡'
    },
    { 
      key: 'calmness', 
      label: 'Calma', 
      value: calmness, 
      setValue: setCalmness, 
      color: colors.calm,
      icon: '🧘'
    },
    { 
      key: 'playfulness', 
      label: 'Juguetón', 
      value: playfulness, 
      setValue: setPlayfulness, 
      color: colors.primary,
      icon: '🎾'
    },
    { 
      key: 'appetite', 
      label: 'Apetito', 
      value: appetite, 
      setValue: setAppetite, 
      color: colors.walk,
      icon: '🍖'
    },
  ];

  // Filtrar para mostrar solo la métrica que se está editando
  const metricsToShow = editingMetric 
    ? moodSettings.filter(m => m.label === editingMetric.label)
    : moodSettings;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMetric ? `Editar ${editingMetric.label}` : 'Editar Estado Emocional'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {metricsToShow.map((mood) => (
              <View key={mood.key} style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderIcon}>{mood.icon}</Text>
                  <Text style={styles.sliderLabel}>{mood.label}</Text>
                  <Text style={[styles.sliderValue, { color: mood.color }]}>
                    {Math.round(mood.value)}%
                  </Text>
                </View>
                
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={mood.value}
                  onValueChange={mood.setValue}
                  minimumTrackTintColor={mood.color}
                  maximumTrackTintColor={colors.paleGray}
                  thumbTintColor={mood.color}
                />
                
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>Bajo</Text>
                  <Text style={styles.sliderLabelText}>Medio</Text>
                  <Text style={styles.sliderLabelText}>Alto</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.paleGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  scrollView: {
    marginBottom: spacing.lg,
  },
  sliderContainer: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sliderIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sliderLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  sliderValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sliderLabelText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
});

export default EditMoodModal;
