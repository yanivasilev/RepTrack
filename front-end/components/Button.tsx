import { Text, StyleSheet, Pressable } from "react-native";

type ButtonProps = {
    label: string;
    onPress: () => void
}

export default function Button({ label, onPress }: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "green",
        backgroundColor: "green",
        padding: 12,
        borderRadius: 20,
    },
    text: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    pressed: {
        backgroundColor: "darkgreen"
    }
});
