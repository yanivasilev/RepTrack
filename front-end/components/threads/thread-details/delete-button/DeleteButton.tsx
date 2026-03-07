import { Alert, Pressable } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

type DeleteButtonProps = {
    label: "thread" | "reply";
    onDelete: () => Promise<void> | void;
    disabled?: boolean;
};

export default function DeleteButton({ label, onDelete, disabled = false }: DeleteButtonProps) {
    const handleDelete = () => {
        if (disabled) return;

        Alert.alert(
            `Delete ${label}`,
            `Are you sure you want to delete this ${label}?`,
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
        <Pressable onPress={handleDelete} disabled={disabled} hitSlop={10}>
            {({ pressed }) => (
                <TrashIcon size={24} color={pressed || disabled ? "darkred" : "red"} strokeWidth={2} />
            )}
        </Pressable>
    );
}
