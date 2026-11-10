
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { money } from "../../components/UI";
import { useParking } from "../../contexts/ParkingContext";

// ==========================================
// CONFIGURACIÓN DE TARIFAS
// ==========================================

export default function TariffsScreen({ navigation }) {
  const { tariff, setTariff } = useParking();

  const [hour, setHour] = useState(
    String(tariff.hour)
  );

  const [minimum, setMinimum] = useState(
    String(tariff.minimum)
  );

  const [grace, setGrace] = useState(
    String(tariff.grace)
  );

  // ==========================================
  // GUARDAR TARIFAS (LÓGICA ORIGINAL)
  // ==========================================

  const save = () => {
    const a = Number(hour);
    const b = Number(minimum);
    const c = Number(grace);

    if (
      ![a, b, c].every(Number.isFinite) ||
      a < 0 ||
      b < 0 ||
      c < 0
    ) {
      return Alert.alert(
        "Datos inválidos",
        "Utiliza números positivos"
      );
    }

    setTariff({
      hour: a,
      minimum: b,
      grace: c
    });

    Alert.alert(
      "Guardado",
      "Tarifas actualizadas para nuevas reservas"
    );
  };

  // ==========================================
  // DATOS PARA LOS CAMPOS
  // ==========================================

  const fields = [
    {
      title: "Precio por hora",
      subtitle: "Costo de cada hora de estacionamiento",
      value: hour,
      setter: setHour,
      icon: "time-outline",
      suffix: "Q"
    },
    {
      title: "Cobro mínimo",
      subtitle: "Importe mínimo por reservación",
      value: minimum,
      setter: setMinimum,
      icon: "wallet-outline",
      suffix: "Q"
    },
    {
      title: "Minutos de gracia",
      subtitle: "Tiempo adicional configurado",
      value: grace,
      setter: setGrace,
      icon: "hourglass-outline",
      suffix: "min"
    }
  ];

  // ==========================================
  // EJEMPLO ORIGINAL
  // ==========================================

  const exampleAmount = Math.max(
    tariff.minimum,
    2 * tariff.hour
  );

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <SafeAreaView
      style={s.safe}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0754BD"
      />

      <KeyboardAvoidingView
        style={s.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          style={s.container}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
                  Tarifas
                </Text>

                <Text style={s.headerSubtitle}>
                  Configuración de cobros simulados
                </Text>
              </View>

              <View style={s.headerIcon}>
                <Ionicons
                  name="wallet-outline"
                  size={27}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View style={s.heroInfo}>
              <Ionicons
                name="cash-outline"
                size={22}
                color="#FFFFFF"
              />

              <Text style={s.heroInfoText}>
                Administra los precios y las reglas
                de cobro del estacionamiento.
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
                RESUMEN DE TARIFA ACTUAL
            ================================== */}

            <LinearGradient
              colors={[
                "#1673E8",
                "#0754C9"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.currentCard}
            >
              <View style={s.currentTopRow}>
                <View style={s.currentIcon}>
                  <Ionicons
                    name="cash-outline"
                    size={25}
                    color="#FFFFFF"
                  />
                </View>

                <View style={s.currentBadge}>
                  <View style={s.currentBadgeDot} />

                  <Text style={s.currentBadgeText}>
                    Tarifa actual
                  </Text>
                </View>
              </View>

              <Text style={s.currentLabel}>
                Precio por hora
              </Text>

              <Text style={s.currentValue}>
                {money(tariff.hour)}
              </Text>

              <View style={s.currentDivider} />

              <View style={s.currentBottomRow}>
                <View style={s.currentDetail}>
                  <Text style={s.currentDetailLabel}>
                    Cobro mínimo
                  </Text>

                  <Text style={s.currentDetailValue}>
                    {money(tariff.minimum)}
                  </Text>
                </View>

                <View style={s.currentDetail}>
                  <Text style={s.currentDetailLabel}>
                    Tiempo de gracia
                  </Text>

                  <Text style={s.currentDetailValue}>
                    {tariff.grace} min
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* ==================================
                REGLAS DE COBRO
            ================================== */}

            <View style={s.sectionHeader}>
              <Ionicons
                name="options-outline"
                size={22}
                color="#0754BD"
              />

              <Text style={s.sectionTitle}>
                Configuración de tarifas
              </Text>
            </View>

            <View style={s.formCard}>
              <View style={s.formHeader}>
                <View style={s.formHeaderIcon}>
                  <Ionicons
                    name="settings-outline"
                    size={23}
                    color="#0964D5"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.formTitle}>
                    Reglas de cobro
                  </Text>

                  <Text style={s.formSubtitle}>
                    Modifica los valores de las tarifas
                  </Text>
                </View>
              </View>

              {/* CAMPOS */}

              {fields.map((field, index) => (
                <View
                  key={index}
                  style={s.fieldContainer}
                >
                  <Text style={s.fieldLabel}>
                    {field.title}
                  </Text>

                  <Text style={s.fieldSubtitle}>
                    {field.subtitle}
                  </Text>

                  <View style={s.inputWrapper}>
                    <View style={s.inputIcon}>
                      <Ionicons
                        name={field.icon}
                        size={21}
                        color="#0964D5"
                      />
                    </View>

                    <TextInput
                      style={s.input}
                      keyboardType="decimal-pad"
                      value={field.value}
                      onChangeText={field.setter}
                      placeholder="0"
                      placeholderTextColor="#9CB1CB"
                      selectTextOnFocus
                    />

                    <View style={s.inputSuffix}>
                      <Text style={s.inputSuffixText}>
                        {field.suffix}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* BOTÓN GUARDAR */}

              <TouchableOpacity
                onPress={save}
                activeOpacity={0.85}
                style={s.saveButtonWrapper}
              >
                <LinearGradient
                  colors={[
                    "#2585FF",
                    "#0754C9"
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.saveButton}
                >
                  <Ionicons
                    name="save-outline"
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text style={s.saveButtonText}>
                    Guardar tarifas
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ==================================
                EJEMPLO DE COBRO
            ================================== */}

            <View style={s.sectionHeader}>
              <Ionicons
                name="calculator-outline"
                size={22}
                color="#0754BD"
              />

              <Text style={s.sectionTitle}>
                Ejemplo de cobro
              </Text>
            </View>

            <View style={s.exampleCard}>
              <View style={s.exampleHeader}>
                <View style={s.exampleIcon}>
                  <Ionicons
                    name="calculator-outline"
                    size={24}
                    color="#0964D5"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.exampleTitle}>
                    Simulación de tarifa
                  </Text>

                  <Text style={s.exampleSubtitle}>
                    Ejemplo de una reservación
                    de 2 horas
                  </Text>
                </View>
              </View>

              <View style={s.exampleDetails}>
                <View style={s.exampleRow}>
                  <Text style={s.exampleLabel}>
                    Duración
                  </Text>

                  <Text style={s.exampleValue}>
                    2 horas
                  </Text>
                </View>

                <View style={s.exampleRow}>
                  <Text style={s.exampleLabel}>
                    Precio por hora
                  </Text>

                  <Text style={s.exampleValue}>
                    {money(tariff.hour)}
                  </Text>
                </View>

                <View style={s.exampleRow}>
                  <Text style={s.exampleLabel}>
                    Cobro mínimo
                  </Text>

                  <Text style={s.exampleValue}>
                    {money(tariff.minimum)}
                  </Text>
                </View>

                <View style={s.exampleDivider} />

                <View style={s.exampleTotalRow}>
                  <Text style={s.exampleTotalLabel}>
                    Total estimado
                  </Text>

                  <Text style={s.exampleTotalValue}>
                    {money(exampleAmount)}
                  </Text>
                </View>
              </View>

              <View style={s.exampleNote}>
                <Ionicons
                  name="information-circle-outline"
                  size={19}
                  color="#0964D5"
                />

                <Text style={s.exampleNoteText}>
                  El ejemplo utiliza las tarifas
                  guardadas actualmente.
                </Text>
              </View>
            </View>

            {/* ==================================
                MINUTOS DE GRACIA
            ================================== */}

            <View style={s.graceCard}>
              <View style={s.graceIcon}>
                <Ionicons
                  name="hourglass-outline"
                  size={25}
                  color="#D97706"
                />
              </View>

              <View style={s.graceContent}>
                <Text style={s.graceTitle}>
                  Minutos de gracia
                </Text>

                <Text style={s.graceDescription}>
                  Los minutos de gracia están
                  configurados, pero todavía no
                  se aplican al cobro real de salida.
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
      </KeyboardAvoidingView>
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

  keyboardContainer: {
    flex: 1
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
  // TARIFA ACTUAL
  // ==========================================

  currentCard: {
    borderRadius: 21,
    padding: 19,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#0754BD",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.12,
    shadowRadius: 12
  },

  currentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19
  },

  currentIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center"
  },

  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.17)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },

  currentBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#86EFAC"
  },

  currentBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800"
  },

  currentLabel: {
    color: "#DCEBFF",
    fontSize: 13,
    fontWeight: "600"
  },

  currentValue: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "900",
    marginTop: 7
  },

  currentDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.23)",
    marginVertical: 19
  },

  currentBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },

  currentDetail: {
    flex: 1
  },

  currentDetailLabel: {
    color: "#DCEBFF",
    fontSize: 11,
    marginBottom: 7
  },

  currentDetailValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900"
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
  // FORMULARIO
  // ==========================================

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
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

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 22
  },

  formHeaderIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  formTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  formSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5
  },

  fieldContainer: {
    marginBottom: 19
  },

  fieldLabel: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5
  },

  fieldSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginBottom: 10
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    borderWidth: 1,
    borderColor: "#DCE8F8",
    borderRadius: 14,
    minHeight: 54,
    overflow: "hidden"
  },

  inputIcon: {
    width: 49,
    justifyContent: "center",
    alignItems: "center"
  },

  input: {
    flex: 1,
    color: "#102A55",
    fontSize: 15,
    fontWeight: "800",
    paddingVertical: 12,
    minWidth: 0
  },

  inputSuffix: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderLeftWidth: 1,
    borderLeftColor: "#DCE8F8"
  },

  inputSuffixText: {
    color: "#547095",
    fontSize: 12,
    fontWeight: "900"
  },

  // ==========================================
  // BOTÓN GUARDAR
  // ==========================================

  saveButtonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4
  },

  saveButton: {
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },

  // ==========================================
  // EJEMPLO
  // ==========================================

  exampleCard: {
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

  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 18
  },

  exampleIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  exampleTitle: {
    color: "#102A55",
    fontSize: 15,
    fontWeight: "900"
  },

  exampleSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16
  },

  exampleDetails: {
    backgroundColor: "#F5F9FF",
    borderRadius: 15,
    padding: 15
  },

  exampleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    gap: 10
  },

  exampleLabel: {
    color: "#7891B1",
    fontSize: 12
  },

  exampleValue: {
    color: "#365D92",
    fontSize: 12,
    fontWeight: "800"
  },

  exampleDivider: {
    height: 1,
    backgroundColor: "#DFEAF8",
    marginBottom: 14
  },

  exampleTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  exampleTotalLabel: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  exampleTotalValue: {
    color: "#0754BD",
    fontSize: 22,
    fontWeight: "900"
  },

  exampleNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#EFF6FF"
  },

  exampleNoteText: {
    color: "#547095",
    fontSize: 11,
    lineHeight: 17,
    flex: 1
  },

  // ==========================================
  // MINUTOS DE GRACIA
  // ==========================================

  graceCard: {
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

  graceIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#FFEDCA",
    justifyContent: "center",
    alignItems: "center"
  },

  graceContent: {
    flex: 1
  },

  graceTitle: {
    color: "#9A6700",
    fontSize: 14,
    fontWeight: "900"
  },

  graceDescription: {
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
