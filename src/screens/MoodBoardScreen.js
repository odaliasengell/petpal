import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { SectionHeader, Card } from '../components';
import EditMoodModal from '../components/EditMoodModal';
import { usePet } from '../contexts/PetContext';

const MoodBoardScreen = () => {
  const { moodData, updateMoodData, moodHistory } = usePet();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);

  // Extraer valores del contexto
  const { happiness, energy, calmness, playfulness, appetite } = moodData;

  /**
   * Determina el estado emocional general basado en las métricas
   */
  const getOverallMood = () => {
    const average = (happiness + energy + calmness + playfulness + appetite) / 5;
    
    if (average >= 80) {
      return { mood: 'Excelente', emoji: '😊', color: colors.happy, description: 'Tu mascota está muy feliz y saludable' };
    } else if (average >= 65) {
      return { mood: 'Muy Bien', emoji: '😄', color: colors.playful, description: 'Tu mascota está en buen estado' };
    } else if (average >= 50) {
      return { mood: 'Bien', emoji: '🙂', color: colors.calm, description: 'Tu mascota está tranquila' };
    } else if (average >= 35) {
      return { mood: 'Regular', emoji: '😐', color: '#F39C12', description: 'Tu mascota necesita más atención' };
    } else {
      return { mood: 'Necesita Cuidados', emoji: '😟', color: '#E74C3C', description: 'Presta más atención a tu mascota' };
    }
  };

  const overallMood = getOverallMood();

  /**
   * Genera una descripción textual del estado
   */
  const getMoodDescription = () => {
    const descriptors = [];
    
    if (happiness >= 70) descriptors.push('Feliz');
    else if (happiness < 40) descriptors.push('Triste');
    
    if (energy >= 70) descriptors.push('Activo');
    else if (energy < 40) descriptors.push('Cansado');
    
    if (calmness >= 70) descriptors.push('Tranquilo');
    else if (calmness < 40) descriptors.push('Inquieto');
    
    if (playfulness >= 70) descriptors.push('Juguetón');
    
    if (appetite >= 70) descriptors.push('Con Apetito');
    else if (appetite < 40) descriptors.push('Inapetente');

    return descriptors.length > 0 ? descriptors.join(' y ') : 'Estado Normal';
  };

  const moodMetrics = [
    {
      id: 1,
      label: 'Felicidad',
      value: happiness,
      color: colors.happy,
      icon: 'felicidad',
    },
    {
      id: 2,
      label: 'Energía',
      value: energy,
      color: colors.playful,
      icon: 'energia',
    },
    {
      id: 3,
      label: 'Calma',
      value: calmness,
      color: colors.calm,
      icon: 'calma',
    },
    {
      id: 4,
      label: 'Juguetón',
      value: playfulness,
      color: colors.primary,
      icon: 'jugueton',
    },
    {
      id: 5,
      label: 'Apetito',
      value: appetite,
      color: colors.walk,
      icon: 'apetito',
    },
  ];

  const moodIconImages = {
    'felicidad': require('../assets/felicidad.png'),
    'energia': require('../assets/energia.png'),
    'calma': require('../assets/calma.png'),
    'jugueton': require('../assets/jugueton.png'),
    'apetito': require('../assets/apetito.png'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Estado Emocional</Text>
            <Text style={styles.headerSubtitle}>Toca cada métrica para editar</Text>
          </View>
        </View>

        {/* Estado General Visual */}
        <View style={styles.section}>
          <Card style={styles.generalMoodCard}>
            <Text style={styles.generalMoodLabel}>Estado Actual</Text>
            <Text style={styles.generalMoodValue}>{getMoodDescription()}</Text>
            <Text style={styles.generalMoodDescription}>{overallMood.description}</Text>
            
            {/* Patrón de colores basado en los valores */}
            <View style={styles.moodPatternContainer}>
              <View style={styles.moodPattern}>
                {moodMetrics.map((mood) => (
                  <View
                    key={mood.id}
                    style={[
                      styles.moodPatternBar,
                      {
                        flex: mood.value / 10,
                        backgroundColor: mood.color,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Indicador circular */}
            <View style={styles.circularIndicator}>
              <View style={[styles.circularRing, { borderColor: overallMood.color }]}>
                <View style={[styles.circularInner, { backgroundColor: overallMood.color + '30' }]}>
                  <Text style={styles.circularIcon}>{overallMood.emoji}</Text>
                  <Text style={styles.circularText}>{overallMood.mood}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Métricas Detalladas */}
        <View style={styles.section}>
          <SectionHeader title="Métricas Detalladas" subtitle="Toca cada card para ajustar" />
          
          {moodMetrics.map((mood) => (
            <TouchableOpacity 
              key={mood.id} 
              style={styles.metricCard}
              activeOpacity={0.7}
              onPress={() => {
                setEditingMetric(mood);
                setModalVisible(true);
              }}
            >
              <View style={styles.metricHeader}>
                <View style={styles.metricIcon}>
                  <Image source={moodIconImages[mood.icon]} style={styles.metricIconImage} resizeMode="contain" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>{mood.label}</Text>
                  <Text style={styles.metricValue}>{mood.value}%</Text>
                </View>
                <View style={styles.editIndicator}>
                  <Text style={styles.editIndicatorText}>Editar</Text>
                </View>
              </View>
              
              {/* Barra de progreso visual */}
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${mood.value}%`,
                      backgroundColor: mood.color,
                    },
                  ]}
                />
              </View>

              {/* Patrón decorativo único para cada métrica */}
              <View style={styles.decorativePattern}>
                {Array.from({ length: Math.floor(mood.value / 20) }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.decorativeDot,
                      { backgroundColor: mood.color },
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Historial de Estados */}
        <View style={styles.section}>
          <SectionHeader title="Historial Reciente" />
          
          {moodHistory.length === 0 ? (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>
                No hay registros aún. Edita el estado emocional para crear el primer registro.
              </Text>
            </Card>
          ) : (
            <View style={styles.historyTimeline}>
              {moodHistory.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>{item.date}</Text>
                  </View>
                  <View style={[styles.historyDot, { backgroundColor: item.color }]} />
                  <View style={[
                    styles.historyCard,
                    { borderLeftColor: item.color }
                  ]}>
                    <Text style={styles.historyMood}>{item.mood}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Modal de Edición */}
      <EditMoodModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingMetric(null);
        }}
        onSave={updateMoodData}
        currentMood={moodData}
        editingMetric={editingMetric}
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
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  generalMoodCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  generalMoodLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  generalMoodValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  generalMoodDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  moodPatternContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  moodPattern: {
    flexDirection: 'row',
    height: 80,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  moodPatternBar: {
    marginHorizontal: 2,
    borderRadius: borderRadius.sm,
  },
  circularIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularIcon: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  circularText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  metricCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  metricIconText: {
    fontSize: 24,
  },
  metricIconImage: {
    width: 28,
    height: 28,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
  },
  editIndicator: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  editIndicatorIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  editIndicatorText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.paleGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  decorativePattern: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  historyTimeline: {
    marginTop: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  historyDate: {
    width: 60,
    marginRight: spacing.md,
  },
  historyDateText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    textAlign: 'right',
  },
  historyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
    borderWidth: 4,
    borderColor: colors.background,
  },
  historyCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
  },
  historyMood: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  patternCard: {
    marginBottom: spacing.md,
  },
  patternIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  patternIconText: {
    fontSize: 28,
  },
  patternTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  patternDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  editButton: {
    padding: spacing.sm,
  },
  editButtonText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});

export default MoodBoardScreen;
