import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';

// Importar pantallas
import DashboardScreen from '../screens/DashboardScreen';
import PetProfileScreen from '../screens/PetProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import HealthHistoryScreen from '../screens/HealthHistoryScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MoodBoardScreen from '../screens/MoodBoardScreen';
import CameraScreen from '../screens/CameraScreen';

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

// Iconos simples con texto (sin usar librerías de iconos)
const TabIcon = ({ label, focused }) => (
  <View style={styles.iconContainer}>
    <View style={[
      styles.iconDot,
      { backgroundColor: focused ? colors.primary : colors.lightGray }
    ]} />
    <Text style={[
      styles.iconLabel,
      { color: focused ? colors.primary : colors.textSecondary }
    ]}>
      {label}
    </Text>
  </View>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
              <TabIcon label="Inicio" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={PetProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Perfil" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Calendario" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Health" 
          component={HealthHistoryScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Salud" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Gallery" 
          component={GalleryScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Galería" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.xs,
  },
  iconLabel: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});

export default AppNavigator;
