import TheraCareLogo from "@/components/TheraCareLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

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
  red: "#EF4444",
};

const BASE_URL = "https://theracare-backend-production.up.railway.app/api";

export default function UserAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    // ================= SIGNUP =================
    if (isSignup) {
      if (!fullName || !email || !password) {
        setError("Please fill in all fields");
        return;
      }
      if (password !== confirmPass) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Invalid server response");
        }

        setLoading(false);

        // ✅ FIX: DO NOT auto login
        if (data.token || data.message) {
          await AsyncStorage.setItem("onboarding_complete", "false");

          setIsSignup(false);
          setFullName("");
          setEmail("");
          setPassword("");
          setConfirmPass("");
          setError("");

          Alert.alert(
            "Success! 🎉",
            "Account created successfully. Please login to continue."
          );
        } else {
          setError(data.message || "Signup failed");
        }
      } catch (err) {
        console.error("Auth signup failed", err);
        setLoading(false);
        setError("Connection failed. Please try again.");
      }

    // ================= LOGIN =================
    } else {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Invalid server response");
        }

        setLoading(false);

        if (data.token) {
          await AsyncStorage.setItem("user_token", data.token);
          await AsyncStorage.setItem("user_name", data.user.fullName);

          const done = await AsyncStorage.getItem("onboarding_complete");

          if (done === "true") {
            router.replace("/user/mood-tracker");
          } else {
            router.replace("/user/onboarding");
          }
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        console.error("Auth login failed", err);
        setLoading(false);
        setError("Connection failed. Please try again.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoWrap}>
        <TheraCareLogo size="medium" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? "Start your mental wellness journey"
            : "Continue your wellness journey"}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {isSignup && (
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            placeholderTextColor={C.muted}
            value={fullName}
            onChangeText={setFullName}
          />
        )}

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor={C.muted}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor={C.muted}
          value={password}
          onChangeText={setPassword}
        />

        {isSignup && (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={C.muted}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          style={styles.toggleWrap}
        >
          <Text style={styles.toggleText}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Text style={styles.toggleLink}>
              {isSignup ? "Login" : "Sign Up"}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>🔒 Your data is private and secure</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FAF8FF",
  },
  logoWrap: { marginBottom: 28, alignItems: "center" },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: C.muted,
    marginBottom: 20,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { fontSize: 12, color: C.red, fontWeight: "600" },
  input: {
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: C.text,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 10,
  },
  button: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 14,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: C.accent },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  toggleWrap: { alignItems: "center" },
  toggleText: { fontSize: 13, color: C.muted },
  toggleLink: { color: C.primary, fontWeight: "700" },
  footer: { fontSize: 12, color: C.muted, marginTop: 24, textAlign: "center" },
});