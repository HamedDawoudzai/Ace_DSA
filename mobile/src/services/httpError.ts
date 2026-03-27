import { AxiosError } from "axios";

function extractMessage(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (typeof payload === "object") {
    const data = payload as { message?: unknown; error?: unknown; detail?: unknown };
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (typeof data.detail === "string") return data.detail;
  }
  return null;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError | undefined;

  if (axiosError?.code === "ECONNABORTED") {
    return "Request timed out. Check your connection and try again.";
  }

  if (axiosError?.message === "Network Error") {
    return "Unable to reach the server. Verify backend is running and phone/laptop are on the same Wi-Fi.";
  }

  const responseData = axiosError?.response?.data;
  const extracted = extractMessage(responseData);
  if (extracted) return extracted;

  if (typeof axiosError?.message === "string" && axiosError.message.length > 0) {
    return axiosError.message;
  }

  return fallback;
}
