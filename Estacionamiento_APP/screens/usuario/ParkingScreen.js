
import React, { useState } from "react";
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

// ==========================================
// PANTALLA DE ESTACIONAMIENTOS
// ==========================================

export default function ParkingScreen({ navigation }) {
  const { spaces } = useParking();

  const [nivel, setNivel] = useState(1);
  const { width } = useWindowDimensions();

  // ==========================================
  // LÓGICA ORIGINAL
  // ==========================================

  const selectSpace = space => {
    if (space.estado !== "libre") {
      return Alert.alert(
        "No disponible",
        "Selecciona un espacio verde."
      );
    }

    navigation.navigate("Reservation", {
      spaceId: space.id
    });
  };

  // ==========================================
  // DATOS DEL NIVEL SELECCIONADO
  // ==========================================

  const levelSpaces = spaces.filter(
    space => space.nivel === nivel
  );

  const total = levelSpaces.length;

  const libres = levelSpaces.filter(
    space => space.estado === "libre"
  ).length;

  const ocupados = levelSpaces.filter(
    space => space.estado === "ocupado"
  ).length;

  const reservados = levelSpaces.filter(
    space => space.estado === "reservado"
  ).length;

  // ==========================================
  // CONFIGURACIÓN VISUAL
  // ==========================================

  const getSpaceStyle = estado => {
    switch (estado) {
      case "libre":
        return {
          background: "#D7F5E7",
          border: "#B6EBD1",
          text: "#116C3A",
          icon: "#19A75B",
          iconName: "car-sport"
        };

      case "ocupado":
        return {
          background: "#FBE0E0",
          border: "#F5C5C5",
          text: "#A82020",
          icon: "#E23D36",
          iconName: "car-sport"
        };

      case "reservado":
        return {
          background: "#FFF0C9",
          border: "#F8DFA2",
          text: "#A76500",
          icon: "#F2A900",
          iconName: "calendar"
        };

      default:
        return {
          background: "#EAF0F8",
          border: "#DCE6F2",
          text: "#547095",
          icon: "#7A94B4",
          iconName: "help-circle-outline"
        };
    }
  };

  // Cuatro columnas en teléfonos y seis en pantallas amplias.
  const columns = width >= 700 ? 6 : 4;

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

            {/* BARRA SUPERIOR */}

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

              <Text
                style={s.headerTitle}
                numberOfLines={1}
              >
                Estacionamientos
              </Text>

              <View style={s.headerSpacer} />
            </View>

            {/* ICONO DECORATIVO */}

            <View style={s.heroIllustration}>
              <View style={s.parkingCircle}>
                <Ionicons
                  name="car-sport"
                  size={58}
                  color="#FFFFFF"
                />
              </View>

              <View style={s.parkingBadge}>
                <Ionicons
                  name="business-outline"
                  size={27}
                  color="#0754BD"
                />
              </View>
            </View>

            <Text style={s.heroSubtitle}>
              Consulta los espacios disponibles
              en cada nivel.
            </Text>

            {/* ONDAS DEL ENCABEZADO */}

            <View
              style={s.headerWave}
              pointerEvents="none"
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 400 90"
                preserveAspectRatio="none"
              >
                <Path
                  d="M0 35 C115 90 240 0 400 35 L400 90 L0 90 Z"
                  fill="#8DC4FF"
                  opacity={0.55}
                />

                <Path
                  d="M0 58 C140 10 265 100 400 42 L400 90 L0 90 Z"
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
            <View style={s.parkingPanel}>
              {/* ==================================
                  SELECTOR DE NIVELES
              ================================== */}

              <View style={s.levelSelector}>
                {[1, 2].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setNivel(item)}
                    activeOpacity={0.85}
                    style={s.levelButtonWrapper}
                  >
                    {nivel === item ? (
                      <LinearGradient
                        colors={[
                          "#1673E8",
                          "#0754C9"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.levelButton}
                      >
                        <Text style={s.levelTextActive}>
                          Nivel {item}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.levelButtonInactive}>
                        <Text style={s.levelTextInactive}>
                          Nivel {item}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* ==================================
                  RESUMEN DEL NIVEL
              ================================== */}

              <View style={s.statsCard}>
                <View style={s.statItem}>
                  <View style={s.statTop}>
                    <Ionicons
                      name="car-sport"
                      size={23}
                      color="#1673E8"
                    />

                    <Text style={s.statNumber}>
                      {total}
                    </Text>
                  </View>

                  <Text style={s.statLabel}>
                    Totales
                  </Text>
                </View>

                <View style={s.statDivider} />

                <View style={s.statItem}>
                  <View style={s.statTop}>
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color="#16A34A"
                    />

                    <Text
                      style={[
                        s.statNumber,
                        { color: "#15803D" }
                      ]}
                    >
                      {libres}
                    </Text>
                  </View>

                  <Text style={s.statLabel}>
                    Disponibles
                  </Text>
                </View>

                <View style={s.statDivider} />

                <View style={s.statItem}>
                  <View style={s.statTop}>
                    <Ionicons
                      name="close-circle"
                      size={23}
                      color="#DC2626"
                    />

                    <Text
                      style={[
                        s.statNumber,
                        { color: "#B91C1C" }
                      ]}
                    >
                      {ocupados}
                    </Text>
                  </View>

                  <Text style={s.statLabel}>
                    Ocupados
                  </Text>
                </View>
              </View>

              {/* ==================================
                  LEYENDA
              ================================== */}

              <View style={s.legend}>
                <View style={s.legendItem}>
                  <View
                    style={[
                      s.legendDot,
                      { backgroundColor: "#22C55E" }
                    ]}
                  />

                  <Text style={s.legendText}>
                    Disponible
                  </Text>
                </View>

                <View style={s.legendItem}>
                  <View
                    style={[
                      s.legendDot,
                      { backgroundColor: "#EF4444" }
                    ]}
                  />

                  <Text style={s.legendText}>
                    Ocupado
                  </Text>
                </View>

                <View style={s.legendItem}>
                  <View
                    style={[
                      s.legendDot,
                      { backgroundColor: "#FBBF24" }
                    ]}
                  />

                  <Text style={s.legendText}>
                    Reservado
                  </Text>
                </View>
              </View>

              {/* ==================================
                  CUADRÍCULA DE ESPACIOS
              ================================== */}

              <View style={s.spacesGrid}>
                {levelSpaces.map(space => {
                  const visual = getSpaceStyle(
                    space.estado
                  );

                  return (
                    <TouchableOpacity
                      key={space.id}
                      activeOpacity={0.82}
                      onPress={() => selectSpace(space)}
                      style={[
                        s.spaceCard,
                        {
                          width:
                            columns === 6
                              ? "15.3%"
                              : "23.3%",
                          backgroundColor:
                            visual.background,
                          borderColor:
                            visual.border
                        }
                      ]}
                    >
                      <Text
                        style={[
                          s.spaceNumber,
                          { color: visual.text }
                        ]}
                        numberOfLines={1}
                      >
                        {space.id}
                      </Text>

                      <Ionicons
                        name={visual.iconName}
                        size={29}
                        color={visual.icon}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ==================================
                  INFORMACIÓN DEL NIVEL
              ================================== */}

              <View style={s.levelInfo}>
                <View style={s.levelInfoIcon}>
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color="#1673E8"
                  />
                </View>

                <View style={s.levelInfoText}>
                  <Text style={s.levelInfoTitle}>
                    Nivel {nivel}
                  </Text>

                  <Text style={s.levelInfoDescription}>
                    Selecciona un espacio verde
                    para realizar una reservación.
                  </Text>
                </View>
              </View>

              <Text style={s.reservedCount}>
                Espacios reservados: {reservados}
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
    height: 250,
    paddingTop: 20,
    paddingHorizontal: 20,
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10
  },

  headerSpacer: {
    width: 42
  },

  heroIllustration: {
    alignSelf: "center",
    marginTop: 20,
    position: "relative"
  },

  parkingCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center"
  },

  parkingBadge: {
    position: "absolute",
    right: -12,
    bottom: -5,
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center"
  },

  heroSubtitle: {
    color: "#EAF4FF",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12
  },

  headerWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80
  },

  // ==========================================
  // CONTENIDO
  // ==========================================

  content: {
    paddingHorizontal: 14,
    marginTop: -16,
    zIndex: 2,
    flexGrow: 1
  },

  parkingPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: "#E3EDFB",

    elevation: 4,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },

  // ==========================================
  // SELECTOR DE NIVELES
  // ==========================================

  levelSelector: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F3F7FF",
    padding: 5,
    borderRadius: 17,
    marginBottom: 17
  },

  levelButtonWrapper: {
    flex: 1
  },

  levelButton: {
    minHeight: 43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13
  },

  levelButtonInactive: {
    minHeight: 43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "#E2EDFC"
  },

  levelTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
  },

  levelTextInactive: {
    color: "#24436C",
    fontSize: 14,
    fontWeight: "800"
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    borderRadius: 17,
    paddingVertical: 14,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: "#E3EDFB",
    marginBottom: 18
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    minWidth: 0
  },

  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },

  statNumber: {
    color: "#102A55",
    fontSize: 23,
    fontWeight: "900"
  },

  statLabel: {
    color: "#547095",
    fontSize: 10,
    marginTop: 4,
    textAlign: "center"
  },

  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#D6E4F5"
  },

  // ==========================================
  // LEYENDA
  // ==========================================

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 13,
    marginBottom: 20
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },

  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6
  },

  legendText: {
    color: "#365D92",
    fontSize: 10,
    fontWeight: "600"
  },

  // ==========================================
  // CUADRÍCULA
  // ==========================================

  spacesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 19
  },

  spaceCard: {
    minHeight: 78,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6
  },

  spaceNumber: {
    fontSize: 16,
    fontWeight: "900"
  },

  // ==========================================
  // INFORMACIÓN
  // ==========================================

  levelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 13,
    marginBottom: 12
  },

  levelInfoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center"
  },

  levelInfoText: {
    flex: 1
  },

  levelInfoTitle: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4
  },

  levelInfoDescription: {
    color: "#547095",
    fontSize: 11,
    lineHeight: 17
  },

  reservedCount: {
    color: "#8199B9",
    fontSize: 11,
    textAlign: "center"
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
