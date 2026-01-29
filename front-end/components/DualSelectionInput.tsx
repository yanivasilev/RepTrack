import { View, Text, StyleSheet, Pressable } from "react-native";

type DualSelectionInputProps<Type extends string> = {
    label: string;
    value: Type | null;
    option: Type;
    option2: Type;
    onPress: (value: Type) => void;
}

export default function DualSelectionInput<Type extends string>({ label, value, option, option2, onPress }: DualSelectionInputProps<Type>) {
    const is = value === option;
    const is2 = value === option2;

    return (
        <View>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.row}>
                <Pressable
                    style={[styles.button, is && styles.activeButton]}
                    onPress={() => onPress(option)}
                >
                    <Text style={[styles.text, is && styles.activeText]}>{option}</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, is2 && styles.activeButton]}
                    onPress={() => onPress(option2)}
                >
                    <Text style={[styles.text, is2 && styles.activeText]}>{option2}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        backgroundColor: "white",
    },
    text: {
        color: "green",
        fontWeight: "bold",
    },
    activeButton: {
        backgroundColor: "green",
    },
    activeText: {
        color: "white",
    },
});