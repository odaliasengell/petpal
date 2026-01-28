// DESACTIVADO: expo-notifications no funciona en Expo Go SDK 53+
// Para usar notificaciones, necesitas un development build
// import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

/**
 * NotificationService - Servicio de Notificaciones (DESACTIVADO)
 * 
 * NOTA: Las notificaciones están desactivadas porque expo-notifications
 * no es compatible con Expo Go en SDK 53+.
 * Para usar notificaciones, necesitas crear un development build.
 * 
 * Este servicio ahora devuelve funciones mock para mantener compatibilidad.
 */

// DESACTIVADO: No funciona en Expo Go SDK 53+
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

/**
 * NotificationService - Clase servicio de notificaciones (DESACTIVADO)
 */
class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Funciones mock para mantener compatibilidad
  async requestPermissions() {
    console.log('⚠️ Notificaciones desactivadas en Expo Go SDK 53+');
    return true; // Simular que se concedieron permisos
  }

  async setAndroidNotificationChannel() {
    console.log('⚠️ Notificaciones desactivadas');
    return true;
  }

  async scheduleNotification({ title, body, data, trigger }) {
    console.log('⚠️ Notificación simulada:', { title, body });
    return 'mock-notification-id';
  }

  async scheduleVaccineReminder(vaccineName, date) {
    console.log('⚠️ Recordatorio de vacuna simulado:', vaccineName);
    return 'mock-vaccine-reminder';
  }

  async scheduleVetAppointment(appointmentInfo, date) {
    console.log('⚠️ Cita veterinaria simulada:', appointmentInfo);
    return 'mock-vet-appointment';
  }

  async scheduleDailyReminder(petName, hour = 9, minute = 0) {
    console.log('⚠️ Recordatorio diario simulado para:', petName);
    return 'mock-daily-reminder';
  }

  async showImmediateNotification(title, body) {
    console.log('⚠️ Notificación inmediata simulada:', title);
    Alert.alert(title, body); // Usar Alert en su lugar
    return 'mock-immediate';
  }

  async getAllScheduledNotifications() {
    console.log('⚠️ Notificaciones desactivadas');
    return [];
  }

  async getScheduledNotifications() {
    return [];
  }

  async cancelNotification(notificationId) {
    console.log('⚠️ Cancelar notificación simulada:', notificationId);
    return true;
  }

  async cancelAllNotifications() {
    console.log('⚠️ Todas las notificaciones canceladas (simulado)');
    return true;
  }

  setupListeners(onNotificationReceived, onNotificationResponse) {
    console.log('⚠️ Listeners de notificaciones desactivados');
    // No hacer nada
  }

  removeListeners() {
    console.log('⚠️ Remover listeners (desactivado)');
    // No hacer nada
  }
}

// Exportar instancia única (Singleton Pattern)
export default new NotificationService();

