
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { dateText } from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// PANTALLA DE NOTIFICACIONES
// ==========================================

export default function NotificationsScreen({ navigation }) {
  const { notifications, reservations } = useParking();

  const now = Date.now();

  // ==========================================
  // LÓGICA ORIGINAL
  // ==========================================

  const active = reservations.filter(
    r => r.status === "activa"
  );

  const totalNotifications =
    active.length + notifications.length;

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
                Notificaciones
              </Text>

              <Text style={s.headerSubtitle}>
                Avisos de tu cuenta
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="notifications-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          {/* MENSAJE DEL ENCABEZADO */}

          <View style={s.heroInfo}>
            <Ionicons
              name="information-circle-outline"
              size={23}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              Consulta las novedades y el estado
              de tus reservaciones.
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
              RESUMEN
          ================================== */}

          <View style={s.summaryCard}>
            <View style={s.summaryIcon}>
              <Ionicons
                name="notifications"
                size={26}
                color="#0964D5"
              />
            </View>

            <View style={s.summaryText}>
              <Text style={s.summaryTitle}>
                Centro de notificaciones
              </Text>

              <Text style={s.summarySubtitle}>
                {totalNotifications === 0
                  ? "No tienes avisos por el momento"
                  : `${totalNotifications} aviso(s) en tu cuenta`}
              </Text>
            </View>

            <View style={s.countBadge}>
              <Text style={s.countText}>
                {totalNotifications}
              </Text>
            </View>
          </View>

          {/* ==================================
              RESERVACIONES ACTIVAS
          ================================== */}

          {active.length > 0 && (
            <>
              <View style={s.sectionHeader}>
                <View style={s.sectionTitleRow}>
                  <Ionicons
                    name="time-outline"
                    size={21}
                    color="#0754BD"
                  />

                  <Text style={s.sectionTitle}>
                    Reservaciones activas
                  </Text>
                </View>

                <View style={s.sectionCount}>
                  <Text style={s.sectionCountText}>
                    {active.length}
                  </Text>
                </View>
              </View>

              {active.map(r => {
                // CÁLCULO ORIGINAL DEL TIEMPO
                const end =
                  new Date(r.start).getTime() +
                  r.hours * 3600000;

                const minutes = Math.max(
                  0,
                  Math.ceil((end - now) / 60000)
                );

                const hoursLeft = Math.floor(
                  minutes / 60
                );

                const minutesLeft = minutes % 60;

                const timeText =
                  hoursLeft > 0
                    ? `${hoursLeft} h ${minutesLeft} min`
                    : `${minutes} min`;

                return (
                  <View
                    key={r.id}
                    style={s.activeCard}
                  >
                    <View style={s.cardHeader}>
                      <View style={s.activeIcon}>
                        <Ionicons
                          name="car-sport"
                          size={25}
                          color="#15803D"
                        />
                      </View>

                      <View style={s.cardHeaderText}>
                        <Text style={s.cardTitle}>
                          Reserva activa
                        </Text>

                        <Text style={s.cardSubtitle}>
                          Espacio {r.spaceId}
                        </Text>
                      </View>

                      <View style={s.activeBadge}>
                        <View style={s.activeDot} />

                        <Text style={s.activeBadgeText}>
                          Activa
                        </Text>
                      </View>
                    </View>

                    {/* TIEMPO RESTANTE */}

                    <View style={s.timeBox}>
                      <View style={s.timeIcon}>
                        <Ionicons
                          name="time-outline"
                          size={24}
                          color="#0754BD"
                        />
                      </View>

                      <View style={s.timeContent}>
                        <Text style={s.timeLabel}>
                          Tiempo restante aproximado
                        </Text>

                        <Text style={s.timeValue}>
                          {timeText}
                        </Text>
                      </View>
                    </View>

                    <View style={s.activeFooter}>
                      <Ionicons
                        name="information-circle-outline"
                        size={17}
                        color="#6486B3"
                      />

                      <Text style={s.activeFooterText}>
                        El tiempo se calcula según
                        la duración de tu reserva.
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* ==================================
              NOTIFICACIONES GENERALES
          ================================== */}

          {notifications.length > 0 && (
            <>
              <View style={s.sectionHeader}>
                <View style={s.sectionTitleRow}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={21}
                    color="#0754BD"
                  />

                  <Text style={s.sectionTitle}>
                    Avisos de tu cuenta
                  </Text>
                </View>

                <View style={s.sectionCount}>
                  <Text style={s.sectionCountText}>
                    {notifications.length}
                  </Text>
                </View>
              </View>

              {notifications.map(n => (
                <View
                  key={n.id}
                  style={s.notificationCard}
                >
                  <View style={s.notificationRow}>
                    <View style={s.notificationIcon}>
                      <Ionicons
                        name="notifications-outline"
                        size={23}
                        color="#0964D5"
                      />
                    </View>

                    <View style={s.notificationContent}>
                      <Text style={s.notificationTitle}>
                        Notificación
                      </Text>

                      <Text style={s.notificationMessage}>
                        {n.text}
                      </Text>

                      <View style={s.dateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={15}
                          color="#7891B1"
                        />

                        <Text style={s.dateText}>
                          {dateText(n.date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ==================================
              SIN NOTIFICACIONES
          ================================== */}

          {notifications.length === 0 &&
            active.length === 0 && (
              <View style={s.emptyCard}>
                <LinearGradient
                  colors={[
                    "#EAF4FF",
                    "#DCEBFF"
                  ]}
                  style={s.emptyIcon}
                >
                  <Ionicons
                    name="notifications-off-outline"
                    size={44}
                    color="#1673E8"
                  />
                </LinearGradient>

                <Text style={s.emptyTitle}>
                  ¡Todo al día!
                </Text>

                <Text style={s.emptySubtitle}>
                  No tienes notificaciones nuevas.
                </Text>

                <Text style={s.emptyDescription}>
                  Cuando tengas avisos importantes
                  o reservaciones activas,
                  aparecerán aquí.
                </Text>
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
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
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

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  summaryText: {
    flex: 1
  },

  summaryTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  summarySubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 17
  },

  countBadge: {
    minWidth: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#DCEBFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },

  countText: {
    color: "#0754BD",
    fontSize: 14,
    fontWeight: "900"
  },

  // ==========================================
  // TÍTULOS DE SECCIÓN
  // ==========================================

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 10
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  sectionCount: {
    backgroundColor: "#DCEBFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },

  sectionCountText: {
    color: "#0754BD",
    fontSize: 11,
    fontWeight: "800"
  },

  // ==========================================
  // RESERVAS ACTIVAS
  // ==========================================

  activeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
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
    gap: 11,
    marginBottom: 15
  },

  activeIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#DDF7E9",
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
    fontSize: 12,
    marginTop: 4
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DDF7E9",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16A34A"
  },

  activeBadgeText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800"
  },

  // ==========================================
  // TIEMPO RESTANTE
  // ==========================================

  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
    padding: 14
  },

  timeIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center"
  },

  timeContent: {
    flex: 1
  },

  timeLabel: {
    color: "#547095",
    fontSize: 11,
    fontWeight: "600"
  },

  timeValue: {
    color: "#0754BD",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 4
  },

  activeFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 13
  },

  activeFooterText: {
    color: "#7891B1",
    fontSize: 11,
    lineHeight: 17,
    flex: 1
  },

  // ==========================================
  // NOTIFICACIONES GENERALES
  // ==========================================

  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 16,
    marginBottom: 13,
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

  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },

  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  notificationContent: {
    flex: 1
  },

  notificationTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7
  },

  notificationMessage: {
    color: "#365D92",
    fontSize: 12,
    lineHeight: 19
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 13
  },

  dateText: {
    color: "#7891B1",
    fontSize: 11
  },

  // ==========================================
  // SIN NOTIFICACIONES
  // ==========================================

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    width: 95,
    height: 95,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },

  emptyTitle: {
    color: "#102A55",
    fontSize: 20,
    fontWeight: "900"
  },

  emptySubtitle: {
    color: "#547095",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10
  },

  emptyDescription: {
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
