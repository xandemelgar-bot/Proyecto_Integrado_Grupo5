import React from "react";
import { View, Text } from "react-native";
import {
  Screen, Card, Heading, Muted, money
} from "../../components/UI";
import { useParking } from "../../context/ParkingContext";
import C from "../../constants/colors";

function Bar({ label, value, max, color = C.primary }) {
  const percent = max
    ? Math.max(0, Math.min(100, value / max * 100))
    : 0;

  return (
    <View style={{ marginVertical: 9 }}>
      <Text style={{ color: C.text, marginBottom: 5 }}>
        {label}: {value}
      </Text>

      <View style={{
        height: 15,
        backgroundColor: C.border,
        borderRadius: 10
      }}>
        <View style={{
          height: 15,
          width: `${percent}%`,
          backgroundColor: color,
          borderRadius: 10
        }} />
      </View>
    </View>
  );
}

export default function ReportsScreen({ navigation }) {
  const { stats, reservations, payments } = useParking();

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("es-GT", {
        weekday: "short"
      })
    };
  });

  const incomeByDay = days.map(day => ({
    ...day,
    amount: payments
      .filter(p => p.date.slice(0, 10) === day.date)
      .reduce((total, p) => total + p.amount, 0)
  }));

  const maxIncome = Math.max(
    1,
    ...incomeByDay.map(d => d.amount)
  );

  return (
    <Screen
      title="Reportes"
      subtitle="Estadísticas del modo demostración"
      navigation={navigation}
    >
      <Card>
        <Heading>Ocupación actual</Heading>
        <Bar
          label="Libres"
          value={stats.free}
          max={24}
          color={C.success}
        />
        <Bar
          label="Ocupados"
          value={stats.occupied}
          max={24}
          color={C.danger}
        />
        <Bar
          label="Reservados"
          value={stats.reserved}
          max={24}
          color={C.warning}
        />
      </Card>

      <Card>
        <Heading>Resumen general</Heading>
        <Muted>
          Reservas registradas: {reservations.length}
        </Muted>
        <Muted>
          Duración total reservada: {
            reservations.reduce((total, r) => total + r.hours, 0)
          } horas
        </Muted>
        <Muted>
          Ingresos simulados: {money(stats.income)}
        </Muted>
      </Card>

      <Card>
        <Heading>Pagos por día (últimos 7 días)</Heading>
        {incomeByDay.map(day => (
          <Bar
            key={day.date}
            label={day.label}
            value={day.amount}
            max={maxIncome}
          />
        ))}
      </Card>

      <Muted>
        Estas gráficas utilizan datos locales simulados.
        Todavía no representan mediciones históricas del Arduino.
      </Muted>
    </Screen>
  );
}