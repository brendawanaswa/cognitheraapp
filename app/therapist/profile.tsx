import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
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
  green: "#2EC27E",
  yellow: "#F59E0B",
  red: "#EF4444",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#F0FDFA",
  white: "#FFFFFF",
  border: "#CCFBF1",
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

const SESSION_TYPES = ["Video call", "Voice call", "Text / Chat"];

const LANGUAGES = ["English", "Swahili", "French", "Arabic", "Spanish"];

const CERT_TYPES = [
  { id: "degree", label: "Degree Certificate", icon: "🎓" },
  { id: "license", label: "Professional License", icon: "📜" },
  { id: "id", label: "National ID / Passport", icon: "🪪" },
  { id: "insurance", label: "Professional Insurance", icon: "🛡️" },
];

export default function TherapistProfile() {
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "availability" | "certs">(
    "profile",
  );
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [therapistName, setTherapistName] = useState("Amara Osei");
  const [verified, setVerified] = useState("pending");

  // Profile fields
  const [name, setName] = useState("Dr. Amara Osei");
  const [title, setTitle] = useState("Licensed Clinical Psychologist");
  const [bio, setBio] = useState(
    "I'm a warm, compassionate therapist who believes healing happens when you feel truly heard. My approach blends cognitive-behavioral therapy with mindfulness practices.",
  );
  const [experience, setExperience] = useState("11");
  const [rate, setRate] = useState("8500");
  const [selectedSpecs, setSpecs] = useState([
    "Anxiety & Panic",
    "Depression",
    "Trauma & PTSD",
  ]);
  const [selectedSessions, setSessions] = useState([
    "Video call",
    "Voice call",
  ]);
  const [selectedLangs, setLangs] = useState(["English", "Swahili"]);

  // Availability
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: false,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Certs
  const [uploadedCerts, setUploadedCerts] = useState(["degree", "license"]);

  useEffect(() => {
    AsyncStorage.getItem("therapist_name").then((n) => {
      if (n) setTherapistName(n.split(" ")[0]);
    });
    AsyncStorage.getItem("therapist_verified").then((v) => {
      if (v) setVerified(v);
    });
  }, []);

  const toggleSpec = (s: string) =>
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleSession = (s: string) =>
    setSessions((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleLang = (l: string) =>
    setLangs((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );

  const toggleDay = (day: string) =>
    setAvailability((prev) => ({ ...prev, [day]: !prev[day] }));

  const uploadCert = (certId: string) => {
    if (!uploadedCerts.includes(certId)) {
      setUploadedCerts((prev) => [...prev, certId]);
    }
  };

  const [error, setError] = useState("");

  const isFormValid = () => {
    if (!name.trim() || !title.trim() || !bio.trim()) return false;
    const expNumber = Number(experience);
    const rateNumber = Number(rate);
    if (!Number.isFinite(expNumber) || expNumber <= 0) return false;
    if (!Number.isFinite(rateNumber) || rateNumber <= 0) return false;
    if (selectedSpecs.length === 0) return false;
    if (selectedSessions.length === 0) return false;
    if (selectedLangs.length === 0) return false;
    return true;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter your professional title.");
      return;
    }
    if (!bio.trim()) {
      setError("Please enter your bio.");
      return;
    }
    const expNumber = Number(experience);
    if (!Number.isFinite(expNumber) || expNumber <= 0) {
      setError("Please enter a valid years of experience (number > 0).\n");
      return;
    }
    const rateNumber = Number(rate);
    if (!Number.isFinite(rateNumber) || rateNumber <= 0) {
      setError("Please enter a valid session rate (number > 0).\n");
      return;
    }
    if (selectedSpecs.length === 0) {
      setError("Please add at least one specialty.");
      return;
    }
    if (selectedSessions.length === 0) {
      setError("Please select at least one session type.");
      return;
    }
    if (selectedLangs.length === 0) {
      setError("Please select at least one language.");
      return;
    }

    setError("");
    await AsyncStorage.setItem("therapist_name", name);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

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
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>{editing ? "Cancel" : "✏️ Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{therapistName[0]}</Text>
          </View>
          {editing && (
            <TouchableOpacity style={styles.avatarEditBtn}>
              <Text style={styles.avatarEditIcon}>📷</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileTitle}>{title}</Text>
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
            {verified === "approved"
              ? "✅ Verified Therapist"
              : "🟡 Pending Verification"}
          </Text>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          {[
            { label: "Experience", value: experience + " yrs" },
            { label: "Rate", value: "KES " + parseInt(rate).toLocaleString() },
            { label: "Rating", value: "4.9 ⭐" },
          ].map((stat) => (
            <View key={stat.label} style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{stat.value}</Text>
              <Text style={styles.quickStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["profile", "availability", "certs"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "profile"
                ? "Profile"
                : t === "availability"
                  ? "Availability"
                  : "Certificates"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE TAB */}
        {tab === "profile" && (
          <>
            {/* Basic info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, !editing && styles.inputDisabled]}
                editable={editing}
                placeholderTextColor={C.muted}
              />

              <Text style={styles.inputLabel}>Professional Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={[styles.input, !editing && styles.inputDisabled]}
                editable={editing}
                placeholderTextColor={C.muted}
              />

              <Text style={styles.inputLabel}>Years of Experience</Text>
              <TextInput
                value={experience}
                onChangeText={setExperience}
                style={[styles.input, !editing && styles.inputDisabled]}
                editable={editing}
                keyboardType="numeric"
                placeholderTextColor={C.muted}
              />

              <Text style={styles.inputLabel}>Session Rate (KES)</Text>
              <TextInput
                value={rate}
                onChangeText={setRate}
                style={[styles.input, !editing && styles.inputDisabled]}
                editable={editing}
                keyboardType="numeric"
                placeholderTextColor={C.muted}
              />

              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={[
                  styles.input,
                  styles.inputMultiline,
                  !editing && styles.inputDisabled,
                ]}
                editable={editing}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={C.muted}
              />
            </View>

            {/* Specialties */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specialties</Text>
              <View style={styles.tags}>
                {SPECIALTIES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => editing && toggleSpec(s)}
                    style={[
                      styles.tag,
                      selectedSpecs.includes(s) && styles.tagActive,
                    ]}
                    activeOpacity={editing ? 0.8 : 1}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedSpecs.includes(s) && styles.tagTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Session types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Types</Text>
              <View style={styles.tags}>
                {SESSION_TYPES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => editing && toggleSession(s)}
                    style={[
                      styles.tag,
                      selectedSessions.includes(s) && styles.tagActive,
                    ]}
                    activeOpacity={editing ? 0.8 : 1}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedSessions.includes(s) && styles.tagTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Languages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.tags}>
                {LANGUAGES.map((l) => (
                  <TouchableOpacity
                    key={l}
                    onPress={() => editing && toggleLang(l)}
                    style={[
                      styles.tag,
                      selectedLangs.includes(l) && styles.tagActive,
                    ]}
                    activeOpacity={editing ? 0.8 : 1}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedLangs.includes(l) && styles.tagTextActive,
                      ]}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save button */}
            {editing && (
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  !isFormValid() && styles.saveBtnDisabled,
                ]}
                onPress={handleSave}
                activeOpacity={isFormValid() ? 0.85 : 1}
                disabled={!isFormValid()}
              >
                <Text style={styles.saveBtnText}>Save Changes ✓</Text>
              </TouchableOpacity>
            )}

            {error ? (
              <Text style={styles.errorMsg}>{error}</Text>
            ) : saved ? (
              <Text style={styles.savedMsg}>
                ✅ Profile updated successfully!
              </Text>
            ) : null}
          </>
        )}

        {/* AVAILABILITY TAB */}
        {tab === "availability" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Working Days</Text>
              <Text style={styles.sectionSub}>Tap to toggle availability</Text>
              {Object.entries(availability).map(([day, available]) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[styles.dayItem, available && styles.dayItemActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      available && styles.dayLabelActive,
                    ]}
                  >
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.dayToggle,
                      available && styles.dayToggleActive,
                    ]}
                  >
                    <Text style={styles.dayToggleText}>
                      {available ? "Available" : "Off"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Working Hours</Text>
              <View style={styles.hoursRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Start Time</Text>
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    style={styles.input}
                    placeholder="09:00"
                    placeholderTextColor={C.muted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>End Time</Text>
                  <TextInput
                    value={endTime}
                    onChangeText={setEndTime}
                    style={styles.input}
                    placeholder="17:00"
                    placeholderTextColor={C.muted}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>Save Availability ✓</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* CERTIFICATES TAB */}
        {tab === "certs" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Documents</Text>
              <Text style={styles.sectionSub}>
                Keep your certificates up to date to maintain your verified
                status.
              </Text>

              <View
                style={[
                  styles.verifyInfo,
                  {
                    backgroundColor:
                      verified === "approved" ? `${C.green}18` : "#FEF3C7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.verifyInfoText,
                    { color: verified === "approved" ? C.green : C.yellow },
                  ]}
                >
                  {verified === "approved"
                    ? "✅ All documents verified. Your profile is active."
                    : "🟡 Documents under review. We'll notify you within 24-48 hours."}
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
                        {uploaded
                          ? "✅ Uploaded & Verified"
                          : "⬆️ Tap to upload"}
                      </Text>
                    </View>
                    {uploaded ? (
                      <Text style={{ fontSize: 20 }}>✅</Text>
                    ) : (
                      <Text style={{ fontSize: 20 }}>⬆️</Text>
                    )}
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
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navBack: { fontSize: 22, color: C.muted },
  navLogo: { fontSize: 20, fontWeight: "800", color: C.primary },
  editBtn: { fontSize: 14, fontWeight: "700", color: C.primary },
  profileHeader: {
    backgroundColor: C.white,
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: C.primaryLight,
  },
  avatarText: { fontSize: 40, fontWeight: "800", color: C.white },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditIcon: { fontSize: 14 },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: C.primary,
    fontWeight: "600",
    marginBottom: 10,
  },
  verifiedBadge: {
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  verifiedText: { fontSize: 13, fontWeight: "700" },
  quickStats: { flexDirection: "row", gap: 20 },
  quickStat: { alignItems: "center" },
  quickStatValue: { fontSize: 16, fontWeight: "800", color: C.text },
  quickStatLabel: { fontSize: 11, color: C.muted, fontWeight: "600" },
  tabs: {
    flexDirection: "row",
    gap: 6,
    padding: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: "center",
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: 12, fontWeight: "600", color: C.muted },
  tabTextActive: { color: C.white },
  scroll: { padding: 16, paddingBottom: 80 },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  sectionSub: { fontSize: 13, color: C.muted, marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: C.text,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 14,
  },
  inputDisabled: {
    backgroundColor: C.bg,
    borderColor: "transparent",
    color: C.text,
  },
  inputMultiline: { minHeight: 100 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  tagActive: { backgroundColor: C.primary, borderColor: C.primary },
  tagText: { fontSize: 13, fontWeight: "600", color: C.primary },
  tagTextActive: { color: C.white },
  saveBtn: {
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
  saveBtnDisabled: { backgroundColor: C.border },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  errorMsg: {
    textAlign: "center",
    fontSize: 13,
    color: C.red,
    fontWeight: "700",
    marginBottom: 12,
  },
  savedMsg: {
    textAlign: "center",
    fontSize: 14,
    color: C.green,
    fontWeight: "600",
    marginBottom: 16,
  },
  hoursRow: { flexDirection: "row", gap: 12 },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  dayItemActive: {},
  dayLabel: { fontSize: 15, fontWeight: "600", color: C.muted },
  dayLabelActive: { color: C.text },
  dayToggle: {
    backgroundColor: "#F3F4F6",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  dayToggleActive: { backgroundColor: `${C.green}18` },
  dayToggleText: { fontSize: 13, fontWeight: "700", color: C.muted },
  verifyInfo: { borderRadius: 12, padding: 14, marginBottom: 16 },
  verifyInfoText: { fontSize: 13, fontWeight: "600", lineHeight: 20 },
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
  certsProgress: { marginTop: 8 },
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
});
