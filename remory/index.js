// Import polyfills for React Native FIRST
import './shim';

import { registerRootComponent } from 'expo';
import App from './App';

// Register LiveKit WebRTC for React Native
// This is required for native modules to work properly
import { registerGlobals } from '@livekit/react-native';

// Register LiveKit WebRTC globals
registerGlobals();
console.log('LiveKit WebRTC registered for React Native');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
