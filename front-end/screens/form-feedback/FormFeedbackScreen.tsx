import { useState } from "react";
import { View, Text, Pressable, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./styles";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../../navigation/TabNavigator";
import SearchBar from "../../components/form-feedback/search-bar/SearchBar";
import ExercisesList from "../../components/form-feedback/exercises-list/ExercisesList";
import { CompositeScreenProps } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Exercise } from "../../libs/types/exercise";
import { EXERCISES } from "../../libs/data/exercises";
import UploadVideoButton from "../../components/form-feedback/upload-video-button/UploadVideoButton";
import { analysePushupsApi } from "../../services/api/form-feedback/AnalysePushUpsApi";

type Props = CompositeScreenProps<
    BottomTabScreenProps<AppTabParamList, "FormFeedback">,
    NativeStackScreenProps<AppStackParamList>
>;

export default function FormFeedbackScreen({ navigation }: Props) {
    const [query, setQuery] = useState("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const [loading, setLoading] = useState(false);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);

    const handleUploadVideoPress = async () => {
        // CHECK IF EXERCISE IS SELECTED
        if (!selectedExercise) {
            setOverlay({
                text: "Please select an exercise first.",
                success: false,
            });
            return;
        }

        // CHECK IF LIBRARY ACCESS IS ALLOWED
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            setOverlay({
                text: "Media library permission denied. Go to settings and turn them on to use this feature.",
                success: false,
            });
            return;
        }

        // OPENNING LIBRARY
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (res.canceled) return;

        const asset = res.assets[0];
        const picked = {
            uri: asset.uri,
            name: asset.fileName ?? `${selectedExercise.id}-${Date.now()}.mp4`,
            type: asset.mimeType ?? "video/mp4",
        };

        setLoading(true);

        // ANALYSING UPLOADED VIDEO
        try {
            const data = await analysePushupsApi(picked);

            navigation.navigate("VideoPreview", {
                videoUri: picked.uri,
                videoName: picked.name,
                exerciseName: selectedExercise.name,
                analysis: data,
            });
        } catch (e: any) {
            if (e?.fieldErrors) {
                const firstMsgRaw = Object.values(e.fieldErrors)[0];
                const firstMsg = typeof firstMsgRaw === "string" ? firstMsgRaw : "Validation failed.";
                setOverlay({ text: firstMsg, success: false });
            } else {
                setOverlay({ text: e?.message ?? "Upload failed.", success: false });
            }
        } finally {
            setLoading(false);
        }
    }

    const isDisabled = !selectedExercise;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={[styles.root, { flex: 1 }]}>
                <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>

                    {/* TITLE */}
                    <Text style={styles.title}>Form Feedback</Text>

                    {/* SEARCH BAR */}
                    <SearchBar query={query} setQuery={setQuery} />
                </View>

                {/* EXERCISES LIST */}
                <ExercisesList
                    query={query}
                    exercises={EXERCISES}
                    selectedExercise={selectedExercise}
                    setSelectedExercise={setSelectedExercise}
                />

                {/* BUTTONS */}
                <View style={styles.bottom}>
                    <View style={{ gap: 10 }}>
                        {!selectedExercise && (
                            <Text style={{ color: "#666", textAlign: "center" }}>
                                Select an exercise to enable recording and uploads.
                            </Text>
                        )}

                        {/* RECORD VIDEO BUTTON */}
                        <Pressable
                            disabled={isDisabled}
                            onPress={() => console.log("START RECORDING")}
                            style={({ pressed }) => [
                                {
                                    paddingVertical: 14,
                                    borderRadius: 14,
                                    alignItems: "center",
                                    backgroundColor: isDisabled
                                        ? "#CFCFCF"
                                        : pressed
                                            ? "darkgreen"
                                            : "green",
                                    opacity: isDisabled ? 0.6 : 1,
                                },
                            ]}
                        >
                            <Text style={{ color: isDisabled ? "#888" : "white", fontWeight: "900" }}>
                                START RECORDING
                            </Text>
                        </Pressable>

                        {/* UPLOAD VIDEO BUTTON */}
                        <UploadVideoButton
                            isDisabled={isDisabled}
                            onPress={handleUploadVideoPress}
                        />
                    </View>
                </View>
            </View>

            {/* FEEDBACK MESSAGE */}
            {(overlay || loading) && (
                <Modal
                    visible={true}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOverlay(null)} // ANDROID BACK BUTTON
                >
                    <View style={styles.overlay}>
                        <View style={!loading && styles.box}>
                            {loading ? (
                                <View style={{ gap: 10, margin: 10 }}>
                                    <ActivityIndicator size="large" color="#22c55e" />
                                    <Text style={{ textAlign: "center", fontWeight: "500", color: "#22c55e", fontSize: 18 }}>Processing your video. This may take a moment.</Text>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        { color: overlay?.success ? "green" : "red" },
                                    ]}
                                >
                                    {overlay?.text}
                                </Text>
                            )}

                            {!loading && (
                                <Pressable onPress={() => setOverlay(null)} style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}>
                                    <Text style={styles.closeText}>CLOSE</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}
