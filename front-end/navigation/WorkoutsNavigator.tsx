import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutDashboardScreen from "../screens/workouts/workout-dashboard/WorkoutDashboardScreen";
import WorkoutHistoryScreen from "../screens/workouts/workout-history/WorkoutHistoryScreen";
import WorkoutStartScreen from "../screens/workouts/workout-start/WorkoutStartScreen";
import WorkoutDetailsScreen from "../screens/workouts/workout-details/WorkoutDetailsScreen";

export type WorkoutsParamList = {
    WorkoutDashboard: undefined;
    WorkoutStart: undefined;
    WorkoutHistory: undefined;
    WorkoutDetails: { id: number };
};

const Stack = createNativeStackNavigator<WorkoutsParamList>();

export default function WorkoutsNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="WorkoutDashboard" component={WorkoutDashboardScreen} />
            <Stack.Screen name="WorkoutStart" component={WorkoutStartScreen} />
            <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
            <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
        </Stack.Navigator>
    );
}
