import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ReactotronConfig.js
 * 
 * Configuración de Reactotron para debugging y monitoreo
 * Permite ver AsyncStorage, logs, estado de la app en tiempo real
 */

const reactotron = Reactotron
  .setAsyncStorageHandler(AsyncStorage) // Conecta AsyncStorage
  .configure({
    name: 'PetPal', // Nombre que aparecerá en Reactotron Desktop
    host: '192.168.100.64', // IP de tu PC para conectar desde dispositivo físico
  })
  .useReactNative({
    asyncStorage: true, // Habilita el tracking de AsyncStorage
    networking: {
      ignoreUrls: /symbolicate/, // Ignora requests innecesarias
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: false,
  })
  .connect(); // Conecta con la app de escritorio

// Console.log custom para Reactotron
const yeOldeConsoleLog = console.log;
console.log = (...args) => {
  yeOldeConsoleLog(...args);
  Reactotron.display({
    name: 'CONSOLE.LOG',
    preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
    value: args,
    important: true,
  });
};

// Exportar para uso global
export default reactotron;
