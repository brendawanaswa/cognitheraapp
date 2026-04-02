import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  primary: "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid: "#DDD6FE",
  accent: "#A78BFA",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#FAF8FF",
  white: "#FFFFFF",
  border: "#F0EEFF",
};

const questions = [
  {
    id: "age",
    title: "How old are you?",
    subtitle: "This helps us find therapists experienced with your life stage.",
    type: "single",
    options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"],
    emoji: "🎂",
  },
  {
    id: "gender",
    title: "How do you identify?",
    subtitle: "We want to make sure you feel seen and supported.",
    type: "single",
    options: ["Male", "Female", "Non-binary", "Prefer not to say", "Other"],
    emoji: "🌈",
  },
  {
    id: "concerns",
    title: "What brings you here today?",
    subtitle: "Select all that apply — there's no wrong answer.",
    type: "multi",
    options: [
      "Anxiety",
      "Depression",
      "Stress",
      "Relationship issues",
      "Grief & loss",
      "Trauma",
      "Self-esteem",
      "Family conflict",
      "Sleep problems",
      "Loneliness",
    ],
    emoji: "💭",
  },
  {
    id: "religion",
    title: "Does faith or spirituality play a role in your life?",
    subtitle:
      "We can match you with therapists who understand your background.",
    type: "single",
    options: [
      "Christianity",
      "Islam",
      "Hinduism",
      "Buddhism",
      "Judaism",
      "Other faith",
      "Secular / No preference",
    ],
    emoji: "🕊️",
  },
  {
    id: "therapist_gender",
    title: "Do you have a preference for your therapist's gender?",
    subtitle: "Comfort matters. Choose what feels right for you.",
    type: "single",
    options: ["Male", "Female", "Non-binary", "No preference"],
    emoji: "🤝",
  },
  {
    id: "session_type",
    title: "How would you like to connect with your therapist?",
    subtitle: "Pick your preferred format.",
    type: "single",
    options: ["Video call", "Voice call", "Text / Chat", "Any format works"],
    emoji: "📱",
  },
  {
    id: "experience",
    title: "Have you been to therapy before?",
    subtitle: "This helps us personalize your experience.",
    type: "single",
    options: [
      "Yes, regularly",
      "Yes, a few times",
      "No, this is my first time",
    ],
    emoji: "🌱",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [completed, setCompleted] = useState(false);

  const q = questions[current];
  const progress = current / questions.length;

  const toggle = (option: string) => {
    if (q.type === "single") {
      setAnswers((prev) => ({ ...prev, [q.id]: option }));
    } else {
      setAnswers((prev) => {
        const existing = (prev[q.id] as string[]) || [];
        return {
          ...prev,
          [q.id]: existing.includes(option)
            ? existing.filter((o) => o !== option)
            : [...existing, option],
        };
      });
    }
  };

  const isSelected = (option: string) => {
    const val = answers[q.id];
    if (!val) return false;
    return Array.isArray(val) ? val.includes(option) : val === option;
  };

  const canProceed = () => {
    const val = answers[q.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  };

  const next = () => {
    if (!canProceed()) return;
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setCompleted(true);
    }
  };

  const back = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  // ── COMPLETION SCREEN ──
  if (completed) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.completionScroll}>
          <Text style={styles.completionEmoji}>🌟</Text>
          <Text style={styles.completionTitle}>
            You&apos;re all set, welcome to TheraCare!
          </Text>
          <Text style={styles.completionSub}>
            We&apos;re finding therapists that match your needs. This usually
            takes just a moment.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>YOUR SUMMARY</Text>
            {Object.entries(answers).map(([key, val]) => (
              <View key={key} style={styles.summaryRow}>
                <Text style={styles.summaryKey}>{key.replace("_", " ")}</Text>
                <Text style={styles.summaryVal}>
                  {Array.isArray(val) ? val.join(", ") : val}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.matchBtn}
            onPress={async () => {
              await AsyncStorage.setItem("onboarding_complete", "true");
              router.replace("/user/mood-tracker");
            }}
          >
            <Text style={styles.matchBtnText}>Get Started 🎉</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUESTION SCREEN ──
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>
            thera<Text style={{ color: C.text }}>care</Text>
          </Text>
          <Text style={styles.counter}>
            {current + 1} / {questions.length}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emojiBox}>
          <Text style={styles.emojiText}>{q.emoji}</Text>
        </View>

        <Text style={styles.questionTitle}>{q.title}</Text>
        <Text style={styles.questionSub}>{q.subtitle}</Text>

        {q.type === "multi" && (
          <View style={styles.multiTag}>
            <Text style={styles.multiTagText}>Select all that apply</Text>
          </View>
        )}

        <View
          style={[
            styles.optionsGrid,
            q.options.length > 5 && styles.optionsGridTwo,
          ]}
        >
          {q.options.map((option) => {
            const selected = isSelected(option);
            return (
              <TouchableOpacity
                key={option}
                onPress={() => toggle(option)}
                style={[styles.option, selected && styles.optionSelected]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={[styles.navRow, { paddingBottom: insets.bottom + 16 }]}>
        {current > 0 && (
          <TouchableOpacity onPress={back} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={next}
          disabled={!canProceed()}
          style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {current === questions.length - 1 ? "Complete ✓" : "Continue →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.white,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: { fontSize: 20, fontWeight: "800", color: C.primary },
  counter: { fontSize: 13, color: C.muted },
  progressTrack: {
    height: 6,
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: C.primary, borderRadius: 99 },
  scroll: { padding: 24, paddingBottom: 40 },
  emojiBox: {
    width: 64,
    height: 64,
    backgroundColor: C.primaryLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emojiText: { fontSize: 30 },
  questionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  questionSub: {
    fontSize: 15,
    color: C.muted,
    lineHeight: 22,
    marginBottom: 8,
  },
  multiTag: {
    alignSelf: "flex-start",
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  multiTagText: { fontSize: 12, color: C.primary, fontWeight: "600" },
  optionsGrid: { flexDirection: "column", gap: 10, marginTop: 16 },
  optionsGridTwo: { flexDirection: "row", flexWrap: "wrap" },
  option: {
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },
  optionSelected: { backgroundColor: C.primary, borderColor: C.primary },
  optionText: { fontSize: 14, fontWeight: "500", color: C.text },
  optionTextSelected: { color: C.white, fontWeight: "700" },
  navRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  backBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 14,
    alignItems: "center",
  },
  backBtnText: { fontSize: 15, fontWeight: "600", color: C.muted },
  nextBtn: {
    flex: 3,
    padding: 16,
    backgroundColor: C.primary,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnDisabled: {
    backgroundColor: "#E5E5E5",
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: { fontSize: 15, fontWeight: "700", color: C.white },
  completionScroll: { padding: 24, alignItems: "center", paddingBottom: 60 },
  completionEmoji: { fontSize: 72, marginBottom: 24, marginTop: 40 },
  completionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 36,
  },
  completionSub: {
    fontSize: 15,
    color: C.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 32,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.accent,
    letterSpacing: 1,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  summaryKey: { fontSize: 14, color: C.muted, textTransform: "capitalize" },
  summaryVal: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  matchBtn: {
    backgroundColor: C.primary,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  matchBtnText: { fontSize: 16, fontWeight: "700", color: C.white },
});
