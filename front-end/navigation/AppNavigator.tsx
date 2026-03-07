import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator, { AppTabParamList } from "./TabNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";

export type AppStackParamList = {
    Tabs: NavigatorScreenParams<AppTabParamList>;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}
