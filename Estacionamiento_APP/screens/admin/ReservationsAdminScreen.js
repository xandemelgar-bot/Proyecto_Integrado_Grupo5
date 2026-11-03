
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import COLORS from "../../constants/colors";

export default function ReservationsAdminScreen({ navigation }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  const [error, setError] = useState("");

  useEffect(() => {
    const referencia = collection(db, "reservas");

    const cancelar = onSnapshot(
      referencia,
      (snapshot) => {
        const datos = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        datos.sort((a, b) => {
          const fechaA = a.fechaInicio?.toMillis?.() || 0;
          const fechaB = b.fechaInicio?.toMillis?.() || 0;
          return fechaB - fechaA;
        });

        setReservas(datos);
        setCargando(false);
        setActualizando(false);
        setError("");
      },
      (err) => {
        console.log("Error al consultar reservas:", err);
        setError("No se pudieron cargar las reservaciones.");
        setCargando(false);
        setActualizando(false);
      }
    );

    return () => cancelar();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    try {
      const valor = fecha.toDate
        ? fecha.toDate()
        : new Date(fecha);

      return valor.toLocaleString("es-GT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "activa":
        return "#16A34A";
      case "pendiente":
        return "#F59E0B";
      case "finalizada":
        return "#64748B";
      case "cancelada":
        return "#DC2626";
      default:
        return "#64748B";
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtro === "todas") return true;
    return reserva.estado === filtro;
  });

  const totalActivas = reservas.filter(
    (r) => r.estado === "activa"
  ).length;

  const totalPendientes = reservas.filter(
    (r) => r.estado === "pendiente"
  ).length;

  const totalFinalizadas = reservas.filter(
    (r) => r.estado === "finalizada"
  ).length;

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
        <Text style={styles.mensaje}>
          Cargando reservaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={actualizando}
            onRefresh={() => {
              // onSnapshot mantiene los datos actualizados
              // automáticamente.
              setActualizando(false);
            }}
          />
        }
      >
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Reservaciones
          </Text>

          <Text style={styles.subtitle}>
            Administración de reservas del estacionamiento
          </Text>
        </View>

        {/* ESTADÍSTICAS */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Total de reservaciones
          </Text>

          <Text style={styles.totalValue}>
            {reservas.length}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Activas</Text>
            <Text
              style={[
                styles.statValue,
                { color: "#16A34A" },
              ]}
            >
              {totalActivas}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pendientes</Text>
            <Text
              style={[
                styles.statValue,
                { color: "#F59E0B" },
              ]}
            >
              {totalPendientes}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Finalizadas</Text>
            <Text
              style={[
                styles.statValue,
                { color: "#64748B" },
              ]}
            >
              {totalFinalizadas}
            </Text>
          </View>
        </View>

        {/* FILTROS */}
        <Text style={styles.sectionTitle}>
          Filtrar reservaciones
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {[
            { id: "todas", nombre: "Todas" },
            { id: "activa", nombre: "Activas" },
            { id: "pendiente", nombre: "Pendientes" },
            { id: "finalizada", nombre: "Finalizadas" },
            { id: "cancelada", nombre: "Canceladas" },
          ].map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={[
                styles.filterButton,
                filtro === opcion.id &&
                  styles.filterButtonActive,
              ]}
              onPress={() => setFiltro(opcion.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === opcion.id &&
                    styles.filterTextActive,
                ]}
              >
                {opcion.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LISTA DE RESERVAS */}
        <Text style={styles.sectionTitle}>
          Lista de reservaciones
        </Text>

        {error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : reservasFiltradas.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
              No hay reservaciones
            </Text>
            <Text style={styles.emptyDescription}>
              Todavía no existen reservaciones
              con este estado.
            </Text>
          </View>
        ) : (
          reservasFiltradas.map((reserva) => (
            <View
              key={reserva.id}
              style={styles.reservationCard}
            >
              <View style={styles.reservationHeader}>
                <View>
                  <Text style={styles.spaceLabel}>
                    Espacio
                  </Text>

                  <Text style={styles.spaceNumber}>
                    {reserva.espacioId || "Sin asignar"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        obtenerColorEstado(reserva.estado) +
                        "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: obtenerColorEstado(
                          reserva.estado
                        ),
                      },
                    ]}
                  >
                    {reserva.estado || "Desconocido"}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.detailText}>
                👤 Usuario: {reserva.usuarioId || "N/D"}
              </Text>

              <Text style={styles.detailText}>
                📅 Inicio: {formatearFecha(reserva.fechaInicio)}
              </Text>

              <Text style={styles.detailText}>
                🕒 Finalización: {formatearFecha(reserva.fechaFin)}
              </Text>

              <Text style={styles.detailText}>
                ⏱️ Duración: {reserva.duracionMinutos || 0} minutos
              </Text>

              <Text style={styles.detailText}>
                💳 Pago: {reserva.estadoPago || "pendiente"}
              </Text>

              <Text style={styles.reservationId}>
                ID: {reserva.id}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  mensaje: {
    color: COLORS.textSecondary,
    marginTop: 15,
  },

  header: {
    marginBottom: 20,
  },

  backButton: {
    marginBottom: 15,
  },

  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  totalCard: {
    backgroundColor: COLORS.primary,
    padding: 22,
    borderRadius: 14,
    marginBottom: 15,
  },

  totalLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 13,
    alignItems: "center",
  },

  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  statValue: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
    marginTop: 10,
  },

  filtersContainer: {
    marginBottom: 20,
  },

  filterButton: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  reservationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
  },

  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  spaceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  spaceNumber: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.text,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  detailText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 9,
  },

  reservationId: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 8,
  },

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },

  errorText: {
    color: COLORS.danger,
    textAlign: "center",
  },
});
