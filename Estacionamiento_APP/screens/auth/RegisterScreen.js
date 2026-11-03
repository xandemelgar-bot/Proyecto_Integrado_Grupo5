
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../services/firebase";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarUsuario = async () => {
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (
      !nombreLimpio ||
      !correoLimpio ||
      !contrasena ||
      !confirmar
    ) {
      Alert.alert(
        "Campos incompletos",
        "Completa todos los campos."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      Alert.alert("Error", "Ingresa un correo válido.");
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert(
        "Contraseña corta",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (contrasena !== confirmar) {
      Alert.alert(
        "Error",
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);

    try {
      const resultado = await createUserWithEmailAndPassword(
        auth,
        correoLimpio,
        contrasena
      );

      const usuario = resultado.user;

      // Guardar el nombre en Authentication
      await updateProfile(usuario, {
        displayName: nombreLimpio,
      });

      // Crear el documento del usuario en Firestore
      await setDoc(doc(db, "usuarios", usuario.uid), {
        nombre: nombreLimpio,
        correo: usuario.email,
        rol: "usuario",
        fechaRegistro: serverTimestamp(),
      });

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta se creó correctamente."
      );

      // Firebase inicia sesión automáticamente
      // después de registrar al usuario.
    } catch (error) {
      console.log("Error al registrar:", error.code);

      let mensaje = "No se pudo completar el registro.";

      switch (error.code) {
        case "auth/email-already-in-use":
          mensaje = "Este correo ya está registrado.";
          break;

        case "auth/invalid-email":
          mensaje = "El correo electrónico no es válido.";
          break;

        case "auth/weak-password":
          mensaje = "Utiliza una contraseña más segura.";
          break;

        case "auth/network-request-failed":
          mensaje = "Verifica tu conexión a Internet.";
          break;

        case "permission-denied":
        case "firestore/permission-denied":
          mensaje =
            "La cuenta se creó, pero no se pudo guardar el perfil. Revisa las reglas de Firestore.";
          break;
      }

      Alert.alert("Aviso", mensaje);
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

        <Text style={styles.title}>Crear cuenta</Text>

        <Text style={styles.subtitle}>
          Regístrate en Estacionamiento Inteligente
        </Text>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nombre"
          placeholderTextColor="#94A3B8"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
          editable={!loading}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#94A3B8"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#94A3B8"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          editable={!loading}
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#94A3B8"
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={registrarUsuario}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Registrarse
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  icon: {
    fontSize: 45,
    textAlign: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E293B",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 18,
    fontSize: 15,
    color: "#1E293B",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 25,
    alignItems: "center",
  },
  loginText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },
});
