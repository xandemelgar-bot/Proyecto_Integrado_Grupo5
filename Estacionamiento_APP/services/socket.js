
import { io } from "socket.io-client";

// Reemplaza esta IP por la IPv4 de tu computadora.
const SERVER_URL = "http://192.168.1.73:3001";

export const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 10000,
});

export const conectarSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const desconectarSocket = () => {
  socket.disconnect();
};
