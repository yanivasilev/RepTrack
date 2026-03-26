import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import ExercisesList from "../../components/common/exercises-list/ExercisesList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Exercise } from "../../libs/types/common/exercises/Exercise";
import Button from "../../components/buttons/Button";
import FeedbackModal from "../../components/FeedbackModal";
import { ExerciseAnalysisParamList } from "../../navigation/ExerciseAnalysisNavigator";
import * as ImagePicker from "expo-image-picker";
import { exerciseAnalysisApi } from "../../services/api/exercise-analysis/exerciseAnalysisApi";

type Props = NativeStackScreenProps<ExerciseAnalysisParamList, "ExerciseAnalysisMain">;

const EXERCISE_ANALYSIS_EXERCISES: Exercise[] = [
    {
        id: 1,
        name: "Push-up",
        category: "BODYWEIGHT",
        muscleGroup: "CHEST",
        equipment: "BODYWEIGHT",
        isBodyweight: true,
        exerciseType: "REPS",
        experienceLevel: "BEGINNER",
    },
];

export default function ExerciseAnalysisMainScreen({ navigation }: Props) {
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(EXERCISE_ANALYSIS_EXERCISES[0]);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean; } | null>(null);

    function showFeedback(text: string, success = false) {
        setFeedback({ text, success });
    }

    const handleUploadVideoPress = async () => {
        if (submitting) return;

        if (!selectedExercise) {
            showFeedback("Please select an exercise first.");
            return null;
        }

        setFeedback(null);

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                showFeedback("Media library permission denied. Go to settings and turn them on to use this feature.");
                return null;
            }

            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["videos"],
                videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
            });

            if (res.canceled || !res.assets?.length) {
                showFeedback("No video selected.");
                return null;
            }

            setSubmitting(true);
            setFeedback(null)

            const video = res.assets[0];

            const selectedVideo = {
                uri: video.uri,
                name: video.fileName ?? `${selectedExercise.id}-${Date.now()}.mp4`,
                type: video.mimeType ?? "video/mp4"
            }

            const analysis = await exerciseAnalysisApi(selectedExercise.id, selectedVideo);

            navigation.navigate("VideoPreview", {
                videoUri: video.uri,
                videoName: selectedVideo.name,
                exerciseName: selectedExercise.name,
                analysis,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Something went wrong.";
            showFeedback(message);
            return null;
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>

                {/* TITLE */}
                <Text style={styles.title}>Exercise Analysis</Text>

                {/* EXERCISES LIST */}
                <ExercisesList
                    exercises={EXERCISE_ANALYSIS_EXERCISES}
                    selectedExercise={selectedExercise}
                    setSelectedExercise={setSelectedExercise}
                />

                {/* BUTTONS */}
                <View style={styles.bottom}>
                    {!selectedExercise && (
                        <Text style={styles.selectExerciseText}>
                            Select an exercise to enable recording and uploads.
                        </Text>
                    )}

                    {/* UPLOAD VIDEO BUTTON */}
                    <Button label="UPLOAD VIDEO" disabled={!selectedExercise} onPress={handleUploadVideoPress} />
                </View>
            </View>

            <FeedbackModal
                visible={Boolean(feedback) || submitting}
                loading={submitting}
                loadingMessage="Processing your video. This may take a moment."
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => setFeedback(null)}
            />
        </SafeAreaView >
    );
}
