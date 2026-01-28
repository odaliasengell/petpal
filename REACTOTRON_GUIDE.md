# 🔧 Guía de Reactotron para PetPal

## 📥 1. Descargar Reactotron Desktop

Descarga la aplicación de escritorio desde:
👉 **https://github.com/infinitered/reactotron/releases**

**Para Windows:**
- Descarga `Reactotron.Setup.X.X.X.exe`
- Instálalo como cualquier programa de Windows

**Versión recomendada:** v3.0.0 o superior

---

## 🚀 2. Conectar Reactotron con tu App

### Paso 1: Abrir Reactotron Desktop
- Ejecuta la aplicación Reactotron en tu PC
- Déjala abierta en segundo plano

### Paso 2: Iniciar tu App
```bash
npm start
```

### Paso 3: Abrir en Expo Go
- Escanea el QR con Expo Go
- Tu app debería conectarse automáticamente

### Paso 4: Ver la Conexión
En Reactotron Desktop deberías ver:
```
✅ CONNECTION: PetPal connected
```

---

## 🔍 3. Ver AsyncStorage (Tu Objetivo Principal)

### En Reactotron Desktop:

1. **Pestaña "Timeline"**: Verás todos los eventos en tiempo real
2. **Pestaña "State"**: Si usas Redux (no aplicable aún)
3. **Pestaña "AsyncStorage"**: 🎯 **AQUÍ VERÁS TUS DATOS**

### En AsyncStorage verás:

| Clave | Valor |
|-------|-------|
| `@PetPal:pets` | Array de tus mascotas |
| `@PetPal:activePetId` | ID de la mascota activa |
| `@PetPal:calendarEvents` | Eventos del calendario |
| `@PetPal:moodData` | Estado de ánimo actual |
| `@PetPal:moodHistory` | Historial de estados |
| `@PetPal:healthHistory` | Registros médicos |
| `@PetPal:galleryPhotos` | Fotos guardadas |
| `@PetPal:albums` | Álbumes creados |

### Funciones útiles:

- **Ver valores**: Haz clic en cualquier clave para ver su contenido JSON
- **Editar**: Puedes modificar valores en tiempo real
- **Eliminar**: Borra claves específicas
- **Limpiar todo**: Botón "Clear" para borrar AsyncStorage completo

---

## 🎛️ 4. Otras Funcionalidades de Reactotron

### Logs en Tiempo Real
Todos tus `console.log()` aparecerán en Reactotron con mejor formato:
```javascript
console.log('✅ Mascota guardada:', pet);
// Aparecerá en Reactotron con formato JSON expandible
```

### Display Custom
Puedes enviar información custom:
```javascript
import Reactotron from 'reactotron-react-native';

Reactotron.display({
  name: 'Usuario Agregó Mascota',
  preview: 'Max - Perro',
  value: { nombre: 'Max', especie: 'Perro' },
  important: true
});
```

### Networking Monitor
Si haces peticiones HTTP, Reactotron las mostrará:
- URL
- Método (GET, POST, etc.)
- Request body
- Response

---

## ⚠️ 5. Solución de Problemas

### ❌ "No se conecta"

**Si usas un dispositivo físico:**
1. Abre [ReactotronConfig.js](ReactotronConfig.js)
2. Cambia:
```javascript
.configure({
  name: 'PetPal',
  host: 'localhost', // ⬅️ Cambia esto por la IP de tu PC
})
```
3. Para obtener tu IP:
```bash
# Windows
ipconfig
# Busca "Dirección IPv4" (ej: 192.168.1.5)
```
4. Usa esa IP:
```javascript
host: '192.168.1.5'
```

### ❌ "AsyncStorage está vacío"

1. Asegúrate de haber agregado datos en la app primero
2. Recarga la app (R en el terminal de Expo)
3. Ve a Configuración → "Ver datos almacenados" para confirmar

### ❌ Error al iniciar

Si ves errores en la consola:
```bash
# Limpia cache
npm start --reset-cache
```

---

## 📊 6. Ejemplo de Uso

1. **Abre Reactotron Desktop**
2. **Inicia tu app**: `npm start`
3. **Agrega una mascota** en tu app PetPal
4. **Ve a Reactotron → AsyncStorage**
5. **Busca** `@PetPal:pets`
6. **Verás** el JSON con tu mascota:

```json
[
  {
    "id": "pet_1737315600000",
    "nombre": "Max",
    "especie": "Perro",
    "raza": "Labrador",
    "edad": 3,
    "peso": 25
  }
]
```

7. **Puedes editarlo en vivo** y la app se actualizará

---

## 🎯 7. Comandos Útiles

### Limpiar AsyncStorage desde Reactotron
En la pestaña AsyncStorage:
- Click en "Clear" → Borra todo
- Click en una clave → "Delete" → Borra solo esa clave

### Ver logs específicos
En tu código:
```javascript
console.log('🐾 Mascota:', pet);        // Verde en Reactotron
console.warn('⚠️ Advertencia');         // Amarillo
console.error('❌ Error');              // Rojo
```

---

## 🔗 Recursos Adicionales

- **Documentación oficial**: https://docs.infinite.red/reactotron/
- **GitHub**: https://github.com/infinitered/reactotron
- **Tutorial en video**: https://www.youtube.com/watch?v=UiPo9A9k7xc

---

**¡Listo!** Ahora puedes ver todos tus datos de AsyncStorage en tiempo real mientras desarrollas 🎉
