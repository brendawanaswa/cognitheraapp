import TheraCareLogo from "@/components/TheraCareLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryMid: "#99F6E4",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#F0FDFA",
  white: "#FFFFFF",
  border: "#CCFBF1",
  green: "#2EC27E",
  yellow: "#F59E0B",
};

const SPECIALTIES = [
  "Anxiety & Panic",
  "Depression",
  "Trauma & PTSD",
  "Relationships",
  "Grief & Loss",
  "Self-Esteem",
  "Addiction",
  "Family Therapy",
  "Child & Adolescent",
  "Career & Life Coaching",
  "Eating Disorders",
  "OCD",
];

const CERT_TYPES = [
  { id: "degree", label: "Degree Certificate", icon: "🎓" },
  { id: "license", label: "Professional License", icon: "📜" },
  { id: "id", label: "National ID / Passport", icon: "🪪" },
  { id: "insurance", label: "Professional Insurance", icon: "🛡️" },
];

export default function TherapistAuth() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSpecs, setSpecs] = useState<string[]>([]);
  const [sessionRate, setSessionRate] = useState("");
  const [uploadedCerts, setUploadedCerts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSpec = (s: string) => {
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const uploadCert = (certId: string) => {
    if (!uploadedCerts.includes(certId)) {
      setUploadedCerts((prev) => [...prev, certId]);
    }
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem("therapist_logged_in", "true");
    router.replace("/therapist/dashboard");
  };

  const handleSignup = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    await AsyncStorage.setItem("therapist_logged_in", "true");
    await AsyncStorage.setItem("therapist_name", fullName);
    await AsyncStorage.setItem("therapist_verified", "pending");
    setSubmitted(true);
  };

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSub}>
            Thank you {fullName.split(" ")[0]}! Your application is under
            review. We'll verify your certificates and notify you within 24–48
            hours.
          </Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>🟡 Pending Verification</Text>
          </View>
          <View style={styles.successSteps}>
            {[
              { icon: "✅", text: "Application submitted" },
              { icon: "🔍", text: "Certificates under review" },
              { icon: "📧", text: "You'll receive an email once approved" },
              { icon: "🚀", text: "Start accepting clients!" },
            ].map((s, i) => (
              <View key={i} style={styles.successStep}>
                <Text style={styles.successStepIcon}>{s.icon}</Text>
                <Text style={styles.successStepText}>{s.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.goToDashBtn}
            onPress={() => router.replace("/therapist/dashboard")}
          >
            <Text style={styles.goToDashBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrap}>
        <TheraCareLogo size="medium" />
        <Text style={styles.logoSub}>Therapist Portal</Text>
      </View>

      {/* Login */}
      {!isSignup && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back 👋</Text>
          <Text style={styles.cardSub}>Sign in to your therapist account</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor={C.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={C.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignup(true)}>
            <Text style={styles.toggleText}>New therapist? Apply here</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Signup */}
      {isSignup && (
        <View style={styles.card}>
          {/* Progress steps */}
          <View style={styles.stepsRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    step >= s && styles.stepCircleActive,
                  ]}
                >
                  <Text
                    style={[styles.stepNum, step >= s && styles.stepNumActive]}
                  >
                    {step > s ? "✓" : s}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step >= s && styles.stepLabelActive,
                  ]}
                >
                  {s === 1 ? "Account" : s === 2 ? "Profile" : "Certificates"}
                </Text>
                {s < 3 && (
                  <View
                    style={[styles.stepLine, step > s && styles.stepLineActive]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <Text style={styles.cardTitle}>Create Your Account</Text>
              <Text style={styles.cardSub}>
                Start your journey as a TheraCare therapist
              </Text>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                placeholderTextColor={C.muted}
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor={C.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Password"
                style={styles.input}
                placeholderTextColor={C.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                placeholderTextColor={C.muted}
                secureTextEntry
                value={confirmPass}
                onChangeText={setConfirmPass}
              />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <Text style={styles.cardTitle}>Professional Info</Text>
              <Text style={styles.cardSub}>Tell us about your expertise</Text>
              <TextInput
                placeholder="Professional Title (e.g. Licensed Clinical Psychologist)"
                style={styles.input}
                placeholderTextColor={C.muted}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                placeholder="Years of Experience"
                style={styles.input}
                placeholderTextColor={C.muted}
                keyboardType="numeric"
                value={experience}
                onChangeText={setExperience}
              />
              <TextInput
                placeholder="Session Rate (KES per session)"
                style={styles.input}
                placeholderTextColor={C.muted}
                keyboardType="numeric"
                value={sessionRate}
                onChangeText={setSessionRate}
              />
              <TextInput
                placeholder="Bio — tell clients about yourself..."
                style={[styles.input, styles.inputMultiline]}
                placeholderTextColor={C.muted}
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />
              <Text style={styles.specsLabel}>
                Specialties (select all that apply)
              </Text>
              <View style={styles.specsTags}>
                {SPECIALTIES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => toggleSpec(s)}
                    style={[
                      styles.specTag,
                      selectedSpecs.includes(s) && styles.specTagActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.specTagText,
                        selectedSpecs.includes(s) && styles.specTagTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>Upload Certificates</Text>
              <Text style={styles.cardSub}>
                We verify all therapists to ensure client safety.
              </Text>
              <View style={styles.certsInfo}>
                <Text style={styles.certsInfoText}>
                  🔒 Your documents are encrypted and only reviewed by our
                  verification team.
                </Text>
              </View>
              {CERT_TYPES.map((cert) => {
                const uploaded = uploadedCerts.includes(cert.id);
                return (
                  <TouchableOpacity
                    key={cert.id}
                    style={[
                      styles.certItem,
                      uploaded && styles.certItemUploaded,
                    ]}
                    onPress={() => !uploaded && uploadCert(cert.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.certIcon}>{cert.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.certLabel}>{cert.label}</Text>
                      <Text style={styles.certStatus}>
                        {uploaded ? "✅ Uploaded" : "Tap to upload"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 20 }}>
                      {uploaded ? "✅" : "⬆️"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={styles.certsProgress}>
                <Text style={styles.certsProgressText}>
                  {uploadedCerts.length} of {CERT_TYPES.length} documents
                  uploaded
                </Text>
                <View style={styles.certsProgressTrack}>
                  <View
                    style={[
                      styles.certsProgressFill,
                      {
                        width: `${(uploadedCerts.length / CERT_TYPES.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.navRow}>
            {step > 1 && (
              <TouchableOpacity
                onPress={() => setStep((s) => s - 1)}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSignup}
              style={[styles.submitBtn, { flex: step > 1 ? 3 : 1 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>
                {step === 3 ? "Submit Application" : "Continue →"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              setIsSignup(false);
              setStep(1);
            }}
          >
            <Text style={styles.toggleText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: C.bg,
  },
  logoWrap: { alignItems: "center", marginBottom: 32 },
  logoSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
    fontWeight: "600",
    letterSpacing: 1,
  },
  card: {
    width: "100%",
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
  },
  cardSub: { fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 20 },
  input: {
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: C.text,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 12,
  },
  inputMultiline: { minHeight: 100 },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  toggleText: {
    color: C.purple,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  stepItem: { alignItems: "center", flexDirection: "row", gap: 6 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.border,
  },
  stepCircleActive: { backgroundColor: C.primary, borderColor: C.primary },
  stepNum: { fontSize: 13, fontWeight: "700", color: C.muted },
  stepNumActive: { color: C.white },
  stepLabel: { fontSize: 11, color: C.muted, fontWeight: "600" },
  stepLabelActive: { color: C.primary },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: C.border,
    marginHorizontal: 4,
  },
  stepLineActive: { backgroundColor: C.primary },
  specsLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    marginBottom: 12,
  },
  specsTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  specTag: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  specTagActive: { backgroundColor: C.primary },
  specTagText: { fontSize: 13, fontWeight: "600", color: C.primary },
  specTagTextActive: { color: C.white },
  certsInfo: {
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  certsInfoText: {
    fontSize: 13,
    color: C.primary,
    fontWeight: "600",
    lineHeight: 20,
  },
  certItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.bg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  certItemUploaded: { borderColor: C.green, backgroundColor: "#F0FDF4" },
  certIcon: { fontSize: 28 },
  certLabel: { fontSize: 14, fontWeight: "700", color: C.text },
  certStatus: { fontSize: 12, color: C.muted, marginTop: 2 },
  certsProgress: { marginTop: 8, marginBottom: 16 },
  certsProgressText: {
    fontSize: 13,
    color: C.muted,
    marginBottom: 8,
    fontWeight: "600",
  },
  certsProgressTrack: {
    height: 6,
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    overflow: "hidden",
  },
  certsProgressFill: {
    height: 6,
    backgroundColor: C.primary,
    borderRadius: 99,
  },
  navRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  backBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    alignItems: "center",
  },
  backBtnText: { fontSize: 15, fontWeight: "600", color: C.muted },
  successCard: {
    width: "100%",
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  successEmoji: { fontSize: 72, marginBottom: 16 },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.text,
    marginBottom: 12,
    textAlign: "center",
  },
  successSub: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 24,
  },
  pendingBadgeText: { fontSize: 14, fontWeight: "700", color: C.yellow },
  successSteps: { width: "100%", gap: 12, marginBottom: 28 },
  successStep: { flexDirection: "row", alignItems: "center", gap: 12 },
  successStepIcon: { fontSize: 20 },
  successStepText: { fontSize: 14, color: C.text, fontWeight: "600" },
  goToDashBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  goToDashBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
});
