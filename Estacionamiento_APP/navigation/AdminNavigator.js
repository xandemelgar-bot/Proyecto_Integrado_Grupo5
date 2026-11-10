
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ===================================
// RODRIGO - ADMINISTRADOR
// ===================================

import AdminScreen from "../screens/admin/AdminScreen";

import ParkingManagementScreen from "../screens/admin/ParkingManagementScreen";

import ReservationsAdminScreen from "../screens/admin/ReservationsAdminScreen";

// ===================================
// OMAR - ADMINISTRADOR
// ===================================

import TariffsScreen from "../screens/admin/TariffsScreen";

import ReportsScreen from "../screens/admin/ReportsScreen";

import PredictionsScreen from "../screens/admin/PredictionsScreen";

// ===================================
// NAVEGACIÓN
// ===================================

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Admin"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "#F4F7FB",
        },
      }}
    >
      {/* RODRIGO */}

      <Stack.Screen
        name="Admin"
        component={AdminScreen}
      />

      <Stack.Screen
        name="ParkingManagement"
        component={ParkingManagementScreen}
      />

      <Stack.Screen
        name="ReservationsAdmin"
        component={ReservationsAdminScreen}
      />

      {/* OMAR */}

      <Stack.Screen
        name="Tariffs"
        component={TariffsScreen}
      />

      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
      />

      <Stack.Screen
        name="Predictions"
        component={PredictionsScreen}
      />
    </Stack.Navigator>
  );
}
