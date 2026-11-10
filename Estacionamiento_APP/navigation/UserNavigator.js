
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ===================================
// DAVID - CONDUCTOR
// ===================================

import UsuarioScreen from "../screens/usuario/UsuarioScreen";

import ParkingScreen from "../screens/usuario/ParkingScreen";

import ReservationScreen from "../screens/usuario/ReservationScreen";

// ===================================
// JOSÉ - CONDUCTOR
// ===================================

import MyReservationsScreen from "../screens/usuario/MyReservationsScreen";

import PaymentScreen from "../screens/usuario/PaymentScreen";

import NotificationsScreen from "../screens/usuario/NotificationsScreen";

import ProfileScreen from "../screens/usuario/ProfileScreen";

// ===================================
// NAVEGACIÓN
// ===================================

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Usuario"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "#F4F7FB",
        },
      }}
    >
      {/* DAVID */}

      <Stack.Screen
        name="Usuario"
        component={UsuarioScreen}
      />

      <Stack.Screen
        name="Parking"
        component={ParkingScreen}
      />

      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
      />

      {/* JOSÉ */}

      <Stack.Screen
        name="MyReservations"
        component={MyReservationsScreen}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}
