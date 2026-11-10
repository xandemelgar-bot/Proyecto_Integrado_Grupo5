import React, { useState } from "react";
import { Text, TextInput, Alert, StyleSheet } from "react-native";
import { Screen, Card, Button, Muted } from "../../components/UI";
import { useAuth } from "../../hooks/useAuth";
import C from "../../constants/colors";

export default function ForgotPasswordScreen({ navigation }) {
    const auth = useAuth();
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!correo.includes("@")) {
            return Alert.alert("Correo inválido", "Escribe un correo válido");
        }

        if (typeof auth.restablecerContrasena !== "function") {
            return Alert.alert(
                "Integración pendiente",
                "Agrega restablecerContrasena a hooks/useAuth.js"
            );
        }

        try {
            setLoading(true);
            await auth.restablecerContrasena(correo.trim().toLowerCase());
            Alert.alert(
                "Solicitud enviada",
                "Si la cuenta existe, recibirás instrucciones por correo."
            );
            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", e.message || "No se pudo enviar el correo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen
            title="Recuperar contraseña"
            subtitle="Te ayudamos a recuperar el acceso"
            navigation={navigation}
        >
            <Card>
                <Muted>Ingresa el correo asociado a tu cuenta.</Muted>

                <Text style={s.label}>Correo electrónico</Text>
                <TextInput
                    style={s.input}
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="ejemplo@correo.com"
                />

                <Button
                    title={loading ? "Enviando..." : "Enviar enlace"}
                    disabled={loading}
                    onPress={send}
                />
            </Card>
        </Screen>
    );
}

const s = StyleSheet.create({
    label: {
        color: C.text,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 8
    },
    input: {
        backgroundColor: C.background,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        color: C.text
    }
});