import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { resolveImageUrl } from "@/lib/api";
import type { Motorcycle } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price);

export const formatMileage = (mileage: number) =>
  new Intl.NumberFormat("pt-BR").format(mileage) + " km";

type ListingCardProps = {
  motorcycle: Motorcycle;
  featured?: boolean;
  compact?: boolean;
};

export function ListingCard({ motorcycle, featured = false, compact = false }: ListingCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(motorcycle.id);
  const fallbackAspectRatio = featured ? 1.55 : compact ? 1.8 : 1.65;

  return (
    <View className="relative overflow-hidden rounded-[18px] border border-line bg-surface">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={"Ver anúncio da " + motorcycle.brand + " " + motorcycle.model}
        onPress={() => router.push("/motorcycles/" + motorcycle.id)}
        className="bg-surface"
      >
        <View
          className="relative w-full bg-[#E8E8E4]"
          style={{ aspectRatio: imageAspectRatio ?? fallbackAspectRatio }}
        >
          {imageFailed ? (
            <View className="flex-1 items-center justify-center bg-[#EAEAE6]">
              <MaterialCommunityIcons name="motorbike" size={54} color="#A1A6A2" />
            </View>
          ) : (
            <Image
              source={{ uri: resolveImageUrl(motorcycle.imageUrl) }}
              resizeMode="contain"
              onLoad={(event) => {
                const source = event.nativeEvent.source;
                const webImage = (event.nativeEvent as unknown as { target?: HTMLImageElement }).target;
                const width = source?.width || webImage?.naturalWidth || webImage?.width;
                const height = source?.height || webImage?.naturalHeight || webImage?.height;
                if (width && height && width > 0 && height > 0) setImageAspectRatio(width / height);
              }}
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full"
            />
          )}
          <View className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5">
            <View className="flex-row items-center">
              {motorcycle.verifiedSeller && (
                <MaterialCommunityIcons name="check-decagram-outline" size={14} color="#A84F26" />
              )}
              <View className={motorcycle.verifiedSeller ? "ml-1" : ""}>
                <BadgeText>{motorcycle.verifiedSeller ? "Loja verificada" : "Particular"}</BadgeText>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-2 p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <BodyText className="text-base font-jakarta-semibold text-ink">
                {motorcycle.brand} {motorcycle.model}
              </BodyText>
              {!!motorcycle.version && (
                <BodyText className="mt-0.5 text-sm text-muted">{motorcycle.version}</BodyText>
              )}
            </View>
            <BodyText className="text-lg font-jakarta-bold text-ink">{formatPrice(motorcycle.price)}</BodyText>
          </View>

          <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
            <Spec>{motorcycle.year}</Spec>
            <Dot />
            <Spec>{motorcycle.displacementCc} cc</Spec>
            <Dot />
            <Spec>{formatMileage(motorcycle.mileage)}</Spec>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#687170" />
            <BodyText className="ml-1 text-sm text-muted">{motorcycle.city}, {motorcycle.state}</BodyText>
          </View>
        </View>
      </Pressable>

      <View className="absolute right-2 top-2 z-10 rounded-full bg-white/95">
        <IconButton
          icon={favorite ? "heart" : "heart-outline"}
          iconColor={favorite ? "#A84F26" : "#202626"}
          size={21}
          accessibilityLabel={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          onPress={() => toggleFavorite(motorcycle.id)}
          style={{ margin: 0, width: 44, height: 44 }}
        />
      </View>
    </View>
  );
}

function BodyText({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <Text className={className}>{children}</Text>;
}

function BadgeText({ children }: React.PropsWithChildren) {
  return <Text className="text-xs font-jakarta-semibold text-ink">{children}</Text>;
}

function Spec({ children }: React.PropsWithChildren) {
  return <Text className="text-xs text-muted">{children}</Text>;
}

function Dot() {
  return <View className="h-1 w-1 rounded-full bg-[#9BA3A0]" />;
}
