
import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./contexts/AuthContext";
import { ParkingProvider } from "./contexts/ParkingContext";

import AppNavigator from "./navigation/AppNavigator";

export default function App() {
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
