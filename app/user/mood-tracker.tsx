import { useRouter } from "expo-router";
import { useState } from "react";
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
  primary: "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid: "#DDD6FE",
  accent: "#A78BFA",
  green: "#2EC27E",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#FAF8FF",
  white: "#FFFFFF",
  border: "#F0EEFF",
};

const MOODS = [
  { label: "Awful", emoji: "😔", value: 1, color: "#EF4444" },
  { label: "Bad", emoji: "😕", value: 2, color: "#F97316" },
  { label: "Okay", emoji: "😐", value: 3, color: "#EAB308" },
  { label: "Good", emoji: "🙂", value: 4, color: "#22C55E" },
  { label: "Amazing", emoji: "😄", value: 5, color: "#7C3AED" },
];

const FEELINGS = [
  "Anxious",
  "Calm",
  "Sad",
  "Happy",
  "Angry",
  "Grateful",
  "Lonely",
  "Hopeful",
  "Tired",
  "Motivated",
  "Overwhelmed",
  "Peaceful",
  "Frustrated",
  "Loved",
  "Confused",
];

const WEEK_DATA = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 3 },
  { day: "Sun", mood: 4 },
];

const HISTORY = [
  {
    date: "Today, 8:00 AM",
    mood: 5,
    feelings: ["Motivated", "Grateful"],
    note: "Woke up feeling refreshed. Ready for the day!",
  },
  {
    date: "Yesterday, 9:30 PM",
    mood: 3,
    feelings: ["Tired", "Calm"],
    note: "Long day but managed to wind down.",
  },
  {
    date: "Mon, 7:45 AM",
    mood: 2,
    feelings: ["Anxious", "Overwhelmed"],
    note: "Feeling a bit stressed about work.",
  },
];

export default function MoodTracker() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"log" | "history">("log");

  const toggleFeeling = (f: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    setSaved(true);
    setTimeout(() => {
      router.replace("/user/home");
    }, 2500);
  };

  const avgMood = (
    WEEK_DATA.reduce((a, b) => a + b.mood, 0) / WEEK_DATA.length
  ).toFixed(1);
  const topMood = MOODS.find((m) => m.value === Math.round(Number(avgMood)));
  const maxBarHeight = 44;

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
        <Text style={styles.navTitle}>Mood Tracker</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* WEEKLY SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryWeekLabel}>THIS WEEK</Text>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryMood}>
                {topMood?.emoji} {topMood?.label}
              </Text>
              <Text style={styles.summaryAvg}>Average mood: {avgMood}/5</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.streakNum}>7</Text>
              <Text style={styles.streakLabel}>day streak 🔥</Text>
            </View>
          </View>

          {/* Mini bar chart */}
          <View style={styles.barChart}>
            {WEEK_DATA.map((d, i) => {
              const isToday = i === WEEK_DATA.length - 1;
              const barH = (d.mood / 5) * maxBarHeight;
              return (
                <View key={d.day} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barH,
                        backgroundColor: isToday
                          ? C.white
                          : "rgba(255,255,255,0.35)",
                      },
                    ]}
                  />
                  <Text style={styles.barDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {(["log", "history"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === "log" ? "Log Mood" : "History"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LOG TAB */}
        {tab === "log" && (
          <>
            {/* How are you feeling */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>How are you feeling?</Text>
              <Text style={styles.cardSub}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <View style={styles.moodRow}>
                {MOODS.map((m) => (
                  <TouchableOpacity
                    key={m.value}
                    onPress={() => setSelectedMood(m.value)}
                    style={[
                      styles.moodBtn,
                      selectedMood === m.value && {
                        borderColor: m.color,
                        borderWidth: 2,
                        backgroundColor: `${m.color}12`,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        selectedMood === m.value && {
                          color: m.color,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Feelings */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>What&apos;s contributing?</Text>
              <Text style={styles.cardSub}>Select all that apply</Text>
              <View style={styles.feelingTags}>
                {FEELINGS.map((f) => {
                  const selected = selectedFeelings.includes(f);
                  return (
                    <TouchableOpacity
                      key={f}
                      onPress={() => toggleFeeling(f)}
                      style={[
                        styles.feelingTag,
                        selected && styles.feelingTagActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.feelingTagText,
                          selected && styles.feelingTagTextActive,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Note */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add a note</Text>
              <Text style={styles.cardSub}>
                Optional — what&apos;s on your mind?
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Write anything you'd like to remember about today..."
                placeholderTextColor={C.muted}
                multiline
                numberOfLines={4}
                style={styles.noteInput}
              />
            </View>

            {/* Save button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!selectedMood}
              style={[
                styles.saveBtn,
                !selectedMood && styles.saveBtnDisabled,
                saved && styles.saveBtnSaved,
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {saved
                  ? "✓ Mood Logged! Taking you home..."
                  : "Save & Continue"}
              </Text>
            </TouchableOpacity>

            {saved && (
              <Text style={styles.savedConfirm}>
                🎉 Keep it up — consistency is key to better mental health!
              </Text>
            )}
          </>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <>
            {HISTORY.map((entry, i) => {
              const mood = MOODS.find((m) => m.value === entry.mood)!;
              return (
                <View key={i} style={styles.historyCard}>
                  <View style={styles.historyTop}>
                    <Text style={styles.historyDate}>{entry.date}</Text>
                    <View
                      style={[
                        styles.historyMoodBadge,
                        { backgroundColor: `${mood.color}15` },
                      ]}
                    >
                      <Text style={styles.historyMoodEmoji}>{mood.emoji}</Text>
                      <Text
                        style={[styles.historyMoodLabel, { color: mood.color }]}
                      >
                        {mood.label}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyTags}>
                    {entry.feelings.map((f) => (
                      <View key={f} style={styles.historyTag}>
                        <Text style={styles.historyTagText}>{f}</Text>
                      </View>
                    ))}
                  </View>
                  {entry.note && (
                    <View style={styles.historyNoteWrap}>
                      <Text style={styles.historyNote}>“{entry.note}”</Text>
                    </View>
                  )}
                </View>
              );
            })}
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
  navTitle: { fontSize: 13, color: C.muted },
  scroll: { padding: 16, paddingBottom: 80 },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    backgroundColor: C.primary,
  },
  summaryWeekLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryMood: { fontSize: 24, fontWeight: "800", color: C.white },
  summaryAvg: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  streakNum: { fontSize: 28, fontWeight: "800", color: C.white },
  streakLabel: { fontSize: 12, color: "rgba(255,255,255,0.75)" },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 60,
  },
  barCol: { flex: 1, alignItems: "center", gap: 4, justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 4 },
  barDay: { fontSize: 9, color: "rgba(255,255,255,0.7)" },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive: { color: C.white },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: C.muted, marginBottom: 16 },
  moodRow: { flexDirection: "row", gap: 6 },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: C.primaryLight,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodEmoji: { fontSize: 22, marginBottom: 4 },
  moodLabel: { fontSize: 10, color: C.muted, fontWeight: "600" },
  feelingTags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  feelingTag: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  feelingTagActive: { backgroundColor: C.primary },
  feelingTagText: { fontSize: 13, fontWeight: "600", color: C.primary },
  feelingTagTextActive: { color: C.white },
  noteInput: {
    backgroundColor: C.primaryLight,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: C.text,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  saveBtn: {
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnDisabled: {
    backgroundColor: "#E5E5E5",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnSaved: { backgroundColor: C.green },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
  savedConfirm: {
    textAlign: "center",
    fontSize: 13,
    color: C.green,
    fontWeight: "600",
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyDate: { fontSize: 13, color: C.muted },
  historyMoodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  historyMoodEmoji: { fontSize: 16 },
  historyMoodLabel: { fontSize: 13, fontWeight: "700" },
  historyTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  historyTag: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  historyTagText: { fontSize: 12, fontWeight: "600", color: C.primary },
  historyNoteWrap: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  historyNote: { fontSize: 14, color: "#555", lineHeight: 21 },
});
