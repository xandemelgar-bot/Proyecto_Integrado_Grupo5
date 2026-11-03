
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import COLORS from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>🚗</Text>

        <Text style={styles.title}>
          Estacionamiento Inteligente
        </Text>

        <Text style={styles.subtitle}>
          Inicia sesión para continuar
        </Text>

        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />

        <Text style={styles.demoTitle}>
          Accesos de prueba
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Usuario')}
        >
          <Text style={styles.buttonText}>
            Entrar como usuario
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Administrador')}
        >
          <Text style={styles.secondaryButtonText}>
            Entrar como administrador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  content: {
    padding: 25,
  },
  icon: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
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
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 15,
  },
  demoTitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 5,
    fontSize: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
  },
});
