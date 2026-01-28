import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';

// Importar pantallas
import DashboardScreen from '../screens/DashboardScreen';
import PetProfileScreen from '../screens/PetProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import HealthHistoryScreen from '../screens/HealthHistoryScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MoodBoardScreen from '../screens/MoodBoardScreen';
import CameraScreen from '../screens/CameraScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Dashboard (incluye MoodBoard)
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="MoodBoard" component={MoodBoardScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
};

// Iconos con imágenes
const TabIcon = ({ image, focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={image} 
      style={[
        styles.iconImage,
        { opacity: focused ? 1 : 0.5 }
      ]}
      resizeMode="contain"
    />
  </View>
);

// Stack Navigator para autenticación (Login/Register)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Stack Navigator principal de la app (Dashboard + tabs)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/casa.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="PetProfile" 
        component={PetProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/perro.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/calendario.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Health" 
        component={HealthHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/salud.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/galeria.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon image={require('../assets/perfil usuario.png')} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser, isLoading } = useAuth();

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 0,
    borderTopColor: colors.border,
    height: 90,
    paddingBottom: 0,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});

export default AppNavigator;
