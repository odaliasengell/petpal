import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';
import { scale } from '../theme/responsive';

const Card = ({ children, style, elevated = true }) => {
  const cardStyle = [
    styles.card,
    elevated ? styles.elevated : null,
    style
  ];
  
  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: scale(12),
    marginBottom: scale(12),
  },
  elevated: {
    elevation: 4,
  },
});

export default Card;
