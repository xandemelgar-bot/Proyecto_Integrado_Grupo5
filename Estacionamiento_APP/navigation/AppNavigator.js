
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import UsuarioScreen from '../screens/usuario/UsuarioScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563EB',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ title: 'Crear cuenta' }}
        />

        <Stack.Screen
          name="Administrador"
          component={AdminScreen}
          options={{ title: 'Panel de administrador' }}
        />

        <Stack.Screen
          name="Usuario"
          component={UsuarioScreen}
          options={{ title: 'Estacionamiento Inteligente' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
