import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip, IconButton, TextInput } from "react-native-paper";
import { useSearchFilters } from "@/lib/search-filters";

const brands = ["Honda", "Yamaha", "Kawasaki", "Suzuki"];
const ccRanges = [
  { label: "Até 160 cc", min: undefined, max: 160 },
  { label: "161–300 cc", min: 161, max: 300 },
  { label: "301–600 cc", min: 301, max: 600 },
  { label: "Acima de 600 cc", min: 601, max: undefined }
];
const categories = [
  { label: "Naked", value: "NAKED" },
  { label: "Esportiva", value: "ESPORTIVA" },
  { label: "Trail", value: "TRAIL" },
  { label: "Scooter", value: "SCOOTER" },
  { label: "Custom", value: "CUSTOM" }
];

const asNumber = (value: string) => {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function FiltersScreen() {
  const { filters, updateFilters, clearFilters } = useSearchFilters();
  const [minPrice, setMinPrice] = useState(filters.minPrice ? String(filters.minPrice) : "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ? String(filters.maxPrice) : "");
  const [yearFrom, setYearFrom] = useState(filters.yearFrom ? String(filters.yearFrom) : "");
  const [yearTo, setYearTo] = useState(filters.yearTo ? String(filters.yearTo) : "");
  const [maxMileage, setMaxMileage] = useState(filters.maxMileage ? String(filters.maxMileage) : "");
  const [city, setCity] = useState(filters.city ?? "");
  const [selectedCc, setSelectedCc] = useState(
    ccRanges.find((range) => range.min === filters.minCc && range.max === filters.maxCc)?.label ?? ""
  );

  const clear = () => {
    clearFilters();
    setMinPrice("");
    setMaxPrice("");
    setYearFrom("");
    setYearTo("");
    setMaxMileage("");
    setCity("");
    setSelectedCc("");
  };

  const apply = () => {
    const range = ccRanges.find((item) => item.label === selectedCc);
    updateFilters({
      minPrice: asNumber(minPrice),
      maxPrice: asNumber(maxPrice),
      yearFrom: asNumber(yearFrom),
      yearTo: asNumber(yearTo),
      maxMileage: asNumber(maxMileage),
      city: city.trim() || undefined,
      minCc: range?.min,
      maxCc: range?.max
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-4 pt-1">
        <View className="flex-row items-center">
          <IconButton icon="arrow-left" onPress={() => router.back()} accessibilityLabel="Voltar" />
          <Text className="text-xl font-jakarta-bold text-ink">Filtrar motos</Text>
        </View>
        <Pressable onPress={clear} className="min-h-11 justify-center px-2">
          <Text className="font-jakarta-semibold text-copper">Limpar</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <FilterSection title="Onde procurar">
          <Field label="Cidade ou região" value={city} onChangeText={setCity} placeholder="Qualquer região" />
        </FilterSection>

        <FilterSection title="Faixa de preço">
          <View className="flex-row gap-3">
            <Field label="Mínimo" value={minPrice} onChangeText={setMinPrice} placeholder="R$ 0" keyboardType="decimal-pad" className="flex-1" />
            <Field label="Máximo" value={maxPrice} onChangeText={setMaxPrice} placeholder="Sem limite" keyboardType="decimal-pad" className="flex-1" />
          </View>
        </FilterSection>

        <FilterSection title="Estilo">
          <View className="flex-row flex-wrap gap-2">
            {categories.map((item) => {
              const selected = filters.category === item.value;
              return <FilterChip
                key={item.value}
                label={item.label}
                selected={selected}
                onPress={() => updateFilters({ category: selected ? undefined : item.value })}
              />;
            })}
          </View>
        </FilterSection>

        <FilterSection title="Marca">
          <View className="flex-row flex-wrap gap-2">
            {brands.map((brand) => {
              const selected = filters.brand === brand;
              return <FilterChip
                key={brand}
                label={brand}
                selected={selected}
                onPress={() => updateFilters({ brand: selected ? undefined : brand })}
              />;
            })}
          </View>
        </FilterSection>

        <FilterSection title="Ano">
          <View className="flex-row gap-3">
            <Field label="De" value={yearFrom} onChangeText={setYearFrom} placeholder="2010" keyboardType="number-pad" className="flex-1" />
            <Field label="Até" value={yearTo} onChangeText={setYearTo} placeholder="2026" keyboardType="number-pad" className="flex-1" />
          </View>
        </FilterSection>

        <FilterSection title="Cilindrada">
          <View className="flex-row flex-wrap gap-2">
            {ccRanges.map((range) => (
              <FilterChip
                key={range.label}
                label={range.label}
                selected={selectedCc === range.label}
                onPress={() => setSelectedCc(selectedCc === range.label ? "" : range.label)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Quilometragem">
          <Field label="Máximo de quilômetros" value={maxMileage} onChangeText={setMaxMileage} placeholder="Qualquer quilometragem" keyboardType="number-pad" />
        </FilterSection>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="border-t border-line bg-white px-5 pt-3">
        <Button mode="contained" onPress={apply} contentStyle={{ minHeight: 50 }} style={{ borderRadius: 14 }}>
          Ver resultados
        </Button>
        <Pressable onPress={clear} className="min-h-11 items-center justify-center">
          <Text className="text-sm font-jakarta-semibold text-muted">Limpar filtros</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function FilterSection({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View className="mb-6 border-b border-line pb-5">
      <Text className="mb-3 text-base font-jakarta-semibold text-ink">{title}</Text>
      {children}
    </View>
  );
}

function Field({
  label,
  className = "",
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string; className?: string }) {
  return (
    <View className={"mb-1 " + className}>
      <Text className="mb-2 text-xs font-jakarta-semibold text-muted">{label}</Text>
      <TextInput
        mode="outlined"
        {...inputProps}
        outlineColor="#DFE3E0"
        activeOutlineColor="#A84F26"
        style={{ backgroundColor: "#FFFFFF" }}
        contentStyle={{ minHeight: 46 }}
      />
    </View>
  );
}

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Chip
      selected={selected}
      showSelectedCheck={false}
      onPress={onPress}
      icon={selected ? (props) => <MaterialCommunityIcons {...props} name="check" color="#A84F26" /> : undefined}
      style={{
        backgroundColor: selected ? "#F4E7DF" : "#FFFFFF",
        borderColor: selected ? "#A84F26" : "#DFE3E0",
        borderWidth: 1
      }}
      textStyle={{ color: selected ? "#7E3A1B" : "#687170", fontFamily: "PlusJakartaSans_600SemiBold" }}
    >
      {label}
    </Chip>
  );
}
