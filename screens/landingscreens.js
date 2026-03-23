import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TheraCare</Text>
      <Text style={styles.subtitle}>Your mental health matters</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Login pressed")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={() => alert("Sign Up pressed")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f0ff",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8a4fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    width: "80%",
    backgroundColor: "#8a4fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  signupButton: { backgroundColor: "#d9bfff" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
