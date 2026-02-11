import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { Pressable } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

type BackButtonProps = {
    navigation: NativeStackNavigationProp<ParamListBase>;
};

export default function BackButton({ navigation }: BackButtonProps) {
    return (
        <Pressable
            onPress={() => navigation.goBack()}
            style={{
                position: "absolute",
                left: 16,
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
            <ArrowLeftIcon size={24} color="white" />
        </Pressable>
    );
}