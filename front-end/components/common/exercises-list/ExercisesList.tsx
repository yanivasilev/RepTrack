import React, { useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import ExerciseCard from "../exercise-card/ExerciseCard";
import { styles } from "./styles";
import { Exercise } from "../../../libs/types/common/exercises/Exercise";

type ExerciseListProps = {
    query?: string;
    exercises: Exercise[];
    selectedExercise: Exercise | null;
    setSelectedExercise: React.Dispatch<React.SetStateAction<Exercise | null>>;
    onEndReached?: () => void;
    loadingMore?: boolean;
    loadingSearch?: boolean;
};

export default function ExercisesList({
    exercises,
    selectedExercise,
    setSelectedExercise,
    onEndReached = () => { },
    loadingMore = false,
    loadingSearch = false,
}: ExerciseListProps) {

    const listWithSelectedOnTop = useMemo(() => {
        let list = exercises.slice();
        if (selectedExercise) {
            list = [selectedExercise, ...list.filter((e) => e.id !== selectedExercise.id)];
        }
        return list;
    }, [selectedExercise, exercises]);

    return (
        <FlatList
            data={listWithSelectedOnTop}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={[styles.main, { paddingBottom: 160 }]}
            ListHeaderComponent={
                <View style={{ gap: 8 }}>
                    <Text style={styles.title}>ALL EXERCISES</Text>
                    {loadingSearch ? <ActivityIndicator size="large" color="green" /> : null}
                </View>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
                loadingMore ? (
                    <View style={{ paddingVertical: 16, alignItems: "center", gap: 8 }}>
                        <ActivityIndicator size="large" color="green" />
                        <Text style={{ color: "green" }}>Loading more exercises…</Text>
                    </View>
                ) : null
            }
            renderItem={({ item }) => (
                <ExerciseCard
                    exercise={item}
                    isSelected={selectedExercise?.id === item.id}
                    onPress={() => setSelectedExercise(selectedExercise?.id === item.id ? null : item)}
                />
            )}
            ListEmptyComponent={<Text style={{ color: "red" }}>No exercises found.</Text>}
        />
    );
}
