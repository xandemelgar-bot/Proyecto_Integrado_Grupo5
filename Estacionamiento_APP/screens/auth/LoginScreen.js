
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import React, { useState, useEffect } from "react";
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
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import COLORS from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const insets = useSafeAreaInsets();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campoActivo, setCampoActivo] = useState(null);

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

      await iniciarSesion(correoLimpio, contrasena);

      // AuthContext detecta la sesión automáticamente.

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
          mensaje = "Demasiados intentos. Inténtalo más tarde.";
          break;

        default:
          mensaje = "Ocurrió un error. Inténtalo nuevamente.";
      }

      Alert.alert("Error de inicio de sesión", mensaje);

    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ENCABEZADO */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="car-multiple"
                size={42}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.headerTitle}>
              Estacionamiento
            </Text>

            <Text style={styles.headerTitleBold}>
              Inteligente
            </Text>

            <Text style={styles.headerSubtitle}>
              Gestiona tu estacionamiento de forma fácil y segura
            </Text>
          </View>

          {/* TARJETA */}
          <View style={styles.card}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>
                ¡Bienvenido!
              </Text>

              <Text style={styles.welcomeSubtitle}>
                Ingresa tus datos para continuar
              </Text>
            </View>

            {/* CORREO */}
            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <View
              style={[
                styles.inputContainer,
                campoActivo === "correo" && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={21}
                color={
                  campoActivo === "correo"
                    ? COLORS.primary
                    : COLORS.textSecondary
                }
              />

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
                onFocus={() => setCampoActivo("correo")}
                onBlur={() => setCampoActivo(null)}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            {/* CONTRASEÑA */}
            <Text style={styles.label}>
              Contraseña
            </Text>

            <View
              style={[
                styles.inputContainer,
                campoActivo === "contrasena" && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color={
                  campoActivo === "contrasena"
                    ? COLORS.primary
                    : COLORS.textSecondary
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!mostrarContrasena}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                value={contrasena}
                onChangeText={setContrasena}
                onFocus={() => setCampoActivo("contrasena")}
                onBlur={() => setCampoActivo(null)}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                onPress={() =>
                  setMostrarContrasena(!mostrarContrasena)
                }
                disabled={loading}
                accessibilityLabel={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <Ionicons
                  name={
                    mostrarContrasena
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* RECUPERAR CONTRASEÑA */}
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


            {/* BOTÓN INICIAR SESIÓN */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>
                    Iniciar sesión
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* REGISTRO */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerQuestion}>
                ¿No tienes una cuenta?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
                style={styles.registerButton}
              >
                <Text style={styles.registerLink}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* PIE DE PÁGINA */}
          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={COLORS.textSecondary}
            />

            <Text style={styles.footerText}>
              Acceso seguro a tu estacionamiento
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({


  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 35,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 30,
    paddingBottom: 85,
    paddingHorizontal: 25,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -45,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderRadius: 24,

    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  welcomeContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  welcomeTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  forgotButton: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: -5,
    marginBottom: 25,
    paddingVertical: 8,
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 25,
    gap: 5,
  },

  registerQuestion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  registerButton: {
    paddingVertical: 5,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },

});
