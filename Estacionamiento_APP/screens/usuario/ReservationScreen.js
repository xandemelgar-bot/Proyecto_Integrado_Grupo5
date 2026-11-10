import React, { useState } from "react";
import { Text, Alert, View, TouchableOpacity } from "react-native";
import {
  Screen, Card, Heading, Muted, Button, money
} from "../../components/UI";
import { useParking } from "../../context/ParkingContext";
import C from "../../constants/colors";

export default function ReservationScreen({ navigation, route }) {
  const { spaces, tariff, reserve } = useParking();

  const [spaceId, setSpaceId] = useState(
    route?.params?.spaceId || null
  );
  const [hours, setHours] = useState(1);

  const free = spaces.filter(s => s.estado === "libre");
  const selected = spaces.find(s => s.id === spaceId);

  const submit = () => {
    if (!spaceId) {
      return Alert.alert(
        "Selecciona un espacio",
        "Elige un espacio disponible."
      );
    }

    const result = reserve(spaceId, hours);

    if (!result.ok) {
      return Alert.alert("No disponible", result.message);
    }

    Alert.alert(
      "Reserva creada",
      Espacio ${spaceId} por ${hours} hora(s),
      [{
        text: "Ver reservas",
        onPress: () => navigation.navigate("MyReservations")
      }]
    );
  };

  return (
    <Screen
      title="Nueva reserva"
      subtitle="Elige espacio y duración"
      navigation={navigation}
    >
      <Card>
        <Heading>Seleccionar espacio</Heading>

        <Muted>
          {selected
            ? Seleccionado: ${selected.id} (nivel ${selected.nivel})
            : "Selecciona uno de los disponibles"}
        </Muted>

        {free.length === 0 && (
          <Muted>No hay espacios libres.</Muted>
        )}

        <View style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14
        }}>
          {free.map(space => (
            <TouchableOpacity
              key={space.id}
              onPress={() => setSpaceId(space.id)}
              style={{
                backgroundColor:
                  spaceId === space.id ? C.primary : "#DCFCE7",
                padding: 12,
                borderRadius: 10,
                minWidth: 55,
                alignItems: "center"
              }}
            >
              <Text style={{
                color: spaceId === space.id ? "white" : C.success,
                fontWeight: "800"
              }}>
                {space.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <Heading>Duración de la reserva</Heading>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <TouchableOpacity
            onPress={() => setHours(Math.max(1, hours - 1))}
            style={{
              backgroundColor: "#EFF6FF",
              padding: 15,
              borderRadius: 12
            }}
          >
            <Text style={{ color: C.primary, fontSize: 20 }}>−</Text>
          </TouchableOpacity>

          <Text style={{
            fontSize: 22,
            fontWeight: "800",
            color: C.text
          }}>
            {hours} hora(s)
          </Text>

          <TouchableOpacity
            onPress={() => setHours(Math.min(12, hours + 1))}
            style={{
              backgroundColor: "#EFF6FF",
              padding: 15,
              borderRadius: 12
            }}
          >
            <Text style={{ color: C.primary, fontSize: 20 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}>
          <Muted>
            Importe estimado: {
              money(Math.max(tariff.minimum, tariff.hour * hours))
            }
          </Muted>
        </View>

        <Button
          title="Confirmar reserva"
          onPress={submit}
          disabled={!spaceId || selected?.estado !== "libre"}
        />
      </Card>
    </Screen>
  );
}