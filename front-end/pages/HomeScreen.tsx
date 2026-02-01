import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Input from '../components/Input';
import Button from '../components/Button';
import DualSelectionInput from '../components/DualSelectionInput';
import UnitInput from '../components/UnitInput';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UnderlineButton from '../components/UnderlineButton';
import Selector from '../components/Selector';
import DobInput from '../components/DobInput';

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const CONTENT_WIDTH = Dimensions.get("window").width - 80;

export default function HomeScreen({ navigation }: Props) {
    const total_steps = 4;
    const [step, setStep] = useState(0);
    const x = useRef(new Animated.Value(0)).current;

    const goTo = (nextStep: number) => {
        setStep(nextStep);
        Animated.timing(x, {
            toValue: -nextStep * CONTENT_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    {/* STEP 0 */ }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    {/* STEP 1 */ }
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState<Date>(new Date(2002, 4, 10));
    const [sex, setSex] = useState<"MALE" | "FEMALE" | null>(null);
    const [height, setHeight] = useState("");
    const [heightUnit, setHeightUnit] = useState<"metric" | "imperial">("metric");
    const [weight, setWeight] = useState("");
    const [weightUnit, setWeightUnit] = useState<"metric" | "imperial">("metric");

    {/* STEP 2 */ }
    const FITNESS_GOALS = [
        "GAIN STRENGTH",
        "IMPROVE TECHNIQUE",
        "GENERAL FITNESS",
        "BUILD MUSCLE",
        "LOSE WEIGHT",
    ] as const;
    type FitnessGoal = typeof FITNESS_GOALS[number];
    const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);

    const EXPERIENCE_LEVEL = [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
    ] as const;
    type ExperienceLevelType = typeof EXPERIENCE_LEVEL[number];
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevelType | null>(null);

    {/* STEP 3 */ }
    const TRAINING_STYLE = [
        "WEIGHT LIFTING",
        "POWER LIFTING",
        "BODY BUILDING",
        "BODYWEIGHT TRAINING",
        "HOME  WORKOUTS",
    ] as const;
    type TrainingStyle = typeof TRAINING_STYLE[number];
    const [trainingStyle, setTrainingStyle] = useState<TrainingStyle | null>(null);

    const TRAINING_FREQUENCY = [
        "1-2 DAYS",
        "2-3 DAYS",
        "5+ DAYS",
    ] as const;
    type TrainingFrequency = typeof TRAINING_FREQUENCY[number];
    const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency | null>(null);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                {step !== 0 && (
                    <Pressable
                        onPress={() => {
                            if (step === 1) goTo(0);
                            else if (step === 2) goTo(1);
                            else if (step === 3) goTo(2);
                        }}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressed,
                        ]}
                        hitSlop={10}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>
                )}

                {/* TOP SECTION */}
                <View style={styles.topSection} >
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                    />

                    <View>
                        <Text style={styles.title}>
                            <Text style={styles.rep}>Rep</Text>
                            <Text style={styles.track}>Track</Text>
                        </Text>
                        <Text style={styles.subtitle}>Perfect your form, get stronger, one session at a time. Your smarter workout starts here</Text>
                    </View>
                </View>

                <Text style={styles.heading}>CREATE ACCOUNT</Text>

                {/* CONTENT */}
                <View style={styles.contentArea}>
                    <View style={{ width: CONTENT_WIDTH, overflow: "hidden", alignSelf: "center" }}>
                        <Animated.View
                            style={{
                                flexDirection: "row",
                                width: CONTENT_WIDTH * total_steps,
                                transform: [{ translateX: x }],
                            }}
                        >
                            {/* STEP 0 */}

                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                enableAutomaticScroll
                                enableOnAndroid
                            >
                                <View style={{ width: CONTENT_WIDTH, rowGap: 15 }}>
                                    <Input
                                        label='Email'
                                        value={email}
                                        onTextChange={setEmail}
                                        placeholder='Enter email'
                                    />

                                    <Input
                                        label='Password'
                                        value={password}
                                        onTextChange={setPassword}
                                        placeholder='Enter password'
                                    />

                                    <Input
                                        label='Confirm Password'
                                        value={rePassword}
                                        onTextChange={setRePassword}
                                        placeholder='Enter password'
                                    />
                                </View>
                            </KeyboardAwareScrollView>

                            {/* STEP 1 */}
                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                enableAutomaticScroll
                                enableOnAndroid
                            >
                                <View style={{ width: CONTENT_WIDTH, rowGap: 15 }}>

                                    <Input
                                        label='Username'
                                        value={username}
                                        onTextChange={setUsername}
                                        placeholder='Enter username'
                                    />

                                    <DobInput
                                        label='Date of Birth'
                                        value={dob}
                                        onChange={setDob}
                                    />

                                    <DualSelectionInput
                                        label='Sex'
                                        value={sex}
                                        option='MALE'
                                        option2='FEMALE'
                                        onPress={setSex}
                                    />

                                    <UnitInput<"metric" | "imperial">
                                        label="Height"
                                        text={height}
                                        onTextChange={setHeight}
                                        placeholder="Enter height"
                                        unit={heightUnit}
                                        unit1="metric"
                                        unit2="imperial"
                                        unit1Label="M"
                                        unit2Label="FT"
                                        onUnitChange={setHeightUnit}
                                    />

                                    <UnitInput<"metric" | "imperial">
                                        label="Weight"
                                        text={weight}
                                        onTextChange={setWeight}
                                        placeholder="Enter weight"
                                        unit={weightUnit}
                                        unit1="metric"
                                        unit2="imperial"
                                        unit1Label="KG"
                                        unit2Label="LB"
                                        onUnitChange={setWeightUnit}
                                    />
                                </View>
                            </KeyboardAwareScrollView>

                            {/* STEP 2 */}

                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                enableAutomaticScroll
                                enableOnAndroid
                            >
                                <View style={{ width: CONTENT_WIDTH, rowGap: 15 }}>
                                    <Selector
                                        label="Fitness Goal"
                                        options={FITNESS_GOALS}
                                        value={fitnessGoal}
                                        onSelect={setFitnessGoal}
                                        layout="two-rows"
                                    />

                                    <Selector
                                        label='Experience Level'
                                        options={EXPERIENCE_LEVEL}
                                        value={experienceLevel}
                                        onSelect={setExperienceLevel}
                                    />
                                </View>
                            </KeyboardAwareScrollView>

                            {/* STEP 3 */}
                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                enableAutomaticScroll
                                enableOnAndroid
                            >
                                <View style={{ width: CONTENT_WIDTH, rowGap: 15 }}>
                                    <Selector
                                        label='Training Style'
                                        options={TRAINING_STYLE}
                                        value={trainingStyle}
                                        onSelect={setTrainingStyle}
                                        layout='two-rows'
                                    />

                                    <Selector
                                        label='Training Frequency'
                                        options={TRAINING_FREQUENCY}
                                        value={trainingFrequency}
                                        onSelect={setTrainingFrequency}
                                    />
                                </View>
                            </KeyboardAwareScrollView>
                        </Animated.View>
                    </View>
                </View>
            </View>

            {/* BUTTONS */}
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{ rowGap: 15 }}>
                    {step === 0 && <UnderlineButton label="Already have a account?" onPress={() => navigation.navigate("Login")} />}
                    {step === 0 && <Button label="REGISTER" onPress={() => goTo(1)} />}
                </View>
                {step === 1 && <Button label="NEXT" onPress={() => goTo(2)} />}
                {step === 2 && <Button label="NEXT" onPress={() => goTo(3)} />}
                {step === 3 && <Button label="COMPLETE REGISTRATION" onPress={() => console.log("PRESSED: COMPLETE REGISTRATION!")} />}
            </View>

            {step !== 0 && (
                <View style={styles.progressPosition}>
                    <View style={styles.progress}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((step) / total_steps) * 100}%` },
                            ]}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topSection: {
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "green",
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    contentArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
    },
    rep: {
        color: "gray",
    },
    track: {
        color: "green",
    },
    subtitle: {
        color: "green",
        textAlign: "center",
        marginBottom: 24,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
        marginBottom: 24,
    },
    login: {
        color: "green",
        textDecorationLine: "underline",
        textAlign: "center",
    },
    progressPosition: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    progress: {
        height: 10,
        backgroundColor: "#e0e0e0",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "green",
    },
    pressed: {
        backgroundColor: "darkgreen"
    }
});
