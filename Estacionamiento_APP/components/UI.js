import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import C from "../constants/colors";

export function Screen({
  title, subtitle, children, navigation
}) {
  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={C.primary}
        barStyle="light-content"
      />
      <ScrollView
        style={s.base}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <View style={s.headerRow}>
            {navigation?.canGoBack?.() && (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{title}</Text>
              {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
            </View>
          </View>
        </View>
        <View style={s.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Heading({ children }) {
  return <Text style={s.heading}>{children}</Text>;
}

export function Muted({ children, style }) {
  return <Text style={[s.muted, style]}>{children}</Text>;
}

export function Button({
  title, onPress, secondary = false,
  danger = false, disabled = false, icon
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        s.button,
        secondary && s.secondary,
        danger && { backgroundColor: C.danger },
        disabled && { opacity: 0.5 }
      ]}
    >
      {!!icon && (
        <Ionicons
          name={icon}
          size={19}
          color={secondary ? C.primary : "white"}
        />
      )}
      <Text style={[s.buttonText, secondary && { color: C.primary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Metric({ label, value, color = C.primary }) {
  return (
    <Card style={{ flex: 1, minWidth: 125 }}>
      <Text style={[s.metric, { color }]}>{value}</Text>
      <Muted>{label}</Muted>
    </Card>
  );
}

export function Status({ value }) {
  const color =
    ["libre", "activa"].includes(value) ? C.success :
    ["ocupado", "cancelada"].includes(value) ? C.danger :
    C.warning;

  return (
    <View style={{
      backgroundColor: color + "20",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      alignSelf: "flex-start"
    }}>
      <Text style={{
        color,
        fontSize: 12,
        fontWeight: "700",
        textTransform: "capitalize"
      }}>
        {value}
      </Text>
    </View>
  );
}

export function SpacesGrid({ spaces, onSelect }) {
  return (
    <View style={s.grid}>
      {spaces.map(space => {
        const color =
          space.estado === "libre" ? C.success :
          space.estado === "ocupado" ? C.danger :
          C.warning;

        const background =
          space.estado === "libre" ? "#DCFCE7" :
          space.estado === "ocupado" ? "#FEE2E2" :
          "#FEF3C7";

        return (
          <TouchableOpacity
            key={space.id}
            disabled={!onSelect}
            onPress={() => onSelect?.(space)}
            style={[s.spot, {
              borderColor: color,
              backgroundColor: background
            }]}
          >
            <Ionicons
              name="car-sport-outline"
              size={20}
              color={color}
            />
            <Text style={{ fontWeight: "700", color: C.text }}>
              {String(space.id).padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const money = n => "Q" + Number(n || 0).toFixed(2);

export const dateText = value =>
  new Date(value).toLocaleString("es-GT", {
    dateStyle: "short",
    timeStyle: "short"
  });

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  base: { backgroundColor: C.background },
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF"
  },
  subtitle: {
    color: "#DBEAFE",
    marginTop: 5,
    fontSize: 13
  },
  body: { padding: 16, paddingBottom: 35, flex: 1 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: C.border
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: C.text,
    marginBottom: 12
  },
  muted: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  button: {
    minHeight: 48,
    backgroundColor: C.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 12,
    marginVertical: 6
  },
  secondary: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE"
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF"
  },
  metric: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 5
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  spot: {
    width: "22.5%",
    height: 67,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  }
});