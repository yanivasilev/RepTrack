import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "../../../components/buttons/BackButton";
import { WorkoutsParamList } from "../../../navigation/WorkoutsNavigator";
import { useCallback, useState } from "react";
import { getWorkoutApi } from "../../../services/api/workouts/getWorkoutApi";
import { WorkoutDetailsType } from "../../../libs/types/workouts/workout-details/WorkoutDetailsType";
import ExercisesList from "../../../components/workouts/workout-details/exercises-list/ExercisesList";
import NotesWorkoutButton from "../../../components/workouts/NotesWorkoutButton";
import { formatSeconds } from "../../../libs/helpers/time/formatSeconds";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { styles } from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import DeleteWorkoutDetailsButton from "../../../components/workouts/workout-details/DeleteWorkoutDetailsButton";
import { deleteWorkoutApi } from "../../../services/api/workouts/deleteWorkoutApi";
import FeedbackModal from "../../../components/FeedbackModal";
import { UnitType } from "../../../libs/types/common/UnitType";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";

type Props = NativeStackScreenProps<WorkoutsParamList, "WorkoutDetails">;

export default function WorkoutDetailsScreen({ route, navigation }: Props) {
    const { id } = route.params;

    const [workout, setWorkout] = useState<WorkoutDetailsType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
    const [goBackAfterFeedback, setGoBackAfterFeedback] = useState(false);
    const [weightUnitType, setWeightUnitType] = useState<UnitType>("METRIC");

    const fetchWorkout = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getWorkoutApi(id);

            if (!res.workout) {
                setWorkout(null);
                setError("Workout not found.");
            } else {
                setWorkout(res.workout);
            }
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchWorkout();
            (async () => {
                try {
                    const profile = await getProfileApi();
                    setWeightUnitType(profile.weightUnitType ?? "METRIC");
                } catch {
                    setWeightUnitType("METRIC");
                }
            })();
        }, [fetchWorkout])
    );

    if (loading) return <Loading navigation={navigation} message="Loading workout..." />;

    if (deleting) return <Loading navigation={navigation} message="Deleting workout..." />;

    if (error || !workout) return <Error navigation={navigation} error={error ?? "Something went wrong."} />;

    const date = new Date(workout.startedAt).toLocaleDateString();
    const duration = formatSeconds(workout.durationSeconds);

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* TITLE */}
                <View style={{ paddingTop: 35 }}>
                    <Text style={styles.title}>{date}</Text>
                    <Text style={styles.subtitle}>Duration:
                        <Text style={styles.duration}> {duration}</Text>
                    </Text>
                </View>

                {/* NOTES BUTTON */}
                <NotesWorkoutButton mode="history" notes={workout.notes} />

                {/* DELETE BUTTON */}
                <DeleteWorkoutDetailsButton
                    onDelete={async () => {
                        setDeleting(true);
                        try {
                            const res = await deleteWorkoutApi(id);
                            setFeedback({
                                text: res.message ?? "Workout deleted.",
                                success: true,
                            });
                            setGoBackAfterFeedback(true);
                        } catch (e: any) {
                            setFeedback({
                                text: e?.message ?? "Deleting workout failed.",
                                success: false,
                            });
                        } finally {
                            setDeleting(false);
                        }
                    }}
                    disabled={deleting}
                />

                {/* EXERCISES LIST */}
                <ExercisesList exercises={workout.exercises} weightUnitType={weightUnitType} />
            </View>

            <FeedbackModal
                visible={Boolean(feedback)}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => {
                    setFeedback(null);
                    if (goBackAfterFeedback) {
                        setGoBackAfterFeedback(false);
                        navigation.goBack();
                    }
                }}
            />
        </SafeAreaView >
    );
}
