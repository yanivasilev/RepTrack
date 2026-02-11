import { Animated, Dimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useRef, useState } from 'react';
import { EXPERIENCE_LEVEL, FITNESS_GOALS, TRAINING_FREQUENCY, TRAINING_STYLE, UNIT_TYPE, UnitType } from '../../libs/catalogs/register';
import Input from '../Input';
import DobInput from '../DobInput';
import DualSelectionInput from '../DualSelectionInput';
import UnitInput from '../UnitInput';
import Selector from '../Selector';
import { Errors } from './SubmitRegisterForm';

export type RegisterFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    dob?: Date;
    sex: "MALE" | "FEMALE" | null;
    height: string;
    heightUnitType: typeof UNIT_TYPE[number]["value"] | null;
    weight: string;
    weightUnitType: typeof UNIT_TYPE[number]["value"] | null;
    fitnessGoal: typeof FITNESS_GOALS[number]["value"] | null;
    experienceLevel: typeof EXPERIENCE_LEVEL[number]["value"] | null;
    trainingStyle: typeof TRAINING_STYLE[number]["value"] | null;
    trainingFrequency: typeof TRAINING_FREQUENCY[number]["value"] | null;
};

type RegisterFormProps = {
    totalSteps: number;
    step: number;
    data: RegisterFormData;
    setData: (fields: Partial<RegisterFormData>) => void;
    errors: Errors;
}

const CONTENT_WIDTH = Dimensions.get("window").width - 80;

export default function RegisterForm({ totalSteps, step, data, setData, errors }: RegisterFormProps) {
    const x = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(x, {
            toValue: -step * CONTENT_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [step, x]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <View style={{ width: CONTENT_WIDTH, overflow: "hidden", alignSelf: "center" }}>
            <Animated.View
                style={{
                    flexDirection: "row",
                    width: CONTENT_WIDTH * totalSteps,
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
                            label="Email"
                            value={data.email}
                            onChangeText={(val) => setData({ email: val })}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            autoComplete="email"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            value={data.password}
                            onChangeText={(val) => setData({ password: val })}
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
                            onChangeText={(val) => setData({ confirmPassword: val })}
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
                            value={data.username}
                            onChangeText={(val) => setData({ username: val })}
                            placeholder='Enter username'
                            error={errors.username}
                        />

                        <DobInput
                            label='Date of Birth'
                            value={data.dob}
                            onChange={(val) => setData({ dob: val })}
                            error={errors.dob}
                        />

                        <DualSelectionInput
                            label='Sex'
                            value={data.sex}
                            option='MALE'
                            option2='FEMALE'
                            onPress={(val) => setData({ sex: val })}
                            error={errors.sex}
                        />

                        <UnitInput<UnitType>
                            label="Height"
                            text={data.height}
                            onTextChange={(val) => {
                                const cleaned = val
                                    .replace(/,/g, ".")
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1");

                                setData({ height: cleaned });
                            }}
                            placeholder="Enter height"
                            unit={data.heightUnitType}
                            unit1="METRIC"
                            unit2="IMPERIAL"
                            unit1Label="M"
                            unit2Label="FT"
                            onUnitChange={(val) => setData({ heightUnitType: val })}
                            error={errors.height || errors.heightUnitType}
                        />

                        <UnitInput<UnitType>
                            label="Weight"
                            text={data.weight}
                            onTextChange={(val) => {
                                const cleaned = val
                                    .replace(/,/g, ".")
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1");

                                setData({ weight: cleaned });
                            }}
                            placeholder="Enter weight"
                            unit={data.weightUnitType}
                            unit1="METRIC"
                            unit2="IMPERIAL"
                            unit1Label="KG"
                            unit2Label="LB"
                            onUnitChange={(val) => setData({ weightUnitType: val })}
                            error={errors.weight || errors.weightUnitType}
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
                            value={data.fitnessGoal}
                            onSelect={(val) => setData({ fitnessGoal: val })}
                            layout="two-rows"
                            error={errors.fitnessGoal}
                        />

                        <Selector
                            label='Experience Level'
                            options={EXPERIENCE_LEVEL}
                            value={data.experienceLevel}
                            onSelect={(val) => setData({ experienceLevel: val })}
                            error={errors.experienceLevel}
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
                            value={data.trainingStyle}
                            onSelect={(val) => setData({ trainingStyle: val })}
                            layout='two-rows'
                            error={errors.trainingStyle}
                        />

                        <Selector
                            label='Training Frequency'
                            options={TRAINING_FREQUENCY}
                            value={data.trainingFrequency}
                            onSelect={(val) => setData({ trainingFrequency: val })}
                            error={errors.trainingFrequency}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </Animated.View>
        </View>
    );
}