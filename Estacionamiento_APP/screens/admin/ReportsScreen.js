
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

import { money } from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// BARRA DE ESTADÍSTICA
// ==========================================

function Bar({
  label,
  value,
  max,
  color = "#0964D5",
  icon
}) {
  const percent = max
    ? Math.max(
      0,
      Math.min(100, (value / max) * 100)
    )
    : 0;

  return (
    <View style={s.barContainer}>
      <View style={s.barHeader}>
        <View style={s.barLabelRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={19}
              color={color}
            />
          )}

          <Text style={s.barLabel}>
            {label}
          </Text>
        </View>

        <Text style={[s.barValue, { color }]}>
          {value}
        </Text>
      </View>

      <View style={s.barTrack}>
        <View
          style={[
            s.barFill,
            {
              width: `${percent}%`,
              backgroundColor: color
            }
          ]}
        />
      </View>
    </View>
  );
}

// ==========================================
// PANTALLA DE REPORTES
// ==========================================

export default function ReportsScreen({ navigation }) {
  const { stats, reservations, payments } =
    useParking();

  // ==========================================
  // CÁLCULOS ORIGINALES
  // ==========================================

  const days = Array.from(
    { length: 7 },
    (_, i) => {
      const date = new Date();

      date.setDate(
        date.getDate() - (6 - i)
      );

      return {
        date: [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0")
        ].join("-"),

        label: date.toLocaleDateString(
          "es-GT",
          {
            weekday: "short"
          }
        )
      };
    }
  );

  const incomeByDay = days.map(day => ({
    ...day,

    amount: payments
      .filter(
        p => p.date.slice(0, 10) === day.date
      )
      .reduce(
        (total, p) => total + p.amount,
        0
      )
  }));

  const maxIncome = Math.max(
    1,
    ...incomeByDay.map(d => d.amount)
  );

  const totalHours = reservations.reduce(
    (total, r) => total + r.hours,
    0
  );

  const totalSpaces =
    stats.free + stats.occupied + stats.reserved;

  const occupiedPercent =
    totalSpaces > 0
      ? Math.round(
        (stats.occupied / totalSpaces) * 100
      )
      : 0;

  const incomeLast7Days = incomeByDay.reduce(
    (total, day) => total + day.amount,
    0
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
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={s.headerText}>
              <Text style={s.headerTitle}>
                Reportes
              </Text>

              <Text style={s.headerSubtitle}>
                Estadísticas del estacionamiento
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="bar-chart-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={s.heroInfo}>
            <Ionicons
              name="analytics-outline"
              size={23}
              color="#FFFFFF"
            />

            <Text style={s.heroInfoText}>
              Consulta la ocupación, las reservas
              y los ingresos simulados.
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
              RESUMEN SUPERIOR
          ================================== */}

          <View style={s.summaryGrid}>
            <View style={s.summaryCard}>
              <View
                style={[
                  s.summaryIcon,
                  {
                    backgroundColor: "#E6F1FF"
                  }
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color="#0964D5"
                />
              </View>

              <Text style={s.summaryValue}>
                {reservations.length}
              </Text>

              <Text style={s.summaryLabel}>
                Reservaciones
              </Text>
            </View>

            <View style={s.summaryCard}>
              <View
                style={[
                  s.summaryIcon,
                  {
                    backgroundColor: "#DDF7E9"
                  }
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color="#16A34A"
                />
              </View>

              <Text
                style={[
                  s.summaryValue,
                  { color: "#16A34A" }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {money(stats.income)}
              </Text>

              <Text style={s.summaryLabel}>
                Ingresos simulados
              </Text>
            </View>
          </View>

          {/* ==================================
              OCUPACIÓN ACTUAL
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="car-sport-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Ocupación actual
            </Text>
          </View>

          <View style={s.occupationCard}>
            <View style={s.cardHeader}>
              <View style={s.cardHeaderIcon}>
                <Ionicons
                  name="stats-chart-outline"
                  size={23}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>
                  Estado de los espacios
                </Text>

                <Text style={s.cardSubtitle}>
                  Distribución actual del estacionamiento
                </Text>
              </View>
            </View>

            {/* INDICADOR PRINCIPAL */}

            <View style={s.occupationHighlight}>
              <View>
                <Text style={s.occupationLabel}>
                  Ocupación
                </Text>

                <Text style={s.occupationPercent}>
                  {occupiedPercent}%
                </Text>
              </View>

              <View style={s.occupationIcon}>
                <Ionicons
                  name="car-sport"
                  size={31}
                  color="#0964D5"
                />
              </View>
            </View>

            {/* BARRAS DE OCUPACIÓN */}

            <Bar
              label="Libres"
              value={stats.free}
              max={totalSpaces}
              color="#16A34A"
              icon="checkmark-circle-outline"
            />

            <Bar
              label="Ocupados"
              value={stats.occupied}
              max={totalSpaces}
              color="#DC2626"
              icon="car-sport-outline"
            />

            <Bar
              label="Reservados"
              value={stats.reserved}
              max={totalSpaces}
              color="#F59E0B"
              icon="calendar-outline"
            />

            {/* TOTAL */}

            <View style={s.totalSpacesRow}>
              <Text style={s.totalSpacesLabel}>
                Total de espacios
              </Text>

              <Text style={s.totalSpacesValue}>
                {totalSpaces}
              </Text>
            </View>
          </View>

          {/* ==================================
              RESUMEN GENERAL
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="clipboard-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Resumen general
            </Text>
          </View>

          <View style={s.generalCard}>
            <View style={s.generalRow}>
              <View style={s.generalIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#0964D5"
                />
              </View>

              <View style={s.generalText}>
                <Text style={s.generalLabel}>
                  Reservas registradas
                </Text>

                <Text style={s.generalSubtitle}>
                  Total de reservaciones
                </Text>
              </View>

              <Text style={s.generalValue}>
                {reservations.length}
              </Text>
            </View>

            <View style={s.generalDivider} />

            <View style={s.generalRow}>
              <View
                style={[
                  s.generalIcon,
                  {
                    backgroundColor: "#F1EAFE"
                  }
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color="#7C3AED"
                />
              </View>

              <View style={s.generalText}>
                <Text style={s.generalLabel}>
                  Duración total reservada
                </Text>

                <Text style={s.generalSubtitle}>
                  Horas acumuladas
                </Text>
              </View>

              <Text style={s.generalValue}>
                {totalHours} h
              </Text>
            </View>

            <View style={s.generalDivider} />

            <View style={s.generalRow}>
              <View
                style={[
                  s.generalIcon,
                  {
                    backgroundColor: "#DDF7E9"
                  }
                ]}
              >
                <Ionicons
                  name="wallet-outline"
                  size={22}
                  color="#16A34A"
                />
              </View>

              <View style={s.generalText}>
                <Text style={s.generalLabel}>
                  Ingresos simulados
                </Text>

                <Text style={s.generalSubtitle}>
                  Total registrado
                </Text>
              </View>

              <Text
                style={[
                  s.generalValue,
                  { color: "#16A34A" }
                ]}
              >
                {money(stats.income)}
              </Text>
            </View>
          </View>

          {/* ==================================
              PAGOS DE LOS ÚLTIMOS 7 DÍAS
          ================================== */}

          <View style={s.sectionHeader}>
            <Ionicons
              name="bar-chart-outline"
              size={22}
              color="#0754BD"
            />

            <Text style={s.sectionTitle}>
              Ingresos por día
            </Text>
          </View>

          <View style={s.incomeCard}>
            <View style={s.cardHeader}>
              <View style={s.cardHeaderIcon}>
                <Ionicons
                  name="trending-up-outline"
                  size={23}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>
                  Últimos 7 días
                </Text>

                <Text style={s.cardSubtitle}>
                  Pagos registrados por día
                </Text>
              </View>
            </View>

            {/* TOTAL SEMANAL */}

            <View style={s.weeklyIncome}>
              <Text style={s.weeklyIncomeLabel}>
                Ingresos de los últimos 7 días
              </Text>

              <Text style={s.weeklyIncomeValue}>
                {money(incomeLast7Days)}
              </Text>
            </View>

            {/* GRÁFICA DE COLUMNAS */}

            <View style={s.chartContainer}>
              {incomeByDay.map(day => {
                const percent =
                  maxIncome > 0
                    ? (day.amount / maxIncome) * 100
                    : 0;

                return (
                  <View
                    key={day.date}
                    style={s.chartColumn}
                  >
                    <Text
                      style={s.chartAmount}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {day.amount > 0
                        ? money(day.amount)
                        : "Q0"}
                    </Text>

                    <View style={s.chartTrack}>
                      <LinearGradient
                        colors={[
                          "#53A5FF",
                          "#0754C9"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[
                          s.chartBar,
                          {
                            height: `${percent}%`
                          }
                        ]}
                      />
                    </View>

                    <Text style={s.chartDay}>
                      {day.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={s.chartFooter}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#6486B3"
              />

              <Text style={s.chartFooterText}>
                Los ingresos se agrupan según
                la fecha registrada de cada pago.
              </Text>
            </View>
          </View>

          {/* ==================================
              AVISO DE DATOS SIMULADOS
          ================================== */}

          <View style={s.noticeCard}>
            <View style={s.noticeIcon}>
              <Ionicons
                name="information-circle-outline"
                size={25}
                color="#D97706"
              />
            </View>

            <View style={s.noticeContent}>
              <Text style={s.noticeTitle}>
                Datos de demostración
              </Text>

              <Text style={s.noticeDescription}>
                Estas gráficas utilizan datos
                locales simulados. Todavía no
                representan mediciones históricas
                del Arduino.
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
  // TARJETAS DE RESUMEN
  // ==========================================

  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24
  },

  summaryCard: {
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

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },

  summaryValue: {
    color: "#0754BD",
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 6
  },

  summaryLabel: {
    color: "#7891B1",
    fontSize: 11,
    fontWeight: "700"
  },

  // ==========================================
  // OCUPACIÓN
  // ==========================================

  occupationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 24,
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

  cardHeaderIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
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

  occupationHighlight: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22
  },

  occupationLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "700"
  },

  occupationPercent: {
    color: "#0754BD",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 5
  },

  occupationIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center"
  },

  // ==========================================
  // BARRAS
  // ==========================================

  barContainer: {
    marginBottom: 20
  },

  barHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },

  barLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  barLabel: {
    color: "#365D92",
    fontSize: 12,
    fontWeight: "700"
  },

  barValue: {
    fontSize: 13,
    fontWeight: "900"
  },

  barTrack: {
    height: 12,
    backgroundColor: "#E5EDF8",
    borderRadius: 10,
    overflow: "hidden"
  },

  barFill: {
    height: "100%",
    borderRadius: 10
  },

  totalSpacesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2ECFA"
  },

  totalSpacesLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "700"
  },

  totalSpacesValue: {
    color: "#0754BD",
    fontSize: 16,
    fontWeight: "900"
  },

  // ==========================================
  // RESUMEN GENERAL
  // ==========================================

  generalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 17,
    marginBottom: 24,
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

  generalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7
  },

  generalIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  generalText: {
    flex: 1
  },

  generalLabel: {
    color: "#102A55",
    fontSize: 12,
    fontWeight: "900"
  },

  generalSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  generalValue: {
    color: "#0754BD",
    fontSize: 15,
    fontWeight: "900"
  },

  generalDivider: {
    height: 1,
    backgroundColor: "#E2ECFA",
    marginVertical: 13
  },

  // ==========================================
  // INGRESOS POR DÍA
  // ==========================================

  incomeCard: {
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

  weeklyIncome: {
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 22
  },

  weeklyIncomeLabel: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "700"
  },

  weeklyIncomeValue: {
    color: "#0754BD",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 7
  },

  // ==========================================
  // GRÁFICA
  // ==========================================

  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 230,
    gap: 5,
    paddingBottom: 5
  },

  chartColumn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  chartAmount: {
    color: "#547095",
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    width: "100%"
  },

  chartTrack: {
    width: "80%",
    maxWidth: 38,
    height: 160,
    borderRadius: 9,
    backgroundColor: "#EFF5FC",
    overflow: "hidden",
    justifyContent: "flex-end"
  },

  chartBar: {
    width: "100%",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    minHeight: 0
  },

  chartDay: {
    color: "#7891B1",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 11,
    textTransform: "capitalize"
  },

  chartFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 23,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F5F9FF"
  },

  chartFooterText: {
    color: "#6486B3",
    fontSize: 11,
    lineHeight: 17,
    flex: 1
  },

  // ==========================================
  // AVISO
  // ==========================================

  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFF7E8",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#F5DFB4",
    padding: 16,
    marginBottom: 17
  },

  noticeIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFEDCA",
    justifyContent: "center",
    alignItems: "center"
  },

  noticeContent: {
    flex: 1
  },

  noticeTitle: {
    color: "#9A6700",
    fontSize: 14,
    fontWeight: "900"
  },

  noticeDescription: {
    color: "#9A7A40",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6
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
