import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal,
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

type Session = {
  id: string;
  client: string;
  avatar: string;
  date: string;
  time: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
  concern: string;
  amount: string;
  notes?: string;
};

const SESSIONS: Session[] = [
  { id: "1",  client: "Sarah M.",   avatar: "S", date: "Today",        time: "09:00 AM", type: "Video call",  status: "upcoming",  concern: "Anxiety",    amount: "KES 8,500" },
  { id: "2",  client: "James K.",   avatar: "J", date: "Today",        time: "11:30 AM", type: "Voice call",  status: "upcoming",  concern: "Depression", amount: "KES 8,500" },
  { id: "3",  client: "Priya R.",   avatar: "P", date: "Today",        time: "02:00 PM", type: "Video call",  status: "completed", concern: "Trauma",     amount: "KES 8,500", notes: "Good progress. Continue with CBT exercises." },
  { id: "4",  client: "Michael T.", avatar: "M", date: "Today",        time: "04:30 PM", type: "Text / Chat", status: "upcoming",  concern: "Stress",     amount: "KES 8,500" },
  { id: "5",  client: "Aisha N.",   avatar: "A", date: "Tomorrow",     time: "10:00 AM", type: "Video call",  status: "upcoming",  concern: "Grief",      amount: "KES 8,500" },
  { id: "6",  client: "David O.",   avatar: "D", date: "Tomorrow",     time: "01:00 PM", type: "Voice call",  status: "upcoming",  concern: "Anxiety",    amount: "KES 8,500" },
  { id: "7",  client: "Linda W.",   avatar: "L", date: "Mar 5, 2025",  time: "03:00 PM", type: "Video call",  status: "completed", concern: "Self-Esteem",amount: "KES 8,500", notes: "Showed great improvement in self-confidence." },
  { id: "8",  client: "Tom B.",     avatar: "T", date: "Mar 4, 2025",  time: "11:00 AM", type: "Video call",  status: "cancelled", concern: "Depression", amount: "KES 8,500" },
  { id: "9",  client: "Grace K.",   avatar: "G", date: "Mar 3, 2025",  time: "09:30 AM", type: "Text / Chat", status: "completed", concern: "Trauma",     amount: "KES 8,500", notes: "Discussed coping strategies." },
  { id: "10", client: "Kevin M.",   avatar: "K", date: "Mar 2, 2025",  time: "02:30 PM", type: "Voice call",  status: "completed", concern: "Stress",     amount: "KES 8,500" },
];

const SESSION_ICONS: Record<string, string> = {
  "Video call":  "🎥",
  "Voice call":  "📞",
  "Text / Chat": "💬",
};

export default function Sessions() {
  const router = useRouter();
  const [tab, setTab]             = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [viewing, setViewing]     = useState<Session | null>(null);

  const filtered = SESSIONS.filter(s => s.status === tab);

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
        <Text style={styles.navTitle}>Sessions</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { label: "Upcoming",  value: SESSIONS.filter(s => s.status === "upcoming").length,  color: C.primary },
          { label: "Completed", value: SESSIONS.filter(s => s.status === "completed").length, color: C.green },
          { label: "Cancelled", value: SESSIONS.filter(s => s.status === "cancelled").length, color: C.red },
        ].map(stat => (
          <TouchableOpacity
            key={stat.label}
            onPress={() => setTab(stat.label.toLowerCase() as any)}
            style={[styles.statCard, tab === stat.label.toLowerCase() && { borderColor: stat.color, borderWidth: 2 }]}
          >
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["upcoming", "completed", "cancelled"] as const).map(t => (
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>No {tab} sessions</Text>
            <Text style={styles.emptySub}>Your {tab} sessions will appear here</Text>
          </View>
        ) : (
          filtered.map(session => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => setViewing(session)}
              activeOpacity={0.85}
            >
              {/* Card top */}
              <View style={styles.cardTop}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>{session.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{session.client}</Text>
                  <Text style={styles.clientConcern}>{session.concern}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      session.status === "upcoming"  ? `${C.primary}18` :
                      session.status === "completed" ? `${C.green}18`   :
                      `${C.red}18`
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    {
                      color:
                        session.status === "upcoming"  ? C.primary :
                        session.status === "completed" ? C.green   :
                        C.red
                    }
                  ]}>
                    {session.status}
                  </Text>
                </View>
              </View>

              {/* Card details */}
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>{session.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🕐</Text>
                  <Text style={styles.detailText}>{session.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>{SESSION_ICONS[session.type]}</Text>
                  <Text style={styles.detailText}>{session.type}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💰</Text>
                  <Text style={styles.detailText}>{session.amount}</Text>
                </View>
              </View>

              {/* Join button for upcoming */}
              {session.status === "upcoming" && (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => router.push("/therapist/video-call" as any)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.joinBtnText}>
                    {SESSION_ICONS[session.type]} Join Session
                  </Text>
                </TouchableOpacity>
              )}

              {/* Notes for completed */}
              {session.status === "completed" && session.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>📝 Session Notes</Text>
                  <Text style={styles.notesText}>{session.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* SESSION DETAIL MODAL */}
      <Modal
        visible={!!viewing}
        animationType="slide"
        transparent
        onRequestClose={() => setViewing(null)}
      >
        {viewing && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Session Details</Text>
                <TouchableOpacity onPress={() => setViewing(null)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalClient}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>{viewing.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.modalClientName}>{viewing.client}</Text>
                  <Text style={styles.modalClientConcern}>{viewing.concern}</Text>
                </View>
              </View>

              {[
                { label: "Date",    value: viewing.date,   icon: "📅" },
                { label: "Time",    value: viewing.time,   icon: "🕐" },
                { label: "Type",    value: viewing.type,   icon: SESSION_ICONS[viewing.type] },
                { label: "Amount",  value: viewing.amount, icon: "💰" },
                { label: "Status",  value: viewing.status, icon: "📊" },
              ].map(item => (
                <View key={item.label} style={styles.modalRow}>
                  <Text style={styles.modalRowIcon}>{item.icon}</Text>
                  <Text style={styles.modalRowLabel}>{item.label}</Text>
                  <Text style={styles.modalRowValue}>{item.value}</Text>
                </View>
              ))}

              {viewing.notes && (
                <View style={styles.modalNotes}>
                  <Text style={styles.modalNotesLabel}>Session Notes</Text>
                  <Text style={styles.modalNotesText}>{viewing.notes}</Text>
                </View>
              )}

              {viewing.status === "upcoming" && (
                <TouchableOpacity
                  style={styles.modalJoinBtn}
                  onPress={() => {
                    setViewing(null);
                    router.push("/therapist/video-call" as any);
                  }}
                >
                  <Text style={styles.modalJoinBtnText}>Join Session</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: C.bg },
  nav:                { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:            { fontSize: 22, color: C.muted },
  navLogo:            { fontSize: 20, fontWeight: "800", color: C.primary },
  navTitle:           { fontSize: 13, color: C.muted },
  statsRow:           { flexDirection: "row", gap: 10, padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  statCard:           { flex: 1, backgroundColor: C.bg, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1.5, borderColor: C.border },
  statValue:          { fontSize: 22, fontWeight: "800", marginBottom: 2 },
  statLabel:          { fontSize: 11, color: C.muted, fontWeight: "600" },
  tabs:               { flexDirection: "row", gap: 8, padding: 12, backgroundColor: C.white },
  tab:                { flex: 1, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, alignItems: "center" },
  tabActive:          { backgroundColor: C.primary, borderColor: C.primary },
  tabText:            { fontSize: 12, fontWeight: "600", color: C.muted },
  tabTextActive:      { color: C.white },
  scroll:             { padding: 16, paddingBottom: 80 },

  // Empty state
  emptyState:         { alignItems: "center", paddingTop: 60 },
  emptyEmoji:         { fontSize: 64, marginBottom: 16 },
  emptyTitle:         { fontSize: 20, fontWeight: "800", color: C.text, marginBottom: 8 },
  emptySub:           { fontSize: 14, color: C.muted, textAlign: "center" },

  // Session card
  sessionCard:        { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  cardTop:            { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  clientAvatar:       { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  clientAvatarText:   { fontSize: 18, fontWeight: "800", color: C.primary },
  clientName:         { fontSize: 15, fontWeight: "800", color: C.text },
  clientConcern:      { fontSize: 12, color: C.muted, marginTop: 2 },
  statusBadge:        { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 },
  statusText:         { fontSize: 11, fontWeight: "700" },
  cardDetails:        { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  detailItem:         { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  detailIcon:         { fontSize: 14 },
  detailText:         { fontSize: 12, fontWeight: "600", color: C.text },
  joinBtn:            { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  joinBtnText:        { fontSize: 14, fontWeight: "700", color: C.white },
  notesBox:           { backgroundColor: C.bg, borderRadius: 12, padding: 12 },
  notesLabel:         { fontSize: 12, fontWeight: "700", color: C.primary, marginBottom: 4 },
  notesText:          { fontSize: 13, color: C.text, lineHeight: 20 },

  // Modal
  modalOverlay:       { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard:          { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  modalHeader:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle:         { fontSize: 20, fontWeight: "800", color: C.text },
  closeBtn:           { fontSize: 18, color: C.muted },
  modalClient:        { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20, backgroundColor: C.bg, borderRadius: 16, padding: 16 },
  modalAvatar:        { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  modalAvatarText:    { fontSize: 22, fontWeight: "800", color: C.primary },
  modalClientName:    { fontSize: 17, fontWeight: "800", color: C.text },
  modalClientConcern: { fontSize: 13, color: C.muted, marginTop: 2 },
  modalRow:           { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  modalRowIcon:       { fontSize: 18, width: 28 },
  modalRowLabel:      { fontSize: 14, color: C.muted, flex: 1 },
  modalRowValue:      { fontSize: 14, fontWeight: "700", color: C.text },
  modalNotes:         { backgroundColor: C.bg, borderRadius: 14, padding: 14, marginTop: 16 },
  modalNotesLabel:    { fontSize: 13, fontWeight: "700", color: C.primary, marginBottom: 6 },
  modalNotesText:     { fontSize: 14, color: C.text, lineHeight: 22 },
  modalJoinBtn:       { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 16 },
  modalJoinBtnText:   { fontSize: 16, fontWeight: "700", color: C.white },
});