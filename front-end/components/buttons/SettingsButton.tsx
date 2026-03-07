import { Pressable } from "react-native";
import { Cog6ToothIcon } from "react-native-heroicons/outline";

type SettingsProps = {
    onPress: () => void;
}

export default function SettingsButton({ onPress }: SettingsProps) {
    return (
        <Pressable
            onPress={onPress}

            style={({ pressed }) => [{
                position: "absolute",
                right: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: pressed ? "darkgreen" : "green",
                backgroundColor: pressed ? "darkgreen" : "green",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
            }]}
            hitSlop={10}
        >
            <Cog6ToothIcon size={24} color="white" />
        </Pressable>
    );
}