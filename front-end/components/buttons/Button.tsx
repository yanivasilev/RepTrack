import { Text, StyleSheet, Pressable, View } from "react-native";
import { ComponentType } from "react";

type ButtonProps = {
    label: string;
    onPress: () => void;
    variant?: "filled" | "outlined";
    colour?: "green" | "orange" | "gray";
    disabled?: boolean;
    Icon?: ComponentType<{ size?: number; color?: string }>;
};

export default function Button({ label, onPress, variant = "filled", colour = "green", disabled, Icon }: ButtonProps) {
    const colours = {
        green: {
            default: "green",
            pressed: "darkgreen",
        },
        orange: {
            default: "orange",
            pressed: "darkorange",
        },
        gray: {
            default: "gray",
            pressed: "darkgray",
        },
    };
    const selected = colours[colour];

    return (
        <Pressable
            disabled={disabled}
            style={({ pressed }) => [
                variant === "filled" ? styles.buttonFilled : styles.buttonOutlined,
                variant === "filled"
                    ? { backgroundColor: pressed ? selected.pressed : selected.default }
                    : {
                        borderColor: selected.default,
                        backgroundColor: pressed ? selected.default : "white",
                    },
                disabled && styles.disabled,
            ]}
            onPress={onPress}
        >
            {({ pressed }) => {
                const contentColor =
                    variant === "filled"
                        ? "white"
                        : pressed
                            ? "white"
                            : selected.default;

                return (
                    <View style={styles.content}>
                        {Icon && <Icon size={24} color={contentColor} />}
                        <Text
                            style={[
                                variant === "filled" ? styles.textFilled : styles.textOutlined,
                                { color: contentColor },
                            ]}
                        >
                            {label}
                        </Text>
                    </View>
                );
            }}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonFilled: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: "green",
        marginBottom: 10
    },
    buttonOutlined: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "green",
        backgroundColor: "white",
        marginBottom: 10
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    textFilled: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    textOutlined: {
        color: "green",
        fontWeight: "700",
        fontSize: 16,
    },
    disabled: {
        opacity: 0.6,
    }
});
