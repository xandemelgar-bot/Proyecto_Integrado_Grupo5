
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { useParking } from "../../contexts/ParkingContext";
import { money } from "../../components/UI";

// ==========================================
// PANTALLA DE RESERVACIONES
// ==========================================

export default function ReservationScreen({ navigation, route }) {
  const { spaces, tariff, reserve } = useParking();

  // ==========================================
  // ESTADOS ORIGINALES
  // ==========================================

  const [spaceId, setSpaceId] = useState(
    route?.params?.spaceId || null
  );

  const [hours, setHours] = useState(1);

  // Estado visual para evitar pulsaciones repetidas
  const [loading, setLoading] = useState(false);

  // ==========================================
  // DATOS ORIGINALES
  // ==========================================

  const free = spaces.filter(
    s => s.estado === "libre"
  );

  const selected = spaces.find(
    s => s.id === spaceId
  );

  const estimatedAmount = Math.max(
    tariff.minimum,
    tariff.hour * hours
  );

  // ==========================================
  // LÓGICA DE RESERVACIÓN
  // ==========================================

  const submit = async () => {
    if (loading) return;

    if (!spaceId) {
      return Alert.alert(
        "Selecciona un espacio",
        "Elige un espacio disponible."
      );
    }

    try {
      setLoading(true);

      const result = await reserve(spaceId, hours);

      if (!result.ok) {
        return Alert.alert(
          "No disponible",
          result.message
        );
      }

      Alert.alert(
        "Reserva creada",
        `Espacio ${spaceId} por ${hours} hora(s)`,
        [
          {
            text: "Ver reservas",
            onPress: () =>
              navigation.navigate("MyReservations")
          }
        ]
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

      <View style={s.main}>
        <ScrollView
          style={s.scrollView}
          contentContainerStyle={s.scrollContent}
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
                  Nueva reservación
                </Text>

                <Text style={s.headerSubtitle}>
                  Elige espacio y duración
                </Text>
              </View>

              <View style={s.headerIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View style={s.heroInfo}>
              <Ionicons
                name="car-sport-outline"
                size={24}
                color="#FFFFFF"
              />

              <Text style={s.heroInfoText}>
                Reserva tu espacio de forma rápida
                y sencilla.
              </Text>
            </View>

            {/* ONDAS DEL ENCABEZADO */}

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

          {/* ==================================
              CONTENIDO
          ================================== */}

          <View style={s.content}>
            {/* ==================================
                SELECCIONAR ESPACIO
            ================================== */}

            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.cardIcon}>
                  <Ionicons
                    name="car-sport-outline"
                    size={24}
                    color="#0964D5"
                  />
                </View>

                <View style={s.cardHeaderText}>
                  <Text style={s.cardTitle}>
                    Seleccionar espacio
                  </Text>

                  <Text style={s.cardSubtitle}>
                    Elige un lugar disponible
                  </Text>
                </View>
              </View>

              {/* ESPACIO SELECCIONADO */}

              <View style={s.selectedInfo}>
                <Ionicons
                  name={
                    selected
                      ? "checkmark-circle"
                      : "information-circle-outline"
                  }
                  size={21}
                  color={
                    selected
                      ? "#16A34A"
                      : "#1673E8"
                  }
                />

                <Text style={s.selectedText}>
                  {selected
                    ? `Seleccionado: ${selected.id} (nivel ${selected.nivel})`
                    : "Selecciona uno de los disponibles"}
                </Text>
              </View>

              {/* ESPACIOS LIBRES */}

              {free.length === 0 ? (
                <View style={s.emptyContainer}>
                  <Ionicons
                    name="car-outline"
                    size={35}
                    color="#91A8C6"
                  />

                  <Text style={s.emptyText}>
                    No hay espacios libres.
                  </Text>
                </View>
              ) : (
                [1, 2].map(nivel => {
                  const levelSpaces = free.filter(
                    space => space.nivel === nivel
                  );

                  if (levelSpaces.length === 0) {
                    return null;
                  }

                  return (
                    <View
                      key={nivel}
                      style={s.levelSection}
                    >
                      <View style={s.levelHeader}>
                        <Ionicons
                          name="layers-outline"
                          size={18}
                          color="#1673E8"
                        />

                        <Text style={s.levelTitle}>
                          Nivel {nivel}
                        </Text>

                        <View style={s.levelCount}>
                          <Text style={s.levelCountText}>
                            {levelSpaces.length} libres
                          </Text>
                        </View>
                      </View>

                      <View style={s.spacesGrid}>
                        {levelSpaces.map(space => {
                          const isSelected =
                            spaceId === space.id;

                          return (
                            <TouchableOpacity
                              key={space.id}
                              onPress={() =>
                                setSpaceId(space.id)
                              }
                              activeOpacity={0.8}
                              style={[
                                s.spaceButton,
                                isSelected &&
                                s.spaceButtonSelected
                              ]}
                            >
                              <Ionicons
                                name={
                                  isSelected
                                    ? "checkmark-circle"
                                    : "car-sport"
                                }
                                size={22}
                                color={
                                  isSelected
                                    ? "#FFFFFF"
                                    : "#16A34A"
                                }
                              />

                              <Text
                                style={[
                                  s.spaceText,
                                  isSelected &&
                                  s.spaceTextSelected
                                ]}
                                numberOfLines={1}
                              >
                                {space.id}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* ==================================
                DURACIÓN DE LA RESERVA
            ================================== */}

            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.cardIcon}>
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color="#0964D5"
                  />
                </View>

                <View style={s.cardHeaderText}>
                  <Text style={s.cardTitle}>
                    Duración de la reserva
                  </Text>

                  <Text style={s.cardSubtitle}>
                    Selecciona cuántas horas necesitas
                  </Text>
                </View>
              </View>

              {/* SELECTOR DE HORAS */}

              <View style={s.hoursContainer}>
                <TouchableOpacity
                  onPress={() =>
                    setHours(
                      Math.max(1, hours - 1)
                    )
                  }
                  style={[
                    s.hoursButton,
                    hours === 1 && s.hoursButtonDisabled
                  ]}
                  activeOpacity={0.8}
                  disabled={hours === 1}
                >
                  <Ionicons
                    name="remove"
                    size={25}
                    color={
                      hours === 1
                        ? "#9EB5D1"
                        : "#0964D5"
                    }
                  />
                </TouchableOpacity>

                <View style={s.hoursDisplay}>
                  <Text style={s.hoursNumber}>
                    {hours}
                  </Text>

                  <Text style={s.hoursLabel}>
                    {hours === 1 ? "hora" : "horas"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setHours(
                      Math.min(12, hours + 1)
                    )
                  }
                  style={[
                    s.hoursButton,
                    hours === 12 && s.hoursButtonDisabled
                  ]}
                  activeOpacity={0.8}
                  disabled={hours === 12}
                >
                  <Ionicons
                    name="add"
                    size={25}
                    color={
                      hours === 12
                        ? "#9EB5D1"
                        : "#0964D5"
                    }
                  />
                </TouchableOpacity>
              </View>

              <Text style={s.hoursHint}>
                Mínimo 1 hora · Máximo 12 horas
              </Text>
            </View>

            {/* ==================================
                RESUMEN DE LA RESERVACIÓN
            ================================== */}

            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.cardIcon}>
                  <Ionicons
                    name="receipt-outline"
                    size={24}
                    color="#0964D5"
                  />
                </View>

                <View style={s.cardHeaderText}>
                  <Text style={s.cardTitle}>
                    Resumen de tu reserva
                  </Text>

                  <Text style={s.cardSubtitle}>
                    Revisa los datos antes de confirmar
                  </Text>
                </View>
              </View>

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Espacio
                </Text>

                <Text style={s.summaryValue}>
                  {selected
                    ? selected.id
                    : "Sin seleccionar"}
                </Text>
              </View>

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Nivel
                </Text>

                <Text style={s.summaryValue}>
                  {selected
                    ? selected.nivel
                    : "—"}
                </Text>
              </View>

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Duración
                </Text>

                <Text style={s.summaryValue}>
                  {hours} {hours === 1 ? "hora" : "horas"}
                </Text>
              </View>

              <View style={s.summaryDivider} />

              {/* IMPORTE ESTIMADO */}

              <LinearGradient
                colors={[
                  "#EAF4FF",
                  "#DCEBFF"
                ]}
                style={s.totalContainer}
              >
                <View>
                  <Text style={s.totalLabel}>
                    Importe estimado
                  </Text>

                  <Text style={s.totalHint}>
                    Según la tarifa actual
                  </Text>
                </View>

                <Text style={s.totalAmount}>
                  {money(estimatedAmount)}
                </Text>
              </LinearGradient>

              {/* CONFIRMAR RESERVA */}

              <TouchableOpacity
                onPress={submit}
                disabled={
                  loading ||
                  !spaceId ||
                  selected?.estado !== "libre"
                }
                activeOpacity={0.85}
                style={[
                  s.confirmWrapper,
                  (
                    loading ||
                    !spaceId ||
                    selected?.estado !== "libre"
                  ) && s.confirmDisabled
                ]}
              >
                <LinearGradient
                  colors={[
                    "#2585FF",
                    "#0754C9"
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.confirmButton}
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <View style={s.confirmContent}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={23}
                        color="#FFFFFF"
                      />

                      <Text style={s.confirmText}>
                        Confirmar reserva
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
      </View>
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

  main: {
    flex: 1,
    backgroundColor: "#EAF4FF"
  },

  scrollView: {
    flex: 1
  },

  scrollContent: {
    flexGrow: 1
  },

  // ==========================================
  // ENCABEZADO
  // ==========================================

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

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginTop: 23,
    paddingHorizontal: 6,
    maxWidth: 330
  },

  heroInfoText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19
  },

  headerWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70
  },

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    flexGrow: 1
  },

  // ==========================================
  // TARJETAS
  // ==========================================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 18,
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

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18
  },

  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  cardHeaderText: {
    flex: 1
  },

  cardTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  cardSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16
  },

  // ==========================================
  // ESPACIO SELECCIONADO
  // ==========================================

  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 17
  },

  selectedText: {
    flex: 1,
    color: "#365D92",
    fontSize: 12,
    fontWeight: "600"
  },

  // ==========================================
  // ESPACIOS DISPONIBLES
  // ==========================================

  levelSection: {
    marginBottom: 17
  },

  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12
  },

  levelTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "800"
  },

  levelCount: {
    marginLeft: "auto",
    backgroundColor: "#E1F7E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },

  levelCountText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800"
  },

  spacesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },

  spaceButton: {
    minWidth: 64,
    minHeight: 69,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: "#DDF7E9",
    borderWidth: 1,
    borderColor: "#BCEBCF",
    justifyContent: "center",
    alignItems: "center",
    gap: 4
  },

  spaceButtonSelected: {
    backgroundColor: "#0964D5",
    borderColor: "#0754BD"
  },

  spaceText: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "900"
  },

  spaceTextSelected: {
    color: "#FFFFFF"
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 25
  },

  emptyText: {
    color: "#7891B1",
    fontSize: 13,
    marginTop: 10
  },

  // ==========================================
  // DURACIÓN
  // ==========================================

  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F9FF",
    borderRadius: 18,
    padding: 13
  },

  hoursButton: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: "#E1EEFF",
    justifyContent: "center",
    alignItems: "center"
  },

  hoursButtonDisabled: {
    opacity: 0.55
  },

  hoursDisplay: {
    alignItems: "center",
    flex: 1
  },

  hoursNumber: {
    color: "#0754BD",
    fontSize: 34,
    fontWeight: "900"
  },

  hoursLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },

  hoursHint: {
    textAlign: "center",
    color: "#8199B9",
    fontSize: 11,
    marginTop: 13
  },

  // ==========================================
  // RESUMEN
  // ==========================================

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14
  },

  summaryLabel: {
    color: "#64748B",
    fontSize: 13
  },

  summaryValue: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    flexShrink: 1
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#E2ECFA",
    marginVertical: 7
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    marginTop: 12,
    marginBottom: 20
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
    fontSize: 22,
    fontWeight: "900"
  },

  // ==========================================
  // CONFIRMAR RESERVA
  // ==========================================

  confirmWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.18,
    shadowRadius: 8
  },

  confirmDisabled: {
    opacity: 0.5
  },

  confirmButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14
  },

  confirmContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },

  // ==========================================
  // ONDAS INFERIORES
  // ==========================================

  bottomWaves: {
    height: 105,
    width: "100%",
    marginTop: "auto",
    justifyContent: "flex-end",
    flexShrink: 0
  }
});
