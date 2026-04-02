import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="user/settings" options={{ headerShown: false }} />
<Stack.Screen name="user/sessions" options={{ headerShown: false }} />
<Stack.Screen name="admin/index" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="user/auth" options={{ headerShown: false }} />
          <Stack.Screen
            name="user/onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="user/home" options={{ headerShown: false }} />
          <Stack.Screen name="user/chatbot" options={{ headerShown: false }} />
          <Stack.Screen name="user/journal" options={{ headerShown: false }} />
          <Stack.Screen
            name="user/mood-tracker"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="user/matching" options={{ headerShown: false }} />
          <Stack.Screen
            name="user/therapist-list"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="user/therapistProfile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="user/video-call"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="user/payments" options={{ headerShown: false }} />
          <Stack.Screen
            name="therapist/auth"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="therapist/dashboard"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="therapist/sessions"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="therapist/clients"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="therapist/earnings"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="therapist/profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
