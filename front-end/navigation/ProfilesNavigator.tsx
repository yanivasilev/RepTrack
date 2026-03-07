import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ChangeUsernameScreen from "../screens/settings/username/ChangeUsernameScreen";
import ChangePasswordScreen from "../screens/settings/password/ChangePasswordScreen";
import ChangeDetailsScreen from "../screens/settings/details/ChangeDetailsScreen";
import ProfileScreen from "../screens/profiles/profile/ProfileScreen";
import UserProfileScreen from "../screens/profiles/user-profile/UserProfileScreen";

export type ProfilesParamList = {
    Profile: {
        activityMode?: "threads" | "replies";
    } | undefined;
    UserProfile: {
        userId: number;
        source?: "threads" | "threadDetails" | "threadsSearch" | "profile";
        threadId?: number;
        activityMode?: "threads" | "replies";
    };
    Settings: undefined;
    ChangeUsername: undefined;
    ChangePassword: undefined;
    ChangeDetails: undefined;
};

const Stack = createNativeStackNavigator<ProfilesParamList>();

export default function ProfilesNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="ChangeDetails" component={ChangeDetailsScreen} />
        </Stack.Navigator>
    );
}
