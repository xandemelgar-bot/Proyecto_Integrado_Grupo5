
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import COLORS from '../../constants/colors';

export default function AdminScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Panel de administrador
      </Text>

      <Text style={styles.subtitle}>
        Resumen del estacionamiento
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Estacionamientos totales
        </Text>
        <Text style={styles.cardValue}>24</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>Disponibles</Text>
          <Text style={[styles.cardValue, { color: COLORS.success }]}>
            15
          </Text>
        </View>

        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>Ocupados</Text>
          <Text style={[styles.cardValue, { color: COLORS.danger }]}>
            9
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Próximas funciones
      </Text>

      <View style={styles.card}>
        <Text>🚗 Monitoreo de estacionamientos</Text>
        <Text>💰 Gestión de tarifas</Text>
        <Text>📊 Reportes de uso</Text>
        <Text>🧠 Predicciones con IA</Text>
      </View>

      <Text style={styles.note}>
        Datos simulados para probar el diseño.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: 25,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    gap: 8,
  },
  cardLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  cardValue: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 15,
  },
  note: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
});
