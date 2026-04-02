import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
  red:          "#EF4444",
  green:        "#2EC27E",
};

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user_name");
            await AsyncStorage.removeItem("user_token");
            await AsyncStorage.removeItem("onboarding_complete");
            router.replace("/user/auth");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {[
            { label: "Push Notifications",  sub: "Receive app notifications",     value: notifications,      setter: setNotifications },
            { label: "Session Reminders",   sub: "Get reminded before sessions",  value: sessionReminders,   setter: setSessionReminders },
            { label: "Email Updates",       sub: "Receive updates via email",     value: emailUpdates,       setter: setEmailUpdates },
          ].map(item => (
            <View key={item.label} style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: C.border, true: C.primaryMid }}
                thumbColor={item.value ? C.primary : C.muted}
              />
            </View>
          ))}
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingSub}>Switch to dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: C.border, true: C.primaryMid }}
              thumbColor={darkMode ? C.primary : C.muted}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {[
            { icon: "📋", label: "Privacy Policy",    onPress: () => Alert.alert("Privacy Policy", "Your data is private and secure. We never sell your personal information.") },
            { icon: "📜", label: "Terms of Service",  onPress: () => Alert.alert("Terms of Service", "By using TheraCare you agree to our terms of service.") },
            { icon: "❓", label: "Help & Support",    onPress: () => Alert.alert("Help & Support", "Email us at support@theracare.app") },
            { icon: "⭐", label: "Rate the App",      onPress: () => Alert.alert("Rate TheraCare", "Thank you for using TheraCare! Please rate us on the app store.") },
            { icon: "📱", label: "App Version",       onPress: () => Alert.alert("Version", "TheraCare v1.0.1") },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuLabel, { color: C.primary }]}>Logout</Text>
            <Text style={[styles.menuArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuLabel, { color: C.red }]}>Delete Account</Text>
            <Text style={[styles.menuArrow, { color: C.red }]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>TheraCare v1.0.1 — your mind matters 💜</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  nav:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBtn:       { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  navBack:      { fontSize: 22, color: C.muted },
  navTitle:     { fontSize: 18, fontWeight: "800", color: C.text },
  scroll:       { padding: 16, paddingBottom: 80 },
  section:      { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 16 },
  settingRow:   { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  settingLabel: { fontSize: 15, fontWeight: "600", color: C.text },
  settingSub:   { fontSize: 12, color: C.muted, marginTop: 2 },
  menuItem:     { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  menuIcon:     { fontSize: 22, marginRight: 14 },
  menuLabel:    { flex: 1, fontSize: 15, fontWeight: "600", color: C.text },
  menuArrow:    { fontSize: 20, color: C.muted },
  footer:       { textAlign: "center", fontSize: 13, color: C.muted, marginTop: 8 },
});