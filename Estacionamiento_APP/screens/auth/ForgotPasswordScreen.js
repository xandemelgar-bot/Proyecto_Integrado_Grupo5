
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        const correo = email.trim();

        if (!correo) {
            Alert.alert("Campo vacío", "Ingresa tu correo electrónico.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(correo)) {
            Alert.alert("Correo inválido", "Ingresa un correo válido.");
            return;
        }

        try {
            setLoading(true);

            await sendPasswordResetEmail(auth, correo);

            Alert.alert(
                "Solicitud enviada",
                "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log("Error al recuperar contraseña:", error.code);

            if (error.code === "auth/invalid-email") {
                Alert.alert("Error", "El correo electrónico no es válido.");
            } else if (error.code === "auth/too-many-requests") {
                Alert.alert(
                    "Demasiados intentos",
                    "Espera unos minutos antes de intentarlo nuevamente."
                );
            } else {
                Alert.alert(
                    "Error",
                    "No se pudo procesar la solicitud. Verifica tu conexión e inténtalo nuevamente."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🔐</Text>
                </View>

                <Text style={styles.title}>Recuperar contraseña</Text>

                <Text style={styles.subtitle}>
                    Ingresa el correo electrónico asociado a tu cuenta.
                    Te enviaremos un enlace para restablecer tu contraseña.
                </Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Correo electrónico</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        value={email}
                        onChangeText={setEmail}
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Enviar enlace de recuperación
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.backText}>
                            ← Volver al inicio de sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 25,
    },

    iconContainer: {
        alignSelf: "center",
        backgroundColor: "#E3F2FD",
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
    },

    icon: {
        fontSize: 42,
    },

    title: {
        fontSize: 27,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
        marginBottom: 15,
    },

    subtitle: {
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 23,
        marginBottom: 35,
    },

    form: {
        width: "100%",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 10,
    },

    input: {
        height: 55,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#1E293B",
        marginBottom: 25,
    },

    button: {
        backgroundColor: "#2563EB",
        height: 55,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    backButton: {
        marginTop: 25,
        alignItems: "center",
    },

    backText: {
        color: "#2563EB",
        fontSize: 15,
        fontWeight: "600",
    },
});
