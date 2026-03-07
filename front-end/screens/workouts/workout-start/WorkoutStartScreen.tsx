import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getElapsedMs } from "../../../libs/storage/workoutSession";
import { useCallback, useEffect, useState } from "react";
import { useWorkout } from "../../../hooks/WorkoutSessionContext";
import { formatToWorkoutTimer } from "../../../libs/helpers/time/formatToWorkoutTimer";
import BackButton from "../../../components/buttons/BackButton";
import { toSaveWorkoutPayload } from "../../../libs/mappers/toSaveWorkoutPayload";
import { toClientErrors } from "../../../libs/mappers/toClientErrors";
import DeleteWorkoutButton from "../../../components/workouts/workout-start/DeleteWorkoutButton";
import NotesWorkoutButton from "../../../components/workouts/NotesWorkoutButton";
import { WorkoutsParamList } from "../../../navigation/WorkoutsNavigator";
import { styles } from "./styles";
import Button from "../../../components/buttons/Button";
import { SubmitWorkoutStart } from "../../../components/workouts/workout-start/SubmitWorkoutStart";
import SelectedExercisesList from "../../../components/workouts/workout-start/selected-exercises-list/SelectedExercisesList";
import Controls from "../../../components/workouts/workout-start/controls/Controls";
import AddExercise from "../../../components/workouts/workout-start/add-exercise/AddExercise";
import FeedbackModal from "../../../components/FeedbackModal";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import { UnitType } from "../../../libs/types/common/UnitType";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";
import { useFocusEffect } from "@react-navigation/native";
import { Badge } from "../../../libs/types/badges/Badge";

type Props = NativeStackScreenProps<WorkoutsParamList, "WorkoutStart">;

export default function WorkoutStartScreen({ navigation }: Props) {
    const { session, pause, reset, addExercise, removeExercise, reorderExercises, reorderSets, getFinalMs, updateExerciseNotes, updateSetNotes, updateSessionNotes } = useWorkout();
    const [now, setNow] = useState(Date.now());

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const [feedback, setFeedback] = useState<{ text: string; success: boolean; badges?: Badge[] } | null>(null);
    const [goBackAfterFeedback, setGoBackAfterFeedback] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [weightUnitType, setWeightUnitType] = useState<UnitType>("METRIC");

    const [openExerciseModal, setOpenExerciseModal] = useState(false);

    const [scrollToExerciseIndex, setScrollToExerciseIndex] = useState<number | null>(null);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(id);
    }, []);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            const fetchWeightUnitType = async () => {
                try {
                    const profile = await getProfileApi();
                    if (!cancelled) setWeightUnitType(profile.weightUnitType ?? "METRIC");
                } catch {
                    if (!cancelled) setWeightUnitType("METRIC");
                }
            };

            fetchWeightUnitType();
            return () => { cancelled = true; };
        }, [])
    );

    const elapsed = session ? getElapsedMs(session, now) : 0;
    const timer = formatToWorkoutTimer(elapsed);

    const clearSetErrors = (exerciseId: string, setId: string) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[`exercisesById.${exerciseId}.setsById.${setId}.reps`];
            delete next[`exercisesById.${exerciseId}.setsById.${setId}.weight`];
            delete next[`exercisesById.${exerciseId}.setsById.${setId}.durationSeconds`];
            return next;
        });
    };

    const clearExerciseErrors = (exerciseId: string) => {
        setErrors((prev) => {
            const next: Partial<Record<string, string>> = {};
            const prefix = `exercisesById.${exerciseId}.`;
            for (const k of Object.keys(prev)) {
                if (!k.startsWith(prefix)) next[k] = prev[k]!;
            }
            return next;
        });
    };

    const handleSaveWorkoutPress = async () => {
        setErrors({});
        if (!session) return false;

        const finalMs = session.status === "running"
            ? getElapsedMs(session, Date.now())
            : getFinalMs();

        if (finalMs == null) return false;

        if (session.status === "running") {
            try {
                await pause();
            } catch {
                // Fallback to submitting with the captured finalMs.
            }
        }

        const payload = toSaveWorkoutPayload(session, finalMs);

        setSubmitting(true);
        setFeedback(null);
        let res: Awaited<ReturnType<typeof SubmitWorkoutStart>> | null = null;
        try {
            res = await SubmitWorkoutStart({ data: payload });
        } catch (e: any) {
            setFeedback({
                text: e?.message ?? "Save workout failed.",
                success: false,
            });
            return false;
        } finally {
            setSubmitting(false);
        }

        if (!res) {
            setFeedback({
                text: "Save workout failed.",
                success: false,
            });
            return false;
        }

        if (!res.success) {
            const hasFieldErrors = res.errors && Object.keys(res.errors).length > 0;

            if (hasFieldErrors) {
                const clientErrors = toClientErrors(session, res.errors ?? {});
                setErrors(clientErrors);

                const firstError = Object.keys(res.errors ?? {})[0];
                const match = firstError?.match(/^exercises\.(\d+)\./);
                const exerciseIndex = match ? Number(match[1]) : null;

                if (exerciseIndex != null) {
                    setScrollToExerciseIndex(exerciseIndex);

                    setTimeout(() => setScrollToExerciseIndex(null), 0);
                }

                return false;
            }

            setFeedback({
                text: res.message,
                success: false,
            });

            return false;
        }

        setFeedback({
            text: res.message ?? "Workout saved successfully.",
            success: true,
            badges: res.data.newBadges ?? [],
        });
        setGoBackAfterFeedback(true);

        return true;
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* NOTES BUTTON */}
                {session && (
                    <NotesWorkoutButton
                        mode="session"
                        session={session}
                        onSave={async (next) => {
                            await updateSessionNotes(next);
                        }}
                    />
                )}

                {/* DELETE BUTTON */}
                <DeleteWorkoutButton navigation={navigation} />

                {/* SELECTED EXERCISES LIST */}
                <SelectedExercisesList
                    session={session}
                    reorderExercises={reorderExercises}
                    removeExercise={removeExercise}
                    reorderSets={reorderSets}
                    updateExerciseNotes={updateExerciseNotes}
                    updateSetNotes={updateSetNotes}
                    weightUnitType={weightUnitType}
                    errors={errors}
                    scrollToExerciseIndex={scrollToExerciseIndex}
                    clearExerciseErrors={clearExerciseErrors}
                    clearSetErrors={clearSetErrors}
                />

                {/* BOTTOM BUTTONS */}
                <View style={styles.bottom}>
                    {/* CONTROLS */}
                    <Controls timer={timer} onSaveWorkout={handleSaveWorkoutPress} />

                    {/* ADD EXERCISE */}
                    <Button Icon={PlusCircleIcon} label="ADD EXERCISE" disabled={openExerciseModal || !session} onPress={() => setOpenExerciseModal(true)} />
                </View>

                {/* ADD EXERCISE MODAL */}
                <AddExercise
                    visible={openExerciseModal}
                    onClose={() => setOpenExerciseModal(false)}
                    onSelect={async (exercise) => {
                        await addExercise(String(exercise.id), exercise.name, exercise.exerciseType);
                    }}
                    selectedExercises={new Set((session?.exercises ?? []).map((e) => String(e.exerciseId ?? e.id)))}
                />
            </View>

            <FeedbackModal
                visible={Boolean(feedback) || submitting}
                loading={submitting}
                loadingMessage="Saving workout..."
                message={feedback?.text}
                success={feedback?.success}
                badges={feedback?.success ? feedback?.badges : []}
                onClose={async () => {
                    setFeedback(null);
                    if (goBackAfterFeedback) {
                        setGoBackAfterFeedback(false);
                        try {
                            await reset();
                        } catch {
                        }
                        navigation.navigate("WorkoutDashboard");
                    }
                }}
            />
        </SafeAreaView>
    );
}
