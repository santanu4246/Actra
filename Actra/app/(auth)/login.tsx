import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const label = mode === "signup" ? "Sign up" : "Sign in";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{label}</Text>
    </View>
  );
}
