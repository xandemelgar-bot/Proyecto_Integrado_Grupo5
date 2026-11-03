import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function AdminScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Panel de Administrador</Text>
        <Text style={styles.subtitulo}>Aquí podrás gestionar los espacios y la configuración del estacionamiento.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
