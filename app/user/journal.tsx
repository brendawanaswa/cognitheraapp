import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

type Entry = {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
};

const MOODS = ["😔", "😕", "😐", "🙂", "😄"];

const PROMPTS = [
  "What made you smile today?",
  "What's been weighing on your mind lately?",
  "What are you grateful for right now?",
  "Describe a challenge you faced and how you handled it.",
  "What do you need more of in your life?",
  "Write a letter to your future self.",
  "What boundaries do you need to set?",
  "What would make tomorrow better than today?",
];

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function getShortDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function Journal() {
  const router = useRouter();
  const [entries, setEntries]       = useState<Entry[]>([]);
  const [modalOpen, setModalOpen]   = useState(false);
  const [viewing, setViewing]       = useState<Entry | null>(null);
  const [title, setTitle]           = useState("");
  const [content, setContent]       = useState("");
  const [selectedMood, setMood]     = useState("");
  const [prompt, setPrompt]         = useState("");
  const [tab, setTab]               = useState<"entries" | "new">("entries");

  useEffect(() => {
    loadEntries();
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const loadEntries = async () => {
    const saved = await AsyncStorage.getItem("journal_entries");
    if (saved) setEntries(JSON.parse(saved));
  };

  const saveEntry = async () => {
    if (!title.trim() || !content.trim()) return;
    const newEntry: Entry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: getShortDate(),
      mood: selectedMood || "😐",
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(updated));
    setTitle("");
    setContent("");
    setMood("");
    setTab("entries");
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem("journal_entries", JSON.stringify(updated));
    setViewing(null);
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
        <Text style={styles.navTitle}>Journal</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["entries", "new"] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "entries" ? "My Entries" : "✏️ New Entry"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ENTRIES TAB */}
      {tab === "entries" && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.entriesHeader}>
            <Text style={styles.entriesTitle}>Your Journal</Text>
            <Text style={styles.entriesCount}>{entries.length} entries</Text>
          </View>

          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📓</Text>
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptySub}>Start writing your first journal entry today!</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setTab("new")}
              >
                <Text style={styles.emptyBtnText}>Write First Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            entries.map(entry => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => setViewing(entry)}
                activeOpacity={0.85}
              >
                <View style={styles.entryCardTop}>
                  <Text style={styles.entryMood}>{entry.mood}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                </View>
                <Text style={styles.entryPreview} numberOfLines={2}>{entry.content}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* NEW ENTRY TAB */}
      {tab === "new" && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Date */}
          <Text style={styles.newDate}>{getDate()}</Text>

          {/* Writing prompt */}
          <TouchableOpacity
            style={styles.promptCard}
            onPress={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}
            activeOpacity={0.8}
          >
            <Text style={styles.promptLabel}>💡 Writing Prompt — tap to change</Text>
            <Text style={styles.promptText}>{prompt}</Text>
          </TouchableOpacity>

          {/* Mood selector */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How are you feeling?</Text>
            <View style={styles.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMood(m)}
                  style={[styles.moodBtn, selectedMood === m && styles.moodBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Give your entry a title..."
              placeholderTextColor={C.muted}
              style={styles.titleInput}
            />
          </View>

          {/* Content */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Write freely...</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind today? This is your safe space..."
              placeholderTextColor={C.muted}
              multiline
              numberOfLines={8}
              style={styles.contentInput}
              textAlignVertical="top"
            />
            <Text style={styles.wordCount}>{content.split(" ").filter(w => w).length} words</Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={saveEntry}
            disabled={!title.trim() || !content.trim()}
            style={[styles.saveBtn, (!title.trim() || !content.trim()) && styles.saveBtnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Save Entry 📓</Text>
          </TouchableOpacity>

        </ScrollView>
      )}

      {/* VIEW ENTRY MODAL */}
      <Modal
        visible={!!viewing}
        animationType="slide"
        onRequestClose={() => setViewing(null)}
      >
        {viewing && (
          <SafeAreaView style={styles.safe}>
            <View style={styles.nav}>
              <TouchableOpacity onPress={() => setViewing(null)}>
                <Text style={styles.navBack}>←</Text>
              </TouchableOpacity>
              <Text style={styles.navTitle}>Journal Entry</Text>
              <TouchableOpacity onPress={() => deleteEntry(viewing.id)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
              <View style={styles.viewHeader}>
                <Text style={styles.viewMood}>{viewing.mood}</Text>
                <View>
                  <Text style={styles.viewTitle}>{viewing.title}</Text>
                  <Text style={styles.viewDate}>{viewing.date}</Text>
                </View>
              </View>
              <View style={styles.viewContent}>
                <Text style={styles.viewText}>{viewing.content}</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.bg },
  nav:              { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:          { fontSize: 22, color: C.muted },
  navLogo:          { fontSize: 20, fontWeight: "800", color: C.primary },
  navTitle:         { fontSize: 13, color: C.muted },
  deleteBtn:        { fontSize: 20 },
  tabs:             { flexDirection: "row", gap: 8, padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  tab:              { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg },
  tabActive:        { backgroundColor: C.primary, borderColor: C.primary },
  tabText:          { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive:    { color: C.white },
  scroll:           { padding: 16, paddingBottom: 80 },

  // Entries
  entriesHeader:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  entriesTitle:     { fontSize: 20, fontWeight: "800", color: C.text },
  entriesCount:     { fontSize: 13, color: C.muted, fontWeight: "600" },
  entryCard:        { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  entryCardTop:     { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  entryMood:        { fontSize: 28 },
  entryTitle:       { fontSize: 15, fontWeight: "800", color: C.text },
  entryDate:        { fontSize: 12, color: C.muted, marginTop: 2 },
  entryPreview:     { fontSize: 14, color: "#555", lineHeight: 20 },

  // Empty state
  emptyState:       { alignItems: "center", paddingTop: 60 },
  emptyEmoji:       { fontSize: 64, marginBottom: 16 },
  emptyTitle:       { fontSize: 20, fontWeight: "800", color: C.text, marginBottom: 8 },
  emptySub:         { fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 24 },
  emptyBtn:         { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  emptyBtnText:     { fontSize: 15, fontWeight: "700", color: C.white },

  // New entry
  newDate:          { fontSize: 13, color: C.muted, marginBottom: 16, fontWeight: "600" },
  promptCard:       { backgroundColor: C.primaryLight, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: C.primaryMid },
  promptLabel:      { fontSize: 11, color: C.accent, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" },
  promptText:       { fontSize: 15, color: C.primary, fontWeight: "600", lineHeight: 22 },
  card:             { backgroundColor: C.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  cardTitle:        { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 14 },
  moodRow:          { flexDirection: "row", justifyContent: "space-between" },
  moodBtn:          { width: 52, height: 52, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "transparent" },
  moodBtnActive:    { borderColor: C.primary, backgroundColor: C.primaryMid },
  moodEmoji:        { fontSize: 26 },
  titleInput:       { backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1.5, borderColor: C.border },
  contentInput:     { backgroundColor: C.primaryLight, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, minHeight: 160, borderWidth: 1.5, borderColor: C.border },
  wordCount:        { fontSize: 12, color: C.muted, textAlign: "right", marginTop: 8 },
  saveBtn:          { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 18, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  saveBtnDisabled:  { backgroundColor: "#E5E5E5", shadowOpacity: 0, elevation: 0 },
  saveBtnText:      { fontSize: 16, fontWeight: "700", color: C.white },

  // View entry
  viewHeader:       { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  viewMood:         { fontSize: 48 },
  viewTitle:        { fontSize: 22, fontWeight: "800", color: C.text },
  viewDate:         { fontSize: 13, color: C.muted, marginTop: 4 },
  viewContent:      { backgroundColor: C.white, borderRadius: 20, padding: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  viewText:         { fontSize: 16, color: C.text, lineHeight: 26 },
});