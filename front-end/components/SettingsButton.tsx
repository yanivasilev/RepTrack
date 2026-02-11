import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { Cog6ToothIcon } from "react-native-heroicons/outline";
import { AppStackParamList } from "../navigation/AppNavigator";

export default function SettingsButton() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

    return (
        <Pressable
            onPress={() => navigation.navigate("Settings")}
            style={{
                position: "absolute",
                right: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "green",
                backgroundColor: "green",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
            }}
            hitSlop={10}
        >
            <Cog6ToothIcon size={24} color="white" />
        </Pressable>
    );
}