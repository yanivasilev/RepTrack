import { Pressable } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

type SearchButtonProps = {
    onPress: () => void;
};

export default function SearchButton({ onPress }: SearchButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [{
                position: "absolute",
                left: 16,
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
            <MagnifyingGlassIcon size={24} color="white" />
        </Pressable>
    );
}
