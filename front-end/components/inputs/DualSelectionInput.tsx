import { View, Text, StyleSheet, Pressable } from "react-native";

type DualSelectionInputProps<Type extends string> = {
    label: string;
    value: Type | null;
    option: Type;
    option2: Type;
    optionName?: string;
    optionName2?: string;
    onPress: (value: Type) => void;
    error?: string;
}

export default function DualSelectionInput<Type extends string>({ label, value, option, option2, optionName, optionName2, onPress, error }: DualSelectionInputProps<Type>) {
    const is = value === option;
    const is2 = value === option2;

    const color = error ? "red" : "green";

    return (
        <View>
            <Text style={{
                marginBottom: 5,
                color,
                fontWeight: "bold",
            }}>
                {label}
            </Text>

            <View style={styles.row}>
                <Pressable
                    style={[styles.button, error && { borderColor: "red" }, is && styles.activeButton]}
                    onPress={() => onPress(option)}
                >
                    <Text style={[styles.text, error && { color: "red" }, is && styles.activeText]}>{optionName ? optionName : option}</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, error && { borderColor: "red" }, is2 && styles.activeButton]}
                    onPress={() => onPress(option2)}
                >
                    <Text style={[styles.text, error && { color: "red" }, is2 && styles.activeText]}>{optionName2 ? optionName2 : option2}</Text>
                </Pressable>
            </View>

            {error && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {error}
                </Text>
            )}
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