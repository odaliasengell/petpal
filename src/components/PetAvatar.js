import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';
import { scaleWidth } from '../theme/responsive';

const PetAvatar = ({ source, size, style }) => {
  const avatarSize = size || scaleWidth(100);
  
  // Asegurarse que source sea una string válida
  const imageSource = typeof source === 'string' && source ? source : null;
  
  return (
    <View style={[
      styles.container,
      { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
      style
    ]}>
      {imageSource ? (
        <Image 
          source={{ uri: imageSource }} 
          style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Image source={require('../assets/perro.png')} style={[styles.icon, { width: avatarSize * 0.5, height: avatarSize * 0.5 }]} resizeMode="contain" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderWidth: 4,
    borderColor: colors.background,
    elevation: 4,
  },
  image: {
    backgroundColor: colors.paleGray,
  },
  placeholder: {
    backgroundColor: colors.primaryLight + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});

export default PetAvatar;
