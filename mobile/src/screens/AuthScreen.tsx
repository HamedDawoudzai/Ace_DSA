import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotify } from "../context/NotificationContext";
import SpinningLogo, { SpinningLogoHandle } from "../components/SpinningLogo";
import ThemeToggle from "../components/ThemeToggle";
import { getAuthErrorMessage } from "../services/httpError";
import { getApiBaseUrl } from "../config";

type Mode = "login" | "signup";

interface PasswordChecks {
  length: boolean;
  upper: boolean;
  lower: boolean;
  digit: boolean;
  special: boolean;
}

function checkPassword(pw: string): PasswordChecks {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

function allPassed(checks: PasswordChecks): boolean {
  return checks.length && checks.upper && checks.lower && checks.digit && checks.special;
}

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { colors, isDark } = useTheme();
  const notify = useNotify();
  const [mode, setMode] = useState<Mode>("login");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const logoRef = useRef<SpinningLogoHandle>(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  const inputBg = isDark ? "rgba(21, 27, 46, 0.6)" : "rgba(0, 0, 0, 0.04)";
  const inputBorder = isDark
    ? "rgba(45, 212, 191, 0.18)"
    : "rgba(0, 0, 0, 0.1)";
  const accentGlow = isDark
    ? "rgba(45, 212, 191, 0.15)"
    : "rgba(245, 200, 66, 0.25)";
  const apiBaseUrl = getApiBaseUrl();

  const pwChecks = checkPassword(signupPassword);
  const pwValid = allPassed(pwChecks);

  const handleModeSwitch = (next: Mode) => {
    setMode(next);
    logoRef.current?.spin();
  };

  const animateBtnIn = useCallback(() => {
    Animated.spring(btnScale, {
      toValue: 0.96,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [btnScale]);

  const animateBtnOut = useCallback(() => {
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [btnScale]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      notify({
        type: "error",
        title: "Missing details",
        message: "Email/username and password are required.",
      });
      return;
    }
    logoRef.current?.spin();
    setLoading(true);
    try {
      await signIn(identifier.trim().toLowerCase(), password);
    } catch (error: unknown) {
      const message = getAuthErrorMessage(
        error,
        "We couldn’t sign you in. Please try again."
      );
      notify({
        type: "error",
        title: "Login failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      notify({
        type: "error",
        title: "Missing details",
        message: "First name and last name are required.",
      });
      return;
    }
    if (!username.trim() || !/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      notify({
        type: "error",
        title: "Invalid username",
        message: "Use 3–30 characters: letters, numbers, underscores.",
      });
      return;
    }
    if (!signupEmail.trim()) {
      notify({ type: "error", title: "Missing details", message: "Email is required." });
      return;
    }
    if (!pwValid) {
      notify({
        type: "error",
        title: "Weak password",
        message: "Your password doesn’t meet the requirements.",
      });
      return;
    }
    logoRef.current?.spin();
    setLoading(true);
    try {
      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
      });
    } catch (error: unknown) {
      const message = getAuthErrorMessage(
        error,
        "We couldn’t create your account. Please try again."
      );
      notify({
        type: "error",
        title: "Sign up failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === "login" ? handleLogin : handleSignup;

  const renderCheck = (label: string, passed: boolean) => (
    <View style={styles.checkRow} key={label}>
      <Ionicons
        name={passed ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={passed ? colors.success : colors.textMuted}
      />
      <Text
        style={[
          styles.checkLabel,
          { color: passed ? colors.success : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const inputStyle = [
    styles.input,
    { backgroundColor: inputBg, borderColor: inputBorder, color: colors.inputText },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.themeToggleWrap}>
        <ThemeToggle />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          <View style={styles.logoSection}>
            <SpinningLogo ref={logoRef} size={260} />
          </View>

          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {mode === "login"
              ? "Log in to practice DSA drills\nand ace your interviews"
              : "Create your account to get started"}
          </Text>
          {mode === "login" ? (
            <Text style={[styles.connectionHint, { color: colors.textMuted }]}>
              API: {apiBaseUrl}
            </Text>
          ) : null}

          <View style={styles.form}>
            {mode === "signup" && (
              <>
                <View style={styles.nameRow}>
                  <View style={styles.nameCol}>
                    <TextInput
                      style={inputStyle}
                      placeholder="FIRST NAME"
                      placeholderTextColor={colors.placeholderText}
                      autoCapitalize="words"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={styles.nameCol}>
                    <TextInput
                      style={inputStyle}
                      placeholder="LAST NAME"
                      placeholderTextColor={colors.placeholderText}
                      autoCapitalize="words"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <TextInput
                  style={inputStyle}
                  placeholder="USERNAME"
                  placeholderTextColor={colors.placeholderText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={username}
                  onChangeText={setUsername}
                  returnKeyType="next"
                />
              </>
            )}

            <TextInput
              style={inputStyle}
              placeholder={mode === "login" ? "EMAIL OR USERNAME" : "EMAIL"}
              placeholderTextColor={colors.placeholderText}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              value={mode === "login" ? identifier : signupEmail}
              onChangeText={mode === "login" ? setIdentifier : setSignupEmail}
              returnKeyType="next"
            />

            <View style={[styles.passwordWrap, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <TextInput
                style={[styles.passwordInput, { color: colors.inputText }]}
                placeholder="PASSWORD"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry={mode === "login" ? !showLoginPassword : !showSignupPassword}
                value={mode === "login" ? password : signupPassword}
                onChangeText={mode === "login" ? setPassword : setSignupPassword}
                textContentType="password"
                returnKeyType={mode === "login" ? "go" : "done"}
                onSubmitEditing={handleSubmit}
              />
              <Pressable
                onPress={() =>
                  mode === "login"
                    ? setShowLoginPassword((cur) => !cur)
                    : setShowSignupPassword((cur) => !cur)
                }
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={
                    mode === "login"
                      ? showLoginPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                      : showSignupPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                  }
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            {mode === "signup" && signupPassword.length > 0 && (
              <View style={styles.checksContainer}>
                {renderCheck("At least 8 characters", pwChecks.length)}
                {renderCheck("One uppercase letter", pwChecks.upper)}
                {renderCheck("One lowercase letter", pwChecks.lower)}
                {renderCheck("One digit", pwChecks.digit)}
                {renderCheck("One special character", pwChecks.special)}
              </View>
            )}

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    borderColor: colors.accent,
                    backgroundColor:
                      pressed ? accentGlow : "transparent",
                  },
                  loading && { opacity: 0.6 },
                ]}
                onPress={handleSubmit}
                onPressIn={animateBtnIn}
                onPressOut={animateBtnOut}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.accent} />
                ) : (
                  <Text style={[styles.submitText, { color: colors.accent }]}>
                    {mode === "login" ? "LOG IN" : "SIGN UP"}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          </View>

          <View style={styles.dividerRow}>
            <View
              style={[styles.dividerLine, { backgroundColor: inputBorder }]}
            />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              OR
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: inputBorder }]}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.switchBtn,
              {
                backgroundColor:
                  pressed ? accentGlow : "transparent",
              },
            ]}
            onPress={() =>
              handleModeSwitch(mode === "login" ? "signup" : "login")
            }
          >
            <Text style={[styles.switchText, { color: colors.accent }]}>
              {mode === "login"
                ? "Create a New Account"
                : "Log In to Existing Account"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { borderTopColor: inputBorder }]}>
        <Text style={[styles.bottomText, { color: colors.textMuted }]}>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.bottomLinkWrap,
            {
              backgroundColor:
                pressed ? accentGlow : "transparent",
            },
          ]}
          onPress={() =>
            handleModeSwitch(mode === "login" ? "signup" : "login")
          }
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Text style={[styles.bottomLink, { color: colors.accent }]}>
            {mode === "login" ? "Sign Up" : "Log In"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    right: 20,
    zIndex: 10,
  },
  scroll: {
    flexGrow: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 2,
    marginBottom: 8,
  },
  connectionHint: {
    textAlign: "center",
    fontSize: 11,
    marginBottom: 18,
  },
  form: {
    gap: 10,
  },
  nameRow: {
    flexDirection: "row",
    gap: 10,
  },
  nameCol: {
    flex: 1,
  },
  input: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: "500",
  },
  passwordWrap: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: "500",
  },
  checksContainer: {
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  submitBtn: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  switchBtn: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  switchText: {
    fontSize: 15,
    fontWeight: "700",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  bottomText: {
    fontSize: 14,
  },
  bottomLinkWrap: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
