import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TheraCareLogo from "@/components/TheraCareLogo";
import * as DocumentPicker from "expo-document-picker";

const C = {
  primary:      "#0D9488",
  primaryLight: "#CCFBF1",
  primaryMid:   "#99F6E4",
  purple:       "#7C3AED",
  purpleLight:  "#EDE9FE",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#F0FDFA",
  white:        "#FFFFFF",
  border:       "#CCFBF1",
  green:        "#2EC27E",
  yellow:       "#F59E0B",
  red:          "#EF4444",
};

const SPECIALTIES = [
  "Anxiety & Panic", "Depression", "Trauma & PTSD",
  "Relationships", "Grief & Loss", "Self-Esteem",
  "Addiction", "Family Therapy", "Child & Adolescent",
  "Career & Life Coaching", "Eating Disorders", "OCD",
];

const EXPERIENCE_OPTIONS = [
  "1-2 years", "3-5 years", "6-8 years",
  "9-11 years", "12-15 years", "15+ years",
];

const CERT_TYPES = [
  { id: "degree",    label: "Degree Certificate",        icon: "🎓" },
  { id: "license",   label: "Professional License",      icon: "📜" },
  { id: "id",        label: "National ID / Passport",    icon: "🪪" },
  { id: "insurance", label: "Professional Insurance",    icon: "🛡️" },
];

export default function TherapistAuth() {
  const router = useRouter();
  const [isSignup, setIsSignup]             = useState(false);
  const [step, setStep]                     = useState(1);
  const [fullName, setFullName]             = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPass, setConfirmPass]       = useState("");
  const [title, setTitle]                   = useState("");
  const [experience, setExperience]         = useState("");
  const [bio, setBio]                       = useState("");
  const [selectedSpecs, setSpecs]           = useState<string[]>([]);
  const [sessionRate, setSessionRate]       = useState("");
  const [rateType, setRateType]             = useState("per session");
  const [showDropdown, setShowDropdown]     = useState(false);
  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [uploadedCerts, setUploadedCerts]   = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles]   = useState<Record<string, string>>({});
  const [submitted, setSubmitted]           = useState(false);
  const [loginEmail, setLoginEmail]         = useState("");
  const [loginPassword, setLoginPassword]   = useState("");

  const toggleSpec = (s: string) => {
    setSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const uploadCert = async (certId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setUploadedCerts(prev => [...prev.filter(id => id !== certId), certId]);
        setUploadedFiles(prev => ({ ...prev, [certId]: file.name }));
      }
    } catch (err) {
      Alert.alert("Error", "Could not upload file. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!loginEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    await AsyncStorage.setItem("therapist_logged_in", "true");
    router.replace("/therapist/dashboard");
  };

  const handleSignup = async () => {
    if (step === 1) {
      if (!fullName || !email || !password || !confirmPass) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      if (!email.includes("@")) {
        Alert.alert("Error", "Please enter a valid email");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPass) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      setStep(s => s + 1);
      return;
    }

    if (step === 2) {
      if (!title || !experience || !sessionRate || !bio) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      if (selectedSpecs.length === 0) {
        Alert.alert("Error", "Please select at least one specialty");
        return;
      }
      setStep(s => s + 1);
      return;
    }

    if (uploadedCerts.length < CERT_TYPES.length) {
      Alert.alert("Error", "Please upload all required certificates");
      return;
    }

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
            Thank you {fullName.split(" ")[0]}! Your application is under review.
            We'll verify your certificates and notify you within 24-48 hours.
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
            onPress={() => {
              setSubmitted(false);
              setIsSignup(false);
              setStep(1);
              setFullName(""); setEmail(""); setPassword("");
              setConfirmPass(""); setTitle(""); setExperience("");
              setBio(""); setSessionRate(""); setSpecs([]);
              setUploadedCerts([]); setUploadedFiles({});
            }}
          >
            <Text style={styles.goToDashBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.logoWrap}>
        <TheraCareLogo size="medium" />
        <Text style={styles.logoSub}>Therapist Portal</Text>
      </View>

      {/* Login */}
      {!isSignup && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back 👋</Text>
          <Text style={styles.cardSub}>Sign in to your therapist account</Text>
          <TextInput placeholder="Email" style={styles.input} placeholderTextColor={C.muted} keyboardType="email-address" autoCapitalize="none" value={loginEmail} onChangeText={setLoginEmail} />
          <TextInput placeholder="Password" style={styles.input} placeholderTextColor={C.muted} secureTextEntry value={loginPassword} onChangeText={setLoginPassword} />
          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} activeOpacity={0.85}>
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
            {[1, 2, 3].map(s => (
              <View key={s} style={styles.stepItem}>
                <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
                  <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>
                    {step > s ? "✓" : s}
                  </Text>
                </View>
                <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>
                  {s === 1 ? "Account" : s === 2 ? "Profile" : "Certificates"}
                </Text>
                {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
              </View>
            ))}
          </View>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <Text style={styles.cardTitle}>Create Your Account</Text>
              <Text style={styles.cardSub}>Start your journey as a TheraCare therapist</Text>
              <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor={C.muted} value={fullName} onChangeText={setFullName} />
              <TextInput placeholder="Email" style={styles.input} placeholderTextColor={C.muted} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              <TextInput placeholder="Password (min 6 characters)" style={styles.input} placeholderTextColor={C.muted} secureTextEntry value={password} onChangeText={setPassword} />
              <TextInput placeholder="Confirm Password" style={styles.input} placeholderTextColor={C.muted} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <Text style={styles.cardTitle}>Professional Info</Text>
              <Text style={styles.cardSub}>Tell us about your expertise</Text>

              <TextInput placeholder="Professional Title (e.g. Licensed Clinical Psychologist)" style={styles.input} placeholderTextColor={C.muted} value={title} onChangeText={setTitle} />

              {/* Experience Dropdown */}
              <Text style={styles.inputLabel}>Years of Experience *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setShowExpDropdown(!showExpDropdown)}
              >
                <Text style={styles.dropdownBtnText}>
                  {experience || "Select years of experience..."}
                </Text>
                <Text style={styles.dropdownArrow}>{showExpDropdown ? "▲" : "▼"}</Text>
              </TouchableOpacity>
              {showExpDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                    {EXPERIENCE_OPTIONS.map(exp => (
                      <TouchableOpacity
                        key={exp}
                        onPress={() => { setExperience(exp); setShowExpDropdown(false); }}
                        style={[styles.dropdownItem, experience === exp && styles.dropdownItemActive]}
                      >
                        <Text style={[styles.dropdownItemText, experience === exp && styles.dropdownItemTextActive]}>
                          {experience === exp ? "✓  " : "    "}{exp}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Session Rate */}
              <Text style={styles.inputLabel}>Session Rate (KES)</Text>
              <View style={styles.rateRow}>
                <TextInput
                  placeholder="e.g. 8500"
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  value={sessionRate}
                  onChangeText={setSessionRate}
                />
                <View style={styles.rateToggle}>
                  {["per session", "per hour"].map(opt => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setRateType(opt)}
                      style={[styles.rateBtn, rateType === opt && styles.rateBtnActive]}
                    >
                      <Text style={[styles.rateBtnText, rateType === opt && styles.rateBtnTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                placeholder="Bio — tell clients about yourself..."
                style={[styles.input, styles.inputMultiline, { marginTop: 12 }]}
                placeholderTextColor={C.muted}
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />

              {/* Specialties Dropdown */}
              <Text style={styles.specsLabel}>Specialties *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownBtnText}>
                  {selectedSpecs.length > 0 ? `${selectedSpecs.length} selected` : "Select specialties..."}
                </Text>
                <Text style={styles.dropdownArrow}>{showDropdown ? "▲" : "▼"}</Text>
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {SPECIALTIES.map(s => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => toggleSpec(s)}
                        style={[styles.dropdownItem, selectedSpecs.includes(s) && styles.dropdownItemActive]}
                      >
                        <Text style={[styles.dropdownItemText, selectedSpecs.includes(s) && styles.dropdownItemTextActive]}>
                          {selectedSpecs.includes(s) ? "✓  " : "    "}{s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              {selectedSpecs.length > 0 && (
                <View style={styles.specsTags}>
                  {selectedSpecs.map(s => (
                    <TouchableOpacity key={s} onPress={() => toggleSpec(s)} style={styles.specTagActive}>
                      <Text style={styles.specTagTextActive}>{s} ✕</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>Upload Certificates</Text>
              <Text style={styles.cardSub}>We verify all therapists to ensure client safety.</Text>
              <View style={styles.certsInfo}>
                <Text style={styles.certsInfoText}>🔒 Your documents are encrypted and only reviewed by our verification team.</Text>
              </View>
              {CERT_TYPES.map(cert => {
                const uploaded = uploadedCerts.includes(cert.id);
                return (
                  <TouchableOpacity
                    key={cert.id}
                    style={[styles.certItem, uploaded && styles.certItemUploaded]}
                    onPress={() => uploadCert(cert.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.certIcon}>{cert.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.certLabel}>{cert.label}</Text>
                      <Text style={styles.certStatus}>
                        {uploaded ? `✅ ${uploadedFiles[cert.id] || "Uploaded"}` : "Tap to upload"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 20 }}>{uploaded ? "✅" : "⬆️"}</Text>
                  </TouchableOpacity>
                );
              })}
              <View style={styles.certsProgress}>
                <Text style={styles.certsProgressText}>
                  {uploadedCerts.length} of {CERT_TYPES.length} documents uploaded
                </Text>
                <View style={styles.certsProgressTrack}>
                  <View style={[styles.certsProgressFill, { width: `${(uploadedCerts.length / CERT_TYPES.length) * 100}%` }]} />
                </View>
              </View>
            </>
          )}

          <View style={styles.navRow}>
            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(s => s - 1)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleSignup} style={[styles.submitBtn, { flex: step > 1 ? 3 : 1 }]} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>{step === 3 ? "Submit Application" : "Continue →"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => { setIsSignup(false); setStep(1); }}>
            <Text style={styles.toggleText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:              { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: C.bg },
  logoWrap:               { alignItems: "center", marginBottom: 32 },
  logoSub:                { fontSize: 13, color: C.muted, marginTop: 6, fontWeight: "600", letterSpacing: 1 },
  card:                   { width: "100%", backgroundColor: C.white, borderRadius: 24, padding: 24, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardTitle:              { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 6 },
  cardSub:                { fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 20 },
  input:                  { backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1.5, borderColor: C.border, marginBottom: 12 },
  inputMultiline:         { minHeight: 100 },
  inputLabel:             { fontSize: 13, fontWeight: "600", color: C.text, marginBottom: 6 },
  rateRow:                { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 0 },
  rateToggle:             { gap: 6 },
  rateBtn:                { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: C.primaryLight, borderWidth: 1.5, borderColor: C.border },
  rateBtnActive:          { backgroundColor: C.primary, borderColor: C.primary },
  rateBtnText:            { fontSize: 11, fontWeight: "600", color: C.muted },
  rateBtnTextActive:      { color: C.white },
  specsLabel:             { fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 8, marginTop: 4 },
  dropdownBtn:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: C.border, marginBottom: 6 },
  dropdownBtnText:        { fontSize: 14, color: C.text },
  dropdownArrow:          { fontSize: 12, color: C.muted },
  dropdown:               { backgroundColor: C.white, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, marginBottom: 12, overflow: "hidden" },
  dropdownItem:           { padding: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  dropdownItemActive:     { backgroundColor: C.primaryLight },
  dropdownItemText:       { fontSize: 14, color: C.text },
  dropdownItemTextActive: { color: C.primary, fontWeight: "700" },
  specsTags:              { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  specTagActive:          { backgroundColor: C.primary, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  specTagTextActive:      { fontSize: 12, fontWeight: "600", color: C.white },
  submitBtn:              { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8, marginBottom: 12, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  submitBtnText:          { fontSize: 16, fontWeight: "700", color: C.white },
  toggleText:             { color: C.purple, textAlign: "center", fontSize: 14, fontWeight: "600", marginTop: 4 },
  stepsRow:               { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  stepItem:               { alignItems: "center", flexDirection: "row", gap: 6 },
  stepCircle:             { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: C.border },
  stepCircleActive:       { backgroundColor: C.primary, borderColor: C.primary },
  stepNum:                { fontSize: 13, fontWeight: "700", color: C.muted },
  stepNumActive:          { color: C.white },
  stepLabel:              { fontSize: 11, color: C.muted, fontWeight: "600" },
  stepLabelActive:        { color: C.primary },
  stepLine:               { width: 24, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  stepLineActive:         { backgroundColor: C.primary },
  certsInfo:              { backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, marginBottom: 16 },
  certsInfoText:          { fontSize: 13, color: C.primary, fontWeight: "600", lineHeight: 20 },
  certItem:               { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.bg, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  certItemUploaded:       { borderColor: C.green, backgroundColor: "#F0FDF4" },
  certIcon:               { fontSize: 28 },
  certLabel:              { fontSize: 14, fontWeight: "700", color: C.text },
  certStatus:             { fontSize: 12, color: C.muted, marginTop: 2 },
  certsProgress:          { marginTop: 8, marginBottom: 16 },
  certsProgressText:      { fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: "600" },
  certsProgressTrack:     { height: 6, backgroundColor: C.primaryLight, borderRadius: 99, overflow: "hidden" },
  certsProgressFill:      { height: 6, backgroundColor: C.primary, borderRadius: 99 },
  navRow:                 { flexDirection: "row", gap: 10, marginTop: 8 },
  backBtn:                { flex: 1, padding: 16, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, alignItems: "center" },
  backBtnText:            { fontSize: 15, fontWeight: "600", color: C.muted },
  successCard:            { width: "100%", backgroundColor: C.white, borderRadius: 24, padding: 28, alignItems: "center" },
  successEmoji:           { fontSize: 72, marginBottom: 16 },
  successTitle:           { fontSize: 26, fontWeight: "800", color: C.text, marginBottom: 12, textAlign: "center" },
  successSub:             { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  pendingBadge:           { backgroundColor: "#FEF3C7", borderRadius: 99, paddingHorizontal: 20, paddingVertical: 8, marginBottom: 24 },
  pendingBadgeText:       { fontSize: 14, fontWeight: "700", color: C.yellow },
  successSteps:           { width: "100%", gap: 12, marginBottom: 28 },
  successStep:            { flexDirection: "row", alignItems: "center", gap: 12 },
  successStepIcon:        { fontSize: 20 },
  successStepText:        { fontSize: 14, color: C.text, fontWeight: "600" },
  goToDashBtn:            { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 },
  goToDashBtnText:        { fontSize: 16, fontWeight: "700", color: C.white },
});