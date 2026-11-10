import React, { useState } from "react";
import { Text, TextInput, Alert, StyleSheet } from "react-native";
import { Screen, Card, Button } from "../../components/UI";
import { useAuth } from "../../hooks/useAuth";
import C from "../../constants/colors";

export default function RegisterScreen({ navigation }) {
  const auth = useAuth();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!nombre.trim() || !correo.trim() || !clave) {
      return Alert.alert("Campos incompletos", "Completa los campos");
    }

    if (clave.length < 6) {
      return Alert.alert("Contraseña", "Utiliza al menos 6 caracteres");
    }

    if (clave !== confirmar) {
      return Alert.alert("Contraseñas", "Las contraseñas no coinciden");
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
      Alert.alert("Cuenta creada", "Tu cuenta está lista.");
    } catch (e) {
      Alert.alert("Registro", e.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title="Crear cuenta"
      subtitle="Regístrate como conductor"
      navigation={navigation}
    >
      <Card>
        <Text style={s.label}>Nombre completo</Text>
        <TextInput
          style={s.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
        />

        <Text style={s.label}>Correo electrónico</Text>
        <TextInput
          style={s.input}
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="ejemplo@correo.com"
        />

        <Text style={s.label}>Contraseña</Text>
        <TextInput
          style={s.input}
          value={clave}
          onChangeText={setClave}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        <Text style={s.label}>Confirmar contraseña</Text>
        <TextInput
          style={s.input}
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
          placeholder="Repite tu contraseña"
        />

        <Button
          title={loading ? "Creando cuenta..." : "Crear cuenta"}
          onPress={submit}
          disabled={loading}
        />
        <Button
          title="Volver a iniciar sesión"
          secondary
          onPress={() => navigation.goBack()}
        />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  label: {
    fontWeight: "700",
    color: C.text,
    marginBottom: 8
  },
  input: {
    backgroundColor: C.background,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    color: C.text
  }
});