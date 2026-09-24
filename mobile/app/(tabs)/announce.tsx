import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth";

const steps = [
  { icon: "camera-outline", title: "Conte a história da moto", text: "Inclua fotos e os dados principais." },
  { icon: "clipboard-text-outline", title: "Informe as condições", text: "Preço, quilometragem e localização." },
  { icon: "check-circle-outline", title: "Revise e publique", text: "Seu anúncio entra no catálogo do Giro Certo." }
];

export default function AnnounceScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <View className="px-5 pt-6">
        <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-copper-wash">
          <MaterialCommunityIcons name="tag-outline" size={26} color="#A84F26" />
        </View>
        <Text className="text-3xl font-jakarta-bold tracking-tight text-ink">Venda sua moto.</Text>
        <Text className="mt-2 text-base leading-6 text-muted">
          Um anúncio claro ajuda a pessoa certa a encontrar sua próxima moto.
        </Text>

        <View className="mt-8 gap-3">
          {steps.map((step, index) => (
            <View key={step.title} className="flex-row rounded-2xl border border-line bg-white p-4">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-canvas">
                <MaterialCommunityIcons name={step.icon as never} size={21} color="#687170" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-jakarta-semibold text-ink">{index + 1}. {step.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-muted">{step.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => router.push(user ? "/create-listing" : "/login")}
          contentStyle={{ minHeight: 50 }}
          style={{ marginTop: 28, borderRadius: 14 }}
        >
          {user ? "Começar anúncio" : "Entrar para anunciar"}
        </Button>
        {!user && (
          <Text className="mt-3 text-center text-xs leading-5 text-muted">
            Você pode explorar o catálogo sem entrar. Para publicar, crie uma conta ou entre.
          </Text>
        )}
      </View>
    </Screen>
  );
}
