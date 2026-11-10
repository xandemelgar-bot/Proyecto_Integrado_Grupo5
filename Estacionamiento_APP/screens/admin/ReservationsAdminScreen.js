
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
// FILTROS
// ==========================================

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "activa", label: "Activas" },
  { id: "completada", label: "Completadas" },
  { id: "cancelada", label: "Canceladas" }
];

// ==========================================
// ESTILOS SEGÚN ESTADO
// ==========================================

const getStatusInfo = status => {
  switch (status) {
    case "activa":
      return {
        label: "Activa",
        icon: "checkmark-circle",
        color: "#15803D",
        background: "#DDF7E9"
      };

    case "completada":
      return {
        label: "Completada",
        icon: "checkmark-done-circle",
        color: "#0754BD",
        background: "#E0EEFF"
      };

    case "cancelada":
      return {
        label: "Cancelada",
        icon: "close-circle",
        color: "#DC2626",
        background: "#FEE2E2"
      };

    default:
      return {
        label: status || "Sin estado",
        icon: "information-circle",
        color: "#64748B",
        background: "#F1F5F9"
      };
  }
};

// ==========================================
// PANTALLA
// ==========================================

export default function ReservationsAdminScreen({
  navigation
}) {
  const { reservations, cancelReservation } =
    useParking();

  const [filter, setFilter] = useState("todas");

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const total = reservations.length;

  const activeCount = reservations.filter(
    r => r.status === "activa"
  ).length;

  const completedCount = reservations.filter(
    r => r.status === "completada"
  ).length;

  const cancelledCount = reservations.filter(
    r => r.status === "cancelada"
  ).length;

  // ==========================================
  // FILTRADO
  // ==========================================

  const filteredReservations =
    filter === "todas"
      ? reservations
      : reservations.filter(
        r => r.status === filter
      );

  // ==========================================
  // CANCELAR RESERVACIÓN
  // ==========================================

  const handleCancel = reservation => {
    Alert.alert(
      "Cancelar reserva",
      "¿Confirmas la cancelación?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () =>
            cancelReservation(reservation.id)
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

      <ScrollView
        style={s.container}
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
                Reservaciones
              </Text>

              <Text style={s.headerSubtitle}>
                Supervisión y cancelaciones
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="calendar-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroInfo}>
            <Ionicons
              name="clipboard-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              Consulta y administra las
              reservaciones del estacionamiento.
            </Text>
          </View>

          {/* ONDAS */}

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
              RESUMEN
          ================================== */}

          <View style={s.summaryCard}>
            <View style={s.summaryHeader}>
              <View style={s.summaryIcon}>
                <Ionicons
                  name="stats-chart-outline"
                  size={23}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.summaryTitle}>
                  Resumen de reservaciones
                </Text>

                <Text style={s.summarySubtitle}>
                  Estado general de las reservas
                </Text>
              </View>
            </View>

            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Text style={s.statTotal}>
                  {total}
                </Text>

                <Text style={s.statLabel}>
                  Totales
                </Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statActive}>
                  {activeCount}
                </Text>

                <Text style={s.statLabel}>
                  Activas
                </Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statCompleted}>
                  {completedCount}
                </Text>

                <Text style={s.statLabel}>
                  Completadas
                </Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statCancelled}>
                  {cancelledCount}
                </Text>

                <Text style={s.statLabel}>
                  Canceladas
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              FILTROS
          ================================== */}

          <View style={s.filtersCard}>
            <Text style={s.filtersTitle}>
              Filtrar reservaciones
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filtersRow}
            >
              {FILTERS.map(item => {
                const selected =
                  filter === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      setFilter(item.id)
                    }
                    activeOpacity={0.8}
                    style={s.filterWrapper}
                  >
                    {selected ? (
                      <LinearGradient
                        colors={[
                          "#2585FF",
                          "#0754C9"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.filterActive}
                      >
                        <Text style={s.filterTextActive}>
                          {item.label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.filterInactive}>
                        <Text style={s.filterTextInactive}>
                          {item.label}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ==================================
              LISTADO
          ================================== */}

          <View style={s.listHeader}>
            <View style={s.listHeaderTitle}>
              <Ionicons
                name="list-outline"
                size={22}
                color="#0754BD"
              />

              <Text style={s.listTitle}>
                Listado de reservaciones
              </Text>
            </View>

            <View style={s.countBadge}>
              <Text style={s.countText}>
                {filteredReservations.length}
              </Text>
            </View>
          </View>

          {/* ==================================
              SIN RESERVACIONES
          ================================== */}

          {filteredReservations.length === 0 ? (
            <View style={s.emptyCard}>
              <LinearGradient
                colors={[
                  "#EAF4FF",
                  "#DCEBFF"
                ]}
                style={s.emptyIcon}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={42}
                  color="#1673E8"
                />
              </LinearGradient>

              <Text style={s.emptyTitle}>
                Sin reservaciones
              </Text>

              <Text style={s.emptySubtitle}>
                {filter === "todas"
                  ? "No hay reservaciones registradas."
                  : "No hay reservaciones con este estado."}
              </Text>
            </View>
          ) : (
            filteredReservations.map(r => {
              const status = getStatusInfo(
                r.status
              );

              return (
                <View
                  key={r.id}
                  style={s.reservationCard}
                >
                  {/* ENCABEZADO DE TARJETA */}

                  <View style={s.cardHeader}>
                    <View style={s.cardIcon}>
                      <Ionicons
                        name="car-sport"
                        size={25}
                        color="#0964D5"
                      />
                    </View>

                    <View style={s.cardHeaderText}>
                      <Text style={s.cardTitle}>
                        Espacio {r.spaceId}
                      </Text>

                      <Text style={s.cardSubtitle}>
                        Reservación registrada
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
                      <Ionicons
                        name={status.icon}
                        size={14}
                        color={status.color}
                      />

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

                  {/* INFORMACIÓN */}

                  <View style={s.detailsBox}>
                    <View style={s.detailRow}>
                      <View style={s.detailLabelRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={17}
                          color="#6486B3"
                        />

                        <Text style={s.detailLabel}>
                          Inicio
                        </Text>
                      </View>

                      <Text style={s.detailValue}>
                        {dateText(r.start)}
                      </Text>
                    </View>

                    <View style={s.detailRow}>
                      <View style={s.detailLabelRow}>
                        <Ionicons
                          name="time-outline"
                          size={17}
                          color="#6486B3"
                        />

                        <Text style={s.detailLabel}>
                          Duración
                        </Text>
                      </View>

                      <Text style={s.detailValue}>
                        {r.hours} hora(s)
                      </Text>
                    </View>

                    <View style={s.detailDivider} />

                    <View style={s.amountRow}>
                      <Text style={s.amountLabel}>
                        Importe
                      </Text>

                      <Text style={s.amountValue}>
                        {money(r.amount)}
                      </Text>
                    </View>
                  </View>

                  {/* CANCELAR RESERVACIÓN */}

                  {r.status === "activa" && (
                    <TouchableOpacity
                      onPress={() =>
                        handleCancel(r)
                      }
                      activeOpacity={0.8}
                      style={s.cancelButton}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color="#DC2626"
                      />

                      <Text style={s.cancelButtonText}>
                        Cancelar reserva
                      </Text>
                    </TouchableOpacity>
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
    fontSize: 21,
    fontWeight: "900"
  },

  headerSubtitle: {
    color: "#DCEBFF",
    fontSize: 12,
    marginTop: 4
  },

  headerIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 23,
    paddingHorizontal: 5,
    maxWidth: 340
  },

  heroInfoText: {
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

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    flexGrow: 1
  },

  // ==========================================
  // RESUMEN
  // ==========================================

  summaryCard: {
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

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 20
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  summaryTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  summarySubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },

  statItem: {
    flex: 1,
    alignItems: "center"
  },

  statTotal: {
    color: "#0754BD",
    fontSize: 23,
    fontWeight: "900"
  },

  statActive: {
    color: "#16A34A",
    fontSize: 23,
    fontWeight: "900"
  },

  statCompleted: {
    color: "#2563EB",
    fontSize: 23,
    fontWeight: "900"
  },

  statCancelled: {
    color: "#DC2626",
    fontSize: 23,
    fontWeight: "900"
  },

  statLabel: {
    color: "#7891B1",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 6
  },

  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E2ECFA"
  },

  // ==========================================
  // FILTROS
  // ==========================================

  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2ECFA"
  },

  filtersTitle: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 13
  },

  filtersRow: {
    gap: 9,
    paddingRight: 5
  },

  filterWrapper: {
    borderRadius: 12,
    overflow: "hidden"
  },

  filterActive: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12
  },

  filterInactive: {
    backgroundColor: "#F1F6FD",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12
  },

  filterTextActive: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },

  filterTextInactive: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "800"
  },

  // ==========================================
  // LISTADO
  // ==========================================

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },

  listHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1
  },

  listTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  countBadge: {
    backgroundColor: "#DCEBFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  countText: {
    color: "#0754BD",
    fontSize: 12,
    fontWeight: "900"
  },

  // ==========================================
  // TARJETAS DE RESERVACIÓN
  // ==========================================

  reservationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
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
    gap: 10,
    marginBottom: 15
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
    fontSize: 15,
    fontWeight: "900"
  },

  cardSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800"
  },

  detailsBox: {
    backgroundColor: "#F5F9FF",
    borderRadius: 14,
    padding: 13,
    marginBottom: 14
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12
  },

  detailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },

  detailLabel: {
    color: "#7891B1",
    fontSize: 12
  },

  detailValue: {
    color: "#365D92",
    fontSize: 12,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right"
  },

  detailDivider: {
    height: 1,
    backgroundColor: "#DFEAF8",
    marginBottom: 12
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  amountLabel: {
    color: "#365D92",
    fontSize: 13,
    fontWeight: "800"
  },

  amountValue: {
    color: "#0754BD",
    fontSize: 19,
    fontWeight: "900"
  },

  // ==========================================
  // CANCELAR
  // ==========================================

  cancelButton: {
    minHeight: 47,
    backgroundColor: "#FFF1F1",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#F8D0D0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },

  cancelButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900"
  },

  // ==========================================
  // ESTADO VACÍO
  // ==========================================

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    paddingHorizontal: 24,
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
    width: 90,
    height: 90,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18
  },

  emptyTitle: {
    color: "#102A55",
    fontSize: 19,
    fontWeight: "900"
  },

  emptySubtitle: {
    color: "#7891B1",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 10
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
