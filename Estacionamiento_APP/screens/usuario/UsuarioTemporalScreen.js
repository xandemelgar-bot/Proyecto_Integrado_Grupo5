
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useAuth } from "../../hooks/useAuth";

export default function UsuarioTemporalScreen() {
  const { usuario, perfil, cerrarSesion } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🚗 Estacionamiento Inteligente
      </Text>

      <Text style={styles.subtitle}>
        Bienvenido, {perfil?.nombre || "Usuario"}
      </Text>

      <Text style={styles.info}>
        Correo: {usuario?.email}
      </Text>

      <Text style={styles.info}>
        Rol: {perfil?.rol}
      </Text>

      <Text style={styles.message}>
        Firebase conectado correctamente.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={cerrarSesion}
      >
        <Text style={styles.buttonText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 19,
    color: "#2563EB",
    marginBottom: 15,
  },
  info: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: "#16A34A",
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
