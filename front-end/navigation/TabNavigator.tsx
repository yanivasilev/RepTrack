import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon as HomeOutline, UserIcon as UserOutline, VideoCameraIcon as VideoCameraOutline, ChartBarIcon as ChartBarOutline } from "react-native-heroicons/outline";
import { HomeIcon as HomeSolid, UserIcon as UserSolid, VideoCameraIcon as VideoCameraSolid, ChartBarIcon as ChartBarSolid } from "react-native-heroicons/solid";
import WorkoutNavigator, { WorkoutsParamList } from "./WorkoutsNavigator";
import { NavigatorScreenParams, StackActions } from "@react-navigation/native";
import ThreadsNavigator, { ThreadsParamList } from "./ThreadsNavigator";
import ProfileNavigator, { ProfilesParamList } from "./ProfilesNavigator";
import FormFeedbackNavigator, { FormFeedbackParamList } from "./FormFeedbackNavigator";

export type AppTabParamList = {
    Threads: NavigatorScreenParams<ThreadsParamList>;
    FormFeedback: NavigatorScreenParams<FormFeedbackParamList>;
    WorkoutDashboard: NavigatorScreenParams<WorkoutsParamList>;
    Profile: NavigatorScreenParams<ProfilesParamList>;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = {
                        Threads: focused ? HomeSolid : HomeOutline,
                        Profile: focused ? UserSolid : UserOutline,
                        FormFeedback: focused ? VideoCameraSolid : VideoCameraOutline,
                        WorkoutDashboard: focused ? ChartBarSolid : ChartBarOutline,
                    } as const;

                    const Icon = icons[route.name];
                    return <Icon size={size} color={color} />;
                },
                tabBarStyle: { backgroundColor: "green" },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
            })}
        >
            <Tab.Screen
                name="Threads"
                component={ThreadsNavigator}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {
                        navigation.navigate(route.name, { screen: "ThreadsMain" });
                    },
                })}
            />

            <Tab.Screen
                name="FormFeedback"
                component={FormFeedbackNavigator}
                options={{ tabBarLabel: "Form Feedback" }}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {
                        navigation.navigate(route.name, { screen: "FormFeedbackMain" });
                    },
                })}
            />

            <Tab.Screen
                name="WorkoutDashboard"
                component={WorkoutNavigator}
                options={{ tabBarLabel: "Workout Dashboard" }}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {
                        navigation.navigate(route.name, { screen: "WorkoutDashboard" });
                    },
                })}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{ tabBarLabel: "Profile" }}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("Profile", { screen: "Profile" });

                        const tabState = navigation.getState();
                        const profileRoute = tabState.routes.find((r) => r.name === route.name) as any;
                        const profileStackKey = profileRoute?.state?.key as string | undefined;

                        if (profileStackKey) {
                            navigation.dispatch({ ...StackActions.popToTop(), target: profileStackKey });
                        }
                    },
                })}
            />
        </Tab.Navigator>
    );
}
