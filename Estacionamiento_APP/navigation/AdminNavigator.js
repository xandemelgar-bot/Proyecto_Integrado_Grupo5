
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas del administrador
import AdminScreen from "../screens/admin/AdminScreen";
import ParkingManagementScreen from "../screens/admin/ParkingManagementScreen";
import ReservationsAdminScreen from "../screens/admin/ReservationsAdminScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Admin"
      screenOptions={{ headerShown: false }}
    >
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
    </Stack.Navigator>
  );
}
