
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import {
  dateText,
  money
} from "../../components/UI";

import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// MIS RESERVACIONES
// ==========================================

export default function MyReservationsScreen({ navigation }) {
  const {
    reservations,
    cancelReservation,
    payments
  } = useParking();

  const [filter, setFilter] = useState("todas");

  // ==========================================
  // FILTROS VISUALES
  // ==========================================

  const filters = [
    { key: "todas", label: "Todas" },
    { key: "activa", label: "Activas" },
    { key: "completada", label: "Completadas" },
    { key: "cancelada", label: "Canceladas" }
  ];

  const filteredReservations =
    filter === "todas"
      ? reservations
      : reservations.filter(
        r => r.status === filter
      );

  // ==========================================
  // ESTILOS SEGÚN EL ESTADO
  // ==========================================

  const getStatusConfig = status => {
    switch (status) {
      case "activa":
        return {
          label: "Activa",
          color: "#15803D",
          background: "#DDF7E9",
          icon: "checkmark-circle"
        };

      case "completada":
        return {
          label: "Completada",
          color: "#0754C9",
          background: "#DCEBFF",
          icon: "checkmark-done-circle"
        };

      case "cancelada":
        return {
          label: "Cancelada",
          color: "#B91C1C",
          background: "#FEE2E2",
          icon: "close-circle"
        };

      default:
        return {
          label: status,
          color: "#64748B",
          background: "#F1F5F9",
          icon: "information-circle"
        };
    }
  };

  // ==========================================
  // CANCELAR RESERVA
  // ==========================================

  const handleCancel = reservation => {
    Alert.alert(
      "Cancelar reserva",
      "¿Estás seguro de que deseas cancelar esta reserva?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            const resultado =
              await cancelReservation(reservation.id);

            if (resultado) {
              Alert.alert(
                "Reserva cancelada",
                "Tu reserva fue cancelada correctamente."
              );
            } else {
              Alert.alert(
                "Error",
                "No se pudo cancelar la reserva."
              );
            }
          }
        }
      ]
    );
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
                style={s.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <View style={s.headerIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={29}
                  color="#FFFFFF"
                />
              </View>

              <View style={s.headerText}>
                <Text style={s.headerTitle}>
                  Mis reservaciones
                </Text>

                <Text style={s.headerSubtitle}>
                  Administra y visualiza tus reservas
                </Text>
              </View>
            </View>

            {/* ONDAS SUPERIORES */}

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
                FILTROS
            ================================== */}

            <View style={s.filterCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.filtersRow}
              >
                {filters.map(item => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setFilter(item.key)}
                    activeOpacity={0.85}
                  >
                    {filter === item.key ? (
                      <LinearGradient
                        colors={[
                          "#2585FF",
                          "#0754C9"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.filterButton}
                      >
                        <Text style={s.filterTextActive}>
                          {item.label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.filterButtonInactive}>
                        <Text style={s.filterTextInactive}>
                          {item.label}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* ==================================
                CONTADOR
            ================================== */}

            <View style={s.counterRow}>
              <Text style={s.counterTitle}>
                {filter === "todas"
                  ? "Todas las reservaciones"
                  : filters.find(
                    item => item.key === filter
                  )?.label}
              </Text>

              <View style={s.counterBadge}>
                <Text style={s.counterText}>
                  {filteredReservations.length}
                </Text>
              </View>
            </View>

            {/* ==================================
                SIN RESERVACIONES
            ================================== */}

            {filteredReservations.length === 0 ? (
              <View style={s.emptyCard}>
                <View style={s.emptyIcon}>
                  <Ionicons
                    name="calendar-clear-outline"
                    size={43}
                    color="#1673E8"
                  />
                </View>

                <Text style={s.emptyTitle}>
                  {reservations.length === 0
                    ? "Aún no tienes reservaciones"
                    : "No hay reservas en esta categoría"}
                </Text>

                <Text style={s.emptySubtitle}>
                  {reservations.length === 0
                    ? "Selecciona un espacio disponible y crea tu primera reservación."
                    : "Prueba seleccionando otro filtro para consultar tus reservaciones."}
                </Text>

                {reservations.length === 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Reservation")
                    }
                    activeOpacity={0.85}
                    style={s.createButtonWrapper}
                  >
                    <LinearGradient
                      colors={[
                        "#2585FF",
                        "#0754C9"
                      ]}
                      style={s.createButton}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={21}
                        color="#FFFFFF"
                      />

                      <Text style={s.createButtonText}>
                        Crear reserva
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filteredReservations.map(r => {
                // LÓGICA ORIGINAL DE PAGOS
                const paid = payments.some(
                  p => p.reservationId === r.id
                );

                const status = getStatusConfig(
                  r.status
                );

                return (
                  <View
                    key={r.id}
                    style={s.reservationCard}
                  >
                    {/* ENCABEZADO DE LA RESERVA */}

                    <View style={s.reservationHeader}>
                      <View style={s.reservationIcon}>
                        <Ionicons
                          name="car-sport"
                          size={26}
                          color="#0964D5"
                        />
                      </View>

                      <View style={s.reservationTitleContainer}>
                        <Text style={s.reservationTitle}>
                          Espacio {r.spaceId}
                        </Text>

                        <Text style={s.reservationSubtitle}>
                          Reservación de estacionamiento
                        </Text>
                      </View>

                      <View
                        style={[
                          s.statusBadge,
                          {
                            backgroundColor:
                              status.background
                          }
                        ]}
                      >
                        <Text
                          style={[
                            s.statusText,
                            { color: status.color }
                          ]}
                        >
                          {status.label}
                        </Text>
                      </View>
                    </View>

                    {/* DETALLES */}

                    <View style={s.detailsContainer}>
                      <View style={s.detailRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={17}
                          color="#6486B3"
                        />

                        <Text style={s.detailText}>
                          {dateText(r.start)}
                        </Text>
                      </View>

                      <View style={s.detailRow}>
                        <Ionicons
                          name="time-outline"
                          size={17}
                          color="#6486B3"
                        />

                        <Text style={s.detailText}>
                          {r.hours} hora(s)
                        </Text>
                      </View>
                    </View>

                    {/* IMPORTE */}

                    <View style={s.amountRow}>
                      <Text style={s.amountLabel}>
                        Importe
                      </Text>

                      <Text style={s.amountValue}>
                        {money(r.amount)}
                      </Text>
                    </View>

                    {/* ESTADO DE PAGO */}

                    <View
                      style={[
                        s.paymentBadge,
                        {
                          backgroundColor: paid
                            ? "#E5F8EC"
                            : "#FFF3DC"
                        }
                      ]}
                    >
                      <Ionicons
                        name={
                          paid
                            ? "checkmark-circle-outline"
                            : "time-outline"
                        }
                        size={17}
                        color={
                          paid
                            ? "#15803D"
                            : "#B7791F"
                        }
                      />

                      <Text
                        style={[
                          s.paymentText,
                          {
                            color: paid
                              ? "#15803D"
                              : "#B7791F"
                          }
                        ]}
                      >
                        {paid
                          ? "Pago simulado completado"
                          : "Pago pendiente"}
                      </Text>
                    </View>

                    {/* ==================================
                        ACCIONES
                    ================================== */}

                    {r.status === "activa" && (
                      <View style={s.actionsContainer}>
                        {!paid && (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate(
                                "Payment",
                                { reservationId: r.id }
                              )
                            }
                            activeOpacity={0.85}
                            style={s.payButtonWrapper}
                          >
                            <LinearGradient
                              colors={[
                                "#2585FF",
                                "#0754C9"
                              ]}
                              style={s.payButton}
                            >
                              <Ionicons
                                name="card-outline"
                                size={19}
                                color="#FFFFFF"
                              />

                              <Text style={s.payButtonText}>
                                Ir a pago
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          onPress={() => handleCancel(r)}
                          activeOpacity={0.8}
                          style={s.cancelButton}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={19}
                            color="#DC2626"
                          />

                          <Text style={s.cancelButtonText}>
                            Cancelar reserva
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
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
    height: 170,
    paddingTop: 23,
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

  headerIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
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

  headerWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75
  },

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 15,
    paddingTop: 0,
    marginTop: -5,
    flexGrow: 1
  },

  // ==========================================
  // FILTROS
  // ==========================================

  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
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

  filtersRow: {
    flexDirection: "row",
    gap: 7
  },

  filterButton: {
    minWidth: 80,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center"
  },

  filterButtonInactive: {
    minWidth: 80,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: "#E8F1FF",
    alignItems: "center"
  },

  filterTextActive: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800"
  },

  filterTextInactive: {
    color: "#24436C",
    fontSize: 12,
    fontWeight: "700"
  },

  // ==========================================
  // CONTADOR
  // ==========================================

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 15,
    paddingHorizontal: 3
  },

  counterTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  counterBadge: {
    backgroundColor: "#DCEBFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },

  counterText: {
    color: "#0754BD",
    fontSize: 12,
    fontWeight: "800"
  },

  // ==========================================
  // TARJETAS DE RESERVAS
  // ==========================================

  reservationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
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

  reservationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15
  },

  reservationIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  reservationTitleContainer: {
    flex: 1,
    minWidth: 0
  },

  reservationTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  reservationSubtitle: {
    color: "#7891B1",
    fontSize: 10,
    marginTop: 4
  },

  // ==========================================
  // ESTADOS
  // ==========================================

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    maxWidth: 110
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center"
  },

  // ==========================================
  // DETALLES
  // ==========================================

  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 15
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  detailText: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "600"
  },

  // ==========================================
  // IMPORTE
  // ==========================================

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E9F0FA",
    marginBottom: 12
  },

  amountLabel: {
    color: "#64748B",
    fontSize: 12
  },

  amountValue: {
    color: "#0754BD",
    fontSize: 18,
    fontWeight: "900"
  },

  // ==========================================
  // PAGO
  // ==========================================

  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 10
  },

  paymentText: {
    fontSize: 11,
    fontWeight: "700",
    flex: 1
  },

  // ==========================================
  // BOTONES
  // ==========================================

  actionsContainer: {
    gap: 10,
    marginTop: 15
  },

  payButtonWrapper: {
    borderRadius: 13,
    overflow: "hidden"
  },

  payButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 13
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },

  cancelButton: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#F8D0D0",
    borderRadius: 13
  },

  cancelButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "800"
  },

  // ==========================================
  // SIN RESERVACIONES
  // ==========================================

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 23,
    paddingVertical: 38,
    alignItems: "center",
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

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: "#EAF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },

  emptyTitle: {
    color: "#102A55",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center"
  },

  emptySubtitle: {
    color: "#7891B1",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 10
  },

  createButtonWrapper: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 23
  },

  createButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
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
