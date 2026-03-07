import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { Exercise } from "../../../libs/types/common/exercises/Exercise";

type ExerciseCardProps = {
    exercise: Exercise;
    isSelected: boolean;
    onPress: () => void;
};

export default function ExerciseCard({ exercise, isSelected, onPress }: ExerciseCardProps) {

    const LEVEL_COLORS = {
        BEGINNER: "#22c55e",
        INTERMEDIATE: "#eab308",
        ADVANCED: "#ef4444",
    } as const;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.cardBox,
                {
                    backgroundColor: isSelected ? (pressed ? "darkgreen" : "green") : pressed ? "#dfdfdf" : "#F6F6F6",
                },
            ]}
        >
            <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.cardName, { color: isSelected ? "white" : "green" }]}>{exercise.name}</Text>

                <Text style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "#888", fontSize: 12 }}>
                    <Text style={{ fontWeight: "bold" }}>Muscle Group:</Text> {exercise.muscleGroup}
                </Text>

                <Text style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "#888", fontSize: 12 }}>
                    <Text style={{ fontWeight: "bold" }}>Equipment:</Text> {exercise.equipment}
                </Text>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                    <View style={[styles.levelBox, { backgroundColor: LEVEL_COLORS[exercise.experienceLevel] }]}  >
                        <Text style={styles.levelText}   >
                            {exercise.experienceLevel}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: "flex-end", gap: 8 }}>
                <Text style={{ color: isSelected ? "white" : "green", fontWeight: "900" }}>{isSelected ? "SELECTED" : "SELECT"}</Text>
            </View>
        </Pressable>
    );
}