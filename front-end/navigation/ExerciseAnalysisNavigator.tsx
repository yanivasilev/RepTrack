import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoPreviewScreen from "../screens/exercise-analysis/video-preview/VideoPreviewScreen";
import { ApiSuccessExerciseAnalysis } from "../libs/types/api-responds/ApiSuccessExerciseAnalysis";
import ExerciseAnalysisMainScreen from "../screens/exercise-analysis/ExerciseAnalysisMainScreen";

export type ExerciseAnalysisParamList = {
    ExerciseAnalysisMain: undefined;
    VideoPreview: {
        videoUri: string;
        videoName?: string;
        exerciseName?: string;
        analysis: ApiSuccessExerciseAnalysis;
    };
};

const Stack = createNativeStackNavigator<ExerciseAnalysisParamList>();

export default function ExerciseAnalysisNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExerciseAnalysisMain" component={ExerciseAnalysisMainScreen} />
            <Stack.Screen name="VideoPreview" component={VideoPreviewScreen} />
        </Stack.Navigator>
    );
}
