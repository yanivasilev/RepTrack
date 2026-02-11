import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/main/MainScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { HomeIcon as HomeOutline, UserIcon as UserOutline, VideoCameraIcon as VideoCameraOutline } from "react-native-heroicons/outline";
import { HomeIcon as HomeSolid, UserIcon as UserSolid, VideoCameraIcon as VideoCameraSolid } from "react-native-heroicons/solid";
import FormFeedbackScreen from "../screens/form-feedback/FormFeedbackScreen";

export type AppTabParamList = {
    Main: undefined;
    FormFeedback: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = {
                        Main: focused ? HomeSolid : HomeOutline,
                        Profile: focused ? UserSolid : UserOutline,
                        FormFeedback: focused ? VideoCameraSolid : VideoCameraOutline,
                    } as const;

                    const Icon = icons[route.name];
                    return <Icon size={size} color={color} />;
                },
                tabBarStyle: { backgroundColor: "green" },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
            })}
        >
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="FormFeedback" component={FormFeedbackScreen} options={{ tabBarLabel: "Form Feedback" }} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
