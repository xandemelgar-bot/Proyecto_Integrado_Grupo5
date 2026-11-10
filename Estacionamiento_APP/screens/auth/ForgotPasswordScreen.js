
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    StatusBar
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { useAuth } from "../../hooks/useAuth";

// ==========================================
// FORGOT PASSWORD SCREEN
// ==========================================

export default function ForgotPasswordScreen({ navigation }) {
    const auth = useAuth();

    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // LÓGICA ORIGINAL - SIN MODIFICACIONES
    // ==========================================

    const send = async () => {
        if (!correo.includes("@")) {
            return Alert.alert(
                "Correo inválido",
                "Escribe un correo válido"
            );
        }

        if (typeof auth.restablecerContrasena !== "function") {
            return Alert.alert(
                "Integración pendiente",
                "Agrega restablecerContrasena a hooks/useAuth.js"
            );
        }

        try {
            setLoading(true);

            await auth.restablecerContrasena(
                correo.trim().toLowerCase()
            );

            Alert.alert(
                "Solicitud enviada",
                "Si la cuenta existe, recibirás instrucciones por correo."
            );

            navigation.goBack();
        } catch (e) {
            Alert.alert(
                "Error",
                e.message || "No se pudo enviar el correo"
            );
        } finally {
            setLoading(false);
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

            <KeyboardAvoidingView
                style={s.main}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    style={s.scrollView}
                    contentContainerStyle={s.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* FONDO GENERAL */}

                    <LinearGradient
                        colors={[
                            "#EAF4FF",
                            "#F8FBFF",
                            "#D5E9FF"
                        ]}
                        locations={[0, 0.55, 1]}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* ==================================
              ENCABEZADO AZUL
          ================================== */}

                    <LinearGradient
                        colors={[
                            "#0754BD",
                            "#1673E8",
                            "#67B1FF"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.hero}
                    >
                        {/* CÍRCULOS DECORATIVOS */}

                        <View style={s.circleOne} />
                        <View style={s.circleTwo} />

                        {/* BOTÓN REGRESAR */}

                        <TouchableOpacity
                            style={s.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={23}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        {/* ICONO PRINCIPAL */}

                        <View style={s.logoContainer}>
                            <Ionicons
                                name="key-outline"
                                size={46}
                                color="#FFFFFF"
                            />
                        </View>

                        {/* TÍTULO */}

                        <Text style={s.brand}>
                            Recuperar contraseña
                        </Text>

                        <Text style={s.tag}>
                            Te ayudamos a recuperar el acceso
                        </Text>
                    </LinearGradient>

                    {/* ==================================
              CONTENEDOR CENTRADO
          ================================== */}

                    <View style={s.formContainer}>
                        <View style={s.card}>
                            {/* LÍNEA SUPERIOR */}

                            <LinearGradient
                                colors={[
                                    "#0754BD",
                                    "#2585FF",
                                    "#8BC5FF"
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={s.cardAccent}
                            />

                            {/* ICONO DECORATIVO */}

                            <View style={s.infoIconContainer}>
                                <LinearGradient
                                    colors={[
                                        "#EAF4FF",
                                        "#D6E9FF"
                                    ]}
                                    style={s.infoIconBackground}
                                >
                                    <Ionicons
                                        name="mail-unread-outline"
                                        size={36}
                                        color="#1165D8"
                                    />
                                </LinearGradient>
                            </View>

                            {/* TÍTULO DEL FORMULARIO */}

                            <Text style={s.title}>
                                ¿Olvidaste tu contraseña?
                            </Text>

                            <Text style={s.subtitle}>
                                No te preocupes, te ayudaremos
                                a recuperar el acceso a tu cuenta.
                            </Text>

                            {/* INDICACIONES */}

                            <View style={s.infoBox}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={22}
                                    color="#1673E8"
                                />

                                <Text style={s.infoText}>
                                    Ingresa el correo asociado a tu cuenta.
                                </Text>
                            </View>

                            {/* ==================================
                  CORREO ELECTRÓNICO
              ================================== */}

                            <Text style={s.label}>
                                Correo electrónico
                            </Text>

                            <View style={s.field}>
                                <View style={s.fieldIcon}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={21}
                                        color="#1673E8"
                                    />
                                </View>

                                <TextInput
                                    style={s.input}
                                    value={correo}
                                    onChangeText={setCorreo}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="ejemplo@correo.com"
                                    placeholderTextColor="#91A5C0"
                                    editable={!loading}
                                />
                            </View>

                            {/* ==================================
                  BOTÓN ENVIAR ENLACE
              ================================== */}

                            <TouchableOpacity
                                onPress={send}
                                disabled={loading}
                                activeOpacity={0.85}
                                style={s.buttonWrapper}
                            >
                                <LinearGradient
                                    colors={[
                                        "#2585FF",
                                        "#0754C9"
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={s.button}
                                >
                                    {loading ? (
                                        <View style={s.buttonContent}>
                                            <ActivityIndicator
                                                color="#FFFFFF"
                                                size="small"
                                            />

                                            <Text style={s.buttonText}>
                                                Enviando...
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={s.buttonContent}>
                                            <Ionicons
                                                name="send-outline"
                                                size={21}
                                                color="#FFFFFF"
                                            />

                                            <Text style={s.buttonText}>
                                                Enviar enlace
                                            </Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* ==================================
                  BOTÓN REGRESAR
              ================================== */}

                            <TouchableOpacity
                                style={s.loginButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="arrow-back-outline"
                                    size={18}
                                    color="#1165D8"
                                />

                                <Text style={s.loginText}>
                                    Volver a iniciar sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ==================================
              ONDAS INFERIORES
          ================================== */}

                    <View
                        style={s.bottomDecoration}
                        pointerEvents="none"
                    >
                        <Svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 400 120"
                            preserveAspectRatio="none"
                        >
                            <Path
                                d="
                  M0 45
                  C110 -5 230 105 400 25
                  L400 120
                  L0 120 Z
                "
                                fill="#8BC5FF"
                                opacity={0.45}
                            />

                            <Path
                                d="
                  M0 85
                  C130 25 270 135 400 55
                  L400 120
                  L0 120 Z
                "
                                fill="#2585FF"
                                opacity={0.8}
                            />

                            <Path
                                d="
                  M0 110
                  C150 55 260 150 400 80
                  L400 120
                  L0 120 Z
                "
                                fill="#0754C9"
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

    main: {
        flex: 1,
        backgroundColor: "#EAF4FF"
    },

    scrollView: {
        flex: 1
    },

    scroll: {
        flexGrow: 1,
        paddingBottom: 0
    },

    // ==========================================
    // ENCABEZADO
    // ==========================================

    hero: {
        alignItems: "center",
        paddingTop: 20,
        paddingHorizontal: 25,
        paddingBottom: 28,
        overflow: "hidden",
        position: "relative",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },

    circleOne: {
        position: "absolute",
        width: 230,
        height: 230,
        borderRadius: 115,
        backgroundColor: "rgba(255,255,255,0.09)",
        top: -110,
        right: -90
    },

    circleTwo: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: "rgba(255,255,255,0.08)",
        left: -90,
        top: 80
    },

    backButton: {
        position: "absolute",
        top: 18,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2
    },

    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.16)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12
    },

    brand: {
        fontSize: 25,
        fontWeight: "900",
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: 32,
        letterSpacing: -0.5
    },

    tag: {
        color: "#EAF4FF",
        textAlign: "center",
        marginTop: 8,
        fontSize: 13,
        fontWeight: "500"
    },

    // ==========================================
    // CONTENEDOR DEL FORMULARIO
    // ==========================================

    formContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingTop: 24,
        paddingBottom: 20
    },

    // ==========================================
    // TARJETA
    // ==========================================

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        marginHorizontal: 20,
        paddingHorizontal: 22,
        paddingTop: 28,
        paddingBottom: 26,

        elevation: 9,

        shadowColor: "#0754BD",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.16,
        shadowRadius: 18,

        borderWidth: 1,
        borderColor: "#E2EEFC",
        overflow: "hidden"
    },

    cardAccent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 5
    },

    // ==========================================
    // ICONO DEL FORMULARIO
    // ==========================================

    infoIconContainer: {
        alignItems: "center",
        marginBottom: 16
    },

    infoIconBackground: {
        width: 76,
        height: 76,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center"
    },

    // ==========================================
    // TÍTULOS
    // ==========================================

    title: {
        fontSize: 23,
        fontWeight: "900",
        textAlign: "center",
        color: "#102A55"
    },

    subtitle: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 13,
        lineHeight: 20,
        marginTop: 9,
        marginBottom: 22
    },

    // ==========================================
    // CAJA INFORMATIVA
    // ==========================================

    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#EFF6FF",
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#D6E9FF",
        paddingHorizontal: 13,
        paddingVertical: 13,
        marginBottom: 24
    },

    infoText: {
        flex: 1,
        color: "#42638C",
        fontSize: 13,
        lineHeight: 19
    },

    // ==========================================
    // CAMPOS
    // ==========================================

    label: {
        color: "#24436C",
        fontWeight: "700",
        fontSize: 13,
        marginBottom: 9,
        marginLeft: 3
    },

    field: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        backgroundColor: "#F5F9FF",
        borderWidth: 1,
        borderColor: "#D6E5F8",
        borderRadius: 14,
        paddingHorizontal: 12,
        marginBottom: 22,
        minHeight: 54
    },

    fieldIcon: {
        width: 31,
        height: 34,
        justifyContent: "center",
        alignItems: "center"
    },

    input: {
        flex: 1,
        minWidth: 0,
        color: "#102A55",
        fontSize: 14,
        paddingVertical: 12
    },

    // ==========================================
    // BOTÓN PRINCIPAL
    // ==========================================

    buttonWrapper: {
        borderRadius: 14,
        overflow: "hidden",
        elevation: 5,

        shadowColor: "#0754BD",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 9
    },

    button: {
        minHeight: 56,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14
    },

    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 16
    },

    // ==========================================
    // BOTÓN VOLVER
    // ==========================================

    loginButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 25,
        paddingVertical: 8
    },

    loginText: {
        color: "#1165D8",
        fontWeight: "800",
        fontSize: 14
    },

    // ==========================================
    // ONDAS INFERIORES
    // ==========================================

    bottomDecoration: {
        height: 115,
        width: "100%",
        justifyContent: "flex-end",
        flexShrink: 0
    }
});
