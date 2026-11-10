import React from "react";
import { View } from "react-native";
import {
  Screen, Card, Heading, Metric, Muted, Button, money
} from "../../components/UI";
import { useParking } from "../../context/ParkingContext";

export default function AdminScreen({ navigation }) {
  const { stats, connection, reservations } = useParking();

  const options = [
    ["Gestionar espacios", "ParkingManagement"],
    ["Reservaciones", "ReservationsAdmin"],
    ["Tarifas", "Tariffs"],
    ["Reportes", "Reports"],
    ["Predicciones IA", "Predictions"]
  ];

  return (
    <Screen
      title="Panel administrador"
      subtitle="Resumen general del estacionamiento"
    >
      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
      }}>
        <Metric label="Libres" value={stats.free} />
        <Metric
          label="Ocupados"
          value={stats.occupied}
          color="#DC2626"
        />
        <Metric
          label="Reservados"
          value={stats.reserved}
          color="#F59E0B"
        />
        <Metric
          label="Ingresos simulados"
          value={money(stats.income)}
          color="#16A34A"
        />
      </View>

      <Card>
        <Heading>Estado del sistema</Heading>
        <Muted>
          {connection
            ? "Conectado a la fuente de datos"
            : "Sin conexión en tiempo real (modo demostración)"}
        </Muted>
        <Muted>
          Reservas activas: {
            reservations.filter(r => r.status === "activa").length
          }
        </Muted>
      </Card>

      <Card>
        <Heading>Administración</Heading>
        {options.map(([title, route]) => (
          <Button
            key={route}
            title={title}
            secondary
            onPress={() => navigation.navigate(route)}
          />
        ))}
      </Card>
    </Screen>
  );
}