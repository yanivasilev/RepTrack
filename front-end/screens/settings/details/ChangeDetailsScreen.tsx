import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/AppNavigator";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Keyboard, Modal, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { profileDetailsApi } from "../../../services/api/profileDetailsApi";
import { EXPERIENCE_LEVEL, ExperienceLevel, FITNESS_GOALS, FitnessGoal, TRAINING_FREQUENCY, TRAINING_STYLE, TrainingFrequency, TrainingStyle, UnitType } from "../../../libs/catalogs/register";
import UnitInput from "../../../components/UnitInput";
import Selector from "../../../components/Selector";
import { SubmitChangeDetails } from "../../../components/settings/SubmitChangeDetails";
import { convertWeightString } from "../../../libs/helpers/convertWeight";

type Props = NativeStackScreenProps<AppStackParamList, "ChangeDetails">;

type ChangeDetailsData = {
    weight: string;
    weightUnitType: UnitType;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    trainingStyle: TrainingStyle | null;
    trainingFrequency: TrainingFrequency | null;
};

const initialChangeDetailsData: ChangeDetailsData = {
    weight: "",
    weightUnitType: "METRIC",
    fitnessGoal: null,
    experienceLevel: null,
    trainingStyle: null,
    trainingFrequency: null,
};

export default function ChangeDetailsScreen({ navigation }: Props) {
    const [data, setData] = useState(initialChangeDetailsData);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ChangeDetailsData, string>>>({});

    const modalVisible = loading || overlay != null;

    const onChange = <K extends keyof ChangeDetailsData>(key: K, value: ChangeDetailsData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await fetchDetails();
            } catch (e: any) {
                setOverlay({
                    text: e?.message ?? "Failed to load details.",
                    success: false,
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchDetails = async () => {
        setErrors({});
        const res = await profileDetailsApi();
        setData(prev => ({
            ...prev,
            weight: res.weight != null ? String(res.weight) : "",
            weightUnitType: res.weightUnitType,
            fitnessGoal: res.fitnessGoal,
            experienceLevel: res.experienceLevel,
            trainingStyle: res.trainingStyle,
            trainingFrequency: res.trainingFrequency,
        }));
    };


    const handleChangeDetailsPress = async () => {
        setLoading(true);
        setErrors({});

        const res = await SubmitChangeDetails({ data });
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
        return;
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.root}>
                    <BackButton navigation={navigation} />
                    <Text style={styles.title}>Change{"\n"}Details</Text>

                    <View style={styles.container}>
                        <View style={{ gap: 10 }}>
                            <UnitInput<UnitType>
                                label="Weight"
                                text={data.weight}
                                onTextChange={(val) => {
                                    const cleaned = val.replace(/[^0-9]/g, "");

                                    setData(prev => ({ ...prev, weight: cleaned }));
                                }}
                                placeholder="Enter weight"
                                unit={data.weightUnitType}
                                unit1="METRIC"
                                unit2="IMPERIAL"
                                unit1Label="KG"
                                unit2Label="LB"
                                onUnitChange={(nextUnit) => {
                                    setData(prev => ({
                                        ...prev,
                                        weight: convertWeightString(prev.weight, prev.weightUnitType, nextUnit),
                                        weightUnitType: nextUnit,
                                    }));
                                }}
                                error={errors.weight || errors.weightUnitType}
                            />

                            <Selector
                                label="Fitness Goal"
                                options={FITNESS_GOALS}
                                value={data.fitnessGoal}
                                onSelect={(val) => setData(prev => ({ ...prev, fitnessGoal: val }))}
                                layout="two-rows"
                                error={errors.fitnessGoal}
                            />

                            <Selector
                                label='Experience Level'
                                options={EXPERIENCE_LEVEL}
                                value={data.experienceLevel}
                                onSelect={(val) => setData(prev => ({ ...prev, experienceLevel: val }))}
                                error={errors.experienceLevel}
                            />

                            <Selector
                                label='Training Style'
                                options={TRAINING_STYLE}
                                value={data.trainingStyle}
                                onSelect={(val) => setData(prev => ({ ...prev, trainingStyle: val }))}
                                layout='two-rows'
                                error={errors.trainingStyle}
                            />

                            <Selector
                                label='Training Frequency'
                                options={TRAINING_FREQUENCY}
                                value={data.trainingFrequency}
                                onSelect={(val) => setData(prev => ({ ...prev, trainingFrequency: val }))}
                                error={errors.trainingFrequency}
                            />
                        </View>

                        <Button label="DONE" onPress={handleChangeDetailsPress} />
                    </View>
                </View>

                {/* FEEDBACK MESSAGE */}
                {(overlay || loading) && (
                    <Modal
                        visible={modalVisible}
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
        </TouchableWithoutFeedback>
    );
}