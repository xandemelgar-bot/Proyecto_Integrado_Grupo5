
import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useParking } from "../../contexts/ParkingContext";

const BLUE = "#2563EB";

export default function PaymentScreen({ navigation, route }) {
  const { reservations, payments, pay } = useParking();

  const [selected, setSelected] = useState(
    route?.params?.reservationId || null
  );

  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const pending = reservations.filter(
    (r) =>
      r.status === "activa" &&
      !payments.some((p) => p.reservationId === r.id)
  );

  const reservation = pending.find(
    (r) => r.id === selected
  );

  // Solo admite números de demostración.
  // Nunca se envían datos de tarjeta a Firebase.
  const formatNumero = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setNumero(formatted);
  };

  const formatFecha = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length > 2) {
      setVencimiento(
        `${digits.slice(0, 2)}/${digits.slice(2)}`
      );
    } else {
      setVencimiento(digits);
    }
  };


  const confirmarPago = async () => {
    if (!reservation) {
      Alert.alert(
        "Error",
        "Selecciona una reserva."
      );
      return;
    }

    const numeroLimpio = numero.replace(/\s/g, "");
    const nombreLimpio = titular.trim();

    // Validar que los campos estén completos
    if (
      !numeroLimpio ||
      !nombreLimpio ||
      !vencimiento ||
      !cvv
    ) {
      Alert.alert(
        "Campos incompletos",
        "Completa todos los datos de la tarjeta ficticia."
      );
      return;
    }

    // Validar formato del número
    if (!/^\d{16}$/.test(numeroLimpio)) {
      Alert.alert(
        "Número inválido",
        "Ingresa 16 dígitos ficticios."
      );
      return;
    }

    // Validar fecha
    const match = vencimiento.match(/^(\d{2})\/(\d{2})$/);

    if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
      Alert.alert(
        "Fecha inválida",
        "Utiliza el formato MM/AA."
      );
      return;
    }

    // Validar código de prueba
    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert(
        "Código inválido",
        "Ingresa tres dígitos ficticios."
      );
      return;
    }

    try {
      setLoading(true);

      const resultado = await pay(reservation.id);

      if (resultado) {
        setNumero("");
        setTitular("");
        setVencimiento("");
        setCvv("");
        setSelected(null);

        Alert.alert(
          "Pago simulado completado",
          "La transacción de demostración se registró correctamente."
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo registrar el pago."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un problema al procesar la simulación."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Método de pago</Text>
        <Text style={styles.subtitle}>
          Selecciona una reserva y realiza un pago de prueba
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Reservas pendientes
          </Text>

          {pending.length === 0 ? (
            <Text style={styles.muted}>
              No tienes pagos pendientes.
            </Text>
          ) : (
            pending.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.reservation,
                  selected === r.id && styles.selected,
                ]}
                onPress={() => setSelected(r.id)}
              >
                <View>
                  <Text style={styles.reservationTitle}>
                    Espacio {r.spaceId}
                  </Text>
                  <Text style={styles.muted}>
                    {r.hours} hora(s)
                  </Text>
                </View>

                <Text style={styles.amount}>
                  Q{Number(r.amount).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {reservation && (
          <>
            <View style={styles.demoCard}>
              <View style={styles.demoHeader}>
                <Ionicons
                  name="card-outline"
                  size={30}
                  color="#FFFFFF"
                />
                <Text style={styles.demoLabel}>
                  TARJETA DEMO
                </Text>
              </View>

              <Text style={styles.demoNumber}>
                •••• •••• •••• 4242
              </Text>

              <Text style={styles.demoName}>
                USUARIO DEMO
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Datos de tarjeta
              </Text>

              <Text style={styles.warning}>
                Usa únicamente estos datos ficticios:
                {"\n"}4242 4242 4242 4242
                {"\n"}USUARIO DEMO
                {"\n"}12/30 · CVV 123
              </Text>

              <Text style={styles.label}>
                Número de tarjeta
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                keyboardType="number-pad"
                value={numero}
                onChangeText={formatNumero}
                maxLength={19}
              />

              <Text style={styles.label}>
                Nombre del titular
              </Text>
              <TextInput
                style={styles.input}
                placeholder="USUARIO DEMO"
                autoCapitalize="characters"
                value={titular}
                onChangeText={setTitular}
              />

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>
                    Vencimiento
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    keyboardType="number-pad"
                    value={vencimiento}
                    onChangeText={formatFecha}
                    maxLength={5}
                  />
                </View>

                <View style={styles.half}>
                  <Text style={styles.label}>
                    CVV ficticio
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="number-pad"
                    secureTextEntry
                    value={cvv}
                    onChangeText={(v) =>
                      setCvv(v.replace(/\D/g, "").slice(0, 3))
                    }
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.summary}>
                <Text style={styles.muted}>
                  Espacio {reservation.spaceId}
                </Text>

                <Text style={styles.muted}>
                  {reservation.hours} hora(s)
                </Text>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Total a pagar
                  </Text>
                  <Text style={styles.total}>
                    Q{Number(reservation.amount).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.payButton,
                  loading && { opacity: 0.6 },
                ]}
                onPress={confirmarPago}
                disabled={loading}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />
                <Text style={styles.payText}>
                  {loading
                    ? "Procesando..."
                    : "Confirmar pago simulado"}
                </Text>
              </TouchableOpacity>

              <View style={styles.security}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#64748B"
                />
                <Text style={styles.securityText}>
                  No se realiza ningún cobro real
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
    paddingBottom: 45,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#17243B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17243B",
    marginBottom: 15,
  },
  reservation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  selected: {
    borderColor: BLUE,
    backgroundColor: "#EFF6FF",
  },
  reservationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17243B",
  },
  muted: {
    color: "#64748B",
    fontSize: 13,
  },
  amount: {
    color: BLUE,
    fontWeight: "800",
    fontSize: 16,
  },
  demoCard: {
    backgroundColor: BLUE,
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
  },
  demoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demoLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  demoNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    marginTop: 28,
    marginBottom: 20,
    letterSpacing: 2,
  },
  demoName: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  warning: {
    color: "#475569",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    lineHeight: 21,
  },
  label: {
    color: "#334155",
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: "#17243B",
    marginBottom: 17,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  summary: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    gap: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 12,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17243B",
  },
  total: {
    fontSize: 22,
    fontWeight: "800",
    color: BLUE,
  },
  payButton: {
    backgroundColor: BLUE,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  payText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  security: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  securityText: {
    color: "#64748B",
    fontSize: 12,
  },
});
