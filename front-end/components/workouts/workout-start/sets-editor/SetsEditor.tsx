import { Pressable, Text } from "react-native";
import { WorkoutSetType } from "../../../../libs/types/workouts/WorkoutSetType";
import { ExerciseType } from "../../../../libs/types/common/exercises/ExerciseType";
import { UnitType } from "../../../../libs/types/common/UnitType";
import { addSet } from "../../../../libs/utils/start-workout/addSet";
import { SetRow } from "./set-row/SetRow";
import { useState } from "react";
import { styles } from "./styles";

type SetsEditorProps = {
    exerciseType: ExerciseType;
    weightUnitType: UnitType;
    sets: WorkoutSetType[];
    onChangeSets: (next: WorkoutSetType[]) => void;
    errors?: (setId: string, field: "reps" | "weight" | "durationSeconds") => string | undefined;
    onDeleteSet?: (setId: string) => void;
    onEditSetNotes?: (setId: string, setIndex: number, currentValue?: string) => void;
}

export default function SetsEditor({ exerciseType, weightUnitType, sets, onChangeSets, errors, onDeleteSet, onEditSetNotes }: SetsEditorProps) {
    const [timeDigitsById, setTimeDigitsById] = useState<Record<string, string>>({});

    return (
        <>
            {/* SETS LIST */}
            {sets.map((set, index) => {
                const rawDigits = timeDigitsById[set.id] ?? "";
                return (
                    <SetRow
                        key={set.id}
                        item={set}
                        index={index}
                        drag={undefined}
                        isActive={false}
                        exerciseType={exerciseType}
                        weightUnitType={weightUnitType}
                        rawDigits={rawDigits}
                        setRawDigits={(next) => setTimeDigitsById((prev) => ({ ...prev, [set.id]: next }))}
                        canDelete={sets.length > 1}
                        onDelete={() => {
                            onDeleteSet?.(String(set.id));
                            onChangeSets(sets.filter((s) => s.id !== set.id));
                        }}
                        onUpdate={(nextSet) => onChangeSets(sets.map((s) => (s.id === set.id ? nextSet : s)))}
                        onEditNotes={() => onEditSetNotes?.(set.id, index, set.notes)}
                        errors={{
                            reps: errors?.(String(set.id), "reps"),
                            weight: errors?.(set.id, "weight"),
                            durationSeconds: errors?.(set.id, "durationSeconds"),
                        }}
                    />
                );
            })}

            {/* ADD SET BUTTON */}
            <Pressable
                onPress={() => onChangeSets([...sets, addSet(exerciseType)])}
                style={({ pressed }) => [styles.addSet, pressed && styles.addSetPressed]}
            >
                <Text style={styles.addSetText}>ADD SET</Text>
            </Pressable>
        </>
    );
}
