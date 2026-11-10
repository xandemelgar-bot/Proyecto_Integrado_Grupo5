
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useParking } from "../../contexts/ParkingContext";

const BLUE = "#2563EB";


export default function PaymentScreen({ navigation, route }) {
  const { usuario } = useAuth();
  const { reservations, payments, pay } = useParking();

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedReservation, setSelectedReservation] =
    useState(route?.params?.reservationId || null);

  const [showForm, setShowForm] = useState(false);
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);

  // =====================================
  // CARGAR TARJETAS DE LA CUENTA ACTUAL
  // =====================================

  useEffect(() => {
    setCards([]);
    setSelectedCard(null);
    setLoadingCards(true);
    setShowForm(false);

    if (!usuario?.uid) {
      setLoadingCards(false);
      return;
    }

    const consulta = query(
      collection(db, "tarjetasDemo"),
      where("userId", "==", usuario.uid)
    );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        lista.sort((a, b) =>
          a.predeterminada === b.predeterminada
            ? 0
            : a.predeterminada
              ? -1
              : 1
        );

        setCards(lista);

        setSelectedCard((actual) => {
          if (lista.some((c) => c.id === actual)) {
            return actual;
          }

          return (
            lista.find((c) => c.predeterminada)?.id ||
            lista[0]?.id ||
            null
          );
        });

        setLoadingCards(false);
      },
      (error) => {
        console.log("Error tarjetas:", error);
        setLoadingCards(false);
        Alert.alert(
          "Error",
          "No se pudieron cargar las tarjetas."
        );
      }
    );

    return unsubscribe;
  }, [usuario?.uid]);

  const pendientes = reservations.filter(
    (r) =>
      r.status === "activa" &&
      !payments.some((p) => p.reservationId === r.id)
  );

  const reserva = pendientes.find(
    (r) => r.id === selectedReservation
  );

  // =====================================
  // FORMATO DE CAMPOS
  // =====================================

  const formatNumero = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);

    setNumero(
      digits.replace(/(.{4})/g, "$1 ").trim()
    );
  };

  const formatFecha = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    setVencimiento(
      digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits
    );
  };

  const limpiarFormulario = () => {
    setNumero("");
    setTitular("");
    setVencimiento("");
    setCvv("");
    setShowForm(false);
    setSaveCard(true);
  };

  // =====================================
  // GUARDAR TARJETA
  // =====================================

  const agregarTarjeta = async () => {
    if (!usuario?.uid || loading) return;

    const numeroLimpio = numero.replace(/\s/g, "");
    const nombreLimpio = titular.trim();

    if (
      !numeroLimpio ||
      !nombreLimpio ||
      !vencimiento ||
      !cvv
    ) {
      Alert.alert(
        "Campos incompletos",
        "Completa todos los datos."
      );
      return;
    }

    // Para evitar capturar tarjetas reales,
    // se utiliza un número público de prueba.
    if (!/^\d{16}$/.test(numeroLimpio)) {
      Alert.alert(
        "Número inválido",
        "Ingresa 16 dígitos."
      );
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert(
        "Código inválido",
        "Ingresa un código de 3 dígitos."
      );
      return;
    }


    const match = vencimiento.match(
      /^(\d{2})\/(\d{2})$/
    );

    if (
      !match ||
      Number(match[1]) < 1 ||
      Number(match[1]) > 12
    ) {
      Alert.alert(
        "Fecha inválida",
        "Utiliza el formato MM/AA."
      );
      return;
    }

    try {
      setLoading(true);

      if (saveCard) {
        const referencia = await addDoc(
          collection(db, "tarjetasDemo"),
          {
            userId: usuario.uid,
            alias: "Mi tarjeta",
            titular: nombreLimpio,
            ultimos4: numeroLimpio.slice(-4),
            vencimiento,
            predeterminada: cards.length === 0,
          }
        );

        setSelectedCard(referencia.id);
      } else {
        Alert.alert(
          "Tarjeta validada",
          "La tarjeta de demostración no se guardó. Para utilizarla nuevamente tendrás que introducir sus datos."
        );
      }

      limpiarFormulario();

      if (saveCard) {
        Alert.alert(
          "Tarjeta guardada",
          "Tu método de pago se agregó correctamente."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "No se pudo guardar la tarjeta."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CAMBIAR TARJETA PREDETERMINADA
  // =====================================

  const establecerPredeterminada = async (cardId) => {
    if (!usuario?.uid || loading) return;

    try {
      setLoading(true);

      const batch = writeBatch(db);

      cards.forEach((card) => {
        batch.update(
          doc(db, "tarjetasDemo", card.id),
          {
            predeterminada: card.id === cardId,
          }
        );
      });

      await batch.commit();
      setSelectedCard(cardId);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "No se pudo cambiar la tarjeta."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // ELIMINAR TARJETA
  // =====================================

  const eliminarTarjeta = (card) => {
    Alert.alert(
      "Eliminar tarjeta",
      "¿Deseas eliminar este método de pago?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              const restantes = cards.filter(
                (c) => c.id !== card.id
              );

              const batch = writeBatch(db);

              batch.delete(
                doc(db, "tarjetasDemo", card.id)
              );

              if (
                card.predeterminada &&
                restantes.length > 0
              ) {
                batch.update(
                  doc(db, "tarjetasDemo", restantes[0].id),
                  { predeterminada: true }
                );
              }

              await batch.commit();
            } catch (error) {
              console.log(error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la tarjeta."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // =====================================
  // PAGO SIMULADO
  // =====================================

  const confirmarPago = async () => {
    if (!reserva) {
      Alert.alert(
        "Selecciona una reserva",
        "Debes seleccionar una reserva pendiente."
      );
      return;
    }

    if (!cards.some((c) => c.id === selectedCard)) {
      Alert.alert(
        "Selecciona una tarjeta",
        "Selecciona un método de pago guardado."
      );
      return;
    }

    try {
      setLoading(true);

      const resultado = await pay(reserva.id);

      if (resultado) {
        setSelectedReservation(null);

        Alert.alert(
          "Pago completado",
          "Tu pago simulado se registró correctamente."
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo completar el pago."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un problema con el pago."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INTERFAZ
  // =====================================


  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            Métodos de pago
          </Text>

          <Text style={styles.headerSubtitle}>
            Administra tus tarjetas y pagos
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            Métodos de pago
          </Text>

          <Text style={styles.subtitle}>
            Administra tus tarjetas y paga tus reservas
          </Text>

          {/* RESERVACIONES */}

          <View style={styles.panel}>
            <Text style={styles.heading}>
              Reservas pendientes
            </Text>

            {pendientes.length === 0 ? (
              <Text style={styles.muted}>
                No tienes pagos pendientes.
              </Text>
            ) : (
              pendientes.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.option,
                    selectedReservation === r.id &&
                    styles.selected,
                  ]}
                  onPress={() =>
                    setSelectedReservation(r.id)
                  }
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>
                      Espacio {r.spaceId}
                    </Text>

                    <Text style={styles.muted}>
                      {r.hours} hora(s)
                    </Text>
                  </View>

                  <Text style={styles.price}>
                    Q{Number(r.amount).toFixed(2)}
                  </Text>

                  <Ionicons
                    name={
                      selectedReservation === r.id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={22}
                    color={BLUE}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* TARJETAS GUARDADAS */}

          <View style={styles.panel}>
            <Text style={styles.heading}>
              Mis tarjetas
            </Text>

            {loadingCards ? (
              <ActivityIndicator color={BLUE} />
            ) : cards.length === 0 ? (
              <Text style={styles.muted}>
                Todavía no tienes tarjetas guardadas.
              </Text>
            ) : (
              cards.map((card) => (
                <View
                  key={card.id}
                  style={styles.cardRow}
                >
                  <TouchableOpacity
                    style={styles.cardSelection}
                    onPress={() =>
                      setSelectedCard(card.id)
                    }
                  >
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="card-outline"
                        size={24}
                        color={BLUE}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionTitle}>
                        {card.alias} •••• {card.ultimos4}
                      </Text>

                      <Text style={styles.muted}>
                        Vence {card.vencimiento}
                      </Text>

                      {card.predeterminada && (
                        <Text style={styles.defaultText}>
                          Predeterminada
                        </Text>
                      )}
                    </View>

                    <Ionicons
                      name={
                        selectedCard === card.id
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={23}
                      color={BLUE}
                    />
                  </TouchableOpacity>

                  <View style={styles.actions}>
                    {!card.predeterminada && (
                      <TouchableOpacity
                        disabled={loading}
                        onPress={() =>
                          establecerPredeterminada(card.id)
                        }
                      >
                        <Text style={styles.actionText}>
                          Predeterminada
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      disabled={loading}
                      onPress={() =>
                        eliminarTarjeta(card)
                      }
                    >
                      <Text style={styles.deleteText}>
                        Eliminar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                setShowForm(!showForm)
              }
            >
              <Ionicons
                name={
                  showForm
                    ? "close-circle-outline"
                    : "add-circle-outline"
                }
                size={23}
                color={BLUE}
              />

              <Text style={styles.addText}>
                {showForm
                  ? "Cancelar"
                  : "Agregar tarjeta"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FORMULARIO */}

          {showForm && (
            <View style={styles.panel}>
              <Text style={styles.heading}>
                Agregar tarjeta
              </Text>

              <Text style={styles.label}>
                Número de tarjeta
              </Text>

              <View style={styles.inputIcon}>
                <Ionicons
                  name="card-outline"
                  size={22}
                  color="#64748B"
                />

                <TextInput
                  style={styles.flexInput}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="number-pad"
                  value={numero}
                  onChangeText={formatNumero}
                  maxLength={19}
                />
              </View>

              <Text style={styles.label}>
                Nombre del titular
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Como aparece en la tarjeta"
                autoCapitalize="characters"
                value={titular}
                onChangeText={setTitular}
                maxLength={60}
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
                    CVV
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="•••"
                    keyboardType="number-pad"
                    secureTextEntry
                    value={cvv}
                    onChangeText={(value) =>
                      setCvv(
                        value.replace(/\D/g, "").slice(0, 3)
                      )
                    }
                    maxLength={3}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkRow}
                onPress={() =>
                  setSaveCard(!saveCard)
                }
              >
                <Ionicons
                  name={
                    saveCard
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={23}
                  color={BLUE}
                />

                <Text style={styles.checkText}>
                  Guardar para futuros pagos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                disabled={loading}
                onPress={agregarTarjeta}
              >
                <Text style={styles.primaryText}>
                  {loading
                    ? "Guardando..."
                    : "Guardar tarjeta"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* RESUMEN */}

          {reserva && (
            <View style={styles.panel}>
              <Text style={styles.heading}>
                Resumen del pago
              </Text>

              <Text style={styles.muted}>
                Espacio {reserva.spaceId}
              </Text>

              <Text style={styles.muted}>
                Duración: {reserva.hours} hora(s)
              </Text>

              <View style={styles.totalRow}>
                <Text style={styles.optionTitle}>
                  Total a pagar
                </Text>

                <Text style={styles.total}>
                  Q{Number(reserva.amount).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                disabled={loading}
                onPress={confirmarPago}
              >
                <Text style={styles.primaryText}>
                  {loading
                    ? "Procesando..."
                    : "Confirmar pago"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.footer}>
                Pago simulado. No se realizan cobros reales.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  content: {
    padding: 18,
    paddingBottom: 45,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 20,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 17,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  muted: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  selected: {
    borderColor: BLUE,
    backgroundColor: "#EFF6FF",
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: BLUE,
  },
  cardRow: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardSelection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 10,
  },
  defaultText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 12,
  },
  actionText: {
    color: BLUE,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
  },
  addText: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 14,
  },
  demoNotice: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  demoNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#475569",
  },
  label: {
    color: "#334155",
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    color: "#1E293B",
    fontSize: 15,
    marginBottom: 16,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  flexInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#1E293B",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  demoHelp: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 14,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  checkText: {
    color: "#334155",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: BLUE,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 14,
    marginTop: 14,
  },
  total: {
    fontSize: 21,
    fontWeight: "800",
    color: BLUE,
  },
  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    marginTop: 13,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#2563EB",
  },

  header: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    padding: 18,
    paddingBottom: 45,
  },

});
