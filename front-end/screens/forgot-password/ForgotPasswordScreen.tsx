import { View, Text, ActivityIndicator, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { styles } from "./styles";
import Banner from "../../components/Banner";
import BackButton from "../../components/BackButton";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import OtpInput from "../../components/OtpInput";
import { SubmitForgotPasswordVerifyOtp } from "../../components/forgot-password/SubmitForgotPasswordVerifyOtp"
import { SubmitForgotPasswordReset } from "../../components/forgot-password/SubmitForgotPasswordReset";
import { SubmitForgotPassword } from "../../components/forgot-password/SubmitForgotPassword";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

type ForgotPasswordData = {
    email: string;
    otp: string;
    token: string;
    password: string;
    confirmPassword: string;
};

const initialForgotPasswordData: ForgotPasswordData = {
    email: "",
    otp: "",
    token: "",
    password: "",
    confirmPassword: "",
};

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordData, string>>>({});
    const [data, setData] = useState(initialForgotPasswordData);

    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const label = step === 0 ? "SEND RESET CODE" : step === 1 ? "VERIFY CODE" : "RESET PASSWORD";

    const onChange = (key: keyof ForgotPasswordData, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleForgotPasswordPress = async () => {
        setLoading(true);
        setErrors({});

        {/* STEP 0 - SEND OTP CODE */ }
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

        {/* STEP 1 - VERIFY OTP CODE */ }
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

        {/* STEP 2 - RESET PASSWORD */ }
        if (step === 2) {
            const res = await SubmitForgotPasswordReset({
                data: {
                    email: data.email,
                    token: data.token,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                }
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
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <BackButton navigation={navigation} />

                {/* BANNER */}
                <Banner />

                {/* HEADING */}
                <Text style={styles.heading}>FORGOT PASSWORD</Text>

                {/* CONTENT */}
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableAutomaticScroll
                    enableOnAndroid
                    contentContainerStyle={{ gap: 15 }}
                >
                    <View style={styles.content}>
                        <Text style={{ textAlign: "center", color: "gray" }}>Enter your email and we'll send you a verification code to reset your password.</Text>

                        {/* STEP 0 - SEND OTP CODE */}
                        {step == 0 && (
                            <Input
                                label='Email'
                                value={data.email}
                                onChangeText={(v) => {
                                    onChange("email", v)
                                    setErrors({})
                                }}
                                placeholder='Enter email'
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="emailAddress"
                                autoComplete="email"
                                importantForAutofill="yes"
                                error={errors.email}
                            />
                        )}

                        {/* STEP 1 - VERIFY OTP CODE */}
                        {step == 1 && (
                            <OtpInput
                                label="OTP"
                                value={data.otp}
                                onChange={(v) => {
                                    onChange("otp", v)
                                    setErrors({})
                                }}
                                error={errors.otp}
                                onClear={() => setErrors({})}
                            />
                        )}

                        {/* STEP 2 - RESET PASSWORD */}
                        {step == 2 && (
                            <View style={{ gap: 10 }}>
                                <Input
                                    label="Password"
                                    value={data.password}
                                    onChangeText={(v) => {
                                        onChange("password", v)
                                        setErrors({})
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
                                        onChange("confirmPassword", v)
                                        setErrors({})
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

            {/* BUTTONS */}
            <View style={{ paddingHorizontal: 30, rowGap: 15 }}>
                <Button
                    label={label}
                    onPress={handleForgotPasswordPress}
                />
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
                                    ]}
                                >
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