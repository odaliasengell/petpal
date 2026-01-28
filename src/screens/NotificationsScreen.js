import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';
import Button from '../components/Button';
import Card from '../components/Card';
import NotificationService from '../services/NotificationService';

/**
 * NotificationsScreen - Pantalla de gestión de notificaciones
 * 
 * CAPACIDAD NATIVA 2: NOTIFICACIONES
 * Demuestra el uso completo del servicio de notificaciones:
 * - Solicitud de permisos
 * - Programación de recordatorios
 * - Listado de notificaciones activas
 * - Cancelación de notificaciones
 * 
 * CONCEPTOS TÉCNICOS:
 * - Service Layer Pattern: Usa NotificationService
 * - useState: Gestiona estado de notificaciones y permisos
 * - useEffect: Configura listeners al montar componente
 * - Async/Await: Para operaciones asíncronas
 */
const NotificationsScreen = ({ navigation }) => {
  // Estado para permisos concedidos
  const [hasPermissions, setHasPermissions] = useState(false);
  // Estado para notificaciones programadas
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  /**
   * useEffect - Se ejecuta al montar el componente
   * Configura listeners de notificaciones
   */
  useEffect(() => {
    // Verificar permisos al cargar
    checkPermissions();

    // Configurar listeners (callbacks cuando llegan notificaciones)
    NotificationService.setupListeners(
      // Callback cuando llega una notificación
      (notification) => {
        console.log('Notificación recibida:', notification);
        loadScheduledNotifications(); // Recargar lista
      },
      // Callback cuando el usuario toca la notificación
      (response) => {
        console.log('Usuario tocó notificación:', response);
        handleNotificationResponse(response);
      }
    );

    // Cleanup: Remover listeners al desmontar componente
    return () => {
      NotificationService.removeListeners();
    };
  }, []);

  /**
   * Verifica si ya tenemos permisos de notificaciones
   */
  const checkPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setHasPermissions(granted);
    if (granted) {
      loadScheduledNotifications();
    }
  };

  /**
   * Solicita permisos de notificaciones
   */
  const handleRequestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setHasPermissions(granted);
    
    if (granted) {
      Alert.alert(
        '✅ Permisos Concedidos',
        'Ahora puedes recibir recordatorios de cuidados de tu mascota.'
      );
      loadScheduledNotifications();
    }
  };

  /**
   * Carga la lista de notificaciones programadas
   */
  const loadScheduledNotifications = async () => {
    const notifications = await NotificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  };

  /**
   * Maneja la respuesta cuando el usuario toca una notificación
   * Navega a la pantalla correspondiente según el tipo
   */
  const handleNotificationResponse = (response) => {
    const { screen } = response.notification.request.content.data;
    
    if (screen) {
      navigation.navigate(screen);
    }
  };

  /**
   * Programa un recordatorio de vacuna de prueba
   * Muestra la notificación en 5 segundos
   */
  const handleScheduleVaccine = async () => {
    try {
      const futureDate = new Date();
      futureDate.setSeconds(futureDate.getSeconds() + 5);

      await NotificationService.scheduleVaccineReminder(
        'Antirrábica',
        futureDate
      );

      Alert.alert(
        '⏰ Recordatorio Programado',
        'Recibirás una notificación de vacuna en 5 segundos.',
        [{ text: 'OK', onPress: loadScheduledNotifications }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo programar el recordatorio: ' + error.message);
    }
  };

  /**
   * Programa un recordatorio de cita veterinaria
   */
  const handleScheduleVet = async () => {
    try {
      const futureDate = new Date();
      futureDate.setSeconds(futureDate.getSeconds() + 10);

      await NotificationService.scheduleVetAppointment(
        'Chequeo mensual',
        futureDate
      );

      Alert.alert(
        '⏰ Cita Programada',
        'Recibirás un recordatorio de cita en 10 segundos.',
        [{ text: 'OK', onPress: loadScheduledNotifications }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo programar la cita: ' + error.message);
    }
  };

  /**
   * Programa un recordatorio diario
   */
  const handleScheduleDaily = async () => {
    try {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes() + 1; // En 1 minuto

      await NotificationService.scheduleDailyReminder(
        hour,
        minute,
        '¡Es hora de pasear a tu mascota!'
      );

      Alert.alert(
        '⏰ Recordatorio Diario',
        `Programado para repetirse cada día a las ${hour}:${minute}`,
        [{ text: 'OK', onPress: loadScheduledNotifications }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo programar el recordatorio: ' + error.message);
    }
  };

  /**
   * Muestra una notificación inmediata (útil para testing)
   */
  const handleShowImmediate = async () => {
    try {
      await NotificationService.showImmediateNotification(
        '🐾 ¡Hola!',
        'Esta es una notificación de prueba de PetPal'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo mostrar la notificación: ' + error.message);
    }
  };

  /**
   * Cancela todas las notificaciones programadas
   */
  const handleCancelAll = async () => {
    Alert.alert(
      'Confirmar',
      '¿Deseas cancelar todos los recordatorios programados?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            await NotificationService.cancelAllNotifications();
            Alert.alert('✅ Cancelado', 'Todos los recordatorios han sido cancelados.');
            loadScheduledNotifications();
          },
        },
      ]
    );
  };

  // Si no hay permisos, mostrar pantalla de solicitud
  if (!hasPermissions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>🔔</Text>
          <Text style={styles.permissionText}>
            Activa las notificaciones para recibir recordatorios de cuidados de tu mascota
          </Text>
          <Button
            title="Activar Notificaciones"
            onPress={handleRequestPermissions}
            variant="primary"
          />
          <Button
            title="Volver"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Notificaciones</Text>
            <Text style={styles.subtitle}>
              Gestiona recordatorios de cuidados de tu mascota
            </Text>
          </View>

          {/* Estadísticas */}
          <Card>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {scheduledNotifications.length}
                </Text>
                <Text style={styles.statLabel}>Recordatorios Activos</Text>
              </View>
            </View>
          </Card>

          {/* Acciones rápidas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Programar Recordatorios</Text>
            
            <View style={styles.actionGrid}>
              <Button
                title="💉 Vacuna (5 seg)"
                onPress={handleScheduleVaccine}
                variant="primary"
              />
              
              <Button
                title="🏥 Cita Vet (10 seg)"
                onPress={handleScheduleVet}
                variant="secondary"
              />
              
              <Button
                title="🔄 Diario"
                onPress={handleScheduleDaily}
                variant="outline"
              />
              
              <Button
                title="⚡ Inmediata"
                onPress={handleShowImmediate}
                variant="outline"
              />
            </View>
          </View>

          {/* Lista de notificaciones programadas */}
          {scheduledNotifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Próximos Recordatorios</Text>
              {scheduledNotifications.map((notif, index) => (
                <Card key={index} style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>
                    {notif.content.title}
                  </Text>
                  <Text style={styles.notificationBody}>
                    {notif.content.body}
                  </Text>
                  {notif.trigger && (
                    <Text style={styles.notificationTrigger}>
                      {notif.trigger.type === 'date' 
                        ? `Fecha: ${new Date(notif.trigger.value).toLocaleString('es')}`
                        : notif.trigger.repeats 
                        ? 'Se repite diariamente'
                        : `En ${notif.trigger.seconds} segundos`
                      }
                    </Text>
                  )}
                </Card>
              ))}
            </View>
          )}

          {/* Acciones generales */}
          <View style={styles.section}>
            <Button
              title="🔄 Actualizar Lista"
              onPress={loadScheduledNotifications}
              variant="outline"
            />
            
            {scheduledNotifications.length > 0 && (
              <Button
                title="🗑️ Cancelar Todos"
                onPress={handleCancelAll}
                variant="outline"
              />
            )}
            
            <Button
              title="← Volver"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>

          {/* Información técnica */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Capacidad Nativa Utilizada:</Text>
            <Text style={styles.infoText}>• Sistema de notificaciones push</Text>
            <Text style={styles.infoText}>• Permisos de notificaciones</Text>
            <Text style={styles.infoText}>• Notificaciones locales programadas</Text>
            <Text style={styles.infoText}>• Notificaciones recurrentes</Text>
            <Text style={styles.infoText}>• Canales de Android</Text>
            <Text style={styles.infoText}>• Interacción con notificaciones</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
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
  statsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  actionGrid: {
    gap: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  notificationBody: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notificationTrigger: {
    fontSize: fontSize.xs,
    color: colors.lightGray,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    marginTop: spacing.xl,
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  permissionTitle: {
    fontSize: 64,
  },
  permissionText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default NotificationsScreen;
