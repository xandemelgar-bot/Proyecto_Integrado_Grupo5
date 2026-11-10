
import React from "react";

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";

// Navegación del administrador
import AdminNavigator from "./AdminNavigator";

// Navegación del conductor
import UserNavigator from "./UserNavigator";

// Pantallas de autenticación
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const {
    usuario,
    perfil,
    loading,
    errorPerfil,
    esAdmin,
    recargarPerfil,
    cerrarSesion,
  } = useAuth();

  // CARGANDO APLICACIÓN
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.text}>
          Cargando aplicación...
        </Text>
      </View>
    );
  }

  // ERROR AL CARGAR PERFIL
  if (usuario && (!perfil || errorPerfil)) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          {errorPerfil || "No se encontró tu perfil."}
        </Text>

        <Button
          title="Reintentar"
          onPress={recargarPerfil}
        />

        <Button
          title="Cerrar sesión"
          onPress={cerrarSesion}
        />
      </View>
    );
  }

  // NAVEGACIÓN SEGÚN ROL
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {!usuario ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      ) : esAdmin ? (
        <Stack.Screen
          name="Admin"
          component={AdminNavigator}
        />
      ) : (
        <Stack.Screen
          name="Usuario"
          component={UserNavigator}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
    padding: 25,
    gap: 15,
  },

  text: {
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
  },
});
