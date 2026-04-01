import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotificationContext";
import api from "../services/api";
import SpinningLogo from "../components/SpinningLogo";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  created_at: string;
}

interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

function formatMemberSince(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const resp = (err as { response?: { data?: { error?: string } } }).response;
    if (resp?.data?.error) return resp.data.error;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export default function ProfileScreen() {
  const { colors, isDark, toggle } = useTheme();
  const { signOut } = useAuth();
  const notify = useNotify();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [saving, setSaving] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<UserProfile>("/me/profile");
      setProfile(data);
    } catch (err) {
      notify({ title: "Failed to load profile", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const openEdit = () => {
    if (!profile) return;
    setEditFirst(profile.first_name);
    setEditLast(profile.last_name);
    setEditUsername(profile.username);
    setEditOpen(true);
  };

  const cancelEdit = () => {
    setEditOpen(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    const body: UpdateProfileRequest = {};
    if (editFirst.trim() !== profile.first_name)
      body.first_name = editFirst.trim();
    if (editLast.trim() !== profile.last_name)
      body.last_name = editLast.trim();
    if (editUsername.trim() !== profile.username)
      body.username = editUsername.trim();

    if (Object.keys(body).length === 0) {
      setEditOpen(false);
      return;
    }

    try {
      setSaving(true);
      const { data } = await api.put<UserProfile>("/me/profile", body);
      setProfile(data);
      setEditOpen(false);
      notify({ title: "Profile updated", type: "success" });
    } catch (err) {
      notify({ title: getErrorMessage(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!newPw || !currentPw) {
      notify({ title: "Please fill in all fields", type: "error" });
      return;
    }
    if (newPw !== confirmPw) {
      notify({ title: "New passwords don't match", type: "error" });
      return;
    }
    if (newPw.length < 8) {
      notify({
        title: "Password must be at least 8 characters",
        type: "error",
      });
      return;
    }

    const body: ChangePasswordRequest = {
      current_password: currentPw,
      new_password: newPw,
    };

    try {
      setChangingPw(true);
      await api.put("/me/password", body);
      setPwOpen(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setShowCurrentPw(false);
      setShowNewPw(false);
      setShowConfirmPw(false);
      notify({ title: "Password changed", type: "success" });
    } catch (err) {
      notify({ title: getErrorMessage(err), type: "error" });
    } finally {
      setChangingPw(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your data will be erased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccount,
        },
      ]
    );
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/me/account");
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        notify({ title: getErrorMessage(err), type: "error" });
        setDeleting(false);
        return;
      }
    }
    try {
      await signOut();
    } catch {
      // signOut should always succeed, but if it doesn't, we still want to leave
    }
  };

  const initials = profile
    ? `${(profile.first_name[0] ?? "").toUpperCase()}${(profile.last_name[0] ?? "").toUpperCase()}`
    : "";

  if (loading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.background, flex: 1 },
        ]}
      >
        <SpinningLogo size={120} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── ACCOUNT ───────────────────────────── */}
      <View style={styles.avatarSection}>
        <View
          style={[styles.avatar, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.avatarText, { color: colors.accentText }]}>
            {initials}
          </Text>
        </View>
        {profile && (
          <>
            <Text style={[styles.fullName, { color: colors.text }]}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{profile.username}
            </Text>
            <Text style={[styles.email, { color: colors.textMuted }]}>
              {profile.email}
            </Text>
            <Text style={[styles.memberSince, { color: colors.textMuted }]}>
              Member since {formatMemberSince(profile.created_at)}
            </Text>
          </>
        )}
      </View>

      <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
        ACCOUNT
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable
          style={styles.row}
          onPress={editOpen ? cancelEdit : openEdit}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.accentSubtle }]}>
            <Ionicons name="person-outline" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Edit Profile
          </Text>
          <Ionicons
            name={editOpen ? "chevron-up" : "chevron-forward"}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>

        {editOpen && (
          <View style={styles.expandedSection}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.inputText,
                  borderColor: colors.border,
                },
              ]}
              placeholder="First name"
              placeholderTextColor={colors.placeholderText}
              value={editFirst}
              onChangeText={setEditFirst}
              autoCapitalize="words"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.inputText,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Last name"
              placeholderTextColor={colors.placeholderText}
              value={editLast}
              onChangeText={setEditLast}
              autoCapitalize="words"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.inputText,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Username"
              placeholderTextColor={colors.placeholderText}
              value={editUsername}
              onChangeText={setEditUsername}
              autoCapitalize="none"
            />
            <View style={styles.editButtonRow}>
              <Pressable
                style={[styles.btnSecondary, { borderColor: colors.border }]}
                onPress={cancelEdit}
              >
                <Text
                  style={[styles.btnSecondaryText, { color: colors.textSecondary }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.btnPrimary, { backgroundColor: colors.accent }]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.accentText} />
                ) : (
                  <Text
                    style={[styles.btnPrimaryText, { color: colors.accentText }]}
                  >
                    Save
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* ── APPEARANCE ────────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
        APPEARANCE
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable style={styles.row} onPress={toggle}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentSubtle }]}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={18}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
          <View
            style={[
              styles.toggleTrack,
              {
                backgroundColor: isDark ? colors.accent : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: isDark ? colors.accentText : colors.surface,
                  transform: [{ translateX: isDark ? 18 : 2 }],
                },
              ]}
            />
          </View>
        </Pressable>
      </View>

      {/* ── SECURITY ──────────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
        SECURITY
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable
          style={styles.row}
          onPress={() => {
            if (pwOpen) {
              setPwOpen(false);
              setCurrentPw("");
              setNewPw("");
              setConfirmPw("");
              setShowCurrentPw(false);
              setShowNewPw(false);
              setShowConfirmPw(false);
            } else {
              setPwOpen(true);
            }
          }}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.accentSubtle }]}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Change Password
          </Text>
          <Ionicons
            name={pwOpen ? "chevron-up" : "chevron-forward"}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>

        {pwOpen && (
          <View style={styles.expandedSection}>
            <View style={styles.passwordFieldWrap}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.inputText,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Current password"
                placeholderTextColor={colors.placeholderText}
                value={currentPw}
                onChangeText={setCurrentPw}
                secureTextEntry={!showCurrentPw}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={() => setShowCurrentPw((v) => !v)}
              >
                <Ionicons
                  name={showCurrentPw ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <View style={styles.passwordFieldWrap}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.inputText,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="New password"
                placeholderTextColor={colors.placeholderText}
                value={newPw}
                onChangeText={setNewPw}
                secureTextEntry={!showNewPw}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={() => setShowNewPw((v) => !v)}
              >
                <Ionicons
                  name={showNewPw ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <View style={styles.passwordFieldWrap}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.inputText,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.placeholderText}
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry={!showConfirmPw}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPw((v) => !v)}
              >
                <Ionicons
                  name={showConfirmPw ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <Pressable
              style={[styles.btnPrimary, { backgroundColor: colors.accent }]}
              onPress={changePassword}
              disabled={changingPw}
            >
              {changingPw ? (
                <ActivityIndicator size="small" color={colors.accentText} />
              ) : (
                <Text
                  style={[styles.btnPrimaryText, { color: colors.accentText }]}
                >
                  Change Password
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>

      {/* ── DANGER ZONE ───────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.error }]}>
        DANGER ZONE
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable
          style={styles.row}
          onPress={confirmDeleteAccount}
          disabled={deleting}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${colors.error}18` },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.error }]}>
            Delete Account
          </Text>
          {deleting ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={colors.error} />
          )}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Pressable style={styles.row} onPress={signOut}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentSubtle }]}>
            <Ionicons
              name="log-out-outline"
              size={18}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Sign Out
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  memberSince: {
    fontSize: 12,
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
  expandedSection: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    gap: 10,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  passwordFieldWrap: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  editButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btnPrimary: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
  },
  btnSecondary: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomSpacer: {
    height: 24,
  },
});
