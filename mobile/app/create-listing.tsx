import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip, IconButton, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { api, type ListingPhotoUpload } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const categories = [
  { label: "Naked", value: "NAKED" },
  { label: "Esportiva", value: "ESPORTIVA" },
  { label: "Trail", value: "TRAIL" },
  { label: "Scooter", value: "SCOOTER" },
  { label: "Custom", value: "CUSTOM" }
];

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function CreateListingScreen() {
  const { token } = useAuth();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [displacementCc, setDisplacementCc] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<ListingPhotoUpload[]>([]);
  const [category, setCategory] = useState("ESPORTIVA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addPhotos = async () => {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setError("Você já adicionou o limite de 5 fotos.");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        orderedSelection: true,
        quality: 0.85,
        exif: false,
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible
      });
      if (result.canceled) return;
      const selected = result.assets.slice(0, remaining);
      if (selected.some((asset) => asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES)) {
        setError("Cada foto pode ter no máximo 10 MB. Escolha imagens menores.");
        return;
      }
      const additions: ListingPhotoUpload[] = selected.map((asset, index) => {
        const mimeType = asset.mimeType || "image/jpeg";
        const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
        return {
          uri: asset.uri,
          name: asset.fileName || `foto-${Date.now()}-${index + 1}.${extension}`,
          mimeType,
          file: asset.file
        };
      });
      setPhotos((current) => [...current, ...additions].slice(0, MAX_PHOTOS));
      setError("");
    } catch {
      setError("Não foi possível abrir suas fotos. Tente novamente.");
    }
  };

  const submit = async () => {
    if (!token) {
      router.replace("/login");
      return;
    }
    const numericPrice = Number(price.replace(/\./g, "").replace(",", "."));
    if (!brand.trim() || !model.trim() || !year || !city.trim() || !state.trim() || !numericPrice) {
      setError("Preencha marca, modelo, ano, preço e localização.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const created = await api.createMotorcycle(token, {
        brand: brand.trim(),
        model: model.trim(),
        version: version.trim(),
        year: Number(year),
        mileage: Number(mileage) || 0,
        displacementCc: Number(displacementCc) || 150,
        price: numericPrice,
        category,
        city: city.trim(),
        state: state.trim().toUpperCase(),
        description: description.trim() || "Entre em contato para saber mais sobre esta moto.",
        imageUrl: ""
      }, photos);
      Alert.alert("Anúncio publicado", "Sua moto já está no catálogo do Giro Certo.");
      router.replace("/motorcycles/" + created.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível publicar o anúncio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right"]}>
      <View className="flex-row items-center px-4 pt-1">
        <IconButton icon="arrow-left" onPress={() => router.back()} accessibilityLabel="Voltar" />
        <Text className="ml-1 text-xl font-jakarta-bold text-ink">Novo anúncio</Text>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <Text className="mb-5 text-sm leading-6 text-muted">Informe os dados principais para sua moto aparecer nas buscas.</Text>

        <Field label="Marca" value={brand} onChangeText={setBrand} placeholder="Ex.: Honda" />
        <Field label="Modelo" value={model} onChangeText={setModel} placeholder="Ex.: CB 500F" />
        <Field label="Versão (opcional)" value={version} onChangeText={setVersion} placeholder="Ex.: ABS" />

        <View className="flex-row gap-3">
          <Field label="Ano" value={year} onChangeText={setYear} placeholder="2021" keyboardType="number-pad" className="flex-1" />
          <Field label="Cilindrada (cc)" value={displacementCc} onChangeText={setDisplacementCc} placeholder="500" keyboardType="number-pad" className="flex-1" />
        </View>
        <View className="flex-row gap-3">
          <Field label="Preço (R$)" value={price} onChangeText={setPrice} placeholder="28.900" keyboardType="decimal-pad" className="flex-1" />
          <Field label="Quilometragem" value={mileage} onChangeText={setMileage} placeholder="12.400" keyboardType="number-pad" className="flex-1" />
        </View>

        <Text className="mb-2 mt-2 text-sm font-jakarta-semibold text-ink">Estilo</Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {categories.map((item) => (
            <Chip
              key={item.value}
              selected={category === item.value}
              showSelectedCheck={false}
              onPress={() => setCategory(item.value)}
              style={{
                backgroundColor: category === item.value ? "#F4E7DF" : "#FFFFFF",
                borderColor: category === item.value ? "#A84F26" : "#DFE3E0",
                borderWidth: 1
              }}
            >
              {item.label}
            </Chip>
          ))}
        </View>

        <View className="mb-4">
          <View className="mb-2 flex-row items-end justify-between">
            <Text className="text-sm font-jakarta-semibold text-ink">Fotos da moto</Text>
            <Text className="text-xs text-muted">{photos.length}/{MAX_PHOTOS}</Text>
          </View>
          <Text className="mb-3 text-xs leading-5 text-muted">Adicione até 5 fotos em JPG, PNG ou WebP. Cada arquivo pode ter até 10 MB.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 2 }}>
            {photos.map((photo, index) => (
              <View key={photo.uri + index} className="relative h-[88px] w-[88px] overflow-visible">
                <Image source={{ uri: photo.uri }} resizeMode="cover" className="h-full w-full rounded-xl border border-line" />
                <View className="absolute -right-2 -top-2 rounded-full bg-white shadow-sm">
                  <IconButton
                    icon="close"
                    size={16}
                    accessibilityLabel={`Remover foto ${index + 1}`}
                    onPress={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                    style={{ margin: 0, width: 30, height: 30 }}
                  />
                </View>
              </View>
            ))}
            {photos.length < MAX_PHOTOS && (
              <Button
                mode="outlined"
                icon="image-plus-outline"
                onPress={() => void addPhotos()}
                contentStyle={{ height: 84, flexDirection: "column" }}
                style={{ width: 100, borderRadius: 12, borderStyle: "dashed" }}
                accessibilityLabel="Adicionar fotos da moto"
              >
                Adicionar
              </Button>
            )}
          </ScrollView>
        </View>

        <View className="flex-row gap-3">
          <Field label="Cidade" value={city} onChangeText={setCity} placeholder="Belém" className="flex-[3]" />
          <Field label="UF" value={state} onChangeText={setState} placeholder="PA" maxLength={2} className="flex-1" />
        </View>
        <Field label="Descrição" value={description} onChangeText={setDescription} placeholder="Conte um pouco sobre sua moto" multiline numberOfLines={4} />

        {!!error && (
          <View className="mb-4 rounded-xl border border-[#E4B7B2] bg-[#FFF2F0] px-4 py-3">
            <Text className="text-sm leading-5 text-[#8E2720]">{error}</Text>
          </View>
        )}
        <Button
          mode="contained"
          onPress={() => void submit()}
          loading={loading}
          disabled={loading}
          contentStyle={{ minHeight: 50 }}
          style={{ borderRadius: 14, marginTop: 4 }}
        >
          Publicar anúncio
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  className = "",
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string; className?: string }) {
  return (
    <View className={"mb-3 " + className}>
      <Text className="mb-2 text-sm font-jakarta-semibold text-ink">{label}</Text>
      <TextInput
        mode="outlined"
        {...inputProps}
        outlineColor="#DFE3E0"
        activeOutlineColor="#A84F26"
        style={{ backgroundColor: "#FFFFFF" }}
        contentStyle={{ minHeight: inputProps.multiline ? 92 : 48 }}
      />
    </View>
  );
}
