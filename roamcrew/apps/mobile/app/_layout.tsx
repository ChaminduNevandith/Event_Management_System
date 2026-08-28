import { Slot } from "expo-router";
import { AuthProvider } from "../components/auth-provider";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
