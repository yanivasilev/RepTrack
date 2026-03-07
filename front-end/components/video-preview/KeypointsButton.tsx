import { Pressable } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";

type KeypointsButton = {
    showKeypoints: boolean;
    onPress?: () => void;
};

export default function KeypointsButton({ showKeypoints, onPress }: KeypointsButton) {
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
                borderColor: pressed ? "darkblue" : "blue",
                backgroundColor: pressed ? "darkblue" : "blue",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
            }]}
            hitSlop={10}
        >
            {showKeypoints ? <EyeIcon size={24} color="white" /> : <EyeSlashIcon size={24} color="white" />}
        </Pressable>
    );
}
