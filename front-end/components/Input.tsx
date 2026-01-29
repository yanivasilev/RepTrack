import { View, Text, StyleSheet, TextInput } from "react-native";

type InputProps = {
    label: string;
    value: string;
    onTextChange: (v: string) => void;
    placeholder: string;
}

export default function Input({ label, value, onTextChange, placeholder }: InputProps) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onTextChange}
                style={styles.input}
                placeholder={placeholder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "green",
        padding: 12,
        borderRadius: 8,
    },
});
