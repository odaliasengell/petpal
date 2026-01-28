import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión activa al iniciar
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userId = await AsyncStorage.getItem('currentUserId');
      if (userId) {
        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];
        const user = users.find(u => u.id === userId);
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar nuevo usuario
  const register = async (username, email, password) => {
    try {
      // Obtener usuarios existentes
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Verificar si el email ya existe
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        throw new Error('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (usernameExists) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // En producción, esto debería estar encriptado
        createdAt: new Date().toISOString(),
      };

      // Guardar usuario
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Iniciar sesión automáticamente
      await login(email, password);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Guardar sesión
      await AsyncStorage.setItem('currentUserId', user.id);
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUserId');
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    }
  };

  // Actualizar perfil de usuario
  const updateProfile = async (updates) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem('users', JSON.stringify(users));
        setCurrentUser(users[userIndex]);
        return { success: true };
      }
      
      throw new Error('Usuario no encontrado');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
