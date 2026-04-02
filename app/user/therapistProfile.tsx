import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  yellow:       "#F59E0B",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

const THERAPISTS: Record<string, any> = {
  "1": {
    name: "Dr. Amara Njeri",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety & Panic", "Depression", "Trauma & PTSD"],
    rating: 4.9,
    reviews: 124,
    price: "KES 8,500",
    experience: "11 years",
    available: true,
    sessions: ["Video call", "Voice call", "Text / Chat"],
    about: "I'm a warm, compassionate therapist who believes healing happens when you feel truly heard. My approach blends cognitive-behavioral therapy with mindfulness practices tailored to each individual.",
    education: "PhD Clinical Psychology, University of Nairobi",
    languages: ["English", "Swahili"],
    responseTime: "Within 2 hours",
  },
  "2": {
    name: "Dr. Kwame Otieno",
    title: "Counselling Psychologist",
    specialties: ["Relationships", "Grief & Loss", "Self-Esteem"],
    rating: 4.7,
    reviews: 89,
    price: "KES 7,500",
    experience: "8 years",
    available: true,
    sessions: ["Video call", "Text / Chat"],
    about: "I specialize in helping people navigate complex relationships and life transitions. I use an integrative approach combining person-centered therapy with practical coping strategies.",
    education: "MSc Counselling Psychology, Kenyatta University",
    languages: ["English", "Swahili", "Luo"],
    responseTime: "Within 3 hours",
  },
  "3": {
    name: "Dr. Zawadi Muthoni",
    title: "Cognitive Behavioral Therapist",
    specialties: ["Anxiety & Panic", "OCD", "Self-Esteem"],
    rating: 4.8,
    reviews: 97,
    price: "KES 9,000",
    experience: "10 years",
    available: false,
    sessions: ["Video call", "Voice call"],
    about: "I use evidence-based CBT techniques to help clients challenge negative thought patterns and build healthier mental habits. I'm passionate about making therapy accessible and practical.",
    education: "PhD Psychology, Strathmore University",
    languages: ["English", "Swahili", "Kikuyu"],
    responseTime: "Within 4 hours",
  },
  "4": {
    name: "Dr. Jabali Kamau",
    title: "Family & Marriage Therapist",
    specialties: ["Family Therapy", "Relationships", "Child & Adolescent"],
    rating: 4.6,
    reviews: 76,
    price: "KES 6,500",
    experience: "6 years",
    available: true,
    sessions: ["Video call", "Voice call", "Text / Chat"],
    about: "I work with families and couples to strengthen communication, resolve conflicts, and build lasting bonds. I believe every family has the capacity for healing and growth.",
    education: "MSc Family Therapy, USIU Africa",
    languages: ["English", "Swahili", "Kikuyu"],
    responseTime: "Within 2 hours",
  },
  "5": {
    name: "Dr. Imani Wanjiku",
    title: "Trauma & PTSD Specialist",
    specialties: ["Trauma & PTSD", "Depression", "Addiction"],
    rating: 4.9,
    reviews: 112,
    price: "KES 10,000",
    experience: "14 years",
    available: true,
    sessions: ["Video call", "Text / Chat"],
    about: "With over 14 years of experience, I specialize in trauma-informed care using EMDR and somatic therapy. I create a safe, non-judgmental space for deep healing and recovery.",
    education: "PhD Trauma Psychology, University of Nairobi",
    languages: ["English", "Swahili"],
    responseTime: "Within 1 hour",
  },
};

const REVIEWS = [
  { name: "Sarah M.",   rating: 5, text: "Dr. Njeri completely changed my life. I finally feel like myself again.",       date: "Feb 2025" },
  { name: "James K.",   rating: 5, text: "So understanding and professional. I look forward to every session.",           date: "Jan 2025" },
  { name: "Priya R.",   rating: 4, text: "Very knowledgeable and caring. Highly recommend to anyone struggling.",         date: "Jan 2025" },
  { name: "Michael T.", rating: 5, text: "Best decision I ever made. She has such a calming and reassuring presence.",    date: "Dec 2024" },
];

export default function TherapistProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = (params.id as string) || "1";
  const therapist = THERAPISTS[id] || THERAPISTS["1"];

  const [selectedSession, setSelectedSession] = useState(therapist.sessions[0]);
  const [booked, setBooked]                   = useState(false);
  const [bookModal, setBookModal]             = useState(false);

  const handleBook = () => {
  setBookModal(true);
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
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {therapist.name.split(" ")[1][0]}
            </Text>
          </View>
          <Text style={styles.name}>{therapist.name}</Text>
          <Text style={styles.title}>{therapist.title}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>⭐ {therapist.rating}</Text>
              <Text style={styles.statLabel}>{therapist.reviews} reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{therapist.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{therapist.price}</Text>
              <Text style={styles.statLabel}>Per session</Text>
            </View>
          </View>

          <View style={[
            styles.availableBadge,
            { backgroundColor: therapist.available ? `${C.green}18` : "#F3F4F6" }
          ]}>
            <Text style={[
              styles.availableText,
              { color: therapist.available ? C.green : C.muted }
            ]}>
              {therapist.available ? "✅ Available Now" : "⏳ Currently Busy"}
            </Text>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{therapist.about}</Text>
        </View>

        {/* DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          {[
            { icon: "🎓", label: "Education",      value: therapist.education },
            { icon: "🌍", label: "Languages",      value: therapist.languages.join(", ") },
            { icon: "⚡", label: "Response Time",  value: therapist.responseTime },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SPECIALTIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tags}>
            {therapist.specialties.map((s: string) => (
              <View key={s} style={styles.tag}>
                <Text style={styles.tagText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* BOOK SESSION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book a Session</Text>
          <Text style={styles.sectionSub}>Select your preferred session type</Text>
          <View style={styles.sessionTypes}>
            {therapist.sessions.map((s: string) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSelectedSession(s)}
                style={[styles.sessionBtn, selectedSession === s && styles.sessionBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.sessionIcon}>
                  {s === "Video call" ? "🎥" : s === "Voice call" ? "📞" : "💬"}
                </Text>
                <Text style={[styles.sessionText, selectedSession === s && styles.sessionTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleBook}
            style={[styles.bookBtn, booked && styles.bookBtnBooked]}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>
              {booked ? "✓ Session Booked!" : `Book ${selectedSession} — ${therapist.price}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* REVIEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {REVIEWS.map((review, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{review.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewRating}>{"⭐".repeat(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOOKING MODAL */}
      <Modal
        visible={bookModal}
        transparent
        animationType="slide"
        onRequestClose={() => setBookModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Session Booked!</Text>
            <Text style={styles.modalSub}>
              Your {selectedSession} session with {therapist.name} has been booked successfully!
            </Text>
            <Text style={styles.modalPrice}>{therapist.price}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setBookModal(false);
                setBooked(true);
              }}
            >
              <Text style={styles.modalBtnText}>Done ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.bg },
  nav:              { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:          { fontSize: 22, color: C.muted },
  navLogo:          { fontSize: 20, fontWeight: "800", color: C.primary },
  scroll:           { paddingBottom: 80 },
  profileHeader:    { backgroundColor: C.white, padding: 24, alignItems: "center", borderBottomWidth: 1, borderBottomColor: C.border },
  avatar:           { width: 90, height: 90, borderRadius: 45, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 3, borderColor: C.primaryMid },
  avatarText:       { fontSize: 40, fontWeight: "800", color: C.primary },
  name:             { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 4 },
  title:            { fontSize: 14, color: C.muted, marginBottom: 16 },
  statsRow:         { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  stat:             { alignItems: "center", paddingHorizontal: 16 },
  statValue:        { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 2 },
  statLabel:        { fontSize: 11, color: C.muted },
  statDivider:      { width: 1, height: 30, backgroundColor: C.border },
  availableBadge:   { borderRadius: 99, paddingHorizontal: 16, paddingVertical: 6 },
  availableText:    { fontSize: 13, fontWeight: "700" },
  section:          { backgroundColor: C.white, margin: 16, marginBottom: 0, borderRadius: 20, padding: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  sectionTitle:     { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 12 },
  sectionSub:       { fontSize: 13, color: C.muted, marginBottom: 14 },
  aboutText:        { fontSize: 14, color: C.text, lineHeight: 22 },
  detailRow:        { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  detailIcon:       { fontSize: 20, marginTop: 2 },
  detailLabel:      { fontSize: 12, color: C.muted, marginBottom: 2 },
  detailValue:      { fontSize: 14, fontWeight: "600", color: C.text },
  tags:             { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag:              { backgroundColor: C.primaryLight, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7 },
  tagText:          { fontSize: 12, fontWeight: "600", color: C.primary },
  sessionTypes:     { flexDirection: "row", gap: 10, marginBottom: 16 },
  sessionBtn:       { flex: 1, alignItems: "center", padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, gap: 6 },
  sessionBtnActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  sessionIcon:      { fontSize: 22 },
  sessionText:      { fontSize: 11, fontWeight: "600", color: C.muted, textAlign: "center" },
  sessionTextActive:{ color: C.primary },
  bookBtn:          { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  bookBtnBooked:    { backgroundColor: C.green },
  bookBtnText:      { fontSize: 15, fontWeight: "700", color: C.white },
  reviewCard:       { backgroundColor: C.bg, borderRadius: 14, padding: 14, marginBottom: 10 },
  reviewTop:        { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  reviewAvatar:     { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 14, fontWeight: "800", color: C.primary },
  reviewName:       { fontSize: 14, fontWeight: "700", color: C.text },
  reviewDate:       { fontSize: 11, color: C.muted },
  reviewRating:     { fontSize: 12 },
  reviewText:       { fontSize: 13, color: C.text, lineHeight: 20 },
  modalOverlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard:        { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, alignItems: "center" },
  modalEmoji:       { fontSize: 48, marginBottom: 12 },
  modalTitle:       { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 8 },
  modalSub:         { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20, marginBottom: 12 },
  modalPrice:       { fontSize: 20, fontWeight: "800", color: C.primary, marginBottom: 24 },
  modalBtn:         { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 48, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  modalBtnText:     { fontSize: 15, fontWeight: "700", color: C.white },
});