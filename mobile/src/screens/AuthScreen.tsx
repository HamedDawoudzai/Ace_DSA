import React, { useCallback, useEffect, useRef, useState } from "react";
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
  type TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotify } from "../context/NotificationContext";
import SpinningLogo, { SpinningLogoHandle } from "../components/SpinningLogo";
import ThemeToggle from "../components/ThemeToggle";
import { getAuthErrorMessage } from "../services/httpError";
import api from "../services/api";

type Mode = "login" | "signup" | "forgot";

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
    special: /[^a-zA-Z0-9\s]/.test(pw),
  };
}

function allPassed(checks: PasswordChecks): boolean {
  return (
    checks.length &&
    checks.upper &&
    checks.lower &&
    checks.digit &&
    checks.special
  );
}

function normalizeIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }
  return trimmed;
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

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");

  const [loading, setLoading] = useState(false);

  const logoRef = useRef<SpinningLogoHandle>(null);
  const btnScale = useRef(new Animated.Value(1)).current;
  const shimmerX = useRef(new Animated.Value(-150)).current;

  // Tagline fade-in on mount
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(taglineTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Shimmer sweep loop on the login button
  useEffect(() => {
    shimmerX.setValue(-150);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2800),
        Animated.timing(shimmerX, {
          toValue: 500,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerX, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const inputBg = isDark ? "rgba(17, 17, 17, 0.95)" : "rgba(0, 0, 0, 0.04)";
  const inputBorder = isDark
    ? "rgba(13, 217, 196, 0.20)"
    : "rgba(0, 0, 0, 0.1)";
  const accentGlow = isDark
    ? "rgba(13, 217, 196, 0.15)"
    : "rgba(245, 200, 66, 0.25)";
  const pwChecks = checkPassword(signupPassword);
  const pwValid = allPassed(pwChecks);

  const handleModeSwitch = (next: Mode) => {
    if (loading) return;
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
    if (loading) return;
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
      await signIn(normalizeIdentifier(identifier), password);
    } catch (error: unknown) {
      const message = getAuthErrorMessage(
        error,
        "We couldn't sign you in. Please try again."
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
    if (loading) return;
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
      notify({
        type: "error",
        title: "Missing details",
        message: "Email is required.",
      });
      return;
    }
    if (!pwValid) {
      notify({
        type: "error",
        title: "Weak password",
        message: "Your password doesn't meet the requirements.",
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
        "We couldn't create your account. Please try again."
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

  const handleForgotPassword = async () => {
    if (loading) return;
    if (forgotStep === "email") {
      if (!forgotEmail.trim()) {
        notify({
          type: "error",
          title: "Missing email",
          message: "Enter your email address.",
        });
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.post("/auth/forgot-password", {
          email: forgotEmail.trim().toLowerCase(),
        });
        if (data.token) {
          setResetToken(data.token);
          setForgotStep("reset");
          notify({
            type: "success",
            title: "Token generated",
            message: "Enter the token and your new password.",
          });
        } else {
          notify({
            type: "info",
            title: "Check your email",
            message: data.status || "If that email exists, a reset was sent.",
          });
        }
      } catch (error: unknown) {
        const message = getAuthErrorMessage(
          error,
          "Could not process reset request."
        );
        notify({ type: "error", title: "Error", message });
      } finally {
        setLoading(false);
      }
    } else {
      if (!resetToken.trim() || !newPassword) {
        notify({
          type: "error",
          title: "Missing fields",
          message: "Token and new password are required.",
        });
        return;
      }
      setLoading(true);
      try {
        await api.post("/auth/reset-password", {
          token: resetToken.trim(),
          new_password: newPassword,
        });
        notify({
          type: "success",
          title: "Password reset!",
          message: "You can now log in with your new password.",
        });
        setMode("login");
        setForgotStep("email");
        setForgotEmail("");
        setResetToken("");
        setNewPassword("");
      } catch (error: unknown) {
        const message = getAuthErrorMessage(error, "Could not reset password.");
        notify({ type: "error", title: "Error", message });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit =
    mode === "login"
      ? handleLogin
      : mode === "signup"
      ? handleSignup
      : handleForgotPassword;

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

  /** Web-only autofill / focus ring overrides (valid on web; RN typings omit `outlineStyle: "none"`). */
  const webFieldChrome: TextStyle | null =
    Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
          boxShadow: `0 0 0 1000px ${inputBg} inset`,
        } as unknown as TextStyle)
      : null;

  const inputStyle = [
    styles.input,
    {
      backgroundColor: inputBg,
      borderColor: inputBorder,
      color: colors.inputText,
    },
    webFieldChrome,
  ];

  const buttonLabel =
    mode === "login"
      ? "LOG IN"
      : mode === "signup"
      ? "SIGN UP"
      : forgotStep === "email"
      ? "SEND RESET TOKEN"
      : "RESET PASSWORD";

  // Shimmer tint: white in both modes, just slightly more transparent in light
  const shimmerColor = isDark
    ? "rgba(255,255,255,0.22)"
    : "rgba(255,255,255,0.38)";

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

          {/* Tagline with fade-in */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                color: colors.textSecondary,
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
              },
            ]}
          >
            {mode === "login"
              ? "Log in to practice DSA drills\nand ace your interviews"
              : mode === "signup"
              ? "Create your account to get started"
              : "Reset your password"}
          </Animated.Text>

          <View style={styles.form}>
            {mode === "forgot" && (
              <>
                {forgotStep === "email" ? (
                  <TextInput
                    style={inputStyle}
                    placeholder="EMAIL ADDRESS"
                    placeholderTextColor={colors.placeholderText}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    returnKeyType="go"
                    onSubmitEditing={handleForgotPassword}
                  />
                ) : (
                  <>
                    <TextInput
                      style={inputStyle}
                      placeholder="RESET TOKEN"
                      placeholderTextColor={colors.placeholderText}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={resetToken}
                      onChangeText={setResetToken}
                      returnKeyType="next"
                    />
                    <View style={styles.passwordFieldWrap}>
                      <TextInput
                        style={[inputStyle, styles.passwordInputFull]}
                        placeholder="NEW PASSWORD"
                        placeholderTextColor={colors.placeholderText}
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        returnKeyType="go"
                        onSubmitEditing={handleForgotPassword}
                      />
                      <Pressable
                        style={styles.passwordIconBtn}
                        onPress={() => setShowNewPassword((c) => !c)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name={
                            showNewPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={18}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            )}
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

            {mode !== "forgot" && (
              <>
                <TextInput
                  style={inputStyle}
                  placeholder={mode === "login" ? "EMAIL OR USERNAME" : "EMAIL"}
                  placeholderTextColor={colors.placeholderText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  value={mode === "login" ? identifier : signupEmail}
                  onChangeText={
                    mode === "login" ? setIdentifier : setSignupEmail
                  }
                  returnKeyType="next"
                />

                <View style={styles.passwordFieldWrap}>
                  <TextInput
                    style={[inputStyle, styles.passwordInputFull]}
                    placeholder="PASSWORD"
                    placeholderTextColor={colors.placeholderText}
                    secureTextEntry={
                      mode === "login" ? !showLoginPassword : !showSignupPassword
                    }
                    value={mode === "login" ? password : signupPassword}
                    onChangeText={
                      mode === "login" ? setPassword : setSignupPassword
                    }
                    textContentType={
                      mode === "signup" ? "newPassword" : "password"
                    }
                    autoComplete={
                      mode === "signup" ? "password-new" : "current-password"
                    }
                    returnKeyType={mode === "login" ? "go" : "done"}
                    onSubmitEditing={handleSubmit}
                  />
                  <Pressable
                    style={styles.passwordIconBtn}
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
              </>
            )}

            {mode === "signup" && signupPassword.length > 0 && (
              <View style={styles.checksContainer}>
                {renderCheck("At least 8 characters", pwChecks.length)}
                {renderCheck("One uppercase letter", pwChecks.upper)}
                {renderCheck("One lowercase letter", pwChecks.lower)}
                {renderCheck("One digit", pwChecks.digit)}
                {renderCheck("One special character", pwChecks.special)}
              </View>
            )}

            {mode === "login" && (
              <Pressable
                onPress={() => {
                  setMode("forgot");
                  setForgotStep("email");
                  setForgotEmail(identifier.includes("@") ? identifier : "");
                }}
                style={styles.forgotLink}
              >
                <Text style={[styles.forgotText, { color: colors.accent }]}>
                  Forgot Password?
                </Text>
              </Pressable>
            )}

            {/* Submit button with shimmer */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: colors.accent,
                    opacity: pressed ? 0.88 : loading ? 0.65 : 1,
                    shadowColor: colors.accent,
                    shadowOpacity: isDark ? 0.4 : 0.25,
                    shadowRadius: isDark ? 14 : 6,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 6,
                  },
                ]}
                onPress={handleSubmit}
                onPressIn={animateBtnIn}
                onPressOut={animateBtnOut}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.accentText} />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.submitText,
                        { color: colors.accentText },
                      ]}
                    >
                      {buttonLabel}
                    </Text>
                    {/* Shimmer sweep — only on login button */}
                    {mode === "login" && (
                      <Animated.View
                        style={[
                          styles.shimmerStrip,
                          {
                            backgroundColor: shimmerColor,
                            transform: [
                              { translateX: shimmerX },
                              { rotate: "18deg" },
                            ],
                          },
                        ]}
                        pointerEvents="none"
                      />
                    )}
                  </>
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
                backgroundColor: pressed ? accentGlow : "transparent",
              },
            ]}
            onPress={() => {
              if (mode === "forgot") {
                handleModeSwitch("login");
              } else {
                handleModeSwitch(mode === "login" ? "signup" : "login");
              }
            }}
            disabled={loading}
          >
            <Text style={[styles.switchText, { color: colors.accent }]}>
              {mode === "forgot"
                ? "Back to Login"
                : mode === "login"
                ? "Create a New Account"
                : "Log In to Existing Account"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { borderTopColor: inputBorder }]}>
        <Text style={[styles.bottomText, { color: colors.textMuted }]}>
          {mode === "forgot"
            ? "Remember your password? "
            : mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.bottomLinkWrap,
            {
              backgroundColor: pressed ? accentGlow : "transparent",
            },
          ]}
          onPress={() => {
            if (mode === "forgot") {
              handleModeSwitch("login");
            } else {
              handleModeSwitch(mode === "login" ? "signup" : "login");
            }
          }}
          disabled={loading}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Text style={[styles.bottomLink, { color: colors.accent }]}>
            {mode === "forgot" ? "Log In" : mode === "login" ? "Sign Up" : "Log In"}
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
    lineHeight: 22,
    marginTop: 4,
    marginBottom: 10,
    letterSpacing: 0.1,
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
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  passwordFieldWrap: {
    position: "relative",
    width: "100%",
  },
  passwordInputFull: {
    paddingRight: 48,
    letterSpacing: 0.5,
  },
  passwordIconBtn: {
    position: "absolute",
    right: 4,
    top: 0,
    bottom: 0,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
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
  forgotLink: {
    alignSelf: "flex-end",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
  },
  submitBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  submitText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  shimmerStrip: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 56,
    borderRadius: 8,
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
