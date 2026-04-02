import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TheraCareLogo from "@/components/TheraCareLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  orange:       "#F59E0B",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

const MENU_ITEMS = [
  { icon: "🏠", label: "Home",            path: "/user/home" },
  { icon: "😊", label: "Mood Tracker",    path: "/user/mood-tracker" },
  { icon: "📓", label: "Journal",         path: "/user/journal" },
  { icon: "🤖", label: "AI Chatbot",      path: "/user/chatbot" },
  { icon: "👨‍⚕️", label: "Find Therapist", path: "/user/matching" },
  { icon: "📅", label: "My Sessions",     path: "/user/sessions" },
  { icon: "💳", label: "Payments",        path: "/user/payments" },
  { icon: "⚙️", label: "Settings",        path: "/user/settings" },
];

export default function Home() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then(name => {
      if (name) setUserName(name.split(" ")[0]);
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_name");
    await AsyncStorage.removeItem("user_token");
    await AsyncStorage.removeItem("onboarding_complete");
    router.replace("/user/auth");
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.safe}>

      {/* NAV */}
      <View style={[styles.nav, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.hamburger}>
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
        <TheraCareLogo size="small" />
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* HAMBURGER DRAWER */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setMenuOpen(false)} />
          <View style={[styles.drawer, { paddingTop: insets.top + 20 }]}>
            <View style={styles.drawerHeader}>
              <TheraCareLogo size="small" />
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerProfile}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>
                  {userName ? userName[0].toUpperCase() : "U"}
                </Text>
              </View>
              <View>
                <Text style={styles.drawerName}>
                  {userName ? `Hi, ${userName} 👋` : "Welcome!"}
                </Text>
                <Text style={styles.drawerSub}>Your wellness journey</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map(item => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => navigate(item.path)}
                  style={styles.menuItem}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* GREETING */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingHello}>
              Hello, {userName ? userName : "there"} 👋
            </Text>
            <Text style={styles.greetingSub}>How are you feeling today?</Text>
          </View>
          <View style={styles.greetingEmoji}>
            <Text style={{ fontSize: 40 }}>🌟</Text>
          </View>
        </View>

        {/* QUICK STATS */}
        <View style={styles.statsRow}>
          {[
            { label: "Day Streak",     value: "7 🔥" },
            { label: "Sessions Done",  value: "3" },
            { label: "Mood Entries",   value: "12" },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ACTION CARDS */}
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        <View style={styles.cardsGrid}>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: C.primary }]}
            onPress={() => router.push("/user/matching")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionCardIcon}>👨‍⚕️</Text>
            <Text style={styles.actionCardTitle}>Talk to a{"\n"}Therapist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: C.accent }]}
            onPress={() => router.push("/user/chatbot")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionCardIcon}>🤖</Text>
            <Text style={styles.actionCardTitle}>AI{"\n"}Chatbot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: C.green }]}
            onPress={() => router.push("/user/journal")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionCardIcon}>📓</Text>
            <Text style={styles.actionCardTitle}>My{"\n"}Journal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: C.orange }]}
            onPress={() => router.push("/user/mood-tracker")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionCardIcon}>😊</Text>
            <Text style={styles.actionCardTitle}>Mood{"\n"}Tracker</Text>
          </TouchableOpacity>

        </View>

        {/* DAILY TIP */}
        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>💡 Daily Tip</Text>
          <Text style={styles.tipText}>
            Taking 5 minutes to breathe deeply can reduce stress and anxiety significantly. Try it right now!
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: C.bg },
  nav:                { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  hamburger:          { width: 44, height: 44, justifyContent: "center", gap: 5 },
  bar:                { height: 3, backgroundColor: C.primary, borderRadius: 99 },
  notifBtn:           { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  notifIcon:          { fontSize: 22 },
  overlay:            { flex: 1, flexDirection: "row" },
  overlayBg:          { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  drawer:             { width: 280, backgroundColor: C.white, paddingBottom: 40, paddingHorizontal: 20 },
  drawerHeader:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  closeBtn:           { fontSize: 18, color: C.muted },
  drawerProfile:      { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: C.primaryLight, borderRadius: 16, marginBottom: 20 },
  drawerAvatar:       { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  drawerAvatarText:   { fontSize: 20, fontWeight: "800", color: C.white },
  drawerName:         { fontSize: 15, fontWeight: "700", color: C.text },
  drawerSub:          { fontSize: 12, color: C.muted, marginTop: 2 },
  menuItem:           { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  menuIcon:           { fontSize: 22 },
  menuLabel:          { fontSize: 16, fontWeight: "600", color: C.text },
  logoutBtn:          { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 16, marginTop: 20 },
  logoutIcon:         { fontSize: 22 },
  logoutText:         { fontSize: 16, fontWeight: "700", color: C.primary },
  scroll:             { padding: 16, paddingBottom: 80 },
  greetingCard:       { backgroundColor: C.primary, borderRadius: 24, padding: 24, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greetingHello:      { fontSize: 24, fontWeight: "800", color: C.white, marginBottom: 6 },
  greetingSub:        { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  greetingEmoji:      { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  statsRow:           { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard:           { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  statValue:          { fontSize: 18, fontWeight: "800", color: C.primary, marginBottom: 4 },
  statLabel:          { fontSize: 11, color: C.muted, textAlign: "center", fontWeight: "600" },
  sectionTitle:       { fontSize: 18, fontWeight: "800", color: C.text, marginBottom: 14 },
  cardsGrid:          { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  actionCard:         { width: "47%", borderRadius: 20, padding: 20, minHeight: 130, justifyContent: "space-between", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  actionCardIcon:     { fontSize: 32 },
  actionCardTitle:    { fontSize: 16, fontWeight: "800", color: C.white, lineHeight: 22 },
  tipCard:            { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: C.primaryMid },
  tipLabel:           { fontSize: 13, fontWeight: "800", color: C.primary, marginBottom: 8 },
  tipText:            { fontSize: 14, color: C.text, lineHeight: 22 },
});