import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, Modal,
} from "react-native";
import { useRouter } from "expo-router";

const C = {
  primary:      "#0D9488",
  primaryLight: "#CCFBF1",
  primaryMid:   "#99F6E4",
  purple:       "#7C3AED",
  purpleLight:  "#EDE9FE",
  green:        "#2EC27E",
  yellow:       "#F59E0B",
  red:          "#EF4444",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#F0FDFA",
  white:        "#FFFFFF",
  border:       "#CCFBF1",
};

type Client = {
  id: string;
  name: string;
  avatar: string;
  concern: string;
  sessions: number;
  lastSession: string;
  nextSession: string;
  status: "active" | "inactive";
  age: string;
  gender: string;
  notes: string;
  progress: number;
};

const CLIENTS: Client[] = [
  { id: "1", name: "Sarah M.",   avatar: "S", concern: "Anxiety",     sessions: 8,  lastSession: "Today",       nextSession: "Mar 10",  status: "active",   age: "28", gender: "Female",        notes: "Making great progress with CBT techniques. Responds well to breathing exercises.", progress: 75 },
  { id: "2", name: "James K.",   avatar: "J", concern: "Depression",  sessions: 5,  lastSession: "Today",       nextSession: "Mar 12",  status: "active",   age: "34", gender: "Male",          notes: "Slowly opening up. Continue with supportive therapy approach.", progress: 45 },
  { id: "3", name: "Priya R.",   avatar: "P", concern: "Trauma",      sessions: 12, lastSession: "Today",       nextSession: "Mar 8",   status: "active",   age: "26", gender: "Female",        notes: "Processing trauma well. Significant improvement in daily functioning.", progress: 80 },
  { id: "4", name: "Michael T.", avatar: "M", concern: "Stress",      sessions: 3,  lastSession: "Today",       nextSession: "Mar 15",  status: "active",   age: "41", gender: "Male",          notes: "Work-related stress. Exploring work-life balance strategies.", progress: 40 },
  { id: "5", name: "Aisha N.",   avatar: "A", concern: "Grief",       sessions: 6,  lastSession: "Feb 28",      nextSession: "Tomorrow",status: "active",   age: "32", gender: "Female",        notes: "Grieving loss of parent. Showing resilience and healing.", progress: 60 },
  { id: "6", name: "David O.",   avatar: "D", concern: "Anxiety",     sessions: 4,  lastSession: "Feb 25",      nextSession: "Tomorrow",status: "active",   age: "23", gender: "Male",          notes: "Social anxiety. Working on exposure therapy techniques.", progress: 50 },
  { id: "7", name: "Linda W.",   avatar: "L", concern: "Self-Esteem", sessions: 9,  lastSession: "Mar 5",       nextSession: "Mar 19",  status: "active",   age: "29", gender: "Female",        notes: "Incredible growth in self-confidence. Near completion of program.", progress: 90 },
  { id: "8", name: "Tom B.",     avatar: "T", concern: "Depression",  sessions: 2,  lastSession: "Mar 4",       nextSession: "—",       status: "inactive", age: "45", gender: "Male",          notes: "Cancelled last 2 sessions. May need to follow up.", progress: 20 },
];

export default function Clients() {
  const router = useRouter();
  const [search, setSearch]       = useState("");
  const [viewing, setViewing]     = useState<Client | null>(null);
  const [filter, setFilter]       = useState<"all" | "active" | "inactive">("all");

  const filtered = CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.concern.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navLogo}>
          thera<Text style={{ color: C.purple }}>care</Text>
        </Text>
        <Text style={styles.navTitle}>Clients</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search clients or concerns..."
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabs}>
        {(["all", "active", "inactive"] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.tab, filter === f && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {" "}({CLIENTS.filter(c => f === "all" || c.status === f).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Total Clients",  value: CLIENTS.length,                                    color: C.primary },
            { label: "Active",         value: CLIENTS.filter(c => c.status === "active").length,   color: C.green },
            { label: "Avg Progress",   value: Math.round(CLIENTS.reduce((a, c) => a + c.progress, 0) / CLIENTS.length) + "%", color: C.purple },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Client list */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyTitle}>No clients found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        ) : (
          filtered.map(client => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              onPress={() => setViewing(client)}
              activeOpacity={0.85}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={[
                  styles.avatar,
                  { backgroundColor: client.status === "active" ? C.primaryLight : "#F3F4F6" }
                ]}>
                  <Text style={[
                    styles.avatarText,
                    { color: client.status === "active" ? C.primary : C.muted }
                  ]}>
                    {client.avatar}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientConcern}>{client.concern} · {client.age} yrs</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: client.status === "active" ? `${C.green}18` : `${C.red}18` }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: client.status === "active" ? C.green : C.red }
                  ]}>
                    {client.status}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={[styles.progressPct, { color: client.progress >= 70 ? C.green : client.progress >= 40 ? C.yellow : C.red }]}>
                  {client.progress}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[
                  styles.progressFill,
                  {
                    width: `${client.progress}%`,
                    backgroundColor: client.progress >= 70 ? C.green : client.progress >= 40 ? C.yellow : C.red,
                  }
                ]} />
              </View>

              {/* Details row */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>{client.sessions} sessions</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🕐</Text>
                  <Text style={styles.detailText}>Last: {client.lastSession}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>⏭️</Text>
                  <Text style={styles.detailText}>Next: {client.nextSession}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* CLIENT DETAIL MODAL */}
      <Modal
        visible={!!viewing}
        animationType="slide"
        onRequestClose={() => setViewing(null)}
      >
        {viewing && (
          <SafeAreaView style={styles.safe}>
            <View style={styles.nav}>
              <TouchableOpacity onPress={() => setViewing(null)}>
                <Text style={styles.navBack}>←</Text>
              </TouchableOpacity>
              <Text style={styles.navTitle}>Client Profile</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>

              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>{viewing.avatar}</Text>
                </View>
                <Text style={styles.modalName}>{viewing.name}</Text>
                <Text style={styles.modalConcern}>{viewing.concern}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: viewing.status === "active" ? `${C.green}18` : `${C.red}18` }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: viewing.status === "active" ? C.green : C.red }
                  ]}>
                    {viewing.status}
                  </Text>
                </View>
              </View>

              {/* Info cards */}
              <View style={styles.infoGrid}>
                {[
                  { label: "Age",          value: viewing.age + " yrs" },
                  { label: "Gender",       value: viewing.gender },
                  { label: "Sessions",     value: viewing.sessions.toString() },
                  { label: "Last Session", value: viewing.lastSession },
                  { label: "Next Session", value: viewing.nextSession },
                  { label: "Progress",     value: viewing.progress + "%" },
                ].map(item => (
                  <View key={item.label} style={styles.infoCard}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              {/* Progress */}
              <View style={styles.section}>
                <View style={styles.progressRow}>
                  <Text style={styles.sectionTitle}>Treatment Progress</Text>
                  <Text style={[styles.progressPct, { color: viewing.progress >= 70 ? C.green : viewing.progress >= 40 ? C.yellow : C.red }]}>
                    {viewing.progress}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[
                    styles.progressFill,
                    {
                      width: `${viewing.progress}%`,
                      backgroundColor: viewing.progress >= 70 ? C.green : viewing.progress >= 40 ? C.yellow : C.red,
                    }
                  ]} />
                </View>
              </View>

              {/* Notes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Therapist Notes</Text>
                <Text style={styles.notesText}>{viewing.notes}</Text>
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setViewing(null);
                  router.push("/therapist/sessions" as any);
                }}
              >
                <Text style={styles.actionBtnText}>📅 View Sessions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: C.purple }]}
                onPress={() => {
                  setViewing(null);
                  router.push("/therapist/video-call" as any);
                }}
              >
                <Text style={styles.actionBtnText}>🎥 Start Session</Text>
              </TouchableOpacity>

            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.bg },
  nav:              { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:          { fontSize: 22, color: C.muted },
  navLogo:          { fontSize: 20, fontWeight: "800", color: C.primary },
  navTitle:         { fontSize: 13, color: C.muted },
  searchRow:        { padding: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  searchBox:        { flexDirection: "row", alignItems: "center", backgroundColor: C.bg, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderColor: C.border, gap: 8 },
  searchIcon:       { fontSize: 16 },
  searchInput:      { flex: 1, fontSize: 15, color: C.text },
  tabs:             { flexDirection: "row", gap: 8, padding: 12, backgroundColor: C.white },
  tab:              { flex: 1, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, alignItems: "center" },
  tabActive:        { backgroundColor: C.primary, borderColor: C.primary },
  tabText:          { fontSize: 11, fontWeight: "600", color: C.muted },
  tabTextActive:    { color: C.white },
  scroll:           { padding: 16, paddingBottom: 80 },
  statsRow:         { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard:         { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  statValue:        { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  statLabel:        { fontSize: 11, color: C.muted, textAlign: "center", fontWeight: "600" },
  emptyState:       { alignItems: "center", paddingTop: 60 },
  emptyEmoji:       { fontSize: 64, marginBottom: 16 },
  emptyTitle:       { fontSize: 20, fontWeight: "800", color: C.text, marginBottom: 8 },
  emptySub:         { fontSize: 14, color: C.muted, textAlign: "center" },
  clientCard:       { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  cardTop:          { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  avatar:           { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarText:       { fontSize: 18, fontWeight: "800" },
  clientName:       { fontSize: 15, fontWeight: "800", color: C.text },
  clientConcern:    { fontSize: 12, color: C.muted, marginTop: 2 },
  statusBadge:      { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 },
  statusText:       { fontSize: 11, fontWeight: "700" },
  progressRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  progressLabel:    { fontSize: 12, color: C.muted, fontWeight: "600" },
  progressPct:      { fontSize: 13, fontWeight: "800" },
  progressTrack:    { height: 6, backgroundColor: C.primaryLight, borderRadius: 99, overflow: "hidden", marginBottom: 12 },
  progressFill:     { height: 6, borderRadius: 99 },
  detailsRow:       { flexDirection: "row", gap: 8 },
  detailItem:       { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  detailIcon:       { fontSize: 12 },
  detailText:       { fontSize: 11, fontWeight: "600", color: C.text },
  modalHeader:      { alignItems: "center", marginBottom: 24 },
  modalAvatar:      { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  modalAvatarText:  { fontSize: 36, fontWeight: "800", color: C.primary },
  modalName:        { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 4 },
  modalConcern:     { fontSize: 15, color: C.muted, marginBottom: 10 },
  infoGrid:         { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  infoCard:         { backgroundColor: C.white, borderRadius: 14, padding: 14, width: "47%", shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  infoLabel:        { fontSize: 11, color: C.muted, fontWeight: "600", marginBottom: 4, textTransform: "uppercase" },
  infoValue:        { fontSize: 16, fontWeight: "800", color: C.text },
  section:          { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  sectionTitle:     { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 12 },
  notesText:        { fontSize: 15, color: C.text, lineHeight: 24 },
  actionBtn:        { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  actionBtnText:    { fontSize: 16, fontWeight: "700", color: C.white },
});