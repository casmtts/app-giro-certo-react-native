import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, Divider, IconButton } from "react-native-paper";
import { api, demoMotorcycles, resolveImageUrl } from "@/lib/api";
import { formatMileage, formatPrice } from "@/components/ListingCard";
import { useFavorites } from "@/lib/favorites";
import type { Motorcycle } from "@/lib/types";

export default function MotorcycleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const motorcycleId = Number(id);
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(
    demoMotorcycles.find((item) => item.id === motorcycleId) ?? null
  );
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = motorcycle ? isFavorite(motorcycle.id) : false;
  const images = motorcycle?.imageUrls?.length ? motorcycle.imageUrls : motorcycle ? [motorcycle.imageUrl] : [];
  const selectedImage = images[Math.min(selectedImageIndex, Math.max(images.length - 1, 0))];

  useEffect(() => {
    let active = true;
    api.motorcycle(motorcycleId).then((result) => {
      if (active) setMotorcycle(result);
    }).catch(() => {
      if (active && !motorcycle) {
        setMotorcycle(demoMotorcycles.find((item) => item.id === motorcycleId) ?? null);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [motorcycleId]);

  const shareListing = async () => {
    if (!motorcycle) return;
    await Share.share({
      message: motorcycle.brand + " " + motorcycle.model + " — " + formatPrice(motorcycle.price)
    });
  };

  const contactSeller = () => {
    if (!motorcycle) return;
    Alert.alert(
      "Fale com o vendedor",
      "Este anúncio é um exemplo do catálogo. Os dados de contato serão adicionados pelo vendedor ao publicar o anúncio."
    );
  };

  if (loading && !motorcycle) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="#A84F26" />
      </View>
    );
  }

  if (!motorcycle) {
    return (
      <SafeAreaView className="flex-1 bg-canvas px-5" edges={["top"]}>
        <IconButton icon="arrow-left" onPress={() => router.back()} accessibilityLabel="Voltar" />
        <Text className="mt-8 text-center text-lg font-jakarta-semibold text-ink">Anúncio não encontrado</Text>
        <Button mode="outlined" onPress={() => router.replace("/(tabs)")} style={{ marginTop: 18 }}>
          Voltar para o início
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="flex-row items-center justify-between px-3">
          <IconButton icon="arrow-left" onPress={() => router.back()} accessibilityLabel="Voltar" />
          <Text className="text-sm font-jakarta-bold tracking-[1px] text-ink">GIRO CERTO</Text>
          <View className="flex-row">
            <IconButton icon="share-variant-outline" onPress={() => void shareListing()} accessibilityLabel="Compartilhar anúncio" />
            <IconButton
              icon={favorite ? "heart" : "heart-outline"}
              iconColor={favorite ? "#A84F26" : "#202626"}
              onPress={() => toggleFavorite(motorcycle.id)}
              accessibilityLabel={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
          <View className="mx-5 mt-2 h-64 overflow-hidden rounded-[18px] bg-[#E8E8E4]">
            {imageFailed ? (
              <View className="flex-1 items-center justify-center">
                <MaterialCommunityIcons name="motorbike" size={64} color="#9BA3A0" />
              </View>
            ) : (
              <Image
                source={{ uri: resolveImageUrl(selectedImage) }}
                resizeMode="cover"
                onError={() => setImageFailed(true)}
                className="h-full w-full"
              />
            )}
          </View>

          {images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}>
              {images.map((image, index) => (
                <Pressable
                  key={image + index}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver foto ${index + 1} de ${images.length}`}
                  onPress={() => { setSelectedImageIndex(index); setImageFailed(false); }}
                  className={"mr-2 h-16 w-20 overflow-hidden rounded-xl border " + (index === selectedImageIndex ? "border-[#A84F26]" : "border-line")}
                >
                  <Image source={{ uri: resolveImageUrl(image) }} resizeMode="cover" className="h-full w-full" />
                </Pressable>
              ))}
            </ScrollView>
          )}

          <View className="px-5 pt-5">
            <View className="self-start rounded-full bg-copper-wash px-3 py-1.5">
              <Text className="text-[10px] font-jakarta-bold tracking-[1px] text-[#7E3A1B]">
                {motorcycle.sellerType === "DEALER" ? "LOJA" : "ANÚNCIO PARTICULAR"}
              </Text>
            </View>
            <Text className="mt-3 text-2xl font-jakarta-bold tracking-tight text-ink">
              {motorcycle.brand} {motorcycle.model}
            </Text>
            {!!motorcycle.version && <Text className="mt-1 text-sm text-muted">{motorcycle.version}</Text>}
            <Text className="mt-3 text-sm text-muted">
              {motorcycle.year}  ·  {motorcycle.displacementCc} cc  ·  {formatMileage(motorcycle.mileage)}
            </Text>
            <Text className="mt-4 text-3xl font-jakarta-bold tracking-tight text-ink">
              {formatPrice(motorcycle.price)}
            </Text>

            <Divider className="my-6 bg-line" />
            <Text className="text-lg font-jakarta-bold text-ink">Sobre esta moto</Text>
            <Text className="mt-2 text-sm leading-6 text-muted">{motorcycle.description}</Text>

            <View className="mt-7">
              <Text className="mb-3 text-lg font-jakarta-bold text-ink">Especificações</Text>
              <View className="overflow-hidden rounded-2xl border border-line bg-white">
                <SpecRow label="Ano" value={String(motorcycle.year)} />
                <SpecRow label="Cilindrada" value={motorcycle.displacementCc + " cc"} />
                <SpecRow label="Quilometragem" value={formatMileage(motorcycle.mileage)} />
                <SpecRow label="Categoria" value={categoryLabel(motorcycle.category)} last />
              </View>
            </View>

            <View className="mt-7">
              <Text className="mb-3 text-lg font-jakarta-bold text-ink">Vendedor</Text>
              <View className="flex-row items-center rounded-2xl border border-line bg-white p-4">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-canvas">
                  <MaterialCommunityIcons
                    name={motorcycle.sellerType === "DEALER" ? "storefront-outline" : "account-outline"}
                    size={23}
                    color="#687170"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-jakarta-semibold text-ink">{motorcycle.sellerName}</Text>
                  <Text className="mt-1 text-sm text-muted">{motorcycle.city}, {motorcycle.state}</Text>
                </View>
                {motorcycle.verifiedSeller && (
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="check-decagram-outline" size={17} color="#A84F26" />
                    <Text className="ml-1 text-xs font-jakarta-semibold text-ink">Verificada</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]} className="border-t border-line bg-white px-5 pt-3">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-[10px] font-jakarta-semibold text-muted">PREÇO</Text>
            <Text className="mt-0.5 text-lg font-jakarta-bold text-ink">{formatPrice(motorcycle.price)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={contactSeller}
            contentStyle={{ minHeight: 50, paddingHorizontal: 8 }}
            style={{ flex: 1.4, borderRadius: 14 }}
          >
            Conversar com vendedor
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SpecRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={"flex-row items-center justify-between px-4 py-3.5 " + (last ? "" : "border-b border-line")}>
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="text-sm font-jakarta-semibold text-ink">{value}</Text>
    </View>
  );
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    ESPORTIVA: "Esportiva", NAKED: "Naked", TRAIL: "Trail", SCOOTER: "Scooter", CUSTOM: "Custom"
  };
  return labels[category] ?? category;
}
