import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal,
} from "react-native";
import { useRouter } from "expo-router";

const C = {
  primary:      "#7C3AED",
  primaryLight: "#EDE9FE",
  primaryMid:   "#DDD6FE",
  accent:       "#A78BFA",
  green:        "#2EC27E",
  red:          "#EF4444",
  text:         "#1F1F1F",
  muted:        "#6B7280",
  bg:           "#FAF8FF",
  white:        "#FFFFFF",
  border:       "#F0EEFF",
  dark:         "#0F0A1E",
};

export default function VideoCall() {
  const router = useRouter();
  const [callDuration, setCallDuration]   = useState(0);
  const [isMuted, setIsMuted]             = useState(false);
  const [isCameraOff, setIsCameraOff]     = useState(false);
  const [isSpeakerOn, setIsSpeakerOn]     = useState(true);
  const [isConnecting, setIsConnecting]   = useState(true);
  const [endCallModal, setEndCallModal]   = useState(false);
  const [callEnded, setCallEnded]         = useState(false);

  useEffect(() => {
    // Simulate connecting
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
    }, 2500);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (isConnecting || callEnded) return;
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnecting, callEnded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    setCallEnded(true);
    setEndCallModal(false);
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* CONNECTING SCREEN */}
      {isConnecting && (
        <View style={styles.connectingScreen}>
          <View style={styles.therapistAvatarLarge}>
            <Text style={styles.therapistAvatarEmoji}>👩‍⚕️</Text>
          </View>
          <Text style={styles.connectingName}>Dr. Amara Osei</Text>
          <Text style={styles.connectingStatus}>Connecting...</Text>
          <View style={styles.connectingDots}>
            <View style={[styles.connectingDot, { opacity: 0.4 }]} />
            <View style={[styles.connectingDot, { opacity: 0.7 }]} />
            <View style={[styles.connectingDot, { opacity: 1 }]} />
          </View>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CALL ENDED SCREEN */}
      {callEnded && (
        <View style={styles.connectingScreen}>
          <View style={styles.therapistAvatarLarge}>
            <Text style={styles.therapistAvatarEmoji}>👩‍⚕️</Text>
          </View>
          <Text style={styles.connectingName}>Dr. Amara Osei</Text>
          <Text style={styles.callEndedText}>Call Ended</Text>
          <Text style={styles.callEndedDuration}>Duration: {formatTime(callDuration)}</Text>
        </View>
      )}

      {/* ACTIVE CALL SCREEN */}
      {!isConnecting && !callEnded && (
        <View style={styles.callScreen}>

          {/* Therapist video (full screen) */}
          <View style={styles.therapistVideo}>
            <View style={styles.therapistVideoInner}>
              <Text style={styles.therapistVideoEmoji}>👩‍⚕️</Text>
            </View>

            {/* Top bar */}
            <View style={styles.callTopBar}>
              <View style={styles.callInfo}>
                <Text style={styles.callName}>Dr. Amara Osei</Text>
                <Text style={styles.callTimer}>{formatTime(callDuration)}</Text>
              </View>
              <View style={styles.secureTag}>
                <Text style={styles.secureText}>🔒 Secure</Text>
              </View>
            </View>

            {/* User video (picture in picture) */}
            <View style={[styles.userVideo, isCameraOff && styles.userVideoOff]}>
              {isCameraOff ? (
                <Text style={styles.cameraOffText}>📷</Text>
              ) : (
                <Text style={styles.userVideoEmoji}>🙂</Text>
              )}
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>

            {/* Top controls row */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.controlIcon}>{isMuted ? "🔇" : "🎤"}</Text>
                <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsCameraOff(!isCameraOff)}
                style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.controlIcon}>{isCameraOff ? "📷" : "📹"}</Text>
                <Text style={styles.controlLabel}>{isCameraOff ? "Start Video" : "Stop Video"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                style={[styles.controlBtn, !isSpeakerOn && styles.controlBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.controlIcon}>{isSpeakerOn ? "🔊" : "🔈"}</Text>
                <Text style={styles.controlLabel}>{isSpeakerOn ? "Speaker" : "Earpiece"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.controlIcon}>💬</Text>
                <Text style={styles.controlLabel}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* End call button */}
            <TouchableOpacity
              onPress={() => setEndCallModal(true)}
              style={styles.endCallBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.endCallIcon}>📵</Text>
              <Text style={styles.endCallText}>End Call</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

      {/* END CALL CONFIRMATION MODAL */}
      <Modal
        visible={endCallModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEndCallModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>📵</Text>
            <Text style={styles.modalTitle}>End Session?</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to end this session with Dr. Amara Osei?
            </Text>
            <Text style={styles.modalDuration}>Duration: {formatTime(callDuration)}</Text>

            <TouchableOpacity
              onPress={handleEndCall}
              style={styles.modalEndBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalEndBtnText}>End Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEndCallModal(false)}
              style={styles.modalCancelBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCancelBtnText}>Continue Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:                 { flex: 1, backgroundColor: C.dark },

  // Connecting screen
  connectingScreen:     { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.dark, gap: 12 },
  therapistAvatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 8, borderWidth: 4, borderColor: C.primary },
  therapistAvatarEmoji: { fontSize: 60 },
  connectingName:       { fontSize: 24, fontWeight: "800", color: C.white },
  connectingStatus:     { fontSize: 16, color: "rgba(255,255,255,0.6)" },
  connectingDots:       { flexDirection: "row", gap: 8, marginTop: 8 },
  connectingDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent },
  cancelBtn:            { marginTop: 32, backgroundColor: C.red, borderRadius: 99, paddingVertical: 12, paddingHorizontal: 32 },
  cancelBtnText:        { fontSize: 15, fontWeight: "700", color: C.white },
  callEndedText:        { fontSize: 20, fontWeight: "700", color: "rgba(255,255,255,0.8)" },
  callEndedDuration:    { fontSize: 14, color: "rgba(255,255,255,0.5)" },

  // Call screen
  callScreen:           { flex: 1 },
  therapistVideo:       { flex: 1, backgroundColor: "#1A1040", alignItems: "center", justifyContent: "center", position: "relative" },
  therapistVideoInner:  { width: 160, height: 160, borderRadius: 80, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  therapistVideoEmoji:  { fontSize: 80 },

  // Top bar
  callTopBar:           { position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  callInfo:             { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  callName:             { fontSize: 14, fontWeight: "700", color: C.white },
  callTimer:            { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  secureTag:            { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  secureText:           { fontSize: 12, color: C.green, fontWeight: "600" },

  // User video PiP
  userVideo:            { position: "absolute", bottom: 16, right: 16, width: 90, height: 120, borderRadius: 14, backgroundColor: C.primaryMid, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: C.white },
  userVideoOff:         { backgroundColor: "#333" },
  userVideoEmoji:       { fontSize: 36 },
  cameraOffText:        { fontSize: 28 },

  // Controls
  controls:             { backgroundColor: C.dark, padding: 20, paddingBottom: 32 },
  controlsRow:          { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  controlBtn:           { alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 14, width: 72 },
  controlBtnActive:     { backgroundColor: "rgba(255,255,255,0.25)" },
  controlIcon:          { fontSize: 24 },
  controlLabel:         { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "600", textAlign: "center" },
  endCallBtn:           { backgroundColor: C.red, borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  endCallIcon:          { fontSize: 20 },
  endCallText:          { fontSize: 16, fontWeight: "700", color: C.white },

  // Modal
  modalOverlay:         { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard:            { backgroundColor: C.white, borderRadius: 24, padding: 28, width: "100%", alignItems: "center" },
  modalEmoji:           { fontSize: 48, marginBottom: 12 },
  modalTitle:           { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 8 },
  modalSub:             { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20, marginBottom: 8 },
  modalDuration:        { fontSize: 13, fontWeight: "700", color: C.primary, marginBottom: 24 },
  modalEndBtn:          { backgroundColor: C.red, borderRadius: 14, paddingVertical: 14, width: "100%", alignItems: "center", marginBottom: 10 },
  modalEndBtnText:      { fontSize: 15, fontWeight: "700", color: C.white },
  modalCancelBtn:       { backgroundColor: C.primaryLight, borderRadius: 14, paddingVertical: 14, width: "100%", alignItems: "center" },
  modalCancelBtnText:   { fontSize: 15, fontWeight: "700", color: C.primary },
});