import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensiones base de diseño (iPhone 11 / Pixel 4)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Escalar ancho
export const scaleWidth = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

// Escalar alto
export const scaleHeight = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

// Escalar fuente
export const scaleFont = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Escalar tamaño moderado (para padding, margin, etc.)
export const scale = (size, factor = 0.5) => {
  return size + (scaleWidth(size) - size) * factor;
};

// Breakpoints
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
export const isLargeDevice = SCREEN_WIDTH >= 768;

// Dimensiones de pantalla
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Spacing responsive
export const responsiveSpacing = {
  xs: scale(4),
  sm: scale(6),
  md: scale(12),
  lg: scale(18),
  xl: scale(24),
  xxl: scale(36),
};

// Tamaños de fuente responsive
export const responsiveFontSize = {
  xs: scaleFont(11),
  sm: scaleFont(13),
  md: scaleFont(15),
  lg: scaleFont(17),
  xl: scaleFont(20),
  xxl: scaleFont(26),
  xxxl: scaleFont(32),
};
