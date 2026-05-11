import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Ion } from "@/components/ui/icon";
import { useThemeColor } from "@/hooks/useThemeColor";

export type InputProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
  compact?: boolean;
};

export function Input({
  label,
  error,
  isPassword,
  compact,
  style,
  ...props
}: InputProps) {
  const Colors = useThemeColor();
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          { color: Colors.text },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.fieldRow,
          compact && styles.fieldRowCompact,
          {
            borderColor: error ? Colors.error : Colors.border,
            backgroundColor: Colors.card,
          },
        ]}
      >
        <TextInput
          {...props}
          style={[
            styles.input,
            compact && styles.inputCompact,
            { color: Colors.text },
            style,
          ]}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={isPassword ? hidden : props.secureTextEntry}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            style={styles.eye}
            hitSlop={12}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ion
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: Colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  eye: {
    paddingLeft: 8,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "500",
  },
  wrapCompact: {
    marginBottom: 12,
  },
  labelCompact: {
    marginBottom: 5,
  },
  fieldRowCompact: {
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputCompact: {
    paddingVertical: 9,
    fontSize: 15,
  },
});
