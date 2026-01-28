/**
 * colors.js - Sistema de Colores Centralizado de PetPal
 * 
 * PROPÓSITO:
 * Este archivo define la paleta de colores completa de la aplicación.
 * Centralizar los colores garantiza consistencia visual y facilita el mantenimiento.
 * 
 * VENTAJAS DE ESTE ENFOQUE:
 * 1. DRY (Don't Repeat Yourself): No repetir códigos hexadecimales en toda la app
 * 2. Single Source of Truth: Un solo lugar para cambiar colores
 * 3. Mantenibilidad: Cambiar color de marca = 1 línea modificada vs 100+
 * 4. Consistencia: Todos los componentes usan los mismos colores
 * 5. Escalabilidad: Fácil agregar dark mode o temas personalizables
 * 6. Legibilidad: colors.primary es más claro que #4ECDC4
 * 
 * CÓMO USAR:
 * import { colors } from '../theme/colors';
 * <View style={{ backgroundColor: colors.primary }} />
 * 
 * CONCEPTOS TÉCNICOS:
 * - export const: Exporta una constante (named export)
 * - Objeto literal: Estructura clave-valor de JavaScript
 * - Formato hexadecimal: #RRGGBB (Red, Green, Blue)
 * - Formato RGBA: rgba(R, G, B, Alpha) para transparencias
 */

// Paleta de colores profesional y armónica para PetPal
// Colores principales: Verde menta vibrante, coral y tonos pastel modernos

export const colors = {
  // ========================================
  // COLORES PRIMARIOS (Identidad de marca)
  // ========================================
  // Verde agua vibrante: Transmite calma, naturaleza y salud
  // Psicología del color: Perfecto para aplicación de mascotas
  primary: '#4ECDC4', // Verde agua vibrante - Color principal
  primaryLight: '#89E1D9', // Verde agua claro - Para fondos y hover
  primaryDark: '#2EAFA6', // Verde agua oscuro - Para bordes y énfasis
  
  // ========================================
  // COLORES SECUNDARIOS (Complementarios)
  // ========================================
  // Tonos coral cálidos: Transmiten calidez, afecto y amor
  // Uso: Fondos de tarjetas, elementos decorativos
  secondary: '#FFE5D9', // Coral muy claro - Fondos suaves
  secondaryLight: '#FFF5F0', // Rosa pálido - Fondos alternos
  secondaryDark: '#FFD4C0', // Coral suave - Bordes y divisores
  
  // ========================================
  // GRISES MODERNOS (Jerarquía visual)
  // ========================================
  // Grises azulados en lugar de negro puro para mejor legibilidad
  // Uso: Textos, fondos, creación de jerarquía sin saturación
  dark: '#1A202C', // Gris azulado oscuro - Texto principal, elementos importantes
  darkGray: '#2D3748', // Gris azulado medio - Subtítulos
  mediumGray: '#4A5568', // Gris neutral - Texto secundario
  lightGray: '#A0AEC0', // Gris claro - Texto deshabilitado, placeholders
  paleGray: '#EDF2F7', // Gris muy claro - Fondos sutiles, separadores
  
  // ========================================
  // COLORES DE FONDO
  // ========================================
  background: '#FFFFFF', // Blanco puro - Fondo principal de la app
  backgroundSecondary: '#F7FAFC', // Blanco azulado - Fondo alternativo, secciones
  
  // ========================================
  // COLORES DE CATEGORÍAS (Eventos/Actividades)
  // ========================================
  // Cada tipo de evento tiene su color único para identificación visual
  // Uso: Badges, calendario, historial de salud
  vaccine: '#667EEA', // Púrpura vibrante - Vacunas
  bath: '#9F7AEA', // Morado - Baños/higiene
  walk: '#48BB78', // Verde brillante - Paseos/ejercicio
  vet: '#ED64A6', // Rosa fucsia - Citas veterinarias
  treatment: '#F6AD55', // Naranja dorado - Tratamientos/medicación
  
  // ========================================
  // COLORES DE ESTADO EMOCIONAL (MoodBoard)
  // ========================================
  // Representan el estado de ánimo de la mascota
  // Uso: MoodBoard, métricas emocionales
  happy: '#FBD38D', // Amarillo dorado - Feliz, contento
  calm: '#81E6D9', // Turquesa suave - Calmado, relajado
  playful: '#FC8181', // Coral brillante - Juguetón, activo
  tired: '#90CDF4', // Azul cielo - Cansado, necesita descanso
  anxious: '#F6AD55', // Naranja cálido - Ansioso, nervioso
  
  // ========================================
  // COLORES DE UTILIDAD (Feedback visual)
  // ========================================
  // Colores estándar para mensajes del sistema
  // Uso: Alertas, notificaciones, validaciones
  success: '#48BB78', // Verde - Operación exitosa
  warning: '#ED8936', // Naranja - Advertencia, precaución
  error: '#F56565', // Rojo - Error, acción fallida
  info: '#4299E1', // Azul - Información general
  
  // ========================================
  // COLORES DE TEXTO (Legibilidad)
  // ========================================
  // Jerarquía de textos con contraste adecuado (WCAG AA)
  textPrimary: '#1A202C', // Texto principal - Alto contraste
  textSecondary: '#4A5568', // Texto secundario - Menos énfasis
  textLight: '#A0AEC0', // Texto claro - Deshabilitado, menos importante
  textWhite: '#FFFFFF', // Texto blanco - Sobre fondos oscuros
  
  // ========================================
  // BORDES Y SOMBRAS (Separación visual)
  // ========================================
  border: '#E2E8F0', // Gris claro - Bordes de tarjetas, divisores
  shadow: 'rgba(26, 32, 44, 0.1)', // Sombra con 10% opacidad - Profundidad sutil
  
  // NOTA SOBRE RGBA:
  // rgba(R, G, B, Alpha) permite transparencia
  // Alpha: 0 = completamente transparente, 1 = completamente opaco
  // Ejemplo: rgba(26, 32, 44, 0.1) = gris oscuro con 10% opacidad
};
