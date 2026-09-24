import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const icons = {
  index: "home-variant-outline",
  favorites: "heart-outline",
  announce: "plus-box-outline",
  profile: "account-circle-outline"
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#A84F26",
        tabBarInactiveTintColor: "#687170",
        tabBarLabelStyle: { fontFamily: "PlusJakartaSans_500Medium", fontSize: 11, marginBottom: 2 },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DFE3E0",
          height: 64,
          paddingTop: 5,
          paddingBottom: 5
        },
        tabBarIcon: ({ color, size }) => {
          const icon = icons[route.name as keyof typeof icons] ?? "circle-outline";
          return <MaterialCommunityIcons name={icon} color={color} size={size} />;
        }
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favoritos" }} />
      <Tabs.Screen name="announce" options={{ title: "Anunciar" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
