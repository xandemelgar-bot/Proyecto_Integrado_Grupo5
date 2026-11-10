import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  Alert, ActivityIndicator, StyleSheet, StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import C from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!correo.trim() || !contrasena) {
      return Alert.alert(
        "Campos incompletos",
        "Ingresa correo y contraseña"
      );
    }

    try {
      setLoading(true);
      await iniciarSesion(correo.trim().toLowerCase(), contrasena);
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

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.primary}
      />
      <KeyboardAvoidingView
        style={s.main}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.scroll}
        >
          <View style={s.hero}>
            <Ionicons name="car-sport" size={52} color="white" />
            <Text style={s.brand}>
              Estacionamiento{"\n"}Inteligente
            </Text>
            <Text style={s.tag}>
              Gestiona tu estacionamiento de forma fácil y segura
            </Text>
          </View>

          <View style={s.card}>
            <Text style={s.title}>¡Bienvenido!</Text>
            <Text style={s.subtitle}>
              Ingresa tus datos para continuar
            </Text>

            <Text style={s.label}>Correo electrónico</Text>
            <View style={s.field}>
              <Ionicons
                name="mail-outline"
                size={21}
                color={C.textSecondary}
              />
              <TextInput
                style={s.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="ejemplo@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <Text style={s.label}>Contraseña</Text>
            <View style={s.field}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color={C.textSecondary}
              />
              <TextInput
                style={s.input}
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Ingresa tu contraseña"
                secureTextEntry={!visible}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Ionicons
                  name={visible ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={C.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={s.link}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.button}
              onPress={login}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={s.buttonText}>
                  Iniciar sesión →
                </Text>
              )}
            </TouchableOpacity>

            <View style={s.register}>
              <Text style={{ color: C.textSecondary }}>
                ¿No tienes una cuenta?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={{ color: C.primary, fontWeight: "800" }}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  main: { flex: 1, backgroundColor: C.background },
  scroll: { flexGrow: 1, paddingBottom: 28 },
  hero: {
    backgroundColor: C.primary,
    alignItems: "center",
    paddingTop: 28,
    paddingHorizontal: 25,
    paddingBottom: 78,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  brand: {
    fontSize: 27,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginTop: 10
  },
  tag: {
    color: "#DBEAFE",
    textAlign: "center",
    marginTop: 9,
    fontSize: 13
  },
  card: {
    backgroundColor: "white",
    borderRadius: 22,
    marginHorizontal: 18,
    marginTop: -45,
    padding: 22,
    elevation: 5,
    borderWidth: 1,
    borderColor: C.border
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    color: C.text
  },
  subtitle: {
    textAlign: "center",
    color: C.textSecondary,
    marginTop: 7,
    marginBottom: 26
  },
  label: {
    color: C.text,
    fontWeight: "600",
    marginBottom: 8
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    marginBottom: 19,
    minHeight: 54
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: C.text,
    fontSize: 14,
    paddingVertical: 12
  },
  link: {
    textAlign: "center",
    color: C.primary,
    fontWeight: "700",
    marginBottom: 18
  },
  button: {
    backgroundColor: C.primary,
    borderRadius: 12,
    minHeight: 53,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16
  },
  register: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24
  }
});