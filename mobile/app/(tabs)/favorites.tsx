import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { Screen } from "@/components/Screen";
import { api, demoMotorcycles } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import type { Motorcycle } from "@/lib/types";

export default function FavoritesScreen() {
  const { favoriteIds, ready } = useFavorites();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.motorcycles().then((results) => {
      if (active) setMotorcycles(results);
    }).catch(() => {
      if (active) setMotorcycles(demoMotorcycles);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const saved = motorcycles.filter((motorcycle) => favoriteIds.includes(motorcycle.id));

  return (
    <Screen>
      <View className="px-5 pt-5">
        <View className="mb-6 flex-row items-center">
          <MaterialCommunityIcons name="heart-outline" size={22} color="#A84F26" />
          <Text className="ml-2 text-2xl font-jakarta-bold tracking-tight text-ink">Favoritos</Text>
        </View>
        {loading || !ready ? (
          <View className="py-16">
            <ActivityIndicator color="#A84F26" />
          </View>
        ) : saved.length ? (
          <View className="gap-4">
            {saved.map((motorcycle) => <ListingCard key={motorcycle.id} motorcycle={motorcycle} compact />)}
          </View>
        ) : (
          <View className="rounded-[18px] border border-line bg-white">
            <EmptyState
              title="Sua lista começa aqui"
              message="Toque no coração de um anúncio para guardar as motos que quer comparar."
            />
          </View>
        )}
      </View>
    </Screen>
  );
}
