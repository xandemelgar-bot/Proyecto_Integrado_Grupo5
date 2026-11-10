import React from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, SpacesGrid
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function ParkingManagementScreen({ navigation }) {
  const { spaces, setSpaceStatus } = useParking();

  const change = space => {
    if (space.estado === "reservado") {
      return Alert.alert(
        "Espacio reservado",
        "Cancela primero la reserva."
      );
    }

    Alert.alert(
      `Espacio ${space.id}`,
      "Selecciona el nuevo estado",
      [
        {
          text: "Libre",
          onPress: () => setSpaceStatus(space.id, "libre")
        },
        {
          text: "Ocupado",
          onPress: () => setSpaceStatus(space.id, "ocupado")
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  return (
    <Screen
      title="Gestión de espacios"
      subtitle="24 espacios distribuidos en 2 niveles"
      navigation={navigation}
    >
      <Muted>
        Verde: libre · Rojo: ocupado · Amarillo: reservado.
        Toca un espacio para cambiar su estado simulado.
      </Muted>

      {[1, 2].map(nivel => (
        <Card key={nivel}>
          <Heading>Nivel {nivel}</Heading>
          <SpacesGrid
            spaces={spaces.filter(s => s.nivel === nivel)}
            onSelect={change}
          />
        </Card>
      ))}
    </Screen>
  );
}