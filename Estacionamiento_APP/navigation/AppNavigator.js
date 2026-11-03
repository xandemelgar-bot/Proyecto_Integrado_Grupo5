
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReservationsAdminScreen from "../screens/admin/ReservationsAdminScreen";
import { useAuth } from "../contexts/AuthContext";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

import AdminScreen from "../screens/admin/AdminScreen";
import UsuarioScreen from "../screens/usuario/UsuarioTemporalScreen";

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.text}>
          Cargando aplicación...
        </Text>
      </View>
    );
  }

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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
          component={AdminScreen}
        />
      ) : (
        <Stack.Screen
          name="Usuario"
          component={UsuarioScreen}
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
    backgroundColor: "#F5F7FA",
    padding: 25,
    gap: 15,
  },

  text: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
  },
});
