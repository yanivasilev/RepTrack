import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import { AppStackParamList } from "../../../navigation/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "../../../components/BackButton";
import { styles } from "./styles";
import { AnalysisSummary } from "../../../components/video-preview/AnalysisSummary";

type Props = NativeStackScreenProps<AppStackParamList, "VideoPreview">;

export default function VideoPreviewScreen({ route, navigation }: Props) {
    const { videoUri, videoName, exerciseName, analysis } = route.params;

    const processingTime = analysis.timingsMs.total / 1000;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={[styles.root, { flex: 1 }]}>
                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* TITLE */}
                <Text style={styles.title}>Video Preview</Text>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* VIDEO */}
                    <View
                        style={{
                            height: 240,
                            borderRadius: 16,
                            overflow: "hidden",
                            backgroundColor: "#000",
                        }}
                    >
                        <Video
                            source={{ uri: videoUri }}
                            style={{ width: "100%", height: "100%" }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            isLooping
                        />
                    </View>

                    {/* SELECTED EXERCISE NAME */}
                    <Text style={{ color: "#666" }}>
                        Exercise:{" "}
                        <Text style={{ fontWeight: "900", color: "green" }}>
                            {exerciseName}
                        </Text>
                    </Text>

                    {/* SELECTED VIDEO NAME */}
                    <Text style={{ color: "#666" }}>
                        Video file name:{" "}
                        <Text style={{ fontWeight: "900", color: "green" }}>
                            {videoName}
                        </Text>
                    </Text>

                    {/* SELECTED VIDEO PROCCESSING TIME */}
                    <Text style={{ color: "#666" }}>
                        Processing time:{" "}
                        <Text style={{ fontWeight: "900", color: "green" }}>
                            {processingTime.toFixed(1)}s
                        </Text>
                    </Text>

                    {/* VIDEO ANALYSIS */}
                    <AnalysisSummary analysis={analysis} />
                </ScrollView>

            </View>
        </SafeAreaView >
    );
}
