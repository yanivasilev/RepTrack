import { Text, StyleSheet, Pressable } from "react-native";

type UnderlineButtonProps = {
    label: string;
    onPress: () => void
}

export default function UnderlineButton({ label, onPress }: UnderlineButtonProps) {
    return (
        <Pressable onPress={onPress}>
            <Text style={styles.button}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        color: "green",
        textDecorationLine: "underline",
        textAlign: "center",
    },
});
