import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ChangeUsernameScreen from "../screens/settings/username/ChangeUsernameScreen";
import ChangePasswordScreen from "../screens/settings/password/ChangePasswordScreen";
import ChangeDetailsScreen from "../screens/settings/details/ChangeDetailsScreen";
import VideoPreviewScreen from "../screens/form-feedback/video-preview/VideoPreviewScreen";
import { AnalyzePushupsSuccess, PushupFeedbackCode } from "../services/api/form-feedback/AnalysePushUpsApi";

export type AppStackParamList = {
    Tabs: undefined;
    Settings: undefined;
    ChangeUsername: undefined;
    ChangePassword: undefined;
    ChangeDetails: undefined;
    VideoPreview: {
        videoUri: string;
        videoName?: string;
        exerciseName?: string;
        analysis: AnalyzePushupsSuccess;
    };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="ChangeDetails" component={ChangeDetailsScreen} />
            <Stack.Screen name="VideoPreview" component={VideoPreviewScreen} />
        </Stack.Navigator>
    );
}
