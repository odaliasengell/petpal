import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { PetProvider } from './src/contexts/PetContext';

// Reactotron - Solo en desarrollo
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

export default function App() {
  return (
    <PetProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </PetProvider>
  );
}
