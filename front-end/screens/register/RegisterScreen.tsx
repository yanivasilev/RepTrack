import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from '../../components/Button';
import UnderlineButton from '../../components/UnderlineButton';
import Banner from '../../components/Banner';
import { styles } from './styles';
import RegisterForm, { RegisterFormData } from '../../components/register/RegisterForm';
import { Errors, SubmitRegisterForm } from '../../components/register/SubmitRegisterForm';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

// DEFUALT REGISTER DATA
const initialRegisterData: RegisterFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    dob: undefined,
    sex: null,

    height: "",
    heightUnitType: "METRIC",

    weight: "",
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

    const [data, setData] = useState<RegisterFormData>(initialRegisterData);

    const updateData = (fields: Partial<RegisterFormData>) => {
        setData((prev) => ({ ...prev, ...fields }));

        setErrors((prev) => {
            const next = { ...prev };
            (Object.keys(fields) as (keyof RegisterFormData)[]).forEach((k) => {
                delete next[k];
            });
            return next;
        });
    };

    // OVERLAY MESSAGE TO GIVE REGISTER API FEEDBACK
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const stepErrors: Record<number, (keyof RegisterFormData)[]> = {
        0: ["email", "password", "confirmPassword"],
        1: ["username", "dob", "sex", "height", "heightUnitType", "weight", "weightUnitType"],
        2: ["fitnessGoal", "experienceLevel"],
        3: ["trainingStyle", "trainingFrequency"],
    };

    // FINDS WHICH STEP FIRST HAD AN ERROR
    const findFirstErrorStep = (errs: Errors): number | null => {
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

        // SUBMITS REGISTER FORM
        const res = await SubmitRegisterForm({ data });

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

        // REGISTRATION WAS SUCCESSFUL
        setOverlay({
            text: "Account created successfully!",
            success: true,
        });

        // SETS REGISTER FORM TO INITIAL DATA
        setData(initialRegisterData);
        setErrors({});
        setStep(0);

        // FORWARDS TO LOGIN SCREEN
        navigation.navigate("Login");
        return;
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                {step !== 0 && (
                    <Pressable
                        onPress={() => {
                            if (step === 1) goToStep(0);
                            else if (step === 2) goToStep(1);
                            else if (step === 3) goToStep(2);
                        }}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressed,
                        ]}
                        hitSlop={10}
                    >
                        <ArrowLeftIcon size={24} color="white" />
                    </Pressable>
                )}

                {/* BANNER */}
                <Banner />

                {/* HEADING */}
                <Text style={styles.heading}>CREATE ACCOUNT</Text>

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
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{ rowGap: 15 }}>
                    {step === 0 && <UnderlineButton label="Already have a account?"
                        onPress={() => navigation.navigate("Login")}
                    />}
                    {step === 0 && <Button label="REGISTER" onPress={() => goToStep(1)} />}
                </View>
                {step === 1 && <Button label="NEXT" onPress={() => goToStep(2)} />}
                {step === 2 && <Button label="NEXT" onPress={() => goToStep(3)} />}
                {step === 3 && <Button label="COMPLETE REGISTRATION" onPress={() => handleRegisterPress()} />}
            </View>

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