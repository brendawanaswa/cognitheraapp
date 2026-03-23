import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const C = {
  primary: "#7C3AED",
  primaryLight: "#EDE9FE",
  text: "#1F1F1F",
  muted: "#6B7280",
  bg: "#FAF8FF",
};

export default function Matching() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/user/therapist-list");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>
        thera<Text style={{ color: C.text }}>care</Text>
      </Text>

      {/* Spinner */}
      <ActivityIndicator
        size="large"
        color={C.primary}
        style={styles.spinner}
      />

      {/* Text */}
      <Text style={styles.title}>Finding the right therapist for you...</Text>
      <Text style={styles.subtitle}>
        We're analyzing your responses to match you with the best support 💜
      </Text>

      {/* Animated dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.3 }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: C.bg,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 48,
  },
  spinner: {
    marginBottom: 32,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    color: C.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: C.primary,
  },
});
