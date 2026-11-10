import React from "react";
import { View } from "react-native";
import {
  Screen, Card, Heading, Metric, Muted, Button
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function UsuarioScreen({ navigation }) {
  const { stats, reservations } = useParking();

  const active = reservations.filter(
    r => r.status === "activa"
  ).length;

  const options = [
    ["Ver estacionamientos", "Parking"],
    ["Reservar espacio", "Reservation"],
    ["Mis reservaciones", "MyReservations"],
    ["Pagos", "Payment"],
    ["Notificaciones", "Notifications"],
    ["Mi perfil", "Profile"]
  ];

  return (
    <Screen
      title="Inicio"
      subtitle="Tu estacionamiento inteligente"
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Metric
          label="Espacios libres"
          value={stats.free}
          color="#16A34A"
        />
        <Metric
          label="Reservas activas"
          value={active}
        />
      </View>

      <Card>
        <Heading>Accesos rápidos</Heading>
        {options.map(([title, route]) => (
          <Button
            key={route}
            title={title}
            secondary
            onPress={() => navigation.navigate(route)}
          />
        ))}
      </Card>

      <Card>
        <Heading>Información</Heading>
        <Muted>
          Consulta los espacios disponibles y reserva
          uno para estacionar tu vehículo.
        </Muted>
        <Muted>
          Los datos de esta versión son simulados.
        </Muted>
      </Card>
    </Screen>
  );
}