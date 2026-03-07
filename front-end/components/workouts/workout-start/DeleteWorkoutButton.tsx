import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { Alert, Pressable } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";
import { useWorkout } from "../../../hooks/WorkoutSessionContext";

type DeleteWorkoutButtonProps = {
    navigation: NativeStackNavigationProp<ParamListBase>;
};

export default function DeleteWorkoutButton({ navigation }: DeleteWorkoutButtonProps) {
    const { session, reset } = useWorkout();

    const handlePress = () => {
        Alert.alert(
            "Delete Workout",
            "Are you sure you want to delete this workout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        reset();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    if (!session) return null;

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [{
                position: "absolute",
                right: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: pressed ? "darkred" : "red",
                backgroundColor: pressed ? "darkred" : "red",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
            }]}
            hitSlop={10}
        >
            <TrashIcon size={24} color="white" />
        </Pressable>
    );
}
