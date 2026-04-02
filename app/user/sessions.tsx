import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, TextInput, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  yellow:       "#F59E0B",
  red:          "#EF4444",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

const SESSIONS = [
  { id: "1", therapist: "Dr. Amara Njeri",   date: "Apr 5, 2026",  time: "10:00 AM", type: "Video call",  status: "upcoming",  amount: 8500 },
  { id: "2", therapist: "Dr. Kwame Otieno",  date: "Apr 3, 2026",  time: "02:00 PM", type: "Voice call",  status: "upcoming",  amount: 7500 },
  { id: "3", therapist: "Dr. Amara Njeri",   date: "Mar 28, 2026", time: "11:00 AM", type: "Video call",  status: "completed", amount: 8500 },
  { id: "4", therapist: "Dr. Imani Wanjiku", date: "Mar 20, 2026", time: "03:00 PM", type: "Text / Chat", status: "completed", amount: 10000 },
  { id: "5", therapist: "Dr. Zawadi Muthoni",date: "Mar 10, 2026", time: "09:00 AM", type: "Video call",  status: "cancelled", amount: 9000 },
];

export default function Sessions() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [tab, setTab]               = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [bookModal, setBookModal]   = useState(false);
  const [selectedDate, setDate]     = useState("");
  const [selectedTime, setTime]     = useState("");
  const [selectedType, setType]     = useState("Video call");
  const [booked, setBooked]         = useState(false);

  const filtered = SESSIONS.filter(s => s.status === tab);

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setBookModal(false);
    setBooked(true);
    Alert.alert(
      "Session Booked! 🎉",
      `Your ${selectedType} session has been scheduled for ${selectedDate} at ${selectedTime}.\n\nYou will receive a confirmation shortly.`,
      [{ text: "OK", onPress: () => setBooked(false) }]
    );
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Sessions</Text>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => setBookModal(true)}
        >
          <Text style={styles.bookBtnText}>+ Book</Text>
        </TouchableOpacity>
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
            <View style={[styles.tabBadge, tab === t && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, tab === t && styles.tabBadgeTextActive]}>
                {SESSIONS.filter(s => s.status === t).length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No {tab} sessions</Text>
            <Text style={styles.emptySub}>
              {tab === "upcoming" ? "Book a session with a therapist!" : "Your sessions will appear here"}
            </Text>
            {tab === "upcoming" && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setBookModal(true)}
              >
                <Text style={styles.emptyBtnText}>Book a Session</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map(session => (
            <View key={session.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{session.therapist.split(" ")[1][0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.therapistName}>{session.therapist}</Text>
                  <Text style={styles.sessionType}>
                    {session.type === "Video call" ? "🎥" : session.type === "Voice call" ? "📞" : "💬"} {session.type}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      session.status === "upcoming" ? `${C.primary}18` :
                      session.status === "completed" ? `${C.green}18` : `${C.red}18`
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    {
                      color:
                        session.status === "upcoming" ? C.primary :
                        session.status === "completed" ? C.green : C.red
                    }
                  ]}>
                    {session.status}
                  </Text>
                </View>
              </View>

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
                  <Text style={styles.detailIcon}>💰</Text>
                  <Text style={styles.detailText}>KES {session.amount.toLocaleString()}</Text>
                </View>
              </View>

              {session.status === "upcoming" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => router.push("/user/video-call" as any)}
                  >
                    <Text style={styles.joinBtnText}>Join Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => Alert.alert("Cancel Session", "Are you sure you want to cancel?", [
                      { text: "No", style: "cancel" },
                      { text: "Yes, Cancel", style: "destructive", onPress: () => {} },
                    ])}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* BOOK SESSION MODAL */}
      <Modal
        visible={bookModal}
        transparent
        animationType="slide"
        onRequestClose={() => setBookModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book a Session</Text>
              <TouchableOpacity onPress={() => setBookModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Preferred Date</Text>
            <TextInput
              placeholder="e.g. Apr 10, 2026"
              style={styles.input}
              placeholderTextColor={C.muted}
              value={selectedDate}
              onChangeText={setDate}
            />

            <Text style={styles.inputLabel}>Preferred Time</Text>
            <TextInput
              placeholder="e.g. 10:00 AM"
              style={styles.input}
              placeholderTextColor={C.muted}
              value={selectedTime}
              onChangeText={setTime}
            />

            <Text style={styles.inputLabel}>Session Type</Text>
            <View style={styles.typeRow}>
              {["Video call", "Voice call", "Text / Chat"].map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setType(type)}
                  style={[styles.typeBtn, selectedType === type && styles.typeBtnActive]}
                >
                  <Text style={styles.typeIcon}>
                    {type === "Video call" ? "🎥" : type === "Voice call" ? "📞" : "💬"}
                  </Text>
                  <Text style={[styles.typeBtnText, selectedType === type && styles.typeBtnTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleBook} activeOpacity={0.85}>
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: C.bg },
  nav:                { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBtn:             { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  navBack:            { fontSize: 22, color: C.muted },
  navTitle:           { fontSize: 18, fontWeight: "800", color: C.text },
  bookBtn:            { backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  bookBtnText:        { fontSize: 13, fontWeight: "700", color: C.white },
  tabs:               { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  tab:                { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  tabActive:          { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText:            { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive:      { color: C.primary },
  tabBadge:           { backgroundColor: C.border, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
  tabBadgeActive:     { backgroundColor: C.primaryLight },
  tabBadgeText:       { fontSize: 11, fontWeight: "700", color: C.muted },
  tabBadgeTextActive: { color: C.primary },
  scroll:             { padding: 16, paddingBottom: 80 },
  empty:              { alignItems: "center", paddingTop: 60 },
  emptyIcon:          { fontSize: 64, marginBottom: 16 },
  emptyText:          { fontSize: 20, fontWeight: "800", color: C.text, marginBottom: 8 },
  emptySub:           { fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 24 },
  emptyBtn:           { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  emptyBtnText:       { fontSize: 15, fontWeight: "700", color: C.white },
  card:               { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  cardTop:            { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  avatar:             { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  avatarText:         { fontSize: 20, fontWeight: "800", color: C.primary },
  therapistName:      { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 4 },
  sessionType:        { fontSize: 13, color: C.muted },
  statusBadge:        { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 },
  statusText:         { fontSize: 12, fontWeight: "700" },
  cardDetails:        { flexDirection: "row", gap: 16, marginBottom: 14, backgroundColor: C.bg, borderRadius: 12, padding: 12 },
  detailItem:         { flexDirection: "row", alignItems: "center", gap: 6 },
  detailIcon:         { fontSize: 14 },
  detailText:         { fontSize: 13, color: C.text, fontWeight: "600" },
  cardActions:        { flexDirection: "row", gap: 10 },
  joinBtn:            { flex: 2, backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  joinBtnText:        { fontSize: 14, fontWeight: "700", color: C.white },
  cancelBtn:          { flex: 1, backgroundColor: C.bg, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1.5, borderColor: C.border },
  cancelBtnText:      { fontSize: 14, fontWeight: "700", color: C.muted },
  modalOverlay:       { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard:          { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  modalHeader:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle:         { fontSize: 20, fontWeight: "800", color: C.text },
  closeBtn:           { fontSize: 18, color: C.muted },
  inputLabel:         { fontSize: 13, fontWeight: "600", color: C.text, marginBottom: 6 },
  input:              { backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1.5, borderColor: C.border, marginBottom: 14 },
  typeRow:            { flexDirection: "row", gap: 8, marginBottom: 20 },
  typeBtn:            { flex: 1, alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, gap: 4 },
  typeBtnActive:      { borderColor: C.primary, backgroundColor: C.primaryLight },
  typeIcon:           { fontSize: 20 },
  typeBtnText:        { fontSize: 11, fontWeight: "600", color: C.muted, textAlign: "center" },
  typeBtnTextActive:  { color: C.primary },
  confirmBtn:         { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  confirmBtnText:     { fontSize: 16, fontWeight: "700", color: C.white },
});