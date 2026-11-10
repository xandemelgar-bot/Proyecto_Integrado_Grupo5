import React from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, Status,
  Button, dateText, money
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function ReservationsAdminScreen({ navigation }) {
  const { reservations, cancelReservation } = useParking();

  return (
    <Screen
      title="Reservaciones"
      subtitle="Supervisión y cancelaciones"
      navigation={navigation}
    >
      {reservations.length === 0 ? (
        <Card>
          <Muted>No hay reservaciones registradas.</Muted>
        </Card>
      ) : (
        reservations.map(r => (
          <Card key={r.id}>
            <Heading>Espacio {r.spaceId}</Heading>
            <Status value={r.status} />
            <Muted>Inicio: {dateText(r.start)}</Muted>
            <Muted>Duración: {r.hours} hora(s)</Muted>
            <Muted>Importe: {money(r.amount)}</Muted>

            {r.status === "activa" && (
              <Button
                title="Cancelar reserva"
                danger
                onPress={() => Alert.alert(
                  "Cancelar reserva",
                  "¿Confirmas la cancelación?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Sí, cancelar",
                      onPress: () => cancelReservation(r.id)
                    }
                  ]
                )}
              />
            )}
          </Card>
        ))
      )}
    </Screen>
  );
}