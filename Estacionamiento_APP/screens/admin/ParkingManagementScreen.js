
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

import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// GESTIÓN DE ESPACIOS
// ==========================================

export default function ParkingManagementScreen({
  navigation
}) {
  const { spaces, setSpaceStatus } = useParking();

  const [selectedLevel, setSelectedLevel] = useState(1);

  // ==========================================
  // DATOS DEL NIVEL SELECCIONADO
  // ==========================================

  const levelSpaces = spaces.filter(
    space => space.nivel === selectedLevel
  );

  const total = levelSpaces.length;

  const free = levelSpaces.filter(
    space => space.estado === "libre"
  ).length;

  const occupied = levelSpaces.filter(
    space => space.estado === "ocupado"
  ).length;

  const reserved = levelSpaces.filter(
    space => space.estado === "reservado"
  ).length;

  const availablePercent =
    total > 0
      ? Math.round((free / total) * 100)
      : 0;

  // ==========================================
  // CAMBIAR ESTADO (LÓGICA ORIGINAL)
  // ==========================================

  const change = space => {
    if (space.estado === "reservado") {
      return Alert.alert(
        "Espacio reservado",
        "Cancela primero la reserva."
      );
    }

    Alert.alert(
      `Espacio ${space.id}`,
      "Selecciona el nuevo estado",
      [
        {
          text: "Libre",
          onPress: () =>
            setSpaceStatus(space.id, "libre")
        },
        {
          text: "Ocupado",
          onPress: () =>
            setSpaceStatus(space.id, "ocupado")
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  // ==========================================
  // COLORES DE ESPACIOS
  // ==========================================

  const getSpaceColors = estado => {
    switch (estado) {
      case "libre":
        return {
          background: "#DDF7E9",
          border: "#86D8A6",
          icon: "#16A34A",
          text: "#15803D",
          label: "Libre"
        };

      case "ocupado":
        return {
          background: "#FEE2E2",
          border: "#F5A5A5",
          icon: "#DC2626",
          text: "#B91C1C",
          label: "Ocupado"
        };

      case "reservado":
        return {
          background: "#FFF3DC",
          border: "#F5D28D",
          icon: "#D97706",
          text: "#B7791F",
          label: "Reservado"
        };

      default:
        return {
          background: "#F1F5F9",
          border: "#CBD5E1",
          icon: "#64748B",
          text: "#475569",
          label: estado
        };
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
                Administrar
              </Text>

              <Text style={s.headerTitleSecond}>
                Estacionamiento
              </Text>

              <Text style={s.headerSubtitle}>
                Gestión de espacios por nivel
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="car-sport-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroInfo}>
            <Ionicons
              name="business-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              {spaces.length} espacios distribuidos
              en 2 niveles
            </Text>
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
              SELECCIONAR NIVEL
          ================================== */}

          <View style={s.levelTabs}>
            {[1, 2].map(nivel => {
              const selected =
                selectedLevel === nivel;

              return (
                <TouchableOpacity
                  key={nivel}
                  onPress={() =>
                    setSelectedLevel(nivel)
                  }
                  activeOpacity={0.85}
                  style={s.levelTabWrapper}
                >
                  {selected ? (
                    <LinearGradient
                      colors={[
                        "#2585FF",
                        "#0754C9"
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={s.levelTabActive}
                    >
                      <Ionicons
                        name="layers-outline"
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text style={s.levelTabTextActive}>
                        Nivel {nivel}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={s.levelTabInactive}>
                      <Ionicons
                        name="layers-outline"
                        size={20}
                        color="#6486B3"
                      />

                      <Text style={s.levelTabTextInactive}>
                        Nivel {nivel}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ==================================
              RESUMEN DEL NIVEL
          ================================== */}

          <View style={s.summaryCard}>
            <View style={s.sectionHeader}>
              <View style={s.sectionIcon}>
                <Ionicons
                  name="stats-chart-outline"
                  size={23}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.sectionTitle}>
                  Resumen del nivel {selectedLevel}
                </Text>

                <Text style={s.sectionSubtitle}>
                  Disponibilidad actual
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
                <Text style={s.statFree}>
                  {free}
                </Text>

                <Text style={s.statLabel}>
                  Libres
                </Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statOccupied}>
                  {occupied}
                </Text>

                <Text style={s.statLabel}>
                  Ocupados
                </Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statReserved}>
                  {reserved}
                </Text>

                <Text style={s.statLabel}>
                  Reservados
                </Text>
              </View>
            </View>

            {/* BARRA DE DISPONIBILIDAD */}

            <View style={s.progressHeader}>
              <Text style={s.progressLabel}>
                Espacios disponibles
              </Text>

              <Text style={s.progressPercent}>
                {availablePercent}%
              </Text>
            </View>

            <View style={s.progressTrack}>
              <LinearGradient
                colors={[
                  "#34D399",
                  "#16A34A"
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  s.progressFill,
                  {
                    width: `${availablePercent}%`
                  }
                ]}
              />
            </View>
          </View>

          {/* ==================================
              LEYENDA DE COLORES
          ================================== */}

          <View style={s.legendCard}>
            <Text style={s.legendTitle}>
              Estado de los espacios
            </Text>

            <View style={s.legendRow}>
              <View style={s.legendItem}>
                <View
                  style={[
                    s.legendDot,
                    { backgroundColor: "#16A34A" }
                  ]}
                />
                <Text style={s.legendText}>
                  Libre
                </Text>
              </View>

              <View style={s.legendItem}>
                <View
                  style={[
                    s.legendDot,
                    { backgroundColor: "#DC2626" }
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
                    { backgroundColor: "#F59E0B" }
                  ]}
                />
                <Text style={s.legendText}>
                  Reservado
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              CUADRÍCULA DE ESPACIOS
          ================================== */}

          <View style={s.parkingCard}>
            <View style={s.parkingHeader}>
              <View style={s.parkingHeaderIcon}>
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.parkingTitle}>
                  Espacios del nivel {selectedLevel}
                </Text>

                <Text style={s.parkingSubtitle}>
                  Toca un espacio para cambiar su estado
                </Text>
              </View>
            </View>

            {/* CUADRÍCULA DE 3 COLUMNAS */}

            <View style={s.spacesGrid}>
              {levelSpaces.map(space => {
                const colors = getSpaceColors(
                  space.estado
                );

                return (
                  <TouchableOpacity
                    key={space.id}
                    onPress={() => change(space)}
                    activeOpacity={0.75}
                    style={[
                      s.spaceWrapper,
                      {
                        backgroundColor:
                          colors.background,
                        borderColor:
                          colors.border
                      }
                    ]}
                  >
                    <Ionicons
                      name={
                        space.estado === "reservado"
                          ? "lock-closed-outline"
                          : "car-sport"
                      }
                      size={25}
                      color={colors.icon}
                    />

                    <Text
                      style={[
                        s.spaceId,
                        { color: colors.text }
                      ]}
                    >
                      {space.id}
                    </Text>

                    <Text
                      style={[
                        s.spaceStatus,
                        { color: colors.text }
                      ]}
                    >
                      {colors.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* NOTA INFORMATIVA */}

            <View style={s.infoNotice}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#0964D5"
              />

              <Text style={s.infoNoticeText}>
                Puedes cambiar manualmente los espacios
                libres y ocupados. Para liberar un espacio
                reservado, primero debes cancelar su
                reservación.
              </Text>
            </View>
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
    height: 190,
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

  headerTitleSecond: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900"
  },

  headerSubtitle: {
    color: "#DCEBFF",
    fontSize: 11,
    marginTop: 5
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
    gap: 9,
    marginTop: 22,
    paddingHorizontal: 5
  },

  heroInfoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
  // PESTAÑAS
  // ==========================================

  levelTabs: {
    flexDirection: "row",
    gap: 11,
    marginBottom: 17
  },

  levelTabWrapper: {
    flex: 1
  },

  levelTabActive: {
    minHeight: 53,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9
  },

  levelTabInactive: {
    minHeight: 53,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE8F8"
  },

  levelTabTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },

  levelTabTextInactive: {
    color: "#547095",
    fontSize: 14,
    fontWeight: "800"
  },

  // ==========================================
  // RESUMEN
  // ==========================================

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 16,
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
    gap: 11,
    marginBottom: 20
  },

  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  sectionSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 19
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

  statFree: {
    color: "#16A34A",
    fontSize: 23,
    fontWeight: "900"
  },

  statOccupied: {
    color: "#DC2626",
    fontSize: 23,
    fontWeight: "900"
  },

  statReserved: {
    color: "#D97706",
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
  // LEYENDA
  // ==========================================

  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2ECFA"
  },

  legendTitle: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 14
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 9
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6
  },

  legendText: {
    color: "#547095",
    fontSize: 11,
    fontWeight: "700"
  },

  // ==========================================
  // CUADRÍCULA
  // ==========================================

  parkingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 16,
    marginBottom: 16,
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

  parkingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 19
  },

  parkingHeaderIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  parkingTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  parkingSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16
  },

  spacesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  },

  spaceWrapper: {
    width: "31%",
    minHeight: 100,
    borderWidth: 1.5,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 4
  },

  spaceId: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5
  },

  spaceStatus: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5
  },

  // ==========================================
  // AVISO
  // ==========================================

  infoNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#EFF6FF",
    borderRadius: 13,
    padding: 13,
    marginTop: 20
  },

  infoNoticeText: {
    color: "#547095",
    fontSize: 11,
    lineHeight: 18,
    flex: 1
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
