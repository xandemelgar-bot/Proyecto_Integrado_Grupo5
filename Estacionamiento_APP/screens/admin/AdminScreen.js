
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import COLORS from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';

export default function AdminScreen({ navigation }) {

  // Obtener la función para cerrar sesión
  const { cerrarSesion } = useAuth();

  // Cerrar sesión con confirmación
  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await cerrarSesion();
            } catch (error) {
              console.log('Error al cerrar sesión:', error);

              Alert.alert(
                'Error',
                'No se pudo cerrar la sesión.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* ENCABEZADO */}
      <Text style={styles.title}>
        Panel de administrador
      </Text>

      <Text style={styles.subtitle}>
        Resumen del estacionamiento
      </Text>

      {/* ESTACIONAMIENTOS TOTALES */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Estacionamientos totales
        </Text>

        <Text style={styles.cardValue}>
          24
        </Text>
      </View>

      {/* ESTADÍSTICAS */}
      <View style={styles.row}>

        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>
            Disponibles
          </Text>

          <Text
            style={[
              styles.cardValue,
              { color: COLORS.success },
            ]}
          >
            15
          </Text>
        </View>

        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>
            Ocupados
          </Text>

          <Text
            style={[
              styles.cardValue,
              { color: COLORS.danger },
            ]}
          >
            9
          </Text>
        </View>

      </View>

      {/* ADMINISTRACIÓN */}
      <Text style={styles.sectionTitle}>
        Administración
      </Text>

      {/* BOTÓN DE ESTACIONAMIENTOS */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('ParkingManagement')
        }
      >
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>
            🚗 Monitoreo de estacionamientos
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>
        </View>
      </TouchableOpacity>

      {/* BOTÓN DE RESERVACIONES */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('ReservationsAdmin')
        }
      >
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>
            📅 Gestión de reservaciones
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>
        </View>
      </TouchableOpacity>

      {/* FUNCIONES FUTURAS */}
      <Text style={styles.sectionTitle}>
        Próximas funciones
      </Text>

      <View style={styles.card}>
        <Text style={styles.futureText}>
          💰 Gestión de tarifas
        </Text>

        <Text style={styles.futureText}>
          📊 Reportes de uso
        </Text>

        <Text style={styles.futureText}>
          🧠 Predicciones con IA
        </Text>
      </View>

      {/* AVISO DE DATOS SIMULADOS */}
      <Text style={styles.note}>
        Las estadísticas mostradas son simuladas.
        Próximamente se conectarán con Firebase
        y los sensores Arduino.
      </Text>

      {/* BOTÓN CERRAR SESIÓN */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleCerrarSesion}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>
          Cerrar sesión
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
    padding: 20,
    paddingBottom: 40,
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

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },

  arrow: {
    fontSize: 25,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },

  futureText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 5,
  },

  note: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: COLORS.danger,
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
