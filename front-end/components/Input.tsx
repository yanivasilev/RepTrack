import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputProps = TextInputProps & {
    label: string;
    error?: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
}

export default function Input({ label, error, rightIcon, onRightIconPress, ...props }: InputProps) {
    const color = error ? "red" : "green"

    return (
        <View>
            <Text style={{
                marginBottom: 5,
                color,
                fontWeight: "bold",
            }}>
                {label}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: color,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                }}
            >
                <TextInput
                    {...props}
                    style={{ flex: 1, paddingVertical: 12, color: "gray" }}
                    placeholderTextColor="gray"
                />

                {rightIcon && (
                    <Pressable onPress={onRightIconPress} hitSlop={10}>
                        <Ionicons name={rightIcon} size={22} color={color} />
                    </Pressable>
                )}
            </View>

            {error && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {error}
                </Text>
            )}
        </View>
    );
}
