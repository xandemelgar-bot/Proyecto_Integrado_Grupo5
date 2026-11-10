import React from "react";
import {
  Screen, Card, Heading, Muted, dateText
} from "../../components/UI";
import { useParking } from "../../context/ParkingContext";

export default function NotificationsScreen({ navigation }) {
  const { notifications, reservations } = useParking();
  const now = Date.now();

  const active = reservations.filter(
    r => r.status === "activa"
  );

  return (
    <Screen
      title="Notificaciones"
      subtitle="Avisos de tu cuenta"
      navigation={navigation}
    >
      {active.map(r => {
        const end = new Date(r.start).getTime() +
          r.hours * 3600000;

        const minutes = Math.max(
          0,
          Math.ceil((end - now) / 60000)
        );

        return (
          <Card key={r.id}>
            <Heading>
              Reserva activa · Espacio {r.spaceId}
            </Heading>
            <Muted>
              Tiempo restante aproximado: {minutes} minutos.
            </Muted>
          </Card>
        );
      })}

      {notifications.length === 0 && active.length === 0 && (
        <Card>
          <Muted>No tienes notificaciones nuevas.</Muted>
        </Card>
      )}

      {notifications.map(n => (
        <Card key={n.id}>
          <Muted>{n.text}</Muted>
          <Muted>{dateText(n.date)}</Muted>
        </Card>
      ))}
    </Screen>
  );
}