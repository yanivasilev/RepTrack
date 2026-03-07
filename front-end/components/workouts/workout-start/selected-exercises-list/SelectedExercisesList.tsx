import { Pressable, Text, View } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { WorkoutState } from "../../../../hooks/WorkoutSessionContext";
import { Bars3BottomLeftIcon, PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline";
import { styles } from "./styles";
import { useEffect, useMemo, useRef, useState } from "react";
import ReorderSetsModal from "../sets-editor/reorder-sets/ReorderSetsModal";
import NotesModal from "../../notes-modal/NotesModal";
import SetsEditor from "../sets-editor/SetsEditor";
import { UnitType } from "../../../../libs/types/common/UnitType";
import { workoutSuggestionApi } from "../../../../services/api/workouts/workoutSuggestionApi";
import { formatSuggestionValues } from "../../../../libs/helpers/formatSuggestionValues";
import { WorkoutSuggestionType } from "../../../../libs/types/workouts/WorkoutSuggestionType";

type SelectedExercisesListProps = {
    session: WorkoutState["session"];
    reorderExercises: WorkoutState["reorderExercises"];
    removeExercise: WorkoutState["removeExercise"];
    reorderSets: WorkoutState["reorderSets"];
    updateExerciseNotes: WorkoutState["updateExerciseNotes"];
    updateSetNotes: WorkoutState["updateSetNotes"];
    weightUnitType: UnitType;
    errors: Partial<Record<string, string>>;
    scrollToExerciseIndex: number | null;
    clearExerciseErrors: (exerciseId: string) => void;
    clearSetErrors: (exerciseId: string, setId: string) => void;
}

export default function SelectedExercisesList({ session, reorderExercises, removeExercise, reorderSets, updateExerciseNotes, updateSetNotes, weightUnitType, errors, scrollToExerciseIndex, clearExerciseErrors, clearSetErrors }: SelectedExercisesListProps) {
    const listRef = useRef<any>(null);
    const [suggestionsByExerciseId, setSuggestionsByExerciseId] = useState<Record<string, WorkoutSuggestionType | null>>({});

    const [setsModal, setSetsModal] = useState<{
        exerciseId: string;
        exerciseName: string;
        sets: any[];
    } | null>(null);

    const [notesTarget, setNotesTarget] = useState<
        null
        | {
            type: "exercise";
            exerciseId: string;
            title: string;
            value?: string;
        }
        | {
            type: "set";
            exerciseId: string;
            setId: string;
            title: string;
            value?: string;
        }
    >(null);

    useEffect(() => {
        if (scrollToExerciseIndex == null) return;

        requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
                index: scrollToExerciseIndex,
                animated: true,
            });
        });
    }, [scrollToExerciseIndex]);

    const exerciseIdsKey = useMemo(() => {
        const uniqueIds = Array.from(
            new Set((session?.exercises ?? []).map((exercise) => String(exercise.exerciseId)).filter(Boolean))
        ).sort();

        return uniqueIds.join("|");
    }, [session?.exercises]);

    useEffect(() => {
        if (!exerciseIdsKey) {
            setSuggestionsByExerciseId({});
            return;
        }

        const exerciseIds = exerciseIdsKey.split("|").filter(Boolean);
        let cancelled = false;

        // Keep only currently visible exercise keys before adding refreshed values.
        setSuggestionsByExerciseId((prev) => {
            const next: Record<string, WorkoutSuggestionType | null> = {};
            for (const id of exerciseIds) {
                if (id in prev) next[id] = prev[id];
            }
            return next;
        });

        const fetchSuggestions = async () => {
            const entries = await Promise.all(
                exerciseIds.map(async (exerciseId) => {
                    const numericExerciseId = Number(exerciseId);
                    if (!Number.isInteger(numericExerciseId) || numericExerciseId <= 0) {
                        return [exerciseId, null] as const;
                    }

                    try {
                        const suggestion = await workoutSuggestionApi(numericExerciseId);
                        return [exerciseId, suggestion] as const;
                    } catch {
                        return [exerciseId, null] as const;
                    }
                })
            );

            if (cancelled) return;

            setSuggestionsByExerciseId((prev) => {
                const next = { ...prev };
                for (const [exerciseId, suggestion] of entries) {
                    next[exerciseId] = suggestion;
                }
                return next;
            });
        };

        fetchSuggestions();
        return () => { cancelled = true; };
    }, [exerciseIdsKey]);

    return (
        <>
            <DraggableFlatList
                ref={listRef}
                data={session?.exercises ?? []}
                keyExtractor={(item) => item.id}
                onDragEnd={async ({ data }) => await reorderExercises(data)}
                contentContainerStyle={{ marginVertical: 10, paddingTop: 40, paddingBottom: 180, gap: 10 }}
                activationDistance={12}

                ListEmptyComponent={
                    <View style={styles.noExercises}>
                        <Text style={styles.noExercisesText}>
                            {!session ? "Start a workout to add exercises." : "No exercises added yet."}
                        </Text>
                    </View>
                }

                renderItem={({ item, drag, isActive }: RenderItemParams<any>) => {
                    const getErrors = (setId: string, field: "reps" | "weight" | "durationSeconds") =>
                        errors[`exercisesById.${String(item.id)}.setsById.${String(setId)}.${field}`];
                    const suggestion = suggestionsByExerciseId[String(item.exerciseId)];

                    return (
                        <Pressable onLongPress={drag} disabled={isActive} style={[styles.exerciseCard, isActive && styles.exerciseCardActive]}>

                            <View style={styles.exerciseCardTop}>
                                {/* EXERCISE NAME */}
                                <View style={styles.exerciseNameWrap}>
                                    <Text style={styles.exerciseName}>{item.name}</Text>
                                    {suggestion && (
                                        <View style={styles.suggestionContainer}>
                                            <Text style={styles.suggestionTitle}>Suggestion:</Text>
                                            <Text style={styles.suggestionText}>
                                                {suggestion.message}
                                            </Text>
                                            <Text style={styles.suggestionValues}>
                                                {formatSuggestionValues(suggestion, item.exerciseType, weightUnitType)}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.exerciseCardTopButtons}>

                                    <Pressable
                                        onPress={() =>
                                            setNotesTarget({
                                                type: "exercise",
                                                exerciseId: String(item.id),
                                                title: `${item.name} notes`,
                                                value: item.notes,
                                            })
                                        }
                                        style={({ pressed }) => [styles.notesButton, pressed && styles.notesButtonPressed]}
                                    >
                                        <PencilSquareIcon size={24} color="white" strokeWidth={2} />
                                    </Pressable>

                                    {/* REORDER SETS */}
                                    {item.sets.length > 1 && (
                                        <Pressable
                                            onPress={() => setSetsModal({ exerciseId: item.id, exerciseName: item.name, sets: item.sets })}
                                            style={({ pressed }) => [styles.reorderSets, pressed && styles.reorderSetsPressed]}
                                        >
                                            <Bars3BottomLeftIcon size={24} color="white" strokeWidth={2} />
                                        </Pressable>
                                    )}

                                    {/* DELETE EXERCISE */}
                                    <Pressable
                                        onPress={async () => {
                                            clearExerciseErrors(String(item.id));
                                            await removeExercise(String(item.id));
                                        }}
                                        style={({ pressed }) => [styles.exerciseDelete, pressed && styles.exerciseDeletePressed]}
                                    >
                                        <TrashIcon size={24} color="white" strokeWidth={2} />
                                    </Pressable>
                                </View>
                            </View>

                            {/* SETS EDITOR */}
                            <SetsEditor
                                exerciseType={item.exerciseType}
                                weightUnitType={weightUnitType}
                                sets={item.sets}
                                onChangeSets={async (nextSets) => { await reorderSets(item.id, nextSets) }}
                                errors={getErrors}
                                onDeleteSet={(setId) => clearSetErrors(String(item.id), String(setId))}
                                onEditSetNotes={(setId, setIndex, currentValue) => {
                                    setNotesTarget({
                                        type: "set",
                                        exerciseId: String(item.id),
                                        setId: String(setId),
                                        title: `${item.name} SET ${setIndex + 1} NOTES `,
                                        value: currentValue,
                                    });
                                }}
                            />
                        </Pressable>
                    )
                }}
            />

            <ReorderSetsModal
                visible={!!setsModal}
                title={setsModal?.exerciseName ?? "Reorder sets"}
                sets={setsModal?.sets ?? []}
                onClose={() => setSetsModal(null)}
                onSave={async (nextSets) => {
                    if (!setsModal) return;
                    await reorderSets(setsModal.exerciseId, nextSets);
                    setSetsModal(null);
                }}
            />

            <NotesModal
                visible={!!notesTarget}
                title={notesTarget?.title ?? ""}
                value={notesTarget?.value}
                onClose={() => setNotesTarget(null)}
                onSave={(next) => {
                    if (!notesTarget) return;

                    if (notesTarget.type === "exercise") {
                        updateExerciseNotes(notesTarget.exerciseId, next);
                    } else {
                        updateSetNotes(notesTarget.exerciseId, notesTarget.setId, next);
                    }

                    setNotesTarget(null);
                }}
            />
        </>
    );
}
