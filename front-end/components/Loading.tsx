import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./buttons/BackButton";
import { ActivityIndicator, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";

type LoadingProps = {
    navigation?: NativeStackNavigationProp<ParamListBase>;
    message?: string;
}

export default function Loading({ navigation, message }: LoadingProps) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {navigation && (<BackButton navigation={navigation} />)}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="green" />
                    <Text style={{ color: "green" }}>{message ?? "Loading..."}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}