import React from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, Button
} from "../../components/UI";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen({ navigation }) {
  const auth = useAuth();

  const user = auth.usuario || auth.user || auth.currentUser;

  const logout = () => {
    if (typeof auth.cerrarSesion !== "function") {
      return Alert.alert(
        "Integración pendiente",
        "Agrega cerrarSesion a useAuth.js"
      );
    }

    Alert.alert(
      "Cerrar sesión",
      "¿Deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          onPress: async () => {
            try {
              await auth.cerrarSesion();
            } catch (e) {
              Alert.alert(
                "Error",
                e.message || "No se pudo cerrar sesión"
              );
            }
          }
        }
      ]
    );
  };

  return (
    <Screen
      title="Mi perfil"
      subtitle="Datos de tu cuenta"
      navigation={navigation}
    >
      <Card>
        <Heading>Información personal</Heading>

        <Muted>
          Nombre: {
            user?.displayName ||
            user?.nombre ||
            "Sin nombre registrado"
          }
        </Muted>

        <Muted>
          Correo: {
            user?.email ||
            user?.correo ||
            "No disponible"
          }
        </Muted>

        <Muted>
          UID: {user?.uid || "No disponible"}
        </Muted>
      </Card>

      <Card>
        <Button
          title="Cerrar sesión"
          danger
          onPress={logout}
        />
      </Card>
    </Screen>
  );
}