import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoPreviewScreen from "../screens/form-feedback/video-preview/VideoPreviewScreen";
import FormFeedbackMainScreen from "../screens/form-feedback/FormFeedbackMainScreen";
import { ApiSuccessFormFeedback } from "../libs/types/api-responds/ApiSuccessFormFeedback";

export type FormFeedbackParamList = {
    FormFeedbackMain: undefined;
    VideoPreview: {
        videoUri: string;
        videoName?: string;
        exerciseName?: string;
        analysis: ApiSuccessFormFeedback;
    };
};

const Stack = createNativeStackNavigator<FormFeedbackParamList>();

export default function FormFeedbackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FormFeedbackMain" component={FormFeedbackMainScreen} />
            <Stack.Screen name="VideoPreview" component={VideoPreviewScreen} />
        </Stack.Navigator>
    );
}
