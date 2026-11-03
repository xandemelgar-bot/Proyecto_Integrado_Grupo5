
import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useAuth } from "../../hooks/useAuth";
import COLORS from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  // Iniciar sesión con Firebase
  const handleLogin = async () => {
    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio || !contrasena) {
      Alert.alert(
        "Campos incompletos",
        "Ingresa tu correo electrónico y contraseña."
      );
      return;
    }

    try {
      setLoading(true);

      // Autenticar usuario en Firebase
      await iniciarSesion(correoLimpio, contrasena);

      // No necesitamos navigation.navigate().
      // AuthContext detecta la sesión automáticamente
      // y AppNavigator muestra la pantalla
      // correspondiente según el rol.

    } catch (error) {
      console.log("Error al iniciar sesión:", error.code);

      let mensaje = "No se pudo iniciar sesión.";

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          mensaje = "Correo o contraseña incorrectos.";
          break;

        case "auth/invalid-email":
          mensaje = "El correo electrónico no es válido.";
          break;

        case "auth/network-request-failed":
          mensaje = "Verifica tu conexión a Internet.";
          break;

        case "auth/too-many-requests":
          mensaje =
            "Demasiados intentos. Inténtalo nuevamente más tarde.";
          break;

        default:
          mensaje =
            "Ocurrió un error al iniciar sesión. Inténtalo nuevamente.";
      }

      Alert.alert("Error de inicio de sesión", mensaje);

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.icon}>🚗</Text>

        <Text style={styles.title}>
          Estacionamiento Inteligente
        </Text>

        <Text style={styles.subtitle}>
          Inicia sesión para continuar
        </Text>

        {/* Correo electrónico */}
        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
          editable={!loading}
        />

        {/* Contraseña */}
        <Text style={styles.label}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
          editable={!loading}
        />

        {/* Recuperar contraseña */}
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() =>
            navigation.navigate("ForgotPassword")
          }
          disabled={loading}
        >
          <Text style={styles.forgotText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Iniciar sesión
            </Text>
          )}
        </TouchableOpacity>

        {/* Registro */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },

  icon: {
    fontSize: 55,
    textAlign: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 15,
    color: COLORS.text,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    minHeight: 55,
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  registerText: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
  },
});
