import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Chip, IconButton, Searchbar } from "react-native-paper";
import { ListingCard } from "@/components/ListingCard";
import { Screen } from "@/components/Screen";
import { api, demoMotorcycles } from "@/lib/api";
import { useSearchFilters } from "@/lib/search-filters";
import type { Motorcycle, SearchFilters } from "@/lib/types";

const categories = [
  { label: "Todas", value: undefined },
  { label: "Naked", value: "NAKED" },
  { label: "Esportiva", value: "ESPORTIVA" },
  { label: "Trail", value: "TRAIL" },
  { label: "Scooter", value: "SCOOTER" },
  { label: "Custom", value: "CUSTOM" }
];

function filterDemo(filters: SearchFilters) {
  return demoMotorcycles.filter((motorcycle) => {
    const query = filters.q?.trim().toLocaleLowerCase("pt-BR");
    const matchesQuery = !query || (motorcycle.brand + " " + motorcycle.model).toLocaleLowerCase("pt-BR").includes(query);
    const matchesCategory = !filters.category || motorcycle.category === filters.category;
    const matchesBrand = !filters.brand || motorcycle.brand.toLocaleLowerCase("pt-BR").includes(filters.brand.toLocaleLowerCase("pt-BR"));
    const matchesPrice = (!filters.minPrice || motorcycle.price >= filters.minPrice)
      && (!filters.maxPrice || motorcycle.price <= filters.maxPrice);
    return matchesQuery && matchesCategory && matchesBrand && matchesPrice;
  });
}

export default function HomeScreen() {
  const { filters, updateFilters } = useSearchFilters();
  const [query, setQuery] = useState(filters.q ?? "");
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => setQuery(filters.q ?? ""), [filters.q]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.motorcycles(filters).then((results) => {
      if (!active) return;
      setMotorcycles(results);
      setOffline(false);
    }).catch(() => {
      if (!active) return;
      setMotorcycles(filterDemo(filters));
      setOffline(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [filters]);

  const featured = motorcycles.find((motorcycle) => motorcycle.model === "CBR 600RR") ?? motorcycles[0];
  const recent = motorcycles.filter((motorcycle) => motorcycle.id !== featured?.id);

  return (
    <Screen>
      <View className="px-5 pt-3">
        <View className="mb-7 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-2 h-9 w-9 items-center justify-center rounded-xl bg-ink">
              <MaterialCommunityIcons name="motorbike" size={22} color="#FFFFFF" />
            </View>
            <Text className="text-base font-jakarta-bold tracking-tight text-ink">GIRO CERTO</Text>
          </View>
          <IconButton
            icon="account-circle-outline"
            size={25}
            iconColor="#202626"
            accessibilityLabel="Abrir perfil"
            onPress={() => router.push("/(tabs)/profile")}
            style={{ margin: 0 }}
          />
        </View>

        <Text className="text-[29px] font-jakarta-bold leading-9 tracking-tight text-ink">
          Encontre sua{"\n"}próxima moto.
        </Text>
        <Text className="mt-2 text-base leading-6 text-muted">
          Motos para sua próxima história.
        </Text>

        <View className="mt-5 flex-row items-center gap-2">
          <Searchbar
            placeholder="Marca, modelo ou estilo"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => updateFilters({ q: query.trim() || undefined })}
            returnKeyType="search"
            style={{ flex: 1, height: 52, borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DFE3E0" }}
            inputStyle={{ minHeight: 48, fontSize: 14 }}
            iconColor="#687170"
          />
          <IconButton
            icon="tune-variant"
            mode="contained"
            containerColor="#202626"
            iconColor="#FFFFFF"
            size={24}
            accessibilityLabel="Abrir filtros"
            onPress={() => router.push("/filters")}
            style={{ width: 52, height: 52, borderRadius: 16, margin: 0 }}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 8 }}
      >
        {categories.map((category) => {
          const selected = category.value ? filters.category === category.value : !filters.category;
          return (
            <Chip
              key={category.label}
              selected={selected}
              onPress={() => updateFilters({ category: category.value })}
              style={{
                backgroundColor: selected ? "#F4E7DF" : "#FFFFFF",
                borderColor: selected ? "#A84F26" : "#DFE3E0",
                borderWidth: 1
              }}
              textStyle={{ color: selected ? "#7E3A1B" : "#687170", fontFamily: "PlusJakartaSans_600SemiBold" }}
              showSelectedCheck={false}
            >
              {category.label}
            </Chip>
          );
        })}
      </ScrollView>

      <View className="px-5">
        {offline && (
          <View className="mb-5 flex-row items-start rounded-2xl border border-line bg-white px-4 py-3">
            <MaterialCommunityIcons name="cloud-alert-outline" size={18} color="#687170" />
            <Text className="ml-2 flex-1 text-xs leading-5 text-muted">
              Catálogo de demonstração. Inicie a API para carregar os anúncios do servidor.
            </Text>
          </View>
        )}

        <SectionHeading
          eyebrow="SELEÇÃO GIRO CERTO"
          title="Destaque de hoje"
          onPress={() => router.push("/filters")}
        />

        {loading ? (
          <View className="items-center rounded-[18px] border border-line bg-white py-12">
            <ActivityIndicator color="#A84F26" />
            <Text className="mt-3 text-sm text-muted">Buscando motos…</Text>
          </View>
        ) : featured ? (
          <ListingCard motorcycle={featured} featured />
        ) : (
          <View className="rounded-[18px] border border-line bg-white">
            <Text className="px-5 py-8 text-center text-sm leading-6 text-muted">
              Nenhuma moto encontrada. Ajuste a busca ou limpe os filtros.
            </Text>
          </View>
        )}

        <View className="mt-8">
          <SectionHeading
            eyebrow="INVENTÁRIO"
            title="Mais motos para você"
            onPress={() => router.push("/filters")}
          />
          {!loading && recent.length > 0 ? (
            <View className="gap-4">
              {recent.map((motorcycle) => (
                <ListingCard key={motorcycle.id} motorcycle={motorcycle} compact />
              ))}
            </View>
          ) : !loading && motorcycles.length > 0 ? (
            <Text className="pb-4 text-sm text-muted">Mais anúncios aparecem conforme chegam ao catálogo.</Text>
          ) : null}
        </View>
        <Pressable onPress={() => router.push("/filters")} className="mb-4 mt-6 items-center py-3">
          <Text className="font-jakarta-semibold text-copper">Explorar todos os filtros</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function SectionHeading({ eyebrow, title, onPress }: { eyebrow: string; title: string; onPress: () => void }) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View>
        <Text className="text-[10px] font-jakarta-bold tracking-[1.6px] text-muted">{eyebrow}</Text>
        <Text className="mt-1 text-xl font-jakarta-bold tracking-tight text-ink">{title}</Text>
      </View>
      <Pressable onPress={onPress} accessibilityRole="button">
        <Text className="pb-1 text-sm font-jakarta-semibold text-copper">Ver todas</Text>
      </Pressable>
    </View>
  );
}
