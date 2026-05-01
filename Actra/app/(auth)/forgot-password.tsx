import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.body}>Reset flow coming soon.</Text>
      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Back to sign in</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    opacity: 0.75,
    marginBottom: 24,
  },
  link: {},
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
