# 🔐 Sistema de Autenticación - PetPal

## Descripción General

PetPal ahora cuenta con un sistema completo de autenticación de usuarios que permite:
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Datos separados por usuario (cada usuario tiene sus propias mascotas y datos)
- ✅ Persistencia de sesión (se mantiene iniciado al reabrir la app)

## 🏗️ Arquitectura

### Componentes Principales

#### 1. **AuthContext** (`src/contexts/AuthContext.js`)
Gestiona todo el estado de autenticación:
- `currentUser`: Usuario actualmente autenticado
- `isLoading`: Estado de carga de la verificación de sesión
- `register(username, email, password)`: Registrar nuevo usuario
- `login(email, password)`: Iniciar sesión
- `logout()`: Cerrar sesión
- `updateProfile(updates)`: Actualizar perfil de usuario

#### 2. **LoginScreen** (`src/screens/LoginScreen.js`)
Pantalla de inicio de sesión con:
- Validación de campos
- Validación de formato de email
- Manejo de errores
- Navegación a registro

#### 3. **RegisterScreen** (`src/screens/RegisterScreen.js`)
Pantalla de registro con:
- Validación de todos los campos
- Verificación de longitud de contraseña (mínimo 6 caracteres)
- Verificación de longitud de username (mínimo 3 caracteres)
- Confirmación de contraseña
- Verificación de emails y usernames únicos

#### 4. **PetContext Modificado** (`src/contexts/PetContext.js`)
Ahora asocia todos los datos con el usuario autenticado:
- Los datos se almacenan con claves únicas por usuario: `@PetPal:user_{userId}:{dataType}`
- Cuando cambias de usuario, se cargan automáticamente sus datos
- Cada usuario tiene sus propias mascotas, eventos, fotos, etc.

#### 5. **AppNavigator Actualizado** (`src/navigation/AppNavigator.js`)
Implementa navegación condicional:
- Si hay usuario autenticado → Muestra la app principal
- Si NO hay usuario → Muestra pantallas de Login/Registro
- Muestra pantalla de carga mientras verifica la sesión

## 📱 Flujo de Usuario

### Primera Vez (Nuevo Usuario)
1. Usuario abre la app
2. Ve la pantalla de Login
3. Toca "Crear nueva cuenta"
4. Completa el formulario de registro
5. Se crea la cuenta automáticamente y se inicia sesión
6. Ve el dashboard con una mascota por defecto

### Usuario Existente
1. Usuario abre la app
2. Ve la pantalla de Login
3. Ingresa email y contraseña
4. Inicia sesión
5. Ve sus datos (mascotas, eventos, fotos, etc.)

### Cerrar Sesión
1. Usuario va a Configuración (SettingsScreen)
2. Ve su información de usuario
3. Toca "Cerrar Sesión"
4. Confirma
5. Regresa a la pantalla de Login

## 💾 Almacenamiento de Datos

### Datos de Usuarios
```javascript
// Almacenado en AsyncStorage con clave: 'users'
[
  {
    id: "1706123456789",
    username: "usuario1",
    email: "usuario1@ejemplo.com",
    password: "contraseña", // En producción debería estar encriptada
    createdAt: "2025-01-27T12:00:00.000Z"
  }
]
```

### Sesión Activa
```javascript
// Almacenado en AsyncStorage con clave: 'currentUserId'
"1706123456789"
```

### Datos de Mascotas por Usuario
```javascript
// Almacenado con claves: '@PetPal:user_{userId}:pets'
// Ejemplo: '@PetPal:user_1706123456789:pets'
```

## 🔒 Seguridad

### Consideraciones Actuales
- ⚠️ Las contraseñas se almacenan en texto plano (solo para desarrollo/demo)
- Los datos se almacenan localmente en AsyncStorage
- No hay validación de servidor

### Para Producción (Mejoras Recomendadas)
1. **Encriptar contraseñas**: Usar bcrypt o similar
2. **Backend API**: Conectar con un servidor real
3. **Tokens JWT**: Para manejo de sesiones
4. **Validación de servidor**: Verificar emails y usernames en servidor
5. **Recuperación de contraseña**: Implementar reset de password
6. **Autenticación de 2 factores**: Para mayor seguridad

## 🎨 Pantallas de Autenticación

### LoginScreen
- **Campos**: Email, Contraseña
- **Validaciones**:
  - Campos no vacíos
  - Email con formato válido (contiene @)
- **Acciones**:
  - Iniciar Sesión
  - Ir a Registro

### RegisterScreen
- **Campos**: Username, Email, Contraseña, Confirmar Contraseña
- **Validaciones**:
  - Todos los campos requeridos
  - Username mínimo 3 caracteres
  - Email con formato válido
  - Contraseña mínimo 6 caracteres
  - Contraseñas coinciden
  - Email único
  - Username único
- **Acciones**:
  - Crear Cuenta (auto-login después)
  - Volver a Login

## 🧪 Cómo Probar

### Crear Usuario de Prueba
1. Abre la app
2. Toca "Crear nueva cuenta"
3. Ingresa:
   - Username: `testuser1`
   - Email: `test1@test.com`
   - Contraseña: `123456`
   - Confirmar: `123456`
4. Toca "Crear Cuenta"

### Probar Múltiples Usuarios
1. Crea el primer usuario (test1@test.com)
2. Agrega algunas mascotas y datos
3. Cierra sesión (Configuración → Cerrar Sesión)
4. Crea un segundo usuario (test2@test.com)
5. Agrega diferentes mascotas y datos
6. Cierra sesión e inicia con el primer usuario
7. Verifica que cada usuario ve solo sus datos

## 🚀 Próximas Mejoras

- [ ] Recordar email en login
- [ ] Mostrar/ocultar contraseña
- [ ] Recuperación de contraseña
- [ ] Editar perfil de usuario
- [ ] Foto de perfil de usuario
- [ ] Validación más robusta de emails
- [ ] Confirmación de email
- [ ] Backend con API REST
- [ ] Sincronización en la nube
- [ ] Modo offline con sync

## 🔧 Troubleshooting

### "El email ya está registrado"
- Usa un email diferente o inicia sesión con ese email

### "Email o contraseña incorrectos"
- Verifica que el email y contraseña sean correctos
- Los emails no distinguen mayúsculas/minúsculas

### No se guardan los datos al cambiar de usuario
- Esto es normal: cada usuario tiene sus propios datos separados
- Los datos del usuario anterior siguen guardados

### La app se queda en pantalla de carga
- Cierra y vuelve a abrir la app
- Si persiste, puede haber un error en AsyncStorage

## 📝 Notas Técnicas

### Provider Hierarchy
```jsx
<AuthProvider>          // Maneja autenticación
  <PetProvider>         // Maneja datos de mascotas (requiere usuario)
    <AppNavigator />    // Navegación
  </PetProvider>
</AuthProvider>
```

### Flujo de Carga de Datos
1. AuthContext verifica si hay sesión guardada
2. Si hay sesión → Carga datos del usuario
3. PetProvider espera a que haya usuario
4. PetProvider carga datos específicos del usuario
5. AppNavigator muestra la app correspondiente

---

**Desarrollado para PetPal** 🐾
*Sistema de autenticación local con AsyncStorage*
