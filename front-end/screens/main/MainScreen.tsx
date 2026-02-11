import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './styles';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../../navigation/TabNavigator';
import React from "react";
import { View } from "react-native";

type Props = BottomTabScreenProps<AppTabParamList, "Main">;

export default function MainScreen({ }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>
            </View>
        </SafeAreaView>
    );
}