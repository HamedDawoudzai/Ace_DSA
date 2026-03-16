import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "signup";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email.trim().toLowerCase(), password);
      } else {
        await signUp(email.trim().toLowerCase(), password);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data || err?.message || "Something went wrong.";
      Alert.alert("Error", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Ace DSA</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </Text>

        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segBtn, mode === "login" && styles.segBtnActive]}
            onPress={() => setMode("login")}
          >
            <Text
              style={[
                styles.segText,
                mode === "login" && styles.segTextActive,
              ]}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, mode === "signup" && styles.segBtnActive]}
            onPress={() => setMode("signup")}
          >
            <Text
              style={[
                styles.segText,
                mode === "signup" && styles.segTextActive,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === "login" ? "Log In" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F5C842",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#D5CDB8",
    borderRadius: 10,
    marginBottom: 24,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  segBtnActive: {
    backgroundColor: "#F5C842",
  },
  segText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  segTextActive: {
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#F5C842",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },
});
