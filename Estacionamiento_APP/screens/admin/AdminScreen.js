
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  useWindowDimensions
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { useParking } from "../../contexts/ParkingContext";
import { useAuth } from "../../contexts/AuthContext";
import { money } from "../../components/UI";

// ==========================================
// PANEL DE ADMINISTRADOR
// ==========================================

export default function AdminScreen({ navigation }) {
  const { stats, connection, reservations } = useParking();
  const { cerrarSesion } = useAuth();
  const { width } = useWindowDimensions();

  const activeReservations = reservations.filter(
    r => r.status === "activa"
  ).length;

  const totalSpaces =
    stats.free + stats.occupied + stats.reserved;

  const availablePercent = totalSpaces > 0
    ? Math.round((stats.free / totalSpaces) * 100)
    : 0;

  // ==========================================
  // OPCIONES DE ADMINISTRACIÓN
  // ==========================================

  const options = [
    {
      title: "Espacios",
      subtitle: "Gestionar lugares",
      icon: "car-sport-outline",
      route: "ParkingManagement",
      color: "#0964D5",
      background: "#E6F1FF"
    },
    {
      title: "Reservaciones",
      subtitle: "Gestionar reservas",
      icon: "calendar-outline",
      route: "ReservationsAdmin",
      color: "#7C3AED",
      background: "#F1EAFE"
    },
    {
      title: "Tarifas",
      subtitle: "Precios y cobros",
      icon: "wallet-outline",
      route: "Tariffs",
      color: "#059669",
      background: "#DDF7E9"
    },
    {
      title: "Reportes",
      subtitle: "Ver estadísticas",
      icon: "bar-chart-outline",
      route: "Reports",
      color: "#EA580C",
      background: "#FFF0DF"
    },
    {
      title: "Predicciones",
      subtitle: "Inteligencia artificial",
      icon: "analytics-outline",
      route: "Predictions",
      color: "#0891B2",
      background: "#E0F7FC"
    }
  ];

  // ==========================================
  // CERRAR SESIÓN (LÓGICA ORIGINAL)
  // ==========================================

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await cerrarSesion();
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo cerrar sesión."
              );
            }
          }
        }
      ]
    );
  };

  // ==========================================
  // COMPONENTE DE MÉTRICA
  // ==========================================

  const MetricCard = ({
    title,
    value,
    icon,
    color,
    background
  }) => (
    <View style={s.metricCard}>
      <View
        style={[
          s.metricIcon,
          { backgroundColor: background }
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={color}
        />
      </View>

      <Text
        style={[s.metricValue, { color }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      <Text style={s.metricLabel}>
        {title}
      </Text>
    </View>
  );

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
            <View style={s.headerIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>

            <View style={s.headerText}>
              <Text style={s.headerGreeting}>
                Hola, Administrador
              </Text>

              <Text style={s.headerSubtitle}>
                Panel de control del estacionamiento
              </Text>
            </View>

            <View style={s.headerBadge}>
              <Ionicons
                name="settings-outline"
                size={24}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroInfo}>
            <Ionicons
              name="car-sport-outline"
              size={23}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              Monitorea y administra tu
              estacionamiento inteligente.
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
              RESUMEN GENERAL
          ================================== */}

          <View style={s.summaryCard}>
            <View style={s.summaryHeader}>
              <View style={s.summaryHeaderIcon}>
                <Ionicons
                  name="car-sport-outline"
                  size={24}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.summaryTitle}>
                  Resumen general
                </Text>

                <Text style={s.summarySubtitle}>
                  Disponibilidad del estacionamiento
                </Text>
              </View>
            </View>

            <View style={s.summaryStats}>
              <View style={s.summaryItem}>
                <Text style={s.summaryTotal}>
                  {totalSpaces}
                </Text>

                <Text style={s.summaryLabel}>
                  Totales
                </Text>
              </View>

              <View style={s.summaryDivider} />

              <View style={s.summaryItem}>
                <Text style={s.summaryFree}>
                  {stats.free}
                </Text>

                <Text style={s.summaryLabel}>
                  Disponibles
                </Text>
              </View>

              <View style={s.summaryDivider} />

              <View style={s.summaryItem}>
                <Text style={s.summaryOccupied}>
                  {stats.occupied}
                </Text>

                <Text style={s.summaryLabel}>
                  Ocupados
                </Text>
              </View>
            </View>

            {/* BARRA DE DISPONIBILIDAD */}

            <View style={s.progressHeader}>
              <Text style={s.progressLabel}>
                Disponibilidad actual
              </Text>

              <Text style={s.progressPercent}>
                {availablePercent}%
              </Text>
            </View>

            <View style={s.progressTrack}>
              <LinearGradient
                colors={["#34D399", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  s.progressFill,
                  { width: `${availablePercent}%` }
                ]}
              />
            </View>
          </View>

          {/* ==================================
              ESTADÍSTICAS
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="stats-chart-outline"
              size={21}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Estadísticas
            </Text>
          </View>

          <View style={s.metricsGrid}>
            <MetricCard
              title="Libres"
              value={stats.free}
              icon="checkmark-circle-outline"
              color="#16A34A"
              background="#DDF7E9"
            />

            <MetricCard
              title="Ocupados"
              value={stats.occupied}
              icon="car-sport-outline"
              color="#DC2626"
              background="#FEE2E2"
            />

            <MetricCard
              title="Reservados"
              value={stats.reserved}
              icon="calendar-outline"
              color="#D97706"
              background="#FFF3DC"
            />

            <MetricCard
              title="Ingresos "
              value={money(stats.income)}
              icon="cash-outline"
              color="#059669"
              background="#DDF7E9"
            />
          </View>

          {/* ==================================
              ESTADO DEL SISTEMA
          ================================== */}

          <View style={s.systemCard}>
            <View style={s.systemHeader}>
              <View style={s.systemIcon}>
                <Ionicons
                  name="server-outline"
                  size={24}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.systemTitle}>
                  Estado del sistema
                </Text>

                <Text style={s.systemSubtitle}>
                  Información de conexión
                </Text>
              </View>

              <View
                style={[
                  s.connectionBadge,
                  {
                    backgroundColor: connection
                      ? "#DDF7E9"
                      : "#FFF3DC"
                  }
                ]}
              >
                <View
                  style={[
                    s.connectionDot,
                    {
                      backgroundColor: connection
                        ? "#16A34A"
                        : "#F59E0B"
                    }
                  ]}
                />

                <Text
                  style={[
                    s.connectionText,
                    {
                      color: connection
                        ? "#15803D"
                        : "#B7791F"
                    }
                  ]}
                >
                  {connection ? "Conectado" : "Demo"}
                </Text>
              </View>
            </View>

            <View style={s.systemInfo}>
              <View style={s.systemRow}>
                <Ionicons
                  name={
                    connection
                      ? "wifi-outline"
                      : "cloud-offline-outline"
                  }
                  size={19}
                  color="#6486B3"
                />

                <Text style={s.systemInfoText}>
                  {connection
                    ? "Conectado a la fuente de datos"
                    : "Sin conexión en tiempo real (modo demostración)"}
                </Text>
              </View>

              <View style={s.systemRow}>
                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#6486B3"
                />

                <Text style={s.systemInfoText}>
                  Reservas activas:
                </Text>

                <Text style={s.systemValue}>
                  {activeReservations}
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              ADMINISTRACIÓN
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="grid-outline"
              size={21}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Administración
            </Text>
          </View>

          <View style={s.menuGrid}>
            {options.map(item => (
              <TouchableOpacity
                key={item.route}
                onPress={() =>
                  navigation.navigate(item.route)
                }
                activeOpacity={0.8}
                style={[
                  s.menuCard,
                  {
                    width:
                      width > 600
                        ? "31%"
                        : "48%"
                  }
                ]}
              >
                <View
                  style={[
                    s.menuIcon,
                    {
                      backgroundColor:
                        item.background
                    }
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={27}
                    color={item.color}
                  />
                </View>

                <Text style={s.menuTitle}>
                  {item.title}
                </Text>

                <Text style={s.menuSubtitle}>
                  {item.subtitle}
                </Text>

                <View style={s.menuArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#0964D5"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ==================================
              CERRAR SESIÓN
          ================================== */}

          <View style={s.logoutCard}>
            <View style={s.logoutHeader}>
              <View style={s.logoutIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={23}
                  color="#DC2626"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.logoutTitle}>
                  Sesión de administrador
                </Text>

                <Text style={s.logoutSubtitle}>
                  Finaliza tu sesión de forma segura
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              style={s.logoutButton}
            >
              <Ionicons
                name="log-out-outline"
                size={21}
                color="#DC2626"
              />

              <Text style={s.logoutButtonText}>
                Cerrar sesión
              </Text>
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
    height: 200,
    paddingTop: 25,
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
    gap: 13,
    zIndex: 2
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  headerText: {
    flex: 1
  },

  headerGreeting: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900"
  },

  headerSubtitle: {
    color: "#DCEBFF",
    fontSize: 12,
    marginTop: 5
  },

  headerBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    paddingHorizontal: 5,
    maxWidth: 330
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
    height: 75
  },

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    marginTop: -8,
    flexGrow: 1
  },

  // ==========================================
  // RESUMEN GENERAL
  // ==========================================

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#E2ECFA",
    elevation: 4,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 19
  },

  summaryHeaderIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  summaryTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  summarySubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 21
  },

  summaryItem: {
    flex: 1,
    alignItems: "center"
  },

  summaryTotal: {
    color: "#0754BD",
    fontSize: 27,
    fontWeight: "900"
  },

  summaryFree: {
    color: "#16A34A",
    fontSize: 27,
    fontWeight: "900"
  },

  summaryOccupied: {
    color: "#DC2626",
    fontSize: 27,
    fontWeight: "900"
  },

  summaryLabel: {
    color: "#7891B1",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2ECFA"
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9
  },

  progressLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "600"
  },

  progressPercent: {
    color: "#0754BD",
    fontSize: 12,
    fontWeight: "900"
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#E5EDF8",
    borderRadius: 10,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: 10
  },

  // ==========================================
  // TÍTULOS
  // ==========================================

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 14,
    marginTop: 3
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 17,
    fontWeight: "900"
  },

  // ==========================================
  // MÉTRICAS
  // ==========================================

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 21
  },

  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2ECFA",
    elevation: 2,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.06,
    shadowRadius: 8
  },

  metricIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13
  },

  metricValue: {
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 5
  },

  metricLabel: {
    color: "#7891B1",
    fontSize: 12,
    fontWeight: "700"
  },

  // ==========================================
  // ESTADO DEL SISTEMA
  // ==========================================

  systemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    marginBottom: 23,
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

  systemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16
  },

  systemIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  systemTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  systemSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 4
  },

  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20
  },

  connectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4
  },

  connectionText: {
    fontSize: 10,
    fontWeight: "800"
  },

  systemInfo: {
    backgroundColor: "#F5F9FF",
    borderRadius: 13,
    padding: 13,
    gap: 13
  },

  systemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },

  systemInfoText: {
    color: "#547095",
    fontSize: 12,
    flexShrink: 1
  },

  systemValue: {
    color: "#0754BD",
    fontSize: 13,
    fontWeight: "900"
  },

  // ==========================================
  // MENÚ DE ADMINISTRACIÓN
  // ==========================================

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 13,
    marginBottom: 23
  },

  menuCard: {
    minHeight: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 15,
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

  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13
  },

  menuTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  menuSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
    paddingRight: 15
  },

  menuArrow: {
    position: "absolute",
    bottom: 13,
    right: 13,
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#EAF4FF",
    justifyContent: "center",
    alignItems: "center"
  },

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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

  logoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 17
  },

  logoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFF1F1",
    justifyContent: "center",
    alignItems: "center"
  },

  logoutTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  logoutSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 4
  },

  logoutButton: {
    minHeight: 52,
    backgroundColor: "#FFF1F1",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F8D0D0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9
  },

  logoutButtonText: {
    color: "#DC2626",
    fontSize: 14,
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
