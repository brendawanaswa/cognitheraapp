import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import TheraCareLogo from "@/components/TheraCareLogo";

const C = {
  primary:      "#8B5CF6",
  primaryLight: "#EDE9FE",
  primaryMid:   "#C4B5FD",
  teal:         "#2A9D8F",
  tealLight:    "#CCFBF1",
  tealMid:      "#5EBFB5",
  text:         "#1E1B2E",
  muted:        "#7C6F9F",
  bg:           "#F8F6FF",
  bgCard:       "#FFFFFF",
  white:        "#FFFFFF",
  border:       "#E5E0FF",
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Logo */}
      <View style={styles.logoWrap}>
        <TheraCareLogo size="large" showTagline />
      </View>

      {/* Hero text */}
      <View style={styles.heroWrap}>
        <Text style={styles.heroTitle}>
          Your mental health{"\n"}journey starts here 💜
        </Text>
        <Text style={styles.heroSub}>
          A safe, confidential space where healing begins
          and growth continues — for users and therapists alike.
        </Text>
      </View>

      {/* Features row */}
      <View style={styles.featuresRow}>
        {[
          { icon: "🤖", label: "AI Support" },
          { icon: "👨‍⚕️", label: "Real Therapists" },
          { icon: "📓", label: "Journaling" },
          { icon: "😊", label: "Mood Tracking" },
        ].map(f => (
          <View key={f.label} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* Cards */}
      <Text style={styles.chooseText}>How would you like to continue?</Text>

      {/* User card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/user/auth")}
        activeOpacity={0.85}
      >
        <View style={styles.cardIconWrap}>
          <Text style={styles.cardIcon}>🙋</Text>
        </View>
        <Text style={styles.cardTitle}>Continue as User</Text>
        <Text style={styles.cardArrow}>→</Text>
      </TouchableOpacity>

      {/* Therapist card */}
      <TouchableOpacity
        style={[styles.card, styles.cardTeal]}
        onPress={() => router.push("/therapist/auth")}
        activeOpacity={0.85}
      >
        <View style={[styles.cardIconWrap, { backgroundColor: C.tealLight }]}>
          <Text style={styles.cardIcon}>👨‍⚕️</Text>
        </View>
        <Text style={[styles.cardTitle, { color: C.teal }]}>Continue as Therapist</Text>
        <Text style={[styles.cardArrow, { color: C.teal }]}>→</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        🔒 Your data is private, encrypted and secure
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, alignItems: "center", padding: 24, backgroundColor: C.bg, paddingTop: 60 },
  logoWrap:     { marginBottom: 32, alignItems: "center" },
  heroWrap:     { alignItems: "center", marginBottom: 28 },
  heroTitle:    { fontSize: 28, fontWeight: "800", color: C.text, textAlign: "center", lineHeight: 38, marginBottom: 12 },
  heroSub:      { fontSize: 15, color: C.muted, textAlign: "center", lineHeight: 22 },
  featuresRow:  { flexDirection: "row", gap: 10, marginBottom: 32 },
  featureItem:  { alignItems: "center", backgroundColor: C.white, borderRadius: 16, padding: 14, flex: 1, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: C.border },
  featureIcon:  { fontSize: 24, marginBottom: 6 },
  featureLabel: { fontSize: 11, fontWeight: "700", color: C.muted, textAlign: "center" },
  chooseText:   { fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 12, alignSelf: "center" },
  card:         { width: "75%", backgroundColor: C.white, padding: 14, borderRadius: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderColor: C.border, alignSelf: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardTeal:     { borderColor: C.tealLight },
  cardIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  cardIcon:     { fontSize: 20 },
  cardTitle:    { flex: 1, fontSize: 14, fontWeight: "800", color: C.primary },
  cardArrow:    { fontSize: 16, color: C.primary, fontWeight: "800" },
  footer:       { fontSize: 13, color: C.muted, marginTop: 24, textAlign: "center" },
});