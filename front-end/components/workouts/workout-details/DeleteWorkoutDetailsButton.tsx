import { Alert, Pressable } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

type DeleteWorkoutDetailsButtonProps = {
    onDelete: () => Promise<void> | void;
    disabled?: boolean;
};

export default function DeleteWorkoutDetailsButton({ onDelete, disabled = false }: DeleteWorkoutDetailsButtonProps) {
    const handleDelete = () => {
        if (disabled) return;

        Alert.alert(
            "Delete workout",
            "Are you sure you want to delete this workout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await onDelete();
                    },
                },
            ]
        );
    };

    return (
        <Pressable
            onPress={handleDelete}
            disabled={disabled}
            style={({ pressed }) => [
                {
                    position: "absolute",
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: pressed || disabled ? "darkred" : "red",
                    backgroundColor: pressed || disabled ? "darkred" : "red",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                },
            ]}
            hitSlop={10}
        >
            <TrashIcon size={24} color="white" />
        </Pressable>
    );
}
