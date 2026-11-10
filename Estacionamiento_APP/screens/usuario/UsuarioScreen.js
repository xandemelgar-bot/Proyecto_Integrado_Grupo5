import React from "react";
import { View } from "react-native";
import {
  Screen, Card, Heading, Metric, Muted, Button
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";
import MenuCard from "../../components/MenuCard";

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

        <View style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 14,
        }}>
          <MenuCard
            title="Estacionamientos"
            subtitle="Ver espacios libres"
            icon="car-sport-outline"
            onPress={() => navigation.navigate("Parking")}
          />

          <MenuCard
            title="Reservar"
            subtitle="Crear una reserva"
            icon="calendar-outline"
            onPress={() => navigation.navigate("Reservation")}
          />

          <MenuCard
            title="Mis reservas"
            subtitle="Historial de reservas"
            icon="time-outline"
            onPress={() => navigation.navigate("MyReservations")}
          />

          <MenuCard
            title="Pagos"
            subtitle="Consultar pagos"
            icon="card-outline"
            onPress={() => navigation.navigate("Payment")}
          />

          <MenuCard
            title="Notificaciones"
            subtitle="Avisos importantes"
            icon="notifications-outline"
            onPress={() => navigation.navigate("Notifications")}
          />

          <MenuCard
            title="Mi perfil"
            subtitle="Datos de mi cuenta"
            icon="person-outline"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
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