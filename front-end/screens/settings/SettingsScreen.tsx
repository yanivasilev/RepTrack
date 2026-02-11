import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './styles';
import LogoutButton from '../../components/settings/LogoutButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton';
import { Row } from '../../components/settings/Row';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { ChangeAvatarButton } from '../../components/settings/avatar/ChangeAvatarButton';

type Props = NativeStackScreenProps<AppStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Settings</Text>

                <View style={styles.container}>
                    {/* TOP PART */}
                    <View style={styles.card}>
                        <Row title="Change username" onPress={() => navigation.navigate("ChangeUsername")} />
                        <ChangeAvatarButton />
                        <Row title="Change password" onPress={() => navigation.navigate("ChangePassword")} />
                        <Row title="Change details" subtitle="Weight, experience level, fitness goal..." onPress={() => navigation.navigate("ChangeDetails")} />
                    </View>

                    {/* BOTTOM PART */}
                    <View style={styles.footer}>
                        <LogoutButton />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
