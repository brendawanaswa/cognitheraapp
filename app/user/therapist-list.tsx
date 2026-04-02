import { api } from "@/utils/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

const FILTERS = [
  "All",
  "Anxiety",
  "Depression",
  "Trauma",
  "Relationships",
  "Family",
];

export default function TherapistList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const data = await api.getTherapists();
        // Backend should only return approved therapists
        setTherapists(data || []);
      } catch (err) {
        console.error("Failed to fetch therapists:", err);
        setError("Failed to load therapists. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const filtered = therapists.filter((t) => {
    const matchSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.specialties?.some((s: string) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );
    const matchFilter =
      filter === "All" ||
      t.specialties?.some((s: string) =>
        s.toLowerCase().includes(filter.toLowerCase()),
      );
    return matchSearch && matchFilter;
  });

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
        <Text style={styles.navTitle}>Therapists</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or specialty..."
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* FILTERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.loadingText}>Finding therapists...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setLoading(true);
                setError("");
                const fetchTherapists = async () => {
                  try {
                    const data = await api.getTherapists();
                    setTherapists(data || []);
                  } catch (err) {
                    setError("Failed to load therapists. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                };
                fetchTherapists();
              }}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resultsText}>
              {filtered.length} therapists found
            </Text>

            {filtered.length === 0 && !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No therapists found matching your criteria.
                </Text>
              </View>
            )}

            {filtered.map((therapist) => (
              <TouchableOpacity
                key={therapist.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/user/therapistProfile",
                    params: { id: therapist.id, name: therapist.name },
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {therapist.name?.split(" ")[1]?.[0] || "?"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.therapistName}>{therapist.name}</Text>
                    <Text style={styles.therapistTitle}>{therapist.title}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.ratingText}>
                        ⭐ {therapist.rating || "N/A"}
                      </Text>
                      <Text style={styles.reviewsText}>
                        ({therapist.reviews || 0} reviews)
                      </Text>
                      <Text style={styles.experienceText}>
                        · {therapist.experience}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.availableBadge,
                      {
                        backgroundColor: therapist.available
                          ? `${C.green}18`
                          : "#F3F4F6",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.availableText,
                        { color: therapist.available ? C.green : C.muted },
                      ]}
                    >
                      {therapist.available ? "Available" : "Busy"}
                    </Text>
                  </View>
                </View>

                <View style={styles.specialtiesRow}>
                  {therapist.specialties?.slice(0, 3).map((s: string) => (
                    <View key={s} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.sessionsRow}>
                  {therapist.sessions?.map((s: string) => (
                    <View key={s} style={styles.sessionTag}>
                      <Text style={styles.sessionText}>
                        {s === "Video call"
                          ? "🎥"
                          : s === "Voice call"
                            ? "📞"
                            : "💬"}{" "}
                        {s}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.priceText}>
                    {therapist.price}
                    <Text style={styles.perSession}>/session</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/user/therapistProfile",
                        params: { id: therapist.id, name: therapist.name },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.bookBtnText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
  searchWrap: {
    padding: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: C.text },
  filtersScroll: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  filtersContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: C.muted },
  filterTextActive: { color: C.white },
  scroll: { padding: 16, paddingBottom: 80 },
  resultsText: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "600",
    marginBottom: 14,
  },
  card: {
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
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: C.primary },
  therapistName: {
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
    marginBottom: 2,
  },
  therapistTitle: { fontSize: 12, color: C.muted, marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontWeight: "700", color: C.text },
  reviewsText: { fontSize: 12, color: C.muted },
  experienceText: { fontSize: 12, color: C.muted },
  availableBadge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  availableText: { fontSize: 11, fontWeight: "700" },
  specialtiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  specialtyTag: {
    backgroundColor: C.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  specialtyText: { fontSize: 11, fontWeight: "600", color: C.primary },
  sessionsRow: { flexDirection: "row", gap: 6, marginBottom: 14 },
  sessionTag: {
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.border,
  },
  sessionText: { fontSize: 11, fontWeight: "600", color: C.text },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: { fontSize: 18, fontWeight: "800", color: C.primary },
  perSession: { fontSize: 12, fontWeight: "400", color: C.muted },
  bookBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bookBtnText: { fontSize: 13, fontWeight: "700", color: C.white },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: { fontSize: 16, color: C.muted, marginTop: 12 },
  errorContainer: { alignItems: "center", paddingVertical: 40 },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: { fontSize: 14, fontWeight: "600", color: C.white },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16, color: C.muted, textAlign: "center" },
});
