import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import FeedbackModal from "../../../components/FeedbackModal";
import { styles } from "./styles";
import BackButton from "../../../components/buttons/BackButton";
import { AuthStackParamList } from "../../../navigation/AuthNavigator";
import OtpInput from "../../../components/inputs/OtpInput";
import { SubmitForgotPasswordVerifyOtp } from "../../../components/auth/forgot-password/SubmitForgotPasswordVerifyOtp";
import { SubmitForgotPasswordReset } from "../../../components/auth/forgot-password/SubmitForgotPasswordReset";
import { SubmitForgotPassword } from "../../../components/auth/forgot-password/SubmitForgotPassword";
import { ForgotPasswordType } from "../../../libs/types/auth/forgot-password/ForgotPasswordType";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

const initialForgotPassword: ForgotPasswordType = {
    email: "",
    otp: "",
    token: "",
    password: "",
    confirmPassword: "",
};

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordType, string>>>({});
    const [data, setData] = useState(initialForgotPassword);

    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const label = step === 0 ? "SEND RESET CODE" : step === 1 ? "VERIFY CODE" : "RESET PASSWORD";

    const onChange = (key: keyof ForgotPasswordType, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleForgotPasswordPress = async () => {
        setLoading(true);
        setErrors({});

        if (step === 0) {
            const res = await SubmitForgotPassword({ data: { email: data.email } });

            setLoading(false);

            if (!res.success) {
                if (!res.errors) {
                    setOverlay({
                        text: res.message,
                        success: false,
                    });
                } else {
                    setErrors(res.errors ?? {});
                }
                return;
            }

            setOverlay({
                text: res.message,
                success: true,
            });
            setStep(1);
            return;
        }

        if (step === 1) {
            const res = await SubmitForgotPasswordVerifyOtp({ data: { email: data.email, otp: data.otp } });

            setLoading(false);

            if (!res.success) {
                if (!res.errors) {
                    setOverlay({
                        text: res.message,
                        success: false,
                    });
                } else {
                    setErrors(res.errors ?? {});
                }
                return;
            }

            setOverlay({
                text: res.message,
                success: true,
            });
            onChange("token", res.token);
            setStep(2);
            return;
        }

        if (step === 2) {
            const res = await SubmitForgotPasswordReset({
                data: {
                    email: data.email,
                    token: data.token,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
            });

            setLoading(false);

            if (!res.success) {
                if (!res.errors) {
                    setOverlay({
                        text: res.message,
                        success: false,
                    });
                } else {
                    setErrors(res.errors ?? {});
                }
                return;
            }

            setOverlay({
                text: res.message,
                success: true,
            });

            navigation.navigate("Login");
            return;
        }
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
                        <BackButton navigation={navigation} />

                        <Text style={styles.heading}>FORGOT{"\n"}PASSWORD</Text>

                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableAutomaticScroll={false}
                            enableOnAndroid
                            contentContainerStyle={{ gap: 15 }}
                        >
                            <View style={styles.content}>
                                <Text style={{ textAlign: "center", color: "gray" }}>
                                    Enter your email and we'll send you a verification code to reset your password.
                                </Text>

                                {step == 0 && (
                                    <Input
                                        label="Email"
                                        value={data.email}
                                        onChangeText={(v) => {
                                            onChange("email", v);
                                            setErrors({});
                                        }}
                                        placeholder="Enter email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="emailAddress"
                                        autoComplete="email"
                                        importantForAutofill="yes"
                                        error={errors.email}
                                    />
                                )}

                                {step == 1 && (
                                    <OtpInput
                                        label="OTP"
                                        value={data.otp}
                                        onChange={(v) => {
                                            onChange("otp", v);
                                            setErrors({});
                                        }}
                                        error={errors.otp}
                                        onClear={() => setErrors({})}
                                    />
                                )}

                                {step == 2 && (
                                    <View style={{ gap: 10 }}>
                                        <Input
                                            label="Password"
                                            value={data.password}
                                            onChangeText={(v) => {
                                                onChange("password", v);
                                                setErrors({});
                                            }}
                                            secureTextEntry={!showPassword}
                                            placeholder="Enter password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            textContentType="newPassword"
                                            autoComplete="new-password"
                                            error={errors.password}
                                            rightIcon={showPassword ? "eye-off" : "eye"}
                                            onRightIconPress={() => setShowPassword((p) => !p)}
                                        />

                                        <Input
                                            label="Confirm Password"
                                            value={data.confirmPassword}
                                            onChangeText={(v) => {
                                                onChange("confirmPassword", v);
                                                setErrors({});
                                            }}
                                            secureTextEntry={!showConfirmPassword}
                                            placeholder="Enter confirm password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            textContentType="newPassword"
                                            autoComplete="new-password"
                                            error={errors.confirmPassword}
                                            rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                                            onRightIconPress={() => setShowConfirmPassword((p) => !p)}
                                        />
                                    </View>
                                )}
                            </View>
                        </KeyboardAwareScrollView>
                    </View>

                    <View style={{ paddingHorizontal: 16, rowGap: 15 }}>
                        <Button label={label} onPress={handleForgotPasswordPress} />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            <FeedbackModal
                visible={Boolean(overlay) || loading}
                loading={loading}
                message={overlay?.text}
                success={overlay?.success}
                onClose={() => setOverlay(null)}
            />
        </SafeAreaView>
    );
}
