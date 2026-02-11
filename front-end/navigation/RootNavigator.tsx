import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../hooks/authContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

// DECIDES WHICH NAVIGATOR TO RENDER DEPENDING ON IF USE IS LOGGED IN
export default function RootNavigator() {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) return null;

    return (
        <NavigationContainer key={accessToken ? "app" : "auth"}>
            {accessToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
