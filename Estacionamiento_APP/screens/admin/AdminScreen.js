import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Screen, Card, Heading, Metric, Muted, Button, money
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";
import { Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import MenuCard from "../../components/MenuCard";

export default function AdminScreen({ navigation }) {
  const { stats, connection, reservations } = useParking();

  const options = [
    ["Gestionar espacios", "ParkingManagement"],
    ["Reservaciones", "ReservationsAdmin"],
    ["Tarifas", "Tariffs"],
    ["Reportes", "Reports"],
    ["Predicciones IA", "Predictions"]
  ];
  const { cerrarSesion } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await cerrarSesion();
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo cerrar sesión."
              );
            }
          },
        },
      ]
    );
  };

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

        <View style={styles.menuGrid}>
          <MenuCard
            title="Espacios"
            subtitle="24 estacionamientos"
            icon="car-sport"
            onPress={() =>
              navigation.navigate("ParkingManagement")
            }
          />

          <MenuCard
            title="Reservaciones"
            subtitle="Gestionar reservas"
            icon="calendar-outline"
            onPress={() =>
              navigation.navigate("ReservationsAdmin")
            }
          />

          <MenuCard
            title="Tarifas"
            subtitle="Precios y cobros"
            icon="wallet-outline"
            onPress={() =>
              navigation.navigate("Tariffs")
            }
          />

          <MenuCard
            title="Reportes"
            subtitle="Ver estadísticas"
            icon="bar-chart-outline"
            onPress={() =>
              navigation.navigate("Reports")
            }
          />

          <MenuCard
            title="Predicciones"
            subtitle="Inteligencia artificial"
            icon="analytics-outline"
            onPress={() =>
              navigation.navigate("Predictions")
            }
          />
        </View>
      </Card>

      <Card>
        <Button
          title="Cerrar sesión"
          icon="log-out-outline"
          danger
          onPress={handleLogout}
        />
      </Card>
    </Screen>

  );
}
const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
});