import { Platform } from "react-native";

const platformDefault = Platform.OS === "android"
  ? "http://10.0.2.2:8082/api"
  : "http://localhost:8082/api";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || platformDefault
).replace(/\/$/, "");
