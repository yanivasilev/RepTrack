import { View, Text, Pressable, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import UnderlineButton from "../../components/UnderlineButton";
import Button from "../../components/Button";
import Banner from "../../components/Banner";
import { styles } from "./styles";
import BackButton from "../../components/BackButton";
import LoginForm from "../../components/login/LoginForm";
import { useAuth } from "../../hooks/authContext";
import { useFocusEffect } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { LoginPayload } from "../../services/api/auth/loginApi";
import { SubmitLogin } from "../../components/login/SubmitLogin";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

// DEFAULT LOGIN DATA
const initialLoginData: LoginPayload = {
    email: "",
    password: ""
};

export default function LoginScreen({ navigation }: Props) {
    // RUNS WHEN SCREEN IS UNFOCUSED OR REMOVED
    useFocusEffect(
        useCallback(() => {
            return () => {
                setData(initialLoginData);
                setErrors({});
                setOverlay(null);
            };
        }, [])
    );

    const { signIn } = useAuth();

    const [data, setData] = useState<LoginPayload>(initialLoginData);

    const updateData = (fields: Partial<LoginPayload>) => {
        setData((prev) => ({ ...prev, ...fields }));

        setErrors((prev) => {
            const next = { ...prev };
            (Object.keys(fields) as (keyof LoginPayload)[]).forEach((k) => {
                delete next[k];
            });
            return next;
        });
    };

    // OVERLAY MESSAGE TO GIVE LOGIN API FEEDBACK
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginPayload, string>>>({});

    const handleLoginPress = async () => {
        setLoading(true);
        setErrors({});

        // SUBMITS LOGIN FORM
        const res = await SubmitLogin({ data });

        setLoading(false);

        // CHECKS IF LOGIN IS SUCCESSFUL
        if (!res.success) {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                setOverlay({
                    text: res.message ?? "Login failed.",
                    success: false,
                });
            }
            return;
        }

        // LOGIN WAS SUCCESSFUL
        await signIn(res.accessToken);

        setOverlay({
            text: "Logging you in...",
            success: true,
        });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* BANNER */}
                <Banner />

                {/* HEADING */}
                <Text style={styles.heading}>LOGIN</Text>

                {/* CONTENT */}
                <LoginForm
                    data={data}
                    setData={updateData}
                    errors={errors}
                />
            </View>

            {/* BUTTONS */}
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{ rowGap: 15 }}>
                    <UnderlineButton label="Forgot password?" onPress={() => navigation.navigate("ForgotPassword")} />
                    <Button label="LOGIN" onPress={() => handleLoginPress()} />
                </View>
            </View>

            {/* FEEDBACK MESSAGE */}
            {(overlay || loading) && (
                <Modal
                    visible={true}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOverlay(null)} // ANDROID BACK BUTTON
                >
                    <View style={styles.overlay}>
                        <View style={!loading && styles.box}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#22c55e" />
                            ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        { color: overlay?.success ? "green" : "red" },
                                    ]}>
                                    {overlay?.text}
                                </Text>
                            )}

                            {!loading && (
                                <Pressable onPress={() => setOverlay(null)} style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}>
                                    <Text style={styles.closeText}>CLOSE</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}