import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary: "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid: "#DDD6FE",
  accent: "#A78BFA",
  green: "#2EC27E",
  yellow: "#F59E0B",
  red: "#EF4444",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#FAF8FF",
  white: "#FFFFFF",
  border: "#F0EEFF",
};

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "KES 2,500",
    amount: 2500,
    period: "/ month",
    features: [
      "2 sessions per month",
      "AI Chatbot access",
      "Mood tracking",
      "Journal",
    ],
    color: C.accent,
  },
  {
    id: "standard",
    name: "Standard",
    price: "KES 5,000",
    amount: 5000,
    period: "/ month",
    features: [
      "5 sessions per month",
      "AI Chatbot access",
      "Mood tracking",
      "Journal",
      "Priority matching",
    ],
    color: C.primary,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "KES 9,000",
    amount: 9000,
    period: "/ month",
    features: [
      "Unlimited sessions",
      "AI Chatbot access",
      "Mood tracking",
      "Journal",
      "Priority matching",
      "24/7 support",
    ],
    color: "#1E1B4B",
  },
];

export default function Payments() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<"mpesa" | "card" | "till">(
    "mpesa",
  );
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (payMethod === "mpesa") {
      if (!phone || phone.length < 10) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "📱 M-Pesa Request Sent!",
          `A payment request of ${selectedPlan.price} has been sent to ${phone}.\n\nPlease check your phone and enter your M-Pesa PIN to complete payment.`,
          [
            {
              text: "Payment Complete ✓",
              onPress: () => {
                setPayModal(false);
                setSuccess(true);
              },
            },
            { text: "Cancel", style: "cancel" },
          ],
        );
      }, 2000);
    } else if (payMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        Alert.alert("Error", "Please fill in all card details");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setPayModal(false);
        setSuccess(true);
      }, 2000);
    } else if (payMethod === "till") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setPayModal(false);
        setSuccess(true);
      }, 1500);
    }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>
            You are now on the {selectedPlan.name} plan. Your sessions are ready
            to book!
          </Text>
          <View style={styles.successDetails}>
            <Text style={styles.successDetailText}>
              ✅ Plan: {selectedPlan.name}
            </Text>
            <Text style={styles.successDetailText}>
              ✅ Amount: {selectedPlan.price}
            </Text>
            <Text style={styles.successDetailText}>✅ Status: Active</Text>
          </View>
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => {
              setSuccess(false);
              router.push("/user/matching" as any);
            }}
          >
            <Text style={styles.successBtnText}>Book a Session 🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.successBtnOutline}
            onPress={() => setSuccess(false)}
          >
            <Text style={styles.successBtnOutlineText}>Back to Plans</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Choose a Plan</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Get matched with the right therapist and start your healing journey
        </Text>

        {/* PLANS */}
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan.id === plan.id && styles.planCardActive,
              { borderTopColor: plan.color },
            ]}
            onPress={() => setSelectedPlan(plan)}
            activeOpacity={0.85}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>⭐ Most Popular</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: plan.color }]}>
                {plan.name}
              </Text>
              <View style={styles.planPriceRow}>
                <Text style={[styles.planPrice, { color: plan.color }]}>
                  {plan.price}
                </Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </View>
            {plan.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            {selectedPlan.id === plan.id && (
              <View
                style={[
                  styles.selectedIndicator,
                  { backgroundColor: plan.color },
                ]}
              >
                <Text style={styles.selectedIndicatorText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* PAY BUTTON */}
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => setPayModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnText}>
            Pay {selectedPlan.price} — {selectedPlan.name} Plan
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* PAYMENT MODAL */}
      <Modal
        visible={payModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, { paddingBottom: insets.bottom + 24 }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment</Text>
              <TouchableOpacity onPress={() => setPayModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalPlan}>
              {selectedPlan.name} Plan — {selectedPlan.price}
            </Text>

            {/* Payment methods */}
            <View style={styles.methodRow}>
              {[
                { id: "mpesa", label: "M-Pesa", icon: "📱" },
                { id: "card", label: "Card", icon: "💳" },
                { id: "till", label: "Till", icon: "🏦" },
              ].map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setPayMethod(method.id as any)}
                  style={[
                    styles.methodBtn,
                    payMethod === method.id && styles.methodBtnActive,
                  ]}
                >
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <Text
                    style={[
                      styles.methodLabel,
                      payMethod === method.id && styles.methodLabelActive,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* M-Pesa */}
            {payMethod === "mpesa" && (
              <>
                <Text style={styles.inputLabel}>M-Pesa Phone Number</Text>
                <TextInput
                  placeholder="e.g. 0712345678"
                  style={styles.input}
                  placeholderTextColor={C.muted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={12}
                />
                <Text style={styles.inputHint}>
                  You will receive an STK push on this number
                </Text>
              </>
            )}

            {/* Card */}
            {payMethod === "card" && (
              <>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  placeholder="1234 5678 9012 3456"
                  style={styles.input}
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  maxLength={19}
                />
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Expiry</Text>
                    <TextInput
                      placeholder="MM/YY"
                      style={styles.input}
                      placeholderTextColor={C.muted}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      placeholder="123"
                      style={styles.input}
                      placeholderTextColor={C.muted}
                      keyboardType="numeric"
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            {/* Till */}
            {payMethod === "till" && (
              <View style={styles.tillInfo}>
                <Text style={styles.tillTitle}>Pay via Till Number</Text>
                <Text style={styles.tillNumber}>Till No: 123456</Text>
                <Text style={styles.tillAmount}>
                  Amount: {selectedPlan.price}
                </Text>
                <Text style={styles.tillSteps}>
                  1. Go to M-Pesa{"\n"}
                  2. Select Lipa na M-Pesa{"\n"}
                  3. Select Buy Goods & Services{"\n"}
                  4. Enter Till No: 123456{"\n"}
                  5. Enter Amount: {selectedPlan.amount}
                  {"\n"}
                  6. Enter your PIN
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
              onPress={handlePayment}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <Text style={styles.confirmBtnText}>
                  {payMethod === "mpesa"
                    ? "Send STK Push"
                    : payMethod === "card"
                      ? "Pay Now"
                      : "I have paid"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navBack: { fontSize: 22, color: C.muted },
  navTitle: { fontSize: 18, fontWeight: "800", color: C.text },
  scroll: { padding: 16, paddingBottom: 80 },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderTopWidth: 4,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  planCardActive: { borderColor: C.primary, shadowOpacity: 0.12 },
  popularBadge: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  popularText: { fontSize: 12, fontWeight: "700", color: C.primary },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  planName: { fontSize: 20, fontWeight: "800" },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  planPrice: { fontSize: 22, fontWeight: "800" },
  planPeriod: { fontSize: 13, color: C.muted },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  featureCheck: { fontSize: 14, color: C.green, fontWeight: "700" },
  featureText: { fontSize: 14, color: C.text },
  selectedIndicator: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 14,
  },
  selectedIndicatorText: { fontSize: 14, fontWeight: "700", color: C.white },
  payBtn: {
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: C.text },
  closeBtn: { fontSize: 18, color: C.muted },
  modalPlan: { fontSize: 14, color: C.muted, marginBottom: 20 },
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  methodBtn: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
    gap: 4,
  },
  methodBtnActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  methodIcon: { fontSize: 24 },
  methodLabel: { fontSize: 12, fontWeight: "600", color: C.muted },
  methodLabelActive: { color: C.primary },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.bg,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: C.text,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 12,
  },
  inputHint: { fontSize: 12, color: C.muted, marginBottom: 16 },
  cardRow: { flexDirection: "row", gap: 12 },
  tillInfo: {
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tillTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 8,
  },
  tillNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  tillAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
    marginBottom: 12,
  },
  tillSteps: { fontSize: 14, color: C.text, lineHeight: 24 },
  confirmBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnDisabled: { backgroundColor: C.accent },
  confirmBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successEmoji: { fontSize: 80, marginBottom: 20 },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.text,
    marginBottom: 12,
  },
  successSub: {
    fontSize: 15,
    color: C.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  successDetails: {
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    gap: 8,
    marginBottom: 24,
  },
  successDetailText: { fontSize: 15, fontWeight: "600", color: C.text },
  successBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  successBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  successBtnOutline: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  successBtnOutlineText: { fontSize: 15, fontWeight: "600", color: C.muted },
});
