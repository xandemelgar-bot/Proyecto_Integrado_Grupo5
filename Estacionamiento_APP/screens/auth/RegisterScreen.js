
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';

import COLORS from '../../constants/colors';

export default function RegisterScreen() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmar, setConfirmar] = useState('');

    const registrar = () => {
        if (!nombre.trim() || !correo.trim() || !contrasena || !confirmar) {
            Alert.alert('Error', 'Completa todos los campos.');
            return;
        }

        if (contrasena !== confirmar) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        Alert.alert(
            'Registro de prueba',
            'El formulario funciona. Próximamente conectaremos Firebase.'
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Crear cuenta</Text>

            <Text style={styles.subtitle}>
                Regístrate para utilizar el estacionamiento
            </Text>

            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                value={contrasena}
                onChangeText={setContrasena}
            />

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                secureTextEntry
                value={confirmar}
                onChangeText={setConfirmar}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={registrar}
            >
                <Text style={styles.buttonText}>
                    Crear cuenta
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 25,
        paddingTop: 35,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginTop: 8,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        borderRadius: 10,
        marginBottom: 18,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
