import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackButton from "../../../components/buttons/BackButton";
import FeedbackModal from "../../../components/FeedbackModal";
import Button from "../../../components/buttons/Button";
import UnderlineButton from "../../../components/buttons/UnderlineButton";
import Input from "../../../components/inputs/Input";
import OtpInput from "../../../components/inputs/OtpInput";
import { AuthStackParamList } from "../../../navigation/AuthNavigator";
import { SubmitEmailVerification } from "../../../components/auth/email-verification/SubmitEmailVerification";
import { SubmitEmailVerificationVerifyOtp } from "../../../components/auth/email-verification/SubmitEmailVerificationVerifyOtp";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

type EmailVerificationFormType = {
    email: string;
    otp: string;
};

const initialData: EmailVerificationFormType = {
    email: "",
    otp: "",
};

export default function EmailVerificationScreen({ navigation, route }: Props) {
    const [data, setData] = useState<EmailVerificationFormType>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof EmailVerificationFormType, string>>>({});
    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    const label = step === 0 ? "SEND VERIFICATION CODE" : "VERIFY EMAIL";

    const onChange = (key: keyof EmailVerificationFormType, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSendCode = async (emailOverride?: string) => {
        const email = (emailOverride ?? data.email).trim().toLowerCase();

        setLoading(true);
        setErrors({});

        const res = await SubmitEmailVerification({ data: { email } });
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
            return false;
        }

        onChange("email", email);
        setOverlay({
            text: res.message,
            success: true,
        });
        setStep(1);
        return true;
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setErrors({});

        const res = await SubmitEmailVerificationVerifyOtp({
            data: {
                email: data.email.trim().toLowerCase(),
                otp: data.otp,
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
    };

    const handlePrimaryPress = async () => {
        if (step === 0) {
            await handleSendCode();
            return;
        }

        await handleVerifyOtp();
    };

    const paramEmail = route.params?.email;
    const paramAutoSend = route.params?.autoSend;
    const paramNoticeMessage = route.params?.noticeMessage;
    const paramNoticeSuccess = route.params?.noticeSuccess;

    useEffect(() => {
        const email = paramEmail?.trim().toLowerCase();
        if (!email) return;

        onChange("email", email);
        setStep(1);

        if (paramNoticeMessage) {
            setOverlay({
                text: paramNoticeMessage,
                success: paramNoticeSuccess ?? true,
            });
        }

        if (paramAutoSend) {
            void handleSendCode(email);
        }
    }, [paramAutoSend, paramEmail, paramNoticeMessage, paramNoticeSuccess]);

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

                        <Text style={styles.heading}>VERIFY{"\n"}EMAIL</Text>

                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableAutomaticScroll={false}
                            enableOnAndroid
                            contentContainerStyle={{ gap: 15 }}
                        >
                            <View style={styles.content}>
                                <Text style={styles.helperText}>
                                    Enter your email and verify the code sent to your inbox.
                                </Text>

                                {step === 0 && (
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

                                {step === 1 && (
                                    <>
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
                                    </>
                                )}
                            </View>
                        </KeyboardAwareScrollView>
                    </View>

                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={styles.buttonGroup}>
                            {step === 1 && (
                                <>
                                    <UnderlineButton
                                        label="Resend code"
                                        onPress={() => void handleSendCode()}
                                    />
                                    <UnderlineButton
                                        label="Use another email"
                                        onPress={() => {
                                            setStep(0);
                                            onChange("otp", "");
                                            setErrors({});
                                        }}
                                    />
                                </>
                            )}

                            <Button label={label} onPress={handlePrimaryPress} />
                        </View>
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
