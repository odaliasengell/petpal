import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';

const Badge = ({ label, color = colors.primary, size = 'medium', style }) => {
  return (
    <View style={[
      styles.badge, 
      { backgroundColor: color + '20' },
      size === 'small' && styles.smallBadge,
      size === 'large' && styles.largeBadge,
      style
    ]}>
      <Text style={[
        styles.text, 
        { color },
        size === 'small' && styles.smallText,
        size === 'large' && styles.largeText,
      ]}>
        {label}
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
  smallText: {
    fontSize: fontSize.xs,
  },
  largeText: {
    fontSize: fontSize.md,
  },
});

export default Badge;
