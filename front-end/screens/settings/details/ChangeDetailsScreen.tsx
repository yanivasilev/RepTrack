import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import BackButton from "../../../components/buttons/BackButton";
import Button from "../../../components/buttons/Button";
import { useEffect, useState } from "react";
import UnitInput from "../../../components/inputs/UnitInput";
import Selector from "../../../components/inputs/Selector";
import { SubmitChangeDetails } from "../../../components/settings/SubmitChangeDetails";
import { convertWeightToString } from "../../../libs/helpers/convertWeightToString";
import { UnitType } from "../../../libs/types/common/UnitType";
import { FITNESS_GOALS } from "../../../libs/types/common/FitnessGoals";
import { EXPERIENCE_LEVEL } from "../../../libs/types/common/ExperienceLevel";
import { TRAINING_STYLE } from "../../../libs/types/common/TrainingStyle";
import { TRAINING_FREQUENCY } from "../../../libs/types/common/TrainingFrequency";
import { ProfilesParamList } from "../../../navigation/ProfilesNavigator";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import FeedbackModal from "../../../components/FeedbackModal";
import { ChangeDetailsType } from "../../../libs/types/settings/ChangeDetailsType";
import DualSelectionInput from "../../../components/inputs/DualSelectionInput";
import { convertWeight } from "../../../libs/helpers/convertWeight";

type Props = NativeStackScreenProps<ProfilesParamList, "ChangeDetails">;

const initialChangeDetails: ChangeDetailsType = {
    weight: 0,
    weightUnitType: "METRIC",
    heightUnitType: "METRIC",
    fitnessGoal: null,
    experienceLevel: null,
    trainingStyle: null,
    trainingFrequency: null,
};

export default function ChangeDetailsScreen({ navigation }: Props) {
    const [data, setData] = useState<ChangeDetailsType>(initialChangeDetails);
    const [weightText, setWeightText] = useState("");
    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof ChangeDetailsType, string>>>({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setFetchError(null);
                await fetchDetails();
            } catch (e: any) {
                setFetchError(e?.message ?? "Failed to load details.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchDetails = async () => {
        setErrors({});
        const res = await getProfileApi();
        const nextWeightKg = res.weight ?? 0;
        const nextWeight =
            res.weightUnitType === "IMPERIAL"
                ? Math.round(convertWeight(nextWeightKg, "METRIC", "IMPERIAL"))
                : nextWeightKg;
        setWeightText(res.weight != null ? String(nextWeight) : "");
        setData((prev) => ({
            ...prev,
            weight: nextWeight,
            weightUnitType: res.weightUnitType,
            heightUnitType: res.heightUnitType,
            fitnessGoal: res.fitnessGoal,
            experienceLevel: res.experienceLevel,
            trainingStyle: res.trainingStyle,
            trainingFrequency: res.trainingFrequency,
        }));
    };

    const handleChangeDetailsPress = async () => {
        setSubmitting(true);
        setErrors({});

        const res = await SubmitChangeDetails({ data });

        setSubmitting(false);

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
    };

    if (loading) return <Loading message="Loading details..." />;

    if (fetchError) return <Error navigation={navigation} error={fetchError ?? "Something went wrong."} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    style={styles.root}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <BackButton navigation={navigation} />
                    <Text style={styles.title}>Change{"\n"}Details</Text>

                    <View style={styles.container}>
                        <ScrollView
                            style={styles.formScroll}
                            contentContainerStyle={styles.formContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <UnitInput<UnitType>
                                label="Weight"
                                text={weightText}
                                onTextChange={(val) => {
                                    const cleaned = val.replace(/[^0-9]/g, "");
                                    setWeightText(cleaned);
                                    setData((prev) => ({
                                        ...prev,
                                        weight: cleaned ? Number(cleaned) : 0,
                                    }));
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
                                    setData((prev) => ({
                                        ...prev,
                                        weight: converted ? Number(converted) : 0,
                                        weightUnitType: nextUnit,
                                    }));
                                }}
                                error={errors.weight || errors.weightUnitType}
                            />

                            <DualSelectionInput
                                label='Height Unit Type'
                                value={data.heightUnitType}
                                option='METRIC'
                                optionName="CM"
                                option2='IMPERIAL'
                                optionName2="FT"
                                onPress={(val) => setData((prev) => ({ ...prev, heightUnitType: val }))}
                                error={errors.heightUnitType}
                            />

                            <Selector
                                label="Fitness Goal"
                                options={FITNESS_GOALS}
                                value={data.fitnessGoal}
                                onSelect={(val) => setData((prev) => ({ ...prev, fitnessGoal: val }))}
                                layout="two-rows"
                                error={errors.fitnessGoal}
                            />

                            <Selector
                                label="Experience Level"
                                options={EXPERIENCE_LEVEL}
                                value={data.experienceLevel}
                                onSelect={(val) => setData((prev) => ({ ...prev, experienceLevel: val }))}
                                error={errors.experienceLevel}
                            />

                            <Selector
                                label="Training Style"
                                options={TRAINING_STYLE}
                                value={data.trainingStyle}
                                onSelect={(val) => setData((prev) => ({ ...prev, trainingStyle: val }))}
                                layout="two-rows"
                                error={errors.trainingStyle}
                            />

                            <Selector
                                label="Training Frequency"
                                options={TRAINING_FREQUENCY}
                                value={data.trainingFrequency}
                                onSelect={(val) => setData((prev) => ({ ...prev, trainingFrequency: val }))}
                                error={errors.trainingFrequency}
                            />
                        </ScrollView>

                        <View style={styles.actions}>
                            <Button label="DONE" onPress={handleChangeDetailsPress} />
                        </View>
                    </View>

                    <FeedbackModal
                        visible={Boolean(overlay) || submitting}
                        loading={submitting}
                        message={overlay?.text}
                        success={overlay?.success}
                        onClose={() => setOverlay(null)}
                    />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
