import { FlatList, Pressable, Text, View } from "react-native";
import { WorkoutDetailsExerciseType } from "../../../../libs/types/workouts/workout-details/WorkoutDetailsExerciseType";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import { useState } from "react";
import NotesModal from "../../notes-modal/NotesModal";
import { styles } from "./styles";
import { SetRow } from "../set-row/SetRow";
import { UnitType } from "../../../../libs/types/common/UnitType";

type ExercisesListProps = {
    exercises: WorkoutDetailsExerciseType[];
    weightUnitType: UnitType;
}

export default function ExercisesList({ exercises, weightUnitType }: ExercisesListProps) {
    const [notesVisible, setNotesVisible] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState<string | undefined>(undefined);
    const [selectedTitle, setSelectedTitle] = useState<string>("Notes");

    const openNotes = (title: string, notes?: string | null) => {
        setSelectedTitle(title);
        setSelectedNotes(notes ?? undefined);
        setNotesVisible(true);
    };

    const closeNotes = () => setNotesVisible(false);

    return (
        <>
            <FlatList
                style={{ flex: 1 }}
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ marginVertical: 10, paddingTop: 10, paddingBottom: 10, gap: 10 }}

                renderItem={({ item }) => {
                    return (
                        <View style={styles.exerciseCard}>
                            <View style={styles.exerciseCardTop}>
                                <Text style={styles.exerciseName}>{item.exercise.name}</Text>

                                {item.notes != null && (
                                    <Pressable
                                        onPress={() => openNotes(`${item.exercise.name} NOTES`, item.notes)}
                                        style={({ pressed }) => [styles.notesButton, pressed && styles.notesButtonPressed]}
                                    >
                                        <PencilSquareIcon size={24} color="white" strokeWidth={2} />
                                    </Pressable>
                                )}
                            </View>

                            {item.sets.map((set) => {
                                return (
                                    <SetRow key={set.id.toString()} set={set} weightUnitType={weightUnitType} onOpenNotes={openNotes} />
                                );
                            })}
                        </View>
                    )
                }}
            />

            <NotesModal
                visible={notesVisible}
                title={selectedTitle}
                value={selectedNotes}
                onClose={closeNotes}
            />
        </>
    );
}
