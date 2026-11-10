
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { useAuth } from "../../hooks/useAuth";

// ==========================================
// LOGIN SCREEN
// ==========================================

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LÓGICA ORIGINAL
  // ==========================================

  const login = async () => {
    if (!correo.trim() || !contrasena) {
      return Alert.alert(
        "Campos incompletos",
        "Ingresa correo y contraseña"
      );
    }

    try {
      setLoading(true);

      await iniciarSesion(
        correo.trim().toLowerCase(),
        contrasena
      );
    } catch (e) {
      Alert.alert(
        "No se pudo iniciar sesión",
        e.code === "auth/network-request-failed"
          ? "Verifica tu conexión a Internet."
          : "Revisa tus credenciales e inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DISEÑO
  // ==========================================

  return (
    <SafeAreaView
      style={s.safe}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0754BD"
      />

      <KeyboardAvoidingView
        style={s.main}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {/* FONDO PRINCIPAL */}

          <LinearGradient
            colors={[
              "#EAF4FF",
              "#F8FBFF",
              "#D5E9FF"
            ]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* ==================================
              ENCABEZADO DEGRADADO
          ================================== */}

          <LinearGradient
            colors={[
              "#0754BD",
              "#1673E8",
              "#67B1FF"
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            {/* CÍRCULOS DECORATIVOS */}

            <View style={s.circleOne} />
            <View style={s.circleTwo} />

            {/* LOGOTIPO */}

            <View style={s.logoContainer}>
              <Ionicons
                name="scan-outline"
                size={82}
                color="#FFFFFF"
                style={s.scanIcon}
              />

              <Ionicons
                name="car-sport"
                size={46}
                color="#FFFFFF"
                style={s.carIcon}
              />
            </View>

            {/* NOMBRE */}

            <Text style={s.brand}>
              Estacionamiento{"\n"}Inteligente
            </Text>

            <Text style={s.tag}>
              Inicia sesión para continuar
            </Text>
          </LinearGradient>

          {/* ==================================
              FORMULARIO FLOTANTE
          ================================== */}

          <View style={s.card}>
            {/* LÍNEA DECORATIVA */}

            <LinearGradient
              colors={[
                "#0754BD",
                "#2585FF",
                "#8BC5FF"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.cardAccent}
            />

            <Text style={s.title}>
              ¡Bienvenido!
            </Text>

            <Text style={s.subtitle}>
              Ingresa tus datos para continuar
            </Text>

            {/* CORREO ELECTRÓNICO */}

            <Text style={s.label}>
              Correo electrónico
            </Text>

            <View style={s.field}>
              <View style={s.fieldIcon}>
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color="#1673E8"
                />
              </View>

              <TextInput
                style={s.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#91A5C0"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            {/* CONTRASEÑA */}

            <Text style={s.label}>
              Contraseña
            </Text>

            <View style={s.field}>
              <View style={s.fieldIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#1673E8"
                />
              </View>

              <TextInput
                style={s.input}
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#91A5C0"
                secureTextEntry={!visible}
                autoCapitalize="none"
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() => setVisible(!visible)}
                style={s.eyeButton}
              >
                <Ionicons
                  name={
                    visible
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={21}
                  color="#7A9BC7"
                />
              </TouchableOpacity>
            </View>

            {/* RECUPERAR CONTRASEÑA */}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ForgotPassword")
              }
              style={s.forgotButton}
            >
              <Text style={s.link}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* BOTÓN DE INICIAR SESIÓN */}

            <TouchableOpacity
              onPress={login}
              disabled={loading}
              activeOpacity={0.85}
              style={s.buttonWrapper}
            >
              <LinearGradient
                colors={[
                  "#2585FF",
                  "#0754C9"
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.button}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={s.buttonContent}>
                    <Ionicons
                      name="log-in-outline"
                      size={23}
                      color="#FFFFFF"
                    />

                    <Text style={s.buttonText}>
                      Iniciar sesión
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* REGISTRO */}

            <View style={s.register}>
              <Text style={s.registerText}>
                ¿No tienes una cuenta?{" "}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Register")
                }
              >
                <Text style={s.registerLink}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================================
              DECORACIÓN INFERIOR
          ================================== */}

          <View style={s.bottomDecoration}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
            >
              <Path
                d="
                  M0 45
                  C110 -5 230 105 400 25
                  L400 120
                  L0 120 Z
                "
                fill="#8BC5FF"
                opacity={0.45}
              />

              <Path
                d="
                  M0 85
                  C130 25 270 135 400 55
                  L400 120
                  L0 120 Z
                "
                fill="#2585FF"
                opacity={0.8}
              />

              <Path
                d="
                  M0 110
                  C150 55 260 150 400 80
                  L400 120
                  L0 120 Z
                "
                fill="#0754C9"
              />
            </Svg>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS
// ==========================================

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0754BD"
  },

  main: {
    flex: 1,
    backgroundColor: "#EAF4FF"
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 0
  },

  // ENCABEZADO

  hero: {
    alignItems: "center",
    paddingTop: 42,
    paddingHorizontal: 25,
    paddingBottom: 85,
    overflow: "hidden",
    position: "relative"
  },

  circleOne: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(255,255,255,0.09)",
    top: -110,
    right: -90
  },

  circleTwo: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.08)",
    left: -90,
    top: 80
  },

  // LOGOTIPO

  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 12
  },

  scanIcon: {
    position: "absolute"
  },

  carIcon: {
    position: "absolute"
  },

  brand: {
    fontSize: 29,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.5
  },

  tag: {
    color: "#EAF4FF",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500"
  },

  // TARJETA

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: -48,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 28,

    elevation: 9,

    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,

    borderWidth: 1,
    borderColor: "#E2EEFC",
    overflow: "hidden"
  },

  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    color: "#102A55"
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 28
  },

  // CAMPOS

  label: {
    color: "#24436C",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 9,
    marginLeft: 3
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,

    backgroundColor: "#F5F9FF",

    borderWidth: 1,
    borderColor: "#D6E5F8",
    borderRadius: 14,

    paddingHorizontal: 12,
    marginBottom: 20,
    minHeight: 56
  },

  fieldIcon: {
    width: 31,
    height: 34,
    justifyContent: "center",
    alignItems: "center"
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: "#102A55",
    fontSize: 14,
    paddingVertical: 12
  },

  eyeButton: {
    padding: 5
  },

  // RECUPERACIÓN

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25
  },

  link: {
    color: "#1165D8",
    fontWeight: "700",
    fontSize: 13
  },

  // BOTÓN PRINCIPAL

  buttonWrapper: {
    borderRadius: 14,
    overflow: "hidden",

    elevation: 5,

    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 9
  },

  button: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16
  },

  // REGISTRO

  register: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 27
  },

  registerText: {
    color: "#64748B",
    fontSize: 13
  },

  registerLink: {
    color: "#1165D8",
    fontWeight: "800",
    fontSize: 13
  },

  // ONDAS INFERIORES

  bottomDecoration: {
    height: 115,
    marginTop: "auto",
    paddingTop: 20,
    width: "100%",
    justifyContent: "flex-end",
    flexShrink: 0
  }
});
