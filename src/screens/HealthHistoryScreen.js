import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { SectionHeader, Badge } from '../components';
import AddHealthRecordModal from '../components/AddHealthRecordModal';
import { usePet } from '../contexts/PetContext';

const HealthHistoryScreen = () => {
  const { healthHistory, addHealthRecord, deleteHealthRecord } = usePet();
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * OPTIMIZACIÓN 2: useCallback
   * Evita recrear funciones en cada render
   */
  const handleAddRecord = useCallback((record) => {
    addHealthRecord(record);
    setModalVisible(false);
  }, [addHealthRecord]);

  const handleDeleteRecord = useCallback((recordId) => {
    Alert.alert(
      'Eliminar Registro',
      '¿Estás seguro de eliminar este registro de salud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteHealthRecord(recordId)
        }
      ]
    );
  }, [deleteHealthRecord]);

  /**
   * OPTIMIZACIÓN 3: useMemo
   * Evita recalcular el resumen en cada render
   * Solo se recalcula cuando healthHistory cambia
   */
  const summary = useMemo(() => ({
    vaccines: healthHistory.filter(r => r.category === 'vaccine').length,
    consultations: healthHistory.filter(r => r.category === 'consultation').length + healthHistory.filter(r => r.category === 'checkup').length,
    treatments: healthHistory.filter(r => r.category === 'treatment').length,
  }), [healthHistory]);

  // Datos de ejemplo para el historial médico (eliminado)

  const categoryColors = {
    vaccine: colors.vaccine,
    checkup: colors.primary,
    treatment: colors.treatment,
    consultation: colors.vet,
  };

  const categoryLabels = {
    vaccine: 'Vacuna',
    checkup: 'Control',
    treatment: 'Tratamiento',
    consultation: 'Consulta',
  };

  const categoryIcons = {
    vaccine: '💉',
    checkup: '✓',
    treatment: '💊',
    consultation: '🏥',
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
            <Text style={styles.headerTitle}>Historial de Salud</Text>
            <Text style={styles.headerSubtitle}>Registro médico completo</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Resumen de Salud */}
        <View style={styles.section}>
          <SectionHeader title="Resumen" />
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.vaccine + '20' }]}>
                <Text style={styles.summaryIconText}>💉</Text>
              </View>
              <Text style={styles.summaryValue}>{summary.vaccines}</Text>
              <Text style={styles.summaryLabel}>Vacunas</Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.vet + '20' }]}>
                <Text style={styles.summaryIconText}>🏥</Text>
              </View>
              <Text style={styles.summaryValue}>{summary.consultations}</Text>
              <Text style={styles.summaryLabel}>Consultas</Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.treatment + '20' }]}>
                <Text style={styles.summaryIconText}>💊</Text>
              </View>
              <Text style={styles.summaryValue}>{summary.treatments}</Text>
              <Text style={styles.summaryLabel}>Tratamientos</Text>
            </View>
          </View>
        </View>

        {/* Timeline del Historial */}
        <View style={styles.section}>
          <SectionHeader title="Línea de Tiempo" />
          
          {healthHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No hay registros aún</Text>
              <Text style={styles.emptySubtext}>Presiona "+ Agregar" para crear tu primer registro médico</Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {healthHistory.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.timelineItem}
                  onLongPress={() => handleDeleteRecord(item.id)}
                  activeOpacity={0.7}
                >
                  {/* Timeline Line */}
                  <View style={styles.timelineLineContainer}>
                    <View style={[
                      styles.timelineDot,
                      { backgroundColor: categoryColors[item.category] }
                    ]} />
                    {index < healthHistory.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  {/* Event Card */}
                  <View style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventHeaderLeft}>
                        <Text style={styles.eventIcon}>
                          {categoryIcons[item.category]}
                        </Text>
                        <View>
                          <Text style={styles.eventTitle}>{item.title}</Text>
                          <Text style={styles.eventDate}>{item.date}</Text>
                        </View>
                      </View>
                      <Badge 
                        label={categoryLabels[item.category]} 
                        color={categoryColors[item.category]} 
                        size="small"
                      />
                    </View>

                    <View style={styles.eventBody}>
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorLabel}>Doctor:</Text>
                        <Text style={styles.doctorName}>{item.doctor}</Text>
                      </View>
                      {item.notes ? (
                        <Text style={styles.eventNotes}>{item.notes}</Text>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Próximas Citas - Eliminar sección */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Modal de Agregar Registro */}
      <AddHealthRecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddRecord}
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
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'space-around',
    elevation: 4,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  summaryIconText: {
    fontSize: 28,
  },
  summaryValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  timeline: {
    marginTop: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timelineLineContainer: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: colors.background,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  eventCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  eventHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  eventTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  eventBody: {
    marginTop: spacing.sm,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  doctorLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  doctorName: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  eventNotes: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  upcomingCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 4,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  upcomingIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  upcomingIconText: {
    fontSize: 28,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  upcomingDate: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  upcomingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  upcomingDetailText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
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
});

export default HealthHistoryScreen;
