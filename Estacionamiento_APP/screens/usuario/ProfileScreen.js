
import React from "react";
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

import { useAuth } from "../../hooks/useAuth";

// ==========================================
// MI PERFIL
// ==========================================

export default function ProfileScreen({ navigation }) {
  const auth = useAuth();

  const user =
    auth.usuario ||
    auth.user ||
    auth.currentUser;

  const nombre =
    user?.displayName ||
    user?.nombre ||
    "Sin nombre registrado";

  const correo =
    user?.email ||
    user?.correo ||
    "No disponible";

  const uid = user?.uid || "No disponible";

  const inicial = nombre !== "Sin nombre registrado"
    ? nombre.charAt(0).toUpperCase()
    : "U";

  // ==========================================
  // CERRAR SESIÓN (LÓGICA ORIGINAL)
  // ==========================================

  const logout = () => {
    if (typeof auth.cerrarSesion !== "function") {
      return Alert.alert(
        "Integración pendiente",
        "Agrega cerrarSesion a useAuth.js"
      );
    }

    Alert.alert(
      "Cerrar sesión",
      "¿Deseas salir de tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Salir",
          onPress: async () => {
            try {
              await auth.cerrarSesion();
            } catch (e) {
              Alert.alert(
                "Error",
                e.message || "No se pudo cerrar sesión"
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
                Mi perfil
              </Text>

              <Text style={s.headerSubtitle}>
                Información de tu cuenta
              </Text>
            </View>

            <View style={s.headerIcon}>
              <Ionicons
                name="person-outline"
                size={26}
                color="#FFFFFF"
              />
            </View>
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
              TARJETA PRINCIPAL DEL PERFIL
          ================================== */}

          <View style={s.profileCard}>
            <LinearGradient
              colors={[
                "#1673E8",
                "#0754C9"
              ]}
              style={s.avatarOuter}
            >
              <View style={s.avatarInner}>
                <Text style={s.avatarLetter}>
                  {inicial}
                </Text>
              </View>
            </LinearGradient>

            <Text style={s.profileName}>
              {nombre}
            </Text>

            <Text style={s.profileEmail}>
              {correo}
            </Text>

            <View style={s.accountBadge}>
              <Ionicons
                name="person-circle-outline"
                size={16}
                color="#0754BD"
              />

              <Text style={s.accountBadgeText}>
                Mi cuenta
              </Text>
            </View>
          </View>

          {/* ==================================
              INFORMACIÓN PERSONAL
          ================================== */}

          <View style={s.infoCard}>
            <View style={s.sectionHeader}>
              <View style={s.sectionIcon}>
                <Ionicons
                  name="person-outline"
                  size={23}
                  color="#0964D5"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.sectionTitle}>
                  Información personal
                </Text>

                <Text style={s.sectionSubtitle}>
                  Datos asociados a tu cuenta
                </Text>
              </View>
            </View>

            {/* NOMBRE */}

            <View style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#1673E8"
                />
              </View>

              <View style={s.infoTextContainer}>
                <Text style={s.infoLabel}>
                  Nombre completo
                </Text>

                <Text style={s.infoValue}>
                  {nombre}
                </Text>
              </View>
            </View>

            <View style={s.separator} />

            {/* CORREO */}

            <View style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color="#1673E8"
                />
              </View>

              <View style={s.infoTextContainer}>
                <Text style={s.infoLabel}>
                  Correo electrónico
                </Text>

                <Text style={s.infoValue}>
                  {correo}
                </Text>
              </View>
            </View>

            <View style={s.separator} />

            {/* UID */}

            <View style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons
                  name="finger-print-outline"
                  size={21}
                  color="#1673E8"
                />
              </View>

              <View style={s.infoTextContainer}>
                <Text style={s.infoLabel}>
                  Identificador de usuario
                </Text>

                <Text
                  style={s.uidValue}
                  selectable
                >
                  {uid}
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================
              SEGURIDAD DE LA CUENTA
          ================================== */}

          <View style={s.securityCard}>
            <View style={s.securityIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={25}
                color="#0754BD"
              />
            </View>

            <View style={s.securityText}>
              <Text style={s.securityTitle}>
                Tu cuenta
              </Text>

              <Text style={s.securityDescription}>
                Tus reservaciones y métodos de pago
                están asociados a tu usuario.
              </Text>
            </View>
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
                  Sesión de usuario
                </Text>

                <Text style={s.logoutSubtitle}>
                  Sal de tu cuenta de forma segura
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={logout}
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
    height: 180,
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
    marginTop: -10,
    flexGrow: 1
  },

  // ==========================================
  // TARJETA PRINCIPAL
  // ==========================================

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 17,
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

  avatarOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },

  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)"
  },

  avatarLetter: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900"
  },

  profileName: {
    color: "#102A55",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center"
  },

  profileEmail: {
    color: "#7891B1",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center"
  },

  accountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F1FF",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16
  },

  accountBadgeText: {
    color: "#0754BD",
    fontSize: 11,
    fontWeight: "800"
  },

  // ==========================================
  // INFORMACIÓN PERSONAL
  // ==========================================

  infoCard: {
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 21
  },

  sectionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#E6F1FF",
    justifyContent: "center",
    alignItems: "center"
  },

  sectionTitle: {
    color: "#102A55",
    fontSize: 16,
    fontWeight: "900"
  },

  sectionSubtitle: {
    color: "#7891B1",
    fontSize: 11,
    marginTop: 4
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11
  },

  infoIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center"
  },

  infoTextContainer: {
    flex: 1,
    minWidth: 0
  },

  infoLabel: {
    color: "#7891B1",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 5
  },

  infoValue: {
    color: "#102A55",
    fontSize: 13,
    fontWeight: "800"
  },

  uidValue: {
    color: "#365D92",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 17
  },

  separator: {
    height: 1,
    backgroundColor: "#E9F0FA",
    marginLeft: 55
  },

  // ==========================================
  // SEGURIDAD
  // ==========================================

  securityCard: {
    backgroundColor: "#E0EEFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: "#C6DFFF"
  },

  securityIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center"
  },

  securityText: {
    flex: 1
  },

  securityTitle: {
    color: "#102A55",
    fontSize: 14,
    fontWeight: "900"
  },

  securityDescription: {
    color: "#547095",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5
  },

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  logoutCard: {
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

  logoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18
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
