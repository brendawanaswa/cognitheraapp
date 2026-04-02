import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  teal:         "#0D9488",
  tealLight:    "#CCFBF1",
  green:        "#2EC27E",
  yellow:       "#F59E0B",
  red:          "#EF4444",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#F8F6FF",
  white:        "#FFFFFF",
  border:       "#E5E0FF",
};

const BASE_URL = "https://theracare-backend-production.up.railway.app/api";

const PENDING_THERAPISTS = [
  {
    id: "1",
    fullName: "Dr. John Mwangi",
    email: "john.mwangi@email.com",
    title: "Clinical Psychologist",
    experience: "8 years",
    specialties: ["Anxiety & Panic", "Depression"],
    sessionRate: 8500,
    verified: "pending",
    createdAt: "Apr 1, 2026",
  },
  {
    id: "2",
    fullName: "Dr. Fatuma Hassan",
    email: "fatuma.hassan@email.com",
    title: "Trauma Specialist",
    experience: "12 years",
    specialties: ["Trauma & PTSD", "Grief & Loss"],
    sessionRate: 10000,
    verified: "pending",
    createdAt: "Apr 1, 2026",
  },
  {
    id: "3",
    fullName: "Dr. Peter Omondi",
    email: "peter.omondi@email.com",
    title: "Family Therapist",
    experience: "5 years",
    specialties: ["Family Therapy", "Relationships"],
    sessionRate: 7000,
    verified: "pending",
    createdAt: "Mar 31, 2026",
  },
];

export default function AdminPanel() {
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [therapists, setTherapists] = useState(PENDING_THERAPISTS);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");

  const handleLogin = () => {
    if (adminEmail === "admin@theracare.app" && adminPassword === "admin123") {
      setIsLoggedIn(true);
    } else {
      Alert.alert("Error", "Invalid admin credentials");
    }
  };

  const handleApprove = (id: string, name: string) => {
    Alert.alert(
      "Approve Therapist",
      `Are you sure you want to approve ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await fetch(`${BASE_URL}/therapist/approve/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
              });
            } catch (err) {}
            setTherapists(prev =>
              prev.map(t => t.id === id ? { ...t, verified: "approved" } : t)
            );
            Alert.alert("✅ Approved!", `${name} can now accept clients.`);
          },
        },
      ]
    );
  };

  const handleReject = (id: string, name: string) => {
    Alert.alert(
      "Reject Therapist",
      `Are you sure you want to reject ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setTherapists(prev =>
              prev.map(t => t.id === id ? { ...t, verified: "rejected" } : t)
            );
            Alert.alert("❌ Rejected", `${name}'s application has been rejected.`);
          },
        },
      ]
    );
  };

  const filtered = therapists.filter(t => t.verified === tab);

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <View style={[styles.loginSafe, { paddingTop: insets.top }]}>
        <View style={styles.loginCard}>
          <Text style={styles.loginEmoji}>🔐</Text>
          <Text style={styles.loginTitle}>Admin Panel</Text>
          <Text style={styles.loginSub}>TheraCare Administration</Text>

          <TextInput
            placeholder="Admin Email"
            style={styles.input}
            placeholderTextColor={C.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={adminEmail}
            onChangeText={setAdminEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={C.muted}
            secureTextEntry
            value={adminPassword}
            onChangeText={setAdminPassword}
          />
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>Login as Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ADMIN DASHBOARD
  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>

      {/* NAV */}
      <View style={styles.nav}>
        <Text style={styles.navTitle}>🔐 Admin Panel</Text>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { label: "Pending",  value: therapists.filter(t => t.verified === "pending").length,  color: C.yellow },
          { label: "Approved", value: therapists.filter(t => t.verified === "approved").length, color: C.green },
          { label: "Rejected", value: therapists.filter(t => t.verified === "rejected").length, color: C.red },
        ].map(stat => (
          <View key={stat.label} style={[styles.statCard, { borderTopColor: stat.color }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["pending", "approved", "rejected"] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>No {tab} therapists</Text>
          </View>
        ) : (
          filtered.map(therapist => (
            <View key={therapist.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{therapist.fullName.split(" ")[1][0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.therapistName}>{therapist.fullName}</Text>
                  <Text style={styles.therapistTitle}>{therapist.title}</Text>
                  <Text style={styles.therapistEmail}>{therapist.email}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      therapist.verified === "pending" ? "#FEF3C7" :
                      therapist.verified === "approved" ? `${C.green}18` : `${C.red}18`
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    {
                      color:
                        therapist.verified === "pending" ? C.yellow :
                        therapist.verified === "approved" ? C.green : C.red
                    }
                  ]}>
                    {therapist.verified}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>🎓 {therapist.experience} experience</Text>
                <Text style={styles.detailText}>💰 KES {therapist.sessionRate.toLocaleString()} / session</Text>
                <Text style={styles.detailText}>📋 {therapist.specialties.join(", ")}</Text>
                <Text style={styles.detailText}>📅 Applied: {therapist.createdAt}</Text>
              </View>

              {therapist.verified === "pending" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(therapist.id, therapist.fullName)}
                  >
                    <Text style={styles.approveBtnText}>✅ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(therapist.id, therapist.fullName)}
                  >
                    <Text style={styles.rejectBtnText}>❌ Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginSafe:      { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  loginCard:      { width: "100%", backgroundColor: C.white, borderRadius: 24, padding: 28, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  loginEmoji:     { fontSize: 48, marginBottom: 12 },
  loginTitle:     { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 4 },
  loginSub:       { fontSize: 14, color: C.muted, marginBottom: 24 },
  input:          { width: "100%", backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1.5, borderColor: C.border, marginBottom: 12 },
  loginBtn:       { width: "100%", backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  loginBtnText:   { fontSize: 16, fontWeight: "700", color: C.white },
  safe:           { flex: 1, backgroundColor: C.bg },
  nav:            { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navTitle:       { fontSize: 18, fontWeight: "800", color: C.text },
  logoutBtn:      { fontSize: 14, fontWeight: "600", color: C.red },
  statsRow:       { flexDirection: "row", gap: 10, padding: 16 },
  statCard:       { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: "center", borderTopWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statValue:      { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  statLabel:      { fontSize: 12, color: C.muted, fontWeight: "600" },
  tabs:           { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  tab:            { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabActive:      { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText:        { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive:  { color: C.primary },
  scroll:         { padding: 16, paddingBottom: 80 },
  empty:          { alignItems: "center", paddingTop: 60 },
  emptyIcon:      { fontSize: 48, marginBottom: 12 },
  emptyText:      { fontSize: 18, fontWeight: "700", color: C.muted },
  card:           { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  cardHeader:     { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  avatar:         { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  avatarText:     { fontSize: 20, fontWeight: "800", color: C.primary },
  therapistName:  { fontSize: 15, fontWeight: "800", color: C.text },
  therapistTitle: { fontSize: 12, color: C.muted, marginTop: 2 },
  therapistEmail: { fontSize: 12, color: C.teal, marginTop: 2 },
  statusBadge:    { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  statusText:     { fontSize: 11, fontWeight: "700" },
  cardDetails:    { backgroundColor: C.bg, borderRadius: 12, padding: 14, gap: 6, marginBottom: 14 },
  detailText:     { fontSize: 13, color: C.text },
  cardActions:    { flexDirection: "row", gap: 10 },
  approveBtn:     { flex: 1, backgroundColor: `${C.green}18`, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1.5, borderColor: C.green },
  approveBtnText: { fontSize: 14, fontWeight: "700", color: C.green },
  rejectBtn:      { flex: 1, backgroundColor: `${C.red}18`, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1.5, borderColor: C.red },
  rejectBtnText:  { fontSize: 14, fontWeight: "700", color: C.red },
});