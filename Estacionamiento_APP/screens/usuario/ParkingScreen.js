import React from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, SpacesGrid
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function ParkingScreen({ navigation }) {
  const { spaces } = useParking();

  const selectSpace = space => {
    if (space.estado !== "libre") {
      return Alert.alert(
        "No disponible",
        "Selecciona un espacio verde."
      );
    }

    navigation.navigate("Reservation", {
      spaceId: space.id
    });
  };

  return (
    <Screen
      title="Espacios disponibles"
      subtitle="Selecciona un espacio libre"
      navigation={navigation}
    >
      <Muted>
        Verde: libre · Rojo: ocupado · Amarillo: reservado.
      </Muted>

      {[1, 2].map(nivel => (
        <Card key={nivel}>
          <Heading>Nivel {nivel}</Heading>
          <SpacesGrid
            spaces={spaces.filter(s => s.nivel === nivel)}
            onSelect={selectSpace}
          />
        </Card>
      ))}
    </Screen>
  );
}