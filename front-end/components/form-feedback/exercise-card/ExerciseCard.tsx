import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { ReactNode } from "react";

export type Exercise = {
    id: string;
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    icon: ReactNode;
};

type ExerciseCardProps = {
    exercise: Exercise;
    isSelected: boolean;
    onPress: () => void;
};

export default function ExerciseCard({ exercise, isSelected, onPress, }: ExerciseCardProps) {
    const LEVEL_COLORS = {
        Beginner: "#22c55e",
        Intermediate: "#eab308",
        Advanced: "#ef4444",
    } as const;

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.cardBox, {
            backgroundColor: isSelected
                ? (pressed ? "darkgreen" : "green")
                : (pressed ? "#dfdfdf" : "#F6F6F6")
        }]}>

            {/* ICON */}
            <View style={[styles.cardIcon, { backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : "#EAEAEA" }]}  >
                {exercise.icon}
            </View>

            {/* EXERCISE CONTENT */}
            <View style={{ flex: 1, gap: 2 }}>

                {/* EXERCISE NAME */}
                <Text style={[styles.cardName, { color: isSelected ? "white" : "green" }]}>
                    {exercise.name}
                </Text>

                {/* EXERCISE LEVEL */}
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                    <View style={[styles.levelBox, { backgroundColor: LEVEL_COLORS[exercise.level] }]}  >
                        <Text style={styles.levelText}   >
                            {exercise.level}
                        </Text>
                    </View>
                </View>
            </View>

            {/* CTA */}
            <View style={{ alignItems: "flex-end", gap: 8 }}>
                <Text style={{ color: isSelected ? "white" : "green", fontWeight: "900", }}>
                    {isSelected ? "SELECTED" : "SELECT"}
                </Text>
                <Text style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "#888", fontSize: 12 }}>
                    {isSelected ? "Ready" : "Tap"}
                </Text>
            </View>
        </Pressable>
    );
}
