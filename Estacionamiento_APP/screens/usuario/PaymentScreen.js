
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
  StatusBar
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch
} from "firebase/firestore";

import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useParking } from "../../contexts/ParkingContext";

const BLUE = "#0964D5";

// ==========================================
// COMPONENTES VISUALES
// ==========================================

function SectionTitle({ icon, title, subtitle }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={BLUE}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={s.sectionSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function PrimaryButton({
  title,
  icon,
  onPress,
  disabled,
  loading
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        s.primaryWrapper,
        (disabled || loading) && s.disabledButton
      ]}
    >
      <LinearGradient
        colors={["#2585FF", "#0754C9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.primaryButton}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons
              name={icon}
              size={21}
              color="#FFFFFF"
            />
            <Text style={s.primaryText}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ==========================================
// PANTALLA DE PAGOS
// ==========================================

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

  // ==========================================
  // CARGAR TARJETAS DEL USUARIO
  // ==========================================

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
      snapshot => {
        const lista = snapshot.docs.map(item => ({
          id: item.id,
          ...item.data()
        }));

        lista.sort((a, b) =>
          a.predeterminada === b.predeterminada
            ? 0
            : a.predeterminada
              ? -1
              : 1
        );

        setCards(lista);

        setSelectedCard(actual => {
          if (lista.some(c => c.id === actual)) {
            return actual;
          }

          return (
            lista.find(c => c.predeterminada)?.id ||
            lista[0]?.id ||
            null
          );
        });

        setLoadingCards(false);
      },
      error => {
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

  // ==========================================
  // RESERVAS PENDIENTES
  // ==========================================

  const pendientes = reservations.filter(
    r =>
      r.status === "activa" &&
      !payments.some(p => p.reservationId === r.id)
  );

  const reserva = pendientes.find(
    r => r.id === selectedReservation
  );

  // ==========================================
  // FORMATO DE CAMPOS
  // ==========================================

  const formatNumero = value => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 16);

    setNumero(
      digits.replace(/(.{4})/g, "$1 ").trim()
    );
  };

  const formatFecha = value => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 4);

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

  // ==========================================
  // AGREGAR TARJETA
  // ==========================================

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
      return Alert.alert(
        "Campos incompletos",
        "Completa todos los datos."
      );
    }

    if (!/^\d{16}$/.test(numeroLimpio)) {
      return Alert.alert(
        "Número inválido",
        "Ingresa 16 dígitos."
      );
    }

    if (!/^\d{3}$/.test(cvv)) {
      return Alert.alert(
        "Código inválido",
        "Ingresa un código de 3 dígitos."
      );
    }

    const match = vencimiento.match(
      /^(\d{2})\/(\d{2})$/
    );

    if (
      !match ||
      Number(match[1]) < 1 ||
      Number(match[1]) > 12
    ) {
      return Alert.alert(
        "Fecha inválida",
        "Utiliza el formato MM/AA."
      );
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
            predeterminada: cards.length === 0
          }
        );

        setSelectedCard(referencia.id);

        Alert.alert(
          "Tarjeta guardada",
          "Tu método de pago se agregó correctamente."
        );
      } else {
        Alert.alert(
          "Tarjeta validada",
          "La tarjeta de demostración no se guardó. Para utilizarla nuevamente tendrás que introducir sus datos."
        );
      }

      limpiarFormulario();
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

  // ==========================================
  // CAMBIAR TARJETA PREDETERMINADA
  // ==========================================

  const establecerPredeterminada = async cardId => {
    if (!usuario?.uid || loading) return;

    try {
      setLoading(true);

      const batch = writeBatch(db);

      cards.forEach(card => {
        batch.update(
          doc(db, "tarjetasDemo", card.id),
          {
            predeterminada: card.id === cardId
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

  // ==========================================
  // ELIMINAR TARJETA
  // ==========================================

  const eliminarTarjeta = card => {
    Alert.alert(
      "Eliminar tarjeta",
      "¿Deseas eliminar este método de pago?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              const restantes = cards.filter(
                c => c.id !== card.id
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
                  doc(
                    db,
                    "tarjetasDemo",
                    restantes[0].id
                  ),
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
          }
        }
      ]
    );
  };

  // ==========================================
  // CONFIRMAR PAGO SIMULADO
  // ==========================================

  const confirmarPago = async () => {
    if (loading) return;

    if (!reserva) {
      return Alert.alert(
        "Selecciona una reserva",
        "Debes seleccionar una reserva pendiente."
      );
    }

    if (!cards.some(c => c.id === selectedCard)) {
      return Alert.alert(
        "Selecciona una tarjeta",
        "Selecciona un método de pago guardado."
      );
    }

    try {
      setLoading(true);


      const resultado = await pay(reserva.id);

      if (!resultado.ok) {
        Alert.alert(
          "No se pudo completar el pago",
          resultado.message ||
          "Ocurrió un error al procesar el pago."
        );
        return;
      }

      Alert.alert(
        "Pago realizado",
        "Tu pago simulado se registró correctamente."
      );
    } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Ocurrió un problema con el pago."
    );
  } finally {
    setLoading(false);
  }
};

// ==========================================
// INTERFAZ
// ==========================================

return (
  <SafeAreaView
    style={s.safe}
    edges={["top", "bottom"]}
  >
    <StatusBar
      barStyle="light-content"
      backgroundColor="#0754BD"
    />

    <KeyboardAvoidingView
      style={s.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ==================================
              ENCABEZADO
          ================================== */}

        <LinearGradient
          colors={[
            "#0648AE",
            "#0964D5",
            "#328FF4"
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.circleOne} />
          <View style={s.circleTwo} />

          <View style={s.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={s.backButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={s.headerText}>
              <Text style={s.headerTitle}>
                Métodos de pago
              </Text>

              <Text style={s.headerSubtitle}>
                Administra tus tarjetas y pagos
              </Text>
            </View>

            <View style={s.heroIcon}>
              <Ionicons
                name="card-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroDescription}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={s.heroDescriptionText}>
              Gestiona tus métodos de pago
              y reservaciones pendientes.
            </Text>
          </View>

          <View
            style={s.headerWave}
            pointerEvents="none"
          >
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 400 80"
              preserveAspectRatio="none"
            >
              <Path
                d="M0 30 C120 85 250 0 400 35 L400 80 L0 80 Z"
                fill="#8DC4FF"
                opacity={0.55}
              />
              <Path
                d="M0 55 C140 10 265 95 400 40 L400 80 L0 80 Z"
                fill="#EAF4FF"
                opacity={0.95}
              />
            </Svg>
          </View>
        </LinearGradient>

        <View style={s.content}>
          {/* ==================================
                RESERVAS PENDIENTES
            ================================== */}

          <View style={s.panel}>
            <SectionTitle
              icon="calendar-outline"
              title="Reservas pendientes"
              subtitle="Selecciona la reserva que deseas pagar"
            />

            {pendientes.length === 0 ? (
              <View style={s.emptyBox}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={30}
                  color="#16A34A"
                />

                <Text style={s.emptyText}>
                  No tienes pagos pendientes.
                </Text>
              </View>
            ) : (
              pendientes.map(r => {
                const selected =
                  selectedReservation === r.id;

                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() =>
                      setSelectedReservation(r.id)
                    }
                    activeOpacity={0.8}
                    style={[
                      s.reservationOption,
                      selected && s.optionSelected
                    ]}
                  >
                    <View style={s.reservationIcon}>
                      <Ionicons
                        name="car-sport"
                        size={25}
                        color={BLUE}
                      />
                    </View>

                    <View style={s.optionInfo}>
                      <Text style={s.optionTitle}>
                        Espacio {r.spaceId}
                      </Text>

                      <Text style={s.optionSubtitle}>
                        {r.hours} hora(s)
                      </Text>
                    </View>

                    <View style={s.optionRight}>
                      <Text style={s.price}>
                        Q{Number(r.amount).toFixed(2)}
                      </Text>

                      <Ionicons
                        name={
                          selected
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={22}
                        color={BLUE}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* ==================================
                TARJETAS GUARDADAS
            ================================== */}

          <View style={s.panel}>
            <SectionTitle
              icon="wallet-outline"
              title="Mis tarjetas"
              subtitle="Métodos de pago de tu cuenta"
            />

            {loadingCards ? (
              <ActivityIndicator
                color={BLUE}
                style={{ marginVertical: 20 }}
              />
            ) : cards.length === 0 ? (
              <View style={s.emptyBox}>
                <Ionicons
                  name="card-outline"
                  size={31}
                  color="#8BA9D0"
                />

                <Text style={s.emptyText}>
                  Todavía no tienes tarjetas guardadas.
                </Text>
              </View>
            ) : (
              cards.map(card => {
                const selected =
                  selectedCard === card.id;

                return (
                  <View
                    key={card.id}
                    style={[
                      s.savedCard,
                      selected && s.savedCardSelected
                    ]}
                  >
                    <TouchableOpacity
                      style={s.cardSelection}
                      onPress={() =>
                        setSelectedCard(card.id)
                      }
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[
                          "#1673E8",
                          "#0754C9"
                        ]}
                        style={s.cardIcon}
                      >
                        <Ionicons
                          name="card-outline"
                          size={24}
                          color="#FFFFFF"
                        />
                      </LinearGradient>

                      <View style={s.optionInfo}>
                        <Text style={s.optionTitle}>
                          {card.alias} •••• {card.ultimos4}
                        </Text>

                        <Text style={s.optionSubtitle}>
                          Vence {card.vencimiento}
                        </Text>

                        {card.predeterminada && (
                          <View style={s.defaultBadge}>
                            <Ionicons
                              name="checkmark-circle"
                              size={13}
                              color="#15803D"
                            />
                            <Text style={s.defaultText}>
                              Predeterminada
                            </Text>
                          </View>
                        )}
                      </View>

                      <Ionicons
                        name={
                          selected
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={23}
                        color={BLUE}
                      />
                    </TouchableOpacity>

                    <View style={s.cardActions}>
                      {!card.predeterminada && (
                        <TouchableOpacity
                          disabled={loading}
                          onPress={() =>
                            establecerPredeterminada(card.id)
                          }
                          style={s.defaultAction}
                        >
                          <Ionicons
                            name="star-outline"
                            size={16}
                            color={BLUE}
                          />
                          <Text style={s.defaultActionText}>
                            Predeterminada
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        disabled={loading}
                        onPress={() =>
                          eliminarTarjeta(card)
                        }
                        style={s.deleteAction}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#DC2626"
                        />
                        <Text style={s.deleteActionText}>
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}

            {/* AGREGAR TARJETA */}

            <TouchableOpacity
              onPress={() =>
                setShowForm(!showForm)
              }
              activeOpacity={0.8}
              style={s.addButton}
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

              <Text style={s.addText}>
                {showForm
                  ? "Cancelar"
                  : "Agregar tarjeta"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ==================================
                FORMULARIO DE TARJETA
            ================================== */}

          {showForm && (
            <View style={s.panel}>
              <SectionTitle
                icon="add-circle-outline"
                title="Agregar tarjeta"
                subtitle="Introduce los datos de demostración"
              />

              <View style={s.demoNotice}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={BLUE}
                />

                <Text style={s.demoNoticeText}>
                  Esta pantalla es una simulación.
                  No ingreses datos de tarjetas reales.
                </Text>
              </View>

              <Text style={s.label}>
                Número de tarjeta
              </Text>

              <View style={s.inputIcon}>
                <Ionicons
                  name="card-outline"
                  size={22}
                  color="#6486B3"
                />

                <TextInput
                  style={s.flexInput}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#9BB0CA"
                  keyboardType="number-pad"
                  value={numero}
                  onChangeText={formatNumero}
                  maxLength={19}
                />
              </View>

              <Text style={s.label}>
                Nombre del titular
              </Text>

              <View style={s.inputIcon}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#6486B3"
                />

                <TextInput
                  style={s.flexInput}
                  placeholder="Como aparece en la tarjeta"
                  placeholderTextColor="#9BB0CA"
                  autoCapitalize="characters"
                  value={titular}
                  onChangeText={setTitular}
                  maxLength={60}
                />
              </View>

              <View style={s.formRow}>
                <View style={s.half}>
                  <Text style={s.label}>
                    Vencimiento
                  </Text>

                  <View style={s.inputIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#6486B3"
                    />

                    <TextInput
                      style={s.flexInput}
                      placeholder="MM/AA"
                      placeholderTextColor="#9BB0CA"
                      keyboardType="number-pad"
                      value={vencimiento}
                      onChangeText={formatFecha}
                      maxLength={5}
                    />
                  </View>
                </View>

                <View style={s.half}>
                  <Text style={s.label}>
                    CVV
                  </Text>

                  <View style={s.inputIcon}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#6486B3"
                    />

                    <TextInput
                      style={s.flexInput}
                      placeholder="•••"
                      placeholderTextColor="#9BB0CA"
                      keyboardType="number-pad"
                      secureTextEntry
                      value={cvv}
                      onChangeText={value =>
                        setCvv(
                          value
                            .replace(/\D/g, "")
                            .slice(0, 3)
                        )
                      }
                      maxLength={3}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={s.checkRow}
                onPress={() =>
                  setSaveCard(!saveCard)
                }
                activeOpacity={0.8}
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

                <Text style={s.checkText}>
                  Guardar para futuros pagos
                </Text>
              </TouchableOpacity>

              <PrimaryButton
                title={
                  saveCard
                    ? "Guardar tarjeta"
                    : "Validar tarjeta"
                }
                icon="checkmark-circle-outline"
                onPress={agregarTarjeta}
                disabled={loading}
                loading={loading}
              />
            </View>
          )}

          {/* ==================================
                RESUMEN DEL PAGO
            ================================== */}

          {reserva && (
            <View style={s.panel}>
              <SectionTitle
                icon="receipt-outline"
                title="Resumen del pago"
                subtitle="Revisa tu reservación"
              />

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Espacio
                </Text>

                <Text style={s.summaryValue}>
                  {reserva.spaceId}
                </Text>
              </View>

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Duración
                </Text>

                <Text style={s.summaryValue}>
                  {reserva.hours} hora(s)
                </Text>
              </View>

              <LinearGradient
                colors={[
                  "#EAF4FF",
                  "#DCEBFF"
                ]}
                style={s.totalBox}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.totalLabel}>
                    Total a pagar
                  </Text>

                  <Text style={s.totalHint}>
                    Importe de la reserva
                  </Text>
                </View>

                <Text style={s.totalAmount}>
                  Q{Number(reserva.amount).toFixed(2)}
                </Text>
              </LinearGradient>

              <PrimaryButton
                title="Confirmar pago"
                icon="shield-checkmark-outline"
                onPress={confirmarPago}
                disabled={
                  loading ||
                  !cards.some(
                    c => c.id === selectedCard
                  )
                }
                loading={loading}
              />

              <View style={s.footerNotice}>
                <Ionicons
                  name="information-circle-outline"
                  size={17}
                  color="#7891B1"
                />

                <Text style={s.footerText}>
                  Pago simulado. No se realizan
                  cobros reales.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ==================================
              ONDAS INFERIORES
          ================================== */}

        <View
          style={s.bottomWaves}
          pointerEvents="none"
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 400 110"
            preserveAspectRatio="none"
          >
            <Path
              d="M0 35 C100 0 220 110 400 35 L400 110 L0 110 Z"
              fill="#B8D9FF"
              opacity={0.8}
            />

            <Path
              d="M0 70 C135 15 255 135 400 50 L400 110 L0 110 Z"
              fill="#7DBAFF"
              opacity={0.8}
            />

            <Path
              d="M0 100 C130 55 250 135 400 75 L400 110 L0 110 Z"
              fill="#459AF5"
              opacity={0.75}
            />
          </Svg>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

// ==========================================
// ESTILOS
// ==========================================

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0754BD"
  },

  container: {
    flex: 1,
    backgroundColor: "#EAF4FF"
  },

  scrollContent: {
    flexGrow: 1
  },

  // ENCABEZADO

  hero: {
    height: 185,
    paddingTop: 22,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative"
  },

  circleOne: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -130,
    right: -75
  },

  circleTwo: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.06)",
    left: -100,
    top: 35
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 2
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  headerText: {
    flex: 1
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900"
  },

  headerSubtitle: {
    color: "#DCEBFF",
    fontSize: 12,
    marginTop: 4
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  heroDescription: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginTop: 23,
    paddingHorizontal: 5,
    maxWidth: 340
  },

  heroDescriptionText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    flex: 1
  },

  headerWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70
  },

  // CONTENIDO

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    flexGrow: 1
  },

  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: "#E2ECFA",
    elevation: 3,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.08,
    shadowRadius: 10
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18
  },

  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    alignItems: "center",
    justifyContent: "center"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#102A55"
  },

  sectionSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16
  },

  // RESERVACIONES

  reservationOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E2ECFA",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10
  },

  optionSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1673E8"
  },

  reservationIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    alignItems: "center",
    justifyContent: "center"
  },

  optionInfo: {
    flex: 1,
    minWidth: 0
  },

  optionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#102A55"
  },

  optionSubtitle: {
    fontSize: 11,
    color: "#7891B1",
    marginTop: 5
  },

  optionRight: {
    alignItems: "flex-end",
    gap: 7
  },

  price: {
    color: "#0754BD",
    fontSize: 15,
    fontWeight: "900"
  },

  // TARJETAS

  savedCard: {
    borderWidth: 1,
    borderColor: "#E2ECFA",
    borderRadius: 15,
    padding: 12,
    marginBottom: 11,
    backgroundColor: "#F8FBFF"
  },

  savedCardSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1673E8"
  },

  cardSelection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  cardIcon: {
    width: 47,
    height: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },

  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 7,
    backgroundColor: "#DDF7E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9
  },

  defaultText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800"
  },

  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "#E2ECFA"
  },

  defaultAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E5F0FF",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10
  },

  defaultActionText: {
    color: BLUE,
    fontSize: 11,
    fontWeight: "800"
  },

  deleteAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFF1F1",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10
  },

  deleteActionText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "800"
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#9FC8FF",
    backgroundColor: "#F0F7FF",
    borderRadius: 14,
    minHeight: 53,
    marginTop: 7
  },

  addText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: "800"
  },

  // FORMULARIO

  demoNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20
  },

  demoNoticeText: {
    flex: 1,
    color: "#547095",
    fontSize: 11,
    lineHeight: 17
  },

  label: {
    color: "#24436C",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8
  },

  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#D8E5F5",
    backgroundColor: "#F8FBFF",
    borderRadius: 13,
    paddingHorizontal: 12,
    minHeight: 53,
    marginBottom: 17
  },

  flexInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
    color: "#102A55",
    fontSize: 13
  },

  formRow: {
    flexDirection: "row",
    gap: 12
  },

  half: {
    flex: 1,
    minWidth: 0
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 17,
    marginTop: 3
  },

  checkText: {
    color: "#365D92",
    fontSize: 13,
    fontWeight: "600",
    flex: 1
  },

  // BOTÓN PRINCIPAL

  primaryWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 5
  },

  primaryButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 12
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },

  disabledButton: {
    opacity: 0.5
  },

  // RESUMEN

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 14
  },

  summaryLabel: {
    color: "#64748B",
    fontSize: 13
  },

  summaryValue: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "800"
  },

  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    marginBottom: 17,
    marginTop: 6
  },

  totalLabel: {
    color: "#365D92",
    fontSize: 12,
    fontWeight: "700"
  },

  totalHint: {
    color: "#7891B1",
    fontSize: 10,
    marginTop: 4
  },

  totalAmount: {
    color: "#0754BD",
    fontSize: 21,
    fontWeight: "900"
  },

  footerNotice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 15
  },

  footerText: {
    color: "#7891B1",
    fontSize: 11,
    textAlign: "center",
    flexShrink: 1
  },

  // ESTADOS VACÍOS

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F9FF",
    borderRadius: 14,
    padding: 22,
    gap: 10
  },

  emptyText: {
    color: "#7891B1",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18
  },

  // ONDAS INFERIORES

  bottomWaves: {
    height: 105,
    width: "100%",
    marginTop: "auto",
    justifyContent: "flex-end",
    flexShrink: 0
  }
});
