
import React from "react";

import { useEffect } from "react";
import { socket, conectarSocket } from "./services/socket";

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./contexts/AuthContext";
import { ParkingProvider } from "./contexts/ParkingContext";

import AppNavigator from "./navigation/AppNavigator";

export default function App() {


  useEffect(() => {
    const alConectar = () => {
      console.log("SOCKET CONECTADO:", socket.id);
    };

    const alEstadoInicial = (data) => {
      console.log("ESPACIOS RECIBIDOS:", data.spaces.length);
      console.log("MODO:", data.mode);
    };

    const alActualizarEspacio = (space) => {
      console.log(
        `ESPACIO ${space.id}: ${space.estado}`
      );
    };

    const alError = (error) => {
      console.log("ERROR SOCKET:", error.message);
    };

    socket.on("connect", alConectar);
    socket.on("parking:initialState", alEstadoInicial);
    socket.on("parking:spaceUpdate", alActualizarEspacio);
    socket.on("connect_error", alError);

    conectarSocket();

    return () => {
      socket.off("connect", alConectar);
      socket.off("parking:initialState", alEstadoInicial);
      socket.off("parking:spaceUpdate", alActualizarEspacio);
      socket.off("connect_error", alError);
      socket.disconnect();
    };
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <ParkingProvider>
          <AppNavigator />
        </ParkingProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
