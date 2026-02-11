import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

type UnitInputProps<Unit extends string> = {
    label: string;

    text: string;
    onTextChange: (v: string) => void;
    placeholder?: string;

    unit: Unit | null;
    unit1: Unit;
    unit2: Unit;
    unit1Label: string;
    unit2Label: string;

    onUnitChange: (u: Unit) => void;

    error?: string;
};

export default function UnitInput<Unit extends string>({
    label,
    text,
    onTextChange,
    placeholder,
    unit,
    unit1,
    unit2,
    unit1Label,
    unit2Label,
    onUnitChange,
    error
}: UnitInputProps<Unit>) {
    const is1 = unit === unit1;
    const is2 = unit === unit2;

    return (
        <View>
            <Text style={[styles.label, error && { color: "red" }]}>{label}</Text>

            <View style={styles.inputWrapper}>
                <TextInput
                    value={text}
                    onChangeText={onTextChange}
                    placeholder={placeholder}
                    keyboardType="numeric"
                    style={[styles.input, error && { borderColor: "red" }]}
                />

                <View style={styles.unitContainer}>
                    <Pressable
                        style={[styles.unitButton, error && { borderColor: "red" }, is1 && styles.unitActive, is1 && error && { backgroundColor: "red" }]}
                        onPress={() => onUnitChange(unit1)}
                    >
                        <Text style={[styles.unitText, error && { color: "red" }, is1 && styles.unitTextActive]}>
                            {unit1Label}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.unitButton, error && { borderColor: "red" }, is2 && styles.unitActive, is2 && error && { backgroundColor: "red" }]}
                        onPress={() => onUnitChange(unit2)}
                    >
                        <Text style={[styles.unitText, error && { color: "red" }, is2 && styles.unitTextActive]}>
                            {unit2Label}
                        </Text>
                    </Pressable>
                </View>
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
        fontWeight: "bold"
    },
    inputWrapper: {
        position: "relative"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 8,
        padding: 12,
        paddingRight: 80
    },
    unitContainer: {
        position: "absolute",
        right: 8,
        top: "50%",
        flexDirection: "row",
        transform: [{ translateY: -16 }]
    },
    unitButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 6,
        backgroundColor: "white"
    },
    unitActive: {
        backgroundColor: "green"
    },
    unitText: {
        fontSize: 12,
        fontWeight: "700",
        color: "green"
    },
    unitTextActive: {
        color: "white"
    },
});
