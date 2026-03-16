import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";

export type NoticeType = "success" | "error" | "info";

export interface NoticeOptions {
  title: string;
  message?: string;
  type?: NoticeType;
  durationMs?: number;
}

interface Notice extends Required<NoticeOptions> {
  id: string;
}

interface NotificationContextValue {
  notify: (opts: NoticeOptions) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function iconFor(type: NoticeType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "success":
      return "checkmark-circle";
    case "error":
      return "close-circle";
    default:
      return "information-circle";
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  const [queue, setQueue] = useState<Notice[]>([]);
  const active = queue[0] ?? null;

  const translateY = useRef(new Animated.Value(-16)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -16, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setQueue((q) => q.slice(1));
    });
  }, [opacity, translateY]);

  const notify = useCallback(
    (opts: NoticeOptions) => {
      const notice: Notice = {
        id: `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        title: opts.title,
        message: opts.message ?? "",
        type: opts.type ?? "info",
        durationMs: opts.durationMs ?? 3200,
      };

      setQueue((q) => [...q, notice]);
    },
    []
  );

  useEffect(() => {
    if (!active) return;

    translateY.setValue(-16);
    opacity.setValue(0);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      hideTimer.current = setTimeout(hide, active.durationMs);
    });
  }, [active?.id, active?.durationMs, hide, opacity, translateY]);

  const value = useMemo(() => ({ notify }), [notify]);

  const bg =
    active?.type === "success"
      ? isDark
        ? "rgba(34,197,94,0.14)"
        : "rgba(76,175,80,0.14)"
      : active?.type === "error"
        ? isDark
          ? "rgba(239,68,68,0.16)"
          : "rgba(244,67,54,0.14)"
        : isDark
          ? "rgba(45,212,191,0.12)"
          : "rgba(0,0,0,0.06)";

  const border =
    active?.type === "success"
      ? "rgba(34,197,94,0.32)"
      : active?.type === "error"
        ? "rgba(239,68,68,0.32)"
        : isDark
          ? "rgba(45,212,191,0.22)"
          : "rgba(0,0,0,0.10)";

  const iconColor =
    active?.type === "success"
      ? colors.success
      : active?.type === "error"
        ? colors.error
        : colors.accent;

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {active && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrap,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View
            style={[
              styles.toast,
              {
                backgroundColor: bg,
                borderColor: border,
              },
            ]}
          >
            <Ionicons name={iconFor(active.type)} size={20} color={iconColor} />
            <View style={styles.textCol}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {active.title}
              </Text>
              {active.message ? (
                <Text style={[styles.msg, { color: colors.textSecondary }]} numberOfLines={2}>
                  {active.message}
                </Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotify(): (opts: NoticeOptions) => void {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotify must be used within NotificationProvider");
  }
  return ctx.notify;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    top: Platform.OS === "ios" ? 56 : 44,
    zIndex: 10000,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  msg: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
});

