import { Animated, Dimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useRef, useState } from 'react';
import Input from '../../inputs/Input';
import DobInput from '../../inputs/DobInput';
import DualSelectionInput from '../../inputs/DualSelectionInput';
import UnitInput from '../../inputs/UnitInput';
import Selector from '../../inputs/Selector';
import { convertWeightToString } from '../../../libs/helpers/convertWeightToString';
import HeightPickerInput from '../../inputs/height-picker-input/HeightPickerInput';
import { UnitType } from '../../../libs/types/common/UnitType';
import { FITNESS_GOALS } from '../../../libs/types/common/FitnessGoals';
import { EXPERIENCE_LEVEL } from '../../../libs/types/common/ExperienceLevel';
import { TRAINING_STYLE } from '../../../libs/types/common/TrainingStyle';
import { TRAINING_FREQUENCY } from '../../../libs/types/common/TrainingFrequency';
import { RegisterFormType } from '../../../libs/types/auth/RegisterFormType';

type RegisterFormProps = {
    totalSteps: number;
    step: number;
    data: RegisterFormType;
    setData: (fields: Partial<RegisterFormType>) => void;
    errors: Partial<Record<keyof RegisterFormType, string>>;
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
    const [weightText, setWeightText] = useState("");

    useEffect(() => {
        setWeightText(data.weight != null ? String(data.weight) : "");
    }, [data.weight]);

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
                    enableAutomaticScroll={false}
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
                    enableAutomaticScroll={false}
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
                            label="Weight"
                            text={weightText}
                            onTextChange={(val) => {
                                const cleaned = val.replace(/[^0-9]/g, "");
                                setWeightText(cleaned);
                                setData({ weight: cleaned ? Number(cleaned) : null });
                            }}
                            placeholder="Enter weight"
                            unit={data.weightUnitType}
                            unit1="METRIC"
                            unit2="IMPERIAL"
                            unit1Label="KG"
                            unit2Label="LB"
                            onUnitChange={(nextUnit) => {
                                const converted = convertWeightToString(weightText, data.weightUnitType, nextUnit);
                                setWeightText(converted);
                                setData({
                                    weight: converted ? Number(converted) : null,
                                    weightUnitType: nextUnit,
                                });
                            }}
                            error={errors.weight || errors.weightUnitType}
                        />

                        <HeightPickerInput
                            label="Height"
                            value={data.height}
                            onChange={(cm) => setData({ height: cm })}
                            unit={data.heightUnitType}
                            onUnitChange={(u) => setData({ heightUnitType: u })}
                            error={errors.height || errors.heightUnitType}
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
