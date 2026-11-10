
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
// PREDICCIONES IA
// ==========================================

export default function PredictionsScreen({ navigation }) {
  const { stats } = useParking();

  // ==========================================
  // ESTADÍSTICAS ACTUALES
  // ==========================================

  const totalSpaces = 24;

  const unavailable = stats.occupied + stats.reserved;

  const occupation = Math.round(
    (unavailable / totalSpaces) * 100
  );

  const availability = Math.round(
    (stats.free / totalSpaces) * 100
  );

  const progressOccupation = Math.max(
    0,
    Math.min(100, occupation)
  );

  const progressAvailability = Math.max(
    0,
    Math.min(100, availability)
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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={s.backButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Regresar"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={s.headerText}>
              <Text style={s.headerTitle}>
                Predicciones IA
              </Text>

              <Text style={s.headerSubtitle}>
                Inteligencia artificial
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="analytics-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroInfo}>
            <Ionicons
              name="hardware-chip-outline"
              size={23}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              Monitoreo de ocupación y preparación
              del sistema predictivo.
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

        {/* ==================================
            CONTENIDO
        ================================== */}

        <View style={s.content}>
          {/* ==================================
              ESTADO DEL MÓDULO
          ================================== */}

          <View style={s.statusCard}>
            <View style={s.statusIcon}>
              <Ionicons
                name="hardware-chip-outline"
                size={26}
                color="#0964D5"
              />
            </View>

            <View style={s.statusContent}>
              <Text style={s.statusTitle}>
                Módulo de inteligencia artificial
              </Text>

              <Text style={s.statusDescription}>
                El modelo predictivo aún no está
                conectado.
              </Text>
            </View>

            <View style={s.pendingBadge}>
              <Text style={s.pendingText}>
                Pendiente
              </Text>
            </View>
          </View>

          {/* ==================================
              ESTADÍSTICAS
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Estado actual
            </Text>
          </View>

          <View style={s.metricsGrid}>
            <View style={s.metricCard}>
              <View style={s.metricIconRed}>
                <Ionicons
                  name="car-sport-outline"
                  size={25}
                  color="#DC2626"
                />
              </View>

              <Text style={s.metricValueRed}>
                {occupation}%
              </Text>

              <Text style={s.metricLabel}>
                No disponibles
              </Text>

              <Text style={s.metricSubtitle}>
                Ocupados y reservados
              </Text>
            </View>

            <View style={s.metricCard}>
              <View style={s.metricIconGreen}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={25}
                  color="#16A34A"
                />
              </View>

              <Text style={s.metricValueGreen}>
                {stats.free}
              </Text>

              <Text style={s.metricLabel}>
                Espacios libres
              </Text>

              <Text style={s.metricSubtitle}>
                De {totalSpaces} espacios
              </Text>
            </View>
          </View>

          {/* ==================================
              OCUPACIÓN ACTUAL
          ================================== */}

          <View style={s.dataCard}>
            <View style={s.cardHeader}>
              <View style={s.cardIcon}>
                <Ionicons
                  name="pie-chart-outline"
                  size={24}
                  color="#0964D5"
                />
              </View>

              <View style={s.cardHeaderText}>
                <Text style={s.cardTitle}>
                  Ocupación actual
                </Text>

                <Text style={s.cardSubtitle}>
                  Estado de los {totalSpaces} espacios
                </Text>
              </View>
            </View>

            <View style={s.highlightBox}>
              <Text style={s.highlightLabel}>
                Espacios no disponibles
              </Text>

              <Text style={s.highlightValue}>
                {unavailable}
                <Text style={s.highlightTotal}>
                  {" / "}{totalSpaces}
                </Text>
              </Text>

              <Text style={s.highlightDescription}>
                Incluye espacios ocupados y reservados
              </Text>
            </View>

            <View style={s.progressHeader}>
              <Text style={s.progressLabel}>
                Porcentaje no disponible
              </Text>

              <Text style={s.progressValueRed}>
                {occupation}%
              </Text>
            </View>

            <View style={s.progressTrack}>
              <View
                style={[
                  s.progressRed,
                  {
                    width: `${progressOccupation}%`
                  }
                ]}
              />
            </View>

            <View style={s.detailRow}>
              <View style={s.detailItem}>
                <View
                  style={[
                    s.detailDot,
                    { backgroundColor: "#DC2626" }
                  ]}
                />

                <Text style={s.detailText}>
                  Ocupados: {stats.occupied}
                </Text>
              </View>

              <View style={s.detailItem}>
                <View
                  style={[
                    s.detailDot,
                    { backgroundColor: "#F59E0B" }
                  ]}
                />

                <Text style={s.detailText}>
                  Reservados: {stats.reserved}
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              DISPONIBILIDAD ACTUAL
          ================================== */}

          <View style={s.dataCard}>
            <View style={s.cardHeader}>
              <View style={s.cardIconGreen}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#16A34A"
                />
              </View>

              <View style={s.cardHeaderText}>
                <Text style={s.cardTitle}>
                  Disponibilidad actual
                </Text>

                <Text style={s.cardSubtitle}>
                  Espacios disponibles para reservar
                </Text>
              </View>
            </View>

            <View style={s.availableBox}>
              <View style={s.availableIcon}>
                <Ionicons
                  name="car-sport"
                  size={32}
                  color="#16A34A"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.availableNumber}>
                  {stats.free}
                </Text>

                <Text style={s.availableText}>
                  espacios disponibles
                </Text>
              </View>
            </View>

            <View style={s.progressHeader}>
              <Text style={s.progressLabel}>
                Disponibilidad del estacionamiento
              </Text>

              <Text style={s.progressValueGreen}>
                {availability}%
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
                  s.progressGreen,
                  {
                    width: `${progressAvailability}%`
                  }
                ]}
              />
            </View>
          </View>

          {/* ==================================
              HORARIOS DE MAYOR DEMANDA
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="time-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Análisis de demanda
            </Text>
          </View>

          <View style={s.pendingCard}>
            <View style={s.pendingIcon}>
              <Ionicons
                name="time-outline"
                size={27}
                color="#D97706"
              />
            </View>

            <View style={s.pendingContent}>
              <Text style={s.pendingTitle}>
                Horarios de mayor demanda
              </Text>

              <Text style={s.pendingDescription}>
                Aún no hay datos históricos
                suficientes para identificar las
                horas de mayor demanda.
              </Text>

              <View style={s.pendingTag}>
                <Ionicons
                  name="hourglass-outline"
                  size={14}
                  color="#B7791F"
                />

                <Text style={s.pendingTagText}>
                  Esperando datos históricos
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              PREDICCIÓN DE OCUPACIÓN
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="analytics-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Predicción de ocupación
            </Text>
          </View>

          <View style={s.predictionCard}>
            <LinearGradient
              colors={[
                "#EAF4FF",
                "#DCEBFF"
              ]}
              style={s.predictionIcon}
            >
              <Ionicons
                name="analytics-outline"
                size={42}
                color="#1673E8"
              />
            </LinearGradient>

            <Text style={s.predictionTitle}>
              Modelo predictivo pendiente
            </Text>

            <Text style={s.predictionDescription}>
              Pendiente de conectar un modelo
              entrenado con registros históricos
              del estacionamiento.
            </Text>

            <View style={s.predictionNotice}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#0964D5"
              />

              <Text style={s.predictionNoticeText}>
                Por ahora se muestran únicamente
                estadísticas actuales, no predicciones.
              </Text>
            </View>
          </View>

          {/* ==================================
              PRÓXIMA INTEGRACIÓN
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="git-branch-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Próxima integración
            </Text>
          </View>

          <View style={s.integrationCard}>
            <View style={s.integrationHeader}>
              <View style={s.integrationIcon}>
                <Ionicons
                  name="construct-outline"
                  size={24}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.integrationTitle}>
                  Implementación del modelo IA
                </Text>

                <Text style={s.integrationSubtitle}>
                  Pasos pendientes del proyecto
                </Text>
              </View>
            </View>

            <View style={s.stepsContainer}>
              <View style={s.stepRow}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>
                    1
                  </Text>
                </View>

                <View style={s.stepContent}>
                  <Text style={s.stepTitle}>
                    Registrar eventos
                  </Text>

                  <Text style={s.stepDescription}>
                    Guardar en Firebase los cambios
                    de ocupación con fecha y hora.
                  </Text>
                </View>
              </View>

              <View style={s.stepDivider} />

              <View style={s.stepRow}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>
                    2
                  </Text>
                </View>

                <View style={s.stepContent}>
                  <Text style={s.stepTitle}>
                    Construir historial
                  </Text>

                  <Text style={s.stepDescription}>
                    Organizar los registros para
                    analizar patrones de ocupación.
                  </Text>
                </View>
              </View>

              <View style={s.stepDivider} />

              <View style={s.stepRow}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>
                    3
                  </Text>
                </View>

                <View style={s.stepContent}>
                  <Text style={s.stepTitle}>
                    Conectar el modelo
                  </Text>

                  <Text style={s.stepDescription}>
                    Entrenar un modelo predictivo
                    y conectarlo mediante una API.
                  </Text>
                </View>
              </View>
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
  // TÍTULOS
  // ==========================================

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 14
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 17,
    fontWeight: "900"
  },

  // ==========================================
  // ESTADO DEL MÓDULO
  // ==========================================

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 15,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: "#E2ECFA",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 3,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.08,
    shadowRadius: 10
  },

  statusIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  statusContent: {
    flex: 1
  },

  statusTitle: {
    color: "#102A55",
    fontSize: 12,
    fontWeight: "900"
  },

  statusDescription: {
    color: "#7891B1",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5
  },

  pendingBadge: {
    backgroundColor: "#FFF3DC",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 7
  },

  pendingText: {
    color: "#B7791F",
    fontSize: 10,
    fontWeight: "900"
  },

  // ==========================================
  // MÉTRICAS
  // ==========================================

  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24
  },

  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 16,
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

  metricIconRed: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14
  },

  metricIconGreen: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#DDF7E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14
  },

  metricValueRed: {
    color: "#DC2626",
    fontSize: 27,
    fontWeight: "900"
  },

  metricValueGreen: {
    color: "#16A34A",
    fontSize: 27,
    fontWeight: "900"
  },

  metricLabel: {
    color: "#102A55",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 7
  },

  metricSubtitle: {
    color: "#7891B1",
    fontSize: 10,
    marginTop: 5
  },

  // ==========================================
  // TARJETAS DE DATOS
  // ==========================================

  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 18,
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
    marginBottom: 19
  },

  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  cardIconGreen: {
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
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16
  },

  // ==========================================
  // OCUPACIÓN
  // ==========================================

  highlightBox: {
    backgroundColor: "#FFF1F1",
    borderRadius: 15,
    padding: 16,
    marginBottom: 19
  },

  highlightLabel: {
    color: "#A13D3D",
    fontSize: 12,
    fontWeight: "700"
  },

  highlightValue: {
    color: "#DC2626",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 7
  },

  highlightTotal: {
    color: "#B77A7A",
    fontSize: 18,
    fontWeight: "700"
  },

  highlightDescription: {
    color: "#A76B6B",
    fontSize: 11,
    marginTop: 6
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 10
  },

  progressLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1
  },

  progressValueRed: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900"
  },

  progressValueGreen: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "900"
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#E5EDF8",
    borderRadius: 10,
    overflow: "hidden"
  },

  progressRed: {
    height: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 10
  },

  progressGreen: {
    height: "100%",
    borderRadius: 10
  },

  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 18
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },

  detailDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },

  detailText: {
    color: "#547095",
    fontSize: 11,
    fontWeight: "700"
  },

  // ==========================================
  // DISPONIBILIDAD
  // ==========================================

  availableBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "#EAF9F0",
    borderRadius: 15,
    padding: 16,
    marginBottom: 19
  },

  availableIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#D2F3DF",
    justifyContent: "center",
    alignItems: "center"
  },

  availableNumber: {
    color: "#16A34A",
    fontSize: 30,
    fontWeight: "900"
  },

  availableText: {
    color: "#43855C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5
  },

  // ==========================================
  // ANÁLISIS PENDIENTE
  // ==========================================

  pendingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: "#E2ECFA",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    elevation: 3,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.08,
    shadowRadius: 10
  },

  pendingIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#FFF3DC",
    justifyContent: "center",
    alignItems: "center"
  },

  pendingContent: {
    flex: 1
  },

  pendingTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  pendingDescription: {
    color: "#7891B1",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9
  },

  pendingTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#FFF3DC",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 14
  },

  pendingTagText: {
    color: "#B7791F",
    fontSize: 10,
    fontWeight: "800"
  },

  // ==========================================
  // PREDICCIÓN
  // ==========================================

  predictionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 20,
    alignItems: "center",
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

  predictionIcon: {
    width: 90,
    height: 90,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 19
  },

  predictionTitle: {
    color: "#102A55",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center"
  },

  predictionDescription: {
    color: "#7891B1",
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 11
  },

  predictionNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#EFF6FF",
    borderRadius: 13,
    padding: 13,
    marginTop: 19,
    width: "100%"
  },

  predictionNoticeText: {
    color: "#547095",
    fontSize: 11,
    lineHeight: 18,
    flex: 1
  },

  // ==========================================
  // INTEGRACIÓN
  // ==========================================

  integrationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 18,
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

  integrationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 21
  },

  integrationIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  integrationTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  integrationSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  stepsContainer: {
    backgroundColor: "#F5F9FF",
    borderRadius: 15,
    padding: 15
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },

  stepNumber: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center"
  },

  stepNumberText: {
    color: "#0754BD",
    fontSize: 13,
    fontWeight: "900"
  },

  stepContent: {
    flex: 1
  },

  stepTitle: {
    color: "#102A55",
    fontSize: 12,
    fontWeight: "900"
  },

  stepDescription: {
    color: "#7891B1",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5
  },

  stepDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#D2E3F8",
    marginLeft: 15,
    marginVertical: 6
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
