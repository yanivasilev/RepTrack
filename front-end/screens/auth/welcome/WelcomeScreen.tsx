import { View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from '../../../components/auth/welcome/Banner';
import Button from '../../../components/buttons/Button';
import { styles } from './styles';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;


export default function WelcomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BANNER */}
                <Banner />

                <View style={styles.actions}>
                    <View style={styles.actionButton}>
                        <Button label="LOGIN" onPress={() => navigation.navigate("Login")} />
                    </View>
                    <View style={styles.actionButton}>
                        <Button label="REGISTER" onPress={() => navigation.navigate("Register")} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
