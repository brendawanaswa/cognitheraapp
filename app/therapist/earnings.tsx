import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
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

const TRANSACTIONS = [
  { id: "1",  client: "Sarah M.",   date: "Mar 3, 2025",  amount: 8500,  type: "Video call",  status: "paid" },
  { id: "2",  client: "James K.",   date: "Mar 3, 2025",  amount: 8500,  type: "Voice call",  status: "paid" },
  { id: "3",  client: "Priya R.",   date: "Mar 3, 2025",  amount: 8500,  type: "Video call",  status: "paid" },
  { id: "4",  client: "Aisha N.",   date: "Feb 28, 2025", amount: 8500,  type: "Video call",  status: "paid" },
  { id: "5",  client: "David O.",   date: "Feb 28, 2025", amount: 8500,  type: "Voice call",  status: "paid" },
  { id: "6",  client: "Linda W.",   date: "Feb 25, 2025", amount: 8500,  type: "Video call",  status: "paid" },
  { id: "7",  client: "Tom B.",     date: "Feb 20, 2025", amount: 8500,  type: "Video call",  status: "refunded" },
  { id: "8",  client: "Grace K.",   date: "Feb 18, 2025", amount: 8500,  type: "Text / Chat", status: "paid" },
  { id: "9",  client: "Kevin M.",   date: "Feb 15, 2025", amount: 8500,  type: "Voice call",  status: "paid" },
  { id: "10", client: "Sarah M.",   date: "Feb 10, 2025", amount: 8500,  type: "Video call",  status: "paid" },
];

const MONTHLY_DATA = [
  { month: "Oct", amount: 68000 },
  { month: "Nov", amount: 85000 },
  { month: "Dec", amount: 72000 },
  { month: "Jan", amount: 93500 },
  { month: "Feb", amount: 110500 },
  { month: "Mar", amount: 42500 },
];

const PAYOUT_METHODS = [
  { id: "mpesa", label: "M-Pesa",      icon: "📱", number: "0712 ••• •••", color: "#00A651" },
  { id: "bank",  label: "Bank",        icon: "🏦", number: "KCB ••• 4242", color: C.primary },
];

export default function Earnings() {
  const router = useRouter();
  const [tab, setTab]           = useState<"overview" | "transactions" | "payouts">("overview");
  const [period, setPeriod]     = useState<"week" | "month" | "year">("month");

  const totalEarned   = TRANSACTIONS.filter(t => t.status === "paid").reduce((a, t) => a + t.amount, 0);
  const totalRefunded = TRANSACTIONS.filter(t => t.status === "refunded").reduce((a, t) => a + t.amount, 0);
  const thisMonth     = TRANSACTIONS.filter(t => t.date.includes("Mar") && t.status === "paid").reduce((a, t) => a + t.amount, 0);
  const maxBar        = Math.max(...MONTHLY_DATA.map(m => m.amount));

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
        <Text style={styles.navTitle}>Earnings</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["overview", "transactions", "payouts"] as const).map(t => (
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

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* Main earnings card */}
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>TOTAL EARNED</Text>
              <Text style={styles.earningsAmount}>
                KES {totalEarned.toLocaleString()}
              </Text>
              <Text style={styles.earningsSub}>
                This month: KES {thisMonth.toLocaleString()}
              </Text>

              {/* Period selector */}
              <View style={styles.periodRow}>
                {(["week", "month", "year"] as const).map(p => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                  >
                    <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              {[
                { label: "Sessions Done",  value: TRANSACTIONS.filter(t => t.status === "paid").length.toString(),    color: C.primary },
                { label: "Avg Per Session",value: "KES 8,500",  color: C.purple },
                { label: "Refunded",       value: `KES ${totalRefunded.toLocaleString()}`, color: C.red },
              ].map(stat => (
                <View key={stat.label} style={styles.statCard}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Monthly chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Earnings</Text>
              <View style={styles.barChart}>
                {MONTHLY_DATA.map((d, i) => {
                  const isLatest = i === MONTHLY_DATA.length - 1;
                  const barH = (d.amount / maxBar) * 100;
                  return (
                    <View key={d.month} style={styles.barCol}>
                      <Text style={styles.barAmount}>
                        {(d.amount / 1000).toFixed(0)}K
                      </Text>
                      <View style={[
                        styles.bar,
                        {
                          height: barH,
                          backgroundColor: isLatest ? C.primary : C.primaryLight,
                        }
                      ]} />
                      <Text style={[
                        styles.barMonth,
                        isLatest && { color: C.primary, fontWeight: "700" }
                      ]}>
                        {d.month}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Pending payout */}
            <View style={styles.payoutCard}>
              <View>
                <Text style={styles.payoutLabel}>AVAILABLE FOR PAYOUT</Text>
                <Text style={styles.payoutAmount}>KES {thisMonth.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                style={styles.payoutBtn}
                onPress={() => setTab("payouts")}
              >
                <Text style={styles.payoutBtnText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === "transactions" && (
          <>
            <Text style={styles.sectionTitle2}>All Transactions</Text>
            {TRANSACTIONS.map(t => (
              <View key={t.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: t.status === "paid" ? `${C.green}18` : `${C.red}18` }
                  ]}>
                    <Text style={{ fontSize: 18 }}>
                      {t.status === "paid" ? "💰" : "↩️"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.transactionClient}>{t.client}</Text>
                    <Text style={styles.transactionMeta}>{t.type} · {t.date}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: t.status === "paid" ? C.green : C.red }
                  ]}>
                    {t.status === "paid" ? "+" : "-"}KES {t.amount.toLocaleString()}
                  </Text>
                  <View style={[
                    styles.transactionStatus,
                    { backgroundColor: t.status === "paid" ? `${C.green}18` : `${C.red}18` }
                  ]}>
                    <Text style={[
                      styles.transactionStatusText,
                      { color: t.status === "paid" ? C.green : C.red }
                    ]}>
                      {t.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* PAYOUTS TAB */}
        {tab === "payouts" && (
          <>
            {/* Available balance */}
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.earningsAmount}>
                KES {thisMonth.toLocaleString()}
              </Text>
              <Text style={styles.earningsSub}>Ready to withdraw</Text>
            </View>

            {/* Payout methods */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payout Methods</Text>
              {PAYOUT_METHODS.map(method => (
                <View key={method.id} style={styles.payoutMethod}>
                  <View style={styles.payoutMethodLeft}>
                    <Text style={styles.payoutMethodIcon}>{method.icon}</Text>
                    <View>
                      <Text style={styles.payoutMethodLabel}>{method.label}</Text>
                      <Text style={styles.payoutMethodNumber}>{method.number}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.withdrawBtn, { backgroundColor: method.color }]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.withdrawBtnText}>Withdraw</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Payout history */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payout History</Text>
              {[
                { date: "Feb 28, 2025", amount: "KES 85,000", method: "M-Pesa", status: "sent" },
                { date: "Jan 31, 2025", amount: "KES 93,500", method: "M-Pesa", status: "sent" },
                { date: "Dec 31, 2024", amount: "KES 72,000", method: "Bank",   status: "sent" },
              ].map((p, i) => (
                <View key={i} style={styles.payoutHistoryItem}>
                  <View>
                    <Text style={styles.payoutHistoryAmount}>{p.amount}</Text>
                    <Text style={styles.payoutHistoryMeta}>{p.method} · {p.date}</Text>
                  </View>
                  <View style={[styles.transactionStatus, { backgroundColor: `${C.green}18` }]}>
                    <Text style={[styles.transactionStatusText, { color: C.green }]}>
                      {p.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:                   { flex: 1, backgroundColor: C.bg },
  nav:                    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:                { fontSize: 22, color: C.muted },
  navLogo:                { fontSize: 20, fontWeight: "800", color: C.primary },
  navTitle:               { fontSize: 13, color: C.muted },
  tabs:                   { flexDirection: "row", gap: 6, padding: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  tab:                    { flex: 1, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, alignItems: "center" },
  tabActive:              { backgroundColor: C.primary, borderColor: C.primary },
  tabText:                { fontSize: 12, fontWeight: "600", color: C.muted },
  tabTextActive:          { color: C.white },
  scroll:                 { padding: 16, paddingBottom: 80 },

  // Earnings card
  earningsCard:           { backgroundColor: C.primary, borderRadius: 24, padding: 24, marginBottom: 16 },
  earningsLabel:          { fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1, marginBottom: 4 },
  earningsAmount:         { fontSize: 36, fontWeight: "800", color: C.white, marginBottom: 4 },
  earningsSub:            { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 },
  periodRow:              { flexDirection: "row", gap: 8 },
  periodBtn:              { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.15)" },
  periodBtnActive:        { backgroundColor: C.white },
  periodBtnText:          { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  periodBtnTextActive:    { color: C.primary },

  // Stats
  statsRow:               { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard:               { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  statValue:              { fontSize: 14, fontWeight: "800", marginBottom: 4, textAlign: "center" },
  statLabel:              { fontSize: 10, color: C.muted, textAlign: "center", fontWeight: "600" },

  // Section
  section:                { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  sectionTitle:           { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 16 },
  sectionTitle2:          { fontSize: 18, fontWeight: "800", color: C.text, marginBottom: 16 },

  // Bar chart
  barChart:               { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 130 },
  barCol:                 { flex: 1, alignItems: "center", gap: 4, justifyContent: "flex-end" },
  barAmount:              { fontSize: 9, color: C.muted, fontWeight: "600" },
  bar:                    { width: "100%", borderRadius: 6 },
  barMonth:               { fontSize: 10, color: C.muted },

  // Payout card
  payoutCard:             { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1.5, borderColor: C.primaryMid },
  payoutLabel:            { fontSize: 11, color: C.primary, letterSpacing: 1, marginBottom: 4, fontWeight: "700" },
  payoutAmount:           { fontSize: 24, fontWeight: "800", color: C.text },
  payoutBtn:              { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  payoutBtnText:          { fontSize: 14, fontWeight: "700", color: C.white },

  // Transactions
  transactionItem:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  transactionLeft:        { flexDirection: "row", alignItems: "center", gap: 12 },
  transactionIcon:        { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  transactionClient:      { fontSize: 14, fontWeight: "700", color: C.text },
  transactionMeta:        { fontSize: 12, color: C.muted, marginTop: 2 },
  transactionAmount:      { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  transactionStatus:      { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  transactionStatusText:  { fontSize: 11, fontWeight: "700" },

  // Payouts
  payoutMethod:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  payoutMethodLeft:       { flexDirection: "row", alignItems: "center", gap: 12 },
  payoutMethodIcon:       { fontSize: 28 },
  payoutMethodLabel:      { fontSize: 14, fontWeight: "700", color: C.text },
  payoutMethodNumber:     { fontSize: 12, color: C.muted, marginTop: 2 },
  withdrawBtn:            { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  withdrawBtnText:        { fontSize: 13, fontWeight: "700", color: C.white },
  payoutHistoryItem:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  payoutHistoryAmount:    { fontSize: 15, fontWeight: "800", color: C.text },
  payoutHistoryMeta:      { fontSize: 12, color: C.muted, marginTop: 2 },
});