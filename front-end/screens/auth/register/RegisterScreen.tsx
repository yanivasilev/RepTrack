import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from '../../../components/buttons/Button';
import UnderlineButton from '../../../components/buttons/UnderlineButton';
import FeedbackModal from '../../../components/FeedbackModal';
import { styles } from './styles';
import RegisterForm from '../../../components/auth/register/RegisterForm';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { SubmitRegister } from '../../../components/auth/register/SubmitRegister';
import { RegisterFormType } from '../../../libs/types/auth/RegisterFormType';
import BackButton from '../../../components/buttons/BackButton';

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

// DEFUALT REGISTER DATA
const initialRegisterForm: RegisterFormType = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    dob: undefined,
    sex: null,
    height: null,
    heightUnitType: "METRIC",
    weight: null,
    weightUnitType: "METRIC",
    fitnessGoal: null,
    experienceLevel: null,
    trainingStyle: null,
    trainingFrequency: null,
};

export default function RegisterScreen({ navigation }: Props) {
    const TOTAL_STEPS = 4;
    const [step, setStep] = useState(0);
    const goToStep = (nextStep: number) => setStep(nextStep);
    const navigateStep = (nextStep: number) => {
        Keyboard.dismiss();
        goToStep(nextStep);
    };

    const [data, setData] = useState<RegisterFormType>(initialRegisterForm);

    const updateData = (fields: Partial<RegisterFormType>) => {
        setData((prev) => ({ ...prev, ...fields }));

        setErrors((prev) => {
            const next = { ...prev };
            (Object.keys(fields) as (keyof RegisterFormType)[]).forEach((k) => {
                delete next[k];
            });
            return next;
        });
    };

    // OVERLAY MESSAGE TO GIVE REGISTER API FEEDBACK
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormType, string>>>({});
    const stepErrors: Record<number, (keyof RegisterFormType)[]> = {
        0: ["email", "password", "confirmPassword"],
        1: ["username", "dob", "sex", "height", "heightUnitType", "weight", "weightUnitType"],
        2: ["fitnessGoal", "experienceLevel"],
        3: ["trainingStyle", "trainingFrequency"],
    };

    // FINDS WHICH STEP FIRST HAD AN ERROR
    const findFirstErrorStep = (errs: Partial<Record<keyof RegisterFormType, string>>): number | null => {
        for (const stepKey of Object.keys(stepErrors).map(Number).sort((a, b) => a - b)) {
            const fields = stepErrors[stepKey];
            const hasErrorOnThisStep = fields.some((f) => !!errs[f]);
            if (hasErrorOnThisStep) return stepKey;
        }

        return null;
    };

    const handleRegisterPress = async () => {
        setLoading(true);
        setErrors({});

        const email = data.email.trim().toLowerCase();

        // SUBMITS REGISTER FORM
        const res = await SubmitRegister({ data });

        setLoading(false);

        // CHECKS IF REGISTRATION IS SUCCESSFUL
        if (!res.success) {
            if (res.errors) {
                setErrors(res.errors);
                const badStep = findFirstErrorStep(res.errors);
                if (badStep !== null) goToStep(badStep);
            } else {
                setOverlay({
                    text: res.message ?? "Registration failed.",
                    success: false,
                });
            }
            return;
        }

        // SETS REGISTER FORM TO INITIAL DATA
        setData(initialRegisterForm);
        setErrors({});
        setStep(0);

        // FORWARDS TO EMAIL VERIFICATION SCREEN
        navigation.navigate("EmailVerification", {
            email,
            autoSend: false,
            noticeMessage: "Registration was successful! A verification email has been sent. Please check your inbox.",
            noticeSuccess: true,
        });
        return;
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
                        <Text style={styles.heading}>CREATE{"\n"}ACCOUNT</Text>

                        {/* CONTENT */}
                        <View style={styles.contentArea}>
                            <RegisterForm
                                totalSteps={TOTAL_STEPS}
                                step={step}
                                data={data}
                                setData={updateData}
                                errors={errors}
                            />
                        </View>
                    </View>

                    {/* BUTTONS */}
                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={{ rowGap: 15 }}>
                            {step === 0 && <UnderlineButton label="Already have a account?"
                                onPress={() => navigation.navigate("Login")}
                            />}
                            {step === 0 && <Button label="NEXT" onPress={() => navigateStep(1)} />}
                        </View>
                        {step === 1 && (
                            <View style={{ flexDirection: "row", columnGap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Button label="BACK" onPress={() => navigateStep(0)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button label="NEXT" onPress={() => navigateStep(2)} />
                                </View>
                            </View>
                        )}
                        {step === 2 && (
                            <View style={{ flexDirection: "row", columnGap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Button label="BACK" onPress={() => navigateStep(1)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button label="NEXT" onPress={() => navigateStep(3)} />
                                </View>
                            </View>
                        )}
                        {step === 3 && (
                            <View style={{ flexDirection: "row", columnGap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Button label="BACK" onPress={() => navigateStep(2)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button label="REGISTER" onPress={() => handleRegisterPress()} />
                                </View>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            <FeedbackModal
                visible={Boolean(overlay) || loading}
                loading={loading}
                loadingMessage="Creating account..."
                message={overlay?.text}
                success={overlay?.success}
                onClose={() => setOverlay(null)}
            />

            {/* PROGRESS BAR (BOTTOM OF THE SCREEN) */}
            {step !== 0 && (
                <View style={styles.progressPosition}>
                    <View style={styles.progress}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((step) / TOTAL_STEPS) * 100}%` },
                            ]}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
