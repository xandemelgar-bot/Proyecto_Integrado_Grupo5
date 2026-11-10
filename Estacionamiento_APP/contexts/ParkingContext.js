import React, {
  createContext, useContext, useMemo, useState
} from "react";

const ParkingContext = createContext(null);

const initialSpaces = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  nivel: i < 12 ? 1 : 2,
  estado: [3, 7, 14, 19, 22].includes(i + 1)
    ? "ocupado" : "libre"
}));

export function ParkingProvider({ children }) {
  const [spaces, setSpaces] = useState(initialSpaces);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState(false);

  const [tariff, setTariff] = useState({
    hour: 10,
    minimum: 5,
    grace: 10
  });

  const notify = text => {
    setNotifications(prev => [{
      id: Date.now() + Math.random(),
      text,
      date: new Date().toISOString()
    }, ...prev]);
  };

  const reserve = (spaceId, hours = 1) => {
    const spot = spaces.find(s => s.id === Number(spaceId));

    if (!spot || spot.estado !== "libre") {
      return { ok: false, message: "Espacio no disponible" };
    }

    const reservation = {
      id: Date.now(),
      spaceId: Number(spaceId),
      hours: Number(hours),
      start: new Date().toISOString(),
      status: "activa",
      amount: Math.max(tariff.minimum, tariff.hour * hours)
    };

    setSpaces(prev => prev.map(s =>
      s.id === Number(spaceId)
        ? { ...s, estado: "reservado" }
        : s
    ));

    setReservations(prev => [reservation, ...prev]);
    notify(`Reserva creada para el espacio ${spaceId}`);

    return { ok: true, reservation };
  };

  const cancelReservation = id => {
    const reservation = reservations.find(r => r.id === id);

    if (!reservation || reservation.status !== "activa") {
      return false;
    }

    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: "cancelada" } : r
    ));

    setSpaces(prev => prev.map(s =>
      s.id === reservation.spaceId
        ? { ...s, estado: "libre" }
        : s
    ));

    notify(`Reserva cancelada: espacio ${reservation.spaceId}`);
    return true;
  };

  const pay = id => {
    const reservation = reservations.find(r => r.id === id);

    if (
      !reservation ||
      reservation.status !== "activa" ||
      payments.some(p => p.reservationId === id)
    ) return false;

    setPayments(prev => [{
      id: Date.now(),
      reservationId: id,
      amount: reservation.amount,
      date: new Date().toISOString()
    }, ...prev]);

    notify(`Pago simulado realizado: Q${reservation.amount.toFixed(2)}`);
    return true;
  };

  const setSpaceStatus = (id, estado) => {
    if (!["libre", "ocupado"].includes(estado)) return false;

    if (reservations.some(r =>
      r.spaceId === id && r.status === "activa"
    )) return false;

    setSpaces(prev => prev.map(s =>
      s.id === id ? { ...s, estado } : s
    ));

    return true;
  };

  const stats = useMemo(() => ({
    free: spaces.filter(s => s.estado === "libre").length,
    occupied: spaces.filter(s => s.estado === "ocupado").length,
    reserved: spaces.filter(s => s.estado === "reservado").length,
    income: payments.reduce((total, p) => total + p.amount, 0)
  }), [spaces, payments]);

  return (
    <ParkingContext.Provider value={{
      spaces, reservations, payments, notifications,
      connection, setConnection, tariff, setTariff,
      stats, reserve, cancelReservation, pay, setSpaceStatus
    }}>
      {children}
    </ParkingContext.Provider>
  );
}

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error("Falta ParkingProvider");
  }
  return context;
};