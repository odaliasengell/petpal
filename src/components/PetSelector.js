import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { usePet } from '../contexts/PetContext';
import PetAvatar from './PetAvatar';
import { colors } from '../theme/colors';

const PetSelector = ({ onAddPet }) => {
  const { pets, activePetId, switchActivePet, deletePet } = usePet();

  const handleLongPress = (pet) => {
    if (pets.length <= 1) {
      Alert.alert('No se puede eliminar', 'Debes tener al menos una mascota');
      return;
    }

    Alert.alert(
      'Eliminar Mascota',
      `¿Estás seguro de que deseas eliminar a ${pet.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deletePet(pet.id)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {pets.map(pet => (
          <TouchableOpacity
            key={pet.id}
            style={[styles.petCard, pet.id === activePetId && styles.activePetCard]}
            onPress={() => switchActivePet(pet.id)}
            onLongPress={() => handleLongPress(pet)}
          >
            <PetAvatar 
              source={pet.photo}
              size={50}
              especies={pet.especie}
            />
            <Text style={[styles.petName, pet.id === activePetId && styles.activePetName]}>
              {pet.nombre}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={onAddPet}>
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>+</Text>
          </View>
          <Text style={styles.addText}>Agregar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  petCard: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  activePetCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  petName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activePetName: {
    color: colors.primary,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    minWidth: 80,
  },
  addIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  addText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default PetSelector;
