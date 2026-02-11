import { View, ActivityIndicator, Text, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useCallback, useState } from "react";
import { styles } from "./styles";
import ProfileDetails from "../../components/profile/ProfileDetails";
import SettingsButton from "../../components/SettingsButton";
import { AppTabParamList } from "../../navigation/TabNavigator";
import { useFocusEffect } from "@react-navigation/native";
import { profileDetailsApi } from "../../services/api/profileDetailsApi";
import { fitnessGoalToLabel } from "../../libs/helpers/fitnessGoalToLabel";
import { FitnessGoal, UnitType } from "../../libs/catalogs/register";

type Props = BottomTabScreenProps<AppTabParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);

    const [data, setData] = useState<null | {
        username: string;
        age: number;
        fitnessGoal: FitnessGoal;
        weight: number;
        avatarUrl: string;
        heightUnitType: UnitType;
        weightUnitType: UnitType;
    }>(null);

    const overlayButtonText = !data ? "GO TO MAIN" : "CLOSE";

    const fetchProfileDetails = async () => {
        const res = await profileDetailsApi();
        setData({ ...res });
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;

            (async () => {
                try {
                    setLoading(true);
                    setOverlay(null);
                    await fetchProfileDetails();
                } catch (e: any) {
                    if (!mounted) return;

                    if (!data) {
                        setOverlay({ text: "No user data.", success: false });
                    } else {
                        setOverlay({ text: e?.message ?? "Failed to load details.", success: false });
                    }
                } finally {
                    if (mounted) setLoading(false); setLoading(false);
                }
            })();

            return () => {
                mounted = false;
            };
        }, [])
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>
                {data && (
                    <View>
                        <SettingsButton />

                        <ProfileDetails
                            avatarUrl={data.avatarUrl}
                            username={data.username}
                            age={data.age}
                            goal={fitnessGoalToLabel(data.fitnessGoal)}
                            weight={data.weight}
                            weightUnitType={data.weightUnitType}
                        />
                    </View>
                )}

                {/* MODAL FEEDBACK */}
                {(loading || overlay) && (
                    <Modal
                        visible
                        transparent
                        animationType="fade"
                        onRequestClose={() => setOverlay(null)} // ANDROID BACK BUTTON
                    >
                        <View style={styles.overlay}>
                            <View style={!loading && styles.box}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#22c55e" />
                                ) : (
                                    <>
                                        <Text style={[styles.text, { color: "red" }]}>
                                            {overlay?.text}
                                        </Text>

                                        <Pressable
                                            onPress={() => {
                                                if (!data) {
                                                    setOverlay(null);
                                                    navigation.navigate("Main");
                                                } else {
                                                    setOverlay(null);
                                                }
                                            }}
                                            style={({ pressed }) => [
                                                styles.closeButton,
                                                pressed && styles.closeButtonPressed,
                                            ]}
                                        >
                                            <Text style={styles.closeText}>{overlayButtonText}</Text>
                                        </Pressable>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </SafeAreaView >
    );
}
