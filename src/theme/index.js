import { colors } from './colors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from './spacing';
import { 
  scaleWidth, 
  scaleHeight, 
  scaleFont, 
  scale,
  responsiveSpacing,
  responsiveFontSize,
  screenWidth,
  screenHeight,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
} from './responsive';

export const theme = {
  colors,
  spacing: responsiveSpacing,
  fontSize: responsiveFontSize,
  fontWeight,
  borderRadius,
  shadows,
};

export { 
  scaleWidth, 
  scaleHeight, 
  scaleFont, 
  scale,
  screenWidth,
  screenHeight,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
};

export default theme;
