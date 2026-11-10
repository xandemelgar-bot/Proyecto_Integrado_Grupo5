
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
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

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

  const [spaces, setSpaces] = useState(initialSpaces);
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
  // SINCRONIZACIÓN DE ESPACIOS
  // =========================================

  useEffect(() => {
    if (!usuario) {
      setSpaces(initialSpaces);
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

        setSpaces(
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
  // SINCRONIZACIÓN DE RESERVAS
  // =========================================

  useEffect(() => {
    setReservations([]);
    setPayments([]);
    setNotifications([]);

    if (!usuario) return;

    const referencia = collection(db, "reservaciones");

    // Administrador: todas las reservas
    // Conductor: únicamente las propias
    const consulta = esAdmin
      ? query(referencia)
      : query(
        referencia,
        where("userId", "==", usuario.uid)
      );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        lista.sort(
          (a, b) =>
            new Date(b.start).getTime() -
            new Date(a.start).getTime()
        );

        setReservations(lista);
      },
      (error) => {
        console.log("Error al cargar reservas:", error);
        setReservations([]);
      }
    );

    return () => unsubscribe();
  }, [usuario?.uid, esAdmin]);

  // =========================================
  // CREAR RESERVA
  // =========================================

  const reserve = async (spaceId, hours = 1) => {
    if (!usuario) {
      return {
        ok: false,
        message: "Debes iniciar sesión.",
      };
    }

    if (!connection) {
      return {
        ok: false,
        message: "No hay conexión con el estacionamiento.",
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
        message: "Espacio o duración inválidos.",
      };
    }

    const espacioRef = doc(db, "espacios", String(id));
    const reservaRef = doc(collection(db, "reservaciones"));

    const importe = Math.max(
      tariff.minimum,
      tariff.hour * duracion
    );

    try {
      const resultado = await runTransaction(
        db,
        async (transaction) => {
          const espacioDoc = await transaction.get(espacioRef);

          const estado = espacioDoc.exists()
            ? espacioDoc.data().estado
            : "libre";

          if (estado !== "libre") {
            throw new Error("Espacio no disponible.");
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

          transaction.set(reservaRef, reserva);

          return {
            id: reservaRef.id,
            ...reserva,
          };
        }
      );

      notify(`Reserva creada para el espacio ${id}`);

      return {
        ok: true,
        reservation: resultado,
      };
    } catch (error) {
      console.log("Error al reservar:", error);

      return {
        ok: false,
        message:
          error.message || "No se pudo crear la reserva.",
      };
    }
  };

  // =========================================
  // CANCELAR RESERVA
  // =========================================

  const cancelReservation = async (id) => {
    if (!usuario || !connection) return false;

    const reservaRef = doc(db, "reservaciones", String(id));

    try {
      const espacioId = await runTransaction(
        db,
        async (transaction) => {
          const reservaDoc = await transaction.get(reservaRef);

          if (!reservaDoc.exists()) {
            throw new Error("La reserva no existe.");
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
            throw new Error("La reserva ya no está activa.");
          }

          const espacioRef = doc(
            db,
            "espacios",
            String(reserva.spaceId)
          );

          const espacioDoc = await transaction.get(espacioRef);

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

          transaction.set(espacioRef, {
            nivel: reserva.nivel,
            estado: "libre",
            reservationId: null,
          });

          return reserva.spaceId;
        }
      );

      notify(`Reserva cancelada: espacio ${espacioId}`);
      return true;
    } catch (error) {
      console.log("Error al cancelar:", error);
      return false;
    }
  };

  // =========================================
  // PAGOS SIMULADOS
  // =========================================

  const pay = (id) => {
    const reserva = reservations.find(
      (r) => r.id === id
    );

    if (
      !usuario ||
      !reserva ||
      reserva.userId !== usuario.uid ||
      reserva.status !== "activa" ||
      payments.some((p) => p.reservationId === id)
    ) {
      return false;
    }

    setPayments((prev) => [
      {
        id: Date.now(),
        reservationId: id,
        amount: reserva.amount,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    notify(
      `Pago simulado realizado: Q${reserva.amount.toFixed(2)}`
    );

    return true;
  };

  // =========================================
  // CAMBIAR ESTADO DE ESPACIO
  // SOLO ADMINISTRADOR
  // =========================================

  const setSpaceStatus = async (id, estado) => {
    if (!esAdmin || !connection) return false;

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
      await runTransaction(db, async (transaction) => {
        const espacioDoc = await transaction.get(espacioRef);

        if (
          espacioDoc.exists() &&
          espacioDoc.data().estado === "reservado"
        ) {
          throw new Error(
            "No puedes modificar un espacio reservado."
          );
        }

        transaction.set(espacioRef, {
          nivel: numero <= 12 ? 1 : 2,
          estado,
          reservationId: null,
        });
      });

      return true;
    } catch (error) {
      console.log("Error al cambiar espacio:", error);
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

  const stats = useMemo(() => ({
    free: spaces.filter(
      (s) => s.estado === "libre"
    ).length,

    occupied: spaces.filter(
      (s) => s.estado === "ocupado"
    ).length,

    reserved: spaces.filter(
      (s) => s.estado === "reservado"
    ).length,

    income: payments.reduce(
      (total, p) => total + p.amount,
      0
    ),
  }), [spaces, payments]);

  return (
    <ParkingContext.Provider
      value={{
        spaces,
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
  const context = useContext(ParkingContext);

  if (!context) {
    throw new Error("Falta ParkingProvider");
  }

  return context;
}
