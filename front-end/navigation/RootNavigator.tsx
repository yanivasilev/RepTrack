import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { useAuth } from "../hooks/authContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator, { AppStackParamList } from "./AppNavigator";
import { WorkoutProvider } from "../hooks/WorkoutSessionContext";
import { useState } from "react";
import FloatingWorkoutTimer from "../components/workouts/workout-start/FloatingWorkoutTimer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function getActiveRouteName(state: any): string | undefined {
    if (!state) return undefined;
    const route = state.routes[state.index];
    if (route?.state) return getActiveRouteName(route.state);
    return route?.name;
}

// DECIDES WHICH NAVIGATOR TO RENDER DEPENDING ON IF USE IS LOGGED IN
export default function RootNavigator() {
    const { accessToken, isLoading } = useAuth();
    const navigationRef = useNavigationContainerRef<AppStackParamList>();
    const [currentRoute, setCurrentRoute] = useState<string | undefined>();

    if (isLoading) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer
                ref={navigationRef}
                onReady={() => { setCurrentRoute(getActiveRouteName(navigationRef.getRootState())) }}
                onStateChange={() => { setCurrentRoute(getActiveRouteName(navigationRef.getRootState())) }}
            >
                {accessToken ?
                    <WorkoutProvider>
                        {currentRoute !== "WorkoutStart" && (
                            <FloatingWorkoutTimer
                                onPress={() => {
                                    if (navigationRef.isReady()) {
                                        navigationRef.navigate("Tabs", {
                                            screen: "WorkoutDashboard",
                                            params: {
                                                screen: "WorkoutStart",
                                            },
                                        });
                                    }
                                }}
                            />
                        )}
                        <AppNavigator />
                    </WorkoutProvider>
                    :
                    <AuthNavigator />}

            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
