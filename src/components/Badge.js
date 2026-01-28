import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';

const Badge = ({ label, color = colors.primary, size = 'medium', style }) => {
  const moodImages = {
    'felicidad': require('../assets/felicidad.png'),
    'energia': require('../assets/energia.png'),
    'calma': require('../assets/calma.png'),
    'jugueton': require('../assets/jugueton.png'),
    'apetito': require('../assets/apetito.png'),
  };

  const labelText = {
    'felicidad': 'Felicidad',
    'energia': 'Energía',
    'calma': 'Calma',
    'jugueton': 'Juguetón',
    'apetito': 'Apetito',
  };

  return (
    <View style={[
      styles.badge, 
      { backgroundColor: color + '20' },
      size === 'small' && styles.smallBadge,
      size === 'large' && styles.largeBadge,
      style
    ]}>
      {moodImages[label] && (
        <Image source={moodImages[label]} style={styles.badgeIcon} resizeMode="contain" />
      )}
      <Text style={[
        styles.text, 
        { color },
        size === 'small' && styles.smallText,
        size === 'large' && styles.largeText,
      ]}>
        {labelText[label] || label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  smallBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  largeBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  badgeIcon: {
    width: 14,
    height: 14,
  },
  smallText: {
    fontSize: fontSize.xs,
  },
  largeText: {
    fontSize: fontSize.md,
  },
});

export default Badge;
