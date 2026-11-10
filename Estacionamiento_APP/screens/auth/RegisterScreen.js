
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
// REGISTER SCREEN
// ==========================================

export default function RegisterScreen({ navigation }) {
  const auth = useAuth();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LÓGICA ORIGINAL - SIN CAMBIOS
  // ==========================================

  const submit = async () => {
    if (!nombre.trim() || !correo.trim() || !clave) {
      return Alert.alert(
        "Campos incompletos",
        "Completa los campos"
      );
    }

    if (clave.length < 6) {
      return Alert.alert(
        "Contraseña",
        "Utiliza al menos 6 caracteres"
      );
    }

    if (clave !== confirmar) {
      return Alert.alert(
        "Contraseñas",
        "Las contraseñas no coinciden"
      );
    }

    if (typeof auth.registrarUsuario !== "function") {
      return Alert.alert(
        "Integración pendiente",
        "Agrega registrarUsuario a hooks/useAuth.js"
      );
    }

    try {
      setLoading(true);

      await auth.registrarUsuario(
        correo.trim().toLowerCase(),
        clave,
        nombre.trim()
      );

      Alert.alert(
        "Cuenta creada",
        "Tu cuenta está lista."
      );
    } catch (e) {
      Alert.alert(
        "Registro",
        e.message || "No se pudo registrar"
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
          style={s.scrollView}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* FONDO GENERAL */}

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
              ENCABEZADO
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

            {/* BOTÓN REGRESAR */}

            <TouchableOpacity
              style={s.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* ICONO PRINCIPAL */}

            <View style={s.logoContainer}>
              <Ionicons
                name="person-add-outline"
                size={47}
                color="#FFFFFF"
              />
            </View>

            {/* TÍTULO */}

            <Text style={s.brand}>
              Crear cuenta
            </Text>

            <Text style={s.tag}>
              Regístrate como conductor
            </Text>
          </LinearGradient>

          {/* ==================================
              CONTENEDOR DEL FORMULARIO
          ================================== */}

          <View style={s.formContainer}>
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

              {/* ENCABEZADO DEL FORMULARIO */}

              <Text style={s.title}>
                ¡Únete a nosotros!
              </Text>

              <Text style={s.subtitle}>
                Completa tus datos para crear tu cuenta
              </Text>

              {/* ==================================
                  NOMBRE COMPLETO
              ================================== */}

              <Text style={s.label}>
                Nombre completo
              </Text>

              <View style={s.field}>
                <View style={s.fieldIcon}>
                  <Ionicons
                    name="person-outline"
                    size={21}
                    color="#1673E8"
                  />
                </View>

                <TextInput
                  style={s.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Tu nombre"
                  placeholderTextColor="#91A5C0"
                  editable={!loading}
                />
              </View>

              {/* ==================================
                  CORREO ELECTRÓNICO
              ================================== */}

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
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#91A5C0"
                  editable={!loading}
                />
              </View>

              {/* ==================================
                  CONTRASEÑA
              ================================== */}

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
                  value={clave}
                  onChangeText={setClave}
                  secureTextEntry
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#91A5C0"
                  editable={!loading}
                />
              </View>

              {/* ==================================
                  CONFIRMAR CONTRASEÑA
              ================================== */}

              <Text style={s.label}>
                Confirmar contraseña
              </Text>

              <View style={s.field}>
                <View style={s.fieldIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={21}
                    color="#1673E8"
                  />
                </View>

                <TextInput
                  style={s.input}
                  value={confirmar}
                  onChangeText={setConfirmar}
                  secureTextEntry
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#91A5C0"
                  editable={!loading}
                />
              </View>

              {/* ==================================
                  BOTÓN CREAR CUENTA
              ================================== */}

              <TouchableOpacity
                onPress={submit}
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
                    <View style={s.buttonContent}>
                      <ActivityIndicator
                        color="#FFFFFF"
                        size="small"
                      />

                      <Text style={s.buttonText}>
                        Creando cuenta...
                      </Text>
                    </View>
                  ) : (
                    <View style={s.buttonContent}>
                      <Ionicons
                        name="person-add-outline"
                        size={21}
                        color="#FFFFFF"
                      />

                      <Text style={s.buttonText}>
                        Crear cuenta
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* ==================================
                  VOLVER AL LOGIN
              ================================== */}

              <TouchableOpacity
                style={s.loginButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={18}
                  color="#1165D8"
                />

                <Text style={s.loginText}>
                  Volver a iniciar sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================================
              ONDAS INFERIORES
          ================================== */}

          <View
            style={s.bottomDecoration}
            pointerEvents="none"
          >
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

  scrollView: {
    flex: 1
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 0
  },

  // ==========================================
  // ENCABEZADO
  // ==========================================

  hero: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 26,
    overflow: "hidden",
    position: "relative",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
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

  backButton: {
    position: "absolute",
    top: 18,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },

  brand: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.5
  },

  tag: {
    color: "#EAF4FF",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500"
  },

  // ==========================================
  // CONTENEDOR DEL FORMULARIO
  // ==========================================

  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 20
  },

  // ==========================================
  // TARJETA
  // ==========================================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 26,

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
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#102A55"
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 24
  },

  // ==========================================
  // CAMPOS
  // ==========================================

  label: {
    color: "#24436C",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 8,
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
    marginBottom: 17,
    minHeight: 53
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

  // ==========================================
  // BOTÓN PRINCIPAL
  // ==========================================

  buttonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,

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

  // ==========================================
  // BOTÓN VOLVER AL LOGIN
  // ==========================================

  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 8
  },

  loginText: {
    color: "#1165D8",
    fontWeight: "800",
    fontSize: 14
  },

  // ==========================================
  // ONDAS INFERIORES
  // ==========================================

  bottomDecoration: {
    height: 115,
    width: "100%",
    justifyContent: "flex-end",
    flexShrink: 0
  }
});
