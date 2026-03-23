import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, Modal,
} from "react-native";
import { useRouter } from "expo-router";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  red:          "#EF4444",
  mpesa:        "#00A651",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

const HISTORY = [
  { id: "1", therapist: "Dr. Amara Osei",   date: "Feb 28, 2025", amount: "KES 8,500", type: "Video call",  status: "paid",     method: "M-Pesa" },
  { id: "2", therapist: "Dr. Amara Osei",   date: "Feb 14, 2025", amount: "KES 8,500", type: "Voice call",  status: "paid",     method: "Card" },
  { id: "3", therapist: "Dr. Kwame Mensah", date: "Jan 30, 2025", amount: "KES 7,500", type: "Text / Chat", status: "paid",     method: "Till" },
  { id: "4", therapist: "Dr. Amara Osei",   date: "Jan 15, 2025", amount: "KES 8,500", type: "Video call",  status: "refunded", method: "M-Pesa" },
];

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "KES 4,900",
    period: "month",
    color: C.accent,
    features: ["2 sessions/month", "AI Chatbot access", "Mood tracking", "Journal"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "KES 9,900",
    period: "month",
    color: C.primary,
    features: ["5 sessions/month", "AI Chatbot access", "Mood tracking", "Journal", "Priority matching", "Session recordings"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "KES 17,900",
    period: "month",
    color: "#F59E0B",
    features: ["Unlimited sessions", "AI Chatbot access", "Mood tracking", "Journal", "Priority matching", "Session recordings", "24/7 crisis support"],
  },
];

const PAYMENT_METHODS = [
  { id: "mpesa",  label: "M-Pesa",       icon: "📱", color: C.mpesa,   desc: "Pay via M-Pesa STK Push" },
  { id: "till",   label: "Till Number",  icon: "🏪", color: "#F59E0B", desc: "Pay via M-Pesa Till" },
  { id: "card",   label: "Card",         icon: "💳", color: C.primary, desc: "Visa / Mastercard" },
];

export default function Payments() {
  const router = useRouter();
  const [tab, setTab]                     = useState<"overview" | "plans" | "method">("overview");
  const [selectedPlan, setSelectedPlan]   = useState("standard");
  const [payModal, setPayModal]           = useState(false);
  const [paid, setPaid]                   = useState(false);
  const [payMethod, setPayMethod]         = useState("mpesa");

  // Card fields
  const [cardNumber, setCardNumber]       = useState("");
  const [expiry, setExpiry]               = useState("");
  const [cvv, setCvv]                     = useState("");
  const [cardName, setCardName]           = useState("");

  // M-Pesa fields
  const [mpesaPhone, setMpesaPhone]       = useState("");

  // Till fields
  const [tillNumber, setTillNumber]       = useState("");
  const [tillPhone, setTillPhone]         = useState("");

  const handlePayment = () => {
    setPaid(true);
    setTimeout(() => {
      setPayModal(false);
      setPaid(false);
    }, 2500);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
  };

  const canPay = () => {
    if (payMethod === "mpesa") return mpesaPhone.length >= 10;
    if (payMethod === "till") return tillNumber.length >= 5 && tillPhone.length >= 10;
    if (payMethod === "card") return cardNumber.length >= 19 && expiry.length >= 5 && cvv.length >= 3 && cardName.length > 0;
    return false;
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navLogo}>
          thera<Text style={{ color: C.text }}>care</Text>
        </Text>
        <Text style={styles.navTitle}>Payments</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["overview", "plans", "method"] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "overview" ? "Overview" : t === "plans" ? "Plans" : "Method"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* Balance card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>CURRENT PLAN</Text>
              <Text style={styles.balancePlan}>Standard Plan</Text>
              <Text style={styles.balanceRenew}>Renews on March 15, 2025</Text>
              <View style={styles.balanceRow}>
                <View>
                  <Text style={styles.balanceAmount}>KES 9,900</Text>
                  <Text style={styles.balancePeriod}>per month</Text>
                </View>
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => setTab("plans")}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              {[
                { label: "Sessions Used", value: "3/5" },
                { label: "Total Spent",   value: "KES 33K" },
                { label: "Next Payment",  value: "Mar 15" },
              ].map(stat => (
                <View key={stat.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Payment history */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment History</Text>
              {HISTORY.map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyTherapist}>{item.therapist}</Text>
                    <Text style={styles.historyMeta}>{item.type} · {item.date}</Text>
                    <View style={styles.historyMethodTag}>
                      <Text style={styles.historyMethodText}>{item.method}</Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyAmount}>{item.amount}</Text>
                    <View style={[
                      styles.historyStatus,
                      { backgroundColor: item.status === "paid" ? `${C.green}18` : `${C.red}18` }
                    ]}>
                      <Text style={[
                        styles.historyStatusText,
                        { color: item.status === "paid" ? C.green : C.red }
                      ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* PLANS TAB */}
        {tab === "plans" && (
          <>
            <Text style={styles.plansTitle}>Choose Your Plan</Text>
            <Text style={styles.plansSub}>Invest in your mental wellness journey</Text>

            {PLANS.map(plan => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && { borderColor: plan.color, borderWidth: 2 },
                ]}
                activeOpacity={0.85}
              >
                {plan.popular && (
                  <View style={[styles.popularTag, { backgroundColor: plan.color }]}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}
                <View style={styles.planTop}>
                  <View>
                    <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                    <Text style={styles.planPeriod}>per {plan.period}</Text>
                  </View>
                  <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.map(f => (
                    <View key={f} style={styles.planFeature}>
                      <Text style={[styles.planFeatureIcon, { color: plan.color }]}>✓</Text>
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </View>
                {selectedPlan === plan.id && (
                  <TouchableOpacity
                    style={[styles.selectPlanBtn, { backgroundColor: plan.color }]}
                    onPress={() => setPayModal(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.selectPlanBtnText}>Subscribe to {plan.name}</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* PAYMENT METHOD TAB */}
        {tab === "method" && (
          <>
            <Text style={styles.plansTitle}>Payment Methods</Text>
            <Text style={styles.plansSub}>Your payment info is encrypted and secure 🔒</Text>

            {/* Saved methods */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Methods</Text>
              <View style={styles.savedCard}>
                <View style={styles.savedCardLeft}>
                  <Text style={styles.savedCardIcon}>📱</Text>
                  <View>
                    <Text style={styles.savedCardNumber}>M-Pesa · 0712 ••• •••</Text>
                    <Text style={styles.savedCardExpiry}>Default method</Text>
                  </View>
                </View>
                <View style={[styles.savedCardBadge, { backgroundColor: C.mpesa }]}>
                  <Text style={styles.savedCardBadgeText}>Active</Text>
                </View>
              </View>
            </View>

            {/* Add new method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Payment Method</Text>

              {/* Method selector */}
              <View style={styles.methodSelector}>
                {PAYMENT_METHODS.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setPayMethod(m.id)}
                    style={[
                      styles.methodBtn,
                      payMethod === m.id && { borderColor: m.color, backgroundColor: `${m.color}12` },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.methodIcon}>{m.icon}</Text>
                    <Text style={[styles.methodLabel, payMethod === m.id && { color: m.color }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* M-Pesa form */}
              {payMethod === "mpesa" && (
                <View style={styles.methodForm}>
                  <View style={[styles.methodInfoCard, { backgroundColor: `${C.mpesa}12` }]}>
                    <Text style={[styles.methodInfoText, { color: C.mpesa }]}>
                      📱 An STK push will be sent to your phone to confirm payment
                    </Text>
                  </View>
                  <Text style={styles.inputLabel}>M-Pesa Phone Number</Text>
                  <TextInput
                    value={mpesaPhone}
                    onChangeText={setMpesaPhone}
                    placeholder="07XX XXX XXX"
                    placeholderTextColor={C.muted}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                </View>
              )}

              {/* Till form */}
              {payMethod === "till" && (
                <View style={styles.methodForm}>
                  <View style={[styles.methodInfoCard, { backgroundColor: "#F59E0B18" }]}>
                    <Text style={[styles.methodInfoText, { color: "#F59E0B" }]}>
                      🏪 Pay to TheraCare Till Number. Enter your phone to confirm.
                    </Text>
                  </View>
                  <Text style={styles.inputLabel}>Till Number</Text>
                  <TextInput
                    value={tillNumber}
                    onChangeText={setTillNumber}
                    placeholder="e.g. 123456"
                    placeholderTextColor={C.muted}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputLabel}>Your Phone Number</Text>
                  <TextInput
                    value={tillPhone}
                    onChangeText={setTillPhone}
                    placeholder="07XX XXX XXX"
                    placeholderTextColor={C.muted}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                </View>
              )}

              {/* Card form */}
              {payMethod === "card" && (
                <View style={styles.methodForm}>
                  <Text style={styles.inputLabel}>Cardholder Name</Text>
                  <TextInput
                    value={cardName}
                    onChangeText={setCardName}
                    placeholder="John Doe"
                    placeholderTextColor={C.muted}
                    style={styles.input}
                  />
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput
                    value={cardNumber}
                    onChangeText={t => setCardNumber(formatCardNumber(t))}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={C.muted}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  <View style={styles.inputRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Expiry</Text>
                      <TextInput
                        value={expiry}
                        onChangeText={t => setExpiry(formatExpiry(t))}
                        placeholder="MM/YY"
                        placeholderTextColor={C.muted}
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        value={cvv}
                        onChangeText={t => setCvv(t.slice(0, 3))}
                        placeholder="123"
                        placeholderTextColor={C.muted}
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.addCardBtn, !canPay() && styles.addCardBtnDisabled]}
                disabled={!canPay()}
                activeOpacity={0.85}
              >
                <Text style={styles.addCardBtnText}>
                  {payMethod === "mpesa" ? "Save M-Pesa Number" : payMethod === "till" ? "Save Till Number" : "Add Card"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScrollView>

      {/* PAYMENT MODAL */}
      <Modal
        visible={payModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {paid ? (
              <View style={styles.paidScreen}>
                <Text style={styles.paidEmoji}>🎉</Text>
                <Text style={styles.paidTitle}>Payment Successful!</Text>
                <Text style={styles.paidSub}>
                  Welcome to the {PLANS.find(p => p.id === selectedPlan)?.name} plan!
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Confirm Payment</Text>
                <Text style={styles.modalSub}>
                  {PLANS.find(p => p.id === selectedPlan)?.name} Plan —{" "}
                  {PLANS.find(p => p.id === selectedPlan)?.price}/month
                </Text>

                {/* Payment method selector in modal */}
                <Text style={styles.inputLabel}>Pay with</Text>
                <View style={styles.methodSelector}>
                  {PAYMENT_METHODS.map(m => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => setPayMethod(m.id)}
                      style={[
                        styles.methodBtn,
                        payMethod === m.id && { borderColor: m.color, backgroundColor: `${m.color}12` },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.methodIcon}>{m.icon}</Text>
                      <Text style={[styles.methodLabel, payMethod === m.id && { color: m.color }]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* M-Pesa input in modal */}
                {payMethod === "mpesa" && (
                  <View style={styles.methodForm}>
                    <View style={[styles.methodInfoCard, { backgroundColor: `${C.mpesa}12` }]}>
                      <Text style={[styles.methodInfoText, { color: C.mpesa }]}>
                        📱 An STK push will be sent to your phone
                      </Text>
                    </View>
                    <TextInput
                      value={mpesaPhone}
                      onChangeText={setMpesaPhone}
                      placeholder="07XX XXX XXX"
                      placeholderTextColor={C.muted}
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={12}
                    />
                  </View>
                )}

                {/* Till input in modal */}
                {payMethod === "till" && (
                  <View style={styles.methodForm}>
                    <TextInput
                      value={tillPhone}
                      onChangeText={setTillPhone}
                      placeholder="Your phone: 07XX XXX XXX"
                      placeholderTextColor={C.muted}
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={12}
                    />
                  </View>
                )}

                {/* Card input in modal */}
                {payMethod === "card" && (
                  <View style={styles.savedCard}>
                    <View style={styles.savedCardLeft}>
                      <Text style={styles.savedCardIcon}>💳</Text>
                      <View>
                        <Text style={styles.savedCardNumber}>•••• •••• •••• 4242</Text>
                        <Text style={styles.savedCardExpiry}>Expires 12/26</Text>
                      </View>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handlePayment}
                  style={styles.confirmBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>
                    Pay {PLANS.find(p => p.id === selectedPlan)?.price}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPayModal(false)}
                  style={styles.cancelPayBtn}
                >
                  <Text style={styles.cancelPayBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:                 { flex: 1, backgroundColor: C.bg },
  nav:                  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:              { fontSize: 22, color: C.muted },
  navLogo:              { fontSize: 20, fontWeight: "800", color: C.primary },
  navTitle:             { fontSize: 13, color: C.muted },
  tabs:                 { flexDirection: "row", gap: 6, padding: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  tab:                  { flex: 1, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, alignItems: "center" },
  tabActive:            { backgroundColor: C.primary, borderColor: C.primary },
  tabText:              { fontSize: 12, fontWeight: "600", color: C.muted },
  tabTextActive:        { color: C.white },
  scroll:               { padding: 16, paddingBottom: 80 },
  balanceCard:          { borderRadius: 24, padding: 24, marginBottom: 16, backgroundColor: C.primary },
  balanceLabel:         { fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1, marginBottom: 4 },
  balancePlan:          { fontSize: 24, fontWeight: "800", color: C.white, marginBottom: 4 },
  balanceRenew:         { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 },
  balanceRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  balanceAmount:        { fontSize: 32, fontWeight: "800", color: C.white },
  balancePeriod:        { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  upgradeBtn:           { backgroundColor: C.white, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  upgradeBtnText:       { fontSize: 14, fontWeight: "700", color: C.primary },
  statsRow:             { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard:             { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  statValue:            { fontSize: 16, fontWeight: "800", color: C.primary, marginBottom: 4 },
  statLabel:            { fontSize: 11, color: C.muted, textAlign: "center", fontWeight: "600" },
  section:              { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  sectionTitle:         { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 16 },
  historyItem:          { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", justifyContent: "space-between" },
  historyLeft:          { flex: 1 },
  historyTherapist:     { fontSize: 14, fontWeight: "700", color: C.text },
  historyMeta:          { fontSize: 12, color: C.muted, marginTop: 2 },
  historyMethodTag:     { alignSelf: "flex-start", backgroundColor: C.primaryLight, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  historyMethodText:    { fontSize: 11, color: C.primary, fontWeight: "600" },
  historyRight:         { alignItems: "flex-end", gap: 4 },
  historyAmount:        { fontSize: 14, fontWeight: "800", color: C.text },
  historyStatus:        { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  historyStatusText:    { fontSize: 11, fontWeight: "700" },
  plansTitle:           { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 4 },
  plansSub:             { fontSize: 14, color: C.muted, marginBottom: 20 },
  planCard:             { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1.5, borderColor: C.border, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  popularTag:           { alignSelf: "flex-start", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
  popularText:          { fontSize: 10, fontWeight: "800", color: C.white, letterSpacing: 1 },
  planTop:              { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  planName:             { fontSize: 20, fontWeight: "800" },
  planPeriod:           { fontSize: 12, color: C.muted },
  planPrice:            { fontSize: 28, fontWeight: "800" },
  planFeatures:         { gap: 8, marginBottom: 16 },
  planFeature:          { flexDirection: "row", alignItems: "center", gap: 8 },
  planFeatureIcon:      { fontSize: 14, fontWeight: "800" },
  planFeatureText:      { fontSize: 14, color: C.text },
  selectPlanBtn:        { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  selectPlanBtnText:    { fontSize: 15, fontWeight: "700", color: C.white },
  savedCard:            { backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  savedCardLeft:        { flexDirection: "row", alignItems: "center", gap: 12 },
  savedCardIcon:        { fontSize: 28 },
  savedCardNumber:      { fontSize: 14, fontWeight: "700", color: C.text },
  savedCardExpiry:      { fontSize: 12, color: C.muted },
  savedCardBadge:       { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  savedCardBadgeText:   { fontSize: 11, fontWeight: "700", color: C.white },
  methodSelector:       { flexDirection: "row", gap: 8, marginBottom: 16 },
  methodBtn:            { flex: 1, alignItems: "center", padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, gap: 4 },
  methodIcon:           { fontSize: 24 },
  methodLabel:          { fontSize: 11, fontWeight: "600", color: C.muted, textAlign: "center" },
  methodForm:           { marginBottom: 8 },
  methodInfoCard:       { borderRadius: 12, padding: 12, marginBottom: 12 },
  methodInfoText:       { fontSize: 13, fontWeight: "600" },
  inputLabel:           { fontSize: 13, fontWeight: "600", color: C.text, marginBottom: 6 },
  input:                { backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1.5, borderColor: C.border, marginBottom: 14 },
  inputRow:             { flexDirection: "row", gap: 12 },
  addCardBtn:           { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  addCardBtnDisabled:   { backgroundColor: "#E5E5E5", shadowOpacity: 0, elevation: 0 },
  addCardBtnText:       { fontSize: 15, fontWeight: "700", color: C.white },
  modalOverlay:         { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard:            { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28 },
  modalTitle:           { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 6 },
  modalSub:             { fontSize: 14, color: C.muted, marginBottom: 20 },
  confirmBtn:           { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 10, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  confirmBtnText:       { fontSize: 16, fontWeight: "700", color: C.white },
  cancelPayBtn:         { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  cancelPayBtnText:     { fontSize: 15, fontWeight: "600", color: C.muted },
  paidScreen:           { alignItems: "center", paddingVertical: 24 },
  paidEmoji:            { fontSize: 64, marginBottom: 16 },
  paidTitle:            { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 8 },
  paidSub:              { fontSize: 15, color: C.muted, textAlign: "center" },
});