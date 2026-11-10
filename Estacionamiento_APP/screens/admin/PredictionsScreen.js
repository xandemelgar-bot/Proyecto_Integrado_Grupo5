import React from "react";
import {
  Screen, Card, Heading, Muted
} from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

export default function PredictionsScreen({ navigation }) {
  const { stats } = useParking();

  const occupation = Math.round(
    ((stats.occupied + stats.reserved) / 24) * 100
  );

  return (
    <Screen
      title="Predicciones"
      subtitle="Módulo de inteligencia artificial"
      navigation={navigation}
    >
      <Card>
        <Heading>Ocupación actual</Heading>
        <Muted>
          {occupation}% de los 24 espacios no están libres.
        </Muted>
      </Card>

      <Card>
        <Heading>Disponibilidad actual</Heading>
        <Muted>
          En este momento quedan aproximadamente {
            stats.free
          } espacios disponibles.
        </Muted>
      </Card>

      <Card>
        <Heading>Horarios de mayor demanda</Heading>
        <Muted>
          Aún no hay datos históricos suficientes para
          identificar las horas de mayor demanda.
        </Muted>
      </Card>

      <Card>
        <Heading>Predicción de ocupación</Heading>
        <Muted>
          Pendiente de conectar un modelo entrenado
          con registros históricos del estacionamiento.
        </Muted>
      </Card>

      <Card>
        <Heading>Próxima integración</Heading>
        <Muted>
          Guardar eventos con fecha y hora en Firebase,
          construir un historial de ocupación y conectar
          el modelo predictivo mediante una API.
        </Muted>
      </Card>
    </Screen>
  );
}