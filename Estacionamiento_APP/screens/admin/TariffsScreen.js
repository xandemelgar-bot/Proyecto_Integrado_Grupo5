import React, { useState } from "react";
import {
  Text, TextInput, Alert, StyleSheet
} from "react-native";
import {
  Screen, Card, Heading, Muted, Button, money
} from "../../components/UI";
import { useParking } from "../../context/ParkingContext";
import C from "../../constants/colors";

export default function TariffsScreen({ navigation }) {
  const { tariff, setTariff } = useParking();

  const [hour, setHour] = useState(String(tariff.hour));
  const [minimum, setMinimum] = useState(String(tariff.minimum));
  const [grace, setGrace] = useState(String(tariff.grace));

  const save = () => {
    const a = Number(hour);
    const b = Number(minimum);
    const c = Number(grace);

    if (
      ![a, b, c].every(Number.isFinite) ||
      a < 0 || b < 0 || c < 0
    ) {
      return Alert.alert(
        "Datos inválidos",
        "Utiliza números positivos"
      );
    }

    setTariff({
      hour: a,
      minimum: b,
      grace: c
    });

    Alert.alert(
      "Guardado",
      "Tarifas actualizadas para nuevas reservas"
    );
  };

  const fields = [
    ["Precio por hora (Q)", hour, setHour],
    ["Cobro mínimo (Q)", minimum, setMinimum],
    ["Minutos de gracia", grace, setGrace]
  ];

  return (
    <Screen
      title="Tarifas"
      subtitle="Configuración de cobros simulados"
      navigation={navigation}
    >
      <Card>
        <Heading>Reglas de cobro</Heading>

        {fields.map(([title, value, setter], index) => (
          <React.Fragment key={index}>
            <Text style={s.label}>{title}</Text>
            <TextInput
              style={s.input}
              keyboardType="decimal-pad"
              value={value}
              onChangeText={setter}
            />
          </React.Fragment>
        ))}

        <Button title="Guardar tarifas" onPress={save} />
      </Card>

      <Card>
        <Muted>
          Ejemplo: 2 horas = {
            money(Math.max(tariff.minimum, 2 * tariff.hour))
          }.
        </Muted>
        <Muted>
          Los minutos de gracia están configurados,
          pero todavía no se aplican al cobro real de salida.
        </Muted>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  label: {
    color: C.text,
    fontWeight: "700",
    marginBottom: 7
  },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.background,
    borderRadius: 10,
    padding: 13,
    marginBottom: 15,
    color: C.text
  }
});