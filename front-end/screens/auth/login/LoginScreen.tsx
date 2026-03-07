import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import UnderlineButton from "../../../components/buttons/UnderlineButton";
import Button from "../../../components/buttons/Button";
import Banner from "../../../components/auth/welcome/Banner";
import FeedbackModal from "../../../components/FeedbackModal";
import { styles } from "./styles";
import BackButton from "../../../components/buttons/BackButton";
import LoginForm from "../../../components/auth/login/LoginForm";
import { useAuth } from "../../../hooks/authContext";
import { useFocusEffect } from "@react-navigation/native";
import { AuthStackParamList } from "../../../navigation/AuthNavigator";
import { SubmitLogin } from "../../../components/auth/login/SubmitLogin";
import { LoginFormType } from "../../../libs/types/auth/LoginFormType";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

// DEFAULT LOGIN DATA
const initialLogin: LoginFormType = {
    email: "",
    password: ""
};

export default function LoginScreen({ navigation }: Props) {
    const [data, setData] = useState<LoginFormType>(initialLogin);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormType, string>>>({});

    // RUNS WHEN SCREEN IS UNFOCUSED OR REMOVED
    useFocusEffect(
        useCallback(() => {
            return () => {
                setData(initialLogin);
                setErrors({});
                setOverlay(null);
            };
        }, [])
    );

    const { signIn } = useAuth();

    const updateData = (fields: Partial<LoginFormType>) => {
        setData((prev) => ({ ...prev, ...fields }));

        setErrors((prev) => {
            const next = { ...prev };
            (Object.keys(fields) as (keyof LoginFormType)[]).forEach((k) => {
                delete next[k];
            });
            return next;
        });
    };

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
            } else if (res.requiresEmailVerification) {
                navigation.navigate("EmailVerification", {
                    email: data.email.trim().toLowerCase(),
                    autoSend: true,
                    noticeMessage: res.message,
                    noticeSuccess: false,
                });
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <View style={styles.root}>

                        {/* BACK BUTTON */}
                        <BackButton navigation={navigation} />

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
                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={{ rowGap: 15 }}>
                            <UnderlineButton label="Forgot password?" onPress={() => navigation.navigate("ForgotPassword")} />
                            <Button label="LOGIN" onPress={() => handleLoginPress()} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            <FeedbackModal
                visible={Boolean(overlay) || loading}
                loading={loading}
                loadingMessage="Logging in..."
                message={overlay?.text}
                success={overlay?.success}
                onClose={() => setOverlay(null)}
            />
        </SafeAreaView>
    );
}
