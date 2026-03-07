import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "../../../components/buttons/BackButton";
import { styles } from "./styles";
import AnalysisSummary from "../../../components/video-preview/analysis-summary/AnalysisSummary";
import { FormFeedbackParamList } from "../../../navigation/FormFeedbackNavigator";
import KeypointsButton from "../../../components/video-preview/KeypointsButton";
import { getDrawBox } from "../../../libs/helpers/video-preview/getDrawBox";
import KeypointsOverlay from "../../../components/video-preview/KeypointsOverlay";
import Error from "../../../components/Error";

type Props = NativeStackScreenProps<FormFeedbackParamList, "VideoPreview">;

export default function VideoPreviewScreen({ route, navigation }: Props) {
    const { videoUri, videoName, exerciseName, analysis } = route.params;
    const [currentTime, setCurrentTime] = useState(0);
    const [videoContainer, setVideoContainer] = useState({ width: 0, height: 0 });
    const [showKeypoints, setShowKeypoints] = useState(true);

    const error = useMemo(() => {
        if (!videoUri) return "Missing video source.";
        if (!analysis) return "Missing analysis result.";
        if (!analysis.poseFrames || analysis.poseFrames.length === 0) return "No pose frames found for this video.";

        return null;
    }, [analysis, videoUri]);

    const processingTime = (analysis?.timingsMs?.total ?? 0) / 1000;

    const currentFrame = useMemo(() => {
        if (!analysis?.poseFrames?.length || !analysis?.fps) return null;
        const idx = Math.max(0, Math.min(analysis.poseFrames.length - 1, Math.floor(currentTime * analysis.fps)));
        return analysis.poseFrames[idx] ?? null;
    }, [analysis, currentTime]);

    const drawBox = useMemo(() => {
        return getDrawBox(
            analysis?.poseMeta?.frameWidth ?? 1,
            analysis?.poseMeta?.frameHeight ?? 1,
            videoContainer
        );
    }, [analysis, videoContainer]);

    function onVideoLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        setVideoContainer({ width, height });
    }

    function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
        if (!status.isLoaded) return;
        setCurrentTime((status.positionMillis ?? 0) / 1000);
    }

    if (error) return <Error navigation={navigation} error={error} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={[styles.root]}>
                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* KEYPOINTS BUTTON */}
                <KeypointsButton showKeypoints={showKeypoints} onPress={() => setShowKeypoints(prev => !prev)} />

                {/* TITLE */}
                <Text style={styles.title}>Video Preview</Text>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    {/* VIDEO */}
                    <View onLayout={onVideoLayout} style={styles.videoContainer}>
                        <Video
                            source={{ uri: videoUri }}
                            style={styles.videoSize}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            isLooping
                            progressUpdateIntervalMillis={33}
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        />

                        <KeypointsOverlay frame={currentFrame} drawBox={drawBox} showKeypoints={showKeypoints} />
                    </View>

                    {/* SELECTED EXERCISE NAME */}
                    <Text style={styles.text}>
                        Exercise:{" "}
                        <Text style={styles.value}>
                            {exerciseName}
                        </Text>
                    </Text>

                    {/* SELECTED VIDEO NAME */}
                    <Text style={styles.text}>
                        Video file name:{" "}
                        <Text style={styles.value}>
                            {videoName}
                        </Text>
                    </Text>

                    {/* SELECTED VIDEO PROCCESSING TIME */}
                    <Text style={styles.text}>
                        Processing time:{" "}
                        <Text style={styles.value}>
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
