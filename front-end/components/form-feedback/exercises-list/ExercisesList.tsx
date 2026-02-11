import React, { useMemo } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import ExerciseCard, { Exercise } from "../exercise-card/ExerciseCard";
import { styles } from "./styles";

function contains(hay: string, needle: string) {
    return hay.toLowerCase().includes(needle.toLowerCase().trim());
}

type ExerciseListProps = {
    query: string;
    exercises: Exercise[];
    selectedExercise: Exercise | null;
    setSelectedExercise: React.Dispatch<React.SetStateAction<Exercise | null>>;
};

export default function ExercisesList({ query, exercises, selectedExercise, setSelectedExercise }: ExerciseListProps) {
    const filteredAll = useMemo(() => {
        let list = exercises.slice();

        if (query.trim()) {
            list = list.filter((e) => contains(e.name, query));
        }

        if (selectedExercise) {
            list = [
                selectedExercise,
                ...list.filter((e) => e.id !== selectedExercise.id),
            ];
        }

        return list;
    }, [query, selectedExercise, exercises]);

    return (
        <ScrollView contentContainerStyle={styles.main}>
            <View style={{ gap: 10 }}>
                <Text style={styles.title}>ALL EXERCISES</Text>

                <FlatList
                    data={filteredAll}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            exercise={item}
                            isSelected={selectedExercise?.id === item.id}
                            onPress={() => {
                                if (selectedExercise?.id === item.id) {
                                    setSelectedExercise(null);
                                } else {
                                    setSelectedExercise(item);
                                }
                            }}
                        />
                    )}
                />
            </View>
        </ScrollView>
    );
}
