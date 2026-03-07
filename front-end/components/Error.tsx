import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./buttons/BackButton";
import { Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";

type ErrorProps = {
    navigation?: NativeStackNavigationProp<ParamListBase>;
    error: string;
}

export default function Error({ navigation, error }: ErrorProps) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {navigation && (<BackButton navigation={navigation} />)}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "red" }}>{error}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}