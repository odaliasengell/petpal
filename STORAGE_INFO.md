# 💾 Sistema de Almacenamiento Local - PetPal

## 📋 Descripción

Tu aplicación PetPal ahora guarda **TODOS los datos de manera local y automática** usando AsyncStorage. Esto significa que:

- ✅ Todos los datos persisten entre sesiones
- ✅ No necesitas conexión a internet
- ✅ Los datos se guardan automáticamente al hacer cambios
- ✅ La información se mantiene incluso si cierras la app

## 🎯 Datos que se guardan automáticamente

1. **Mascotas** - Toda la información de tus mascotas
2. **Eventos del Calendario** - Citas veterinarias, recordatorios, etc.
3. **Estado de Ánimo** - Niveles de felicidad, energía, calma, etc.
4. **Historial de Ánimo** - Registro de cambios en el estado de ánimo
5. **Historial de Salud** - Vacunas, consultas médicas, medicamentos
6. **Fotos de Galería** - Todas las fotos capturadas
7. **Álbumes** - Organización de fotos en álbumes
8. **Mascota Activa** - La mascota que tienes seleccionada

## 🚀 Cómo Funciona

### Guardado Automático

Cada vez que realizas una acción (agregar una mascota, actualizar el estado de ánimo, agregar una foto, etc.), los datos se guardan **automáticamente** en el almacenamiento local.

```javascript
// Ejemplo: Los datos se guardan automáticamente
const { addPet } = usePet();

// Esto guardará automáticamente el nuevo pet
addPet({
  nombre: 'Max',
  especie: 'Gato',
  raza: 'Siamés',
  // ... más datos
});
```

### Carga Automática

Al iniciar la aplicación, todos los datos se cargan automáticamente desde el almacenamiento local.

## 🛠️ Utilidades de Almacenamiento

Se ha creado un `StorageService` con funciones útiles:

### Limpiar todos los datos
```javascript
import StorageService from './src/services/StorageService';

await StorageService.clearAllData();
// ⚠️ Esto eliminará TODOS los datos
```

### Exportar datos (backup)
```javascript
const data = await StorageService.exportData();
// Devuelve un objeto JSON con todos los datos
```

### Importar datos (restaurar backup)
```javascript
await StorageService.importData(backupData);
// Restaura los datos desde un backup
```

### Ver tamaño del almacenamiento
```javascript
const sizeInKB = await StorageService.getStorageSize();
console.log(`Tamaño: ${sizeInKB} KB`);
```

### Debug (ver datos en consola)
```javascript
await StorageService.debugStorage();
// Muestra todos los datos en la consola
```

## 📱 Pantalla de Configuración

Se ha creado una pantalla de configuración (`SettingsScreen.js`) que puedes agregar a tu navegación para:

- Ver el tamaño del almacenamiento
- Exportar datos
- Ver datos en consola (debug)
- Eliminar todos los datos

### Cómo agregar la pantalla de configuración

En tu `AppNavigator.js`:

```javascript
import SettingsScreen from '../screens/SettingsScreen';

// Agrega esta pantalla a tu navegador
<Tab.Screen 
  name="Settings" 
  component={SettingsScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="settings" size={size} color={color} />
    ),
  }}
/>
```

## 🔧 Estructura del Almacenamiento

Los datos se guardan con las siguientes claves:

```javascript
{
  '@PetPal:pets': [...],              // Array de mascotas
  '@PetPal:activePetId': '1',         // ID de mascota activa
  '@PetPal:calendarEvents': {...},    // Eventos por mascota
  '@PetPal:moodData': {...},          // Estado de ánimo por mascota
  '@PetPal:moodHistory': {...},       // Historial de ánimo por mascota
  '@PetPal:healthHistory': {...},     // Historial médico por mascota
  '@PetPal:galleryPhotos': {...},     // Fotos por mascota
  '@PetPal:albums': {...}             // Álbumes por mascota
}
```

## ⚡ Ejecución

Para ejecutar tu aplicación con el nuevo sistema de almacenamiento:

```bash
# Iniciar Expo
npm start

# O específicamente para Android
npm run android

# O para iOS
npm run ios
```

## 🐛 Debug y Desarrollo

### Ver los datos guardados

Durante el desarrollo, puedes usar las herramientas de React Native Debugger o simplemente:

```javascript
import StorageService from './src/services/StorageService';

// En cualquier componente
useEffect(() => {
  StorageService.debugStorage();
}, []);
```

### Resetear los datos durante desarrollo

Si necesitas empezar con datos frescos:

```javascript
// Opción 1: Usar el servicio
await StorageService.clearAllData();

// Opción 2: Desinstalar y reinstalar la app
// Los datos se eliminarán automáticamente
```

## 📊 Límites de Almacenamiento

AsyncStorage tiene los siguientes límites aproximados:

- **iOS**: ~10 MB (aunque puede variar)
- **Android**: Sin límite específico, pero se recomienda menos de 6 MB

Tu app actualmente debería usar muy poco espacio (< 1 MB para uso normal).

## ⚠️ Consideraciones Importantes

1. **Los datos NO se sincronizan entre dispositivos** - Cada dispositivo tiene sus propios datos
2. **Si desinstalas la app, los datos se pierden** - Considera implementar un sistema de backup en la nube si es necesario
3. **Los datos son locales** - No requieren internet pero tampoco están respaldados automáticamente

## 🎉 ¡Listo!

Tu aplicación ahora guarda automáticamente toda la información de forma local. No necesitas hacer nada especial - ¡todo funciona automáticamente!

### Prueba rápida:

1. Agrega una mascota nueva
2. Agrega algunos eventos al calendario
3. Toma algunas fotos
4. Cierra completamente la app
5. Vuelve a abrir la app
6. ✅ ¡Todos tus datos siguen ahí!

---

**Desarrollado con ❤️ para PetPal**
