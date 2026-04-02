import TheraCareLogo from "@/components/TheraCareLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryMid: "#99F6E4",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  green: "#2EC27E",
  yellow: "#F59E0B",
  red: "#EF4444",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#F0FDFA",
  white: "#FFFFFF",
  border: "#CCFBF1",
};

const MENU_ITEMS = [
  { icon: "🏠", label: "Dashboard", path: "/therapist/dashboard" },
  { icon: "📅", label: "Sessions", path: "/therapist/sessions" },
  { icon: "👥", label: "Clients", path: "/therapist/clients" },
  { icon: "💰", label: "Earnings", path: "/therapist/earnings" },
  { icon: "👤", label: "Profile", path: "/therapist/profile" },
  { icon: "⚙️", label: "Settings", path: "/therapist/settings" },
];

const TODAY_SESSIONS = [
  {
    id: "1",
    client: "Sarah M.",
    time: "09:00 AM",
    type: "Video call",
    status: "upcoming",
    avatar: "S",
  },
  {
    id: "2",
    client: "James K.",
    time: "11:30 AM",
    type: "Voice call",
    status: "upcoming",
    avatar: "J",
  },
  {
    id: "3",
    client: "Priya R.",
    time: "02:00 PM",
    type: "Video call",
    status: "completed",
    avatar: "P",
  },
  {
    id: "4",
    client: "Michael T.",
    time: "04:30 PM",
    type: "Text / Chat",
    status: "upcoming",
    avatar: "M",
  },
];

const NOTIFICATIONS = [
  {
    id: "1",
    text: "Sarah M. booked a session for tomorrow",
    time: "2m ago",
    icon: "📅",
    unread: true,
  },
  {
    id: "2",
    text: "James K. left you a 5 star review",
    time: "1h ago",
    icon: "⭐",
    unread: true,
  },
  {
    id: "3",
    text: "Your payment of KES 8,500 has been sent",
    time: "3h ago",
    icon: "💰",
    unread: false,
  },
  {
    id: "4",
    text: "Priya R. rescheduled her session",
    time: "5h ago",
    icon: "🔄",
    unread: false,
  },
];

const WEEK_STATS = [
  { day: "Mon", sessions: 4 },
  { day: "Tue", sessions: 6 },
  { day: "Wed", sessions: 3 },
  { day: "Thu", sessions: 7 },
  { day: "Fri", sessions: 5 },
  { day: "Sat", sessions: 2 },
  { day: "Sun", sessions: 4 },
];

const RECENT_CLIENTS = [
  { name: "Sarah M.", concern: "Anxiety", sessions: 8, avatar: "S" },
  { name: "James K.", concern: "Depression", sessions: 5, avatar: "J" },
  { name: "Priya R.", concern: "Trauma", sessions: 12, avatar: "P" },
  { name: "Michael T.", concern: "Stress", sessions: 3, avatar: "M" },
];

export default function TherapistDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [therapistName, setName] = useState("Doctor");
  const [verified, setVerified] = useState("pending");
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const maxBar = Math.max(...WEEK_STATS.map((s) => s.sessions));

  useEffect(() => {
    AsyncStorage.getItem("therapist_name").then((name) => {
      if (name) setName(name.split(" ")[0]);
    });
    AsyncStorage.getItem("therapist_verified").then((v) => {
      if (v) setVerified(v);
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("therapist_logged_in");
    router.replace("/therapist/auth");
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.safe}>
      {/* NAV */}
      <View style={[styles.nav, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={styles.hamburger}
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
        <TheraCareLogo size="small" />
        <TouchableOpacity
          onPress={() => setNotifOpen(true)}
          style={styles.notifBtn}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
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
          <TouchableOpacity
            style={styles.overlayBg}
            onPress={() => setMenuOpen(false)}
          />
          <View style={[styles.drawer, { paddingTop: insets.top + 20 }]}>
            <View style={styles.drawerHeader}>
              <TheraCareLogo size="small" />
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.drawerProfile}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>{therapistName[0]}</Text>
              </View>
              <View>
                <Text style={styles.drawerName}>Dr. {therapistName}</Text>
                <View
                  style={[
                    styles.verifiedBadge,
                    {
                      backgroundColor:
                        verified === "approved" ? `${C.green}18` : "#FEF3C7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.verifiedText,
                      { color: verified === "approved" ? C.green : C.yellow },
                    ]}
                  >
                    {verified === "approved" ? "✅ Verified" : "🟡 Pending"}
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item) => (
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

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={notifOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setNotifOpen(false)}
      >
        <View style={styles.notifOverlay}>
          <View style={styles.notifModal}>
            <View style={styles.notifModalHeader}>
              <Text style={styles.notifModalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotifOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {NOTIFICATIONS.map((n) => (
              <View
                key={n.id}
                style={[styles.notifItem, n.unread && styles.notifItemUnread]}
              >
                <Text style={styles.notifItemIcon}>{n.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifItemText}>{n.text}</Text>
                  <Text style={styles.notifItemTime}>{n.time}</Text>
                </View>
                {n.unread && <View style={styles.unreadDot} />}
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* GREETING */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingText}>
              Good morning, Dr. {therapistName} 👋
            </Text>
            <Text style={styles.greetingSub}>
              You have{" "}
              {TODAY_SESSIONS.filter((s) => s.status === "upcoming").length}{" "}
              sessions today
            </Text>
          </View>
          {verified === "pending" && (
            <View style={styles.pendingTag}>
              <Text style={styles.pendingTagText}>🟡 Pending</Text>
            </View>
          )}
        </View>

        {/* STATS ROW */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
        >
          {[
            {
              label: "Total Earnings",
              value: "KES 124K",
              icon: "💰",
              color: C.primary,
            },
            {
              label: "Sessions Today",
              value: "4",
              icon: "📅",
              color: C.purple,
            },
            { label: "Total Clients", value: "28", icon: "👥", color: C.green },
            { label: "Rating", value: "4.9 ⭐", icon: "🏆", color: C.yellow },
          ].map((stat) => (
            <View
              key={stat.label}
              style={[styles.statCard, { borderTopColor: stat.color }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* TODAY&apos;S SESSIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Sessions</Text>
            <TouchableOpacity onPress={() => navigate("/therapist/sessions")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {TODAY_SESSIONS.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionAvatar}>
                <Text style={styles.sessionAvatarText}>{session.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionClient}>{session.client}</Text>
                <Text style={styles.sessionMeta}>
                  {session.time} · {session.type}
                </Text>
              </View>
              {session.status === "upcoming" ? (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => router.push("/therapist/video-call" as any)}
                >
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.completedTag}>
                  <Text style={styles.completedTagText}>Done</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* PERFORMANCE STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Performance</Text>
          <View style={styles.barChart}>
            {WEEK_STATS.map((d, i) => {
              const isToday = i === new Date().getDay() - 1;
              const barH = (d.sessions / maxBar) * 80;
              return (
                <View key={d.day} style={styles.barCol}>
                  <Text style={styles.barNum}>{d.sessions}</Text>
                  <View
                    style={[
                      styles.bar2,
                      {
                        height: barH,
                        backgroundColor: isToday ? C.primary : C.primaryLight,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.barDay,
                      isToday && { color: C.primary, fontWeight: "700" },
                    ]}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.metricsRow}>
            {[
              { label: "Completion Rate", value: "94%", color: C.green },
              { label: "Satisfaction", value: "4.9", color: C.primary },
              { label: "Response Time", value: "< 2h", color: C.purple },
            ].map((m) => (
              <View key={m.label} style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: m.color }]}>
                  {m.value}
                </Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* RECENT CLIENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity onPress={() => navigate("/therapist/clients")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {RECENT_CLIENTS.map((client) => (
            <View key={client.name} style={styles.clientItem}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>{client.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientConcern}>{client.concern}</Text>
              </View>
              <View style={styles.clientSessions}>
                <Text style={styles.clientSessionsNum}>{client.sessions}</Text>
                <Text style={styles.clientSessionsLabel}>sessions</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  hamburger: { width: 44, height: 44, justifyContent: "center", gap: 5 },
  bar: { height: 3, backgroundColor: C.primary, borderRadius: 99 },
  notifBtn: {
    position: "relative",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  notifIcon: { fontSize: 22 },
  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.red,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: { fontSize: 10, fontWeight: "800", color: C.white },
  overlay: { flex: 1, flexDirection: "row" },
  overlayBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  drawer: {
    width: 280,
    backgroundColor: C.white,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeBtn: { fontSize: 18, color: C.muted },
  drawerProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: C.bg,
    borderRadius: 16,
    marginBottom: 20,
  },
  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerAvatarText: { fontSize: 20, fontWeight: "800", color: C.white },
  drawerName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    marginBottom: 4,
  },
  verifiedBadge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  verifiedText: { fontSize: 11, fontWeight: "700" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  menuIcon: { fontSize: 22 },
  menuLabel: { fontSize: 16, fontWeight: "600", color: C.text },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    marginTop: 20,
  },
  logoutIcon: { fontSize: 22 },
  logoutText: { fontSize: 16, fontWeight: "700", color: C.red },
  notifOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  notifModal: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  notifModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  notifModalTitle: { fontSize: 20, fontWeight: "800", color: C.text },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  notifItemUnread: {
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  notifItemIcon: { fontSize: 24 },
  notifItemText: { fontSize: 14, color: C.text, fontWeight: "600" },
  notifItemTime: { fontSize: 12, color: C.muted, marginTop: 2 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  scroll: { padding: 16, paddingBottom: 80 },
  greetingCard: {
    backgroundColor: C.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "800",
    color: C.white,
    marginBottom: 4,
  },
  greetingSub: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  pendingTag: {
    backgroundColor: "#FEF3C7",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pendingTagText: { fontSize: 12, fontWeight: "700", color: C.yellow },
  statsScroll: { marginBottom: 16 },
  statCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 10,
    width: 130,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.muted, fontWeight: "600" },
  section: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: C.text },
  seeAll: { fontSize: 13, color: C.primary, fontWeight: "600" },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sessionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionAvatarText: { fontSize: 16, fontWeight: "800", color: C.primary },
  sessionClient: { fontSize: 14, fontWeight: "700", color: C.text },
  sessionMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  joinBtn: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  joinBtnText: { fontSize: 13, fontWeight: "700", color: C.white },
  completedTag: {
    backgroundColor: `${C.green}18`,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  completedTagText: { fontSize: 13, fontWeight: "700", color: C.green },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 110,
    marginBottom: 16,
  },
  barCol: { flex: 1, alignItems: "center", gap: 4, justifyContent: "flex-end" },
  barNum: { fontSize: 10, color: C.muted, fontWeight: "600" },
  bar2: { width: "100%", borderRadius: 6 },
  barDay: { fontSize: 10, color: C.muted },
  metricsRow: { flexDirection: "row", gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  metricValue: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  metricLabel: {
    fontSize: 11,
    color: C.muted,
    textAlign: "center",
    fontWeight: "600",
  },
  clientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.purpleLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: { fontSize: 16, fontWeight: "800", color: C.purple },
  clientName: { fontSize: 14, fontWeight: "700", color: C.text },
  clientConcern: { fontSize: 12, color: C.muted, marginTop: 2 },
  clientSessions: { alignItems: "center" },
  clientSessionsNum: { fontSize: 18, fontWeight: "800", color: C.primary },
  clientSessionsLabel: { fontSize: 11, color: C.muted },
});
