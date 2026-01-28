import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { SectionHeader, Badge } from '../components';
import AddEventModal from '../components/AddEventModal';
import { usePet } from '../contexts/PetContext';

const CalendarScreen = () => {
  // Estado para el mes y año actual
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [modalVisible, setModalVisible] = useState(false);
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = usePet();

  const categoryColors = {
    vaccine: colors.vaccine,
    bath: colors.bath,
    walk: colors.walk,
    vet: colors.vet,
    treatment: colors.treatment,
  };

  const categoryLabels = {
    vaccine: 'Vacuna',
    bath: 'Baño',
    walk: 'Paseo',
    vet: 'Veterinario',
    treatment: 'Tratamiento',
  };

  // Nombres de meses
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calcular días en el mes actual
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);

  // Funciones para cambiar mes
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1);
  };

  // Filtrar eventos solo del mes y año actual
  const eventsForCurrentMonth = calendarEvents.filter(e => 
    e.month === currentMonth && e.year === currentYear
  );

  const eventsForSelectedDate = eventsForCurrentMonth.filter(e => e.date === selectedDate);

  const handleAddEvent = async (event) => {
    // Agregar mes y año al evento
    const eventWithMonthYear = {
      ...event,
      month: currentMonth,
      year: currentYear,
    };
    
    addCalendarEvent(eventWithMonthYear);
    
    Alert.alert('✅ Evento Agregado', `"${event.title}" ha sido agregado al calendario.`);
  };

  const handleDeleteEvent = (eventId, eventTitle) => {
    Alert.alert(
      'Eliminar Evento',
      `¿Estás seguro de eliminar "${eventTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteCalendarEvent(eventId);
            Alert.alert('🗑️ Eliminado', 'El evento ha sido eliminado.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Calendario</Text>
            <View style={styles.monthSelector}>
              <TouchableOpacity 
                style={styles.monthButton}
                onPress={previousMonth}
              >
                <Text style={styles.monthButtonText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.headerSubtitle}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity 
                style={styles.monthButton}
                onPress={nextMonth}
              >
                <Text style={styles.monthButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Evento</Text>
          </TouchableOpacity>
        </View>

        {/* Leyenda de Categorías */}
        <View style={styles.section}>
          <SectionHeader title="Categorías" />
          <View style={styles.legendContainer}>
            <Badge label="Vacunas" color={colors.vaccine} size="small" style={styles.legendBadge} />
            <Badge label="Baño" color={colors.bath} size="small" style={styles.legendBadge} />
            <Badge label="Paseos" color={colors.walk} size="small" style={styles.legendBadge} />
            <Badge label="Veterinario" color={colors.vet} size="small" style={styles.legendBadge} />
            <Badge label="Tratamiento" color={colors.treatment} size="small" style={styles.legendBadge} />
          </View>
        </View>

        {/* Calendario Visual */}
        <View style={styles.section}>
          <SectionHeader title="Días del Mes" />
          <View style={styles.calendarGrid}>
            {daysInMonth.map((day) => {
              // Solo eventos del mes y año actual
              const hasEvents = eventsForCurrentMonth.some(e => e.date === day);
              const isSelected = day === selectedDate;
              const dayEvents = eventsForCurrentMonth.filter(e => e.date === day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDayCell,
                  ]}
                  onPress={() => setSelectedDate(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayNumber,
                  ]}>
                    {day}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventIndicators}>
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <View
                          key={event.id}
                          style={[
                            styles.eventDot,
                            { backgroundColor: categoryColors[event.category] }
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Eventos del Día Seleccionado */}
        <View style={styles.section}>
          <SectionHeader 
            title={`Eventos - Día ${selectedDate}`}
            subtitle={eventsForSelectedDate.length > 0 
              ? `${eventsForSelectedDate.length} evento(s)` 
              : 'Sin eventos'}
          />
          
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => (
              <TouchableOpacity
                key={event.id}
                onLongPress={() => handleDeleteEvent(event.id, event.title)}
                activeOpacity={0.8}
              >
                <View 
                  style={[
                    styles.eventCard,
                    { borderLeftColor: categoryColors[event.category] }
                  ]}
                >
                  <View style={styles.eventHeader}>
                    <Badge 
                      label={categoryLabels[event.category]} 
                      color={categoryColors[event.category]} 
                      size="small"
                    />
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.deleteHint}>Mantén presionado para eliminar</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity 
              style={styles.emptyState}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyStateIcon}>📅</Text>
              <Text style={styles.emptyStateText}>No hay eventos programados</Text>
              <Text style={styles.emptyStateSubtext}>Toca para agregar uno</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Próximos Eventos */}
        <View style={styles.section}>
          <SectionHeader 
            title="Próximos Eventos del Mes" 
            subtitle={eventsForCurrentMonth.length > 0 ? `${eventsForCurrentMonth.length} eventos` : 'Sin eventos'}
          />
          {eventsForCurrentMonth.length > 0 ? (
            eventsForCurrentMonth
              .sort((a, b) => a.date - b.date)
              .slice(0, 5)
              .map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onLongPress={() => handleDeleteEvent(event.id, event.title)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.upcomingEventCard,
                      { backgroundColor: categoryColors[event.category] + '10' }
                    ]}
                  >
                    <View style={styles.upcomingEventDate}>
                      <Text style={styles.upcomingEventDay}>{event.date}</Text>
                      <Text style={styles.upcomingEventMonth}>NOV</Text>
                    </View>
                    <View style={styles.upcomingEventInfo}>
                      <Text style={styles.upcomingEventTitle}>{event.title}</Text>
                      <Text style={styles.upcomingEventTime}>{event.time}</Text>
                    </View>
                    <Badge 
                      label={categoryLabels[event.category]} 
                      color={categoryColors[event.category]} 
                      size="small"
                    />
                  </View>
                </TouchableOpacity>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateText}>No hay eventos programados</Text>
              <Text style={styles.emptyStateSubtext}>Agrega eventos al calendario</Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Modal para Agregar Evento */}
      <AddEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddEvent}
        selectedDate={selectedDate}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    elevation: 3,
  },
  addButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  monthButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    minWidth: 40,
    alignItems: 'center',
  },
  monthButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.bold,
    minWidth: 140,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendBadge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    elevation: 2,
  },
  selectedDayCell: {
    backgroundColor: colors.primary,
  },
  dayNumber: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  selectedDayNumber: {
    color: colors.textWhite,
  },
  eventIndicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  eventCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eventTime: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  eventTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  deleteHint: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    elevation: 2,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  emptyStateSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  upcomingEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  upcomingEventDate: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  upcomingEventDay: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  upcomingEventMonth: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  upcomingEventInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  upcomingEventTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  upcomingEventTime: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export default CalendarScreen;
