
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
import { socket, conectarSocket } from "../services/socket";

const ParkingContext = createContext(null);

const initialSpaces = Array.from(
  { length: 24 },
  (_, i) => ({
    id: i + 1,
    nivel: i < 12 ? 1 : 2,
    estado: "libre",
  })
);

export function ParkingProvider({ children }) {
  const { usuario, esAdmin } = useAuth();

  const [firebaseSpaces, setFirebaseSpaces] = useState(initialSpaces);
  const [sensorSpaces, setSensorSpaces] = useState({});
  const [arduinoConnected, setArduinoConnected] = useState(false);
  const [arduinoMode, setArduinoMode] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState(false);
  const [parkingLoading, setParkingLoading] = useState(true);

  const [tariff, setTariffLocal] = useState({
    hour: 10,
    minimum: 5,
    grace: 10,
  });

  const notify = (text) => {
    setNotifications((prev) => [
      {
        id: Date.now() + Math.random(),
        text,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // =========================================
  // SINCRONIZACIÓN DE ESPACIOS CON FIREBASE
  // =========================================

  useEffect(() => {
    if (!usuario) {
      setFirebaseSpaces(initialSpaces);
      setConnection(false);
      setParkingLoading(false);
      return;
    }

    setParkingLoading(true);
    setConnection(false);

    const unsubscribe = onSnapshot(
      collection(db, "espacios"),
      (snapshot) => {
        const estados = new Map();

        snapshot.forEach((documento) => {
          const data = documento.data();
          estados.set(Number(documento.id), data.estado);
        });

        setFirebaseSpaces(
          initialSpaces.map((space) => ({
            ...space,
            estado: estados.get(space.id) || "libre",
          }))
        );

        setConnection(true);
        setParkingLoading(false);
      },
      (error) => {
        console.log("Error al cargar espacios:", error);
        setConnection(false);
        setParkingLoading(false);
      }
    );

    return () => unsubscribe();
  }, [usuario?.uid]);

  // =========================================
  // SOCKET.IO - ARDUINO Y SIMULADOR
  // =========================================

  useEffect(() => {
    if (!usuario?.uid) {
      setSensorSpaces({});
      setArduinoConnected(false);
      setArduinoMode(null);
      return;
    }

    const alConectar = () => {
      setArduinoConnected(true);
    };

    const alDesconectar = () => {
      setArduinoConnected(false);
      setSensorSpaces({});
    };

    const alError = (error) => {
      console.log(
        "Error de conexión Socket.IO:",
        error.message
      );

      setArduinoConnected(false);
      setSensorSpaces({});
    };

    const guardarLectura = (space) => {
      const id = Number(space?.id);

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > 24
      ) {
        return;
      }

      if (
        space.estado !== "libre" &&
        space.estado !== "ocupado"
      ) {
        return;
      }

      setSensorSpaces((prev) => ({
        ...prev,
        [id]: space.estado,
      }));
    };

    const alEstadoInicial = (data) => {
      const lecturas = {};

      if (Array.isArray(data?.spaces)) {
        data.spaces.forEach((space) => {
          const id = Number(space?.id);

          if (
            Number.isInteger(id) &&
            id >= 1 &&
            id <= 24 &&
            (
              space.estado === "libre" ||
              space.estado === "ocupado"
            )
          ) {
            lecturas[id] = space.estado;
          }
        });
      }

      setSensorSpaces(lecturas);
      setArduinoMode(data?.mode ?? null);
    };

    socket.on("connect", alConectar);
    socket.on("disconnect", alDesconectar);
    socket.on("connect_error", alError);

    socket.on(
      "parking:initialState",
      alEstadoInicial
    );

    socket.on(
      "parking:spaceUpdate",
      guardarLectura
    );

    if (socket.connected) {
      alConectar();
    }

    conectarSocket();

    return () => {
      socket.off("connect", alConectar);
      socket.off("disconnect", alDesconectar);
      socket.off("connect_error", alError);

      socket.off(
        "parking:initialState",
        alEstadoInicial
      );

      socket.off(
        "parking:spaceUpdate",
        guardarLectura
      );

      socket.disconnect();
    };
  }, [usuario?.uid]);

  // =========================================
  // COMBINAR FIREBASE Y SENSORES
  // =========================================

  // Una reserva tiene prioridad visual.
  // Los datos del simulador no se guardan
  // en Firestore.

  const spaces = useMemo(
    () =>
      firebaseSpaces.map((space) => ({
        ...space,
        estado:
          space.estado === "reservado"
            ? "reservado"
            : arduinoConnected &&
              sensorSpaces[space.id]
              ? sensorSpaces[space.id]
              : space.estado,
      })),
    [
      firebaseSpaces,
      sensorSpaces,
      arduinoConnected,
    ]
  );

  // =========================================
  // SINCRONIZACIÓN DE PAGOS
  // =========================================

  useEffect(() => {
    setPayments([]);

    if (!usuario?.uid) return;

    const referencia = collection(db, "pagos");

    const consulta = esAdmin
      ? query(referencia)
      : query(
        referencia,
        where("userId", "==", usuario.uid)
      );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        setPayments(lista);
      },
      (error) => {
        console.log(
          "Error al cargar pagos:",
          error
        );

        setPayments([]);
      }
    );

    return () => unsubscribe();
  }, [usuario?.uid, esAdmin]);

  // =========================================
  // SINCRONIZACIÓN DE RESERVAS
  // =========================================

  useEffect(() => {
    setReservations([]);
    setNotifications([]);

    if (!usuario) return;

    const referencia = collection(
      db,
      "reservaciones"
    );

    const consulta = esAdmin
      ? query(referencia)
      : query(
        referencia,
        where("userId", "==", usuario.uid)
      );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        lista.sort(
          (a, b) =>
            new Date(b.start).getTime() -
            new Date(a.start).getTime()
        );

        setReservations(lista);
      },
      (error) => {
        console.log(
          "Error al cargar reservas:",
          error
        );

        setReservations([]);
      }
    );

    return () => unsubscribe();
  }, [usuario?.uid, esAdmin]);


  // =========================================
  // CONSULTAR OCUPACIÓN FÍSICA
  // =========================================

  const consultarOcupacionFisica = async (spaceId) => {
    try {
      const referencia = doc(
        db,
        "lecturasSensores",
        String(spaceId)
      );

      const documento = await getDoc(referencia);

      if (!documento.exists()) {
        return {
          disponible: false,
          motivo: "No existe una lectura del sensor.",
        };
      }

      const datos = documento.data();

      if (datos.ocupacionFisica !== "libre") {
        return {
          disponible: false,
          motivo: "El sensor detecta un vehículo.",
        };
      }

      return {
        disponible: true,
      };
    } catch (error) {
      console.log("Error al consultar sensor:", error);

      return {
        disponible: false,
        motivo: "No se pudo comprobar la ocupación.",
      };
    }
  };


  // =========================================
  // CREAR RESERVA
  // =========================================

  const reserve = async (
    spaceId,
    hours = 1
  ) => {
    if (!usuario) {
      return {
        ok: false,
        message: "Debes iniciar sesión.",
      };
    }

    if (!connection) {
      return {
        ok: false,
        message:
          "No hay conexión con el estacionamiento.",
      };
    }

    const id = Number(spaceId);
    const duracion = Number(hours);

    if (
      !Number.isInteger(id) ||
      id < 1 ||
      id > 24 ||
      !Number.isInteger(duracion) ||
      duracion < 1 ||
      duracion > 12
    ) {
      return {
        ok: false,
        message:
          "Espacio o duración inválidos.",
      };
    }


    const lectura = await consultarOcupacionFisica(id);

    if (!lectura.disponible) {
      return {
        ok: false,
        message: lectura.motivo,
      };
    }


    const espacioRef = doc(
      db,
      "espacios",
      String(id)
    );

    const sensorRef = doc(
      db,
      "lecturasSensores",
      String(id)
    );

    const reservaRef = doc(
      collection(db, "reservaciones")
    );

    const importe = Math.max(
      tariff.minimum,
      tariff.hour * duracion
    );

    try {
      const resultado = await runTransaction(
        db,
        async (transaction) => {

          const espacioDoc =
            await transaction.get(espacioRef);

          const sensorDoc =
            await transaction.get(sensorRef);

          if (!sensorDoc.exists()) {
            throw new Error(
              "No hay información del sensor para este espacio."
            );
          }

          const sensor = sensorDoc.data();

          if (sensor.ocupacionFisica !== "libre") {
            throw new Error(
              "No puedes reservar este espacio porque está ocupado."
            );
          }

          // La lectura debe ser reciente.
          const fechaLectura =
            sensor.ultimaLectura?.toMillis?.();
          const antiguedad = Date.now() - fechaLectura;
          const MAX_ANTIGUEDAD = 30000;

          if (
            !Number.isFinite(antiguedad) ||
            antiguedad < 0 ||
            antiguedad > MAX_ANTIGUEDAD
          ) {
            throw new Error(
              "La información del sensor está desactualizada."
            );
          }


          const estado = espacioDoc.exists()
            ? espacioDoc.data().estado
            : "libre";

          if (estado !== "libre") {
            throw new Error(
              "Espacio no disponible."
            );
          }

          const reserva = {
            userId: usuario.uid,
            spaceId: id,
            nivel: id <= 12 ? 1 : 2,
            hours: duracion,
            start: new Date().toISOString(),
            status: "activa",
            amount: importe,
            createdAt: serverTimestamp(),
          };

          transaction.set(espacioRef, {
            nivel: reserva.nivel,
            estado: "reservado",
            reservationId: reservaRef.id,
          });

          transaction.set(
            reservaRef,
            reserva
          );

          return {
            id: reservaRef.id,
            ...reserva,
          };
        }
      );

      notify(
        `Reserva creada para el espacio ${id}`
      );

      return {
        ok: true,
        reservation: resultado,
      };
    } catch (error) {
      console.log("========== ERROR DE RESERVA ==========");
      console.log("Código:", error.code);
      console.log("Mensaje:", error.message);
      console.log("Espacio:", id);
      console.log("Duración:", duracion);
      console.log("Importe:", importe);
      console.log("Usuario:", usuario.uid);
      console.log("======================================");

      return {
        ok: false,
        message:
          error.message ||
          "No se pudo crear la reserva.",
      };
    }

  };

  // =========================================
  // CANCELAR RESERVA
  // =========================================

  const cancelReservation = async (id) => {
    if (!usuario || !connection) {
      return false;
    }

    const reservaRef = doc(
      db,
      "reservaciones",
      String(id)
    );

    try {
      const espacioId = await runTransaction(
        db,
        async (transaction) => {
          const reservaDoc =
            await transaction.get(reservaRef);

          if (!reservaDoc.exists()) {
            throw new Error(
              "La reserva no existe."
            );
          }

          const reserva = reservaDoc.data();

          if (
            reserva.userId !== usuario.uid &&
            !esAdmin
          ) {
            throw new Error(
              "No puedes cancelar reservas de otra cuenta."
            );
          }

          if (reserva.status !== "activa") {
            throw new Error(
              "La reserva ya no está activa."
            );
          }

          const espacioRef = doc(
            db,
            "espacios",
            String(reserva.spaceId)
          );

          const sensorRef = doc(
            db,
            "lecturasSensores",
            String(reserva.spaceId)
          );

          const espacioDoc =
            await transaction.get(espacioRef);

          const sensorDoc =
            await transaction.get(sensorRef);

          if (
            !espacioDoc.exists() ||
            espacioDoc.data().reservationId !== id
          ) {
            throw new Error(
              "El espacio no coincide con la reserva."
            );
          }

          transaction.update(reservaRef, {
            status: "cancelada",
          });


          const sensor = sensorDoc.exists()
            ? sensorDoc.data()
            : null;

          const fechaLectura =
            sensor?.ultimaLectura?.toMillis?.();

          const antiguedad =
            Date.now() - fechaLectura;

          const lecturaValida =
            sensor &&
            ["libre", "ocupado"].includes(
              sensor.ocupacionFisica
            ) &&
            Number.isFinite(antiguedad) &&
            antiguedad >= 0 &&
            antiguedad <= 30000;

          if (!lecturaValida) {
            throw new Error(
              "No se puede cancelar: la lectura del sensor no está actualizada."
            );
          }

          transaction.set(espacioRef, {
            nivel: reserva.nivel,
            estado:
              sensor.ocupacionFisica === "ocupado"
                ? "ocupado"
                : "libre",
            reservationId: null,
          });


          return reserva.spaceId;
        }
      );

      notify(
        `Reserva cancelada: espacio ${espacioId}`
      );

      return true;
    } catch (error) {
      console.log(
        "Error al cancelar:",
        error
      );

      return false;
    }
  };

  // =========================================
  // PAGOS SIMULADOS CON FIREBASE
  // =========================================

  const pay = async (id) => {
    if (!usuario?.uid) {
      return {
        ok: false,
        message: "Debes iniciar sesión.",
      };
    }

    const reservaRef = doc(
      db,
      "reservaciones",
      String(id)
    );

    const pagoRef = doc(
      db,
      "pagos",
      String(id)
    );

    try {
      const monto = await runTransaction(
        db,
        async (transaction) => {
          const reservaDoc =
            await transaction.get(reservaRef);

          const pagoDoc =
            await transaction.get(pagoRef);

          if (!reservaDoc.exists()) {
            throw new Error(
              "La reserva no existe."
            );
          }

          const reserva = reservaDoc.data();

          if (
            reserva.userId !== usuario.uid
          ) {
            throw new Error(
              "Esta reserva no pertenece a tu cuenta."
            );
          }

          if (
            reserva.status !== "activa"
          ) {
            throw new Error(
              "La reserva no está activa."
            );
          }

          if (pagoDoc.exists()) {
            throw new Error(
              "Esta reserva ya fue pagada."
            );
          }

          const importe = Number(
            reserva.amount
          );

          if (
            !Number.isFinite(importe) ||
            importe <= 0
          ) {
            throw new Error(
              "Importe inválido."
            );
          }

          transaction.set(pagoRef, {
            userId: usuario.uid,
            reservationId: String(id),
            spaceId: reserva.spaceId,
            amount: importe,
            status: "completado",
            date: new Date().toISOString(),
            createdAt: serverTimestamp(),
            tipo: "simulado",
          });

          return importe;
        }
      );

      notify(
        `Pago simulado realizado: Q${monto.toFixed(2)}`
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.error(
        "ERROR AL PROCESAR PAGO:",
        {
          code: error.code,
          message: error.message,
          reservationId: id,
          userId: usuario?.uid,
        }
      );

      return {
        ok: false,
        message:
          error.message ||
          "Error desconocido",
      };
    }
  };

  // =========================================
  // CAMBIAR ESTADO DE ESPACIO
  // SOLO ADMINISTRADOR
  // =========================================

  const setSpaceStatus = async (
    id,
    estado
  ) => {
    if (!esAdmin || !connection) {
      return false;
    }

    const numero = Number(id);

    if (
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 24 ||
      !["libre", "ocupado"].includes(estado)
    ) {
      return false;
    }

    const espacioRef = doc(
      db,
      "espacios",
      String(numero)
    );

    try {
      await runTransaction(
        db,
        async (transaction) => {
          const espacioDoc =
            await transaction.get(espacioRef);

          if (
            espacioDoc.exists() &&
            espacioDoc.data().estado ===
            "reservado"
          ) {
            throw new Error(
              "No puedes modificar un espacio reservado."
            );
          }

          transaction.set(espacioRef, {
            nivel:
              numero <= 12 ? 1 : 2,
            estado,
            reservationId: null,
          });
        }
      );

      return true;
    } catch (error) {
      console.log(
        "Error al cambiar espacio:",
        error
      );

      return false;
    }
  };

  // =========================================
  // TARIFAS SIMULADAS
  // =========================================

  const setTariff = (value) => {
    setTariffLocal(value);
  };

  // =========================================
  // ESTADÍSTICAS
  // =========================================

  const stats = useMemo(
    () => ({
      free: spaces.filter(
        (s) => s.estado === "libre"
      ).length,

      occupied: spaces.filter(
        (s) => s.estado === "ocupado"
      ).length,

      reserved: spaces.filter(
        (s) => s.estado === "reservado"
      ).length,

      income: payments
        .filter(
          (p) =>
            p.status === "completado"
        )
        .reduce(
          (total, p) =>
            total +
            Number(p.amount || 0),
          0
        ),
    }),
    [spaces, payments]
  );

  // =========================================
  // PROVEEDOR
  // =========================================

  return (
    <ParkingContext.Provider
      value={{
        spaces,
        arduinoConnected,
        arduinoMode,
        reservations,
        payments,
        notifications,
        connection,
        setConnection,
        parkingLoading,
        tariff,
        setTariff,
        stats,
        reserve,
        cancelReservation,
        pay,
        setSpaceStatus,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(
    ParkingContext
  );

  if (!context) {
    throw new Error(
      "Falta ParkingProvider"
    );
  }

  return context;
}
