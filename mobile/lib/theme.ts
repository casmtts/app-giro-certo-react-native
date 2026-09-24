import { MD3LightTheme } from "react-native-paper";

const fonts = {
  ...MD3LightTheme.fonts,
  displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontFamily: "PlusJakartaSans_700Bold" },
  displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontFamily: "PlusJakartaSans_700Bold" },
  displaySmall: { ...MD3LightTheme.fonts.displaySmall, fontFamily: "PlusJakartaSans_700Bold" },
  headlineLarge: { ...MD3LightTheme.fonts.headlineLarge, fontFamily: "PlusJakartaSans_700Bold" },
  headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontFamily: "PlusJakartaSans_700Bold" },
  headlineSmall: { ...MD3LightTheme.fonts.headlineSmall, fontFamily: "PlusJakartaSans_600SemiBold" },
  titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: "PlusJakartaSans_700Bold" },
  titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: "PlusJakartaSans_600SemiBold" },
  titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontFamily: "PlusJakartaSans_600SemiBold" },
  bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: "PlusJakartaSans_400Regular" },
  bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: "PlusJakartaSans_400Regular" },
  bodySmall: { ...MD3LightTheme.fonts.bodySmall, fontFamily: "PlusJakartaSans_400Regular" },
  labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontFamily: "PlusJakartaSans_600SemiBold" },
  labelMedium: { ...MD3LightTheme.fonts.labelMedium, fontFamily: "PlusJakartaSans_500Medium" },
  labelSmall: { ...MD3LightTheme.fonts.labelSmall, fontFamily: "PlusJakartaSans_500Medium" }
};

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 4,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#A84F26",
    onPrimary: "#FFFFFF",
    primaryContainer: "#F4E7DF",
    onPrimaryContainer: "#5B2810",
    secondary: "#687170",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E9ECE9",
    onSecondaryContainer: "#202626",
    background: "#F5F5F2",
    surface: "#FFFFFF",
    surfaceVariant: "#ECEEEB",
    onSurface: "#202626",
    onSurfaceVariant: "#687170",
    outline: "#9BA3A0",
    outlineVariant: "#DFE3E0",
    error: "#BA1A1A"
  }
};
