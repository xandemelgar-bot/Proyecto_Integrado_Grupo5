
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";

// Generar los 24 estacionamientos
const crearEspacios = () => {
  const espacios = [];

  for (let nivel = 1; nivel <= 2; nivel++) {
    for (let numero = 1; numero <= 12; numero++) {
      espacios.push({
        id: `${nivel === 1 ? "A" : "B"}${String(numero).padStart(2, "0")}`,
        nivel,
        estado: "libre",
      });
    }
  }

  return espacios;
};

const COLORES = {
  principal: "#2563EB",
  fondo: "#F4F7FB",
  blanco: "#FFFFFF",
  texto: "#1E293B",
  secundario: "#64748B",
  borde: "#E2E8F0",
  libre: "#16A34A",
  ocupado: "#DC2626",
  reservado: "#F59E0B",
  deshabilitado: "#64748B",
};

const ESTADOS = {
  libre: {
    nombre: "Libre",
    color: COLORES.libre,
    fondo: "#DCFCE7",
  },
  ocupado: {
    nombre: "Ocupado",
    color: COLORES.ocupado,
    fondo: "#FEE2E2",
  },
  reservado: {
    nombre: "Reservado",
    color: COLORES.reservado,
    fondo: "#FEF3C7",
  },
  deshabilitado: {
    nombre: "Deshabilitado",
    color: COLORES.deshabilitado,
    fondo: "#E2E8F0",
  },
};

export default function ParkingManagementScreen({ navigation }) {
  const [espacios, setEspacios] = useState(crearEspacios);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(1);
  const [filtro, setFiltro] = useState("todos");

  const estadisticas = useMemo(() => {
    return {
      total: espacios.length,
      libres: espacios.filter((e) => e.estado === "libre").length,
      ocupados: espacios.filter((e) => e.estado === "ocupado").length,
      reservados: espacios.filter((e) => e.estado === "reservado").length,
      deshabilitados: espacios.filter(
        (e) => e.estado === "deshabilitado"
      ).length,
    };
  }, [espacios]);

  const porcentajeOcupacion =
    estadisticas.total > 0
      ? Math.round(
          (estadisticas.ocupados / estadisticas.total) * 100
        )
      : 0;

  const espaciosFiltrados = espacios.filter((espacio) => {
    const mismoNivel = espacio.nivel === nivelSeleccionado;
    const cumpleFiltro =
      filtro === "todos" || espacio.estado === filtro;

    return mismoNivel && cumpleFiltro;
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setEspacios((anteriores) =>
      anteriores.map((espacio) =>
        espacio.id === id
          ? { ...espacio, estado: nuevoEstado }
          : espacio
      )
    );
  };

  const mostrarOpciones = (espacio) => {
    const opciones = [
      {
        text: "Marcar como libre",
        onPress: () => cambiarEstado(espacio.id, "libre"),
      },
      {
        text: "Marcar como ocupado",
        onPress: () => cambiarEstado(espacio.id, "ocupado"),
      },
      {
        text: "Marcar como reservado",
        onPress: () => cambiarEstado(espacio.id, "reservado"),
      },
      {
        text: "Deshabilitar espacio",
        onPress: () =>
          cambiarEstado(espacio.id, "deshabilitado"),
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ];

    Alert.alert(
      `Estacionamiento ${espacio.id}`,
      `Estado actual: ${ESTADOS[espacio.estado].nombre}`,
      opciones
    );
  };

  const renderEstacionamiento = (espacio) => {
    const configuracion = ESTADOS[espacio.estado];

    return (
      <TouchableOpacity
        key={espacio.id}
        style={[
          styles.espacio,
          {
            backgroundColor: configuracion.fondo,
            borderColor: configuracion.color,
          },
        ]}
        onPress={() => mostrarOpciones(espacio)}
        activeOpacity={0.75}
      >
        <Text style={styles.iconoCarro}>
          {espacio.estado === "ocupado"
            ? "🚗"
            : espacio.estado === "reservado"
            ? "🅿️"
            : espacio.estado === "deshabilitado"
            ? "🚫"
            : "🚙"}
        </Text>

        <Text style={styles.numeroEspacio}>{espacio.id}</Text>

        <Text
          style={[
            styles.estadoEspacio,
            { color: configuracion.color },
          ]}
        >
          {configuracion.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEstadistica = (titulo, valor, color) => (
    <View style={styles.tarjetaEstadistica}>
      <View
        style={[
          styles.indicadorEstadistica,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.valorEstadistica}>{valor}</Text>
      <Text style={styles.tituloEstadistica}>{titulo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoVolver}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>
            Gestión de estacionamientos
          </Text>

          <Text style={styles.subtitulo}>
            Supervisa y administra los espacios disponibles.
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.estadisticas}>
          {renderEstadistica(
            "Total",
            estadisticas.total,
            COLORES.principal
          )}

          {renderEstadistica(
            "Libres",
            estadisticas.libres,
            COLORES.libre
          )}

          {renderEstadistica(
            "Ocupados",
            estadisticas.ocupados,
            COLORES.ocupado
          )}

          {renderEstadistica(
            "Reservados",
            estadisticas.reservados,
            COLORES.reservado
          )}
        </View>

        {/* Ocupación general */}
        <View style={styles.tarjetaOcupacion}>
          <View style={styles.filaSeparada}>
            <Text style={styles.tituloSeccion}>
              Ocupación general
            </Text>

            <Text style={styles.porcentaje}>
              {porcentajeOcupacion}%
            </Text>
          </View>

          <View style={styles.barraFondo}>
            <View
              style={[
                styles.barraProgreso,
                { width: `${porcentajeOcupacion}%` },
              ]}
            />
          </View>

          <Text style={styles.detalleOcupacion}>
            {estadisticas.ocupados} de {estadisticas.total} espacios
            ocupados
          </Text>
        </View>

        {/* Selector de niveles */}
        <Text style={styles.tituloSeccion}>
          Seleccionar nivel
        </Text>

        <View style={styles.selectorNiveles}>
          {[1, 2].map((nivel) => (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.botonNivel,
                nivelSeleccionado === nivel &&
                  styles.botonNivelActivo,
              ]}
              onPress={() => setNivelSeleccionado(nivel)}
            >
              <Text
                style={[
                  styles.textoNivel,
                  nivelSeleccionado === nivel &&
                    styles.textoNivelActivo,
                ]}
              >
                Nivel {nivel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filtros */}
        <Text style={styles.tituloSeccion}>
          Filtrar estacionamientos
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contenedorFiltros}
        >
          {[
            { id: "todos", nombre: "Todos" },
            { id: "libre", nombre: "Libres" },
            { id: "ocupado", nombre: "Ocupados" },
            { id: "reservado", nombre: "Reservados" },
            { id: "deshabilitado", nombre: "Deshabilitados" },
          ].map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={[
                styles.botonFiltro,
                filtro === opcion.id &&
                  styles.botonFiltroActivo,
              ]}
              onPress={() => setFiltro(opcion.id)}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  filtro === opcion.id &&
                    styles.textoFiltroActivo,
                ]}
              >
                {opcion.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Espacios */}
        <View style={styles.filaSeparada}>
          <Text style={styles.tituloSeccion}>
            Estacionamientos - Nivel {nivelSeleccionado}
          </Text>
        </View>

        <View style={styles.cuadricula}>
          {espaciosFiltrados.length > 0 ? (
            espaciosFiltrados.map(renderEstacionamiento)
          ) : (
            <Text style={styles.sinResultados}>
              No hay estacionamientos con este estado.
            </Text>
          )}
        </View>

        {/* Leyenda */}
        <View style={styles.leyenda}>
          <Text style={styles.tituloSeccion}>
            Estados de los espacios
          </Text>

          {Object.entries(ESTADOS).map(([clave, valor]) => (
            <View key={clave} style={styles.itemLeyenda}>
              <View
                style={[
                  styles.puntoLeyenda,
                  { backgroundColor: valor.color },
                ]}
              />
              <Text style={styles.textoLeyenda}>
                {valor.nombre}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.nota}>
          Toca un estacionamiento para cambiar su estado.
          Los cambios son temporales hasta conectar Firebase
          y los sensores Arduino.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },

  contenido: {
    padding: 20,
    paddingBottom: 40,
  },

  encabezado: {
    marginBottom: 25,
  },

  botonVolver: {
    marginBottom: 18,
  },

  textoVolver: {
    color: COLORES.principal,
    fontSize: 15,
    fontWeight: "600",
  },

  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORES.texto,
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 14,
    color: COLORES.secundario,
    lineHeight: 21,
  },

  estadisticas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  tarjetaEstadistica: {
    width: "48%",
    backgroundColor: COLORES.blanco,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },

  indicadorEstadistica: {
    width: 25,
    height: 5,
    borderRadius: 3,
    marginBottom: 10,
  },

  valorEstadistica: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORES.texto,
  },

  tituloEstadistica: {
    fontSize: 13,
    color: COLORES.secundario,
    marginTop: 4,
  },

  tarjetaOcupacion: {
    backgroundColor: COLORES.blanco,
    borderRadius: 14,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },

  filaSeparada: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tituloSeccion: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORES.texto,
    marginBottom: 14,
  },

  porcentaje: {
    fontSize: 19,
    fontWeight: "bold",
    color: COLORES.principal,
  },

  barraFondo: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },

  barraProgreso: {
    height: "100%",
    backgroundColor: COLORES.ocupado,
    borderRadius: 10,
  },

  detalleOcupacion: {
    fontSize: 13,
    color: COLORES.secundario,
  },

  selectorNiveles: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  botonNivel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORES.blanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    alignItems: "center",
  },

  botonNivelActivo: {
    backgroundColor: COLORES.principal,
    borderColor: COLORES.principal,
  },

  textoNivel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORES.secundario,
  },

  textoNivelActivo: {
    color: COLORES.blanco,
  },

  contenedorFiltros: {
    marginBottom: 25,
  },

  botonFiltro: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORES.blanco,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginRight: 8,
  },

  botonFiltroActivo: {
    backgroundColor: COLORES.principal,
    borderColor: COLORES.principal,
  },

  textoFiltro: {
    fontSize: 13,
    color: COLORES.secundario,
    fontWeight: "500",
  },

  textoFiltroActivo: {
    color: COLORES.blanco,
  },

  cuadricula: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  espacio: {
    width: "31%",
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    marginBottom: 12,
    minHeight: 110,
  },

  iconoCarro: {
    fontSize: 25,
    marginBottom: 6,
  },

  numeroEspacio: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORES.texto,
  },

  estadoEspacio: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  sinResultados: {
    width: "100%",
    textAlign: "center",
    color: COLORES.secundario,
    paddingVertical: 30,
  },

  leyenda: {
    backgroundColor: COLORES.blanco,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },

  itemLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  puntoLeyenda: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  textoLeyenda: {
    fontSize: 14,
    color: COLORES.texto,
  },

  nota: {
    fontSize: 12,
    color: COLORES.secundario,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 20,
  },
});
