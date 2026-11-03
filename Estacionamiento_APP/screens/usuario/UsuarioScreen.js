
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { crearReserva } from '../../services/reservationService';

const espaciosNivel1 = Array.from(
  { length: 12 },
  (_, i) => `A${String(i + 1).padStart(2, '0')}`
);

const espaciosNivel2 = Array.from(
  { length: 12 },
  (_, i) => `B${String(i + 1).padStart(2, '0')}`
);

export default function UsuarioScreen() {
  const [nivel, setNivel] = useState(1);
  const [espacios, setEspacios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [reservando, setReservando] = useState(false);

  // Escuchar los cambios de los espacios en Firebase
  useEffect(() => {
    const referencia = collection(db, 'espacios');

    const cancelarEscucha = onSnapshot(
      referencia,
      (snapshot) => {
        const datos = {};

        snapshot.forEach((documento) => {
          datos[documento.id] = documento.data();
        });

        setEspacios(datos);
        setCargando(false);
      },
      (error) => {
        console.log('Error al cargar espacios:', error);
        setCargando(false);
        Alert.alert('Error', 'No se pudieron cargar los espacios.');
      }
    );

    return cancelarEscucha;
  }, []);

  const listaActual = nivel === 1 ? espaciosNivel1 : espaciosNivel2;

  const obtenerEstado = (id) => {
    return espacios[id]?.estado || 'sin_configurar';
  };

  const contarEstados = (estado) => {
    return [...espaciosNivel1, ...espaciosNivel2].filter(
      (id) => obtenerEstado(id) === estado
    ).length;
  };

  const confirmarReserva = (espacioId) => {
    if (obtenerEstado(espacioId) !== 'libre') {
      Alert.alert('Espacio no disponible', 'Este espacio no se puede reservar.');
      return;
    }

    Alert.alert(
      'Confirmar reservación',
      `¿Deseas reservar el espacio ${espacioId} durante 60 minutos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => reservarEspacio(espacioId),
        },
      ]
    );
  };

  const reservarEspacio = async (espacioId) => {
    try {
      setReservando(true);

      await crearReserva({
        espacioId,
        duracionMinutos: 60,
      });

      Alert.alert(
        '¡Reservación exitosa!',
        `El espacio ${espacioId} quedó reservado durante 60 minutos.`
      );
    } catch (error) {
      console.log('Error al reservar:', error);

      Alert.alert(
        'No se pudo reservar',
        error.message || 'Ocurrió un error al guardar tu reservación.'
      );
    } finally {
      setReservando(false);
    }
  };

  const colorEstado = (estado) => {
    switch (estado) {
      case 'libre':
        return '#2EAD65';
      case 'ocupado':
        return '#E34B4B';
      case 'reservado':
        return '#F0A12B';
      default:
        return '#9CA3AF';
    }
  };

  const nombreEstado = (estado) => {
    switch (estado) {
      case 'libre':
        return 'Disponible';
      case 'ocupado':
        return 'Ocupado';
      case 'reservado':
        return 'Reservado';
      default:
        return 'Sin configurar';
    }
  };

  const renderEspacio = (id) => {
    const estado = obtenerEstado(id);
    const disponible = estado === 'libre';

    return (
      <View key={id} style={styles.card}>
        <View
          style={[
            styles.indicador,
            { backgroundColor: colorEstado(estado) },
          ]}
        />

        <Text style={styles.espacioTexto}>{id}</Text>

        <Text
          style={[
            styles.estadoTexto,
            { color: colorEstado(estado) },
          ]}
        >
          {nombreEstado(estado)}
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            !disponible && styles.botonDeshabilitado,
          ]}
          activeOpacity={0.8}
          disabled={!disponible || reservando}
          onPress={() => confirmarReserva(id)}
        >
          <Text style={styles.botonTexto}>
            {disponible ? 'Reservar' : 'No disponible'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Estacionamiento Inteligente</Text>
          <Text style={styles.subtitulo}>
            Encuentra y reserva tu espacio
          </Text>
        </View>

        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>Disponibilidad general</Text>
          <Text style={styles.total}>
            {contarEstados('libre')} de 24 espacios disponibles
          </Text>

          <View style={styles.estadisticas}>
            <View style={styles.estadistica}>
              <Text style={[styles.numero, { color: '#2EAD65' }]}>
                {contarEstados('libre')}
              </Text>
              <Text style={styles.etiqueta}>Libres</Text>
            </View>

            <View style={styles.estadistica}>
              <Text style={[styles.numero, { color: '#E34B4B' }]}>
                {contarEstados('ocupado')}
              </Text>
              <Text style={styles.etiqueta}>Ocupados</Text>
            </View>

            <View style={styles.estadistica}>
              <Text style={[styles.numero, { color: '#F0A12B' }]}>
                {contarEstados('reservado')}
              </Text>
              <Text style={styles.etiqueta}>Reservados</Text>
            </View>
          </View>
        </View>

        <Text style={styles.seccionTitulo}>Selecciona un nivel</Text>

        <View style={styles.niveles}>
          <TouchableOpacity
            style={[
              styles.nivelBoton,
              nivel === 1 && styles.nivelActivo,
            ]}
            onPress={() => setNivel(1)}
          >
            <Text
              style={[
                styles.nivelTexto,
                nivel === 1 && styles.nivelTextoActivo,
              ]}
            >
              Nivel 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nivelBoton,
              nivel === 2 && styles.nivelActivo,
            ]}
            onPress={() => setNivel(2)}
          >
            <Text
              style={[
                styles.nivelTexto,
                nivel === 2 && styles.nivelTextoActivo,
              ]}
            >
              Nivel 2
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.seccionTitulo}>
          Espacios del nivel {nivel}
        </Text>

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#246BCE"
            style={styles.cargando}
          />
        ) : (
          <View style={styles.grid}>
            {listaActual.map(renderEspacio)}
          </View>
        )}

        {reservando && (
          <View style={styles.procesando}>
            <ActivityIndicator color="#246BCE" />
            <Text style={styles.procesandoTexto}>
              Guardando reservación...
            </Text>
          </View>
        )}

        <View style={styles.leyenda}>
          <Text style={styles.leyendaTitulo}>Estados de los espacios</Text>
          <Text style={styles.leyendaTexto}>🟢 Disponible</Text>
          <Text style={styles.leyendaTexto}>🔴 Ocupado</Text>
          <Text style={styles.leyendaTexto}>🟠 Reservado</Text>
          <Text style={styles.leyendaTexto}>⚪ Sin configurar</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },
  contenido: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#173B67',
    padding: 22,
    borderRadius: 14,
    marginBottom: 18,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#DCE8F5',
    fontSize: 14,
    marginTop: 6,
  },
  resumen: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },
  resumenTitulo: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    color: '#173B67',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 10,
  },
  estadisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
  },
  estadistica: {
    alignItems: 'center',
  },
  numero: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  etiqueta: {
    color: '#666666',
    marginTop: 3,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#26384A',
    marginBottom: 12,
  },
  niveles: {
    flexDirection: 'row',
    marginBottom: 22,
    gap: 10,
  },
  nivelBoton: {
    flex: 1,
    padding: 13,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE2E9',
  },
  nivelActivo: {
    backgroundColor: '#246BCE',
    borderColor: '#246BCE',
  },
  nivelTexto: {
    color: '#333333',
    fontWeight: 'bold',
  },
  nivelTextoActivo: {
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },
  indicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  espacioTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26384A',
  },
  estadoTexto: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 12,
  },
  boton: {
    width: '100%',
    backgroundColor: '#246BCE',
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#AAB2BD',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  leyenda: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  leyendaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#26384A',
    marginBottom: 10,
  },
  leyendaTexto: {
    color: '#555555',
    marginVertical: 3,
  },
  cargando: {
    marginVertical: 35,
  },
  procesando: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 12,
  },
  procesandoTexto: {
    color: '#246BCE',
  },
});
