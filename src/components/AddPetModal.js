import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { usePet } from '../contexts/PetContext';

const AddPetModal = ({ visible, onClose }) => {
  const { addPet } = usePet();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    fechaNacimiento: '',
    peso: '',
    altura: '',
    veterinario: '',
    clinica: '',
    telefono: '',
    microchip: '',
    placa: '',
    notas: '',
  });

  const handleSave = () => {
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa el nombre de tu mascota');
      return;
    }
    
    addPet({
      ...formData,
      photo: null, // Se puede agregar después desde el perfil
    });
    
    // Resetear formulario
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      fechaNacimiento: '',
      peso: '',
      altura: '',
      veterinario: '',
      clinica: '',
      telefono: '',
      microchip: '',
      placa: '',
      notas: '',
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      fechaNacimiento: '',
      peso: '',
      altura: '',
      veterinario: '',
      clinica: '',
      telefono: '',
      microchip: '',
      placa: '',
      notas: '',
    });
    onClose();
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS el picker permanece visible
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setFormData({ ...formData, fechaNacimiento: formattedDate });
    }
  };

  const renderDateField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Fecha de Nacimiento</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, !formData.fechaNacimiento && styles.placeholderText]}>
          {formData.fechaNacimiento || 'Seleccionar fecha'}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );

  const validateInput = (key, value) => {
    switch (key) {
      case 'peso':
      case 'altura':
        // Solo números y punto decimal
        return value.replace(/[^0-9.]/g, '');
      
      case 'edad':
        // Solo números enteros
        return value.replace(/[^0-9]/g, '');
      
      case 'telefono':
        // Solo números, guiones y espacios
        return value.replace(/[^0-9\s-]/g, '');
      
      case 'fechaNacimiento':
        // Solo números y barras para fecha DD/MM/AAAA
        let cleaned = value.replace(/[^0-9/]/g, '');
        if (cleaned.length <= 10) {
          return cleaned;
        }
        return formData[key];
      
      case 'microchip':
      case 'placa':
        // Alfanumérico
        return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      case 'nombre':
      case 'especie':
      case 'raza':
      case 'veterinario':
      case 'clinica':
        // Solo letras y espacios
        return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      
      default:
        return value;
    }
  };

  const renderField = (label, key, placeholder, keyboardType = 'default', multiline = false, unit = null) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={unit ? styles.inputWithUnit : null}>
        <TextInput
          style={[styles.input, multiline && styles.textArea, unit && styles.inputWithUnitField]}
          value={formData[key]}
          onChangeText={(value) => {
            const validatedValue = validateInput(key, value);
            setFormData({ ...formData, [key]: validatedValue });
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Agregar Nueva Mascota</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderField('Nombre *', 'nombre', 'Ej: Max')}
            {renderField('Especie', 'especie', 'Ej: Perro, Gato')}
            {renderField('Raza', 'raza', 'Ej: Labrador')}
            {renderField('Edad', 'edad', 'Ej: 3', 'numeric')}
            {renderDateField()}
            {renderField('Peso', 'peso', 'Ej: 15.5', 'decimal-pad', false, 'kg')}
            {renderField('Altura', 'altura', 'Ej: 50.0', 'decimal-pad', false, 'cm')}
            
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Información Veterinaria</Text>
            
            {renderField('Veterinario', 'veterinario', 'Nombre del veterinario')}
            {renderField('Clínica', 'clinica', 'Nombre de la clínica')}
            {renderField('Teléfono', 'telefono', 'Teléfono de contacto', 'phone-pad')}
            
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Identificación</Text>
            
            {renderField('Microchip', 'microchip', 'Número de microchip', 'default')}
            {renderField('Placa', 'placa', 'Número de placa', 'default')}
            {renderField('Notas', 'notas', 'Información adicional...', 'default', true)}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scrollView: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  fieldContainer: {
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  dateButton: {
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: '#999',
  },
  calendarIcon: {
    fontSize: 20,
  },
  inputWithUnit: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithUnitField: {
    flex: 1,
    paddingRight: 50,
  },
  unitText: {
    position: 'absolute',
    right: 14,
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  separator: {
    height: 2,
    backgroundColor: '#F0F0F0',
    marginVertical: 24,
    marginHorizontal: -8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default AddPetModal;
