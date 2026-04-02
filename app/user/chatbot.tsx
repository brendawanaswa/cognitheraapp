import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  bg: "#7C3AED",
  white: "#FFFFFF",
  border: "#F0EEFF",
};

const BASE_URL = "https://theracare-backend-production.up.railway.app/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const API_KEY =
  (Constants.expoConfig?.extra as any)?.apiKey ||
  (Constants.manifest?.extra as any)?.apiKey ||
  process.env.API_KEY ||
  process.env.api_key ||
  "";

export default function Chatbot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((name) => {
      const firstName = name?.split(" ")[0] || "there";
      setUserName(firstName);
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hi ${firstName} 💜 I'm Thera, your personal wellness companion. How are you feeling today?`,
          time: getTime(),
        },
      ]);
    });
  }, []);

  const sendToAI = async (history: { role: string; content: string }[]) => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      const storedName = await AsyncStorage.getItem("user_name");
      const apiName = userName || storedName?.split(" ")[0] || "there";

      if (!token) {
        console.warn("Chatbot sendToAI: missing user_token");
        return "Please log in first to use the chatbot. Redirecting...";
      }

      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        body: JSON.stringify({
          messages: history,
          userName: apiName,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Chatbot sendToAI JSON parse failed:", parseErr);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        console.warn("Chatbot sendToAI failed status:", res.status, data);

        if (res.status === 401 || res.status === 403) {
          return "Session expired or invalid credentials. Please log in again.";
        }

        if (res.status >= 500) {
          return "Thera is taking a short break right now. Please try again in a moment.";
        }

        const serverMsg = data?.message || data?.error;
        return serverMsg || `Server error ${res.status}. Please try again.`;
      }

      return data?.message || "I'm here for you 💜 Can you tell me more?";
    } catch (err) {
      console.error("Chatbot sendToAI failed:", err);
      return "I'm having trouble connecting right now. Please try again 💙";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      time: getTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    const history = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await sendToAI(history);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply,
      time: getTime(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.navTitle}>Thera</Text>
            <Text style={styles.navSub}>AI Wellness Companion</Text>
          </View>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* MESSAGES */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrap,
                msg.role === "user"
                  ? styles.messageWrapUser
                  : styles.messageWrapBot,
              ]}
            >
              {msg.role === "assistant" && (
                <View style={styles.botAvatarSmall}>
                  <Text style={{ fontSize: 14 }}>🤖</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.bubbleUser : styles.bubbleBot,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.role === "user"
                      ? styles.bubbleTextUser
                      : styles.bubbleTextBot,
                  ]}
                >
                  {msg.content}
                </Text>
                <Text
                  style={[
                    styles.bubbleTime,
                    msg.role === "user"
                      ? styles.bubbleTimeUser
                      : styles.bubbleTimeBot,
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageWrap, styles.messageWrapBot]}>
              <View style={styles.botAvatarSmall}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleBot]}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, { opacity: 0.4 }]} />
                  <View style={[styles.dot, { opacity: 0.7 }]} />
                  <View style={[styles.dot, { opacity: 1 }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* INPUT */}
        <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 12 }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Share what's on your mind..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
            style={[
              styles.sendBtn,
              (!input.trim() || isTyping) && styles.sendBtnDisabled,
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navBack: { fontSize: 22, color: C.white },
  navCenter: { flexDirection: "row", alignItems: "center", gap: 10 },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  botAvatarText: { fontSize: 20 },
  navTitle: { fontSize: 16, fontWeight: "800", color: C.white },
  navSub: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  messagesScroll: { padding: 16, paddingBottom: 20 },
  messageWrap: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
    gap: 8,
  },
  messageWrapUser: { justifyContent: "flex-end" },
  messageWrapBot: { justifyContent: "flex-start" },
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: { maxWidth: "75%", borderRadius: 18, padding: 12 },
  bubbleUser: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderBottomRightRadius: 4,
  },
  bubbleBot: { backgroundColor: C.white, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: C.white },
  bubbleTextBot: { color: C.text },
  bubbleTime: { fontSize: 10, marginTop: 4 },
  bubbleTimeUser: { color: "rgba(255,255,255,0.6)", textAlign: "right" },
  bubbleTimeBot: { color: C.muted },
  typingDots: { flexDirection: "row", gap: 4, padding: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: C.white,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "rgba(255,255,255,0.3)" },
  sendBtnText: { fontSize: 18, color: C.primary, fontWeight: "800" },
});
