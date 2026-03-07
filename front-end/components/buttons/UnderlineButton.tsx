import { Text, Pressable } from "react-native";

type UnderlineButtonProps = {
    label: string;
    onPress: () => void
}

export default function UnderlineButton({ label, onPress }: UnderlineButtonProps) {
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <Text
                    style={{
                        color: pressed ? "darkgreen" : "green",
                        textDecorationLine: "underline",
                        textAlign: "center",
                    }}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
}