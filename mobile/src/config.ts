import Constants from "expo-constants";

export function getApiBaseUrl(): string {
  const fromPublicEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromPublicEnv && typeof fromPublicEnv === "string") {
    return fromPublicEnv;
  }

  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: unknown } | undefined;
  const fromExtra = extra?.apiBaseUrl;
  if (typeof fromExtra === "string" && fromExtra.length > 0) {
    return fromExtra;
  }

  return "http://localhost:8080";
}

