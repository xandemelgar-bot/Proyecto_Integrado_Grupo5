import React from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, Status,
  Button, dateText, money
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function MyReservationsScreen({ navigation }) {
  const {
    reservations, cancelReservation, payments
  } = useParking();

  return (
    <Screen
      title="Mis reservaciones"
      subtitle="Actuales, anteriores y canceladas"
      navigation={navigation}
    >
      {reservations.length === 0 ? (
        <Card>
          <Muted>Aún no tienes reservaciones.</Muted>
          <Button
            title="Crear reserva"
            onPress={() => navigation.navigate("Reservation")}
          />
        </Card>
      ) : (
        reservations.map(r => {
          const paid = payments.some(
            p => p.reservationId === r.id
          );

          return (
            <Card key={r.id}>
              <Heading>Espacio {r.spaceId}</Heading>
              <Status value={r.status} />

              <Muted>Fecha: {dateText(r.start)}</Muted>
              <Muted>Duración: {r.hours} hora(s)</Muted>
              <Muted>Importe: {money(r.amount)}</Muted>
              <Muted>
                {paid
                  ? "Pago simulado completado"
                  : "Pago pendiente"}
              </Muted>

              {r.status === "activa" && (
                <>
                  {!paid && (
                    <Button
                      title="Ir a pago"
                      secondary
                      onPress={() => navigation.navigate(
                        "Payment",
                        { reservationId: r.id }
                      )}
                    />
                  )}

                  <Button
                    title="Cancelar reserva"
                    danger
                    onPress={() => Alert.alert(
                      "Cancelar",
                      "¿Cancelar esta reserva?",
                      [
                        { text: "No", style: "cancel" },
                        {
                          text: "Sí",
                          onPress: () => cancelReservation(r.id)
                        }
                      ]
                    )}
                  />
                </>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}