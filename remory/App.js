import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import components
import SignupPage from './components/SignupPage.js';
import CaretakerInfoPage from './components/CaretakerInfoPage.js';
import LoginPage from './components/LoginPage.js';
import PatientDashboard from './components/PatientDashboard.js';
import CaretakerDashboard from './components/CaretakerDashboard.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#5A7D9A',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginPage}
            options={{ title: 'Welcome Back' }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupPage}
            options={{ title: 'Create Your Account' }}
          />
          <Stack.Screen 
            name="CaretakerInfo" 
            component={CaretakerInfoPage}
            options={{ title: 'Caretaker Information' }}
          />
          <Stack.Screen 
            name="PatientDashboard" 
            component={PatientDashboard}
            options={{ title: 'My Dashboard', headerShown: false }}
          />
          <Stack.Screen 
            name="CaretakerDashboard" 
            component={CaretakerDashboard}
            options={{ title: 'Caretaker Dashboard', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

