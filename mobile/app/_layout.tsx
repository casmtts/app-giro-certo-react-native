import "../global.css";
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, useFonts } from "@expo-google-fonts/plus-jakarta-sans";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { View } from "react-native";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { SearchFiltersProvider } from "@/lib/search-filters";
import { paperTheme } from "@/lib/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="#A84F26" />
      </View>
    );
  }

  return (
    <PaperProvider
      theme={paperTheme}
      settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}
    >
      <AuthProvider>
        <FavoritesProvider>
          <SearchFiltersProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#F5F5F2" },
              animation: "slide_from_right"
            }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="motorcycles/[id]" />
              <Stack.Screen name="filters" />
              <Stack.Screen name="login" />
              <Stack.Screen name="create-listing" />
            </Stack>
          </SearchFiltersProvider>
        </FavoritesProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
