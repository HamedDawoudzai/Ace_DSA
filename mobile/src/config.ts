import Constants from "expo-constants";

function normalizeUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function toNetworkUrl(localUrl: string): string | null {
  const hostUri =
    (Constants.expoConfig as { hostUri?: string } | null | undefined)?.hostUri ??
    (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })
      ?.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri || typeof hostUri !== "string") {
    return null;
  }

  const host = hostUri.split(":")[0];
  if (!host) {
    return null;
  }

  return localUrl.replace("localhost", host).replace("127.0.0.1", host);
}

export function getApiBaseUrl(): string {
  const fromPublicEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromPublicEnv && typeof fromPublicEnv === "string") {
    return normalizeUrl(fromPublicEnv);
  }

  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: unknown } | undefined;
  const fromExtra = extra?.apiBaseUrl;
  if (typeof fromExtra === "string" && fromExtra.length > 0) {
    const normalized = normalizeUrl(fromExtra);
    if (normalized.includes("localhost") || normalized.includes("127.0.0.1")) {
      return toNetworkUrl(normalized) ?? normalized;
    }
    return normalized;
  }

  const fallback = "http://localhost:8080";
  return toNetworkUrl(fallback) ?? fallback;
}

