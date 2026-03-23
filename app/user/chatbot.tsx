import { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

const RESPONSES = [
  "I hear you. That sounds really challenging. Can you tell me more about how that's been affecting you?",
  "Thank you for sharing that with me. It takes courage to open up. How long have you been feeling this way?",
  "That makes a lot of sense. Your feelings are completely valid. What do you think triggered this?",
  "I'm here with you. You're not alone in this. Have you been able to talk to anyone else about this?",
  "It sounds like you're carrying a lot right now. What would make you feel even a little bit better today?",
  "I appreciate you trusting me with this. Remember, it's okay to not be okay sometimes. What does your support system look like?",
  "You're doing great by reaching out. Small steps forward still count as progress. What's one thing you can do for yourself today?",
];

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chatbot() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then(name => {
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI thinking
    setTimeout(() => {
      const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        time: getTime(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()}>
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
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* MESSAGES */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageWrap,
                msg.role === "user" ? styles.messageWrapUser : styles.messageWrapBot,
              ]}
            >
              {msg.role === "assistant" && (
                <View style={styles.botAvatarSmall}>
                  <Text style={{ fontSize: 14 }}>🤖</Text>
                </View>
              )}
              <View style={[
                styles.bubble,
                msg.role === "user" ? styles.bubbleUser : styles.bubbleBot,
              ]}>
                <Text style={[
                  styles.bubbleText,
                  msg.role === "user" ? styles.bubbleTextUser : styles.bubbleTextBot,
                ]}>
                  {msg.content}
                </Text>
                <Text style={[
                  styles.bubbleTime,
                  msg.role === "user" ? styles.bubbleTimeUser : styles.bubbleTimeBot,
                ]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing indicator */}
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
        <View style={styles.inputWrap}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Share what's on your mind..."
            placeholderTextColor={C.muted}
            style={styles.input}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
            style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.bg },
  nav:              { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack:          { fontSize: 22, color: C.muted },
  navCenter:        { flexDirection: "row", alignItems: "center", gap: 10 },
  botAvatar:        { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  botAvatarText:    { fontSize: 20 },
  navTitle:         { fontSize: 16, fontWeight: "800", color: C.text },
  navSub:           { fontSize: 11, color: C.muted },
  messagesScroll:   { padding: 16, paddingBottom: 20 },
  messageWrap:      { flexDirection: "row", marginBottom: 12, alignItems: "flex-end", gap: 8 },
  messageWrapUser:  { justifyContent: "flex-end" },
  messageWrapBot:   { justifyContent: "flex-start" },
  botAvatarSmall:   { width: 28, height: 28, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  bubble:           { maxWidth: "75%", borderRadius: 18, padding: 12 },
  bubbleUser:       { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  bubbleBot:        { backgroundColor: C.white, borderBottomLeftRadius: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  bubbleText:       { fontSize: 15, lineHeight: 22 },
  bubbleTextUser:   { color: C.white },
  bubbleTextBot:    { color: C.text },
  bubbleTime:       { fontSize: 10, marginTop: 4 },
  bubbleTimeUser:   { color: "rgba(255,255,255,0.6)", textAlign: "right" },
  bubbleTimeBot:    { color: C.muted },
  typingDots:       { flexDirection: "row", gap: 4, padding: 4 },
  dot:              { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  inputWrap:        { flexDirection: "row", alignItems: "flex-end", gap: 10, padding: 16, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border },
  input:            { flex: 1, backgroundColor: C.primaryLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.text, maxHeight: 100, borderWidth: 1.5, borderColor: C.border },
  sendBtn:          { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  sendBtnDisabled:  { backgroundColor: C.primaryMid },
  sendBtnText:      { fontSize: 18, color: C.white, fontWeight: "800" },
});