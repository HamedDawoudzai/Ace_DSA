import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { getApiBaseUrl } from "../config";

interface NetworkContextValue {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({ isOnline: true });

const PING_INTERVAL = 15_000;

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const checkConnectivity = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${getApiBaseUrl()}/health`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timer);
      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    checkConnectivity();
    const id = setInterval(checkConnectivity, PING_INTERVAL);
    return () => clearInterval(id);
  }, [checkConnectivity]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOnline ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOnline, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0],
  });

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.banner,
          {
            transform: [{ translateY }],
            opacity: slideAnim,
          },
        ]}
      >
        <View style={styles.inner}>
          <Text style={styles.text}>No internet connection</Text>
        </View>
      </Animated.View>
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 34,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
  },
  inner: {
    backgroundColor: "#e53e3e",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
