import React, { useState } from "react";
import { Alert } from "react-native";
import {
  Screen, Card, Heading, Muted, Button, money
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function PaymentScreen({ navigation, route }) {
  const { reservations, payments, pay } = useParking();

  const [selected, setSelected] = useState(
    route?.params?.reservationId || null
  );

  const pending = reservations.filter(r =>
    r.status === "activa" &&
    !payments.some(p => p.reservationId === r.id)
  );

  const reservation = pending.find(r => r.id === selected);

  const submit = () => {
    if (!reservation) {
      return Alert.alert(
        "Selecciona una reserva",
        "Elige una reserva pendiente."
      );
    }

    if (pay(reservation.id)) {
      Alert.alert(
        "Pago simulado",
        "Pago registrado correctamente."
      );
      setSelected(null);
    } else {
      Alert.alert("Error", "No se pudo registrar el pago.");
    }
  };

  return (
    <Screen
      title="Pagos"
      subtitle="Solo simulación, sin cobros reales"
      navigation={navigation}
    >
      <Card>
        <Heading>Reservas pendientes</Heading>

        {pending.length === 0 ? (
          <Muted>No tienes pagos pendientes.</Muted>
        ) : (
          pending.map(r => (
            <Button
              key={r.id}
              title={
                `Espacio ${r.spaceId} · ${money(r.amount)}` +
                (selected === r.id ? " ✓" : "")
              }
              secondary
              onPress={() => setSelected(r.id)}
            />
          ))
        )}
      </Card>

      {reservation && (
        <Card>
          <Heading>Resumen del pago</Heading>
          <Muted>Espacio: {reservation.spaceId}</Muted>
          <Muted>Duración: {reservation.hours} hora(s)</Muted>
          <Muted>Total: {money(reservation.amount)}</Muted>

          <Button
            title="Confirmar pago simulado"
            onPress={submit}
          />
        </Card>
      )}

      <Card>
        <Muted>
          Este módulo no solicita tarjetas ni procesa dinero real.
          Los pagos se registran únicamente en memoria.
        </Muted>
      </Card>
    </Screen>
  );
}