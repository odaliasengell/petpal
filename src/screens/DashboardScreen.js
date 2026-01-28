import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fontWeight, borderRadius } from '../theme/spacing';
import { responsiveSpacing, responsiveFontSize, scaleWidth } from '../theme/responsive';
import { PetAvatar, Card, InfoCard, SectionHeader, Badge, PetSelector, AddPetModal } from '../components';
import { useNavigation } from '@react-navigation/native';
import { usePet } from '../contexts/PetContext';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { petPhoto, petInfo, moodData } = usePet();
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  // Extraer valores del estado emocional
  const { happiness = 0, energy = 0, calmness = 0, playfulness = 0, appetite = 0 } = moodData;
  
  // Calcular estado general
  const getMoodDescription = () => {
    const values = [happiness, energy, calmness, playfulness, appetite].filter(v => v > 0);
    if (values.length === 0) return 'Sin datos';
    
    const descriptors = [];
    if (happiness >= 70) descriptors.push('Feliz');
    else if (happiness > 0 && happiness < 40) descriptors.push('Triste');
    
    if (energy >= 70) descriptors.push('Activo');
    else if (energy > 0 && energy < 40) descriptors.push('Cansado');
    
    if (calmness >= 70) descriptors.push('Tranquilo');
    else if (calmness > 0 && calmness < 40) descriptors.push('Inquieto');
    
    return descriptors.length > 0 ? descriptors.join(' y ') : 'Estado Normal';
  };

  // Filtrar solo las métricas que tienen valor
  const activeMoods = [
    { value: happiness, color: colors.happy, label: '😊 Felicidad', key: 'happiness' },
    { value: energy, color: colors.playful, label: '⚡ Energía', key: 'energy' },
    { value: calmness, color: colors.calm, label: '🧘 Calma', key: 'calmness' },
    { value: playfulness, color: colors.primary, label: '🎾 Juguetón', key: 'playfulness' },
    { value: appetite, color: colors.walk, label: '🍖 Apetito', key: 'appetite' },
  ].filter(mood => mood.value > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.userName}>Bienvenido a PetPal</Text>
          </View>
        </View>

        {/* Pet Selector */}
        <PetSelector onAddPet={() => setShowAddPetModal(true)} />

        {/* Pet Avatar Section */}
        <View style={styles.avatarSection}>
          <PetAvatar source={petPhoto} />
          <Text style={styles.petName}>{petInfo.nombre}</Text>
          <Badge label={petInfo.especie} color={colors.primary} />
        </View>

        {/* Estado Emocional Card - Innovador */}
        <View style={styles.section}>
          <SectionHeader title="Estado Emocional" />
          <Card style={styles.moodCard}>
            <View style={styles.moodHeader}>
              <Text style={styles.moodTitle}>Estado Actual</Text>
              <Text style={styles.moodValue}>{getMoodDescription()}</Text>
            </View>
            
            {activeMoods.length > 0 ? (
              <>
                {/* Patrón visual de colores para estado emocional */}
                <View style={styles.moodPatternContainer}>
                  <View style={styles.moodPattern}>
                    {activeMoods.map((mood) => (
                      <View 
                        key={mood.key}
                        style={[styles.moodBar, { flex: mood.value, backgroundColor: mood.color }]} 
                      />
                    ))}
                  </View>
                  
                  {/* Leyenda de colores */}
                  <View style={styles.moodLegend}>
                    {activeMoods.map((mood) => (
                      <View key={mood.key} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: mood.color }]} />
                        <Text style={styles.legendText}>{mood.label} ({mood.value}%)</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyMoodState}>
                <Text style={styles.emptyMoodText}>No hay datos de estado emocional</Text>
                <Text style={styles.emptyMoodSubtext}>Ve a "Estado Emocional" para configurar</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.moodButton}
              onPress={() => navigation.navigate('MoodBoard')}
            >
              <Text style={styles.moodButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Estado General */}
        <View style={styles.section}>
          <SectionHeader title="Estado General" />
          <InfoCard 
            title="Última Vacuna"
            value="Hace 2 meses"
            icon="💉"
            color={colors.vaccine}
          />
          <InfoCard 
            title="Próxima Cita"
            value="En 5 días"
            icon="📅"
            color={colors.vet}
          />
          <InfoCard 
            title="Peso Actual"
            value="8.5 kg"
            icon="⚖️"
            color={colors.primary}
          />
        </View>

        {/* Accesos Rápidos */}
        <View style={styles.section}>
          <SectionHeader title="Accesos Rápidos" />
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={[styles.quickAccessCard, { backgroundColor: colors.vaccine + '20' }]}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Text style={styles.quickAccessIcon}>📅</Text>
              <Text style={styles.quickAccessText}>Calendario</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessCard, { backgroundColor: colors.vet + '20' }]}
              onPress={() => navigation.navigate('Health')}
            >
              <Text style={styles.quickAccessIcon}>🏥</Text>
              <Text style={styles.quickAccessText}>Salud</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessCard, { backgroundColor: colors.walk + '20' }]}
              onPress={() => navigation.navigate('Gallery')}
            >
              <Text style={styles.quickAccessIcon}>📸</Text>
              <Text style={styles.quickAccessText}>Galería</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessCard, { backgroundColor: colors.primary + '20' }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.quickAccessIcon}>🐾</Text>
              <Text style={styles.quickAccessText}>Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: responsiveSpacing.xl }} />
      </ScrollView>
      
      {/* Modal para agregar nueva mascota */}
      <AddPetModal 
        visible={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.lg,
    paddingTop: responsiveSpacing.md,
    paddingBottom: responsiveSpacing.xl,
  },
  greeting: {
    fontSize: responsiveFontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.regular,
  },
  userName: {
    fontSize: responsiveFontSize.xxl,
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
    marginTop: responsiveSpacing.xs,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: responsiveSpacing.xl,
  },
  petName: {
    fontSize: responsiveFontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: responsiveSpacing.md,
    marginBottom: responsiveSpacing.sm,
  },
  section: {
    paddingHorizontal: responsiveSpacing.lg,
    marginBottom: responsiveSpacing.lg,
  },
  moodCard: {
    backgroundColor: colors.background,
  },
  moodHeader: {
    marginBottom: responsiveSpacing.lg,
  },
  moodTitle: {
    fontSize: responsiveFontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginBottom: responsiveSpacing.xs,
  },
  moodValue: {
    fontSize: responsiveFontSize.xl,
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
  },
  moodPatternContainer: {
    marginBottom: responsiveSpacing.md,
  },
  moodPattern: {
    flexDirection: 'row',
    height: scaleWidth(50),
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: responsiveSpacing.md,
  },
  moodBar: {
    marginHorizontal: 2,
    borderRadius: borderRadius.sm,
  },
  moodLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: responsiveSpacing.md,
    paddingVertical: responsiveSpacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.xs,
    minWidth: '30%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: responsiveFontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  emptyMoodState: {
    alignItems: 'center',
    paddingVertical: responsiveSpacing.xl,
  },
  emptyMoodText: {
    fontSize: responsiveFontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    marginBottom: responsiveSpacing.xs,
  },
  emptyMoodSubtext: {
    fontSize: responsiveFontSize.sm,
    color: colors.textSecondary,
  },
  moodButton: {
    backgroundColor: colors.primary,
    paddingVertical: responsiveSpacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  moodButtonText: {
    color: colors.textWhite,
    fontSize: responsiveFontSize.md,
    fontWeight: fontWeight.semibold,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveSpacing.md,
  },
  quickAccessCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    padding: responsiveSpacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveSpacing.md,
    elevation: 2,
  },
  quickAccessIcon: {
    fontSize: scaleWidth(32),
    marginBottom: responsiveSpacing.sm,
  },
  quickAccessText: {
    fontSize: responsiveFontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});

export default DashboardScreen;
