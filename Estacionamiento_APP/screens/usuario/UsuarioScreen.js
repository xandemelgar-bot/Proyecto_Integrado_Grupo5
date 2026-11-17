
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

import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// PANTALLA PRINCIPAL DEL USUARIO
// ==========================================

export default function UsuarioScreen({ navigation }) {
  const { stats, reservations } = useParking();

  // LÓGICA ORIGINAL
  const active = reservations.filter(
    r => r.status === "activa"
  ).length;

  // RUTAS ORIGINALES
  const options = [
    {
      title: "Reservar espacio",
      subtitle: "Agenda tu lugar",
      icon: "calendar-outline",
      route: "Reservation"
    },
    {
      title: "Ver disponibilidad",
      subtitle: "Espacios en tiempo real",
      icon: "location-outline",
      route: "Parking"
    },
    {
      title: "Mis reservaciones",
      subtitle: "Consulta tus reservas",
      icon: "time-outline",
      route: "MyReservations"
    },
    {
      title: "Pagos",
      subtitle: "Consultar pagos",
      icon: "card-outline",
      route: "Payment"
    },
    {
      title: "Notificaciones",
      subtitle: "Avisos importantes",
      icon: "notifications-outline",
      route: "Notifications"
    },
    {
      title: "Mi perfil",
      subtitle: "Configura tu cuenta",
      icon: "person-outline",
      route: "Profile"
    }
  ];

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
              ENCABEZADO AZUL
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

            <View style={s.heroContent}>
              <View style={s.logoContainer}>
                <Ionicons
                  name="scan-outline"
                  size={46}
                  color="#FFFFFF"
                  style={s.scanIcon}
                />

                <Ionicons
                  name="car-sport"
                  size={27}
                  color="#FFFFFF"
                  style={s.carIcon}
                />
              </View>

              <View style={s.heroTextContainer}>
                <Text style={s.heroTitle}>
                  Estacionamiento
                </Text>

                <Text style={s.heroTitle}>
                  Inteligente
                </Text>

                <Text style={s.heroSubtitle}>
                  Tu espacio, más fácil
                </Text>
              </View>
            </View>

            {/* ONDA DEL ENCABEZADO */}

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
                  d="M0 35 C115 80 240 0 400 30 L400 80 L0 80 Z"
                  fill="#8DC4FF"
                  opacity={0.55}
                />

                <Path
                  d="M0 53 C145 15 255 85 400 38 L400 80 L0 80 Z"
                  fill="#DDEEFF"
                  opacity={0.8}
                />
              </Svg>
            </View>
          </LinearGradient>

          {/* ==================================
              CONTENIDO
          ================================== */}

          <View style={s.content}>
            {/* TARJETA DE BIENVENIDA */}

            <LinearGradient
              colors={[
                "#FFFFFF",
                "#EAF4FF",
                "#C9E2FF"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.welcomeCard}
            >
              <View style={s.welcomeTextContainer}>
                <Text style={s.welcomeTitle}>
                  ¡Bienvenido!
                </Text>

                <Text style={s.welcomeDescription}>
                  Consulta la disponibilidad,
                  realiza reservaciones y más.
                </Text>
              </View>

              <View style={s.welcomeCarCircle}>
                <Ionicons
                  name="car-sport"
                  size={59}
                  color="#0754C9"
                />
              </View>
            </LinearGradient>

            {/* ==================================
                ESTADÍSTICAS
            ================================== */}

            <View style={s.statsRow}>
              <View style={s.statCard}>
                <View
                  style={[
                    s.statIcon,
                    { backgroundColor: "#DDF8E9" }
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={23}
                    color="#16A34A"
                  />
                </View>

                <View style={s.statTextContainer}>
                  <Text
                    style={[
                      s.statValue,
                      { color: "#15803D" }
                    ]}
                  >
                    {stats.free}
                  </Text>

                  <Text style={s.statLabel}>
                    Espacios libres
                  </Text>
                </View>
              </View>

              <View style={s.statCard}>
                <View
                  style={[
                    s.statIcon,
                    { backgroundColor: "#E1EEFF" }
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={23}
                    color="#1268DA"
                  />
                </View>

                <View style={s.statTextContainer}>
                  <Text
                    style={[
                      s.statValue,
                      { color: "#1268DA" }
                    ]}
                  >
                    {active}
                  </Text>

                  <Text style={s.statLabel}>
                    Reservas activas
                  </Text>
                </View>
              </View>
            </View>

            {/* ==================================
                ACCESOS RÁPIDOS
            ================================== */}

            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>
                Accesos rápidos
              </Text>

              <Text style={s.sectionSubtitle}>
                ¿Qué deseas hacer hoy?
              </Text>
            </View>

            <View style={s.menuContainer}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.route}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate(item.route)
                  }
                  style={s.menuCard}
                >
                  <View style={s.menuIconBackground}>
                    <Ionicons
                      name={item.icon}
                      size={27}
                      color="#0865D9"
                    />
                  </View>

                  <View style={s.menuTextContainer}>
                    <Text style={s.menuTitle}>
                      {item.title}
                    </Text>

                    <Text style={s.menuSubtitle}>
                      {item.subtitle}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color="#41689E"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* ==================================
                INFORMACIÓN
            ================================== */}

            <View style={s.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={21}
                color="#1673E8"
              />

              <Text style={s.infoText}>
                Consulta los espacios disponibles
                y reserva uno para estacionar
                tu vehículo.
              </Text>
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
    height: 190,
    paddingTop: 24,
    paddingHorizontal: 22,
    overflow: "hidden",
    position: "relative"
  },

  circleOne: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -150,
    right: -70
  },

  circleTwo: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.06)",
    left: -100,
    top: 40
  },

  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    zIndex: 2
  },

  logoContainer: {
    width: 58,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },

  scanIcon: {
    position: "absolute"
  },

  carIcon: {
    position: "absolute"
  },

  heroTextContainer: {
    flex: 1
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 25
  },

  heroSubtitle: {
    color: "#DCEBFF",
    fontSize: 12,
    marginTop: 5
  },

  headerWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72
  },

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 18,
    paddingTop: 15,
    flexGrow: 1
  },

  // ==========================================
  // TARJETA BIENVENIDA
  // ==========================================

  welcomeCard: {
    minHeight: 125,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 19,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 18,

    elevation: 3,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.12,
    shadowRadius: 10
  },

  welcomeTextContainer: {
    flex: 1,
    paddingRight: 6
  },

  welcomeTitle: {
    color: "#102A55",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8
  },

  welcomeDescription: {
    color: "#365D92",
    fontSize: 12,
    lineHeight: 18
  },

  welcomeCarCircle: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(70,151,255,0.13)",
    justifyContent: "center",
    alignItems: "center"
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  statsRow: {
    flexDirection: "row",
    gap: 11,
    marginBottom: 22
  },

  statCard: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E2ECFA",

    elevation: 2,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.07,
    shadowRadius: 8
  },

  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9
  },

  statTextContainer: {
    flex: 1,
    minWidth: 0
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900"
  },

  statLabel: {
    color: "#547095",
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 14
  },

  // ==========================================
  // SECCIÓN
  // ==========================================

  sectionHeader: {
    marginBottom: 13
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 18,
    fontWeight: "900"
  },

  sectionSubtitle: {
    color: "#6E89AD",
    fontSize: 12,
    marginTop: 4
  },

  // ==========================================
  // MENÚ HORIZONTAL
  // ==========================================

  menuContainer: {
    gap: 11
  },

  menuCard: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2ECFA",

    elevation: 3,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.09,
    shadowRadius: 9
  },

  menuIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E2F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },

  menuTextContainer: {
    flex: 1,
    minWidth: 0
  },

  menuTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4
  },

  menuSubtitle: {
    color: "#547095",
    fontSize: 11
  },

  // ==========================================
  // INFORMACIÓN
  // ==========================================

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 15,
    padding: 14,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#D7E7FA"
  },

  infoText: {
    flex: 1,
    color: "#547095",
    fontSize: 12,
    lineHeight: 19
  },

  demoText: {
    color: "#8199B9",
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 8
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
